<template>
    <div class="block ignore">
        <div class="title-wrapper m-mb5 f-df f-aic f-jcb">
            <base-font :text="title" size="16"/>
            <base-font class="tip theme-bg2" v-if="tip" :text="tip" color="text" size="12"
                       @bf-click="$emit('tip-click')"/>
        </div>
        <ul class="list-wrapper o-oh f-df f-fww">
            <li class="list-item m-mt15 ignore"
                v-for="(data,index) in list"
                :key="index"
                :style="itemStyle"
                @click.stop="clickItem(data,index)"
            >
                <div class="list-item-img p-pr"
                     :style="itemImgStyle"
                     v-lazy:backgroundImage="`${ data.url }?param=${ width }y${ width }`">
                    <base-font v-if="data.tip" class="list-item-tip p-pa" :text="data.tip" size="10" color="white"/>
                </div>
                <div class="list-item-text f-df f-fdc">
                    <base-font class="line-two" :text="data.name" size="10"/>
                    <base-font class="line-two m-mt5" v-if="data.desc" :text="data.desc" size="10" color="text"/>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    import { PAGE_DPR, PAGE_WIDTH } from '@/config/param';

    const ITEM_WIDTH = (PAGE_WIDTH - 15 * 4) / 3;
    export default {
        name: 'PlayList',
        props: {
            title: String,
            list: Array,
            tip: String,
        },
        data() {
            return {
                width: ITEM_WIDTH * PAGE_DPR,
            };
        },
        computed: {
            itemStyle() {
                return {
                    width: ITEM_WIDTH + 'px'
                };
            },
            itemImgStyle() {
                return {
                    width: ITEM_WIDTH + 'px',
                    height: ITEM_WIDTH + 'px',
                };
            }
        },
        methods: {
            clickItem(data, index) {
                this.$emit('item-click', data, index);
            }
        }
    };
</script>

<style lang="scss" scoped>
    .block {
        &.ignore {
            padding: 0 15px;
        }
    }

    .title-wrapper {
        margin-top: 25px;
        font-weight: 700;

        .tip {
            padding: 3px 8px;
            border-radius: 25px;
        }
    }

    .list-wrapper {
        li:nth-of-type(3n) {
            margin-right: 0;
        }
    }

    .list-item {
        &.ignore {
            margin-right: 15px;
        }

        .list-item-img {
            background: center center no-repeat;
            background-size: cover;
            border-radius: 5px;
            margin-bottom: 8px;
        }

        .list-item-tip {
            top: 3px;
            right: 5px;
        }
    }
</style>
