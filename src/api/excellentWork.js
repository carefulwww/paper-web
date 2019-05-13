import request from '@/utils/request'

export function addExcellentWork(data) {
  return request({
    url: `/paperWebAPI/excellentWork/addWork`,
    method: 'post',
    data
  })
}

export function delExcellentWork(data) {
  return request({
    url: `/paperWebAPI/excellentWork/delWork?id=${data.id}`,
    method: 'delete',
    data
  })
}

export function getExcellentWork(data) {
  return request({
    url: `/paperWebAPI/excellentWork/getWork`,
    method: 'get',
    params: data
  })
}

export function updateExcellentWork(data) {
  return request({
    url: `/paperWebAPI/excellentWork/updateWork`,
    method: 'put',
    data
  })
}

const ExcellentWorkAPI = {
  addExcellentWork,
  delExcellentWork,
  getExcellentWork,
  updateExcellentWork
}

export default ExcellentWorkAPI
