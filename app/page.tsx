import { RedirectType, redirect } from 'next/navigation'

export default function RootPage() {
  redirect('/pt', RedirectType.replace)
}
