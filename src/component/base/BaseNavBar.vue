<template>
    <div class="nav-bar p-pf ignore f-df f-aic">
        <div class="nav-bar-left o-oh">
            <div class="nav-bar-left-btn f-df f-jac o-oh" @click="leftOnPress()">
                <svg-icon icon-class="arrow-back" class="size-md" :color="arrowColor"/>
            </div>
        </div>
        <div class="nav-bar-center o-oh f-df f-fdc f-jcc">
            <template v-if="center">
                <slot name="center"></slot>
            </template>
            <template v-else>
                <base-font :text="text" size="16" :color="color"/>
                <base-font class="nav-bar-center-tip" v-if="tip" :text="tip" size="12" :color="tipColor"/>
            </template>
        </div>
        <transition name="slide-left">
            <div v-show="right" class="nav-bar-right f-df f-jac" @click="$emit('right-click')">
                <slot name="right"></slot>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        name: 'BaseNavBar',
        props: {
            text: {
                type: String,
                default: ''
            },
            tip: {
                type: String,
                default: ''
            },
            color: {
                type: String,
                default: 'title'
            },
            tipColor: {
                type: String,
                default: 'text'
            },
            arrowColor: {
                type: String,
                default: ''
            },
            leftFunc: {
                type: Function,
            },
            center: {
                type: Boolean,
                default: false
            },
            right: {
                type: Boolean,
                default: true
            }
        },
        methods: {
            leftOnPress() {
                if (this.leftFunc) {
                    this.leftFunc();
                } else {
                    this.$router.back();
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    .nav-bar {
        width: 100%;
        top: 0;
        left: 0;
        z-index: 200;
        background-color: transparent;

        &.ignore {
            height: 50px;
        }

        .nav-bar-left {
            width: 50px;
            height: 100%;
            padding: 5px;

            .nav-bar-left-btn {
                position: relative;
                @include wh(100%);
                border-radius: 50%;
            }
        }

        .nav-bar-center {
            flex: 1;
            height: 100%;
            white-space: nowrap;

            .nav-bar-center-tip {
                margin-top: 2px;
            }
        }

        .nav-bar-right {
            min-width: 50px;
            width: 50px;
            height: 100%;
        }
    }
</style>
