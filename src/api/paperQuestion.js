import request from '@/utils/request'

export function addRelation(data) {
  return request({
    url: `/paperQuestionRelation/bu?questionIds=${data.questionIds}&paperId=${data.paperId}&userId=${data.userId}`,
    method: 'post',
    data
  })
}

export function delRelation(data) {
  return request({
    url: `/paperQuestionRelation/delRelation?id=${data.uuid}`,
    method: 'delete',
    data
  })
}

export function getRelation(data) {
  return request({
    url: `/paperQuestionRelation/getRelation`,
    method: 'get',
    params: data
  })
}

export function updateRelation(data) {
  return request({
    url: `/paperQuestionRelation/updateRelation`,
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
