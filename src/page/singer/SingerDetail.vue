<template>
  <div class="singer-detail p-pr o-oh" ref="singer">
    <base-nav-bar
      :text="!singerLoad && detail ? detail.name : ''"
      color="white"
      arrow-color="white"
    />
    <div
      ref="banner"
      class="singer-detail-banner p-pa o-oh ignore"
      :style="picUrl !== '' && `background-image:url(${picUrl})`"
      @click="showAvatar"
    >
      <transition name="fade">
        <div v-show="!singerLoad" class="singer-detail-banner-modal p-pa"></div>
      </transition>
    </div>
    <tab
      class="singer-detail-tab"
      :tabs="tabs"
      :is-fixed="true"
      :fixed-top="tabOffsetTop"
      :offset-top="tabOffsetTop"
      @diff-tab-click="changeTab"
    >
      <tab-item>
        <singer-song
          :class="{ 'player-padding': playerVisible }"
          v-if="!songLoad"
          @click-more="showSongMore"
          :song-loading="singerLoad"
        ></singer-song>
      </tab-item>
      <tab-item
        :scroll-event-enable="singerAlbumMoreEnable"
        @bottom-reached="loadMore('singerAlbum', 'getSingerAlbumById')"
      >
        <singer-album
          :class="{ 'player-padding': playerVisible }"
          ref="singerAlbum"
          v-if="!albumLoad"
        ></singer-album>
      </tab-item>
      <tab-item
        :scroll-event-enable="singerVideoMoreEnable"
        @bottom-reached="loadMore('singerVideo', 'getSingerMVById')"
      >
        <singer-video
          :class="{ 'player-padding': playerVisible }"
          ref="singerVideo"
          v-if="!videoLoad"
        ></singer-video>
      </tab-item>
      <tab-item>
        <singer-profile
          :class="{ 'player-padding': playerVisible }"
          v-if="!profileLoad"
          :name="detail ? detail.name : ''"
        ></singer-profile>
      </tab-item>
    </tab>
    <song-more ref="more" @show-singer-dialog="showSingerDialog"></song-more>
    <base-avatar :avatar="picUrl" ref="avatar"></base-avatar>
    <base-dialog
      ref="dialog"
      type="list"
      title="请选择要查看的歌手"
      @item-on-click="goToSingerPage"
    ></base-dialog>
  </div>
</template>

<script>
import { singerMixin } from '@/util/mixin';
import { PAGE_DPR, PAGE_WIDTH } from '@/config/param';
import SingerSong from './children/SingerSong';
import SingerAlbum from './children/SingerAlbum';
import SingerVideo from './children/SingerVideo';
import SingerProfile from './children/SingerProfile';
import SongMore from './children/SongMore';
import Tab from './children/Tab';
import TabItem from './children/TabItem';

const BANNER_HEIGHT = 205;
const TAB_HEIGHT = 50;
const AVATAR_HEIGHT = 300;
export default {
  name: 'SingerDetail',
  mixins: [singerMixin],
  components: {
    SingerSong,
    SingerAlbum,
    SingerVideo,
    SingerProfile,
    SongMore,
    Tab,
    TabItem,
  },
  data() {
    return {
      detail: null,
      error: '',
      picUrl: '',
      avatarVisible: false,
      tabs: ['热门单曲', '专辑', '视频', '艺人信息'],
      tabOffsetTop: BANNER_HEIGHT - TAB_HEIGHT,
      activeTab: 0, // 0:热门单曲 1:专辑 2:视频 3:艺人信息
      songLoad: true,
      albumLoad: true,
      singerAlbumMoreEnable: true,
      singerVideoMoreEnable: true,
      videoLoad: true,
      profileLoad: true,
    };
  },
  activated() {
    if (this.$route.query.id !== this.id) {
      this.id = this.$route.query.id;
      this.picUrl = '';
      this.singerLoad = true;
      this.getData();
    }
  },
  watch: {
    $route(to) {
      if (to.path === '/singer/detail' && to.query.id !== this.id) {
        this.id = to.query.id;
        this.picUrl = '';
        this.singerLoad = true;
        this.getData();
      }
    },
  },
  computed: {
    playerVisible() {
      return this.$store.state.playerVisible;
    },
  },
  methods: {
    async getData() {
      try {
        await this.setDetail(this.id);
        await this.setSong(this.id);
        this.detail = this.getSingerDetailById(this.id);
        const picUrl = `${this.detail.picUrl}?param=${PAGE_WIDTH * PAGE_DPR}y${
          AVATAR_HEIGHT * PAGE_DPR
        }`;
        await this.$lazy(picUrl);
        this.picUrl = picUrl;
      } catch (e) {
        this.error = e.message;
      } finally {
        this.singerLoad = false;
      }
    },
    showAvatar() {
      if (!this.singerLoad) {
        this.$refs.avatar.showAvatar();
      }
    },
    showSongMore(data) {
      this.$refs.more.show(data);
    },
    showSingerDialog(data) {
      this.$refs.dialog.show(data);
    },
    goToSingerPage(id) {
      if (id === +this.id) return;
      this.$router.push({ path: '/singer/detail', query: { id } });
    },
    changeTab(index) {
      this.activeTab = index;
      const loadMap = {
        0: 'songLoad',
        1: 'albumLoad',
        2: 'videoLoad',
        3: 'profileLoad',
      };
      if (this[loadMap[index]]) this[loadMap[index]] = false;
    },
    async loadMore(name, method) {
      this[`${name}MoreEnable`] = false;
      try {
        await this.$refs[name].getData(false);
      } catch (e) {
        this.error = e.message;
      } finally {
        this[`${name}MoreEnable`] = this[method](this.id).more;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.singer-detail {
  @include wh(100%);
}

.singer-detail-banner {
  width: 100%;
  z-index: 100;
  background: url('../../../src/asset/images/placeholder.jpg') no-repeat center
    center;
  background-size: cover;
  @include ps0;

  &.ignore {
    height: 205px;
  }

  .singer-detail-banner-modal {
    z-index: 10;
    background-color: rgba(0, 0, 0, 0.3);
    @include ps0;
  }

  .singer-detail-banner-name {
    z-index: 20;
    left: 20px;
    bottom: 100px;
  }
}

.singer-detail-tab {
  z-index: 200;

  .player-padding {
    padding-bottom: 50px;
  }
}

.singer-detail-content-list {
  background-color: white;
}
</style>

<style lang="scss">
.singer-detail {
  .singer-scroll {
    bottom: 0;
    z-index: 201;
  }

  &-tab {
    .k-tab-wrapper {
      border-radius: 25px 25px 0 0;
    }
  }
}
</style>
