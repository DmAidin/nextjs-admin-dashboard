import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // داده‌های نمونه برای اضافه کردن
  const posts = [
    {
      title: 'پست اول',
      body: 'این یک متن نمونه برای پست اول است.'
    },
    {
      title: 'پست دوم',
      body: 'این متن نمونه برای پست دوم می‌باشد.'
    },
    {
      title: 'پست سوم',
      body: 'متن پست سوم برای آزمایش seed است.'
    }
  ]

  for (const post of posts) {
    // ایجاد هر پست در دیتابیس
    await prisma.post.create({ data: post })
  }

  console.log('Seed data inserted successfully.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })