import { useState } from "react"

const Blog = ({ blog, updateLikes, deleteBlog, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const [view, setView] = useState(false)

  const toggleView = () => {
    setView(!view)
  }

  const simpleView = () => (
    <div style={blogStyle}>
      <div>
        {blog.title} by {blog.author} <button type="button" onClick={toggleView}>view</button>
      </div>
    </div>  
  )

  const like = () => {
    console.log('like pressed')
    updateLikes(blog.id)
  }

  const handleDelete = () => {
    console.log('delete pressed')
    deleteBlog(blog.id)
  }

  const verifyUserForDeletion = () => {
    if (blog.user.username === user.username) {
      return true
    }
    return false
  }

  const infoView = () => {
    if (verifyUserForDeletion()) {
      return (
        <div style={blogStyle}>
          <div>
              {blog.title} by {blog.author} <button type="button" onClick={toggleView}>hide</button>
              <br></br>
              {blog.url}
              <br></br>
              likes {blog.likes} <button type="button" onClick={like}>like</button>
              <br></br>
              added by {blog.user.username}
              <br></br>
              <button type="button" onClick={handleDelete}>delete</button>
          </div>
        </div>
      )
    } else {
      return (
        <div style={blogStyle}>
          <div>
              {blog.title} by {blog.author} <button type="button" onClick={toggleView}>hide</button>
              <br></br>
              {blog.url}
              <br></br>
              likes {blog.likes} <button type="button" onClick={like}>like</button>
              <br></br>
              added by {blog.user.username}
          </div>
        </div>
      )
    }
  }

  return (
  <div>
    {!view && simpleView()}
    {view && infoView()}
  </div>
  )
}

export default Blog