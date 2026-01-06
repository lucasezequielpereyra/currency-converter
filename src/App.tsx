import { Header, ContentCard } from '@/components'
import { ConversionTitle } from '@/features/currency-converter'

function App() {
  return (
    <div className="flex flex-col w-full h-full">
      <Header />
      <main className="w-full h-full min-h-[calc(100dvh-48px)] flex flex-col relative bg-split-violet">
        <div className="flex flex-col w-full h-full flex-1 items-center px-12 pt-12">
          <ConversionTitle />
          <ContentCard />
        </div>
      </main>
    </div>
  )
}

export default App
