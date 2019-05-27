import request from '@/utils/request'

export function addChapter(data) {
  return request({
    url: `/chapter/addChapter`,
    method: 'post',
    data
  })
}

export function delChapter(data) {
  return request({
    url: `/chapter/delChapter?id=${data.uuid}`,
    method: 'delete',
    data
  })
}

export function getChapter(data) {
  return request({
    url: `/chapter/getChapter`,
    method: 'get',
    params: data
  })
}

export function updateChapter(data) {
  return request({
    url: `/chapter/updateChapter`,
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
