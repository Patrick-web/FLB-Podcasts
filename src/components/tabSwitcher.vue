<template>
  <div class="vMenu">
    <div class="activeTabIndicator"></div>
    <div @click="switchTab($event, 'subscribed')" class="vmenu-group">
      <img src="@/assets/forPodcasts/bolt.png" alt />
      <p class="v-tooltip">Subscribed</p>
    </div>
    <div @click="switchTab($event, 'explorer')" class="tabActive vmenu-group">
      <img
        class="whiten"
        style="width:38px"
        src="@/assets/forPodcasts/explore.png"
        alt
      />
      <p class="v-tooltip">Explore</p>
    </div>
    <div @click="switchTab($event, 'downloaded')" class="vmenu-group">
      <img src="@/assets/forPodcasts/download.svg" alt />
      <p class="v-tooltip">Downloaded</p>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    switchTab(e, tab) {
      document.body.classList.remove("showPodcastData");
      const indicator = document.querySelector(".activeTabIndicator");
      const element = e.currentTarget;
      const pagesWrapper = document.querySelector(".pagesWrapper");
      document.querySelector(".tabActive").classList.remove("tabActive");
      element.classList.add("tabActive");
      switch (tab) {
        case "subscribed":
          indicator.style.top = "11.5%";
          pagesWrapper.style.top = "0%";
          document.body.classList.add("currentTabIsSubscribed");
          break;
        case "explorer":
          indicator.style.top = "49.5%";
          pagesWrapper.style.top = "-100%";
          document.body.classList.remove("currentTabIsSubscribed");
          break;
        case "downloaded":
          indicator.style.top = "89%";
          pagesWrapper.style.top = "-201%";
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style lang="scss">
.whiten {
  filter: brightness(0) invert(1);
}
.vMenu {
  border-radius: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 8;
  min-width: 50px;
  background: #141414;
  height: 250px;
  padding: 5px;
  padding-top: 15px;
  padding-bottom: 15px;
  .vmenu-group {
    position: relative;
    .v-tooltip {
      position: absolute;
      top: 20%;
      right: -50%;
      transform: scale(0) translate(100%, 0%);
      opacity: 0;
      padding: 5px 10px 5px 10px;
      transition: 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      font-weight: 600;
      color: black;
    }
  }
  .vmenu-group:hover {
    cursor: pointer;
    .v-tooltip {
      opacity: 1;
      transform: scale(1) translate(100%, 0%);
    }
  }
  img {
    width: 25px;
  }
  .activeTabIndicator {
    position: absolute;
    top: 49.5%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: 0.2s ease-in-out;
    background: #006eff;
    border-radius: 50%;
    width: 50px;
    height: 50px;
  }
  .tabActive {
    .v-tooltip {
      display: none;
    }
    filter: hue-rotate(280deg);
  }
}
</style>
