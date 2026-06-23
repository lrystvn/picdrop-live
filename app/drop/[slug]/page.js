import { generateDropMetadata } from './metadata'
import DropViewer from './dropviewer'

export async function generateMetadata({ params }) {
  return generateDropMetadata(params.slug)
}

export default function Page() {
  return <DropViewer />
}