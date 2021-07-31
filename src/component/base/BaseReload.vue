<template>
  <div
    class="base-reload p-pb15 t-tac"
    @click="$emit('reload-more', true)"
    v-if="visible"
  >
    <base-font text="点击重试" />
  </div>
</template>

<script>
export default {
  name: 'BaseReload',
  props: {
    visible: {
      type: Boolean,
      default: false,
      isRequired: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>
