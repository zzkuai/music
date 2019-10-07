<template>
    <div class="base-modal p-pa" @click.stop.prevent="clickModal()"></div>
</template>

<script>
    export default {
        name: 'BaseModal',
        methods: {
            clickModal() {
                this.$emit('modal-on-click');
            }
        }
    };
</script>

<style lang="scss" scoped>
    .base-modal {
        top: 0;
        left: 0;
        z-index: -1;
        @include wh(100%);
        background-color: rgba(0, 0, 0, 0.5);
    }
</style>
