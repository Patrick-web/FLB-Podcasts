<template>
  <div class="playingPane animated faster">
    <Controls />
    <audio src id="podcastAudioTag"></audio>

    <div class="grid2">
      <p>Playing</p>
      <div @click="sendDownload()" class="podDownBt">
        <div id="dProgress"></div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          style="isolation:isolate"
          viewBox="21.735 855 80 80"
          width="80pt"
          height="80pt"
          id="downloadBt"
          class="animated infinite slow"
        >
          <path
            d=" M 55.485 855 L 67.985 855 C 70.064 855 71.735 856.672 71.735 858.75 L 71.735 885 L 85.439 885 C 88.22 885 89.61 888.359 87.642 890.328 L 63.876 914.109 C 62.704 915.281 60.782 915.281 59.61 914.109 L 35.814 890.328 C 33.845 888.359 35.235 885 38.017 885 L 51.735 885 L 51.735 858.75 C 51.735 856.672 53.407 855 55.485 855 Z  M 101.735 913.75 L 101.735 931.25 C 101.735 933.328 100.064 935 97.985 935 L 25.485 935 C 23.407 935 21.735 933.328 21.735 931.25 L 21.735 913.75 C 21.735 911.672 23.407 910 25.485 910 L 48.407 910 L 56.064 917.656 C 59.204 920.797 64.267 920.797 67.407 917.656 L 75.064 910 L 97.985 910 C 100.064 910 101.735 911.672 101.735 913.75 Z  M 82.36 927.5 C 82.36 925.781 80.954 924.375 79.235 924.375 C 77.517 924.375 76.11 925.781 76.11 927.5 C 76.11 929.219 77.517 930.625 79.235 930.625 C 80.954 930.625 82.36 929.219 82.36 927.5 Z  M 92.36 927.5 C 92.36 925.781 90.954 924.375 89.235 924.375 C 87.517 924.375 86.11 925.781 86.11 927.5 C 86.11 929.219 87.517 930.625 89.235 930.625 C 90.954 930.625 92.36 929.219 92.36 927.5 Z "
            fill="#006eff"
          />
        </svg>
      </div>
    </div>
    <div class="content">
      <div class="logoArea">
        <img :src="currentlyPlayingEpisode.thumbnail" alt />
      </div>
      <br />
      <h4 id="playing-episode">{{ currentlyPlayingEpisode.title }}</h4>
      <h6 @click="showCurrentlyPlayingPodcast" id="playing-podName">
        {{ currentlyPlayingEpisode.podcast.name }}
      </h6>
      <h3>Show Notes</h3>
      <div class="showNotes" v-html="currentlyPlayingEpisode.description"></div>
    </div>
    <button
      @click="changeSubscriptionStatus($event, currentlyPlayingEpisode.podcast)"
      class="subBt"
      v-bind:class="{
        subscribed: currentlyPlayingEpisode.podcast.isSubscribed,
      }"
    >
      <span
        style="margin-right:-5px"
        v-if="currentlyPlayingEpisode.podcast.isSubscribed"
        >Un</span
      >
      Subscribe
    </button>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Controls from "@/components/Controls.vue";
