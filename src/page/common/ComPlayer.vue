<template>
  <transition name="slide-down">
    <div class="com_player theme ignore f-df" v-show="playerVisible">
      <div class="com_player-left" @click="goToPlayPage">
        <img class="com_player-left-img" :src="formatAvatar" alt="avatar" />
      </div>
      <div
        class="com_player-center f-df f-fdc f-fx1 f-jcc o-oh"
        @click="goToPlayPage"
      >
        <base-font class="line-one" text="" color="text">
          <base-font :text="formatName" />
          <base-font :text="formatAlia" color="text" />
        </base-font>
        <base-font
          class="line-one com_player-center-tip"
          :text="formatAuthor"
          color="text"
          size="12"
        />
      </div>
      <div class="com_player-right f-df o-oh">
        <div
          @click="changePlayStatus"
          class="com_player-right-btn f-df f-fx1 f-jac"
        >
          <svg-icon :icon-class="playIcon" class="size-ll" />
        </div>
        <div
          @click="showPlayList"
          class="com_player-right-btn f-df f-fx1 f-jac"
        >
          <svg-icon icon-class="menu" class="size-lg" />
        </div>
      </div>
      <audio ref="audio"></audio>
    </div>
  </transition>
</template>

<script>
import { homeMixin, playerMixin } from '@/util/mixin';
import { PAGE_DPR } from '@/config/param';

const AVATAR_SIZE = 40 * PAGE_DPR;
export default {
  name: 'ComPlayer',
  mixins: [homeMixin, playerMixin],
  mounted() {
    this.setAudioElAndEvent();
  },
  computed: {
    playIcon() {
      return this.playStatus ? 'pause' : 'play';
    },
    formatAvatar() {
      if (!this.playInfo.avatar)
        return require('../../asset/images/lazyload_day.png');
      return `${this.playInfo.avatar}?param=${AVATAR_SIZE}y${AVATAR_SIZE}`;
    },
    formatName() {
      return this.playInfo.name || '';
    },
    formatAlia() {
      return this.playInfo.alia ? ` (${this.playInfo.alia})` : '';
    },
    formatAuthor() {
      return this.playInfo.author?.map(({ name }) => name).join('/') || '';
    },
  },
  methods: {
    setAudioElAndEvent() {
      const audioEl = this.$refs.audio;
      this.setPlayEl(audioEl);
      audioEl.addEventListener('ended', () => {
        this.changePlaySong({});
      });
      audioEl.addEventListener('timeupdate', (e) => {
        const { duration, currentTime } = e.target;
        if (this.playCurrentTime >= duration) {
          return;
        }
        if (isNaN(this.playDuration) || this.playDuration < 1) {
          this.setPlayDuration(this.playId);
        }
        const time = +currentTime.toFixed(1).split('.')[1];
        if (!this.playHandle && time < 3 && time >= 0) {
          this.setPlayCurrentTime(currentTime);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.com_player {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 777;

  &.ignore {
    height: 50px;
  }

  .com_player-left {
    min-width: 50px;
    width: 50px;
    height: 100%;
    padding: 5px;

    .com_player-left-img {
      @include wh(40px);
      border-radius: 50%;
    }
  }

  .com_player-center {
    margin-left: 5px;

    .com_player-center-tip {
      margin-top: 2px;
    }
  }

  .com_player-right {
    min-width: 100px;
    width: 100px;
    height: 100%;

    .com_player-right-btn {
      height: 100%;
      border-radius: 50%;
    }
  }
}
</style>
