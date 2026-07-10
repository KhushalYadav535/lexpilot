'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Languages, Copy, Check } from 'lucide-react'
import { fetchAPI } from '@/lib/api'

const LANGUAGES = [
  { code: 'Hindi',       label: 'Hindi (हिंदी)' },
  { code: 'French',      label: 'French (Français)' },
  { code: 'German',      label: 'German (Deutsch)' },
  { code: 'Spanish',     label: 'Spanish (Español)' },
  { code: 'Arabic',      label: 'Arabic (العربية)' },
  { code: 'Portuguese',  label: 'Portuguese (Português)' },
  { code: 'Japanese',    label: 'Japanese (日本語)' },
  { code: 'Chinese',     label: 'Chinese (中文)' },
  { code: 'Russian',     label: 'Russian (Русский)' },
  { code: 'Italian',     label: 'Italian (Italiano)' },
  { code: 'Dutch',       label: 'Dutch (Nederlands)' },
  { code: 'Korean',      label: 'Korean (한국어)' },
]

export function TranslationPanel({ contract }: { contract?: any }) {
  const [language, setLanguage] = useState('Hindi')
  const [translating, setTranslating] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleTranslate = async () => {
    if (!contract) return
    setTranslating(true)
    setResult(null)
    try {
      const data = await fetchAPI(`/contracts/${contract._id || contract.id}/translate`, {
        method: 'POST',
        body: JSON.stringify({ language })
      })
      setResult(data.translatedText)
    } catch (err) {
      console.error(err)
      alert('Translation failed. Please try again.')
    } finally {
      setTranslating(false)
    }
  }

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="p-6 h-full overflow-y-auto space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-bold tracking-tight">AI Translation</h2>
        <p className="text-muted-foreground mt-1">Translate contract summary into any language while preserving legal terminology.</p>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-semibold uppercase tracking-wide">Target Language</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`text-left p-3 rounded-lg border text-sm transition-all ${
                language === lang.code
                  ? 'border-primary bg-primary/10 ring-1 ring-primary/50 font-semibold'
                  : 'border-border bg-card hover:border-primary/40'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      <Button
        onClick={handleTranslate}
        disabled={translating || !contract}
        className="w-full"
        size="lg"
      >
        {translating
          ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Translating…</>
          : <><Languages className="w-4 h-4 mr-2" />Translate to {language}</>
        }
      </Button>

      {result && (
        <Card className="p-5 space-y-3 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Translation ({language})</h3>
            <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 px-2">
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              <span className="ml-1 text-xs">{copied ? 'Copied!' : 'Copy'}</span>
            </Button>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none bg-secondary/20 p-4 rounded-lg text-sm leading-relaxed whitespace-pre-wrap">
            {result}
          </div>
        </Card>
      )}
    </div>
  )
}
