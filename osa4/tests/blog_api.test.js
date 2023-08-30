const mongoose = require('mongoose')
const supertest = require('supertest')
require('express-async-errors')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

describe('when notes are initially saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    console.log('database cleared before testing')
    
    await Blog.insertMany(helper.initialBlogs)
    console.log('database initialised for testing')
  })

  //4.8
  test('right amount of blogs are returned in JSON format', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

  //4.9
  test('blog identifier must be called id', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)

    response.body.map(res => 
    expect(res.id).toBeDefined())
  })

  describe('adding a blog', () => {
    //4.10
    test('succeeds with valid blog', async () => {
      const newBlog = {
        title: 'this blog should be added to the database',
        author: 'tester',
        url: 'fakeurl.com',
        likes: 3
      }
  
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        
      const response = await api.get('/api/blogs')
      const titles = response.body.map(res => res.title)
  
      expect(titles).toContain('this blog should be added to the database')
      expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    })
  
    //4.11
    test('value of likes is 0 by default', async () => {
      const noLikesBlog = {
        title: 'likes should be zero',
        author: 'nolikes',
        url: 'nolikes.com'
      }
  
      await api
        .post('/api/blogs')
        .send(noLikesBlog)
        .expect(201)
  
      const response = await api.get('/api/blogs')
      const testedBlog = response.body.find(blog => {
        return blog.title === 'likes should be zero'
      })
      console.log(testedBlog)
  
      expect(testedBlog.likes).toBe(0)
    })
  })

  describe('deletion of a specified blog', () => {
    //4.13
    test('succeeds with valid id', async () => {
      const response = await api.get('/api/blogs')
      const blogToBeDeleted = response.body[0]
      console.log('deleteable: ',blogToBeDeleted)
  
      await api
        .delete(`/api/blogs/${blogToBeDeleted.id}`)
        .expect(204)
      
      //check if blog really was deleted
      const res = await api.get('/api/blogs')
      const titles = res.body.map(r => r.title)
  
      expect(res.body).toHaveLength(helper.initialBlogs.length - 1)
      expect(titles).not.toContain(blogToBeDeleted.title)
    })
  })
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('verisekret', 10)
    const user = new User({ username: 'root', passwordHash})

    await user.save()
  })

  test('user creation succeeds with fresh username', async () => {
    const startingUsers = await helper.usersInDb()
    console.log('starting ', startingUsers)

    const newUser = {
      username: 'tester',
      name: 'Test',
      password: 'secret'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const endingUsers = await helper.usersInDb()
    console.log('ending ', endingUsers)
    expect(endingUsers).toHaveLength(startingUsers.length + 1)

    const usernames = endingUsers.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  }) 

  test('user creation fails if username is taken', async () => {
    const startingUsers = await helper.usersInDb()
    console.log(startingUsers)

    const newUser = {
      username: 'root',
      name: 'Failtester',
      password: 'secret'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const endingUsers = await helper.usersInDb()
    expect(endingUsers).toHaveLength(startingUsers.length)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})