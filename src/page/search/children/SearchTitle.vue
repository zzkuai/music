<template functional>
  <div class="search-title p-ph15 f-df f-jcb f-aic m-mt15">
    <base-font :text="props.title" size="16" />
    <slot name="title-right"></slot>
  </div>
</template>

<script>
export default {
  name: 'SearchTitle',
};
</script>

<style lang="scss" scoped></style>
