<template>
  <ul class="list ignore f-df f-fww">
    <li
      class="list-item m-mb15 ignore"
      v-for="(data, index) in list"
      :key="index"
      :style="itemStyle"
      :class="{ mg0: (index + 1) % 3 === 0 }"
      @click="goPlayListDetail(data.id)"
    >
      <div class="list-item-cover-wrapper o-oh p-pr" :class="{ crown }">
        <img
          class="list-item-cover"
          v-lazy="`${data.coverImgUrl}?param=${coverSize}y${coverSize}`"
          alt="cover"
        />
        <base-font
          class="list-item-count p-pa"
          :text="data.playCount | numberFormat"
          size="10"
          color="white"
        />
        <svg-icon
          v-if="crown"
          icon-class="crown"
          class="list-item-icon size-si p-pa"
          color="white"
        ></svg-icon>
      </div>
      <div class="list-item-text-wrapper m-mt5">
        <base-font class="line-two" :text="data.name" size="10" />
      </div>
    </li>
  </ul>
</template>

<script>
import { PAGE_WIDTH, PAGE_DPR } from '@/config/param';

const COLUMN_COUNT = 3;
const ITEM_WIDTH = (PAGE_WIDTH - 15 * 2 - 10 * 2) / COLUMN_COUNT;
export default {
  name: 'PlayListItem',
  props: {
    list: Array,
    crown: Boolean, // 皇冠tag
  },
  data() {
    return {
      itemWidth: ITEM_WIDTH,
    };
  },
  computed: {
    coverSize() {
      return this.itemWidth * PAGE_DPR;
    },
    itemStyle() {
      return {
        width: this.itemWidth + 'px',
      };
    },
  },
  methods: {
    goPlayListDetail(id) {
      this.$router.push({ path: '/playlist/detail', query: { id } });
    },
  },
};
</script>

<style lang="scss" scoped>
.list {
  &.ignore {
    padding: 15px;
  }

  .list-item {
    &.ignore {
      margin-right: 10px;
    }

    &.mg0 {
      margin-right: 0;
    }
  }

  .list-item-cover-wrapper {
    border-radius: 5px;

    &.crown {
      &:before {
        position: absolute;
        content: '';
        top: -20px;
        left: -20px;
        z-index: 10;
        @include wh(40px);
        border-radius: 50%;
        background-color: #e7aa5a;
      }
    }
  }

  .list-item-cover {
    display: block;
    width: 100%;
    border-radius: 5px;
    z-index: 5;
  }

  .list-item-count {
    top: 3px;
    right: 3px;
  }

  .list-item-icon {
    top: 3px;
    left: 3px;
    z-index: 20;
    transform: rotate(-36deg);
  }
}
</style>
