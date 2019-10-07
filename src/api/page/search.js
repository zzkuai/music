import { get } from '@/api/request';
import { searchHotUrl, searchSuggestUrl, searchUrl } from '@/api/url';

/**
 * 热搜
 * @returns {Promise<*|undefined>}
 */
export const getHotSearch = () => get(searchHotUrl);

/**
 * 搜索
 * @param keywords 关键词
 * @param type 搜索类型 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频
 * @param offset 分页
 * @param limit 数据长度
 * @returns {Promise<*|undefined>}
 */
export const getSearch = (keywords, type, offset = 0, limit = 20) => get(searchUrl, { keywords, type, offset, limit });

/**
 * 搜索建议
 * @param keywords 关键词
 * @returns {Promise<*|undefined>}
 */
export const getSearchSuggest = (keywords) => get(searchSuggestUrl, { keywords, type: 'mobile' });
