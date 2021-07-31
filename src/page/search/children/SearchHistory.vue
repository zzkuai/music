<template>
  <section class="search-history ignore o-oh" v-if="visible">
    <search-title title="历史记录">
      <template #title-right>
        <span @click="showDialog" class="history-clear">
          <svg-icon icon-class="trash" class="size-sm" />
        </span>
      </template>
    </search-title>
    <nav class="history p-ph15 o-oh">
      <ul class="history-list">
        <li
          class="history-list-item theme-bg2"
          v-for="(item, index) in history"
          :key="index"
          @click="$emit('history-search', item)"
        >
          <base-font :text="item" size="12" />
        </li>
      </ul>
    </nav>
    <base-dialog
      ref="dialog"
      title="确定清空全部历史记录？"
      confirm="清空"
      @confirm="clearHistory"
    ></base-dialog>
  </section>
</template>

<script>
import { searchMixin } from '@/util/mixin';
import SearchTitle from './SearchTitle';

export default {
  name: 'SearchHistory',
  mixins: [searchMixin],
  components: {
    SearchTitle,
  },
  computed: {
    visible() {
      return this.history?.length > 0;
    },
  },
  methods: {
    showDialog() {
      this.$refs.dialog.show();
    },
    clearHistory() {
      this.removeSearchHistory();
    },
  },
};
</script>

<style lang="scss" scoped>
.history {
  margin: 15px 0 20px;
}

.history-clear {
  display: block;
  padding: 5px;
}

.history-list {
  overflow-x: scroll;
  white-space: nowrap;
  font-size: 0;

  .history-list-item {
    display: inline-block;
    border-radius: 15px;
    padding: 5px 10px;

    & + .history-list-item {
      margin-left: 15px;
    }
  }
}
</style>
