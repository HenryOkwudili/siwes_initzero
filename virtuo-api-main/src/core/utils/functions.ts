import { BadRequestException } from '@nestjs/common';
import dayjs from 'dayjs';
import request from 'request';

export const generateRandomString = (length) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const convertNameToSlug = (name: string) => {
  return (
    name
      .toLowerCase()
      .replace(/ /g, '_')
      .replace(/[^\w-]+/g, '') +
    '-' +
    generateRandomString(10)
  );
};

export const sendRequest = async (method, url = '', data = {}, token) => {
  const options = {
    method,
    url,
    headers: {
      'content-type': 'application/json',
      authorization: `${token}`,
    },
    body: data,
    json: true,
  };

  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) return reject(error);

      return resolve(body);
    });
  });
};

export const transform = (obj, predicate) => {
  return Object.keys(obj).reduce((memo, key) => {
    if (predicate(obj[key], key)) {
      memo[key] = obj[key];
    }
    return memo;
  }, {});
};

export const omit = (obj, items) =>
  transform(obj, (value, key) => !items.includes(key));

export const pick = (obj, items) =>
  transform(obj, (value, key) => items.includes(key));

export const validateAccountId = (accountId, accounts) =>
  accountId && !accounts?.find((account) => account.id === accountId);

export const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const getNextExactTimeAndYear = () => {
  // Get the current date and time
  const now = new Date();

  // Calculate the next exact time by rounding up to the nearest minute
  const nextMinute = Math.ceil(now.getMinutes());
  const nextExactTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    nextMinute,
  );

  // Calculate the next exact year by adding one to the current year
  const nextExactYear = now.getFullYear() + 1;

  // Combine the next exact time and year into a single Date object
  return new Date(
    nextExactYear,
    nextExactTime.getMonth(),
    nextExactTime.getDate(),
    nextExactTime.getHours(),
    nextExactTime.getMinutes(),
  );
};

export const generateRandomDigits = (
  length: number,
  prefix: string = null,
): string => {
  const min = Math.pow(10, length - 1); // Minimum value for the specified length
  const max = Math.pow(10, length) - 1; // Maximum value for the specified length
  const unique_no = Math.floor(Math.random() * (max - min + 1)) + min;

  if (prefix !== null) return prefix + '-' + unique_no.toString();
  return unique_no.toString();
};

export const decodeURLParams = (urlParams) => {
  const decodedParams = {};

  for (const key in urlParams) {
    const value = urlParams[key];
    const decodedValue = decodeURIComponent(value);

    if (decodedValue) {
      decodedParams[key] = decodedValue.split(',');
    }
  }

  return decodedParams;
};

export const removeSpecialCharacters = (str: any) => {
  if (str === undefined || str === null) return ''; // Return empty string or handle as needed

  return str.toString().replace(/[^\w\s]/gi, ' '); // Remove special characters
};

export const formatDate = (date?: string | Date, format = 'MMMM D, YYYY') =>
  dayjs(date).format(format);

export const getExpiryDate = (
  date: string | Date,
  frequency = 1,
  duration = 'YEAR',
) => {
  const currentDate = dayjs(date);
  let expiryDate;
  switch (duration.toUpperCase()) {
    case 'DAY':
      expiryDate = currentDate.add(frequency, 'D');
      break;
    case 'WEEK':
      expiryDate = currentDate.add(frequency, 'w');
      break;
    case 'YEAR':
      expiryDate = currentDate.add(frequency, 'y');
      break;
    default:
      expiryDate = currentDate.add(frequency, 'M');
      break;
  }
  return expiryDate.subtract(1, 'day').toISOString();
};

export const addTrailingZeros = (num: number, digits = 2) => {
  if (!num) return 0;
  let numString = num.toString();
  while (numString.length < digits) {
    numString = '0' + numString;
  }
  return numString;
};

export const badRequestException = (msg: string, errorCode?: string) => {
  throw new BadRequestException({
    status: 400,
    message: msg,
    errorCode: errorCode,
  });
};
