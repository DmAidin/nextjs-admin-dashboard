'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Page = () => {
  const [posts, setPosts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [newPost, setNewPost] = useState({ title: '', body: '' })

  // 📌 دریافت لیست پست‌ها از API داخلی
  useEffect(() => {
    axios.get('/api/posts')
      .then(res => setPosts(res.data))
      .catch(err => console.error(err))
  }, [])

  // 📌 حذف پست از دیتابیس و UI
  const handleDelete = async (id) => {
    try {
      await axios.delete('/api/posts', { data: { id } })
      setPosts(posts.filter(post => post.id !== id))
    } catch (error) {
      console.error(error)
    }
  }

  // 📌 ویرایش پست (فعلاً فقط نمایش هشدار)
  const handleEdit = (post) => {
    alert(`ویرایش مطلب: ${post.title}`)
  }

  const toggleModal = () => setShowModal(!showModal)

  const handleChange = e => {
    const { name, value } = e.target
    setNewPost(prev => ({ ...prev, [name]: value }))
  }

  // 📌 ذخیره پست جدید در دیتابیس
  const handleSave = async (e) => {
    e.preventDefault()
    if (newPost.title && newPost.body) {
      try {
        const res = await axios.post('/api/posts', newPost)
        setPosts([res.data, ...posts]) // اضافه به لیست
        setNewPost({ title: '', body: '' })
        toggleModal()
      } catch (error) {
        console.error(error)
      }
    }
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-r   p-6 font-vazir">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center">مطالب</h1>

        <div className="flex justify-start mb-4">
          <button
            onClick={toggleModal}
            className="btn btn-grd btn-grd-primary px-4 py-2 transition"
          >
            ایجاد مطلب جدید
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300 text-right">
            <thead className="bg-purple-100 text-purple-800 font-semibold">
              <tr>
                <th className="border border-gray-300 px-4 py-2">شناسه</th>
                <th className="border border-gray-300 px-4 py-2">عنوان</th>
                <th className="border border-gray-300 px-4 py-2">متن</th>
                <th className="border border-gray-300 px-4 py-2 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-purple-50">
                  <td className="border border-gray-300 px-4 py-2 text-center">{post.id}</td>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">{post.title}</td>
                  <td className="border border-gray-300 px-4 py-2">{post.body}</td>
                  <td className="border border-gray-300 px-4 py-2 flex justify-center gap-3">
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-purple-700 hover:text-purple-900 transition"
                      aria-label="ویرایش"
                      title="ویرایش"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-600 hover:text-red-800 transition"
                      aria-label="حذف"
                      title="حذف"
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 📌 مودال ایجاد پست جدید */}
        {showModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={toggleModal}
          >
            <div 
              className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold text-purple-700 mb-4">ایجاد مطلب جدید</h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-purple-700 font-medium mb-1">
                    عنوان
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
                    متن
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
                    className="btn btn-grd-danger transition text-white"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="btn btn-grd-info transition text-white"
                  >
                    ذخیره
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
