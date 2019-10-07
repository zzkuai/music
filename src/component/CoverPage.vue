<template>
    <div class="cover-page">
        <base-nav-bar
                :text="navBarText"
                color="white"
                arrow-color="white"
                class="cover-nav-bar"
                :center="searchVisible"
                :right="!searchVisible"
                :left-func="navBarLeftFunc"
                :style="`backgroundColor:${navBgColor}`"
                @right-click="searchVisible=!searchVisible"
        >
            <template #center>
                <label class="cover-search f-df f-aic" for="search" id="search">
                    <input v-model="searchKey"
                           ref="input"
                           name="search"
                           type="text"
                           @input="getSearch"
                           :placeholder="`搜索${title}内歌曲`"
                           class="cover-search-input bf-14 f-fx1"
                    >
                    <transition name="fade">
                        <span v-show="searchKey" @click="clearSearch" class="cover-search-close f-df f-jac">
                            <svg-icon icon-class="close" color="white" class="cover-search-close-icon size-md"/>
                        </span>
                    </transition>
                </label>
            </template>
            <template #right>
                <svg-icon icon-class="search" color="white" class="size-md"></svg-icon>
            </template>
        </base-nav-bar>
        <base-scroll class="cover-content" @handle-scroll="onScroll" v-show="!searchVisible">
            <div class="content-main">
                <div class="content-modal transition ignore p-pa" :style="`backgroundColor:${modalBgColor}`"></div>
                <div class="content-card ignore p-ph20 p-pr f-df f-jac" :style="`opacity:${coverOpacity}`">
                    <div class="content-card-left p-pr f-df f-jac" :class="{cd}">
                        <img v-lazy="formatCover" class="content-card-left-img" alt="cover">
                        <base-font class="content-card-left-count p-pa" v-if="count" :text="count | numberFormat" size="10" color="white"/>
                    </div>
                    <div class="content-card-right f-df f-fdc f-jcb f-fx1">
                        <p class="f-df f-fdc">
                            <base-font class="content-card-right-name line-two" :text="name" color="white"/>
                            <span class="content-card-right-author f-df f-aic" @click="()=>authorFunc&&authorFunc()">
                                <img v-if="avatar" v-lazy="formatAvatar" class="content-card-right-author-avatar" alt="avatar">
                                <base-font v-if="author" :text="author" color="white" size="12"/>
                                <svg-icon v-if="authorFunc" icon-class="arrow-forward" class="size-si content-card-right-icon"
                                          color="white"></svg-icon>
                            </span>
                        </p>
                        <p class="f-df f-fdc">
                            <base-font v-if="time" class="content-card-right-time" :text="time" color="white" size="10"/>
                            <span v-if="desc" class="f-df f-aic" @click="$emit('desc-click')">
                                <base-font v-if="desc" class="content-card-right-desc line-two" :text="desc" color="white" size="10"/>
                                <svg-icon v-if="desc" icon-class="arrow-forward" class="size-si content-card-right-desc-icon"
                                          color="white"></svg-icon>
                            </span>
                        </p>
                    </div>
                    <ul class="content-card-func p-pa f-df f-aic">
                        <li class="content-card-func-item f-df f-fdc f-jac"
                            v-for="(data,index) in items"
                            :key="index"
                            @click="data.func&&data.func()"
                        >
                            <svg-icon :icon-class="data.icon" class="size-mg" color="white"></svg-icon>
                            <base-font class="content-card-func-item-text m-mt5" :text="data.text" color="white"/>
                        </li>
                    </ul>
                </div>
                <div class="content-list-wrapper ignore p-pr">
                    <ul class="content-list">
                        <li class="content-list-item p-pv15 f-df f-aic"
                            v-for="(data,index) in list"
                            :key="index"
                            @click.stop="$emit('item-click',data,list)"
                        >
                            <div class="content-list-item-left f-df f-jac">
                                <svg-icon v-if="false" icon-class="sound" class="size-md"/>
                                <base-font v-else :text="index+1" color="text"/>
                            </div>
                            <div class="content-list-item-right f-df f-fdc f-fx1">
                                <base-font class="line-one" :text="data.name">
                                    <base-font v-if="data.alia.length>0" :text="`(${data.alia[0]})`" color="text"/>
                                </base-font>
                                <base-font class="content-list-item-right-author line-one"
                                           :text="getArtist(data.artist)" size="12" color="text"/>
                            </div>
                        </li>
                    </ul>
                </div>
                <slot></slot>
            </div>
        </base-scroll>
        <base-scroll v-show="searchVisible" @handle-scroll="onScroll">
            <div class="content-search">
                <ul class="content-list" v-show="searchResult==='data'">
                    <li class="content-list-item p-pv15 f-df f-aic"
                        v-for="(data,index) in searchList"
                        :key="index"
                        @click.stop="$emit('item-click',data,searchList)"
                    >
                        <div class="content-list-item-left f-df f-jac">
                            <svg-icon v-if="false" icon-class="sound" class="size-md"/>
                            <base-font v-else :text="index+1" color="text"/>
                        </div>
                        <div class="content-list-item-right f-df f-fdc f-fx1">
                            <base-font class="line-one" :text="data.name">
                                <base-font v-if="data.alia.length>0" :text="`(${data.alia[0]})`" color="text"/>
                            </base-font>
                            <base-font class="content-list-item-right-author line-one" :text="getArtist(data.artist)"
                                       size="12" color="text"/>
                        </div>
                    </li>
                </ul>
                <div class="content-search-empty p-ph20 t-tac p-pf" v-show="searchResult==='empty'">
                    <base-font v-show="!!searchKey" :text='`未找到与"${searchKey}"相关的内容`'/>
                </div>
            </div>
        </base-scroll>
        <back-to-top :visible="!searchVisible&&toTopVisible"></back-to-top>
    </div>
