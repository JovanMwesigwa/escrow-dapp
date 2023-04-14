import { MoralisProvider } from 'react-moralis'
import Home from './pages/Home'

function App() {
  return (
    <MoralisProvider initializeOnMount={false}>
      <Home />
    </MoralisProvider>
  )
}

export default App
