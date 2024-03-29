import { useState } from 'react'

const BlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [author, setAuthor] = useState('')


  const createBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: title,
      author: author,
      url: url
    }
    addBlog(blogObject)
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={createBlog}>
      <div>
        title:
        <input id='title' type='text' value={title} onChange={event => setTitle(event.target.value)}/>
      </div>
      <div>
      author:
        <input id='author' type='text' value={author} onChange={event => setAuthor(event.target.value)}/>
      </div>
      <div>
        url:
        <input id='url' type='text' value={url} onChange={event => setUrl(event.target.value)}/>
      </div>
      <button id='submit-button' type="submit">create</button>
    </form>
  )
}
export default BlogForm

