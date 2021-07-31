<template>
  <div class="app p-pr" :data-theme="theme">
    <com-header :visible="$route.meta.home"></com-header>
    <com-player></com-player>
    <com-play-list></com-play-list>
    <com-load></com-load>
    <transition name="fade" mode="out-in">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import { homeMixin } from '@/util/mixin';
import ComHeader from '@/page/common/ComHeader';
import ComPlayer from '@/page/common/ComPlayer';
import ComPlayList from '@/page/common/ComPlayList';
import ComLoad from '@/page/common/ComLoad';

export default {
  name: 'App',
  mixins: [homeMixin],
  components: {
    ComHeader,
    ComPlayer,
    ComPlayList,
    ComLoad,
  },
  watch: {
    $route(to) {
      if (this.playerVisible && to.path !== '/play/detail') return;
      if (this.$store.getters['player/playListCount'] > 0)
        this.setPlayerVisible(to.path !== '/play/detail');
    },
    theme(val) {
      // 动态修改懒加载占位符图片
      const loading =
        val === 'day'
          ? require(`./asset/images/lazyload_day.png`)
          : require(`./asset/images/lazyload_night.png`);
      this.$Lazyload.config({ loading });
    },
  },
};
</script>

<style lang="scss" scoped>
.app {
  @include wh(100%);

  &[data-theme='day'] {
    background-color: $day-bg;
  }

  &[data-theme='night'] {
    background-color: $night-bg;
  }
}
</style>
