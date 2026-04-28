import { supabase } from '@/lib/supabase'

interface Message {
  id: string
  created_at: string
  name: string
  message: string
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const datePart = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
  const timePart = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date)
  return { datePart, timePart }
}

function MessageCard({ msg }: { msg: Message }) {
  const { datePart, timePart } = formatDate(msg.created_at)

  return (
    <article className="relative flex flex-col gap-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-rose-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* decorative quote mark */ }
      <span
        aria-hidden="true"
        className="absolute top-4 right-5 text-6xl leading-none text-rose-100 font-serif select-none"
      >
        &ldquo;
      </span>

      {/* avatar + name */ }
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-rose-400 to-pink-500 text-white font-semibold text-sm shadow-sm">
          { msg.name.charAt(0).toUpperCase() }
        </div>
        <span className="font-semibold text-rose-900 text-base leading-tight">
          { msg.name }
        </span>
      </div>

      {/* message body */ }
      <p className="text-stone-700 leading-relaxed text-sm flex-1">
        { msg.message }
      </p>

      {/* date + time */ }
      <div className="flex items-center gap-1.5 text-xs text-stone-400 pt-2 border-t border-rose-50">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span>{ datePart }</span>
        <span className="mx-1 text-rose-200">·</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span>{ timePart }</span>
      </div>
    </article>
  )
}

export default async function Home() {
  const { data: messages, error } = await supabase
    .from('messages')
    .select('id, created_at, name, message')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-linear-to-br from-rose-50 via-pink-50 to-amber-50">
      {/* header */ }
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
        { messages && (
          <p className="mt-4 text-stone-500 text-sm">
            { messages.length } { messages.length === 1 ? 'message' : 'messages' } shared
          </p>
        ) }
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-16 sm:px-6 lg:px-8">
        { error && (
          <div className="text-center py-20">
            <p className="text-red-500 text-sm">
              Could not load messages. Please try again later.
            </p>
          </div>
        ) }

        { !error && messages && messages.length === 0 && (
          <div className="text-center py-20">
            <span className="text-5xl" aria-hidden="true">💌</span>
            <p className="mt-4 text-stone-500">No messages yet. Be the first to wish them well!</p>
          </div>
        ) }

        { !error && messages && messages.length > 0 && (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            { messages.map((msg: Message) => (
              <div key={ msg.id } className="break-inside-avoid">
                <MessageCard msg={ msg } />
              </div>
            )) }
          </div>
        ) }
      </main>

      {/* footer */ }
      <footer className="text-center pb-10 text-xs text-stone-400">
        <span aria-hidden="true">✦</span>
        <span className="mx-2">Made with love</span>
        <span aria-hidden="true">✦</span>
      </footer>
    </div>
  )
}
