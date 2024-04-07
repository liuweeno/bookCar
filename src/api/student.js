import request from '@/api/request';

export function addReserve(value) {
  return request.post('/user/reserve', value);
}

export function getReserveList() {
  return request.post('/user/query');
}

export function removeReserve(value) {
  return request.post('/user/remove', value);
}

export function bindCoach(value) {
  return request.post('/user/bind_coach', value);
}
