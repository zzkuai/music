<template>
    <div class="k-tab-container" :class="{fixed:isFixed}" :style="tabContainerStyle">
        <nav class="k-tab-wrapper theme">
            <ul class="k-tab-list">
                <li class="k-tab-list-item"
                    :key="index"
                    v-for="(tab,index) in tabs"
                    @click.stop="changeTab(index)"
                    :style="`width:${tabWidth}px`"
                >
                    <base-font :text="tab"/>
                </li>
            </ul>
            <span class="k-tab-line theme-bg-reverse" :style="tabLineStyle"></span>
        </nav>
        <div class="k-tab-content-wrapper"
             @touchstart.passive="touchStart"
             @touchmove.passive="touchMove"
             @touchend.passive="touchEnd"
        >
            <div class="k-tab-content"
                 :style="tabContentStyle"
            >
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
    const PAGE_WIDTH = document.documentElement.clientWidth || document.body.clientWidth;
    const PAGE_HEIGHT = document.documentElement.clientHeight || document.body.clientHeight;
    const CONTENT_CHANGE_DEFAULT_OFFSET = PAGE_WIDTH / 2; // 横轴滑动切换所需的默认距离
    const CONTENT_CHANGE_MINIMUM_OFFSET_X = 10; // 横轴滑动切换所需的最小距离
    const CONTENT_CHANGE_MINIMUM_TIME = 200; // 横轴滑动切换的最小时间ms
    const CONTENT_MINIMUM_SCROLL_OFFSET_Y = 10; // 纵轴滚动的最小值
    const TAB_HEIGHT = 45;
    const TAB_LINE_WIDTH = 30;
    export default {
        name: 'KTab',
        props: {
            tabs: {
                type: Array,
                default: () => [],
                isRequired: true
            },
            initTab: {
                type: Number,
                default: 0
            },
            offsetTop: {
                type: Number,
                default: 0
            },
            isFixed: {
                type: Boolean,
                default: false
            },
            fixedTop: {
                type: Number,
                default: 0
            },
            contentBounceEnable: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                activeTab: this.initTab,
                isScrolling: false,
                startX: 0,
                startY: 0,
                startTime: 0,
                moveOffset: 0 // >0 prev <0 next
            };
        },
        mounted() {
            Array.from(this.$el.querySelectorAll('.k-tab-content-item')).forEach(function (dom, index) {
                dom.style.transform = `translate3d(${ PAGE_WIDTH * index }px,0,0)`;
            });
            this.$emit('diff-tab-click', this.activeTab);
        },
        computed: {
            tabsLen() {
                return this.tabs.length;
            },
            tabWidth() {
                return PAGE_WIDTH / this.tabsLen;
            },
            tabLineStyle() {
                const tabLineOffset = this.tabContentChangeEnable && this.moveOffset * this.tabWidth / PAGE_WIDTH || 0;
                return {
                    transform: `translate(${ this.tabWidth / 2 - TAB_LINE_WIDTH / 2 + this.tabWidth * this.activeTab - tabLineOffset }px,0) translateZ(0)`
                };
            },
            tabContentStyle() {
                const tabContentOffset = (this.contentBounceEnable || this.tabContentChangeEnable) && this.moveOffset || 0;
                return {
                    height: PAGE_HEIGHT - TAB_HEIGHT - this.offsetTop + 'px',
                    transform: `translate(${ -PAGE_WIDTH * this.activeTab + tabContentOffset }px,0) translateZ(0)`
                };
            },
            tabContentChangeEnable() {
                return !this.isScrolling && (this.activeTab > 0 || this.activeTab === 0 && this.moveOffset < 0) &&
                    (this.activeTab < this.tabsLen - 1 || this.activeTab === this.tabsLen - 1 && this.moveOffset > 0);
            },
            tabContainerStyle() {
                return this.isFixed && {
                    top: this.fixedTop + 'px'
                };
            }
        },
        methods: {
            touchStart(e) {
                const touch = e.changedTouches[ 0 ];
                this.isScrolling = false;
                this.moveOffset = 0;
                this.startX = touch.clientX;
                this.startY = touch.clientY;
                this.startTime = new Date();
            },
            touchMove(e) {
                const touch = e.changedTouches[ 0 ];
                this.moveOffset = touch.clientX - this.startX;
                if (Math.abs(this.moveOffset) > CONTENT_CHANGE_MINIMUM_OFFSET_X) return;
                this.isScrolling = (Math.abs(touch.clientY - this.startY) >= CONTENT_MINIMUM_SCROLL_OFFSET_Y);
            },
            touchEnd(e) {
                if (!this.tabContentChangeEnable && !this.contentBounceEnable) return;
                const touch = e.changedTouches[ 0 ];
                this.moveOffset = touch.clientX - this.startX;
                if ((new Date() - this.startTime <= CONTENT_CHANGE_MINIMUM_TIME && Math.abs(this.moveOffset) >= CONTENT_CHANGE_MINIMUM_OFFSET_X) ||
                    Math.abs(this.moveOffset) >= CONTENT_CHANGE_DEFAULT_OFFSET) {
                    this.changeContent();
                }
                this.moveOffset = 0;
            },
            changeTab(index) {
                if (this.activeTab === index) {
                    this.$emit('active-tab-click', index);
                    return;
                }
                this.activeTab = index;
                this.$emit('diff-tab-click', index);
            },
            changeContent() {
                const nextIndex = this.moveOffset > 0 ? this.activeTab - 1 : this.activeTab + 1;
                if (nextIndex > this.tabsLen - 1 || nextIndex < 0) return;
                this.activeTab = nextIndex;
                this.$emit('diff-tab-click', nextIndex);
            }
        }
    };
</script>

<style lang="scss" scoped>
    .k-tab-container {
        width: 100%;
        height: 100%;

        &.fixed {
            position: fixed;
            left: 0;
        }
    }

    .k-tab-wrapper {
        position: relative;

        .k-tab-list {
            display: flex;
        }

        .k-tab-list-item {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 50px;
        }
    }

    .k-tab-line {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 30px;
        height: 2px;
        background-color: black;
        border-radius: 25px;
        @include ts(transform);
    }

    .k-tab-content-wrapper {
        position: relative;
        width: 100%;
        overflow: hidden;

        .k-tab-content {
            width: 100%;
            white-space: pre-wrap;
            @include ts(transform);
        }
    }
</style>
