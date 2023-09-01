const BlogForm = ({ createBlog, newBlog, handleInputChange }) => (
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

export default BlogForm

