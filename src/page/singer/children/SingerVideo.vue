<template>
    <base-loading v-if="singerLoad" top="50%"/>
    <div v-else>
        <ul class="list ignore">
            <li class="list_item f-df" v-for="data in video" :key="data.id">
                <div class="list_item-left" v-lazy:backgroundImage="`${data.imgurl}?param=260y140`"></div>
                <div class="list_item-right f-df f-fdc f-jcc">
                    <base-font :text="data.name">
                        <base-font :text="data.alias | formatAlias" color="text"/>
                    </base-font>
                    <base-font class="list_item-right-info" size="12" color="text" :text="getDataInfo(data)"/>
                </div>
            </li>
        </ul>
        <base-load-more :visible="load"/>
    </div>
</template>

<script>
    import { singerMixin } from '@/util/mixin';

    export default {
        name: 'SingerVideo',
        mixins: [ singerMixin ],
        data() {
            return {
                video: null
            };
        },
        filters: {
            formatAlias(alias) {
                return alias?.length > 0 ? ` (${ alias[ 0 ] })` : '';
            }
        },
        methods: {
            async getData(reload = true) {
                try {
                    await this.setMV(this.id);
                    this.video = this.getSingerMVById(this.id).list;
                } catch (e) {
                    this.error = e.message;
                } finally {
                    if (reload) {
                        this.singerLoad = false;
                    } else {

                    }
                }
            },
            getDataInfo({ publishTime, size }) {
                const sizeStr = size > 0 ? ` 歌曲${ size }` : '';
                return `${ publishTime.replace(/-/g, '.') }${ sizeStr }`;
            }
        }
    };
</script>

<style lang="scss" scoped>
    .list_item {
        padding: 10px 10px 10px 18px;

        .list_item-left {
            position: relative;
            min-width: 130px;
            width: 130px;
            height: 70px;
            border-radius: 5px;
            background: center center no-repeat;
            background-size: cover;


        }

        .list_item-right {
            margin-left: 10px;

            .list_item-right-info {
                margin-top: 8px;
            }
        }
    }
</style>
