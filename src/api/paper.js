import request from '@/utils/request'

export function addPaper(data) {
  return request({
    url: `/paperWebAPI/paper/addPaper`,
    method: 'post',
    data
  })
}

export function delPaper(data) {
  return request({
    url: `/paperWebAPI/paper/delPaper?id=${data.uuid}`,
    method: 'delete',
    data
  })
}

export function getPaper(data) {
  return request({
    url: `/paperWebAPI/paper/getPaper`,
    method: 'get',
    params: data
  })
}

export function updatePaper(data) {
  return request({
    url: `/paperWebAPI/paper/updatePaper`,
    method: 'put',
    data
  })
}

const PaperAPI = {
  addPaper,
  delPaper,
  getPaper,
  updatePaper
}

export default PaperAPI
