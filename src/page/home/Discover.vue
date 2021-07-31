<template>
  <base-state
    :state="state"
    :error="error"
    :home="true"
    @reload="getData(true)"
  >
    <base-scroll :offset-top="scrollTopOffset">
      <main class="discover p-pb15" v-if="state === 'data'">
        <banner :list="banner"></banner>
        <play-list :list="playlist"></play-list>
        <song :list="song"></song>
        <album :list="album"></album>
      </main>
    </base-scroll>
  </base-state>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { stateMixin } from '@/util/mixin';
import { PAGE_WIDTH, PAGE_DPR, COM_HEADER_HEIGHT } from '@/config/param';
import Banner from './children/Banner';
import PlayList from './children/PlayList';
import Song from './children/Song';
import Album from './children/Album';

const { mapActions } = createNamespacedHelpers('discover');
export default {
  name: 'Discover',
  mixins: [stateMixin],
  data() {
    return {
      banner: null,
      album: null,
      playlist: null,
      song: null,
      scrollTopOffset: COM_HEADER_HEIGHT,
    };
  },
  components: {
    Banner,
    Song,
    PlayList,
    Album,
  },
  computed: {
    swiperImgWidth() {
      return Math.floor((PAGE_WIDTH - 15 * 2) * PAGE_DPR);
    },
    swiperImgHeight() {
      return Math.floor((this.swiperImgWidth * 128) / 345);
    },
  },
  methods: {
    ...mapActions(['setBanner', 'setAlbum', 'setPlaylist', 'setSong']),
    async getData(reload) {
      if (reload) this.state = 'load';
      try {
        this.banner = await this.setBanner();
        this.playlist = await this.setPlaylist();
        this.song = await this.setSong();
        this.album = await this.setAlbum();
        await this.$lazy(
          `${this.banner[0].imageUrl}?param=${this.swiperImgWidth}y${this.swiperImgHeight}`
        );
        this.state = 'data';
      } catch (e) {
        this.state = 'error';
        this.error = e.message;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
