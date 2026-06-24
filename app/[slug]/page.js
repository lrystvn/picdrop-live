import { permanentRedirect } from 'next/navigation'

export default function SlugRedirect({ params }) {
  permanentRedirect(`/drop/${params.slug}`)
}