'use client'
import { useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function SlugRedirect() {
  const { slug } = useParams()
  
  useEffect(() => {
    window.location.replace(`/drop/${slug}`)
  }, [slug])

  return null
}