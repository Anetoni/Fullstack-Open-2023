import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {

  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [notifType, setNotifType] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(blogs)
    }
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })
      console.log(`logging in as ${username}, password ${password}`)
      window.localStorage.setItem(
        'loggedInUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)

      setNotifType('success')
      setNotification(`Successfully logged in as ${user.username}`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)

      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotifType('error')
      setNotification('Wrong username or password')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(returnedBlog))

    setNotifType('success')
    setNotification(`a new blog titled ${returnedBlog.title} by ${returnedBlog.author} added`)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const updateLikes = async (id) => {
    const blog = blogs.find(blog => blog.id === id)
    console.log('liked ', blog)
    const updatedBlog = { ...blog, likes: blog.likes+1 }
    const returnedBlog = await blogService.update(id, updatedBlog)
    setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog).sort((a, b) => b.likes - a.likes))
  }

  const logout = () => {
    window.localStorage.removeItem("loggedInUser")
    setUser(null)
    console.log('logged out')
  }

  if (user === null) {
    return (
      <div>
        <Notification message={notification} type={notifType}/>
        <h2>log in to application</h2>
        <LoginForm username={username}
          password={password}
          setUsername={setUsername}
          handleLogin={handleLogin} 
          setPassword={setPassword}
        ></LoginForm>
      </div>
    )
  } else if (user) {
    return (
      <div>
        <Notification message={notification} type={notifType}/>
        <p>
          {user.name} logged in <button type='click' onClick={logout}>logout</button>
        </p>
        <Togglable label="new blog" ref={blogFormRef}>
          <h2>create a new blog</h2>
          <BlogForm addBlog={addBlog}></BlogForm>
        </Togglable>
        <h2>blogs</h2>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} updateLikes={updateLikes} />
        )}
      </div>
    )
  }
}

export default App