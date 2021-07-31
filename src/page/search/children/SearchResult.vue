<template>
  <base-scroll
    :offset-top="scrollTopOffset"
    @bottom-reached="loadMore(false)"
    :scroll-event-enable="scrollEventEnable"
  >
    <keep-alive>
      <component :is="searchComponent" :list="list"></component>
    </keep-alive>
    <base-load-more :visible="load"></base-load-more>
    <base-reload :visible="reload" @reload-more="loadMore"></base-reload>
  </base-scroll>
</template>

<script>
import { searchMixin } from '@/util/mixin';
import { NAV_BAR_HEIGHT, searchType } from '@/config/param';
import SearchSong from './SearchSong';
import SearchSinger from './SearchSinger';

const SEARCH_NAV_HEIGHT = 40;
export default {
  name: 'SearchResult',
  mixins: [searchMixin],
  data() {
    return {
      list: [],
      reload: false,
      scrollEventEnable: true,
      searchComponent: 'SearchSong',
      scrollTopOffset: NAV_BAR_HEIGHT + SEARCH_NAV_HEIGHT,
    };
  },
  components: {
    SearchSong,
    SearchSinger,
  },
  mounted() {
    const { component } = searchType.find(({ code }) => code === this.type);
    this.list = Object.freeze(this.getSearchResult(this.keyword, this.type));
    this.searchComponent = component;
  },
  methods: {
    async loadMore(reload) {
      if (this.reload) this.reload = false;
      this.scrollEventEnable = false;
      try {
        await this.setSearch({
          keyword: this.keyword,
          type: this.type,
          reload,
        });
        this.list = Object.freeze(
          this.getSearchResult(this.keyword, this.type)
        );
      } catch (e) {
        this.reload = true;
      } finally {
        this.scrollEventEnable = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
