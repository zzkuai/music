<template>
  <base-state :state="state">
    <cover-page
      title="歌单"
      :cd="false"
      :cover="detail && detail.coverImgUrl"
      :count="detail && detail.playCount"
      :name="detail && detail.name"
      :time="timeFormat"
      :desc="detail && detail.description"
      :avatar="creator && creator.avatarUrl"
      :author="creator && creator.nickname"
      :items="items"
      :list="song"
      @item-click="playSong"
      @desc-click="showDesc"
    >
      <div class="subscriber p-p15 f-df f-aic f-jcb">
        <ul class="subscriber-list f-df">
          <li
            class="subscriber-list-item"
            v-for="(data, index) in filterSubscriber"
            :key="index"
          >
            <img
              class="subscriber-list-item-img"
              :src="data.avatarUrl | filterAvatar"
              alt="avatar"
            />
          </li>
        </ul>
        <div class="subscriber-count">
          <base-font :text="`${subscriber && subscriber.count}人收藏`" />
        </div>
      </div>
    </cover-page>
    <cover-modal
      ref="modal"
      :cover="detail && detail.coverImgUrl"
      :title="detail && detail.name"
      :desc="detail && detail.description"
      :tags="detail && detail.tags"
    />
  </base-state>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import CoverPage from '@/component/CoverPage';
import CoverModal from '@/component/CoverModal';
import { stateMixin, playMixin, pageReloadMixin } from '@/util/mixin';
import { dateFormat } from '@/util/format';
import { PAGE_DPR } from '@/config/param';

const SUBSCRIBER_AVATAR_SIZE = 30;
const { mapGetters, mapActions } = createNamespacedHelpers('playlist');
export default {
  name: 'PlayListDetail',
  mixins: [stateMixin, playMixin, pageReloadMixin],
  data() {
    return {
      id: this.$route.query.id,
      detail: null,
      song: null,
      creator: null,
      subscriber: null,
    };
  },
  components: {
    CoverPage,
    CoverModal,
  },
  computed: {
    ...mapGetters({
      getDetail: 'getPlayListById',
      getSong: 'getPlayListSongById',
      getCreator: 'getPlayListCreatorById',
      getSubscriber: 'getPlayListSubscriberById',
    }),
    timeFormat() {
      if (!this.detail?.createTime) return '';
      return `创建时间：${dateFormat(this.detail.createTime)}`;
    },
    items() {
      return [
        {
          icon: 'play',
          text: '播放',
          func: () => this.playSong(this.song[0], this.song, true),
        },
        {
          icon: 'comment',
          text: this.detail?.commentCount,
          func: () => this.goToComment(),
        },
        { icon: 'singer-collect', text: this.subscriber?.count },
        { icon: 'share', text: this.detail?.shareCount },
      ];
    },
    filterSubscriber() {
      return this.subscriber?.list.filter((item, index) => index < 5) || [];
    },
  },
  filters: {
    filterAvatar(url) {
      return `${url}?param=${SUBSCRIBER_AVATAR_SIZE * PAGE_DPR}y${
        SUBSCRIBER_AVATAR_SIZE * PAGE_DPR
      }`;
    },
  },
  methods: {
    ...mapActions(['setPlayListDetail', 'setPlayListComment']),
    async getData() {
      try {
        await this.setPlayListDetail(this.id);
        await this.setPlayListComment(this.id);
        this.detail = this.getDetail(this.id);
        this.song = this.getSong(this.id);
        this.creator = this.getCreator(this.id);
        this.subscriber = this.getSubscriber(this.id);
        this.state = 'data';
      } catch (e) {
        this.state = 'error';
      }
    },
    showDesc() {
      this.$refs.modal.show();
    },
    goToComment() {
      this.$router.push({ path: '/playlist/comment', query: { id: this.id } });
    },
  },
};
</script>

<style lang="scss" scoped>
.subscriber {
  width: 100%;

  .subscriber-list-item {
    margin-right: 15px;
  }

  .subscriber-list-item-img {
    display: block;
    @include wh(30px);
    border-radius: 50%;
  }
}
</style>
