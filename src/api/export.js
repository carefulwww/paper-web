import request from '@/utils/request'

export function downloadPaper(data) {
  return request({
    url: `/export/downloadPaper?paperId=${data.paperId}`,
    method: 'get',
    params: data
  })
}
