export async function GET() {
  try {
    const apiKey = '74f56d2892c142cf9a07ef2c692dbd98'  // این رو باید از سایت NewsAPI.org بگیری
    const url = `https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=${apiKey}`

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('خطا در دریافت اخبار از منبع خارجی')
    }
    const data = await response.json()

    // فقط تیترها رو برمی‌گردونیم
    const headlines = data.articles.map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      publishedAt: article.publishedAt,
      source: article.source.name,
    }))

    return Response.json(headlines)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
