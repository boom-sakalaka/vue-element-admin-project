import request from '../utils/request'
export function createBook(book) {
  return request({
    url: '/book/create',
    method: 'post',
    data: book
  })
}
