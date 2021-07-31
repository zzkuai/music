<template>
  <nav class="search-nav ignore p-pr">
    <ul class="search-nav-list f-df">
      <li
        class="search-nav-item f-fx1 f-df f-jac"
        v-for="(nav, index) in navs"
        :key="index"
        :class="{ active: type === nav.code }"
        @click="changeNav(nav.code)"
      >
        <base-font :text="nav.name" />
      </li>
    </ul>
    <span
      class="search-nav-line theme-bg-reverse ignore p-pa"
      :style="navLineStyle"
    ></span>
  </nav>
</template>

<script>
import { PAGE_WIDTH, searchType } from '@/config/param';
import { searchMixin } from '@/util/mixin';

const SEARCH_NAV_LINE_WIDTH = 30;
const SEARCH_NAV_ITEM_WIDTH = PAGE_WIDTH / searchType.length;
const SEARCH_NAV_ITEM_HALF_WIDTH = SEARCH_NAV_ITEM_WIDTH / 2;
export default {
  name: 'SearchNav',
  mixins: [searchMixin],
  data() {
    return {
      navs: searchType,
    };
  },
  computed: {
    navLineStyle() {
      const index = this.type === 1 ? 0 : 1;
      return {
        left:
          SEARCH_NAV_ITEM_HALF_WIDTH -
          SEARCH_NAV_LINE_WIDTH / 2 +
          SEARCH_NAV_ITEM_WIDTH * index +
          'px',
      };
    },
  },
  methods: {
    changeNav(code) {
      if (code === this.type) return;
      this.$emit('nav-search', this.keyword, code);
    },
  },
};
</script>

<style lang="scss" scoped>
.search-nav {
  width: 100%;

  &.ignore {
    height: 40px;
  }

  .search-nav-list {
    @include wh(100%);
  }

  .search-nav-item {
    height: 100%;
  }

  .search-nav-line {
    bottom: 0;
    height: 2px;
    border-right: 25px;
    @include ts(left);

    &.ignore {
      width: 30px;
    }
  }
}
</style>
