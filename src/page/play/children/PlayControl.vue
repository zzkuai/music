<template>
  <div class="play-control p-pa">
    <div class="play-control-time p-ph20 p-pa f-df f-aic f-jcb">
      <div class="play-control-time-start f-df f-jac">
        <base-font
          :text="playCurrentTime | playTimeFormat"
          color="white"
          size="10"
        />
      </div>
      <controller
        :move-offset="playCurrentTime"
        :max-offset="playDuration"
        @controller-touch-start="onTouchStart"
        @controller-touch-move="onTouchMove"
        @controller-touch-end="onTouchEnd"
      />
      <div class="play-control-time-end f-df f-jac">
        <base-font
          :text="playDuration | playTimeFormat"
          color="white"
          size="10"
        />
      </div>
    </div>
    <ul class="play-control-btn p-pa f-df">
      <li
        class="play-control-btn_item f-fx1 f-df f-jac"
        v-for="(data, index) in playFunc"
        :key="index"
      >
        <div class="play-control-btn_item-icon f-df f-jac" @click="data.func">
          <svg-icon :icon-class="data.icon" :class="data.size" color="white" />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { homeMixin, playerMixin } from '@/util/mixin';
import Controller from '@/component/Controller';

export default {
  name: 'PlayControl',
  mixins: [homeMixin, playerMixin],
  components: {
    Controller,
  },
  computed: {
    playIcon() {
      return this.playStatus ? 'pause' : 'play';
    },
    playFunc() {
      return [
        {
          icon: this.playTypeIcon,
          size: this.playTypeIconSizeBig,
          func: () => this.changePlayType(true),
        },
        {
          icon: 'previous',
          size: 'size-mg',
          func: () => this.changeSong(false),
        },
        {
          icon: this.playIcon,
          size: 'size-xl',
          func: () => this.changePlayStatus(),
        },
        { icon: 'next', size: 'size-mg', func: () => this.changeSong(true) },
        { icon: 'list', size: 'size-lg', func: () => this.showPlayList() },
      ];
    },
  },
  methods: {
    changeSong(isNext) {
      this.changePlaySong({ isNext, isClick: true });
    },
    onTouchStart(currentTime) {
      this.setPlayHandle(true);
      if (currentTime !== -1) {
        this.setPlayCurrentTime(currentTime);
      }
    },
    onTouchMove(duration) {
      this.setPlayCurrentTime(duration);
    },
    onTouchEnd() {
      this.setPlayHandle(false);
      this.playEl.currentTime = this.playCurrentTime;
    },
  },
};
</script>

<style lang="scss" scoped>
.play-control {
  bottom: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 120px;

  .play-control-time {
    width: 100%;
    height: 40px;

    .play-control-time-progress {
      padding: 8px 0;
      margin: 0 20px;

      &:before {
        position: absolute;
        content: '';
        width: 100%;
        height: 1px;
        background-color: rgba(255, 255, 255, 0.2);
      }
    }

    .play-control-time-bar-reached {
      width: 0;
      left: 0;
      height: 1px;
      background-color: rgba(255, 255, 255, 0.8);
    }

    .play-control-time-bar {
      background-color: white;
      border-radius: 50%;
      transform: scale(1);
      @include ts(transform);

      &.ignore {
        @include wh(6px);
      }

      &.active {
        transform: scale(1.5);
      }
    }
  }

  .play-control-btn {
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80px;
    padding: 0 30px;

    .play-control-btn_item {
      &:first-child {
        .play-control-btn_item-icon {
          @include wh(34px);
        }
      }
    }

    .play-control-btn_item-icon {
      padding: 5px;
    }
  }
}
</style>
