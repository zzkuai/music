import { get } from '@/api/request';
import {
  artistUrl,
  artistAvatarUrl,
  artistTopUrl,
  artistListUrl,
  artistSongUrl,
  artistAlbumUrl,
  artistMVUrl,
  artistDescUrl,
  artistSimiUrl,
} from '@/api/url';

/**
 * 歌手信息
 * @param id 歌手id
 * @returns {Promise<*|undefined>}
 */
export const getArtist = (id) => get(artistUrl, { id });

/**
 * 歌手头像
 * @param id 歌手id
 * @returns {Promise<*|undefined>}
 */
export const getArtistAvatar = (id) => get(artistAvatarUrl, { id });

/**
 * 热门歌手
 * @param offset 分页
 * @param limit 数量
 * @returns {Promise<*|undefined>}
 */
export const getTopArtist = ({ offset = 0, limit = 20 }) =>
  get(artistTopUrl, { offset, limit });

/**
 * 歌手列表
 * @param offset 分页
 * @param cat 歌手类别
 * @param limit 数量
 * @returns {Promise<*|undefined>}
 */
export const getArtistList = ({ offset = 0, cat, limit = 20 }) =>
  get(artistListUrl, { offset, cat, limit });

/**
 * 歌手热门单曲
 * @param id 歌手id
 * @returns {Promise<*|undefined>}
 */
export const getArtistSong = (id) => get(artistSongUrl, { id });

/**
 * 歌手专辑
 * @param id 歌手id
 * @param limit 数量
 * @param offset 分页
 * @returns {Promise<*|undefined>}
 */
export const getArtistAlbum = (id, { offset = 0, limit = 20 }) =>
  get(artistAlbumUrl, { id, offset, limit });

/**
 * 歌手mv
 * @param id 歌手id
 * @param limit 数量
 * @param offset 分页
 * @returns {Promise<*|undefined>}
 */
export const getArtistMV = (id, { offset, limit = 20 }) =>
  get(artistMVUrl, { id, offset, limit });

/**
 * 歌手描述
 * @param id 歌手id
 * @returns {Promise<*|undefined>}
 */
export const getArtistDesc = (id) => get(artistDescUrl, { id });

/**
 * 获取相似歌手
 * @param id 歌手id
 * @returns {Promise<*|undefined>}
 */
export const getSimiSinger = (id) => get(artistSimiUrl, { id });
