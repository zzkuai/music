<template>
    <div class="play-modal p-pa" :style="`backgroundColor:${coverColor};`"></div>
</template>

<script>

    import { playerMixin } from '@/util/mixin';

    export default {
        name: 'PlayModal',
        mixins: [ playerMixin ],
        data() {
            return {
                coverColor: 'transparent'
            };
        },
        mounted() {
            this.coverColor = this.playInfo?.color;
        },
        watch: {
            playInfo(info) {
                this.coverColor = info?.color;
            }
        },
    };
</script>

<style lang="scss" scoped>
    .play-modal {
        top: 0;
        left: 0;
        z-index: -1;
        @include wh(100%);
        @include ts(background-color);

        &:after {
            position: absolute;
            content: '';
            top: 0;
            left: 0;
            z-index: 1;
            @include wh(100%);
            background-color: rgba(0, 0, 0, 0.3);
            opacity: 0.8;
        }
    }
</style>
