<template>
  <row-item
    title="推荐歌单"
    tip="歌单广场"
    :list="filterList"
    @tip-click="goPlayList"
    @item-click="goPlayListDetail"
  />
</template>

<script>
import childMixin from './index.js';
import { numberFormat } from '@/util/format';

export default {
  name: 'PlayList',
  mixins: [childMixin],
  computed: {
    filterList() {
      return this.list.map(({ id, name, picUrl, playCount }) => ({
        id,
        name,
        url: picUrl,
        tip: numberFormat(playCount),
      }));
    },
  },
  methods: {
    goPlayListDetail(data) {
      this.$router.push({ path: '/playlist/detail', query: { id: data.id } });
    },
    goPlayList() {
      this.$router.push({ path: '/playlist' });
    },
  },
};
</script>

<style lang="scss" scoped></style>
