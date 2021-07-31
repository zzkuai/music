<template>
  <transition name="fade">
    <div
      class="back-to-top theme-bg2 f-df f-jac p-pf"
      v-show="visible"
      @click="toTop"
    >
      <svg-icon
        icon-class="arrow-up"
        class="back-to-top-icon size-ss"
      ></svg-icon>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'BackToTop',
  props: {
    visible: {
      type: Boolean,
      isRequired: true,
    },
  },
  methods: {
    toTop() {
      document.querySelector('.scroll-wrapper').scrollTop = 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.back-to-top {
  bottom: 60px;
  right: 20px;
  @include wh(30px);
  border-radius: 50%;
  z-index: 998;

  .back-to-top-icon {
    z-index: 1;
  }
}
</style>
