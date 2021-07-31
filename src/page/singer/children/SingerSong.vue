<template>
  <base-loading v-if="songLoading" top="50%" />
  <ul class="list ignore" v-else>
    <li
      class="list_item f-df f-aic"
      v-for="(item, index) in song"
      :key="item.id"
      @click="playSong(item, song)"
    >
      <div class="list_item-left f-df f-jac">
        <svg-icon
          v-if="curSongActive(item.id)"
          icon-class="sound"
          class="size-md"
        />
        <base-font v-else :text="`${index + 1}`" color="text" />
      </div>
      <div class="list_item-right f-df f-aic f-fx1">
        <div class="right-text f-df f-fdc f-jcb f-fx1">
          <base-font class="line-one" text="" color="text">
            <base-font :text="item.name" />
            <base-font :text="item.alia | aliaFormat" color="text" />
          </base-font>
          <base-font
            class="right-info line-one"
            :text="item | infoFormat"
            color="text"
            size="10"
          />
        </div>
        <div class="right-more f-df f-jac" @click.stop="rightOnClick(index)">
          <svg-icon icon-class="more" class="size-md" />
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import { homeMixin, singerMixin, playMixin } from '@/util/mixin';

export default {
  name: 'SingerSong',
  mixins: [homeMixin, singerMixin, playMixin],
  props: {
    songLoading: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      moreVisible: false,
    };
  },
  computed: {
    song() {
      return this.getSingerSongById(this.id);
    },
  },
  methods: {
    rightOnClick(index) {
      this.$emit('click-more', this.song[index]);
    },
  },
};
</script>

<style lang="scss" scoped>
.list {
  .list_item {
    height: 60px;
  }

  .list_item-left {
    height: 100%;
    min-width: 50px;
  }

  .list_item-right {
    height: 100%;
  }

  .right-more {
    min-width: 50px;
    height: 100%;
  }

  .right-info {
    margin-top: 4px;
  }
}
</style>
