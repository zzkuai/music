<template>
  <base-state
    :state="state"
    :error="error"
    :home="true"
    @reload="getData(true)"
  >
    <template v-slot:head>
      <div class="top theme p-pf ignore">
        <div class="tab-wrapper p-ph15 theme ignore">
          <div
            class="tab f-df f-jcb f-aic"
            @click="filterVisible = !filterVisible"
          >
            <base-font :text="tabName" color="text" />
            <div class="tab-right">
              <svg-icon icon-class="filter" class="tab-right-icon size-ss" />
              <base-font text="筛选" size="14" />
            </div>
          </div>
        </div>
        <transition name="slide-up">
          <ul class="cat theme f-df" v-show="filterVisible">
            <li
              v-for="cat in cats"
              :key="cat.cat"
              class="cat_item p-pv15 f-df f-jac"
              @click="changeCat(cat)"
            >
              <base-font
                :text="cat.name"
                :color="cat.name | highLight(tabName)"
                size="12"
              />
            </li>
          </ul>
        </transition>
      </div>
    </template>
    <base-scroll
      :scroll-event-enable="scrollEventEnable"
      :offset-top="scrollTopOffset"
      @bottom-reached="loadMore(false)"
    >
      <com-singer
        class="singer-list"
        :list="singer"
        @com-singer-click="hideFilter"
      />
      <base-load-more :visible="load" />
      <base-reload :visible="state === 'reload'" @reload-more="loadMore" />
    </base-scroll>
  </base-state>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { stateMixin } from '@/util/mixin';
import { singerCat } from '@/config/param';
import ComSinger from '../common/ComSinger';

const CAT_HEIGHT = 50;
const { mapState, mapActions } = createNamespacedHelpers('singer');
export default {
  name: 'Singer',
  mixins: [stateMixin],
  data() {
    return {
      singer: null,
      tabName: '热门歌手',
      filterVisible: false,
      cats: singerCat,
      scrollTopOffset: CAT_HEIGHT,
      scrollEventEnable: true,
    };
  },
  components: {
    ComSinger,
  },
  computed: {
    ...mapState(['hot', 'list', 'load']),
  },
  filters: {
    highLight(catName, tabName) {
      return catName === tabName ? 'title' : 'text';
    },
  },
  methods: {
    ...mapActions(['setSingerHotList', 'setSingerList']),
    async getData(reload) {
      if (reload) this.state = 'load';
      try {
        if (this.tabName === '热门歌手') {
          await this.setSingerHotList({});
          this.singer = this.hot.artists;
        } else {
          await this.setSingerList({ cat: this.cat });
          this.singer = this.list[this.cat].artists;
        }
        this.state = 'data';
      } catch (e) {
        this.state = this.singer ? 'reload' : 'error';
        this.error = e.message;
      } finally {
        this.scrollEventEnable = true;
      }
    },
    changeCat({ name, cat }) {
      if (this.tabName === name) return;
      this.filterVisible = false;
      this.tabName = name;
      this.cat = cat;
      this.getData(true);
    },
    hideFilter() {
      if (this.filterVisible) this.filterVisible = false;
    },
    loadMore(reload) {
      if (reload) this.state = 'data';
      this.scrollEventEnable = false;
      this.getData(false);
    },
  },
};
</script>

<style lang="scss" scoped>
.top {
  left: 0;
  width: 100%;
  z-index: 200;

  &.ignore {
    top: 50px;
    height: 50px;
  }

  .tab-wrapper {
    position: relative;
    height: 100%;
    z-index: 100;

    &.ignore {
      padding-top: 23px;
      padding-bottom: 8px;
    }

    .tab {
      position: relative;
      height: 20px;
    }

    .tab-right-icon {
      margin-right: 5px;
      vertical-align: middle;
    }
  }

  .cat {
    position: absolute;
    left: 0;
    flex-wrap: wrap;
    width: 100%;
    z-index: 10;

    .cat_item {
      width: 75px;
    }
  }
}

.singer-list {
  &.ignore {
    padding-top: 65px;
  }
}
</style>
