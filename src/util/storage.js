const storage = window.localStorage;

const PARAM_ERROR_STR = '参数不能为空!';
const STORAGE_MIX_KEY = 'zzkuai_';

export const set = async (key, value) => {
  if (!key || !value) throw PARAM_ERROR_STR;
  await storage.setItem(`${STORAGE_MIX_KEY}${key}`, JSON.stringify(value));
};

export const get = async (key) => {
  if (!key) throw PARAM_ERROR_STR;
  return await JSON.parse(storage.getItem(`${STORAGE_MIX_KEY}${key}`));
};

export const has = async (key) => {
  if (!key) throw PARAM_ERROR_STR;
  const result = await JSON.parse(storage.getItem(key));
  return !!result;
};

export const remove = async (key) => {
  if (!key) throw PARAM_ERROR_STR;
  await storage.removeItem(`${STORAGE_MIX_KEY}${key}`);
};
