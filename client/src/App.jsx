import React from 'react'
import Clicked from './components/Clicked';

function App() { 
  const [isClicked, setIsClicked] = React.useState(false);
  const [coords, setCoords] = React.useState({x:0,y:0})
  // const [lotr, setLotr] = React.useState() //! Get the data from the backend


  function handleClick({pageX,pageY}){ //todo Gets location but how to load div at that location
    setIsClicked(!isClicked)
    setCoords({x:pageX, y:pageY})
  }

  return (
    <div className='content' /* onClick={handleClick} */>
        <img src="/SAF-LOTRrere.png" alt="lotr search and find" onClick={handleClick}/>

        <div className="clicked">
          {isClicked ? <Clicked name="Eye of Sauron" alt="Eye of Sauron image" image="/EOS.png" position={coords}/> : ""}
        </div>
    </div>
  )
}

export default App 