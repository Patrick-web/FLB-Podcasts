<template>
  <div class="searchTitlebar">
    <div class="tabTitle">Explore</div>
    <div class="searchBar">
      <input
        v-on:keyup.enter="search"
        id="podSearch"
        placeholder="Search for Podcasts"
        class="inputElem"
      />
      <img
        class="iconLeft magnifier"
        src="@/assets/forPodcasts/search.png"
        alt
      />
      <img
        @click="clearSearchResults"
        class="clearSearch"
        src="@/assets/forPodcasts/x.png"
        alt
      />
      <img
        @click="clearSearchResults"
        class="iconLeft clearer"
        src="@/assets/forPodcasts/back.svg"
        alt
      />
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  methods: {
    ...mapActions(["searchPodcast", "renderDataBeforeSearch"]),
    search() {
      const query = document.querySelector("#podSearch").value;
      this.searchPodcast(query);
    },
    //TODO: Make this function work
    clearSearchResults() {
      document.body.classList.remove("searchingState");
      document.querySelector("#podSearch").value = "";
      this.renderDataBeforeSearch();
      console.log("Clearing");
    },
  },
};
</script>

<style lang="scss">
.searchingState {
  .clearer {
    transform: scale(1.2) translateY(-6px) !important;
    filter: brightness(0) invert(1);
  }
  .magnifier {
    transform: scale(0) !important;
    filter: grayscale(1);
  }
}
.fetchingInProgress input {
  cursor: wait !important;
}
.searchTitlebar {
  width: 850px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  margin-top: 10px;
  width: 100%;

  .searchBar {
    position: relative;
  }
  .fetchingInProgress {
    img:hover {
      cursor: wait;
    }
  }
  img:hover {
    cursor: pointer;
  }
  .iconLeft {
    position: absolute;
    top: 50%;
    left: -10%;
    transform: scale(1) translateY(-50%);
    width: 20px;
    transition: 0.1s linear;
    filter: brightness(0) invert(1);
  }
  .clearer {
    transform: scale(0);
    left: -15%;
  }
  .clearSearch {
    position: absolute;
    z-index: 3;
    top: 50%;
    right: 2%;
    transform: scale(0) translateY(-50%);
    width: 20px;
    transition: 0.2s linear;
    filter: grayscale(1);
  }
  input {
    padding: 5px;
    padding-left: 10px;
    font-size: 1.3rem;
    border-radius: 20px;
    border: 1px solid transparent;
    outline: none;
    background: #191919;
    color: white;
    width: 250px;
    transition: 0.1s cubic-bezier(0.075, 0.82, 0.165, 1);
  }

  input:focus {
    width: 400px;
    border-radius: 3px;
  }
  input:focus ~ .magnifier {
    left: 100%;
    transform: scale(0) translateY(-50%);
  }
  input:focus ~ .clearer {
    left: -10%;
    display: none;
  }
  input:focus ~ .clearSearch {
    transform: scale(1) translateY(-50%);
  }

  input:hover {
    background: rgb(24, 24, 24);
    cursor: pointer;
  }
}
.tabTitle {
  font-size: 2.1rem;
  font-weight: 800;
  letter-spacing: 2px;
  color: rgb(var(--base-one), var(--base-two), var(--base-three));
}
input::placeholder {
  color: rgba(255, 255, 255, 0.5);
  font-weight: 300;
  font-size: 1em;
}
</style>
