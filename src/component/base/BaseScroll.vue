<template>
  <div
    class="scroll-wrapper p-pa"
    ref="scrollEl"
    @scroll="onScroll"
    :style="scrollStyle"
  >
    <div
      class="scroll ignore p-pa"
      :class="{
        'scroll-player': playerVisible,
        'nav-bar': navBar,
        'theme-bg': themeBg,
      }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { PAGE_HEIGHT } from '@/config/param';
import { homeMixin } from '@/util/mixin';

export default {
  name: 'BaseScroll',
  mixins: [homeMixin],
  props: {
    offsetTop: {
      type: Number,
      default: 0,
    },
    offsetBottom: {
      type: Number,
      default: 0,
    },
    bottomThreshold: {
      type: Number,
      default: 0,
    },
    scrollEventEnable: {
      type: Boolean,
      default: true,
    },
    navBar: {
      type: Boolean,
      default: false,
    },
    themeBg: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      scrollTop: 0, // 当前滚动位置
    };
  },
  activated() {
    // 页面返回滚动至原来位置
    if (this.scrollTop > 0) {
      this.$nextTick(() => {
        if (typeof window.scrollTo === 'function') {
          this.$refs.scrollEl.scrollTo(0, this.scrollTop);
        } else {
          this.$refs.scrollEl.scrollTop = this.scrollTop; // 兼容旧浏览器
        }
      });
    }
  },
  computed: {
    scrollStyle() {
      return {
        height: PAGE_HEIGHT - this.offsetTop - this.offsetBottom + 'px',
      };
    },
  },
  methods: {
    onScroll(e) {
      this.$emit('handle-scroll', e);
      this.scrollTop = e.target.scrollTop; // 滚动位置缓存
      if (
        Math.ceil(e.target.scrollTop + e.target.clientHeight) >=
        e.target.scrollHeight - this.bottomThreshold
      ) {
        // 滚动到距离底部指定位置
        if (this.scrollEventEnable) this.$emit('bottom-reached');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.scroll-wrapper {
  z-index: 150;
  width: 100%;
  overflow-x: hidden;
  overflow-y: scroll;

  .scroll {
    width: 100%;
    min-height: 100%;

    &.scroll-player {
      padding-bottom: 50px;
    }

    &.ignore.nav-bar {
      padding-top: 50px;
    }
  }
}
</style>
