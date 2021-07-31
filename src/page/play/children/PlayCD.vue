<template>
  <div class="play-cd p-pa" :class="{ 'cd-rotate': playStatus }" ref="playCd">
    <div
      class="play-cd-img"
      :style="`background-image:url(${playInfo.avatar}?param=${cdSize}y${cdSize})`"
    ></div>
  </div>
</template>

<script>
import { playerMixin } from '@/util/mixin';
import { PAGE_DPR } from '@/config/param';

const CD_AVATAR_SIZE = 250;
export default {
  name: 'PlayCD',
  mixins: [playerMixin],
  data() {
    return {
      cdSize: CD_AVATAR_SIZE * PAGE_DPR,
    };
  },
};
</script>

<style lang="scss" scoped>
.play-cd {
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0) rotate(0deg);
  @include wh(250px);

  &.cd-rotate {
    animation: rotate 20s linear 0.5s infinite backwards;
  }

  @keyframes rotate {
    0% {
      transform: translate3d(-50%, -50%, 0) rotate(0deg);
    }
    100% {
      transform: translate3d(-50%, -50%, 0) rotate(360deg);
    }
  }

  &:after {
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    @include wh(100%);
    border: 35px solid black;
    border-radius: 50%;
    box-shadow: 2px 2px 10px 0 rgba(0, 0, 0, 0.5),
      -2px -2px 10px 0 rgba(0, 0, 0, 0.5);
  }

  .play-cd-img {
    position: absolute;
    top: 50%;
    left: 50%;
    @include wh(75%);
    border-radius: 50%;
    transform: translate3d(-50%, -50%, 0);
    background: center center no-repeat;
    background-size: cover;
  }
}
</style>
