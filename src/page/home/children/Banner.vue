<template>
  <div class="swiper-container banner p-pt15">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(data, index) in list" :key="index">
        <img
          :src="`${data.imageUrl}?param=${swiperImgWidth}y${swiperImgHeight}`"
          alt="banner"
          class="banner-img"
        />
        <div
          class="banner-tag f-df p-pa f-jac"
          :style="`backgroundColor:${data.titleColor};`"
        >
          <base-font :text="data.typeTitle" size="10" color="white" />
        </div>
      </div>
    </div>
    <div class="swiper-pagination"></div>
  </div>
</template>

<script>
import { PAGE_DPR, PAGE_WIDTH } from '@/config/param';
import childMixin from './index.js';
import { Swiper, Autoplay, Pagination } from 'swiper/js/swiper.esm.js';

Swiper.use([Pagination, Autoplay]);

export default {
  name: 'Banner',
  mixins: [childMixin],
  computed: {
    swiperImgWidth() {
      return Math.floor((PAGE_WIDTH - 15 * 2) * PAGE_DPR);
    },
    swiperImgHeight() {
      return Math.floor((this.swiperImgWidth * 128) / 345);
    },
  },
  mounted() {
    new Swiper('.swiper-container', {
      loop: true,
      speed: 500,
      preloadImages: false,
      autoplay: {
        delay: 5000,
      },
      spaceBetween: 20,
      pagination: {
        el: '.swiper-pagination',
      },
    });
  },
};
</script>

<style lang="scss" scoped>
@import '~swiper/css/swiper.min.css';

.banner {
  margin: 0 15px;
  border-radius: 5px;

  .banner-img {
    display: block;
    width: 100%;
    border-radius: 5px;
  }

  .banner-tag {
    padding: 4px 6px;
    right: 0;
    bottom: 0;
    border-top-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
}
</style>

<style lang="scss">
.banner {
  .swiper-pagination {
    bottom: 5px;
  }

  .swiper-pagination-bullet {
    @include wh(6px);
  }

  .swiper-pagination-bullet-active {
    background-color: black;
  }
}
</style>
