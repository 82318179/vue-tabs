<template>
  <div class="vue-tabs-chrome" :class="theme?'theme-'+theme:''">
    <div class="tabs-content" ref="content">
      <div
        class="tabs-divider"
        v-for="i in tabs.length"
        :key="i"
        :style="{left:(tabWidth - gap * 2) * i + gap + 'px'}"
      ></div>
      <div
        class="tabs-item"
        v-for="(tab,i) in tabs"
        ref="item"
        :key="getKey(tab)+i"
        :class="[{active:getKey(tab) === value},`tab-${getKey(tab)}`]"
        :style="{width:tabWidth +'px',left:(tabWidth - gap * 2) * i + 'px'}"
        @click="changeTab(tab,i)"
      >
        <div class="tabs-background">
          <div class="tabs-background-content"></div>
          <svg class="tabs-background-before" width="7" height="7">
            <path d="M 0 7 A 7 7 0 0 0 7 0 L 7 7 Z" />
          </svg>
          <svg class="tabs-background-after" width="7" height="7">
            <path d="M 0 0 A 7 7 0 0 0 7 7 L 0 7 Z" />
          </svg>
        </div>
        <div class="tabs-close" @click.stop="handleDelete(tab,i)">
          <svg class="tabs-close-icon" width="16" height="16" stroke="#595959">
            <path d="M 4 4 L 12 12 M 12 4 L 4 12" />
          </svg>
        </div>

        <div class="tabs-main" :title="tab | tabLabelText(tabLabel,renderLabel)">
          <span class="tabs-favicon" v-if="tab.favico">
            <render-temp
              v-if="typeof tab.favico === 'function'"
              :renders="tab.favico"
              :params="tab.label"
            ></render-temp>
            <img v-else :src="tab.favico" />
          </span>
          <span class="tabs-label">{{ tab | tabLabelText(tabLabel, renderLabel) }}</span>
        </div>
      </div>
    </div>
    <div class="tabs-footer"></div>
  </div>
</template>

<script>
import Draggabilly from "draggabilly";

import RenderTemp from "./render-temp.vue";

const getParams = (tab, keyStr) => {
  if (keyStr === "key") {
    return tab.key;
  }
  let keys = keyStr.split(".");
  let label = tab;
  keys.forEach(key => {
    label = label[key];
  });
  return label;
};

const getTabKey = (tab, tabKey) => {
  return getParams(tab, tabKey);
};

