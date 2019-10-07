<template>
    <transition name="fade">
        <div class="song-more p-pf" v-show="moreVisible">
            <transition name="slide-down">
                <div class="song-more-content theme ignore p-pa" v-if="data" v-show="moreVisible">
                    <div class="song-more-header p-p15 f-df f-aic">
                        <div class="song-more-header-left">
                            <img class="song-more-header-left-img" :src="avatar" :alt="data.name">
                        </div>
                        <div class="song-more-header-right f-fx1 f-df f-fdc">
                            <base-font :text="`歌曲：${data.name}${data.alia.length>0?`（${data.alia[0]}）`:''}`"/>
                            <base-font class="line-one m-mt5" :text="author" color="text" size="13"/>
                        </div>
                    </div>
                    <ul class="song-more-list">
                        <li class="song-more-list-item f-df"
                            v-for="(item,index) in func"
                            :key="index"
                            @click.stop="item.func()"
                        >
                            <div class="song-more-list-item-left f-df f-aic">
                                <svg-icon :icon-class="item.icon" class="size-lg"/>
                            </div>
                            <div class="song-more-list-item-right f-df f-aic f-fx1">
                                <base-font class="line-one" :text="item.text"/>
                            </div>
                        </li>
                    </ul>
                </div>
            </transition>
            <base-modal @modal-on-click="hide()"></base-modal>
        </div>
    </transition>
</template>

<script>
    import { homeMixin, singerMixin, playMixin } from '@/util/mixin';

    export default {
        name: 'SongMore',
        mixins: [ homeMixin, singerMixin, playMixin ],
        data() {
            return {
                data: null,
                moreVisible: false,
                avatarObj: {}
            };
        },
        computed: {
            avatar() {
                return this.data?.album.picUrl;
            },
            author() {
                return this.data?.artist.map(({ name }) => name).join('/');
            },
            func() {
                return [
                    {
                        icon: 'singer-play',
                        text: '下一首播放',
                        func: async () => {
                            this.playNext(this.data, this.$store.getters[ 'player/playListCount' ] === 0, () => {
                                this.hide();
                                this.$toast('已添加到下一首播放');
                            });
                        }
                    },
                    {
                        icon: 'singer-collect',
                        text: '收藏到歌单',
                        func: async () => {
                            this.hide();
                            this.$toast('已收藏到歌单');
                        }
                    },
                    {
                        icon: 'singer-user',
                        text: `歌手：${this.author}`,
                        func: async () => {
                            this.hide();
                            if (this.data.artist?.length > 1) {
                                this.$emit('show-singer-dialog', this.authorAddAvatar(this.data.artist, this.avatarObj));
                            }
                        }
                    },
                    {
                        icon: 'singer-album',
                        text: `专辑：${this.data.album.name}`,
                        func: async () => {
                            await this.hide();
                            this.goToAlbumPage(this.data.album.id);
                        }
                    },
                ];
            },
        },
        methods: {
            async show(data) {
                this.data = data;
                this.moreVisible = true;
                if (this.data.artist.length > 1) {
                    for await (const { id } of this.data.artist) {
                        await this.setAvatar(id);
                        this.avatarObj[ id ] = this.getSingerAvatarById(id);
                    }
                }
            },
            hide() {
                this.moreVisible = false;
            },
            goToAlbumPage(id) {
                this.$router.push({ path: '/album/detail', query: { id } });
            },
            authorAddAvatar(author, avatarObj) {
                return author.map((item) => {
                    const avatar = avatarObj[ item.id ];
                    return { ...item, avatar };
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
    .song-more {
        bottom: 0;
        left: 0;
        z-index: 888;
        @include wh(100%);

        .song-more-content {
            left: 0;
            bottom: 0;
            width: 100%;
            border-radius: 25px 25px 0 0;

            &.ignore {
                height: 350px;
                max-height: 350px;
            }
        }

        .song-more-header {
            .song-more-header-left {
                margin-right: 15px;
            }

            .song-more-header-left-img {
                display: block;
                @include wh(50px);
                border-radius: 5px;
            }

        }

        .song-more-list {
            padding-left: 15px;

            .song-more-list-item {
                height: 50px;
            }

            .song-more-list-item-left {
                padding-left: 10px;
                width: 50px;
            }
        }
    }
</style>
