import React from 'react'
import Clicked from './components/Clicked';

function App() { 
  const [isClicked, setIsClicked] = React.useState(false);
  const [coords, setCoords] = React.useState({x:0,y:0})
  // const [lotr, setLotr] = React.useState() //! Get the data from the backend


  function handleClick({pageX,pageY}){ //todo make a div around the clicked with dashed border?
    setIsClicked(!isClicked)
    setCoords({x:pageX, y:pageY})
    console.log(`x:${pageX} | y: ${pageY}`)
  }

  function handleSubmit(id){
    console.log(id)
    setIsClicked(false)
  }

  return (
    <div className='content' /* onClick={handleClick} */>
        <img className="main-image" src="/images/LOTR/SAF-LOTRrere.png" alt="lotr search and find" onClick={handleClick}/>

        {isClicked && (<div 
          className="clicked" 
          style={{left:`${coords.x}px`, top:`${coords.y}px`}}
          >
           <Clicked 
            name="Eye of Sauron" 
            alt="Eye of Sauron image" 
            image="/images/LOTR/EOS.png" 
            handleSubmit={handleSubmit}
            />
        </div>
      
      )}
    </div>
  )
}

export default App 