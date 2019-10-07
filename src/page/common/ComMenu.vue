<template>
    <transition name="fade">
        <div class="com_menu" v-show="menuVisible">
            <transition name="slide-right">
                <div class="com_menu-left theme-bg" v-show="menuVisible">
                    <div class="com_menu-left-top f-df f-fdc f-jac">
                        <base-font text="登录获取您的专属音乐" size="12"/>
                        <div class="com_menu-left-top-button-wrapper m-mt15 f-df theme-bg2">
                            <button type="button">
                                <base-font text="立即登录" size="12"/>
                            </button>
                        </div>
                    </div>
                    <div class="com_menu-left-bottom theme f-df f-jac">
                        <div class="com_menu-left-bottom-button f-fx1 f-df f-jac" @click="toggleTheme()">
                            <svg-icon :icon-class="themeIcon" class="size-sm com_menu-left-bottom-button-icon"/>
                            <base-font :text="themeText" size="12"/>
                        </div>
                        <div class="com_menu-left-bottom-button f-fx1 f-df f-jac" @click="logout()">
                            <svg-icon icon-class="logout" class="size-sm com_menu-left-bottom-button-icon"/>
                            <base-font text="退出登录" size="12"/>
                        </div>
                    </div>
                </div>
            </transition>
            <div class="com_menu-right" @click="setMenuVisible(false)"></div>
        </div>
    </transition>
</template>

<script>
    import { homeMixin } from '@/util/mixin';

    export default {
        name: 'ComMenu',
        mixins: [ homeMixin ],
        methods: {
            toggleTheme() {
                const theme = this.theme === 'day' ? 'night' : 'day';
                this.setTheme(theme);
            },
            logout() {}
        },
        computed: {
            themeIcon() {
                return this.theme === 'day' ? 'moon' : 'sun';
            },
            themeText() {
                return this.theme === 'day' ? '夜间模式' : '日间模式';
            }
        }
    };
</script>

<style lang="scss" scoped>
    .com_menu {
        position: absolute;
        top: 0;
        left: 0;
        @include wh(100%);
        z-index: 1000;
        background-color: rgba(0, 0, 0, 0.5);

        .com_menu-left {
            position: absolute;
            top: 0;
            left: 0;
            width: 70%;
            height: 100%;

            .com_menu-left-top {
                padding: 80px 20px;
            }

            .com_menu-left-top-button-wrapper {
                padding: 10px 30px;
                border-radius: 15px;
            }

            .com_menu-left-bottom {
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
            }

            .com_menu-left-bottom-button {
                padding: 10px 0;
            }

            .com_menu-left-bottom-button-icon {
                margin-right: 10px;
            }
        }


        .com_menu-right {
            position: absolute;
            top: 0;
            right: 0;
            width: 30%;
            height: 100%;
        }
    }
</style>
