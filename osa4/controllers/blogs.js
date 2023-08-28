const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  console.log('title of added blog: ', body.title)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })

  console.log('blog to be added: ', blog)
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response, next) => {
  console.log(`Deleting a blog with id ${request.params.id}`)

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

//blogsRouter.put('/:id', async (request, response, next))
module.exports = blogsRouter;
