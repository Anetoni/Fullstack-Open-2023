import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newBlog => {
  const config = {
    headers: { Authorization: token },
  }
  console.log('attempting to create blog')
  const response = await axios.post(baseUrl, newBlog, config)
  console.log('create ',response.data)
  return response.data
}

const update = async (id, updatedBlog) => {
  console.log('attempting to update blog')
  const response = await axios.put(`${baseUrl}/${id}`, updatedBlog)
  console.log('update ', response.data)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }

  console.log('attempting to delete blog')
  await axios.delete(`${baseUrl}/${id}`, config)
  console.log('deleted successfully')
}

export default { getAll, create, setToken, update, remove }