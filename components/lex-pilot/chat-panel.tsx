'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Send, Loader2 } from 'lucide-react'
import { MOCK_AI_RESPONSES } from '@/lib/constants'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
}

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hi! I&apos;m LexPilot AI. I can help you analyze this contract. What would you like to know?',
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

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI response delay
    setTimeout(() => {
      const randomResponse = MOCK_AI_RESPONSES[Math.floor(Math.random() * MOCK_AI_RESPONSES.length)]
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: randomResponse,
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 800)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-sidebar via-sidebar to-primary/2 border-l border-primary/10 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-primary/10">
        <h3 className="font-serif font-bold text-lg text-gradient mb-1">LexPilot AI</h3>
        <p className="text-xs text-muted-foreground font-medium">Ask questions about this contract</p>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeInUp`}
          >
            <div
              className={`max-w-xs px-4 py-3 rounded-xl text-sm leading-relaxed font-medium transition-all duration-200 ${
                message.type === 'user'
                  ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-br-none shadow-lg hover:shadow-xl'
                  : 'glass-soft rounded-bl-none border border-primary/20 text-foreground'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-fadeInUp">
            <div className="glass-soft px-4 py-3 rounded-xl rounded-bl-none border border-primary/20 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Analyzing...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-5 border-t border-primary/10 glass-soft space-y-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about this contract..."
          className="input-premium w-full text-sm"
          disabled={isLoading}
        />
        <Button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="w-full gap-2 font-semibold button-premium bg-primary hover:bg-primary/90 shadow-lg"
          size="sm"
        >
          <Send className="w-4 h-4" />
          Send
        </Button>
      </div>
    </div>
  )
}
