<template>
  <div class="playlist-tag">
    <base-nav-bar text="歌单标签" class="theme" />
    <base-state :state="state">
      <base-scroll nav-bar>
        <ul class="tag-list o-oh p-pr ignore">
          <li
            class="tag-list-item ignore"
            :ref="`tagListItem${
              typeof data.category === 'number' ? data.category : 'Self'
            }`"
            v-for="(data, index) in tagList"
            :key="index"
          >
            <div class="tag-title-wrapper f-df f-aic f-jcb">
              <base-font class="tag-title" :text="data.name" />
              <div
                v-if="data.self"
                class="tag-edit-wrapper f-df theme-bg2"
                @click="editClick"
              >
                <base-font :text="editText" size="10" />
              </div>
            </div>
            <ul
              :ref="data.self && 'subSelf'"
              class="sub-list m-mt15 f-df f-fww"
              :style="data.self && subListStyle"
            >
              <li
                class="sub-list-item t-tac ignore p-pr f-df f-jac theme-bg2"
                :key="index"
                data-sub="1"
                :style="[subListItemStyle]"
                v-for="(sub, index) in data.subs"
                :class="{
                  mg0: (index + 1) % columnCount === 0,
                  transform: data.self && !sub.fixed,
                  hidden:
                    !moveItemAdd &&
                    sub.name === moveItemText &&
                    isMoving &&
                    data.self,
                  disabled: data.self
                    ? isEdit && sub.fixed
                    : user.map(({ name }) => name).includes(sub.name),
                }"
                @click="(e) => itemClick(e, sub, data.self)"
              >
                <svg-icon
                  v-show="isEdit && data.self && !sub.fixed"
                  icon-class="reduce"
                  class="sub-list-item-icon p-pa size-si"
                ></svg-icon>
                <svg-icon
                  v-show="isEdit && !sub.fixed && !data.self"
                  icon-class="plus"
                  class="sub-list-item-icon p-pa size-si"
                ></svg-icon>
                <svg-icon
                  v-show="sub.hot && !isEdit"
                  icon-class="fire"
                  class="sub-list-item-icon p-pa size-sm"
                  color="red"
                />
                <base-font
                  class="sub-list-item-text line-one"
                  :class="{
                    'sub-list-item-text-mg': (sub.hot || isEdit) && !sub.fixed,
                  }"
                  :text="sub.name"
                  size="12"
                />
              </li>
            </ul>
          </li>
        </ul>
        <div
          ref="moveItemEl"
          :class="{ move: isMoving }"
          class="
            sub-list-item
            t-tac
            sub-list-move-item
            ignore
            f-df f-jac
            theme-bg2
            p-pa
          "
          :style="[subListItemStyle, subListMoveItemStyle]"
        >
          <svg-icon
            v-show="moveItemAdd"
            icon-class="reduce"
            class="sub-list-item-icon p-pa size-si"
          />
          <svg-icon
            v-show="!moveItemAdd"
            icon-class="plus"
            class="sub-list-item-icon p-pa size-si"
          />
          <base-font
            class="sub-list-item-text-mg"
            :text="moveItemText"
            size="12"
          />
        </div>
      </base-scroll>
    </base-state>
  </div>
</template>

<script>
import { playlistMixin, stateMixin } from '@/util/mixin';
import { NAV_BAR_HEIGHT, PAGE_WIDTH } from '@/config/param';

const COLUMN_COUNT = 4;
const SUB_LIST_ITEM_MARGIN = 10;
const SUB_LIST_ITEM_HEIGHT = 35;
const SUB_LIST_ITEM_WIDTH =
  (PAGE_WIDTH - 15 * 2 - SUB_LIST_ITEM_MARGIN * 3) / COLUMN_COUNT;
export default {
  name: 'PlayListTag',
  mixins: [stateMixin, playlistMixin],
  data() {
    return {
      user: [],
      list: [],
      isEdit: false,
      moveEl: null,
      moveItemText: '',
      moveItemAdd: false,
      isMoving: false, // 标签是否正在移动
      columnCount: COLUMN_COUNT,
      subListMoveItemStyle: {}, // 移动标签的样式
    };
  },
  activated() {
    this.isEdit = false;
  },
  mounted() {
    this.moveEl = this.$refs.moveItemEl;
  },
  computed: {
    tagList() {
      const user = [{ name: '我的歌单广场', self: true, subs: this.user }];
      return user.concat(this.list);
    },
    editText() {
      return this.isEdit ? '完成' : '编辑';
    },
    subListStyle() {
      return {
        height:
          Math.ceil(this.user.length / COLUMN_COUNT) *
            (SUB_LIST_ITEM_HEIGHT + SUB_LIST_ITEM_MARGIN) +
          'px',
      };
    },
    subListItemStyle() {
      return {
        width: SUB_LIST_ITEM_WIDTH + 'px',
      };
    },
    targetOffsetLeft() {
      return (
        this.$refs.subSelf[0].offsetLeft +
        (this.user.length % COLUMN_COUNT) *
          (SUB_LIST_ITEM_WIDTH + SUB_LIST_ITEM_MARGIN)
      );
    },
    targetOffsetTop() {
      return (
        this.$refs.subSelf[0].offsetTop +
        Math.floor(this.user.length / COLUMN_COUNT) *
          (SUB_LIST_ITEM_HEIGHT + SUB_LIST_ITEM_MARGIN)
      );
    },
  },
  methods: {
    async getData() {
      try {
        await this.getCat();
        this.user = this.userCategory;
        this.list = this.category;
        this.state = 'data';
      } catch (e) {
        this.state = 'error';
      }
    },
    editClick() {
      if (this.isEdit) this.setUser(this.user);
      this.isEdit = !this.isEdit;
    },
    itemClick(e, sub, self) {
      const isExist = this.user.some(({ name }) => sub.name === name); // 已在我的歌单广场列表
      if (this.isEdit) {
        if (this.isMoving || !this.isEdit || sub.fixed || (isExist && !self))
          return;
        this.moveItemText = sub.name;
        isExist ? this.removeItem(e, sub) : this.addItem(e, sub);
      } else {
        if (isExist || self) return;
        this.$router.push({
          path: '/playlist/category',
          query: { category: sub.name },
        });
      }
    },
    removeItem(e, sub) {
      if (this.user.length === 6) {
        this.$toast('不能再删除了哦');
      } else {
        this.moveItemAdd = false;
        const startEl = Array.from(e.path).find(
          (item) => item.dataset.sub === '1'
        );
        const tagEl = this.$refs[`tagListItem${sub.category}`][0];
        const endEl = Array.from(
          tagEl.querySelectorAll('li.sub-list-item')
        ).find((item) => item.innerText.trim() === sub.name);
        this.subListMoveItemStyle = {
          transform: `translate3d(${startEl.offsetLeft}px,${
            startEl.offsetTop + NAV_BAR_HEIGHT
          }px,0)`,
        };
        this.$nextTick(() => {
          this.isMoving = true;
          this.subListMoveItemStyle = {
            transform: `translate3d(${endEl.offsetLeft}px,${
              endEl.offsetTop + NAV_BAR_HEIGHT
            }px,0)`,
          };
        });
        setTimeout(() => {
          this.user = this.user.filter(({ name }) => name !== sub.name);
          this.isMoving = false;
        }, 300);
      }
    },
    addItem(e, sub) {
      this.moveItemAdd = true;
      const startEl = Array.from(e.path).find(
        (item) => item.dataset.sub === '1'
      );
      this.subListMoveItemStyle = {
        transform: `translate3d(${startEl.offsetLeft}px,${
          startEl.offsetTop + NAV_BAR_HEIGHT
        }px,0)`,
      };
      this.$nextTick(() => {
        this.isMoving = true;
        startEl.classList.add('disabled');
        this.subListMoveItemStyle = {
          transform: `translate3d(${this.targetOffsetLeft}px,${
            this.targetOffsetTop + NAV_BAR_HEIGHT
          }px,0)`,
        };
      });
      setTimeout(() => {
        this.user = [...this.user, sub];
        this.isMoving = false;
      }, 300);
    },
    // getSubListItemTransformStyle(index) {
    //     const offsetLeft = (index % COLUMN_COUNT) * (SUB_LIST_ITEM_WIDTH + SUB_LIST_ITEM_MARGIN);
    //     const offsetTop = index > 3 && Math.floor(index / COLUMN_COUNT) * (SUB_LIST_ITEM_HEIGHT + SUB_LIST_ITEM_MARGIN) || 0;
    //     return {
    //         position: 'absolute',
    //         transform: `translate3d(${ offsetLeft }px,${ offsetTop }px,0)`
    //     };
    // }
  },
};
</script>

<style lang="scss" scoped>
.playlist-tag {
  @include wh(100%);

  .tag-list {
    &.ignore {
      padding: 0 15px;
    }
  }

  .tag-list-item {
    &.ignore {
      margin-top: 30px;
    }
  }

  .tag-edit-wrapper {
    padding: 5px 15px;
    border-radius: 25px;
  }

  .sub-list {
    @include ts(height);
    align-content: flex-start;
  }

  .sub-list-item {
    border-radius: 15px;

    &.ignore {
      margin-right: 10px;
      margin-bottom: 10px;
      height: 35px;
    }

    &.mg0 {
      margin-right: 0;
    }

    &.disabled {
      opacity: 0.2;
    }

    &.move {
      z-index: 1;
      @include ts(transform);
    }

    &.hidden {
      visibility: hidden;
    }

    &.transform {
      @include ts(transform);
    }
  }

  .sub-list-move-item {
    top: 0;
    left: 0;
    z-index: -1;
  }

  .sub-list-item-icon {
    left: 8px;
  }

  .sub-list-item-text {
    &.disabled {
      opacity: 0;
    }
  }

  .sub-list-item-text-mg {
    margin-left: 15px;
  }
}
</style>
