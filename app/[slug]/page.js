import { redirect } from 'next/navigation'

export default function SlugRedirect({ params }) {
  redirect(`/drop/${params.slug}`)
}