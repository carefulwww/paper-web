import request from '@/utils/request'

export function addRelation(data) {
  return request({
    url: `/paperWebAPI/paperQuestionRelation/addRelation`,
    method: 'post',
    data
  })
}

export function delRelation(data) {
  return request({
    url: `/paperWebAPI/paperQuestionRelation/delRelation?id=${data.uuid}`,
    method: 'delete',
    data
  })
}

export function getRelation(data) {
  return request({
    url: `/paperWebAPI/paperQuestionRelation/getRelation`,
    method: 'get',
    params: data
  })
}

export function updateRelation(data) {
  return request({
    url: `/paperWebAPI/paperQuestionRelation/updateRelation`,
    method: 'put',
    data
  })
}

const PaperQuestionAPI = {
  addRelation,
  delRelation,
  getRelation,
  updateRelation
}

export default PaperQuestionAPI
