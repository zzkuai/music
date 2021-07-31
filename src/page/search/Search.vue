<template>
  <div class="search ignore">
    <search-input
      @input-search="search"
      @cancel-search="cancelSearch"
      :hot-visible="hotVisible"
    ></search-input>
    <search-nav @nav-search="search" v-if="!hotVisible"></search-nav>
    <base-state :state="state">
      <search-history
        @history-search="search"
        v-if="hotVisible"
      ></search-history>
      <search-hot @hot-search="search" v-if="hotVisible"></search-hot>
      <search-result v-else></search-result>
    </base-state>
  </div>
</template>

<script>
import { stateMixin, searchMixin } from '@/util/mixin';
import SearchInput from './children/SearchInput';
import SearchNav from './children/SearchNav';
import SearchHot from './children/SearchHot';
import SearchHistory from './children/SearchHistory';
import SearchResult from './children/SearchResult';

export default {
  name: 'Search',
  mixins: [stateMixin, searchMixin],
  data() {
    return {
      hotVisible: true,
    };
  },
  components: {
    SearchInput,
    SearchNav,
    SearchHot,
    SearchHistory,
    SearchResult,
  },
  beforeDestroy() {
    this.resetSearch();
  },
  watch: {
    $route(to, from) {
      if (
        to.path !== '/play/detail' &&
        to.path !== '/singer/detail' &&
        from.path === '/search'
      ) {
        this.state = 'data';
        this.hotVisible = true;
        this.resetSearch();
      }
    },
  },
  methods: {
    async getData() {
      try {
        await this.setHotSearch();
        await this.initSearchHistory();
        this.state = 'data';
      } catch (e) {
        this.error = e.message;
        this.state = 'error';
      }
    },
    async search(keyword, type = this.type) {
      if (this.hotVisible) this.hotVisible = false;
      this.setSearchType(type);
      this.setSearchKeyword(keyword);
      this.setSearchHistory(keyword);
      this.state = 'load';
      try {
        await this.setSearch({ keyword, type });
        if (!this.hotVisible) {
          const list = Object.freeze(
            this.getSearchResult(this.keyword, this.type)
          );
          this.state = list?.length > 0 ? 'data' : 'empty';
        }
      } catch (e) {
        this.error = e.message;
        this.state = 'error';
      }
    },
    cancelSearch() {
      this.hotVisible = true;
      this.state = 'data';
    },
  },
};
</script>

<style lang="scss" scoped>
.search {
  &.ignore {
    padding-top: 50px;
  }
}
</style>
