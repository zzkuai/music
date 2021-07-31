import axios from 'axios';
import { apiUrl } from '@/api/env';

const instance = axios.create({
  baseURL: apiUrl,
  timeout: 20000,
  transformRequest(data) {
    let dataStr = '';
    for (let val in data) {
      dataStr += `${val}=${data[val]}&`;
    }
    dataStr = dataStr.substring(0, dataStr.length - 1);
    return dataStr;
  },
  transformResponse(data) {
    return JSON.parse(data);
  },
});

const request = (url, params, method) => {
  const IS_POST = method === 'post';
  const contentType = IS_POST ? 'x-www-form-urlencoded' : 'json';
  const options = IS_POST ? { data: params } : { params };
  return instance({
    url,
    method,
    header: {
      'Content-Type': `application/${contentType}`,
    },
    ...options,
  })
    .then((res) => {
      const { code, ...other } = res.data;
      if (code === 200) {
        return other;
      } else {
        return res;
      }
    })
    .catch((e) => {
      throw e;
    });
};

const get = async (url, param) => {
  return await request(url, param, 'get');
};

const post = async (url, param) => {
  return await request(url, param, 'post');
};

export { get, post };
