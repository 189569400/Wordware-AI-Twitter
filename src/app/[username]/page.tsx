import { notFound, redirect } from 'next/navigation'
import { Metadata } from 'next/types'

import { getUser, getUsers } from '@/actions/actions'

import ResultComponent from './result-component'

export const maxDuration = 300
export const dynamic = 'force-dynamic'

const Page = async ({ params }: { params: { username: string } }) => {
  const data = await getUser({ username: params.username })

  if (!data) {
    return redirect(`/?u=${params.username}`)
  }

  const extractDescription = ({ fullProfile }: { fullProfile: unknown }) => {
    if (typeof fullProfile !== 'object' || fullProfile === null) return ''

    const description = (fullProfile as any).description || ''
    const entities = (fullProfile as any).entities?.description

    if (!entities?.urls) return description

    return entities.urls.reduce((newDescription: string, url: any) => {
      return newDescription.replace(url.url, url.display_url)
    }, description)
  }

  const processedDescription = extractDescription({ fullProfile: data.fullProfile })

  return (
    <div className="flex-center relative min-h-screen w-full flex-col bg-[#F9FAFB] p-4 sm:p-12 md:p-24">
      {/* <DotPattern className={cn('-z-50 [mask-image:radial-gradient(300px_circle_at_center,white,transparent)]')} /> */}
      <div className="flex-center flex-col gap-6 py-12">
        <div className="text-center text-xl font-light">Let&apos;s see what stars think about you...</div>
        <div className="flex gap-4">
          <div className="flex-center grow">
            <img
              src={data.profilePicture || ''}
              alt="profile image"
              className="max-h-24 min-h-24 w-full min-w-24 max-w-24 rounded-full border border-gray-300"
              width={96}
              height={96}
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="text-xl font-bold">
              {data.name} <span className="text-base font-normal text-gray-500">@{data.username}</span>
            </div>
            <div className="text-gray-500">{data.location}</div>
            <div className="max-w-sm text-sm">{processedDescription}</div>
          </div>
        </div>
      </div>

      <ResultComponent user={data} />
    </div>
  )
}

export default Page

export async function generateStaticParams() {
  const users = await getUsers()
  return users.map((user) => ({
    username: user.username,
  }))
}

export async function generateMetadata({ params }: { params: { username?: string } }) {
  if (!params.username) return notFound()
  const user = await getUser({ username: params.username })

  if (user == null) notFound()
  const imageParams = new URLSearchParams()

  const description = user.description ?? ''
  const name = user.name || ''
  const username = user.username || ''

  imageParams.set('name', name)
  imageParams.set('username', username)
  imageParams.set('description', description)

  const image = {
    alt: 'Banner',
    url: `${process.env.BASE_URL}/api/og/craftgen?${imageParams.toString()}`,
    width: 1200,
    height: 630,
  }

  return {
    title: name,
    description: description,
    openGraph: {
      url: `/${username}`,
      images: image,
    },
    twitter: {
      images: image,
    },
  } satisfies Metadata
}