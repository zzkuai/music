<template>
    <transition name="fade">
        <div class="playlist-high-tag p-pf" v-show="visible" @click.self="hide">
            <transition name="slide-down">
                <div class="tag-content ignore p-pa theme-bg" :class="{player:$store.state.playerVisible}" v-show="visible">
                    <div class="tag-content-title m-mb15">
                        <base-font text="选择你喜欢的分类" size="16"/>
                    </div>
                    <ul class="tag-content-list f-df f-fww">
                        <li class="content-list-item ignore f-df f-jac theme-bg2"
                            v-for="(cat,index) in cats"
                            :key="index"
                            :style="index | contentListItemStyle"
                            :class="{'mg0':index%columnCount===0,'theme-active':cat.name.includes(selected)}"
                            @click="selectItem(cat.name)"
                        >
                            <base-font :text="cat.name" size="12" :color="$store.state.theme==='night'&&!cat.name.includes(selected)?'title':''"/>
                        </li>
                    </ul>
                </div>
            </transition>
        </div>
    </transition>
</template>

<script>
    import { playlistMixin } from '@/util/mixin';
    import { PAGE_WIDTH } from '@/config/param';

    const COLUMN_COUNT = 4;
    const CONTENT_LIST_ITEM_MARGIN = 10;
    const CONTENT_LIST_ITEM_WIDTH = (PAGE_WIDTH - 15 * 2 - CONTENT_LIST_ITEM_MARGIN * 3) / COLUMN_COUNT;
    const CONTENT_LIST_FIRST_ITEM_WIDTH = PAGE_WIDTH - 15 * 2;
    export default {
        name: 'PlayListHighTag',
        mixins: [ playlistMixin ],
        props: {
            selected: String // 已选中类别
        },
        data() {
            return {
                visible: false,
                columnCount: COLUMN_COUNT
            };
        },
        filters: {
            contentListItemStyle(index) {
                const w = index === 0 ? CONTENT_LIST_FIRST_ITEM_WIDTH : CONTENT_LIST_ITEM_WIDTH;
                return {
                    width: w + 'px',
                    marginRight: index === 0 && 0
                };
            }
        },
        computed: {
            cats() {
                return [
                    { name: '全部歌单' }, { name: '华语' }, { name: '欧美' }, { name: '韩语' }, { name: '日语' }, { name: '粤语' },
                    { name: '小语种' }, { name: '运动' }, { name: 'ACG' }, { name: '影视原声' }, { name: '流行' }, { name: '摇滚' },
                    { name: '后摇' }, { name: '古风' }, { name: '民谣' }, { name: '轻音乐' }, { name: '电子' }, { name: '器乐' },
                    { name: '说唱' }, { name: '古典' }, { name: '爵士' },
                ];
            },
        },
        methods: {
            show() {
                this.visible = true;
            },
            hide() {
                this.visible = false;
            },
            selectItem(cat) {
                this.hide();
                if (!cat.includes(this.selected)) {
                    cat = cat === '全部歌单' ? '全部' : cat;
                    this.$emit('tag-click', cat);
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    .playlist-high-tag {
        bottom: 0;
        left: 0;
        @include wh(100%);
        z-index: 210;
        background-color: rgba(0, 0, 0, 0.5);

        .tag-content {
            bottom: 0;
            left: 0;
            width: 100%;
            border-radius: 25px 25px 0 0;

            &.ignore {
                padding: 15px 15px 25px;
            }

            &.player {
                padding-bottom: 50px;
            }
        }

        .tag-content-list {
            max-height: 350px;
            overflow-y: scroll;
        }

        .content-list-item {
            border-radius: 15px;

            &.ignore {
                height: 35px;
                margin-right: 10px;
                margin-bottom: 15px;
            }

            &.mg0 {
                margin-right: 0;
            }
        }
    }
</style>
