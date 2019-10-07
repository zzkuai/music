<template>
    <transition name="fade">
        <div class="cover-modal-wrapper p-pf" v-show="visible" @click="hide" :style="modalWrapperStyle">
            <div class="modal-close f-df f-jac p-pa">
                <svg-icon icon-class="close" class="size-sm" color="white"></svg-icon>
            </div>
            <div class="cover-modal p-pr">
                <div class="modal-top f-df f-aic f-fdc">
                    <div class="modal-top-cover-wrapper p-pr" :class="{cd}">
                        <img v-lazy="coverFormat" alt="cover" class="modal-top-cover">
                    </div>
                    <base-font class="m-mt15" :text="title" color="white"/>
                </div>
                <div class="modal-line" :style="modalLineStyle"></div>
                <div class="modal-content f-df f-fdc">
                    <ul class="modal-content-tag f-df f-aic" v-if="tags&&tags.length>0">
                        <li class="modal-content-tag-name f-df f-aic">
                            <base-font text="标签：" color="white" size="12"/>
                        </li>
                        <li class="modal-content-tag-item f-df f-aic" v-for="(tag,index) in tags" :key="index">
                            <base-font :text="tag" color="white" size="10"/>
                        </li>
                    </ul>
                    <base-font v-if="company" :text="company" color="white" size="12"/>
                    <base-font v-if="type" class="modal-content-type" :text="type" color="white" size="12"/>
                    <base-font class="modal-content-desc" :text="desc" color="white" size="12"/>
                </div>
            </div>
            <div class="cover-blur top p-pf" :style="coverBlurTopStyle"></div>
            <div class="cover-blur bottom p-pf" :style="coverBlurBottomStyle"></div>
        </div>
    </transition>
</template>

<script>
    import getImageColor from '@/util/color';
    import { PAGE_DPR } from '@/config/param';

    const COVER_SIZE = 150;
    export default {
        name: 'CoverModal',
        props: {
            cover: String, // 封面
            title: String, // 标题
            company: String, // 发行公司
            type: String, // 类别
            tags: Array, // 标签
            desc: String, // 详细描述
            cd: Boolean, // 是否显示光碟效果
        },
        data() {
            return {
                visible: false,
                color: 'transparent'
            };
        },
        mounted() {
            this.$nextTick(async () => {
                this.color = await getImageColor({ imageUrl: `${ this.cover }?param=10y10` });
            });
        },
        computed: {
            modalWrapperStyle() {
                return {
                    backgroundColor: this.color
                };
            },
            modalLineStyle() {
                return {
                    background: `linear-gradient(to right,transparent,rgba(255,255,255,0.1),transparent)`
                };
            },
            coverBlurTopStyle() {
                return {
                    background: `linear-gradient(${ this.color },${ this.color.replace(/\d\)$/, '0.1)') })`
                };
            },
            coverBlurBottomStyle() {
                return {
                    background: `linear-gradient(${ this.color.replace(/\d\)$/, '0.1)') },${ this.color })`
                };
            },
            coverFormat() {
                return `${ this.cover }?param=${ COVER_SIZE * PAGE_DPR }y${ COVER_SIZE * PAGE_DPR }`;
            }
        },
        methods: {
            show() {
                this.visible = true;
            },
            hide() {
                this.visible = false;
            }
        }
    };
</script>

<style lang="scss" scoped>
    .cover-modal-wrapper {
        @include wh(100%);
        top: 0;
        left: 0;
        z-index: 9999;

        .cover-modal {
            height: 100%;
            overflow-x: hidden;
            overflow-y: scroll;
            padding: 0 20px 30px;
            z-index: 1;
        }

        .modal-close {
            padding: 5px;
            top: 15px;
            right: 15px;
            z-index: 20;
        }

        .modal-top {
            padding-top: 80px;

            .modal-top-cover-wrapper {
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
            }

            .modal-top-cover {
                @include wh(150px);
                border-radius: 5px;
            }
        }

        .modal-line {
            margin: 15px auto;
            width: 90%;
            height: 1px;
        }

        .modal-content {
            padding-bottom: 40px;

            .modal-content-tag {
                margin-bottom: 15px;

                .modal-content-tag-item {
                    padding: 2px 8px;
                    border-radius: 8px;
                    margin-left: 10px;
                    background-color: rgba(255, 255, 255, 0.1);
                }
            }

            .modal-content-type {
                margin-bottom: 15px;
            }

            .modal-content-desc {
                white-space: pre-wrap;
            }
        }

        .cover-blur {
            width: 100%;
            height: 80px;
            z-index: 10;

            &.top {
                top: 0;
            }

            &.bottom {
                bottom: 0;
            }
        }
    }
</style>
