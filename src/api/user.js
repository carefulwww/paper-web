import request from '@/utils/request'

export function addUser(data) {
  return request({
    url: `/paperWebAPI/user/addUser`,
    method: 'post',
    data
  })
}

export function deleteUser(data) {
  return request({
    url: `/paperWebAPI/user/delete?userId=${data.userId}`,
    method: 'delete',
    data
  })
}

export function getUser(data) {
  return request({
    url: `/paperWebAPI/user/getUser`,
    method: 'get',
    params: data
  })
}

export function login(data) {
  return request({
    url: `/paperWebAPI/user/login?userName=${data.userName}&password=${data.password}`,
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: `/paperWebAPI/user/update`,
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
