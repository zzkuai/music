<template>
  <div
    class="loading p-pf f-df f-jcc f-aie"
    :class="{ 'theme-bg': themeBg }"
    :style="loadStyle"
  >
    <div
      v-for="(item, index) in list"
      :key="index"
      :style="lineWrapperStyle()"
      class="line-wrapper ignore f-df f-aie"
    >
      <span class="line theme-bg-reverse" :style="lineStyle(index)"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseLoading',
  props: {
    top: {
      type: String,
      default: '50%',
    },
    width: {
      type: Number,
      default: 2,
    },
    count: {
      type: Number,
      default: 6,
    },
    minHeight: {
      type: Number,
      default: 10,
    },
    maxHeight: {
      type: Number,
      default: 20,
    },
    themeBg: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      list: Array(this.count),
    };
  },
  computed: {
    loadStyle() {
      return {
        top: this.top,
      };
    },
  },
  methods: {
    lineWrapperStyle() {
      const lineHeight =
        Math.floor(Math.random() * this.maxHeight) + this.minHeight;
      return `width:${this.width}px;height:${lineHeight}px;`;
    },
    lineStyle(index) {
      return `animation-name:loading-line${index % 2}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.loading {
  left: 50%;
  width: 80px;
  margin-left: -40px;
}

.line-wrapper {
  margin-left: 4px;

  &:first-child {
    margin-left: 0;
  }
}

.line {
  width: 100%;
  animation: 1s linear infinite alternate;
}
</style>
