<template>
  <div class="not-found f-df f-fdc f-jac">
    <base-font class="not-found-text" text="404" size="18" />
    <base-font text="点击回到首页" @bf-click="$router.replace({ path: '/' })" />
  </div>
</template>

<script>
export default {
  name: 'NotFound',
};
</script>

<style lang="scss" scoped>
.not-found {
  @include wh(100%);

  .not-found-text {
    margin-bottom: 15px;
  }
}
</style>
