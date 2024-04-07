import request from '@/api/request';

export function getAllCar() {
  return request.post('/admin/list_vehicle');
}

export function addNewCar(data) {
  return request.post('/admin/upload_vehicle', data);
}

export function editCarInfo(data) {
  return request.post('/admin/modify_vehicle', data);
}
