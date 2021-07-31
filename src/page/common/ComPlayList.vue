<template>
  <transition name="fade">
    <div class="com_playlist p-pf" v-show="playlistVisible">
      <transition name="slide-down">
        <div class="com_playlist-wrapper p-pa ignore" v-show="playlistVisible">
          <div class="com_playlist-header theme f-df f-aic f-jcb ignore">
            <div
              class="com_playlist-header-left f-df f-aic"
              @click="changePlayType(false)"
            >
              <div class="com_playlist-header-left-icon f-df f-aic size-mg">
                <svg-icon
                  :icon-class="playTypeIcon"
                  :class="playTypeIconSizeSmall"
                />
              </div>
              <base-font
                class="com_playlist-header-left-text f-df f-aic"
                :text="`${playTypeText}(${playListCount})`"
              />
            </div>
            <div
              class="com_playlist-header-right f-df f-aic f-jce"
              @click="showDialog()"
            >
              <div class="com_playlist-header-right-icon f-df f-aic f-jce">
                <svg-icon icon-class="trash" class="size-sm" />
              </div>
            </div>
          </div>
          <div class="com_playlist-list-wrapper theme ignore" ref="list">
            <ul class="com_playlist-list ignore">
              <li
                class="com_playlist-list-item f-df f-aic f-jcb"
                :class="{ 'list-item-active': curSongActive(data.id) }"
                v-for="data in playList"
                :key="data.id"
                @click="playSong(data)"
              >
                <div class="list-item-left f-df f-aic">
                  <svg-icon
                    v-if="curSongActive(data.id)"
                    icon-class="sound"
                    class="size-md list-item-left-icon"
                  />
                  <base-font class="line-one" text="" color="text">
                    <base-font :text="data.name" />
                    <base-font :text="alia(data.alia)" color="text" />
                    <base-font :text="author(data)" size="12" color="text" />
                  </base-font>
                </div>
                <div class="list-item-right" @click.stop="removeSong(data.id)">
                  <svg-icon icon-class="close" class="size-sm" />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
      <base-modal @modal-on-click="hidePlayList()"></base-modal>
      <base-dialog
        ref="dialog"
        title="确定要清空播放列表？"
        confirm="清空"
        @confirm="cleanSong"
      />
    </div>
  </transition>
</template>

<script>
import { homeMixin, playerMixin } from '@/util/mixin';

const LIST_HALE_HEIGHT = 350 / 2;
export default {
  name: 'ComPlayList',
  mixins: [homeMixin, playerMixin],
  data() {
    return {
      list: [],
      dialogVisible: false,
    };
  },
  watch: {
    playlistVisible(val) {
      if (val && this.$refs.list) {
        this.$nextTick(() => {
          this.scrollToCurrentSong();
        });
      }
    },
    playId(val) {
      if (val && this.$refs.list && this.playlistVisible) {
        this.$nextTick(() => {
          this.scrollToCurrentSong();
        });
      }
    },
  },
  methods: {
    alia(alia) {
      if (!alia || alia.length < 1) return '';
      return ` (${alia[0]})`;
    },
    author({ artist }) {
      if (!artist || artist.length < 1) return '';
      return ` - ${artist.map(({ name }) => name).join('/')}`;
    },
    showDialog() {
      this.$refs.dialog.show();
    },
    hidePlayList() {
      this.setPlayListVisible(false);
    },
    scrollToCurrentSong() {
      if (this.playListCount > 0) {
        const activeElOffsetTop =
          document.querySelector('.list-item-active')?.offsetTop;
        if (activeElOffsetTop) {
          this.$refs.list.scrollTo({
            left: 0,
            top: activeElOffsetTop - LIST_HALE_HEIGHT,
            behavior: 'smooth',
          });
        }
      }
    },
    async removeSong(songId) {
      const playSongIndex = this.playList.findIndex(
        ({ id }) => id === this.playId
      );
      this.list = this.playList.filter(({ id }) => songId !== id);
      await this.setPlayList(this.list);
      if (this.playListCount === 0) return this.cleanSong();
      if (songId === this.playId && this.playListCount > 0) {
        await this.changePlaySong({ isClick: true, playSongIndex });
      }
      this.scrollToCurrentSong();
    },
    async cleanSong() {
      await this.resetPlay();
      await this.setPlayListVisible(false);
      await this.setPlayerVisible(false);
      if (this.$route.path === '/play/detail') this.$router.back();
    },
    playSong(song) {
      if (song.id !== this.playId) {
        this.setPlayInfo(song);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.com_playlist {
  bottom: 0;
  left: 0;
  z-index: 999;
  @include wh(100%);

  .com_playlist-wrapper {
    bottom: 0;
    left: 0;
    width: 100%;

    .com_playlist-header {
      width: 100%;
      z-index: 10;
      padding-left: 10px;
      border-radius: 25px 25px 0 0;

      &.ignore {
        height: 50px;
      }
    }

    .com_playlist-header-left {
      height: 100%;
    }

    .com_playlist-header-left-text {
      height: 100%;
      margin-left: 10px;
    }

    .com_playlist-header-right {
      width: 40px;
      height: 100%;
      padding: 15px 10px 15px 0;
    }

    .com_playlist-header-right-icon {
      width: 100%;
      height: 15px;
    }

    .com_playlist-list-wrapper {
      width: 100%;
      overflow-y: scroll;

      &.ignore {
        height: 350px;
        max-height: 350px;
      }
    }

    .com_playlist-list-item {
      padding: 20px 10px 0;

      &:last-child {
        padding-bottom: 20px;
      }
    }

    .list-item-left-icon {
      margin-right: 10px;
    }

    .list-item-right {
      padding-left: 10px;
    }
  }
}
</style>
