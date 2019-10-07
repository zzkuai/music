<template>
    <div class="play p-pf o-oh">
        <base-nav-bar
                :text="navTitle()"
                :tip="navTip()"
                :right="false"
                color="white"
                tip-color="white"
                arrow-color="white"
        />
        <play-volume :visible="!cdVisible"></play-volume>
        <div class="play-content-wrapper ignore p-pf"
             :class="{'back-side':!cdVisible}"
             :style="contentStyle"
             @click="cdVisible=!cdVisible"
        >
            <play-CD v-show="cdVisible"></play-CD>
            <play-lyric ref="playLyric" v-show="!cdVisible"></play-lyric>
        </div>
        <play-control></play-control>
        <play-modal></play-modal>
    </div>
</template>

<script>
    import { PAGE_HEIGHT, NAV_BAR_HEIGHT } from '@/config/param';
    import { homeMixin, playerMixin } from '@/util/mixin';
    import PlayModal from './children/PlayModal';
    import PlayCD from './children/PlayCD';
    import PlayLyric from './children/PlayLyric';
    import PlayControl from './children/PlayControl';
    import PlayVolume from './children/PlayVolume';

    const CONTROL_HEIGHT = 120;
    const VOLUME_HEIGHT = 40;
    export default {
        name: 'PlayDetail',
        mixins: [ homeMixin, playerMixin ],
        data() {
            return {
                detail: null,
                cdVisible: true,
            };
        },
        beforeMount() {
            if (!this.playInfo?.url) {
                this.$router.push({ path: '/' });
            }
        },
        components: {
            PlayModal,
            PlayCD,
            PlayLyric,
            PlayControl,
            PlayVolume
        },
        watch: {
            cdVisible(visible) {
                if (!visible) {
                    this.$refs.playLyric.scrollToActiveItem();
                }
            }
        },
        computed: {
            contentStyle() {
                const TOP_OFFSET = this.cdVisible ? 0 : VOLUME_HEIGHT;
                return {
                    height: PAGE_HEIGHT - NAV_BAR_HEIGHT - CONTROL_HEIGHT - TOP_OFFSET + 'px'
                };
            },
        },
        methods: {
            navTitle() {
                const { name, alia } = this.playInfo;
                if (!name && !alia) return '';
                return `${ name } ${ alia ? `(${ alia })` : '' }`;
            },
            navTip() {
                if (!this.playInfo.author) return '';
                return this.playInfo.author?.map(({ name }) => name).join('/');
            }
        }
    };
</script>

<style lang="scss" scoped>
    .play {
        top: 0;
        left: 0;
        @include wh(100%);
        z-index: 888;
        background-color: white;

        .play-content-wrapper {
            width: 100%;
            overflow-y: scroll;

            &.ignore {
                top: 50px;
                left: 0;
                bottom: 120px;

                &.back-side {
                    top: 90px;
                }
            }
        }
    }
</style>
