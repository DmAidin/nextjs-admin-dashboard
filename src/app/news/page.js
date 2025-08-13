'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Page = () => {
  const [posts, setPosts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [newPost, setNewPost] = useState({ title: '', content: '', author: '' })

  useEffect(() => {
    axios.get('/api/news')
      .then(res => setPosts(res.data))
      .catch(err => console.error(err))
  }, [])

  const handleDelete = async (id) => {
    try {
      await axios.delete('/api/news', { data: { id } })
      setPosts(posts.filter(post => post.id !== id))
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  const handleEdit = (post) => {
    alert(`Edit post: ${post.title}`)
  }

  const toggleModal = () => setShowModal(!showModal)

  const handleChange = e => {
    const { name, value } = e.target
    setNewPost(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (newPost.title && newPost.content && newPost.author) {
      try {
        const response = await axios.post('/api/news', newPost)
        setPosts(prev => [...prev, response.data])
        setNewPost({ title: '', content: '', author: '' })
        toggleModal()
      } catch (err) {
        console.error('Create error:', err)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-600 to-purple-400 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center">News Dashboard</h1>

        <div className="flex justify-end mb-4">
          <button
            onClick={toggleModal}
            className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-md shadow-md transition"
          >
            Create New News
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-purple-100 text-purple-800 font-semibold">
              <tr>
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">Title</th>
                <th className="border border-gray-300 px-4 py-2">Content</th>
                <th className="border border-gray-300 px-4 py-2">Author</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-purple-50">
                  <td className="border border-gray-300 px-4 py-2 text-center">{post.id}</td>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">{post.title}</td>
                  <td className="border border-gray-300 px-4 py-2">{post.content}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{post.author}</td>
                  <td className="border border-gray-300 px-4 py-2 flex justify-center gap-3">
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-purple-700 hover:text-purple-900 transition"
                      aria-label="Edit"
                    >
                      ✏️
                    </button>

                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-600 hover:text-red-800 transition"
                      aria-label="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={toggleModal}
          >
            <div
              className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold text-purple-700 mb-4">Create News</h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-purple-700 font-medium mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newPost.title}
                    onChange={handleChange}
                    required
                    className="w-full border border-purple-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label htmlFor="content" className="block text-purple-700 font-medium mb-1">
                    Content
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    rows="4"
                    value={newPost.content}
                    onChange={handleChange}
                    required
                    className="w-full border border-purple-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="author" className="block text-purple-700 font-medium mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    value={newPost.author}
                    onChange={handleChange}
                    required
                    className="w-full border border-purple-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={toggleModal}
                    className="px-4 py-2 rounded-md border border-purple-400 text-purple-600 hover:bg-purple-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-md transition"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Page
