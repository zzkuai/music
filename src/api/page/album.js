import { get } from '@/api/request';
import { albumUrl, albumListUrl, albumCommentUrl } from '@/api/url';

// 新碟上架列表
export const getAlbumList = ({ offset }) =>
  get(albumListUrl, { offset, limit: 20 });

// 专辑详情
export const getAlbum = (id) => get(albumUrl, { id });

// 专辑评论
export const getAlbumComment = (id) => get(albumCommentUrl, { id });
