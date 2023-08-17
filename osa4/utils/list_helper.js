const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  let sumOfLikes = blogs.reduce((sum, blog) => sum + blog.likes, 0)
  return sumOfLikes
}

module.exports = {
  dummy,
  totalLikes
}