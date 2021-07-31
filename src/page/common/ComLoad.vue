<template>
  <transition name="fade">
    <div class="com-load p-pf f-df f-jac" v-show="loadVisible">
      <div class="com-load-text-wrapper">
        <base-font text="请稍候..." color="white" />
      </div>
    </div>
  </transition>
</template>

<script>
import { homeMixin } from '@/util/mixin';

export default {
  name: 'ComLoad',
  mixins: [homeMixin],
};
</script>

<style lang="scss" scoped>
.com-load {
  top: 0;
  left: 0;
  @include wh(100%);
  z-index: 9999;

  .com-load-text-wrapper {
    padding: 10px 15px;
    background-color: rgba(0, 0, 0, 0.8);
    border-radius: 5px;
  }
}
</style>
