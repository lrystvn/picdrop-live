import { createClient } from '@supabase/supabase-js'

export async function generateDropMetadata(slug) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const { data: drop } = await supabase
    .from('drops')
    .select('title, caption')
    .eq('slug', slug)
    .single()

  if (!drop) return {
    title: 'Drop not found — Picdrop',
    description: 'This drop does not exist or has expired.',
  }

  return {
    title: `${drop.title} — Picdrop`,
    description: drop.caption || `${drop.title} · Shared privately on Picdrop`,
    openGraph: {
      title: drop.title,
      description: drop.caption || `${drop.title} · Shared privately on Picdrop`,
      images: [{ url: 'https://picdrop.live/og-image.png' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: drop.title,
      description: drop.caption || `${drop.title} · Shared privately on Picdrop`,
    },
  }
}