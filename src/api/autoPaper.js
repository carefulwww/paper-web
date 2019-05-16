import request from '@/utils/request'

export function autoPaper(data) {
  return request({
    url: `/paperWebAPI/autoPaper/addChapter?createId=${data.createUserId}`,
    method: 'post',
    data
  })
}

const AutoPaperAPI = {
  autoPaper
}

export default AutoPaperAPI
