const TEN_THOUSAND = 10 * 1000;
const HUNDRED_THOUSAND = 100 * 1000;
const HUNDRED_MILLION = 100 * 100 * 10000;
const MINUTE_TO_SECOND = 60;

const parseToTwoNumber = (number) => {
  return `${number}`.length > 1 ? `${number}` : `0${number}`;
};

export const numberFormat = (number) => {
  if (typeof number !== 'number') return 0;
  if (number < TEN_THOUSAND) {
    return number;
  } else if (number < HUNDRED_MILLION) {
    return `${Math.floor(number / TEN_THOUSAND)}万`;
  } else {
    return `${(number / HUNDRED_MILLION).toFixed(1)}亿`;
  }
};

export const readCountFormat = (number) => {
  if (typeof number !== 'number') return 0;
  if (number < HUNDRED_THOUSAND) {
    return number;
  } else {
    return `${Math.floor((number * 10) / TEN_THOUSAND) / 10}万`;
  }
};

export const playTimeFormat = (number) => {
  const minute = Math.floor(number / MINUTE_TO_SECOND);
  const second = Math.floor(number % MINUTE_TO_SECOND);
  return `${parseToTwoNumber(minute)}:${parseToTwoNumber(second)}`;
};

export const dateFormat = (date, type) => {
  const result = new Date(date);
  const year = result.getFullYear();
  const month = result.getMonth() + 1;
  const day = result.getDate();
  let hour = result.getHours();
  let minute = result.getMinutes();
  hour = hour < 10 ? `0${hour}` : hour;
  minute = minute < 10 ? `0${minute}` : minute;
  switch (type) {
    case 'hh:mm':
      return `${hour}:${minute}`;
    case 'mm月dd日':
      return `${month}月${day}日`;
    case 'yyyy.mm.dd':
    default:
      return `${year}.${month}.${day}`;
  }
};

// 评论时间格式化
export const commentTimeFormat = (date) => {
  const result = new Date(date);
  const current = new Date();
  const isYesterday = result.getDate() === current.getDate() - 1; // 昨天
  const isToday = result.getDate() === current.getDate(); // 今天
  if (isToday) {
    return dateFormat(date, 'hh:mm');
  } else if (isYesterday) {
    return `昨天${dateFormat(date, 'hh:mm')}`;
  } else {
    return dateFormat(date, 'mm月dd日');
  }
};
