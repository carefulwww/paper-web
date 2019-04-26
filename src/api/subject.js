import request from '@/utils/request'

export function addSubject(data) {
  return request({
    url: `/paperWebAPI/subject/addSubject`,
    method: 'post',
    data
  })
}

export function delSubject(data) {
  return request({
    url: `/paperWebAPI/subject/delSubject?id=${data.uuid}`,
    method: 'delete',
    data
  })
}

export function getSubject(data) {
  return request({
    url: `/paperWebAPI/subject/getSubject`,
    method: 'get',
    params: data
  })
}

export function updateSubject(data) {
  return request({
    url: `/paperWebAPI/subject/updateSubject`,
    method: 'put',
    data
  })
}

const SubjectAPI = {
  addSubject,
  delSubject,
  getSubject,
  updateSubject
}

export default SubjectAPI
