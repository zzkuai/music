<template>
  <span
    :class="`bf-${size} ${color ? `theme-${color}` : ''}`"
    class="base-font"
    @click="$emit('bf-click')"
    >{{ text }}<slot></slot
  ></span>
</template>

<script>
export default {
  props: {
    text: {
      type: [String, Number],
      required: true,
    },
    size: {
      type: String,
      default: '14',
    },
    color: {
      type: String,
      default: 'title',
    },
  },
};
</script>

<style lang="scss" scoped>
.base-font {
  letter-spacing: 0.5px;
}
</style>
