<template>
    <div ref="controller"
         class="controller f-df f-fx1 f-aic p-pr"
         @touchstart.prevent="onTouchStart"
         @touchmove.prevent="onTouchMove"
         @touchend.prevent="onTouchEnd"
    >
        <div class="controller-bar-reached p-pa" :style="barReachedStyle"></div>
        <div class="controller-bar ignore p-pa" :style="barStyle" :class="{active:touchActive}"></div>
    </div>
</template>

<script>
    export default {
        name: 'Controller',
        props: {
            moveOffset: Number, // controller 滑动偏移量
            maxOffset: Number, // controller 最大滑动值
            barSize: { // 滑动块尺寸
                type: Number,
                default: 6
            },
            enable: { // 允许触摸
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                touchStartX: 0, // 手指触摸控制条的初始位置
                touchStartOffsetLeft: 0, // 手指触摸时滑动块所处位置
                controllerWidth: 0, // 控制条总宽度
                touchActive: false, // 触摸中
            };
        },
        mounted() {
            this.controllerWidth = this.$refs.controller.clientWidth;
        },
        computed: {
            reached() {
                return this.controllerWidth * (this.moveOffset / this.maxOffset);
            },
            barStyle() {
                return {
                    left: this.reached + 'px',
                    width: this.barSize + 'px',
                    height: this.barSize + 'px',
                };
            },
            barReachedStyle() {
                return {
                    width: this.reached + 'px'
                };
            },
        },
        methods: {
            async onTouchStart(e) {
                if (!this.enable) return;
                this.touchActive = true;
                this.touchStartX = e.changedTouches[ 0 ].clientX;
                const touchStartOffsetX = (this.touchStartX - this.barSize / 2 - this.$refs.controller.offsetLeft)
                    * this.maxOffset / this.controllerWidth; // 初始点击相对拖条位置
                const result = touchStartOffsetX >= 0 && touchStartOffsetX <= this.maxOffset ? touchStartOffsetX : -1;
                await this.$emit('controller-touch-start', result);
                this.touchStartOffsetLeft = this.moveOffset;
            },
            onTouchMove(e) {
                if (!this.enable) return;
                // 拖动控制条移动距离
                const moveOffset = this.touchStartOffsetLeft + (e.changedTouches[ 0 ].clientX - this.touchStartX) * this.maxOffset / this.controllerWidth;
                const offset = moveOffset <= 0 ? 0 : moveOffset >= this.maxOffset ? this.maxOffset : moveOffset;
                this.$emit('controller-touch-move', offset);
            },
            onTouchEnd() {
                if (!this.enable) return;
                this.touchActive = false;
                this.$emit('controller-touch-end');
            },
        }
    };
</script>

<style lang="scss" scoped>
    .controller {
        padding: 8px 0;
        margin: 0 20px;

        &:before {
            position: absolute;
            content: '';
            width: 100%;
            height: 1px;
            background-color: rgba(255, 255, 255, 0.2);
        }

        .controller-bar-reached {
            width: 0;
            left: 0;
            height: 1px;
            background-color: rgba(255, 255, 255, 0.8);
        }

        .controller-bar {
            background-color: white;
            border-radius: 50%;
            transform: scale(1);
            @include ts(transform);

            &.active {
                transform: scale(1.5);
            }
        }
    }
</style>