export default {
  components: {
    RenderTemp
  },
  props: {
    theme: {
      type: String,
      default: ""
    },
    tabs: {
      type: Array,
      default: () => []
    },
    gap: {
      type: Number,
      default: 7
    },
    minWidth: {
      type: Number,
      default: 40
    },
    maxWidth: {
      type: Number,
      default: 245
    },
    value: {
      type: [String, Number],
      default: ""
    },
    props: {
      type: Object,
      default: () => {
        return {};
      }
    },
    renderLabel: {
      type: Function
    }
  },
  data() {
    return {
      tabWidth: null
    };
  },
  filters: {
    tabLabelText(tab, tabLabel = "", renderLabel) {
      return renderLabel ? renderLabel(tab) : getParams(tab, tabLabel);
    }
  },
  mounted() {
    this.calcTabWidth();
    this.setup();
  },
  computed: {
    tabKey() {
      return this.props.key || "key";
    },
    tabLabel() {
      return this.props.label || "label";
    }
  },
  methods: {
    calcTabWidth() {
      let { tabs, maxWidth, minWidth, gap } = this;
      let $content = this.$refs.content;
      if (!$content) return Math.max(maxWidth, minWidth);
      let contentWidth = $content.clientWidth - gap * 2;
      let width = contentWidth / tabs.length;
      width += gap * 2;
      if (width > maxWidth) width = maxWidth;
      if (width < minWidth) width = minWidth;
      this.tabWidth = width;
    },
    getKey(tab) {
      return getTabKey(tab, this.tabKey);
    },
    addInstance(tab, i) {
      let { tabWidth, tabKey, gap } = this;
      if (tab._instance) {
        return;
      }
      let $content = this.$refs.content;
      let $item = this.$refs.item;
      let $el = $item.find(el =>
        el.classList.contains(`tab-${getTabKey(tab, tabKey)}`)
      );
      tab._instance = new Draggabilly($el, {
        axis: "x",
        containment: $content,
        handle: ".tabs-main"
      });
      // let x = (tabWidth - gap * 2) * i;
      // tab._instance.setPosition(x, 0);
    },
    setup() {
      let { tabs } = this;
      tabs.forEach((tab, i) => {
        this.addInstance(tab, i);
      });
    },
    changeTab(tab, i) {
      this.$emit("input", this.getKey(tab));
    },
    handleDelete(tab, i) {
      let { tabKey, tabs, value } = this;
      let index = tabs.findIndex(item => getTabKey(item, tabKey) === value);

      let after, before;
      if (i === index) {
        after = tabs[i + 1];
        before = tabs[i - 1];
      }
      if (after) {
        this.$emit("input", getTabKey(after, tabKey));
      } else if (before) {
        this.$emit("input", getTabKey(before, tabKey));
      } else if (tabs.length <= 1) {
        this.$emit("input", null);
      }
      tabs.splice(i, 1);
      this.$nextTick(() => {
        this.calcTabWidth();
        this.setup();
      });
    },
    doLayout() {
      //  this.calcTabWidth();
      let { tabWidth, tabs, gap } = this;
      tabs.forEach((tab, i) => {
        let _x = (tabWidth - gap * 2) * i;
        console.log(_x);
        tab._instance.setPosition(_x, 0);
      });
    },
    addTab(tab) {
      this.tabs.push(tab);
      this.$emit("input", this.getKey(this.tabs[this.tabs.length - 1]));
      this.$nextTick(() => {
        this.calcTabWidth();
        this.setup();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.vue-tabs-chrome {
  $bg: #dee1e6;
  $gap: 7px;
  $divider: #8a8e92;
  $speed: 150ms;

  padding-top: 10px;
  background-color: $bg;
  position: relative;

  .tabs-content {
    height: 34px;
    position: relative;
  }

  .tabs-divider {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 20px;
    background-color: $divider;
  }

  .tabs-footer {
    height: 4px;
    background-color: #fff;
  }

  .tabs-item {
    position: absolute;
    height: 100%;
    display: flex;
    align-items: center;
    user-select: none;
    box-sizing: border-box;

    &:hover {
      .tabs-background-content {
        background-color: #f2f3f5;
      }
      .tabs-background-before,
      .tabs-background-after {
        fill: #f2f3f5;
      }
    }

    &.active {
      z-index: 2;
      .tabs-background {
        opacity: 1;
      }
      .tabs-background-content {
        background-color: #fff;
      }
      .tabs-background-before,
      .tabs-background-after {
        fill: #fff;
      }
    }

    &:first-of-type {
      .tabs-dividers::before {
        opacity: 0;
      }
    }
    &:last-of-type {
      .tabs-dividers::after {
        opacity: 0;
      }
    }
  }

  .tabs-close {
    position: absolute;
    height: 16px;
    width: 16px;
    top: 50%;
    transform: translateY(-50%);
    right: $gap * 2;
    z-index: 1;
  }

  .tabs-close-icon {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    &:hover {
      stroke: #000;
      background-color: #e8eaed;
    }
  }
  .tabs-main {
    position: absolute;
    height: 100%;
    left: 0;
    right: 0;
    margin: 0 $gap * 2;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
  }

  .tabs-favicon {
    height: 16px;
    margin-left: $gap;
    display: flex;
    align-items: center;
    overflow: hidden;
    img {
      height: 100%;
    }
  }

  .tabs-label {
    flex: 1;
    margin-left: $gap;
    margin-right: 16px;
    box-sizing: border-box;
    overflow: hidden;
    white-space: nowrap;
  }
  .tabs-background {
    position: absolute;
    box-sizing: border-box;
    padding: 0 $gap - 1px;
    width: 100%;
    height: 100%;
    transition: opacity $speed * 2;
  }
  .tabs-background-content {
    height: 100%;
    border-top-left-radius: $gap;
    border-top-right-radius: $gap;
    transition: background $speed;
  }

  .tabs-background-before,
  .tabs-background-after {
    position: absolute;
    fill: transparent;
    bottom: -1px;
    transition: background $speed;
  }
  .tabs-background-before {
    left: -1px;
  }
  .tabs-background-after {
    right: -1px;
  }
}
</style>