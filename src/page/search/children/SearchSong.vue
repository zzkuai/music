<template>
    <ul class="search-song p-p15">
        <li class="search-song-list-item f-df f-fdc"
            :class="{'m-mt15':index>0}"
            v-for="(song,index) in list"
            :key="index"
            @click="goPlayPage(song)"
        >
            <base-font class="line-one" :text="song.name"/>
            <base-font class="line-one search-song-list-item-info" :text="song | infoFormat" color="text" size="10"/>
        </li>
    </ul>
</template>

<script>
    import componentMixin from './searchComponentsMixin';
    import { playMixin } from '@/util/mixin';

    export default {
        name: 'SearchSong',
        mixins: [ playMixin, componentMixin ],
        computed: {},
        filters: {
            infoFormat({ album = {}, artists = [] }) {
                const artistName = artists.map(({ name }) => name).join('/');
                return `${artistName} - ${album.name}`;
            }
        },
        methods: {
            async goPlayPage(song) {
                const { alias: alia, artists: artist, ...other } = song;
                this.playNext({ alia, artist, ...other }, true, () => {
                    this.$router.push({ path: '/play/detail', query: { id: song.id } });
                }, true);
            }
        }
    };
</script>

<style lang="scss" scoped>
    .search-song {
        .search-song-list-item {
            height: 40px;
        }

        .search-song-list-item-info {
            margin-top: 4px;
        }
    }
</style>
