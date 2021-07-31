<template>
  <div class="album p-pr">
    <base-nav-bar text="新碟上架" class="theme"></base-nav-bar>
    <base-state :state="state">
      <base-scroll
        nav-bar
        :scroll-event-enable="enable"
        @bottom-reached="loadMore"
      >
        <ul>
          <li
            class="list-block ignore"
            v-for="(album, index) in albums"
            :key="index"
          >
            <base-font
              v-if="album.list.length && album.date"
              class="list-block-title m-mt15"
              :text="`${album.date.month}月`"
            >
              <base-font
                class="list-block-text"
                :text="` /${album.date.year}`"
                color="text"
                size="12"
              ></base-font>
            </base-font>
            <base-font
              v-else
              class="list-block-title m-mt15"
              :text="album.title"
              size="16"
            ></base-font>
            <ul class="f-df f-jcb f-fww">
              <li
                class="list-item p-pr f-df f-fdc"
                :class="{ mr: (index + 1) % 2 === 0 }"
                v-for="(data, index) in album.list"
                :key="index"
                :style="listItemStyle"
                @click="goToAlbumDetail(data.id)"
              >
                <div class="list-item-card">
                  <img
                    class="list-item-img"
                    v-lazy="
                      `${data.picUrl}?param=${listItemImgSize}y${listItemImgSize}`
                    "
                    alt="cover"
                  />
                  <base-font class="m-mt5 line-two" :text="data.name" />
                  <base-font
                    class="m-mt5 line-two"
                    :text="data.artists | artistsFilter"
                    size="12"
                    color="text"
                  />
                </div>
                <div
                  class="list-item-cd ignore p-pa"
                  :class="{ 'day-shadow': $store.state.theme === 'day' }"
                  :style="listItemCdStyle"
                ></div>
              </li>
            </ul>
          </li>
        </ul>
        <base-load-more :visible="load" />
      </base-scroll>
    </base-state>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { stateMixin } from '@/util/mixin';
import { getRelativeSize, PAGE_DPR } from '@/config/param';

const { mapState, mapActions } = createNamespacedHelpers('album');
const LIST_ITEM_WIDTH = getRelativeSize(140);
export default {
  name: 'Album',
  mixins: [stateMixin],
  data() {
    return {
      albums: [],
      enable: true,
      width: LIST_ITEM_WIDTH,
    };
  },
  filters: {
    artistsFilter(artists) {
      return artists.map(({ name }) => name).join('/');
    },
  },
  computed: {
    ...mapState(['load', 'list']),
    listItemStyle() {
      return {
        width: this.width + 'px',
      };
    },
    listItemImgSize() {
      return this.width * PAGE_DPR;
    },
    listItemCdStyle() {
      const endColor =
        this.$store.state.theme === 'day'
          ? 'rgba(0,0,0,0.7)'
          : 'rgba(255,255,255,0.04)';
      return {
        top: getRelativeSize(5) + 'px',
        right: '-' + getRelativeSize(15) + 'px',
        width: getRelativeSize(130) + 'px',
        height: getRelativeSize(130) + 'px',
        background: `linear-gradient(to right, rgba(0,0,0,1), ${endColor})`,
      };
    },
  },
  methods: {
    ...mapActions(['setAlbumList']),
    async getData() {
      try {
        await this.setAlbumList();
        this.albums = this.list.albums;
        this.enable = this.list.more;
        this.state = 'data';
      } catch (e) {
        this.state = 'error';
      }
    },
    loadMore() {
      this.enable = false;
      this.getData();
    },
    goToAlbumDetail(id) {
      this.$router.push({ path: '/album/detail', query: { id } });
    },
  },
};
</script>

<style lang="scss" scoped>
.album {
  @include wh(100%);

  .list-block {
    &.ignore {
      padding: 0 15px 15px;
    }

    .list-block-title {
      display: block;
      font-weight: 700;
    }

    .list-block-text {
      vertical-align: bottom;
    }
  }

  .list-item {
    margin-top: 15px;

    &.mr {
      margin-right: 15px;
    }
  }

  .list-item-card {
    z-index: 10;
  }

  .list-item-img {
    display: block;
    width: 100%;
    border-radius: 5px;
  }

  .list-item-cd {
    z-index: 5;
    border-radius: 50%;

    &.day-shadow {
      box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.8);
    }
  }
}
</style>
