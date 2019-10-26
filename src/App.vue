<template>
  <div id="app">
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <tabschrome ref="tab" v-model="tab" :tabs="tabs"></tabschrome>
    <div class="btns">
      <button @click="addTab">New Tab</button>
    </div>

    <tabschrome theme="custom" :gap="2" ref="tab1" v-model="tab1" :tabs="tab1s"></tabschrome>

    <div class="btns">
      <button @click="addTab1">New Tab</button>
    </div>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import tabschrome from "./components/tabs-chrome.vue";
export default {
  name: "app",
  components: {
    HelloWorld,
    tabschrome
  },
  data() {
    return {
      tab: "google",
      tabs: [
        {
          label: "google",
          key: "google",
          favico: require("./assets/google.jpg")
        },
        {
          label: "facebook",
          key: "facebook",
          favico: require("./assets/fb.jpg")
        },
        {
          label: "New Tab",
          key: "costomKey",
          favico: (createElement, label) => {
            return createElement("span", label);
          }
        }
      ],
      tab1: "google",
      tab1s: [
        {
          label: "google",
          key: "google",
          favico: require("./assets/google.jpg")
        },
        {
          label: "facebook",
          key: "facebook",
          favico: require("./assets/fb.jpg")
        },
        {
          label: "New Tab",
          key: "costomKey",
          favico: (createElement, label) => {
            return createElement("span", label);
          }
        }
      ]
    };
  },
  methods: {
    addTab() {
      let item = "tab" + Date.now();
      let newTab = {
        label: "New Tab",
        key: item
      };
      this.$refs.tab.addTab(newTab);
    },
    addTab1() {
      let item = "tab" + Date.now();
      let newTab = {
        label: "New Tab",
        key: item
      };
      this.$refs.tab1.addTab(newTab);
    }
  }
};
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  background-color: #fafafa;
}
h1,
h2,
h3 {
  font-weight: 400;
  color: rgba(0, 0, 0, 0.54);
}

h1 {
  font-size: 32px;
}

h2 {
  font-size: 24px;
  margin: 55px 0 15px;
}

#app {
  width: 1200px;
  padding: 0 20px;
  max-width: 100%;
  margin: 50px auto 100px;
}

.btns {
  padding: 50px 30px;
}
button {
  padding: 10px 16px;
  border-radius: 2px;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  border: 1px solid #fff;
  color: #000;
  background-color: #fff;
  cursor: pointer;
  &:hover {
    text-decoration: none;
  }
}

button + button {
  margin-left: 20px;
}
.content {
  padding: 20px;
  background-color: #fff;
  &.dark {
    background-color: #323639;
  }
}

.vue-tabs-chrome.theme-custom {
  padding-top: 0;
  background-color: transparent;
  overflow: hidden;

  .tabs-divider,
  .tabs-background-before,
  .tabs-background-after {
    display: none;
  }
  .tabs-item {
    cursor: pointer;
  }
  .tabs-content {
    overflow: unset;
    border-bottom: 1px solid #e4e7ed;
  }
  .tabs-background {
    padding: 0;
  }
  .tabs-background-content {
    border-top: 1px solid #e4e7ed;
    border-left: 1px solid #e4e7ed;
    border-right: 1px solid #e4e7ed;
    border-radius: 0;
    background-color: #fff;
  }
  .tabs-content {
    height: 40px;
  }
  .active {
    color: #409eff;
    .tabs-background {
      &::before,
      &::after {
        top: 100%;
        left: 0;
        content: "";
        width: 100%;
        height: 1px;
        background-color: #fff;
        z-index: 1;
        position: absolute;
      }
      &::before {
        top: 0;
        height: 2px;
        background-color: #409eff;
      }
    }
  }
}
</style>
