import { useState } from "react"

const Blog = ({ blog }) => {
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

  const infoView = () => (
    <div style={blogStyle}>
      <div>
          {blog.title} by {blog.author} <button type="button" onClick={toggleView}>hide</button>
          <br></br>
          {blog.url}
          <br></br>
          likes {blog.likes} <button type="button">like</button>
          <br></br>
          by {blog.user.username}
      </div>
    </div>
  )
  return (
  <div>
    {!view && simpleView()}
    {view && infoView()}
  </div>
  )
}

export default Blog