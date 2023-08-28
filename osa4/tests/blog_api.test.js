const mongoose = require('mongoose')
const supertest = require('supertest')
require('express-async-errors')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('../utils/list_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  console.log('database cleared before testing')
  
  await Blog.insertMany(helper.initialBlogs)
  console.log('database initialised for testing')
})

describe('when notes are initially saved', () => {
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

afterAll(async () => {
  await mongoose.connection.close()
})