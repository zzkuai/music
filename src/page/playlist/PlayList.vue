<template>
  <div class="playlist">
    <base-nav-bar text="歌单广场" @right-click="goPlayListTag">
      <template #right>
        <svg-icon icon-class="tag" class="size-sm" />
      </template>
    </base-nav-bar>
    <play-list-nav @nav-click="changeCat"></play-list-nav>
    <base-state :state="state" class="playlist-main">
      <base-scroll
        :theme-bg="false"
        :offset-top="90"
        :scroll-event-enable="enable"
        @bottom-reached="loadMore"
        :bottom-threshold="37"
      >
        <transition name="fade">
          <div class="p-p15" v-show="cat === '全部'">
            <swipe-card
              :cards="cardList"
              :card-width="cardWidthFormat"
              @card-change="changeModalColor"
            />
          </div>
        </transition>
        <div
          class="playlist-high ignore f-df f-aic f-jcb"
          v-show="cat === '精品'"
        >
          <base-font class="playlist-high-title" :text="highCat" size="16" />
          <div
            class="playlist-high-filter theme-bg2 f-df f-aic"
            @click="showHighTag"
          >
            <svg-icon icon-class="filter" class="size-si"></svg-icon>
            <base-font
              class="playlist-high-filter-text"
              text="筛选"
              size="12"
            />
          </div>
        </div>
        <base-loading :theme-bg="false" v-if="highLoad"></base-loading>
        <play-list-item
          v-else
          :crown="cat === '精品'"
          :list="cat === '全部' ? itemList : list"
        ></play-list-item>
        <base-load-more :visible="load" :theme-bg="false"></base-load-more>
      </base-scroll>
    </base-state>
    <div class="playlist-modal p-pf" :style="modalStyle"></div>
    <play-list-high-tag
      ref="highTag"
      :selected="highCat"
      @tag-click="changeHighCat"
    ></play-list-high-tag>
  </div>
</template>

<script>
import { playlistMixin, stateMixin } from '@/util/mixin';
import SwipeCard from '@/component/SwipeCard';
import PlayListNav from './children/PlayListNav';
import PlayListItem from './children/PlayListItem';
import PlayListHighTag from './children/PlayListHighTag';
import { getRelativeSize } from '@/config/param';
import getImageMeanColor from '@/util/color';

export default {
  name: 'PlayList',
  mixins: [stateMixin, playlistMixin],
  data() {
    return {
      list: [],
      cat: '全部', // 歌单类别
      index: 0, // 当前选中tag index
      highCat: '全部', // 精品类别
      highLoad: false,
      enable: true,
      modalColor: 'transparent',
    };
  },
  components: {
    SwipeCard,
    PlayListNav,
    PlayListItem,
    PlayListHighTag,
  },
  activated() {
    if (
      this.cat !== '全部' &&
      !this.userCategory.find(({ name }) => name === this.cat)
    ) {
      // 如果选中的tag被移除 则重新请求数据渲染
      this.changeCat(this.userCategory[this.index].name);
    }
  },
  computed: {
    cardWidthFormat() {
      return getRelativeSize(160);
    },
    cardList() {
      return this.list.filter((item, index) => index < 3);
    },
    itemList() {
      return this.list.filter((item, index) => index > 2);
    },
    modalStyle() {
      // const color = this.$store.state.theme === 'day' ? '#ffffff' : '#15161a';
      return {
        // background: `linear-gradient(to bottom,${ this.modalColor.replace(/\d\)$/, '0.25)') },${ color })`
        backgroundColor: this.modalColor,
      };
    },
  },
  methods: {
    changeCat(name, index) {
      this.cat = name === '推荐' ? '全部' : name;
      if (typeof index === 'number') this.index = index;
      this.state = 'load';
      if (name === '精品') this.highLoad = true;
      this.getData(true);
    },
    changeHighCat(name) {
      this.highCat = name;
      this.highLoad = true;
      this.getData(true);
    },
    showHighTag() {
      this.$refs.highTag.show();
    },
    loadMore() {
      this.enable = false;
      this.getData();
    },
    async changeModalColor(index) {
      const color = await getImageMeanColor({
        imageUrl: `${this.list[index].coverImgUrl}?param=10y10`,
      });
      this.modalColor = color.replace(/\d\)$/, '0.35)');
    },
    async getData(reload = false) {
      try {
        if (this.cat === '精品') {
          await this.getHigh({ category: this.highCat, reload });
          const { list, more } = this.getPlayListOfHigh(this.highCat);
          this.list = list;
          this.enable = more;
        } else {
          await this.getList({ category: this.cat, reload });
          const { list, more } = this.getPlayListOfList(this.cat);
          this.list = list;
          this.enable = more;
        }
        if (reload) this.changeModalColor(0);
        this.state = this.list.length > 0 ? 'data' : 'empty';
      } catch (e) {
        this.state = 'error';
        this.error = e.message;
      } finally {
        this.highLoad = false;
      }
    },
    goPlayListTag() {
      this.$router.push({ path: '/playlist/tag' });
    },
  },
};
</script>

<style lang="scss" scoped>
.playlist {
  @include wh(100%);

  .playlist-main {
    &.ignore {
      padding-top: 90px;
    }
  }

  .playlist-high {
    &.ignore {
      padding: 15px 15px 0;
    }
  }

  .playlist-high-title {
    font-weight: bold;
  }

  .playlist-high-filter {
    padding: 3px 8px;
    border-radius: 15px;
  }

  .playlist-high-filter-text {
    margin-left: 5px;
  }

  .playlist-modal {
    top: 0;
    left: 0;
    z-index: 0;
    @include wh(100%);
    @include ts(background);
  }
}
</style>
