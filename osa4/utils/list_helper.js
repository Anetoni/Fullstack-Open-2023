const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  let sumOfLikes = blogs.reduce((sum, blog) => sum + blog.likes, 0)
  return sumOfLikes
}

const favoriteBlog = (blogs) => {
  const reducer = ((mostLiked, blog) => {
    return mostLiked.likes > blog.likes
      ? mostLiked
      : { title: blog.title, author: blog.author, likes: blog.likes }
  })

  return blogs.length === 0
    ? {}
    : blogs.reduce(reducer, blogs[0])
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}