<template>
    <transition name="fade">
        <ul v-show="visible" class="search-suggest p-ph15 ignore p-pa theme">
            <li class="search-suggest-item p-pv15 f-df f-aic" v-if="!!word" @click.stop="search(word)">
                <base-font :text="`搜索 “${word}”`"/>
            </li>
            <li class="search-suggest-item p-pv15 f-df f-aic" v-for="(item,index) in list" :key="index"
                @click.stop="search(item.keyword)">
                <svg-icon icon-class="search" class="search-suggest-item-icon size-ss"></svg-icon>
                <base-font class="line-one f-fx1" :text="item.keyword"/>
            </li>
        </ul>
    </transition>
</template>

<script>
    import { getSearchSuggest } from '@/api/page/search';

    export default {
        name: 'SearchSuggest',
        props: {
            visible: Boolean,
            keyword: [ Number, String ]
        },
        data() {
            return {
                word: '',
                list: [],
                timer: null
            };
        },
        watch: {
            keyword(val) {
                if (this.timer) clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    this.word = val;
                    if (val.trim()) {
                        this.getSuggest(val);
                    } else {
                        this.list = [];
                    }
                }, 200);
            }
        },
        methods: {
            async getSuggest(val) {
                try {
                    const { result } = await getSearchSuggest(val);
                    this.list = result?.allMatch || [];
                } catch (e) {
                    this.list = [];
                }
            },
            search(val) {
                this.$emit('suggest-search', val);
            }
        }
    };
</script>

<style lang="scss" scoped>
    .search-suggest {
        width: 100%;
        left: 0;
        max-height: 350px;
        overflow-y: scroll;
        overflow-x: hidden;

        &.ignore {
            top: 50px;
        }

        .search-suggest-item-icon {
            vertical-align: middle;
            margin-right: 10px;
        }
    }
</style>
