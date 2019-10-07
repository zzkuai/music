<template>
    <transition name="slide-up">
        <header class="com_header ignore theme p-pf f-df f-jcb f-aic" v-show="visible">
            <div class="com_header-left com_header_item f-df f-jac" @click="toggleTheme">
                <svg-icon :icon-class="themeIcon" class="size-md"/>
            </div>
            <ul class="f-df f-fx1 f-jac">
                <router-link tag="li" v-for="nav in comNav" :key="nav.id" :to="nav.path" class="com_header_nav f-df f-jac">
                    <base-font :text="nav.text" :color="navColor(nav.path)" :size="navSize(nav.path)"/>
                </router-link>
            </ul>
            <div class="com_header-right com_header_item f-df f-jac" @click="$router.push({path:'/search'})">
                <svg-icon icon-class="search" class="size-md"/>
            </div>
        </header>
    </transition>
</template>

<script>
    import { comNav } from '@/config/param';
    import { homeMixin } from '@/util/mixin';

    export default {
        name: 'ComHeader',
        mixins: [ homeMixin ],
        props: {
            visible: {
                type: Boolean
            }
        },
        data() {
            return {
                comNav
            };
        },
        computed: {
            themeIcon() {
                return this.theme === 'day' ? 'sun' : 'moon';
            },
        },
        methods: {
            navColor(path) {
                return this.$route.path === path ? 'title' : 'text';
            },
            navSize(path) {
                return this.$route.path === path ? '16' : '14';
            },
            toggleTheme() {
                const theme = this.theme === 'day' ? 'night' : 'day';
                this.setTheme(theme);
            }
        }
    };
</script>

<style lang="scss" scoped>
    .com_header {
        top: 0;
        left: 0;
        width: 100%;
        padding: 0 5px;
        z-index: 300;

        &.ignore {
            height: 50px;
        }

        .com_header_item {
            @include wh(40px);
        }
    }

    .com_header_nav {
        @include wh(40px);

        & + .com_header_nav {
            margin-left: 15px;
        }

        /deep/ .base-font {
            @include ts(font-size, color);
        }

        &.active {
            /deep/ .base-font {
                font-weight: 700;
            }
        }
    }
</style>
