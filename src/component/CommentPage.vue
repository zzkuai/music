<template>
    <div class="comment-page">
        <base-nav-bar class="theme-bg" :text="title"/>
        <transition name="slide-up">
            <div class="comment-fix ignore p-pf theme-bg2" v-show="fixText">
                <base-font :text="fixText"/>
            </div>
        </transition>
        <base-scroll nav-bar @handle-scroll="onScroll">
            <div class="comment-card f-df">
                <div class="card-left p-pr" :class="{cd}">
                    <img class="card-left-avatar p-pr" v-lazy="avatarFormat" alt="avatar">
                </div>
                <div class="card-right f-df f-fx1 f-fdc f-jcc">
                    <base-font class="line-two" :text="name"/>
                    <base-font class="card-right-author line-one" :text="authorFormat" color="text" size="12"/>
                </div>
            </div>
            <div class="comment-wrapper theme-bg2">
                <div class="comment p-p15 theme-bg" v-if="hot&&hot.length>0">
                    <base-font ref="hotTitle" class="comment-title" text="精彩评论"/>
                    <ul class="comment-list o-oh">
                        <li class="comment-list-item m-mt15 f-df" v-for="(data,index) in hotFormat" :key="index">
                            <div class="comment-list-item-avatar f-df">
                                <img class="avatar-img" v-lazy="`${data.avatar}?param=${userAvatarSize}y${userAvatarSize}`" alt="avatar">
                            </div>
                            <div class="comment-list-item-content f-fx1 f-df f-fdc">
                                <div class="content-top f-df f-fdc">
                                    <div class="content-top-user f-df f-jcb f-aic">
                                        <base-font :text="data.name" color="text" size="12"/>
                                        <p class="f-df f-aic">
                                            <base-font :text="data.count" color="text" size="12"/>
                                            <svg-icon icon-class="hand" class="content-icon size-ss"></svg-icon>
                                        </p>
                                    </div>
                                    <base-font class="content-top-time" :text="data.time | commentTimeFormat" color="text" size="10"/>
                                </div>
                                <div class="content-bottom f-df">
                                    <base-font :text="data.content | contentFilter" size="12"/>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="comment p-p15 theme-bg">
                    <base-font ref="latestTitle" class="comment-title" text="最新评论">
                        &nbsp;<base-font :text="count" color="text" size="12"/>
                    </base-font>
                    <ul class="comment-list o-oh" v-if="latest&&latest.length>0">
                        <li class="comment-list-item m-mt15 f-df" v-for="(data,index) in latestFormat" :key="index">
                            <div class="comment-list-item-avatar f-df">
                                <img class="avatar-img" v-lazy="`${data.avatar}?param=${userAvatarSize}y${userAvatarSize}`" alt="avatar">
                            </div>
                            <div class="comment-list-item-content f-fx1 f-df f-fdc">
                                <div class="content-top f-df f-fdc">
                                    <div class="content-top-user f-df f-jcb f-aic">
                                        <base-font :text="data.name" color="text" size="12"/>
                                        <p class="f-df f-aic">
                                            <base-font :text="data.count" color="text" size="12"/>
                                            <svg-icon icon-class="hand" class="content-icon size-ss"></svg-icon>
                                        </p>
                                    </div>
                                    <base-font class="content-top-time" :text="data.time | commentTimeFormat" color="text" size="10"/>
                                </div>
                                <div class="content-bottom f-df">
                                    <base-font :text="data.content | contentFilter" size="12"/>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div class="comment-empty t-tac" v-if="isEmpty">
                        <base-font text="暂无评论，欢迎抢沙发" color="text"/>
                    </div>
                </div>
            </div>
        </base-scroll>
    </div>
</template>

