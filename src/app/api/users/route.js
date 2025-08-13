import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return Response.json(posts)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const { title, body } = await req.json()
    const newPost = await prisma.post.create({
      data: { title, body }
    })
    return Response.json(newPost, { status: 201 })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json()
    await prisma.post.delete({ where: { id } })
    return Response.json({ message: 'Deleted successfully' })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 })
  }
}
