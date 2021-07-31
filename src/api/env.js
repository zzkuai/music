export const IS_DEV = process.env.NODE_ENV === 'development';
export const IS_PRO = process.env.NODE_ENV === 'production';

const LOCAL_API_URL = '/music-api/';
const ONLINE_API_URL = 'https://www.zzkuai.top/api/';
export const apiUrl = IS_DEV ? LOCAL_API_URL : ONLINE_API_URL;
