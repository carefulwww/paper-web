import request from '@/utils/request'

export function addQuestion(data) {
  return request({
    url: `/question/addQuestion`,
    method: 'post',
    data
  })
}

export function delQuestion(data) {
  return request({
    url: `/question/delQuestion?ids=${data.uuid}`,
    method: 'delete',
    data
  })
}

export function getQuestion(data) {
  return request({
    url: `/question/getQuestion`,
    method: 'get',
    params: data
  })
}

export function updateQuestion(data) {
  return request({
    url: `/question/updateQuestion`,
    method: 'put',
    data
  })
}

const QuestionAPI = {
  addQuestion,
  delQuestion,
  getQuestion,
  updateQuestion
}

export default QuestionAPI
