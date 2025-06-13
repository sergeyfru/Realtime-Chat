
import { useState } from 'react'
import './App.css'
import ChatApp from './ChatApp'

function App() {
  const [openRoom, setOpenRoom] = useState(false)

  const handleRoom =()=>{
    setOpenRoom(!openRoom)
  }
  return (
    <>
    <button onClick={handleRoom}>join room</button>
     {openRoom &&   <>hi</>}
<ChatApp></ChatApp>
    </>
  )
}

export default App
