<template>
    <base-loading v-if="singerLoad" top="50%"/>
    <div class="profile" v-else>
        <div class="profile-info p-pv15">
            <div class="info-title p-ph15 profile-title">
                <base-font :text="`${name}简介`" size="14"/>
            </div>
            <div class="info-msg p-ph15">
                <base-font :text="profile.briefDesc.trim()" size="12" color="text"/>
                <transition name="fade">
                    <ul class="o-oh" v-if="profile.introduction&&profile.introduction.length>0" v-show="visible">
                        <li v-for="(item,index) in profile.introduction" :key="index">
                            <div class="info-ti m-mt15 profile-title">
                                <base-font :text="item.ti" size="14"/>
                            </div>
                            <div class="info-tx">
                                <base-font :text="item.txt" size="12" color="text"/>
                            </div>
                        </li>
                    </ul>
                </transition>
            </div>
            <div v-if="profile.introduction&&profile.introduction.length>0"
                 class="info-more p-pv15 t-tac"
                 @click="setVisible()"
            >
                <base-font :text="visible?'收起':'完整歌手介绍'" size="12" color="text"/>
                <svg-icon icon-class="arrow-down" :class="{active:visible}" class="info-more-icon size-si"/>
            </div>
        </div>
        <div class="profile-article p-ph15" v-if="profile.topicData&&profile.topicData.length>0">
            <div class="profile-title">
                <base-font text="相关专栏文章" size="14"/>
            </div>
            <ul class="article-list">
                <li class="article_item m-mb15 f-df f-aic" v-for="item in profile.topicData" :key="item.id">
                    <div class="article_item-left" :style="`background-image:url(${item.rectanglePicUrl})`"></div>
                    <div class="article_item-right f-df f-fdc">
                        <base-font class="m-mb5" :text="item.mainTitle"/>
                        <p>
                            <base-font :text="`by ${ item.creator.nickname }`" size="12" color="text"/>
                            <base-font class="article_item-right-count" :text="`阅读 ${ articleReadCount(item.readCount) }`" size="12" color="text"/>
                        </p>
                    </div>
                </li>
            </ul>
        </div>
        <div class="profile-simi p-ph15" v-if="simi&&simi.length>0">
            <div class="profile-title">
                <base-font text="相似歌手" size="14"/>
            </div>
        </div>
    </div>
</template>

<script>
    import { readCountFormat } from '@/util/format';
    import { singerMixin } from '@/util/mixin';

    export default {
        name: 'SingerProfile',
        mixins: [ singerMixin ],
        props: [ 'name' ],
        data() {
            return {
                profile: null,
                simi: null,
                visible: false
            };
        },
        methods: {
            async getData() {
                try {
                    this.profile = await this.setProfile(this.id);
                    // await getSimiSinger(this.id);
                } catch (e) {
                    this.error = e.message;
                } finally {
                    this.singerLoad = false;
                }
            },
            articleReadCount(readCount) {
                return readCountFormat(readCount);
            },
            setVisible() {
                this.visible = !this.visible;
            }
        }
    };
</script>

<style lang="scss" scoped>
    .profile {
        .profile-title {
            font-weight: bold;
            margin-bottom: 15px;
        }

        .profile-info {
            .info-msg,
            .info-tx {
                white-space: pre-wrap;
            }

            .info-more-icon {
                margin-left: 5px;
                vertical-align: middle;
                @include ts(transform);

                &.active {
                    transform: rotate(-180deg);
                }
            }
        }

        .profile-article {
            .article_item-left {
                flex: 0 0 105px;
                width: 105px;
                height: 70px;
                margin-right: 10px;
                background: no-repeat center center;
                background-size: cover;
                border-radius: 5px;
            }

            .article_item-right-count {
                margin-left: 10px;
            }
        }
    }
</style>