<script>
    import { NAV_BAR_HEIGHT, PAGE_DPR } from '@/config/param';
    import emoji from '@/util/emoji';

    const CARD_AVATAR_SIZE = 55;
    const USER_AVATAR_SIZE = 25;
    const FIX_TEXT_HEIGHT = 30;
    export default {
        name: 'CommentPage',
        props: {
            count: Number, // 评论总数
            avatar: String, // 封面图
            name: String, // 名称
            author: Array, // 作者
            creator: String, // 创建者
            cd: Boolean, // 显示光碟效果
            hot: Array, // 精彩评论
            latest: Array, // 最新评论
        },
        data() {
            return {
                title: `评论(${ this.count })`,
                fixText: ''
            };
        },
        filters: {
            contentFilter(content) {
                if (!/\[\W+]/.test(content)) return content;
                return content.replace(/\[\W+?]/g, function (i) {
                    return emoji.find(({ chinese }) => {
                        return chinese.includes(i);
                    })?.char || i;
                });
            }
        },
        computed: {
            isEmpty() {
                return this.hotEmpty && this.latestEmpty;
            },
            hotEmpty() {
                return !this.hot || this.hot.length < 1;
            },
            latestEmpty() {
                return !this.latest || this.latest.length < 1;
            },
            userAvatarSize() {
                return USER_AVATAR_SIZE * PAGE_DPR;
            },
            avatarFormat() {
                return `${ this.avatar }?param=${ CARD_AVATAR_SIZE * PAGE_DPR }y${ CARD_AVATAR_SIZE * PAGE_DPR }`;
            },
            authorFormat() {
                return this.creator ? `by ${ this.creator }` : this.author.map(({ name }) => name).join('/');
            },
            hotFormat() {
                return this.commentFormat('hot');
            },
            latestFormat() {
                return this.commentFormat('latest');
            },
            hotTitleOffset() {
                if (this.hotEmpty) return { top: 0, height: 0 };
                const el = this.$refs.hotTitle.$el;
                return {
                    top: el.offsetTop,
                    height: el.clientHeight,
                };
            },
            latestTitleOffset() {
                if (this.latestEmpty) return { top: 0, height: 0 };
                const el = this.$refs.latestTitle.$el;
                return {
                    top: el.offsetTop,
                    height: el.clientHeight,
                };
            }
        },
        methods: {
            commentFormat(type) {
                return this[ type ].map(({ likedCount: count, user, time, content }) => {
                    const { nickname: name, avatarUrl: avatar } = user;
                    return { count, time, name, avatar, content };
                });
            },
            onScroll(e) {
                if (this.isEmpty) return;
                const sHotTop = e.target.scrollTop + NAV_BAR_HEIGHT - this.hotTitleOffset.height;
                const sLatestTop = e.target.scrollTop + NAV_BAR_HEIGHT - this.latestTitleOffset.height + (this.hotEmpty ? 0 : FIX_TEXT_HEIGHT);
                if (sLatestTop >= this.latestTitleOffset.top && !this.latestEmpty) {
                    this.fixText = '最新评论';
                } else if (sHotTop >= this.hotTitleOffset.top && !this.hotEmpty) {
                    this.fixText = '精彩评论';
                } else {
                    this.fixText = '';
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    .comment-page {
        @include wh(100%);

        .comment-fix {
            width: 100%;
            left: 0;
            z-index: 199;
            padding-left: 20px;

            &.ignore {
                top: 50px;
                height: 30px;
                line-height: 30px;
            }
        }

        .comment-card {
            padding: 10px 20px 15px;

            .card-left {
                margin-right: 15px;
                z-index: 5;

                &.cd {
                    margin-right: 20px;

                    &:before {
                        position: absolute;
                        content: '';
                        top: 0;
                        right: -8px;
                        z-index: 1;
                        @include wh(100%);
                        background-color: black;
                        border-radius: 50%;
                    }

                }
            }

            .card-left-avatar {
                display: block;
                @include wh(55px);
                border-radius: 5px;
                z-index: 10;
            }

            .card-right-author {
                margin-top: 8px;
            }
        }

        .comment-wrapper {
            padding-top: 10px;

            .comment-empty {
                margin-top: 150px;
            }

            .comment-title {
                font-weight: bold;
            }

            .comment-list-item-avatar {
                margin-right: 15px;
            }

            .avatar-img {
                display: block;
                @include wh(25px);
                border-radius: 50%;
            }

            .content-top-time {
                margin-top: 4px;
            }

            .content-icon {
                margin-left: 5px;
                margin-bottom: 2px;
            }

            .content-bottom {
                margin-top: 8px;
                padding-bottom: 10px;
            }
        }
    }
</style>
