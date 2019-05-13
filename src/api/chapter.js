import request from '@/utils/request'

export function addChapter(data) {
  return request({
    url: `/paperWebAPI/chapter/addChapter`,
    method: 'post',
    data
  })
}

export function delChapter(data) {
  return request({
    url: `/paperWebAPI/chapter/delChapter?id=${data.uuid}`,
    method: 'delete',
    data
  })
}

export function getChapter(data) {
  return request({
    url: `/paperWebAPI/chapter/getChapter`,
    method: 'get',
    params: data
  })
}

export function updateChapter(data) {
  return request({
    url: `/paperWebAPI/chapter/updateChapter`,
    method: 'put',
    data
  })
}

const ChapterAPI = {
  addChapter,
  delChapter,
  getChapter,
  updateChapter
}

export default ChapterAPI
