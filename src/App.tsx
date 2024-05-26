import { Input } from "@/components/ui/input"
import { useState } from 'react';
import { Label } from '@/components/ui/label.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { debounce } from '@/debounce.ts';

async function search(url: string, prompt: string) {
  const r = await fetch(`${url}`, {
    method: 'POST',
    body: JSON.stringify(
      {
        prompt: prompt
      }
    )
  })
  const data = await r.json()
  return data.translation
}

const debouncedSearch = debounce(async (url: string, prompt: string, setTranslation: (t: string) => void) => {
  const translation = await search(url, prompt)
  setTranslation(translation)
}, 500)

function App() {

  const [url, setUrl] = useState<string>("")

  const [translation, setTranslation] = useState<string>("")
  const [text, setText] = useState<string>("")


  return (
    <>
      <div className="max-w-4xl mx-auto p-4 md:p-8 !pb-0 gap-4 flex flex-col">
        <h1 className="text-4xl font-bold text-center">Traductor</h1>
        <Input placeholder={'http://ngrok.com/abc'} onChange={(e) => {
          setUrl(e.target.value)
        }}/>
      </div>
      <div className="grid grid-cols-2 gap-6 p-6">
        <div className="space-y-2">
          <Label htmlFor="spanish-input">Español</Label>
          <Textarea
            onChange={(e) => {
              setText(e.target.value)
              debouncedSearch(url, e.target.value, setTranslation)
            }}
            value={text}
            className="h-[300px] resize-none" id="spanish-input" placeholder="Escribe en español aquí..."/>
        </div>
        <div className="space-y-2">
          <Label htmlFor="english-output">Inglés</Label>
          <Textarea
            value={translation}
            className="h-[300px] resize-none"
            id="english-output"
            placeholder="La traducción aparecerá aquí..."
            readOnly
          />
        </div>
      </div>
    </>
  )
}

export default App
