<template>
  <base-state :state="state">
    <comment-page
      :count="count"
      :avatar="detail && detail.coverImgUrl"
      :name="detail && detail.name"
      :creator="creator"
      :hot="comment && comment.hotComments"
      :latest="comment && comment.comments"
    />
  </base-state>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { pageReloadMixin, stateMixin } from '@/util/mixin';
import CommentPage from '@/component/CommentPage';

const { mapGetters: playlistGetters, mapActions: playlistActions } =
  createNamespacedHelpers('playlist');
export default {
  name: 'PlaylistCommentDetail',
  mixins: [stateMixin, pageReloadMixin],
  data() {
    return {
      id: this.$route.query.id,
      detail: null,
      comment: null,
      creator: '',
    };
  },
  components: {
    CommentPage,
  },
  computed: {
    ...playlistGetters({
      playlistDetail: 'getPlayListById',
      playlistCreator: 'getPlayListCreatorById',
      playlistComment: 'getPlayListCommentById',
    }),
    count() {
      return this.comment?.total || 0;
    },
  },
  methods: {
    ...playlistActions({
      playlistFunc: 'setPlayListDetail',
      playlistCommentFunc: 'setPlayListComment',
    }),
    async getData() {
      try {
        await this.playlistFunc(this.id);
        await this.playlistCommentFunc(this.id);
        this.detail = this.playlistDetail(this.id);
        this.creator = this.playlistCreator(this.id).nickname || '';
        this.comment = this.playlistComment(this.id);
        this.state = 'data';
      } catch (e) {
        this.state = 'error';
        this.error = e.message;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
