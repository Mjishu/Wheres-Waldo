import React from "react";
import Clicked from "./Clicked";
import { Link } from "react-router-dom";

function Game(){
    const [isClicked, setIsClicked] = React.useState(false);
    const [coords, setCoords] = React.useState({x:0,y:0})
    const [gameOver,setGameOver] = React.useState(false)

    //*-------------------------------------------------- API State
    const [backendData, setBackendData] = React.useState()
    const [gameData,setGameData] = React.useState()
    const [itemData,setItemData] = React.useState()
    const [loading,setLoading] = React.useState(true)

    //?---------------------------------------------------API Calls
    const url = window.location.href;
    const split = url.split("/")
    const gameId = split[split.length - 1]
    
    React.useEffect(()=>{
        fetch("/api")
        .then(res => res.json())
        .then(data => setBackendData(data))
        .catch(error => console.error("error", error))
    },[])
    
    React.useEffect(() => {
        const foundItems = []
        if (backendData){
            const foundGame = backendData.gameBoard.find(item => item._id === gameId)
            if(foundGame){setGameData(foundGame)}

            for(const item of backendData.items){
                if(item.gameBoard._id === gameId){
                    foundItems.push(item)
                }
            }
            setItemData(foundItems)
        }
        setLoading(false)
    },[backendData])

    // React.useEffect(()=>{
    //     console.log(gameData && gameData.image)
    //     console.log(itemData)
    // },[gameData,itemData])

    //*-------------------------------------------------Game Logic

    function handleClick({pageX,pageY}){ 
        if (!isClicked){
            setCoords({x:pageX, y:pageY})
            console.log(`x:${pageX} | y: ${pageY}`)
        }
        setIsClicked(!isClicked)
    }
    
    async function handleSubmit(id){
        console.log(id)
        setIsClicked(false)

        const fetchParams = {
            method:"POST",
            headers:{'Content-Type':"application/json"},
            body: JSON.stringify({coords, id})
        } 

        await fetch("/api/coords", fetchParams)
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(error => console.error(`Error:${error}`))
    }
    
    const searchMapped = itemData && itemData.map((item) => {
        return <Clicked
        key={item._id}
        id={item._id}
        name={item.name} 
        alt={item.name} 
        image={item.image} 
        handleSubmit={handleSubmit}
        />
    })

    if(loading){
        return <p>Loading....</p>
    }
    
    return (
        <div className='content' /* onClick={handleClick} */>
            <img className="main-image" src={gameData && gameData.image} alt={gameData && gameData.alt} onClick={handleClick}/>

            {isClicked && (<div 
            className="clicked" 
            style={{left:`${coords.x}px`, top:`${coords.y}px`}}
            >
                {searchMapped}
            </div>
        )}
        <Link to="/">Home</Link>
        </div>
  )
  
}
  export default Game