<template>
  <div class="swipe-card-wrapper p-pr" :style="cardWrapperStyle">
    <ul
      ref="swipeCard"
      class="swipe-card f-df f-ais"
      @touchstart="onCardTouchStart"
      @touchmove="onCardTouchMove"
      @touchend="onCardTouchEnd"
    >
      <li
        class="swipe-card-item p-pa f-df f-fdc"
        :key="index"
        v-for="(card, index) in cards"
        :class="{
          active: index === activeCard % cardsLen,
          transition: !isTouching,
        }"
        :style="getCardItemStyle(index)"
        @click="changeCard(index, card.id)"
      >
        <div class="item-cover-wrapper f-df p-pr">
          <img
            class="item-cover"
            :style="itemCoverStyle"
            v-lazy="`${card.coverImgUrl}?param=${imgSize}y${imgSize}`"
          />
          <base-font
            class="item-count p-pa"
            :text="card.playCount | numberFormat"
            size="12"
            color="white"
          />
        </div>
        <div class="item-text-wrapper theme f-df f-jac ignore">
          <base-font :text="card.name" size="12" />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { PAGE_DPR } from '@/config/param';

export default {
  name: 'SwipeCard',
  props: {
    cards: Array, // 卡片数组
    cardWidth: {
      // 卡片宽度
      type: Number,
      default: 160,
    },
    cardScale: {
      // 卡片缩放比例
      type: Number,
      default: 0.85,
    },
    cardOpacity: {
      // 卡片透明度
      type: Number,
      default: 0.5,
    },
  },
  data() {
    return {
      activeCard: 0, // 顶层card
      cardWrapperWidth: 0, // 卡片容器总宽度
      cardItemWidth: this.cardWidth, // 单个卡片的宽度
      cardItemScaleWidth: this.cardWidth * this.cardScale, // 单个卡片缩放后的宽度
      isTouching: false,
      startX: 0, // 手指触摸起始点位置
      startTime: 0,
      moveX: 0, // 手指触摸滑动距离
    };
  },
  mounted() {
    this.cardWrapperWidth = this.$refs.swipeCard.clientWidth;
  },
  computed: {
    cardsLen() {
      return this.cards.length;
    },
    prevIndex() {
      return (this.activeCard - 1 + this.cardsLen) % this.cardsLen;
    },
    nextIndex() {
      return (this.activeCard + 1) % this.cardsLen;
    },
    imgSize() {
      return this.cardWidth * PAGE_DPR;
    },
    cardWrapperStyle() {
      return {
        height: this.cardWidth + 50 + 'px',
      };
    },
    itemCoverStyle() {
      return {
        width: this.cardWidth + 'px',
        height: this.cardWidth + 'px',
      };
    },
    nextItemLeftOffset() {
      return this.cardWrapperWidth - this.cardItemScaleWidth; // 右侧卡片与左边框距离
    },
    scaleHalfWidth() {
      return (this.cardItemWidth - this.cardItemScaleWidth) / 2; // 缩放值的一半
    },
    scaleItemNotOverlayWidth() {
      return (this.cardWrapperWidth - this.cardItemWidth) / 2; // 缩放卡片未重叠宽度
    },
    scaleItemOverlayWidth() {
      return this.cardItemScaleWidth - this.scaleItemNotOverlayWidth; // 缩放卡片重叠宽度
    },
    moveToPrevItemOffset() {
      return (
        this.cardItemWidth - this.scaleItemOverlayWidth - this.scaleHalfWidth
      ); // 右滑回到上一张可滑动的间距
    },
    moveToNextItemOffset() {
      return this.scaleItemNotOverlayWidth + this.scaleHalfWidth; // 左滑前往下一张可滑动的间距
    },
  },
  methods: {
    changeCard(index, id) {
      if (this.activeCard === index) {
        this.$router.push({ path: '/playlist/detail', query: { id } });
      } else {
        this.activeCard = index;
        this.$emit('card-change', index);
      }
    },
    onCardTouchStart(e) {
      this.startX = e.changedTouches[0].clientX;
      this.startTime = new Date();
      this.isTouching = true;
    },
    onCardTouchMove(e) {
      this.moveX = e.changedTouches[0].clientX - this.startX;
    },
    onCardTouchEnd() {
      if (
        (Math.abs(this.moveX) >= 10 && new Date() - this.startTime <= 200) ||
        Math.abs(this.moveX) >= this.cardItemWidth
      ) {
        if (this.moveX < 0) {
          // 下一张
          this.activeCard = (this.activeCard + 1) % this.cardsLen;
        } else {
          // 上一张
          this.activeCard =
            (this.activeCard - 1 + this.cardsLen) % this.cardsLen;
        }
        this.$emit('card-change', this.activeCard);
      }
      this.startX = 0;
      this.moveX = 0;
      this.isTouching = false;
    },
    getCardItemStyle(curIndex) {
      if (this.cardWrapperWidth === 0) return {};
      const sign = Math.sign(this.moveX); // 负：左滑  正：右滑
      const toRight = this.moveX > 0;
      /* 滑动时卡片位置处理 */
      const moveToDiffOffset = toRight
        ? this.moveToPrevItemOffset
        : this.moveToNextItemOffset; // 滑动间距
      const toPrevItemTouchOffset =
        (this.moveX * moveToDiffOffset) / this.cardWrapperWidth; // 手指触摸滑动间距
      const moveOffset =
        Math.abs(toPrevItemTouchOffset) >= moveToDiffOffset
          ? moveToDiffOffset * sign
          : toPrevItemTouchOffset; // 左右可滑动的距离
      const backItemDiffOffset = Math.abs(
        (this.moveX * this.nextItemLeftOffset) / this.cardWrapperWidth
      ); // 最底层card滑动距离
      const backItemMoveOffset =
        (backItemDiffOffset >= this.nextItemLeftOffset
          ? this.nextItemLeftOffset
          : backItemDiffOffset) * (toRight ? -1 : 1); // 底层card可滑动的距离
      /* 滑动时卡片缩放处理 */
      const cardItemScaleDiff = 1 - this.cardScale; // 卡片缩放值
      const itemScaleOffset =
        (Math.abs(this.moveX) * cardItemScaleDiff) / this.cardWrapperWidth; // 滑动时卡片的相对缩放值
      const moveScale =
        itemScaleOffset >= cardItemScaleDiff
          ? cardItemScaleDiff
          : itemScaleOffset; // 卡片可缩放比例
      /* 滑动时卡片透明度处理 */
      const cardItemOpacityDiff = 1 - this.cardOpacity; // 卡片透明度缩放值
      const itemOpacityOffset =
        (Math.abs(this.moveX) * cardItemOpacityDiff) / this.cardWrapperWidth; // 滑动时卡片的相对缩放值
      const moveOpacity =
        itemOpacityOffset >= cardItemOpacityDiff
          ? cardItemOpacityDiff
          : itemOpacityOffset; // 卡片可缩放比例
      /* 滑动时卡片层级处理 */
      const moveToDiffHalfOffset = moveToDiffOffset / 2;
      const isMoveHalfOffset = Math.abs(moveOffset) >= moveToDiffHalfOffset;
      /* 卡片样式调整 */
      const activeStyle =
        (curIndex === this.activeCard && {
          opacity: 1 - moveOpacity,
          transform: `translate3d(${
            this.scaleItemNotOverlayWidth + moveOffset
          }px,0,0) scale(${1 - moveScale})`,
        }) ||
        {};
      const prevStyle =
        (curIndex === this.prevIndex && {
          zIndex: this.isTouching && isMoveHalfOffset && toRight ? 2 : 0,
          opacity: 0.5 + (toRight ? moveOpacity : 0),
          transform: `translate3d(${
            -this.scaleHalfWidth + (toRight ? moveOffset : backItemMoveOffset)
          }px,0,0) scale(${this.cardScale + (toRight ? moveScale : 0)})`,
        }) ||
        {};
      const nextStyle =
        (curIndex === this.nextIndex && {
          zIndex: this.isTouching && isMoveHalfOffset && !toRight ? 2 : 0,
          opacity: 0.5 + (toRight ? 0 : moveOpacity),
          transform: `translate3d(${
            this.nextItemLeftOffset -
            this.scaleHalfWidth +
            (toRight ? backItemMoveOffset : moveOffset)
          }px,0,0) scale(${this.cardScale + (toRight ? 0 : moveScale)})`,
        }) ||
        {};
      return {
        width: this.cardItemWidth + 'px',
        ...activeStyle,
        ...prevStyle,
        ...nextStyle,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.swipe-card-wrapper {
  width: 100%;

  .swipe-card {
    @include wh(100%);
  }

  .swipe-card-item {
    top: 0;
    left: 0;
    height: 100%;
    z-index: 1;

    &.active {
      z-index: 2;
    }

    &.transition {
      @include ts(transform, opacity);
    }
  }

  .item-cover-wrapper {
    width: 100%;
  }

  .item-cover {
    border-radius: 5px 5px 0 0;
  }

  .item-count {
    top: 5px;
    right: 5px;
  }

  .item-text-wrapper {
    padding: 0 10px;
    border-radius: 0 0 5px 5px;

    &.ignore {
      height: 50px;
    }
  }
}
</style>
