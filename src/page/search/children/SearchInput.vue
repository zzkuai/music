<template>
    <base-nav-bar class="theme" :center="true" :right="false" :left-func="arrowOnPress">
        <template #center>
            <label class="search-wrapper f-df f-aic" for="search" id="search">
                <input v-model="searchKey"
                       ref="searchInput"
                       class="search-input theme-title bf-14 f-fx1"
                       name="search"
                       type="search"
                       :placeholder="recommendText"
                       @focus="visible=true"
                       @blur="visible=false"
                       @keyup.enter="search()"
                >
                <transition name="fade">
                        <span v-show="searchKey" @click="clearSearchKey()" class="search-close f-df f-jac">
                            <svg-icon icon-class="close" class="search-close-icon size-md"/>
                        </span>
                </transition>
            </label>
            <search-suggest :visible="visible" :keyword="searchKey" @suggest-search="search"></search-suggest>
        </template>
    </base-nav-bar>
</template>

<script>
    import { searchMixin } from '@/util/mixin';
    import SearchSuggest from './SearchSuggest';

    export default {
        name: 'SearchInput',
        mixins: [ searchMixin ],
        props: {
            hotVisible: Boolean
        },
        data() {
            return {
                visible: false,
                searchKey: '',
                recommendText: 'hello world',
            };
        },
        mounted() {
            this.focusInput();
        },
        activated() {
            this.focusInput();
        },
        components: {
            SearchSuggest
        },
        watch: {
            '$route'(to, from) {
                if (to.path !== '/play/detail' && to.path !== '/singer/detail' && from.path === '/search') {
                    this.searchKey = '';
                }
            },
            keyword(val) {
                if (val && val !== this.searchKey) this.searchKey = val;
            },
        },
        methods: {
            clearSearchKey() {
                this.searchKey = '';
                this.focusInput();
            },
            focusInput() {
                this.$refs.searchInput.focus();
            },
            search(word) {
                if (word) this.searchKey = word;
                if (this.searchKey === this.keyword) return;
                this.searchKey = this.searchKey.trim() ? this.searchKey : this.recommendText;
                this.$emit('input-search', this.searchKey);
            },
            arrowOnPress() {
                if (this.hotVisible) {
                    this.$router.back();
                } else {
                    this.searchKey = '';
                    this.setSearchKeyword('');
                    this.$emit('cancel-search');
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    .search-wrapper {
        height: 80%;
        border-bottom: 1px solid transparent;
        @include border1;

        .search-input {
            height: 100%;
        }

        .search-close {
            min-width: 40px;
            flex: 0 0 40px;
            height: 100%;

            .search-close-icon {
                font-weight: bold;
            }
        }
    }
</style>
