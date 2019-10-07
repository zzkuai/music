import { mapState, mapActions, createNamespacedHelpers } from 'vuex';

// state
export const stateMixin = {
    data() {
        return {
            state: 'load',
            empty: '',
            error: ''
        };
    },
    mounted() {
        this.getData();
    }
};

// home
export const homeMixin = {
    computed: {
        ...mapState([ 'theme', 'loadVisible', 'menuVisible', 'playerVisible', 'playlistVisible' ])
    },
    methods: {
        showPlayList() {
            this.setPlayListVisible(true);
        },
        ...mapActions([ 'setTheme', 'setLoadVisible', 'setMenuVisible', 'setPlayerVisible', 'setPlayListVisible' ])
    }
};
// search 搜索页
const { mapState: searchState, mapGetters: searchGetters, mapActions: searchActions } = createNamespacedHelpers('search');
export const searchMixin = {
    computed: {
        ...searchState([ 'hot', 'history', 'keyword', 'type', 'cache', 'load' ]),
        ...searchGetters([ 'getSearchResult' ])
    },
    methods: {
        ...searchActions([ 'setHotSearch', 'initSearchHistory', 'setSearchHistory', 'setSearchKeyword',
            'setSearchType', 'setSearch', 'resetSearch', 'setSearchLoad', 'removeSearchHistory' ]),
    }
};

// singer 歌手页
const { mapState: singerState, mapActions: singerActions, mapGetters: singerGetters } = createNamespacedHelpers('singer');
export const singerMixin = {
    data() {
        return {
            id: this.$route.query.id,
            singerLoad: true,
        };
    },
    created() {
        this.getData?.();
    },
    computed: {
        ...singerState([ 'artist', 'load' ]),
        ...singerGetters([ 'getSingerDetailById', 'getSingerSongById', 'getSingerAlbumById', 'getSingerMVById', 'getSingerAvatarById' ])
    },
    filters: {
        aliaFormat(alia = []) {
            return alia?.length > 0 ? ` (${ alia?.[ 0 ] })` : '';
        },
        infoFormat({ album = {}, artist = [] }) {
            const artistName = artist.map(({ name }) => name).join('/');
            return `${ artistName } - ${ album.name }`;
        }
    },
    methods: {
        ...singerActions({
            setDetail: 'setSingerDetail',
            setSong: 'setSingerSong',
            setAlbum: 'setSingerAlbum',
            setMV: 'setSingerMV',
            setAvatar: 'setSingerAvatar',
            setProfile: 'setSingerProfile',
        })
    }
};

// player 播放器 播放页面
const { mapState: playerState, mapActions: playerActions, mapGetters: playerGetters } = createNamespacedHelpers('player');
import { playType } from '@/config/param';

export const playerMixin = {
    computed: {
        playTypeText() {
            return playType[ this.playType ].text;
        },
        playTypeIcon() {
            return playType[ this.playType ].icon;
        },
        playTypeIconSizeBig() {
            return playType[ this.playType ].sizeBig;
        },
        playTypeIconSizeSmall() {
            return playType[ this.playType ].sizeSmall;
        },
        ...playerState([
            'playEl', 'playInfo', 'playList', 'playType', 'playHandle',
            'playStatus', 'playCurrentTime', 'playDuration'
        ]),
        ...playerGetters([ 'playId', 'playListCount' ])
    },
    methods: {
        goToPlayPage() {
            this.$router.push({ path: '/play/detail', query: { id: this.playId } });
        },
        curSongActive(itemId) {
            return this.playId === itemId;
        },
        changePlayType(visible) {
            const type = (this.playType + 1) % 3;
            this.setPlayType(type);
            if (visible) this.$toast(this.playTypeText);
        },
        changePlayStatus() {
            if (this.playStatus) {
                this.playEl.pause();
            } else {
                this.playEl.play();
            }
            this.setPlayStatus(!this.playStatus);
        },
        ...playerActions([
            'setPlayEl', 'setPlayInfo', 'setPlayList', 'changePlaySong', 'setNextPlaySong', 'setPlayDuration',
            'setPlayLyric', 'setPlayType', 'setPlayHandle', 'setPlayStatus', 'setPlayCurrentTime', 'resetPlay',
        ])
    }
};

// 播放歌曲
export const playMixin = {
    computed: {
        ...playerState([ 'playCache' ]),
        ...playerGetters([ 'playId', 'playListCount' ])
    },
    methods: {
        ...mapActions([ 'setLoadVisible', 'setPlayerVisible' ]),
        ...playerActions([ 'setPlayInfo', 'setPlayList', 'setNextPlaySong' ]),
        curSongActive(itemId) {
            return this.playId === itemId;
        },
        async playNext(song, play, cb, load) {
            try {
                if (load || this.playListCount === 0) await this.setLoadVisible(true);
                await this.setNextPlaySong({ song, play });
                await this.setPlayerVisible(true);
                cb?.();
            } catch (e) {
                this.$toast('获取音乐失败！', { position: 'center', duration: 1000 });
            } finally {
                await this.setLoadVisible(false);
            }
        },
        async playSong(song, list, replay = false) {
            try {
                if (song.id === this.playId && !replay) return this.$router.push({ path: '/play/detail', query: { id: this.playId } });
                if (!this.playId) await this.setLoadVisible(true);
                await this.setPlayInfo(song);
                await this.setPlayList(list.map(({ id, name, artist, album, alia }) => ({ id, name, artist, album, alia })));
                await this.setPlayerVisible(true);
            } catch (e) {
                this.$toast('获取歌曲失败！', { position: 'center', duration: 1000 });
            } finally {
                await this.setLoadVisible(false);
            }
        }
    }
};

// 重新刷新页面
export const pageReloadMixin = {
    activated() {
        if (this.id !== this.$route.query.id) {
            this.id = this.$route.query.id;
            this.state = 'load';
            this.getData();
        }
    },
};

// playlist 歌单页
const { mapState: playlistState, mapGetters: playlistGetters, mapActions: playlistActions, } = createNamespacedHelpers('playlist');
export const playlistMixin = {
    computed: {
        ...playlistState([ 'load', 'high', 'category', 'userCategory' ]),
        ...playlistGetters([ 'getPlayListOfList', 'getPlayListOfHigh' ])
    },
    methods: {
        ...playlistActions({
            getList: 'setPlayList',
            getHigh: 'setPlayListHigh',
            getCat: 'setPlayListCategory',
            setUser: 'setPlayListUserCategory'
        }),
    }
};
