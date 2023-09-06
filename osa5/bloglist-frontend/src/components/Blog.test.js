import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  //5.13
  test('title and author are rendered correctly', () => {
    const blog = {
      title: 'This title should be rendered',
      author: 'anaho'
    }

    render(<Blog blog={blog} />)

    const element = screen.getByText('This title should be rendered by anaho')
    expect(element).toBeDefined()
  })

  //5.14
  test('url, likes and user are rendered correctly when viewed', async () => {
    const blog = {
      title: 'All information should be rendered',
      author: 'anaho',
      url: 'test.com',
      likes: 10,
      user: {
        username: 'anahoUser'
      }
    }

    const mockHandler = jest.fn()

    const { container } = render(<Blog blog={blog} toggleView={mockHandler} user={'anahoUser'} />)

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const div = container.querySelector('.blog')

    expect(div).toHaveTextContent(
      'test.com', 'likes 10', 'anahoUser'
    )
  })

  //5.15
  test('like is pressed twice', async () => {
    const blog = {
      title: 'This blog should be liked twice',
      author: 'anaho',
      user: {
        username: 'anahoUser'
      }
    }

    const mockHandler = jest.fn()

    render(<Blog blog={blog} toggleView={mockHandler} like={mockHandler} updateLikes={mockHandler} user={'anahoUser'} />)

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})