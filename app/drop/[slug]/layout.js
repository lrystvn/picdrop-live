import { supabase } from '../../supabase'

export async function generateMetadata({ params }) {
  const { slug } = params

  const { data: drop } = await supabase
    .from('drops')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!drop) return {
    title: 'Drop not found — Picdrop',
    description: 'This drop does not exist or has expired.',
  }

  const { data: photos } = await supabase
    .from('photos')
    .select('file_path')
    .eq('drop_id', drop.id)
    .order('order_index', { ascending: true })
    .limit(1)

  let coverImageUrl = 'https://picdrop.live/og-image.png'
  if (photos && photos.length > 0) {
    const { data: urlData } = supabase.storage.from('photos').getPublicUrl(photos[0].file_path)
    coverImageUrl = urlData.publicUrl
  }

  return {
    title: `${drop.title} — Picdrop`,
    description: drop.caption || `${drop.title} — shared privately on Picdrop`,
    openGraph: {
      title: drop.title,
      description: drop.caption || `${drop.title} — shared privately on Picdrop`,
      images: [{ url: coverImageUrl, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: drop.title,
      description: drop.caption || `${drop.title} — shared privately on Picdrop`,
      images: [coverImageUrl],
    },
  }
}

export default function DropLayout({ children }) {
  return children
}