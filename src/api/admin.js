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

export function getAllUser(value) {
  return request.post('/admin/query_user', value);
}

export function addNewUser(data) {
  return request.post('/admin/add_user', data);
}

export function editUserInfo(data) {
  return request.post('/admin/modify_user', data);
}

export function addNotice(value) {
  return request.post('/admin/add_announcement', value);
}

export function editNotice(value) {
  return request.post('/admin/modify_announcement', value);
}

export function deleteUser(value) {
  return request.post('/admin/delete_user', value);
}

export function deleteNotice(value) {
  return request.post('/admin/delete_announcement', value);
}

export function deleteCar(value) {
  return request.post('/admin/remove_vehicle', value);
}

export function getAllOrder(value) {
  return request.post('/admin/query_reserve', value);
}
