import request from '@/utils/request'

export function addUser(data) {
  return request({
    url: `/user/addUser`,
    method: 'post',
    data
  })
}

export function deleteUser(data) {
  return request({
    url: `/user/delete?userId=${data.uuid}`,
    method: 'delete'
  })
}

export function getUser(data) {
  return request({
    url: `/user/getUser`,
    method: 'get',
    params: data
  })
}

export function login(data) {
  return request({
    url: `/user/login?userName=${data.userName}&password=${data.password}`,
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: `/user/update?currentId=${data.currentId}`,
    method: 'put',
    data
  })
}

const UserAPI = {
  addUser,
  deleteUser,
  getUser,
  login,
  updateUser
}

export default UserAPI
