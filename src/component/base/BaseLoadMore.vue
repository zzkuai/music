<template>
    <transition name="fade">
        <base-loading :count="4" class="base-load-more" v-show="visible" :theme-bg="themeBg"></base-loading>
    </transition>
</template>

<script>
    export default {
        name: 'BaseLoadMore',
        props: {
            visible: {
                type: Boolean,
                default: false,
                isRequired: true
            },
            themeBg: {
                type: Boolean,
                default: true
            }
        }
    };
</script>

<style lang="scss" scoped>
    .base-load-more {
        position: relative;
        top: 0;
        left: 0;
        width: 100%;
        margin: 0 0 15px;
    }
</style>
