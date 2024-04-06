import request from '@/api/request';

export function addReserve(value) {
  return request.post('/user/reserve', value);
}
