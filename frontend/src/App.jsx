import { useState, useEffect } from 'react'
import './App.css'

import axios from 'axios'

function App() {
  const [count, setCount] = useState(0)
  const [array, setArray] = useState([])
  const [text, setText] = useState("");

  const fetchData = async () => {
    const response = await axios.get('http://localhost:5000/api/friends')
    console.log(response.data)
    setArray(response.data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
      {
        array.map((item, index) => (
          <div key={index}>{item.name}</div>
        ))
      }
      
    </>
  )
}

export default App
