<template>
  <row-item
    title="推荐专辑"
    tip="更多新碟"
    :list="filterList"
    @tip-click="goAlbumList"
    @item-click="goAlbumDetail"
  />
</template>

<script>
import childMixin from './index.js';

export default {
  name: 'Album',
  mixins: [childMixin],
  computed: {
    filterList() {
      return this.list.map(({ id, name, url, artist }) => ({
        id,
        name,
        url,
        desc: artist.name,
      }));
    },
  },
  methods: {
    goAlbumDetail({ id }) {
      this.$router.push({ path: '/album/detail', query: { id } });
    },
    goAlbumList() {
      this.$router.push({ path: '/album' });
    },
  },
};
</script>

<style lang="scss" scoped></style>
