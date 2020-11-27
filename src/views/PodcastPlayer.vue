<template>
  <div class="view podcasts">
    <div class="darken" @click="toggleInfo"></div>

    <img
      id="logo"
      class="animated pulse infinite slow"
      @click="toggleInfo"
      src="@/assets/logo.png"
      alt=""
    />

    <TabSwitcher />
    <div class="contentView">
      <PodcastPage />
      <div class="pagesWrapper">
        <div class="subscribedPage podPage">
          <div class="tabTitle">Subscribed</div>
          <div class="genresCont">
            <br />
            <div class="genrePods">
              <PodcastCard
                v-for="podcast in subscribed"
                :key="podcast.podId"
                :podId="podcast.podId"
                :podName="podcast.name"
                :podDescription="podcast.description"
                :podThumbnail="podcast.thumbnail"
                :isSubscribed="true"
              />
            </div>
          </div>
        </div>
        <div class="explorePage podPage">
          <Titlebar />
          <Genres />
          <div class="genresCont exploreGenresCont">
            <div
              v-for="(genre, gindex) in dataToRender"
              :key="genre.id"
              class="genreWrapper"
            >
              <p class="genreName">{{ genre.genre }}</p>
              <div class="genrePods">
                <PodcastCard
                  v-for="(podcast, pindex) in genre.podcasts"
                  :key="podcast.id"
                  :podId="podcast.id"
                  :podName="podcast.title"
                  :podDescription="podcast.description"
                  :podThumbnail="podcast.image"
                  :website="podcast.website"
                  :isSubscribed="podcast.isSubscribed"
                  :genreIndex="gindex"
                  :podcastIndex="pindex"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="downloadedPage podPage">
          <div class="tabTitle">Downloaded</div>
          <br />
          <br />
          <div class="episodesCont">
            <div
              v-for="episode in downloadedEpisodes"
              :key="episode.id"
              class="downloadedCard"
              @click="playEpisode($event, episode)"
            >
              <img :src="episode.thumbnail" alt="" />
              <div class="info">
                <p class="episodeTitle">
                  {{ episode.title }}
                </p>
                <p class="eDuration">{{ episode.formattedDuration }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="sidePane">
      <PlayingPane />
    </div>
  </div>
</template>
<script>
import TabSwitcher from "@/components/tabSwitcher";
import Titlebar from "@/components/titlebar.vue";
import PodcastCard from "@/components/SquareCard.vue";
import PlayingPane from "@/components/PlayingPane.vue";
import Genres from "@/components/Genres.vue";
import PodcastPage from "@/components/PodcastPage.vue";
import { mapGetters, mapActions } from "vuex";
import { ipcRenderer } from "electron";
export default {
  mounted() {
    this.loadedSubscribedFromStorage();
    const podsCont = document.querySelector(".exploreGenresCont");
    podsCont.addEventListener("scroll", (e) => {
      const scrollAmount = e.srcElement.scrollTop;
      if (
        scrollAmount > 800 &&
        document.body.classList.contains("specificGenreFetch") &&
        !window.fetchedNewPage2
      ) {
        window.fetchedNewPage2 = true;
        console.log("Fetching page 2");
        console.log(this);
        this.fetchByGenre(2);
      }
      if (
        scrollAmount > 2000 &&
        document.body.classList.contains("specificGenreFetch") &&
        !window.fetchedNewPage3
      ) {
        window.fetchedNewPage3 = true;
        this.fetchByGenre(3);
        console.log("Fetching page 3");
      }
    });
    const downloadedEpisodes = JSON.parse(localStorage.getItem("downloaded"));
    if (downloadedEpisodes) {
      ipcRenderer.send("parseAudioFiles", downloadedEpisodes);
    }
    ipcRenderer.on("downloadedEpisodes", (e, episodes) => {
      console.log(episodes);
      this.setDownloadedEpisodes(episodes);
    });
  },
  methods: {
    ...mapActions([
      "fetchByGenre",
      "loadedSubscribedFromStorage",
      "setDownloadedEpisodes",
      "updatePlayingEpisode",
    ]),
    toggleInfo() {
      document.body.classList.toggle("showInfo");
      document.querySelector("#logo").classList.remove("animated");
    },
    playEpisode(e, episode) {
      document.querySelector(".podDownBt").style.display = "none";
      this.updatePlayingEpisode(episode);
      this.markAsPlaying(e.currentTarget);
      setTimeout(() => {
        const audio = document.querySelector("#podcastAudioTag");
        window.playingPodUrl = episode.audio;
        audio.src = "file:///" + episode.audio;
        audio.play();
        window.episodeDuration = episode.audio_length_sec;
        console.log(episode.audio_length_sec);
      }, 100);
    },
    markAsPlaying(element) {
      document.body.classList.add("episodeIsPlaying");
      document.body.classList.add("podcastInPlayingState");
      if (document.querySelector(".playingPane")) {
        document.querySelector(".playingPane").classList.add("slideInRight");
      }

      if (document.querySelector(".playingEpisode")) {
        document
          .querySelector(".playingEpisode")
          .classList.remove("playingEpisode");
      }
      element.classList.add("playingEpisode");
    },
  },
  computed: mapGetters([
    "dataToRender",
    "subscribed",
    "newlySubscribedWebsiteUrl",
    "downloadedEpisodes",
  ]),
  data() {
    return {
      render: true,
    };
  },
  components: {
    PlayingPane,
    TabSwitcher,
    Titlebar,
    PodcastCard,
    Genres,
    PodcastPage,
  },
};
</script>

<style lang="scss">
.downloadedCard {
  display: grid;
  grid-template-columns: 1fr 9fr;
  transition: 0.1s ease;
  cursor: pointer;
  .episodeTitle {
    font-size: 1.2rem;
    font-weight: 300;
  }
  .eDuration {
    font-weight: 200;
    font-size: 0.9rem;
  }
  .info {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    padding-left: 10px;
  }
  img {
    width: 100px;
    transition: 0.4s ease;
  }
  background: rgb(26, 26, 26);
  border-bottom: 1px solid gray;
}
.downloadedCard:hover {
  background: #202020;
  img {
    transform: scale(1.03) rotateX(2deg) rotateY(2deg) translateZ(100px);
    box-shadow: 8px 8px 4px rgba(0, 0, 0, 0.253);
  }
}
.playingEpisode {
  background: #006eff;
  border: none;
}
.playingEpisode:hover {
  background: #006eff;
  img {
    transform: none;
    box-shadow: none;
  }
}
.podcasts {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 20;
  overflow: hidden;
}
.pagesWrapper {
  height: auto;
  width: 100%;
  position: absolute;
  top: -100%;
  transition: 0.3s ease-in-out;
  .podPage {
    height: 100vh;
  }
  .subscribedPage {
    padding-top: 5px;
  }
}
.genresCont {
  margin-top: 20px;
  height: 84vh;
  overflow-y: scroll;
  overflow-x: hidden;
}
.genreWrapper {
  margin-bottom: 40px;
}
.contentView {
  height: 100vh;
  width: 67.8vw;
  position: relative;
  overflow: hidden;
}
.genrePods {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  row-gap: 20px;
}
.genreName {
  margin-bottom: 10px;
  font-size: 1.4rem;
}
.sidePane {
  background: #0f0f0f;
  width: 300px;
  height: 100vh;
}
</style>
