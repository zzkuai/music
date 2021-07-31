<template>
  <section class="search-hot ignore o-oh">
    <search-title title="热搜榜"></search-title>
    <ul class="search-hot-list">
      <li
        class="search-hot-list-item f-df f-aic"
        v-for="(item, index) in hot"
        :key="index"
        @click="search(item.searchWord)"
      >
        <base-font
          class="search-hot-list-item-index f-df f-jac"
          :text="index + 1"
          :color="index < 3 ? 'title' : 'text'"
        />
        <div class="search-hot-list-item-right f-fx1 f-df f-fdc">
          <p class="f-df f-aic">
            <base-font :text="item.searchWord"></base-font>
            <base-font
              :text="item.score"
              class="hot-score"
              size="12"
              color="text"
            />
            <img
              class="hot-icon"
              v-if="item.iconUrl"
              :src="item.iconUrl"
              alt="icon"
            />
          </p>
          <base-font
            class="m-mt5"
            :text="item.content"
            size="12"
            color="text"
          />
        </div>
      </li>
    </ul>
  </section>
</template>

<script>
import { searchMixin } from '@/util/mixin';
import SearchTitle from './SearchTitle';

export default {
  name: 'SearchHot',
  mixins: [searchMixin],
  components: {
    SearchTitle,
  },
  methods: {
    search(keyword) {
      this.$emit('hot-search', keyword);
    },
  },
};
</script>

<style lang="scss" scoped>
.search-hot {
  padding-bottom: 25px;

  .search-hot-list-item {
    margin-top: 25px;
  }

  .search-hot-list-item-index {
    min-width: 50px;
    flex: 0 0 50px;
  }

  .hot-score {
    margin-left: 4px;
  }

  .hot-icon {
    margin-left: 15px;
    height: 15px;
  }
}
</style>
