import React from 'react'

import { getTweets } from '@/actions/profile-scraper'

const Page = async () => {
  const data = await getTweets('ky__zo')
  console.log('🟣 | file: page.tsx:7 | Page | data:', data.length)
  return (
    <div className="flex-center">
      <pre className="max-w-lg whitespace-pre-wrap text-black">{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

export default Page
