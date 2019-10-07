<template>
    <main class="main p-pr theme-bg ignore" :class="{home}">
        <slot name="head"/>
        <base-loading v-if="state==='load'"/>
        <div v-else-if="state==='empty'" class="empty p-pf">
            <base-font :text="`${empty}`"/>
        </div>
        <div v-else-if="state==='error'" class="error p-pf" @click="reload()">
            <base-font :text="`${error} 点击重试`"/>
        </div>
        <slot v-else/>
    </main>
</template>

<script>
    export default {
        name: 'BaseState',
        props: {
            state: {
                type: String,
                required: true,
                default: 'load'
            },
            error: {
                type: String,
                default: '加载失败'
            },
            empty: {
                type: String,
                default: '暂无数据'
            },
            home: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            reload() {
                this.$emit('reload');
            }
        }
    };
</script>

<style lang="scss" scoped>
    .main {
        @include wh(100%);

        .empty,
        .error {
            top: 45%;
            left: 50%;
            transform: translate3d(-50%, -50%, 0);
        }

        &.ignore.home {
            padding-top: 50px;
        }
    }
</style>
