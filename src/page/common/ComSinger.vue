<template>
    <ul class="com_singer-list p-p15 ignore">
        <li class="com_singer-list_item f-df"
            :class="{'m-mt15':index>0}"
            v-for="(data,index) in list"
            :key="data.id"
            @click.stop="goSingerDetail(data.id)"
        >
            <div class="com_singer-list_item-left f-df f-jac">
                <img class="com_singer-list_item-left-img" v-lazy="`${data.picUrl}?param=${avatarSize}y${avatarSize}`" :alt="data.name">
            </div>
            <div class="com_singer-list_item-right f-df f-aic f-fx1">
                <base-font :text="data.name"/>
            </div>
        </li>
    </ul>
</template>

<script>
    import { PAGE_DPR } from '@/config/param';

    const AVATAR_SIZE = 45;
    export default {
        name: 'ComSinger',
        props: {
            list: {
                type: Array
            }
        },
        data() {
            return {
                avatarSize: Math.floor(AVATAR_SIZE * PAGE_DPR)
            };
        },
        methods: {
            goSingerDetail(id) {
                this.$emit('com-singer-click');
                this.$router.push({ path: '/singer/detail', query: { id } });
            }
        }
    };
</script>

<style lang="scss" scoped>
    .com_singer-list {
        .com_singer-list_item-left {
            @include wh(45px);
        }

        .com_singer-list_item-left-img {
            @include wh(100%);
            border-radius: 25px;
        }

        .com_singer-list_item-right {
            margin-left: 15px;
        }
    }
</style>
