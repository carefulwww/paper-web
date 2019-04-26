import request from '@/utils/request'

export function addRelation(data) {
  return request({
    url: `/paperWebAPI/teacherSubjectRelation/addRelation`,
    method: 'post',
    data
  })
}

export function delRelation(data) {
  return request({
    url: `/paperWebAPI/teacherSubjectRelation/delRelation?id=${data.uuid}`,
    method: 'delete',
    data
  })
}

export function getRelation(data) {
  return request({
    url: `/paperWebAPI/teacherSubjectRelation/getRelation`,
    method: 'get',
    params: data
  })
}

export function updateRelation(data) {
  return request({
    url: `/paperWebAPI/teacherSubjectRelation/updateRelation`,
    method: 'put',
    data
  })
}

const SubjectTeacherAPI = {
  addRelation,
  delRelation,
  getRelation,
  updateRelation
}

export default SubjectTeacherAPI
