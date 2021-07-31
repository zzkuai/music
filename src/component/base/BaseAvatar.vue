<template>
  <transition name="fade">
    <div class="avatar p-pf f-df f-jac" v-show="visible">
      <img class="avatar-img" :src="avatar" alt="avatar" />
      <base-modal @modal-on-click="hideAvatar()"></base-modal>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'BaseAvatar',
  props: {
    avatar: {
      type: String,
      isRequired: true,
    },
  },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    showAvatar() {
      this.visible = true;
    },
    hideAvatar() {
      this.visible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.avatar {
  top: 0;
  left: 0;
  @include wh(100%);
  z-index: 500;
  background-color: black;

  .avatar-img {
    width: 100%;
    height: 300px;
  }
}
</style>
