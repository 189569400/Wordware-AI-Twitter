import React from 'react'
import { PiXThin } from 'react-icons/pi'

import { findOrCreatePair, getUser } from '@/actions/actions'
import Topbar from '@/components/top-bar'

import PairComponent from '../../../components/analysis/pair-component'
import { ProfileHighlight } from '../../../components/analysis/profile-highlight'

const PairPage = async ({ params: { username, usernamePair } }: { params: { username: string; usernamePair: string } }) => {
  //ALWAYS SORT THE USER IDS SO WE CAN USE THEM AS KEYS
  const [username1, username2] = [username, usernamePair].sort()
  const pair = await findOrCreatePair(username1, username2)
  const [user1, user2] = await Promise.all([getUser({ username: username1 }), getUser({ username: username2 })])

  if (!user1 || !user2) return <div>Pair does not exist</div>

  return (
    <div className="flex-center relative min-h-screen w-full flex-col gap-12 bg-[#F9FAFB] px-4 py-28 sm:px-12 md:px-28 md:pt-24">
      {JSON.stringify(pair, null, 2)}
      <Topbar />
      <div className="flex-center flex-col gap-6">
        <div className="text-center text-xl font-light">
          Here&apos;s the <span className="font-medium">AI agent</span> analysis of your compatibility...
        </div>
        <div className="flex items-center gap-8">
          <ProfileHighlight user={user1} />
          <PiXThin size={36} />
          <ProfileHighlight user={user2} />
        </div>
      </div>

      <PairComponent users={[user1, user2]} />
    </div>
  )
}

export default PairPage