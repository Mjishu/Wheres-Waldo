import React from 'react'
import {useNavigate} from "react-router-dom"


function App() { 
  const [backendData,setBackendData] = React.useState();
  const [loading, setLoading] = React.useState(true)
  const navigate = useNavigate()

  React.useEffect(()=>{
    fetch("/api")
    .then(res => res.json())
    .then(data => setBackendData(data))
    .catch(error => console.error(error))
    .finally(() => setLoading(false))
  },[])

  React.useEffect(()=>{ backendData && console.log(backendData)},[backendData])

  function handleClick(id){
    navigate(`/gameboard/${id}`)
  }

  const gameBoardMapped = backendData && backendData.gameBoard.map(game => {
    return(
      <div key={game._id} className='homepage-game-holder'>
        <img className="homepage-image"
        src={game.image}
        alt="Game Image"
        onClick={()=>handleClick(game._id)}
        />
        <h3>{game.name}</h3>
       </div>
      )
  })

  if(loading){
    return <p>Loading...</p>
  }

  return (
    <div className='content' >
        {gameBoardMapped}
    </div>
  )
}

export default App 