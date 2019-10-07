<template>
    <div class="k-tab-content-item" @scroll="onScroll">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: 'KTabItem',
        props: {
            bottomThreshold: {
                type: Number,
                default: 1
            },
            scrollEventEnable: {
                type: Boolean,
                default: true
            }
        },
        methods: {
            onScroll(e) {
                if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight - this.bottomThreshold) {
                    // 滚动到距离底部指定位置
                    if (this.scrollEventEnable) this.$emit('bottom-reached');
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    .k-tab-content-item {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        overflow-x: hidden;
        overflow-y: scroll;
    }
</style>
