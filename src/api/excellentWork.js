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
    url: `/paperWebAPI/excellentWork/delWork?id=${data.uuid}`,
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

export function runCode(data) {
  return request({
    url: `/paperWebAPI/excellentWork/runCode?currentId=${data.currentId}&id=${data.id}`,
    method: 'post',
    data
  })
}

const ExcellentWorkAPI = {
  addExcellentWork,
  delExcellentWork,
  getExcellentWork,
  updateExcellentWork,
  runCode
}

export default ExcellentWorkAPI
