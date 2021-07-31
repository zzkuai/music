<template>
  <row-item title="推荐歌曲" :list="filterList" @item-click="goPlayDetail" />
</template>

<script>
import childMixin from './index.js';
import { playMixin } from '@/util/mixin';

export default {
  name: 'Song',
  mixins: [childMixin, playMixin],
  computed: {
    filterList() {
      return this.list.map(({ id, name, al, ar }) => ({
        id,
        name,
        url: al.picUrl,
        desc: ar.map(({ name }) => name).join('/'),
      }));
    },
  },
  methods: {
    async goPlayDetail(data, index) {
      const { al: album, ar: artist, ...other } = this.list[index];
      this.playNext(
        { album, artist, ...other },
        true,
        () => {
          this.$router.push({ path: '/play/detail', query: { id: other.id } });
        },
        !this.playCache[other.id]
      );
    },
  },
};
</script>

<style lang="scss" scoped></style>