import { ipcRenderer } from "electron";
export default {
  computed: mapGetters(["currentlyPlayingEpisode", "subscribed"]),
  data() {
    return {};
  },
  methods: {
    ...mapActions([
      "showCurrentlyPlayingPodcast",
      "subscribeToPodcast",
      "unSubscribeToPodcast",
      "unSubscribeFromPlayingPod",
      "flickerRender",
    ]),
    sendDownload() {
      document.querySelector("#downloadBt").classList.add("flash");
      document.querySelector(".podDownBt").classList.add("disabled");
      console.log(this.currentlyPlayingEpisode);
      ipcRenderer.send(
        "download",
        {
          url: window.playingPodUrl,
          properties: { directory: "to be set in node" },
        },
        this.currentlyPlayingEpisode
      );
    },
    changeSubscriptionStatus(e, parentPodcast) {
      let isSubscribed = false;
      if (this.subscribed.length == 0) {
        console.log("Subscribing");
        this.subscribeToPodcast(parentPodcast);
      } else {
        this.subscribed.forEach((podcast) => {
          if (podcast.podId == parentPodcast.podId) {
            console.log("Unsubscribing");
            console.log(podcast.podId);
            console.log(parentPodcast.podId);
            isSubscribed = true;
            this.unSubscribeToPodcast(parentPodcast.podId);
            this.unSubscribeFromPlayingPod();
          }
        });
        if (!isSubscribed) {
          console.log("Subscribed");
          this.subscribeToPodcast(parentPodcast);
        }
      }
    },
    updateProgress() {
      const audio = document.querySelector("#podcastAudioTag");
      const progressBar = document.querySelector(".seekProgress");
      if (audio) {
        setInterval(() => {
          const percent =
            Math.floor(audio.currentTime) / window.episodeDuration;
          progressBar.style.height = `${Math.floor(percent * 100)}%`;
        }, 1000);
      }
    },
  },
  mounted() {
    this.updateProgress();
    ipcRenderer.on("download complete", (event, episode) => {
      document.querySelector("#downloadBt").classList.remove("flash");
      document.querySelector(".podDownBt").classList.remove("disabled");
      let downloaded = JSON.parse(localStorage.getItem("downloaded"));
      if (downloaded) {
        downloaded.unshift(episode);
      } else {
        downloaded = [episode];
      }
      console.log(downloaded);
      localStorage.setItem("downloaded", JSON.stringify(downloaded));

      const downloadedEpisodes = JSON.parse(localStorage.getItem("downloaded"));
      ipcRenderer.send("parseAudioFiles", downloadedEpisodes);
    });
    ipcRenderer.on("download progress", (event, progress) => {
      const progressInPercentages = progress * 100; // With decimal point and a bunch of numbers
      const cleanProgressInPercentages = Math.floor(progress * 100); // Without decimal point
      document.querySelector(
        "#dProgress"
      ).style.height = `${cleanProgressInPercentages}%`;
    });
  },
  components: {
    Controls,
  },
};
</script>

<style lang="scss">
.disabled {
  pointer-events: none;
  cursor: not-allowed;
}
#dProgress {
  background: #006eff;
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
}
.episodeIsPlaying {
  .playingPane {
    opacity: 1;
  }
}
.playingPane {
  position: relative;
  height: 100vh;
  z-index: 8;
  opacity: 0;
  // min-width: 500px;
  #playing-episode {
    font-size: 1.2rem;
    font-weight: 700;
    margin-top: 5px;
    margin-bottom: 5px;
  }
  #playing-podName {
    font-size: 1rem;
    font-weight: 500;
    margin-top: 5px;
    margin-bottom: 5px;
    background: #252424;
    padding-left: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
    border-radius: 20px;
    margin-right: 10px;
  }
  #playing-podName:hover {
    cursor: pointer;
  }
  .subBt {
    color: white;
    border: none;
    padding: 5px;
    font-weight: 600;
    font-size: 1.25rem;
    width: 50%;
    background: #018aff24;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 5px;
    transition: 0.2s ease;
    border-radius: 8px;
  }
  .subBt:hover {
    cursor: pointer;
    background: #006eff;
    border: 2px solid #006eff;
  }
  .subscribed {
    background: #006eff;
    border-radius: 12px;
  }
}
.grid2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  max-width: 100%;
  padding-right: 10px;
  padding-left: 10px;
  p {
    color: rgb(var(--base-one), var(--base-two), var(--base-three));
    font-size: 1.3em;
    font-weight: 700;
  }
  .podDownBt {
    position: relative;
    background: #018aff24;
    border-radius: 20%;
    padding: 8px;
    border: 0px solid #006eff;
    transition: 0.2s ease;
    overflow: hidden;
    #downloadBt {
      width: 20px;
      height: 20px;
    }
  }
  .podDownBt:hover {
    cursor: pointer;
    border: 2px solid #006eff;
  }
}
.content {
  padding: 10px;
  .logoArea {
    width: 80%;
    height: 200px;
    color: white;
    margin: auto;
    margin-bottom: 20px;
    img {
      width: 100%;
      border-radius: 15px;
    }
  }
  .showNotes {
    font-weight: 300;
    max-height: 230px !important;
    overflow-y: scroll;
    padding-right: 5px;
  }
}
</style>
