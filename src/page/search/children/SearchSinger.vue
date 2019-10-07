<template>
        <com-singer class="search-singer" :list="list"></com-singer>
</template>

<script>
    import componentMixin from './searchComponentsMixin';
    import ComSinger from '../../common/ComSinger';

    export default {
        name: 'SearchSinger',
        mixins: [ componentMixin ],
        components: {
            ComSinger
        }
    };
</script>

<style lang="scss" scoped>
</style>
