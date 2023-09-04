import { useState } from "react"

const BlogForm = ({ addBlog }) => {
  const initialBlogValues = {
    title: '',
    author: '',
    url: ''
  }

  const [newBlog, setNewBlog] = useState(initialBlogValues)

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setNewBlog({
      ...newBlog,
      [name]: value
    })
    console.log(newBlog)
  }

  const createBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url
    }
    addBlog(blogObject)
    setNewBlog('')
  }

  return (
    <form onSubmit={createBlog}>
      <div>
        title:
        <input type='text' value={newBlog.title} onChange={handleInputChange} name="title"/>
      </div>
      <div>
      author:
        <input type='text' value={newBlog.author} onChange={handleInputChange} name="author"/>
      </div>
      <div>
        url:
        <input type='text' value={newBlog.url} onChange={handleInputChange} name="url"/>
      </div>
      <button type="submit">create</button>
    </form>
  )
}
export default BlogForm

