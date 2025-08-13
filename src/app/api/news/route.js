import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - گرفتن تمام اخبار (داخلی + خارجی)
export async function GET() {
  try {
    // 1. اخبار داخلی
    const newsList = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' },
    })

    // 2. اخبار خارجی
    const apiKey = '74f56d2892c142cf9a07ef2c692dbd98' // کلید API خودت
    const url = `https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=${apiKey}`

    let externalNews = []
    const response = await fetch(url)
    if (response.ok) {
      const data = await response.json()
      externalNews = data.articles.map(article => ({
        id: null, // چون از دیتابیس نیست
        title: article.title,
        content: article.description,
        author: article.source.name,
        createdAt: article.publishedAt,
        isExternal: true, // برای تشخیص تو فرانت
      }))
    }

    // 3. ترکیب و مرتب سازی بر اساس createdAt (جدیدترین اول)
    const allNews = [...newsList, ...externalNews].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )

    return Response.json(allNews)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

// POST - ایجاد خبر جدید
export async function POST(req) {
  try {
    const { title, content, author } = await req.json()

    if (!title || !content || !author) {
      return Response.json(
        { error: 'تمام فیلدها (title, content, author) الزامی هستند' },
        { status: 400 }
      )
    }

    const newNews = await prisma.news.create({
      data: {
        title,
        content,
        author,
      },
    })

    return Response.json(newNews, { status: 201 })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 })
  }
}

// DELETE - حذف خبر بر اساس id
export async function DELETE(req) {
  try {
    const { id } = await req.json()
    if (!id) {
      return Response.json({ error: 'شناسه خبر لازم است' }, { status: 400 })
    }
    const deletedNews = await prisma.news.delete({
      where: { id },
    })
    return Response.json(deletedNews)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

// PUT - ویرایش خبر بر اساس id
export async function PUT(req) {
  try {
    const { id, title, content, author } = await req.json()
    if (!id || !title || !content || !author) {
      return Response.json(
        { error: 'تمام فیلدهای id, title, content, author الزامی هستند' },
        { status: 400 }
      )
    }
    const updatedNews = await prisma.news.update({
      where: { id },
      data: { title, content, author },
    })
    return Response.json(updatedNews)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
