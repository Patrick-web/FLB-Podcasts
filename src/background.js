"use strict";

import { app, protocol, BrowserWindow, ipcMain } from "electron";
import {
  createProtocol,
  installVueDevtools,
} from "vue-cli-plugin-electron-builder/lib";
import * as path from "path";
import * as mm from "music-metadata";
import * as defaultImage from "./scripts/Defaults.js";

const fs = require("fs");
const musicFolder = require("path").join(require("os").homedir(), "Music");
var podDir = path.join(musicFolder, "fpodcasts");

if (!fs.existsSync(podDir)) {
  fs.mkdirSync(podDir);
}

const { download } = require("electron-dl");

let win;

const isDevelopment = process.env.NODE_ENV !== "production";

protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);
const defaultPoster = path.join(__static, "icon.png");
console.log(defaultPoster);
function createWindow() {
  win = new BrowserWindow({
    width: 1100,
    height: 650,
    title: "FLB Podcasts",
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      webviewTag: true,
    },
    autoHideMenuBar: true,
    icon: path.join(__static, "icon.png"),
    minWidth: 800,
  });
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    //if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    win.loadURL("app://./index.html");
  }
  win.center();
  win.maximize();

  win.on("closed", () => {
    win = null;
  });
  win.webContents.on("new-window", function(e, url) {
    e.preventDefault();
    require("electron").shell.openExternal(url);
  });
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});

app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installVueDevtools();
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

ipcMain.on("download", (event, info, episode) => {
  info.properties.directory = podDir;
  info.properties.onProgress = (status) =>
    win.webContents.send("download progress", status.percent);
  download(BrowserWindow.getFocusedWindow(), info.url, info.properties).then(
    (dl) => {
      episode.audio = dl.getSavePath();
      win.webContents.send("download complete", episode);
    }
  );
});
ipcMain.on("parseAudioFiles", (event, episodes) => {
  const parsedEpisodes = [];
  episodes.forEach((episode, index) => {
    if (fs.existsSync(episode.audio)) {
      mm.parseFile(episode.audio).then((data) => {
        const picData = mm.selectCover(data.common.picture);
        if (picData) {
          episode.thumbnail = `data:${
            picData.format
          };base64,${picData.data.toString("base64")}`;
        } else {
          // console.log(defaultImage.default);
          // let picbuffer = JSON.stringify(defaultImage).replace(/}/,'');
          //  picbuffer = picbuffer.replace(/{/,'');
          //  picbuffer = picbuffer.replace(/default/,'');
          //  console.log(picbuffer);
          episode.thumbnail = `data:image/png;base64,${defaultImage.default}`;
        }
        parsedEpisodes.push(episode);
        win.webContents.send("downloadedEpisodes", parsedEpisodes);
      });
    } else {
      win.webContents.send("clearFromDB", episode.audio);
    }
  });
});

//todo: code to remove data for audio file which no longer exists
