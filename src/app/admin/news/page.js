'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Page = () => {
  const [posts, setPosts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [newPost, setNewPost] = useState({ title: '', body: '' })

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/posts')
      .then(res => setPosts(res.data))
      .catch(err => console.error(err))
  }, [])

  const handleDelete = (id) => {
    setPosts(posts.filter(post => post.id !== id))
  }

  const handleEdit = (post) => {
    alert(`Edit post: ${post.title}`)
  }

  const toggleModal = () => setShowModal(!showModal)

  const handleChange = e => {
    const { name, value } = e.target
    setNewPost(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = (e) => {
    e.preventDefault()
    if(newPost.title && newPost.body) {
      const newId = posts.length ? posts[posts.length -1].id + 1 : 1
      setPosts([...posts, { ...newPost, id: newId, userId: 1 }])
      setNewPost({ title: '', body: '' })
      toggleModal()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-600 to-purple-400 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center">Posts</h1>

        <div className="flex justify-end mb-4">
          <button
            onClick={toggleModal}
            className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-md shadow-md transition"
          >
            Create New Post
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-purple-100 text-purple-800 font-semibold">
              <tr>
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">Title</th>
                <th className="border border-gray-300 px-4 py-2">Body</th>
                <th className="border border-gray-300 px-4 py-2">User ID</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-purple-50">
                  <td className="border border-gray-300 px-4 py-2 text-center">{post.id}</td>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">{post.title}</td>
                  <td className="border border-gray-300 px-4 py-2">{post.body}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{post.userId}</td>
                  <td className="border border-gray-300 px-4 py-2 flex justify-center gap-3">
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-purple-700 hover:text-purple-900 transition"
                      aria-label="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" 
                           viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" 
                              d="M15.232 5.232l3.536 3.536M9 11l6 6m-6-6l-3 3m9-9l-3 3" />
                      </svg>
                    </button>

                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-600 hover:text-red-800 transition"
                      aria-label="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" 
                           viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" 
                              d="M19 7L5 21M5 7l14 14" />
                      </svg>
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
              <h2 className="text-xl font-semibold text-purple-700 mb-4">Create New Post</h2>
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
                  <label htmlFor="body" className="block text-purple-700 font-medium mb-1">
                    Body
                  </label>
                  <textarea
                    id="body"
                    name="body"
                    rows="4"
                    value={newPost.body}
                    onChange={handleChange}
                    required
                    className="w-full border border-purple-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  ></textarea>
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
