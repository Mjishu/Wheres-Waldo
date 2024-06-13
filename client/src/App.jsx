import React from 'react'
import {useNavigate} from "react-router-dom"
import Leaderboard from './components/generalComponents/Leaderboard';


function App() { 
  const [backendData,setBackendData] = React.useState();
  const [loading, setLoading] = React.useState(true)
  const navigate = useNavigate()
  const [leaderboardTab,setLeaderboardTab] = React.useState()
 

  React.useEffect(()=>{
    fetch("/api")
    .then(res => res.json())
    .then(data => setBackendData(data))
    .catch(error => console.error(error))
    .finally(() => setLoading(false))
  },[])

  // React.useEffect(()=>{ backendData && console.log(backendData)},[backendData])

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
        <h3 className='homepage-game-name p sans-dm'>{game.name}</h3>
       </div>
      )
  })

  //*-------------------------------------------------------LeaderBoard tabs 
  function handleTabChange(id){
    setLeaderboardTab(id)
  }

  const leaderboardSelectorMapped = backendData && backendData.gameBoard.map((map) => {
    return (
      <button
        onClick={()=>handleTabChange(map._id)}
        key={map._id}
        id={map._id}
        className='tablist-item'
      >{map.name}</button>
    )
  })

  if(loading){
    return <p>Loading...</p>
  }

  return (
    <div className='content home-page' >
      <h1 className="title h2 sans-dm">Wheres Waldo</h1>
      <div className="games-info">
        <div className="app-home-games ">
        <h3 className="Tab h3 sans-dm">Games</h3>
          {gameBoardMapped}
        </div>
        <div className="app-home-leaderboard ">
        <h3 className='sans-dm h3 Tab'>Leaderboard</h3>
          <div className='tablist-map'>
            {leaderboardSelectorMapped}
          </div>
            <Leaderboard id={leaderboardTab}/>
        </div>
      </div>
    </div>
  )
}

export default App 
