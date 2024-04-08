import request from './request';

export function getStudentOrder() {
  return request.post('/coach/query');
}

export function confirmApprove(value) {
  return request.post('/coach/approve', value);
}
