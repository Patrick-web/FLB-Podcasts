<template>
  <div class="wrapper">
    <webview
      style="min-height: 85vh;display:none"
      src="https://google.com"
      useragent="My Super Browser v1.0 Youpi Tralala !"
    >
    </webview>
    <Profile />
    <Podcasts />
  </div>
</template>
<script>
import Podcasts from "@/views/PodcastPlayer.vue";
import Profile from "@/components/Profile.vue";
import * as cheerio from "cheerio";
import * as podcastParser from "podcast-feed-parser";
import { ipcRenderer } from "electron";

export default {
  components: {
    Podcasts,
    Profile,
  },
  mounted() {
    setTimeout(() => {
      if (!navigator.onLine) {
        alert("You do not have an internet connection");
      }
    }, 2000);
    ipcRenderer.on("clearFromDB", (e, toRemove) => {
      const currentlyInDB = JSON.parse(localStorage.getItem("downloaded"));
      currentlyInDB.forEach((pod, index) => {
        if (pod.audio == toRemove) {
          currentlyInDB.splice(index, 1);
          localStorage.setItem("downloaded", JSON.stringify(currentlyInDB));
        }
      });
    });
    window.addEventListener("offline", () => {
      console.log("Fooline");
      alert("Your internet connection was lost");
    });
  },
};
</script>
<style lang="scss">
@import "./assets/animate.css";
@import "../node_modules/typeface-roboto/index.css";
@import "./assets/theme/theme.css";

* {
  margin: 0;
  padding: 0;
  font-family: "Roboto";
}
a {
  color: white;
  // pointer-events: none;
}
body {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: black;
}
#logo {
  position: fixed;
  width: 40px;
  top: 35px;
  left: 20px;
  z-index: 20;
}
#logo:hover {
  cursor: pointer;
}
.fetchingInProgress {
  cursor: wait;
}
::-webkit-scrollbar {
  background: pink;
  width: 5px;
  height: 5px;
}
::-webkit-scrollbar-track-piece {
  background: black;
}
::-webkit-scrollbar-thumb {
  background: rgb(255, 255, 255);
  border-radius: 10px;
}
.wrapper {
  height: 100vh !important;
  width: 100%;
  color: rgb(255, 255, 255);
}
.grid {
  display: grid;
  grid-template-columns: 20% 50% 30%;
  height: 100vh;
}
#splash {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 20;
}
.showInformer {
  .mixingloader {
    transform: scale(1);
  }
  .bar {
    transform: scale(1) translateY(-50%) rotate(180deg);
  }
}
.hideInformerBody {
  .mixLoader {
    display: none;
  }
  #infoText {
    display: none;
  }
}
.mixingloader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, purple, rgb(59, 0, 59));
  opacity: 0.9;
  z-index: 13;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  font-size: 3em;
  color: magenta;
  transition: 0.05s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform: scale(0);
}
.showInfo {
  .darken {
    opacity: 1;
    pointer-events: all;
  }
  .info-card {
    transform: scale(1) translate(-50%, -50%);
    opacity: 1;
  }
  #flbLogo {
    filter: invert(100%);
  }
}
#flbLogo {
  transform: scale(0.6);
  position: fixed;
  top: -5px;
  left: -5px;
  z-index: 10;
}
#flbLogo:hover {
  cursor: pointer;
}
.darken {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.815);
  z-index: 40;
  transition: 0.2s ease;
  opacity: 0;
  pointer-events: none;
}
.info-card {
  position: fixed;
  z-index: 50;
  top: 50%;
  left: 50%;
  transform: scale(0) translate(-50%, -50%);
  background: linear-gradient(150deg, rgb(0, 193, 207), rgb(0, 110, 255));
  width: 350px;
  height: 430px;
  border-radius: 15px;
  padding: 10px;
  transform-origin: top left;
  opacity: 0;
  transition: 0.2s cubic-bezier(0.91, 0.8, 0.54, 1.39);
  .info-group {
    margin-bottom: 20px;
    margin-left: 10px;
    font-size: 1.2em;
    .it {
      font-weight: 400;
      font-size: 1em;
    }
    .i {
      font-weight: 300;
    }
    .i:hover {
      cursor: default;
    }
  }
}
.gif {
  text-align: center;
  margin-top: -70px;
}
#gif {
  width: 200px;
  border-radius: 10px;
  box-shadow: 4px 2px 10px rgba(8, 8, 8, 0.384);
}
</style>
