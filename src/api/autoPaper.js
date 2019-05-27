import request from '@/utils/request'

export function autoPaper(data) {
  return request({
    url: `/autoPaper/addChapter?createId=${data.createUserId}`,
    method: 'post',
    data
  })
}

const AutoPaperAPI = {
  autoPaper
}

export default AutoPaperAPI
