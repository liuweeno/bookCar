import request from '@/api/request';

export function register(value) {
  return request.post('/user/register', value);
}