</template>

<script>
    import { PAGE_DPR, NAV_BAR_HEIGHT } from '@/config/param';
    import getImageMeanColor from '@/util/color';
    import BackToTop from '@/component/BackToTop';

    const COVER_CARD_AVATAR_SIZE = 110;
    const COVER_AUTHOR_AVATAR_SIZE = 25;
    const COVER_CARD_MODAL_HEIGHT = 290;
    export default {
        name: 'CoverPage',
        props: {
            title: String, // navBar 标题
            search: Boolean, // 是否开启搜索功能
            cover: String, // 封面图
            count: Number, // 播放次数
            name: String, // 名称
            avatar: String, // 歌手/创建者 头像
            author: String, // 歌手/创建者
            time: [ String, Number ], // 时间
            desc: String, // 描述
            items: Array, // cover 功能项
            list: Array, // 列表
            authorFunc: Function, // 歌手/创建者点击事件
            cd: Boolean, // 是否显示光碟效果
        },
        data() {
            return {
                searchKey: '', // 搜索词
                searchVisible: false, // 页面内搜索
                searchResult: 'data', // 搜索结果
                searchList: [], // 搜索结果列表
                coverOpacity: 1, // cover 透明度变化
                isScrollMiddle: false, // 页面滚动到封面中间位置
                modalBgColor: 'transparent', // modal 背景色
                navBgColor: 'transparent', // navBar 背景色
                toTopVisible: false
            };
        },
        mounted() {
            this.$nextTick(async () => {
                this.modalBgColor = await getImageMeanColor({ imageUrl: `${ this.cover }?param=10y10` });
                setTimeout(() => this.navBgColor = this.modalBgColor, 300);
            });
        },
        components: {
            BackToTop
        },
        watch: {
            searchVisible(visible) {
                if (visible) {
                    this.searchList = [];
                    this.searchResult = 'data';
                    this.clearSearch();
                }
            }
        },
        computed: {
            navBarText() {
                return this.isScrollMiddle ? this.name : this.title;
            },
            formatAvatar() {
                return `${ this.avatar }?param=${ COVER_AUTHOR_AVATAR_SIZE * PAGE_DPR }y${ COVER_AUTHOR_AVATAR_SIZE * PAGE_DPR }`;
            },
            formatCover() {
                return `${ this.cover }?param=${ COVER_CARD_AVATAR_SIZE * PAGE_DPR }y${ COVER_CARD_AVATAR_SIZE * PAGE_DPR }`;
            },
        },
        methods: {
            getArtist(artist) {
                return artist.map(({ name }) => name).join('/');
            },
            onScroll(e) {
                if (this.searchVisible) return;
                const sTop = e.target.scrollTop;
                this.isScrollMiddle = sTop >= (COVER_CARD_MODAL_HEIGHT - NAV_BAR_HEIGHT) / 2;
                this.coverOpacity = sTop <= (COVER_CARD_MODAL_HEIGHT - NAV_BAR_HEIGHT) ?
                    (COVER_CARD_MODAL_HEIGHT - NAV_BAR_HEIGHT - sTop) / (COVER_CARD_MODAL_HEIGHT - NAV_BAR_HEIGHT) : 0;
                this.toTopVisible = sTop >= 500;
            },
            navBarLeftFunc() {
                this.searchVisible ? this.searchVisible = false : this.$router.back();
            },
            getSearch() {
                if (!this.searchKey) return;
                this.searchList = Object.freeze(this.list.filter(({ name, alia }) => {
                    const aliaItem = alia.length > 0 ? alia[ 0 ] : '';
                    const key = (name + aliaItem).toLowerCase();
                    return key.includes(this.searchKey.trim().toLowerCase());
                }));
                this.searchResult = this.searchList.length > 0 ? 'data' : 'empty';
            },
            clearSearch() {
                this.searchKey = '';
                this.focusInput();
            },
            focusInput() {
                this.$nextTick(() => {
                    this.$refs.input.focus();
                });
            },
        }
    };
