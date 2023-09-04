import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const initialBlogValues = {
    title: '',
    author: '',
    url: ''
  }

  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [notifType, setNotifType] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newBlog, setNewBlog] = useState(initialBlogValues)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
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

  const logout = () => {
    window.localStorage.removeItem("loggedInUser")
    setUser(null)
    console.log('logged out')
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setNewBlog({
      ...newBlog,
      [name]: value
    })
    console.log(newBlog)
  }

  const createBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url
    }

    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(returnedBlog))

    setNotifType('success')
    setNotification(`a new blog titled ${returnedBlog.title} by ${returnedBlog.author} added`)
    setTimeout(() => {
      setNotification(null)
    }, 5000)

    setNewBlog('')
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
        <Togglable label="new blog">
          <h2>create a new blog</h2>
          <BlogForm createBlog={createBlog}
            newBlog={newBlog}
            setNewBlog={setNewBlog}
            handleInputChange={handleInputChange}
          ></BlogForm>
        </Togglable>
        <h2>blogs</h2>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    )
  }
}

export default App