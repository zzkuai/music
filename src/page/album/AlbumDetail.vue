<template>
  <base-state :state="state">
    <cover-page
      title="专辑"
      :cd="true"
      :cover="detail && detail.picUrl"
      :name="detail && detail.name"
      :time="timeFormat"
      :desc="detail && detail.description"
      :avatar="artist && artist.picUrl"
      :author="artist && artist.name"
      :author-func="goToSinger"
      :items="items"
      :list="song"
      @item-click="playSong"
      @desc-click="showDesc"
    />
    <cover-modal
      cd
      ref="modal"
      v-if="detail && detail.description"
      :cover="detail && detail.picUrl"
      :title="detail && detail.name"
      :desc="detail && detail.description"
      :type="typeFormat"
      :company="companyFormat"
    />
  </base-state>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { stateMixin, playMixin, pageReloadMixin } from '@/util/mixin';
import CoverPage from '@/component/CoverPage';
import CoverModal from '@/component/CoverModal';
import { dateFormat } from '@/util/format';

const { mapGetters, mapActions } = createNamespacedHelpers('album');
export default {
  name: 'AlbumDetail',
  mixins: [stateMixin, playMixin, pageReloadMixin],
  data() {
    return {
      id: this.$route.query.id,
      detail: null,
      song: null,
      artist: null,
      comment: null,
    };
  },
  components: {
    CoverPage,
    CoverModal,
  },
  computed: {
    ...mapGetters({
      getAlbum: 'getAlbumById',
      getSong: 'getAlbumSongById',
      getComment: 'getAlbumCommentById',
    }),
    timeFormat() {
      if (!this.detail?.publishTime) return '';
      return `发行时间：${dateFormat(this.detail.publishTime)}`;
    },
    companyFormat() {
      if (!this.detail?.company) return '';
      return `发行公司：${this.detail.company}`;
    },
    typeFormat() {
      if (!this.detail?.subType) return '';
      return `专辑类别：${this.detail.subType}`;
    },
    items() {
      return [
        {
          icon: 'play',
          text: '播放',
          func: () => this.playSong(this.song[0], this.song, true),
        },
        { icon: 'list', text: this.song?.length },
        {
          icon: 'comment',
          text: this.comment?.total,
          func: () => this.goToComment(),
        },
      ];
    },
  },
  methods: {
    ...mapActions(['setAlbumDetail', 'setAlbumComment']),
    async getData() {
      try {
        await this.setAlbumDetail(this.id);
        await this.setAlbumComment(this.id);
        this.detail = this.getAlbum(this.id);
        this.artist = this.detail.artist;
        this.song = this.getSong(this.id);
        this.comment = this.getComment(this.id);
        this.state = 'data';
      } catch (e) {
        this.error = e.message;
        this.state = 'error';
      }
    },
    showDesc() {
      this.$refs.modal.show();
    },
    goToSinger() {
      this.$router.push({
        path: '/singer/detail',
        query: { id: this.detail?.artist.id },
      });
    },
    goToComment() {
      this.$router.push({ path: '/album/comment', query: { id: this.id } });
    },
  },
};
</script>

<style lang="scss" scoped></style>
