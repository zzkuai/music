<template>
  <transition name="fade">
    <div class="dialog p-pf f-df f-jac" v-show="visible" @click.self="hide()">
      <div class="dialog-content theme">
        <template v-if="type === 'confirm'">
          <div class="dialog-content-title-wrapper">
            <base-font :text="title" color="text" size="12" />
          </div>
          <div class="dialog-content-text-wrapper f-df f-jce">
            <base-font
              class="dialog-content-text"
              :text="cancel"
              size="12"
              @bf-click="hide()"
            />
            <base-font
              class="dialog-content-text"
              :text="confirm"
              size="12"
              @bf-click="dialogConfirm()"
            />
          </div>
        </template>
        <template v-if="type === 'list'">
          <div class="dialog-content-title-wrapper">
            <base-font class="dialog-content-title" :text="title" size="16" />
          </div>
          <div class="dialog-content-list-wrapper">
            <ul class="dialog-content-list f-df f-fdc">
              <li
                class="dialog-content-list-item f-df f-aic"
                v-for="(item, index) in data"
                :class="{ 'm-mt15': index > 0 }"
                :key="index"
                @click.stop.prevent="clickItem(item.id)"
              >
                <div
                  class="dialog-content-list-item-img"
                  :style="`background-image:url(${item.avatar}?param${avatarSize}y${avatarSize})`"
                ></div>
                <base-font :text="item.name" />
              </li>
            </ul>
          </div>
        </template>
      </div>
    </div>
  </transition>
</template>

<script>
import { PAGE_DPR } from '@/config/param';

export default {
  name: 'BaseDialog',
  props: {
    type: {
      type: String,
      default: 'confirm',
    },
    title: {
      type: String,
      isRequired: true,
    },
    cancel: {
      type: String,
      default: '取消',
    },
    confirm: {
      type: String,
      default: '确认',
    },
  },
  data() {
    return {
      visible: false,
      data: null,
      avatarSize: 40 * PAGE_DPR,
    };
  },
  methods: {
    show(data) {
      this.visible = true;
      if (data) this.data = data;
    },
    hide() {
      this.visible = false;
    },
    dialogConfirm() {
      this.$emit('confirm');
      this.hide();
    },
    clickItem(id) {
      this.$emit('item-on-click', id);
      this.hide();
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1100;
  @include wh(100%);
  background-color: rgba(0, 0, 0, 0.5);

  .dialog-content {
    width: 90%;
    /*height: 350px;*/
    padding: 20px;
    border-radius: 8px;
  }

  .dialog-content-title-wrapper {
    margin-bottom: 20px;

    .dialog-content-title {
      font-weight: bold;
    }
  }

  .dialog-content-text {
    margin-right: 10px;

    &:first-child {
      margin-right: 35px;
    }
  }

  .dialog-content-list-wrapper {
    max-height: 400px;
    overflow-y: scroll;
  }

  .dialog-content-list-item-img {
    @include wh(40px);
    margin-right: 15px;
    background: no-repeat center center;
    background-size: cover;
    border-radius: 5px;
  }
}
</style>
