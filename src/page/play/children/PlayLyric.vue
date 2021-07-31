<template>
  <div
    class="play-lyric t-tac"
    @touchstart="lyricTouchStart"
    @touchend="lyricTouchEnd"
  >
    <base-font v-if="load" text="加载中..." size="13" color="white" />
    <template v-else-if="lyric && lyric.length > 0">
      <base-font
        v-for="(item, index) in lyric"
        size="13"
        :key="index"
        :text="item.text"
        color="white"
        class="play-lyric-text ignore"
        :class="{ 'play-lyric-text-active': index === lyricActive }"
      />
    </template>
    <base-font v-else text="暂无歌词" size="13" color="white" />
  </div>
</template>

<script>
import { playerMixin } from '@/util/mixin';

export default {
  name: 'PlayLyric',
  mixins: [playerMixin],
  data() {
    return {
      load: true,
      lyric: Object.freeze(null),
      lyricTouched: false,
      lyricActive: 0, // 当前歌词高亮行
    };
  },
  mounted() {
    if (this.playId) {
      this.getPlayLyric();
    }
  },
  watch: {
    playId(id) {
      if (id) {
        this.load = true;
        this.getPlayLyric();
      }
    },
    playCurrentTime(val) {
      if (
        this.lyric &&
        !this.playHandle &&
        this.$route.path === '/play/detail' &&
        this.playStatus
      ) {
        let max = Math.max(
          ...this.lyric
            .filter(({ time }) => this.isWithinRound(time, val))
            .map((item, index) => index),
          0
        );
        if (this.lyricActive === max) return;
        this.lyricActive = max;
        if (!this.lyricTouched) {
          this.scrollToActiveItem();
        }
      }
    },
  },
  methods: {
    isWithinRound(curTime, playTime) {
      if (!curTime) return;
      const min = curTime.split(':')[0];
      const sec = curTime.split(':')[1];
      const lyricTime = min * 60 + sec * 1;
      return lyricTime <= playTime;
    },
    scrollToActiveItem() {
      this.$nextTick(() => {
        document.querySelector('.play-lyric-text-active')?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        });
      });
    },
    lyricTouchStart() {
      this.lyricTouched = true;
    },
    lyricTouchEnd() {
      this.lyricTouched = false;
    },
    async getPlayLyric() {
      const lyric = await this.setPlayLyric(this.playId);
      this.lyric = Object.freeze(lyric);
      this.load = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.play-lyric {
  overflow-y: scroll;
  white-space: pre-wrap;
  color: rgba(255, 255, 255, 0.5);
  padding: 210px 0;

  .play-lyric-text {
    display: block;
    opacity: 0.5;
    padding: 0 10px;
    @include ts(opacity);

    &.ignore {
      line-height: 24px;
    }

    & + .play-lyric-text {
      margin-top: 24px;
    }

    &.play-lyric-text-active {
      opacity: 1;
    }
  }
}
</style>
