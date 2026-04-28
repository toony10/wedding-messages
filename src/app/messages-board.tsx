'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface Message {
  id: string
  created_at: string
  name: string
  message: string
}

function formatDate (dateStr: string) {
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

function MessageCard ({ msg, isNew }: { msg: Message; isNew: boolean }) {
  const { datePart, timePart } = formatDate(msg.created_at)

  return (
    <article
      className={`relative flex flex-col gap-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-rose-100 p-6 shadow-sm hover:shadow-md transition-all duration-500 ${isNew ? 'animate-fade-in' : ''}`}
    >
      <span
        aria-hidden="true"
        className="absolute top-4 right-5 text-6xl leading-none text-rose-100 font-serif select-none"
      >
        &ldquo;
      </span>

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-rose-400 to-pink-500 text-white font-semibold text-sm shadow-sm">
          {msg.name.charAt(0).toUpperCase()}
        </div>
        <span className="font-semibold text-rose-900 text-base leading-tight">
          {msg.name}
        </span>
      </div>

      <p className="text-stone-700 leading-relaxed text-sm flex-1">
        {msg.message}
      </p>

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
        <span>{datePart}</span>
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
        <span>{timePart}</span>
      </div>
    </article>
  )
}

export function MessagesBoard ({ initialMessages }: { initialMessages: Message[] }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newIds, setNewIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const channel = supabase
      .channel('messages-live')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload: { new: unknown }) => {
          const incoming = payload.new as Message
          setMessages((prev) => [incoming, ...prev])
          setNewIds((prev) => new Set(prev).add(incoming.id))
          setTimeout(() => {
            setNewIds((prev) => {
              const next = new Set(prev)
              next.delete(incoming.id)
              return next
            })
          }, 2000)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <>
      <p className="mt-4 text-stone-500 text-sm">
        {messages.length} {messages.length === 1 ? 'message' : 'messages'} shared
      </p>

      <main className="max-w-6xl mx-auto px-4 pb-16 sm:px-6 lg:px-8">
        {messages.length === 0 && (
          <div className="text-center py-20">
            <span className="text-5xl" aria-hidden="true">💌</span>
            <p className="mt-4 text-stone-500">No messages yet. Be the first to wish them well!</p>
          </div>
        )}

        {messages.length > 0 && (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {messages.map((msg) => (
              <div key={msg.id} className="break-inside-avoid">
                <MessageCard msg={msg} isNew={newIds.has(msg.id)} />
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
