import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> blog creation calls addBlog successfully', async () => {
  const user = userEvent.setup()
  const addBlog = jest.fn()

  render(<BlogForm addBlog={addBlog} />)

  const inputs = screen.getAllByRole('textbox')
  const createButton = screen.getByText('create')

  await user.type(inputs[0], 'blog creation attempt')
  await user.type(inputs[1], 'testAuthor')

  await user.click(createButton)

  expect(addBlog.mock.calls).toHaveLength(1)
  expect(addBlog.mock.calls[0][0].title).toBe('blog creation attempt')
  expect(addBlog.mock.calls[0][0].author).toBe('testAuthor')
})