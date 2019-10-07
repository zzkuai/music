<template>
    <div class="playlist-category">
        <base-nav-bar :text="query" class="theme"/>
        <base-state :state="state">
            <base-scroll nav-bar :scroll-event-enable="enable" @bottom-reached="loadMore">
                <play-list-item :list="list"></play-list-item>
            </base-scroll>
        </base-state>
    </div>
</template>

<script>
    import { playlistMixin, stateMixin } from '@/util/mixin';
    import PlayListItem from './children/PlayListItem';

    export default {
        name: 'PlayListCategory',
        mixins: [ stateMixin, playlistMixin ],
        data() {
            return {
                list: [],
                enable: true,
                query: this.$route.query.category
            };
        },
        activated() {
            if (this.query !== this.$route.query.category) {
                this.query = this.$route.query.category;
                this.state = 'load';
                this.getData();
            }
        },
        components: {
            PlayListItem
        },
        methods: {
            async getData() {
                try {
                    await this.getList(this.query);
                    const { list, more } = this.getPlayListOfList(this.query);
                    this.list = list;
                    this.enable = more;
                    this.state = 'data';
                } catch (e) {
                    this.state = 'error';
                    this.error = e.message;
                }
            },
            loadMore() {
                this.getData();
            }
        }
    };
</script>

<style lang="scss" scoped>

</style>
