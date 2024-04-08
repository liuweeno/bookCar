import request from './request';

export function register(value) {
  return request.post('/user/register', value);
}

export function login(value) {
  return request.post('/user/login', value);
}

export function getNotice() {
  return request.post('user/announcement');
}
