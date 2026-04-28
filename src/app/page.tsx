import { supabase } from '@/lib/supabase'
import { MessagesBoard } from './messages-board'
import type { Message } from './messages-board'

// never cache — always fetch fresh on each request
export const revalidate = 0

export default async function Home () {
  const { data, error } = await supabase
    .from('messages')
    .select('id, created_at, name, message')
    .order('created_at', { ascending: false })

  const initialMessages: Message[] = error ? [] : (data ?? [])

  return (
    <div className="min-h-screen bg-linear-to-br from-rose-50 via-pink-50 to-amber-50">
      <header className="px-6 pt-14 pb-10 text-center">
        <p className="text-rose-400 tracking-[0.25em] uppercase text-xs font-medium mb-3">
          Wedding Wishes
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-rose-900 leading-tight">
          Messages of Love
        </h1>
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="h-px w-16 bg-linear-to-r from-transparent to-rose-300" />
          <span className="text-rose-300 text-lg" aria-hidden="true">♥</span>
          <div className="h-px w-16 bg-linear-to-l from-transparent to-rose-300" />
        </div>

        <MessagesBoard initialMessages={initialMessages} />
      </header>

      <footer className="text-center pb-10 text-xs text-stone-400">
        <span aria-hidden="true">✦</span>
        <span className="mx-2">Made with love</span>
        <span aria-hidden="true">✦</span>
      </footer>
    </div>
  )
}
