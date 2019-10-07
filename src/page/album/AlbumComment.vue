<template>
    <base-state :state="state">
        <comment-page
                cd
                :count="count"
                :avatar="detail&&detail.picUrl"
                :name="detail&&detail.name"
                :author="author"
                :hot="comment&&comment.hotComments"
                :latest="comment&&comment.comments"
        />
    </base-state>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex';
    import { pageReloadMixin, stateMixin } from '@/util/mixin';
    import CommentPage from '@/component/CommentPage';

    const { mapGetters: albumGetters, mapActions: albumActions } = createNamespacedHelpers('album');
    export default {
        name: 'AlbumCommentDetail',
        mixins: [ stateMixin, pageReloadMixin ],
        data() {
            return {
                id: this.$route.query.id,
                detail: null,
                comment: null
            };
        },
        components: {
            CommentPage
        },
        computed: {
            ...albumGetters({
                albumDetail: 'getAlbumById',
                albumComment: 'getAlbumCommentById'
            }),
            count() {
                return this.comment?.total || 0;
            },
            author() {
                return this.detail?.artists || '';
            }
        },
        methods: {
            ...albumActions({
                albumFunc: 'setAlbumDetail',
                albumCommentFunc: 'setAlbumComment'
            }),
            async getData() {
                try {
                    await this.albumFunc(this.id);
                    await this.albumCommentFunc(this.id);
                    this.detail = this.albumDetail(this.id);
                    this.comment = this.albumComment(this.id);
                    this.state = 'data';
                } catch (e) {
                    this.state = 'error';
                    this.error = e.message;
                }
            }
        }
    };
</script>

<style lang="scss" scoped>

</style>
