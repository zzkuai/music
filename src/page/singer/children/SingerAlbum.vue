<template>
  <base-loading v-if="singerLoad" top="50%" />
  <div v-else>
    <ul class="list ignore">
      <li
        class="list_item f-df"
        v-for="data in album"
        :key="data.id"
        @click="goToAlbum(data.id)"
      >
        <div class="list_item-left">
          <img
            v-lazy="`${data.picUrl}?param=120y120`"
            class="list_item-left-img"
            :alt="data.name"
          />
        </div>
        <div class="list_item-right f-df f-fdc f-jcc">
          <base-font class="list_item-right-name line-two" :text="data.name">
            <base-font :text="data.alias | formatAlias" color="text" />
          </base-font>
          <base-font
            class="list_item-right-info"
            size="12"
            color="text"
            :text="getDataInfo(data)"
          />
        </div>
      </li>
    </ul>
    <base-load-more :visible="load" />
  </div>
</template>

<script>
import { singerMixin } from '@/util/mixin';
import { dateFormat } from '@/util/format';

export default {
  name: 'SingerAlbum',
  mixins: [singerMixin],
  data() {
    return {
      album: null,
    };
  },
  filters: {
    formatAlias(alias) {
      return alias?.length > 0 ? ` (${alias[0]})` : '';
    },
  },
  methods: {
    async getData(reload = true) {
      try {
        await this.setAlbum(this.id);
        this.album = this.getSingerAlbumById(this.id).list;
      } catch (e) {
        this.error = e.message;
      } finally {
        if (reload) {
          this.singerLoad = false;
        }
      }
    },
    getDataInfo({ publishTime, size }) {
      const sizeStr = size > 0 ? ` 歌曲${size}` : '';
      return `${dateFormat(publishTime)}${sizeStr}`;
    },
    goToAlbum(id) {
      this.$router.push({ path: '/album', query: { id } });
    },
  },
};
</script>

<style lang="scss" scoped>
.list_item {
  padding: 0 8px;

  .list_item-left {
    position: relative;
    padding: 10px;
    @include wh(80px);
    min-width: 80px;

    .list_item-left-img {
      @include wh(100%);
      border-radius: 5px;
    }
  }

  .list_item-right {
    margin-left: 10px;

    .list_item-right-name {
      max-width: 260px;
    }

    .list_item-right-info {
      margin-top: 8px;
    }
  }
}
</style>
