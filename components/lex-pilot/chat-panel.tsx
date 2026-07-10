'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Send, Loader2, Sparkles, Scale, ShieldAlert } from 'lucide-react'
import { fetchAPI } from '@/lib/api'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
}

export function ChatPanel({ contractId }: { contractId: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm LexPilot AI. I can help you analyze this contract or negotiate terms. What would you like to do?",
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Reset chat when contract changes
  useEffect(() => {
    setMessages([
      {
        id: '1',
        type: 'assistant',
        content: "Hi! I'm LexPilot AI. I can help you analyze this contract or negotiate terms. What would you like to do?",
      },
    ])
  }, [contractId])

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Build history
      const history = messages.filter(m => m.id !== '1').map(m => ({
        role: m.type,
        content: m.content
      }))

      const data = await fetchAPI(`/contracts/${contractId}/chat`, {
        method: 'POST',
        body: JSON.stringify({ message: text, history })
      })

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.reply,
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error(error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Sorry, I encountered an error connecting to the AI service.',
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const SUGGESTED_PROMPTS = [
    { label: 'Summarize Risks', icon: <ShieldAlert className="w-3 h-3" />, prompt: 'What are the main risks in this contract?' },
    { label: 'Negotiation Strategy', icon: <Scale className="w-3 h-3" />, prompt: 'How should we negotiate the liability clause?' },
    { label: 'Explain terms', icon: <Sparkles className="w-3 h-3" />, prompt: 'Explain the data protection requirements in simple terms.' },
  ]

  return (
    <div className="h-full flex flex-col bg-sidebar overflow-hidden">
      <div className="px-4 py-3 border-b border-border shrink-0 flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-primary/15 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
        </div>
        <div>
          <h3 className="font-serif font-bold text-sm text-foreground leading-none">LexPilot AI</h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">Ask Anything & Negotiation Assistant</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeInUp`}
          >
            <div
              className={`max-w-[85%] px-3.5 py-2.5 rounded-xl text-sm leading-relaxed transition-all duration-200 ${
                message.type === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-none shadow-md'
                  : 'bg-card border border-border text-foreground rounded-bl-none shadow-sm'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-fadeInUp">
            <div className="bg-card px-4 py-3 rounded-xl rounded-bl-none border border-border flex items-center gap-2 shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border bg-card shrink-0 space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {SUGGESTED_PROMPTS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(item.prompt)}
              className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-border bg-secondary/50 hover:bg-secondary text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about this contract..."
            className="w-full pl-4 pr-12 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            disabled={isLoading}
          />
          <Button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            size="icon"
            className="absolute right-1.5 top-1.5 h-8 w-8 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
