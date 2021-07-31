<template>
  <nav class="playlist-nav ignore p-pf" :style="navStyle">
    <transition name="fade">
      <ul class="nav-list p-pr" v-show="visible" ref="navList">
        <li
          class="nav-list-item t-tac"
          :key="index"
          v-for="(tab, index) in userCategory"
          :class="{ active: index === activeTab }"
          :style="navItemStyle"
          @click="changeNav(index, tab)"
        >
          <base-font
            :text="tab.name"
            :color="activeTab === index ? 'title' : 'text'"
          />
        </li>
        <li
          class="nav-line ignore p-pa theme-bg-reverse"
          :style="navLineStyle"
        ></li>
      </ul>
    </transition>
  </nav>
</template>

<script>
import { playlistMixin } from '@/util/mixin';
import { PAGE_WIDTH } from '@/config/param';

const NAV_LINE_WIDTH = 30;
const NAV_ITEM_WIDTH = PAGE_WIDTH / 5;
export default {
  name: 'PlayListNav',
  mixins: [playlistMixin],
  data() {
    return {
      visible: false,
      activeTab: 0,
    };
  },
  mounted() {
    this.getData();
  },
  computed: {
    navStyle() {
      return {
        width: PAGE_WIDTH + 'px',
      };
    },
    navItemStyle() {
      return {
        width: NAV_ITEM_WIDTH + 'px',
      };
    },
    navLineStyle() {
      return {
        transform: `translate3d(${
          NAV_ITEM_WIDTH / 2 -
          NAV_LINE_WIDTH / 2 +
          NAV_ITEM_WIDTH * this.activeTab
        }px,0,0)`,
      };
    },
  },
  methods: {
    async getData() {
      try {
        await this.getCat();
      } finally {
        this.visible = true;
      }
    },
    changeNav(index, tab) {
      if (this.activeTab === index) return;
      this.activeTab = index;
      this.$nextTick(() => {
        const offsetLeft = NAV_ITEM_WIDTH * (index - 2);
        const moveLeft = offsetLeft > 0 ? offsetLeft : 0;
        this.$refs.navList.scrollTo({
          left: moveLeft,
          top: 0,
          behavior: 'smooth',
        });
        this.$emit('nav-click', tab.name, index);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.playlist-nav {
  width: 100%;
  height: 40px;
  z-index: 200;
  background-color: transparent;

  &.ignore {
    top: 50px;
  }

  .nav-list {
    width: 100%;
    height: 100%;
    overflow-x: scroll;
    font-size: 0;
    white-space: nowrap;
  }

  .nav-list-item {
    display: inline-block;
    height: 100%;
    line-height: 40px;

    &.active {
      font-weight: bold;
    }
  }

  .nav-line {
    bottom: 0;
    left: 0;
    height: 2px;
    border-radius: 25px;
    @include ts(transform);

    &.ignore {
      width: 30px;
    }
  }
}
</style>