</script>

<style lang="scss" scoped>
    .cover-page {
        @include wh(100%);
    }

    .cover-nav-bar {
        .cover-search {
            height: 80%;

            .cover-search-input {
                height: 100%;
                color: white;
            }

            .cover-search-close {
                min-width: 40px;
                flex: 0 0 40px;
                height: 100%;
            }
        }

        ::placeholder {
            color: white;
            opacity: 0.7;
        }
    }

    .content-modal {
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;

        &.ignore {
            height: 290px;
        }

        &.transition {
            @include ts(background-color);
        }
    }

    .content-card {
        width: 100%;
        z-index: 2;
        background-color: transparent;

        &.ignore {
            height: 290px;
        }

        .content-card-left {
            min-width: 130px;
            @include wh(130px);
            z-index: 2;

            &.cd:before {
                position: absolute;
                content: '';
                top: -15px;
                left: 0;
                z-index: -1;
                @include wh(100%);
                background-color: black;
                border-radius: 50%;
            }

            .content-card-left-img {
                height: 100%;
                border-radius: 5px;
            }

            .content-card-left-count {
                top: 3px;
                right: 5px;
            }
        }

        .content-card-right {
            margin-left: 20px;
            height: 130px;

            .content-card-right-name {
                font-weight: 700;
            }

            .content-card-right-author {
                display: block;
                margin-top: 10px;
                opacity: 0.9;
                line-height: 20px;

                .content-card-right-author-avatar {
                    margin-right: 10px;
                    vertical-align: middle;
                    min-width: 25px;
                    @include wh(25px);
                    border-radius: 25px;
                }
            }

            .content-card-right-icon {
                margin-left: 5px;
                vertical-align: middle;
            }

            .content-card-right-time {
                opacity: 0.7;
            }

            .content-card-right-desc {
                margin-top: 3px;
                opacity: 0.7;
            }

            .content-card-right-desc-icon {
                min-width: 10px;
                margin-left: 5px;
                opacity: 0.5;
            }
        }

        .content-card-func {
            width: 100%;
            bottom: 15px;
            justify-content: space-around;

            .content-card-func-item {
                width: 100px;
                border-radius: 15px;
            }

            .content-card-func-item-text {
                opacity: 0.7;
            }
        }
    }

    .content-list {
        .content-list-item-left {
            width: 50px;
        }

        .content-list-item-right-author {
            margin-top: 3px;
        }
    }

    .content-search {
        top: 0;
        left: 0;
        padding-top: 50px;
        @include wh(100%);

        .content-list {
            opacity: 0.7;
        }

        .content-search-empty {
            top: 20%;
            width: 100%;
            white-space: pre-wrap;
        }
    }
</style>
