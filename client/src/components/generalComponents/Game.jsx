import React from "react";
import Clicked from "./Clicked";
import { Link } from "react-router-dom";

//!! HEIGHT ON IMAGE GOES ABOVE IMAGE?

function Game(){
    const [isClicked, setIsClicked] = React.useState(false);
    const [coords, setCoords] = React.useState({x:0,y:0});
    //*-------------------------------------------------- API State
    const [backendData, setBackendData] = React.useState();
    const [gameData,setGameData] = React.useState();
    const [itemData,setItemData] = React.useState();
    const [loading,setLoading] = React.useState(true);
    const[unclikcedItems,setUnclickedItems]= React.useState()

    const [gameInfo,setGameInfo] = React.useState({
        gameWon: false,
        correct: []
    }) 
    //?---------------------------------------------------API Calls
    const url = window.location.href;
    const split = url.split("/")
    const gameId = split[split.length - 1]
    
    React.useEffect(()=>{
        fetch("/api")
        .then(res => res.json())
        .then(data => setBackendData(data))
        .catch(error => console.error("error", error))
        .finally(() => setLoading(false))
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
    },[backendData])

    React.useEffect(() => {
        if (itemData && itemData.length > 0 && gameInfo.correct.length === itemData.length) { ``
            setGameInfo(prevData => ({ ...prevData, gameWon: true }));}
        console.log(gameInfo.correct)

        console.log(itemData)
    },[gameInfo.correct,itemData])

    //*-------------------------------------------------Game Logic

    function handleClick(event){ //todo Normalize mouse coords
        const rect = event.target.getBoundingClientRect();
        const offsetX = rect.left;
        const offsetY = rect.top;

        const mouseX = event.pageX - offsetX
        const mouseY = event.pageY - offsetY

        if(!isClicked){
            setCoords({x:mouseX, y:mouseY})
            console.log(`x:${mouseX} | y: ${mouseY}`)
        }
        setIsClicked(!isClicked)
    }
    
    async function handleSubmit(id){
        console.log(`submitted id ${id}` )

        setLoading(true)
        setIsClicked(false)

        const fetchParams = {
            method:"POST",
            headers:{'Content-Type':"application/json"},
            body: JSON.stringify({coords, id})
        } 
        await fetch("/api/coords", fetchParams)
        .then(res => res.json())
        .then(data => (
            setGameInfo(prevGameInfo => ({...prevGameInfo, correct: [...prevGameInfo.correct,{id:data.id,...data}]})))
        )
        .catch(error => console.error(`Error:${error}`))
        .finally(setLoading(false))

        // const found = gameInfo.correct.find({id:id})
        // console.log(`found${found}`)
    }
    
    const searchMapped = itemData && itemData.map((item) => {
        const itemIsClicked = gameInfo.clicked && gameInfo.clicked.some(clickedItem => (` ids are${clickedItem.id} + ${item.id}`)); //! this isnt even getting called, handleSbumit is the only place i can think but idk how io use it here

        return <Clicked
        key={item._id}
        id={item._id}
        name={item.name} 
        alt={item.name} 
        image={item.image} 
        handleSubmit={handleSubmit}
        isSeen={item.spotted}
        className={itemIsClicked ? "clicked-border" : ""}
        />
    })

    if(loading){
        return <p>Loading....</p>
    }

    function playAgain(){
        setGameInfo({correct:[], gameWon:false}) 
    }
    
    return (
        <div className='content Game-bg'>
            <h2 className="h2 game-header sans-dm">{gameData && gameData.name}</h2>
            <div className="game-items">
                <img className="main-image" src={gameData && gameData.image} alt={gameData && gameData.alt} onClick={handleClick}/>
                <Link to="/" className="h6 home-link">Home</Link>
            </div>

            {isClicked && (
                <>
                    <div className="clicked" 
                    style={{left:`${coords.x+25}px`, top:`${coords.y+25}px`}}
                    >
                        {searchMapped}
                    </div>
                    <div className="clicked-circle" style={{ left:`${coords.x -12}px`, top:`${coords.y -12}px`}}></div>
                </> )}
           
            {gameInfo.gameWon && ( 
                <div className="gameOver">
                    <h1>You won!</h1>
                    <h4>Time took: </h4>
                    <button onClick={playAgain}>Play Again</button>
                    <Link to="/" className="h6 home-link">Go Home</Link>
                </div>
            )}
        </div>
        
  )
  
}

export default Game


//todo How do i get the id of the item thats in local storage to match the ids that are put towards clicked and then if those ids match set that item to have red border? Maybe do it in the map function instead?
