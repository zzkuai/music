import { get } from '@/api/request';
import {
  discoverAlbumUrl,
  discoverBannerUrl,
  discoverSongUrl,
  discoverPlaylistUrl,
} from '@/api/url';

// 轮播
export const getBanner = () => get(discoverBannerUrl);

// 推荐歌单
export const getPlaylist = (limit) => get(discoverPlaylistUrl, { limit });

// 最新专辑
export const getAlbum = () => get(discoverAlbumUrl);

// 推荐音乐
export const getSong = () => get(discoverSongUrl);
