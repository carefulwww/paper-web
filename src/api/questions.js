import request from '@/utils/request'

export function addQuestion(data) {
  return request({
    url: `/paperWebAPI/question/addQuestion`,
    method: 'post',
    data
  })
}

export function delQuestion(data) {
  return request({
    url: `/paperWebAPI/question/delQuestion?ids=${data.ids}`,
    method: 'delete',
    data
  })
}

export function getQuestion(data) {
  return request({
    url: `/paperWebAPI/question/getQuestion`,
    method: 'get',
    params: data
  })
}

export function updateQuestion(data) {
  return request({
    url: `/paperWebAPI/question/updateQuestion`,
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
