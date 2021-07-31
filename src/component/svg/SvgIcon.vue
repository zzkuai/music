<template>
  <svg :class="svgClass" class="svg-icon" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
export default {
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: '',
    },
  },
  computed: {
    iconName() {
      return `#icon-${this.iconClass}`;
    },
    svgClass() {
      const color = this.color ? `-${this.color}` : '';
      return `svg-icon-${this.$store.state.theme}${color}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.svg-icon {
  overflow: hidden;
}

.svg-icon-day {
  fill: $day-icon;
}

.svg-icon-night {
  fill: $night-icon;
}

.svg-icon-day-white {
  fill: $white;
}

.svg-icon-night-white {
  fill: $white;
}

.svg-icon-day-red {
  fill: $day-red;
}

.svg-icon-night-red {
  fill: $night-red;
}
</style>
