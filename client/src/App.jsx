import React from 'react'
import Clicked from './components/generalComponents/Clicked';

function App() { 
  const [isClicked, setIsClicked] = React.useState(false);
  const [coords, setCoords] = React.useState({x:0,y:0})
  const [backendData, setBackendData] = React.useState()

  React.useEffect(()=>{
    fetch("/api")
    .then(res => res.json())
    .then(data => setBackendData(data))
    .catch(error => console.error("error", error))
  },[])

  // React.useEffect(() => {backendData && console.log(backendData)},[backendData])

  function handleClick({pageX,pageY}){ //todo make a div around the clicked with dashed border?
    setIsClicked(!isClicked)
    setCoords({x:pageX, y:pageY})
    console.log(`x:${pageX} | y: ${pageY}`)
  }

  function handleSubmit(id){
    console.log(id)
    setIsClicked(false)
  }

  const searchMapped = backendData && backendData.items.map((item) => {
    return <Clicked
      key={item._id}
      id={item._id}
      name={item.name} 
      alt={item.name} 
      image={item.image} 
      handleSubmit={handleSubmit}
    />
  })

  return (
    <div className='content' /* onClick={handleClick} */>
        <img className="main-image" src={backendData && backendData.gameBoard[0/* switch to n number */].image } alt={backendData && backendData.gameBoard[0].alt} onClick={handleClick}/>

        {isClicked && (<div 
          className="clicked" 
          style={{left:`${coords.x}px`, top:`${coords.y}px`}}
          >
            {searchMapped}
        </div>
      )}
    </div>
  )
}

export default App 