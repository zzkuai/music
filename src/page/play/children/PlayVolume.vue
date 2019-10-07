<template>
    <div class="play-volume ignore p-pf f-df f-aic" :class="{active:visible}">
        <div class="play-volume-icon f-df f-jac">
            <svg-icon icon-class="volume" class="size-sm" color="white"/>
        </div>
        <controller
                class="play-volume-controller"
                :move-offset="volume"
                :max-offset="1"
                @controller-touch-start="onTouchStart"
                @controller-touch-move="onTouchMove"
                :enable="visible"
        />
    </div>
</template>

<script>
    import Controller from '@/component/Controller';

    export default {
        name: 'PlayVolume',
        components: {
            Controller
        },
        props: {
            visible: Boolean
        },
        data() {
            return {
                volume: this.$store.state.player.playEl.volume
            };
        },
        methods: {
            onTouchStart(volume) {
                if (volume !== -1) {
                    this.volume = +volume.toFixed(1);
                    this.$store.state.player.playEl.volume = volume.toFixed(1);
                }
            },
            onTouchMove(volume) {
                this.volume = +volume.toFixed(1);
                this.$store.state.player.playEl.volume = volume.toFixed(1);
            },
        }
    };
</script>

<style lang="scss" scoped>
    .play-volume {
        width: 100%;
        left: 0;
        z-index: 10;
        opacity: 0;
        padding-right: 15px;

        &.ignore {
            height: 40px;
            top: 50px;
        }

        &.active {
            opacity: 1;
        }

        .play-volume-icon {
            min-width: 50px;
            width: 50px;
            flex: 0 0 50px;
        }

        .play-volume-controller {
            margin-left: 0;
        }
    }
</style>
