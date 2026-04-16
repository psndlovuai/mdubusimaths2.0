import { notFound } from 'next/navigation'
import { readFile } from 'fs/promises'
import { join } from 'path'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

const SLUG_MAP: Record<string, { file: string; title: string }> = {
  privacy:      { file: 'privacy-policy.md',      title: 'Privacy Policy' },
  terms:        { file: 'terms-of-service.md',     title: 'Terms of Service' },
  refund:       { file: 'refund-policy.md',        title: 'Refund Policy' },
  cancellation: { file: 'cancellation-policy.md',  title: 'Cancellation Policy' },
}

export async function generateStaticParams() {
  return Object.keys(SLUG_MAP).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const entry = SLUG_MAP[slug]
  if (!entry) return {}
  return { title: entry.title }
}

// Minimal markdown → HTML: handles #, ##, ###, **bold**, --- divider, paragraphs
function renderMarkdown(md: string): string {
  const lines = md.split('\n')
  const html: string[] = []
  let inParagraph = false

  function closeParagraph() {
    if (inParagraph) { html.push('</p>'); inParagraph = false }
  }

  function inline(text: string): string {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g,     '<em>$1</em>')
      .replace(/`(.+?)`/g,       '<code class="text-xs bg-cream px-1 py-0.5 rounded">$1</code>')
  }

  for (const raw of lines) {
    const line = raw.trimEnd()
    if (line.startsWith('### ')) {
      closeParagraph()
      html.push(`<h3 class="font-semibold text-ink text-lg mt-6 mb-2">${inline(line.slice(4))}</h3>`)
    } else if (line.startsWith('## ')) {
      closeParagraph()
      html.push(`<h2 class="font-display text-2xl font-medium text-navy mt-8 mb-3">${inline(line.slice(3))}</h2>`)
    } else if (line.startsWith('# ')) {
      closeParagraph()
      html.push(`<h1 class="font-display text-3xl font-medium text-navy mb-4">${inline(line.slice(2))}</h1>`)
    } else if (line === '---') {
      closeParagraph()
      html.push('<hr class="my-6 border-border" />')
    } else if (line.startsWith('> ')) {
      closeParagraph()
      html.push(`<blockquote class="border-l-4 border-gold pl-4 text-muted-foreground my-4 italic">${inline(line.slice(2))}</blockquote>`)
    } else if (line === '') {
      closeParagraph()
    } else {
      if (!inParagraph) { html.push('<p class="text-muted-foreground leading-relaxed mb-3">'); inParagraph = true }
      html.push(inline(line) + ' ')
    }
  }
  closeParagraph()
  return html.join('\n')
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const entry = SLUG_MAP[slug]
  if (!entry) notFound()

  const filePath = join(process.cwd(), 'policies', entry.file)
  let content: string
  try {
    content = await readFile(filePath, 'utf-8')
  } catch {
    notFound()
  }

  const html = renderMarkdown(content)

  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-navy transition-colors mb-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="bg-white rounded-xl shadow-card px-8 py-10">
          <div
            className="prose-like"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  )
}
