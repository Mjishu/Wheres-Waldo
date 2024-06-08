import React from "react";
import Clicked from "./Clicked";
import { Link } from "react-router-dom";

function Game(){
    const [isClicked, setIsClicked] = React.useState(false);
    const [coords, setCoords] = React.useState({x:0,y:0});
    //*-------------------------------------------------- API State
    const [backendData, setBackendData] = React.useState();
    const [gameData,setGameData] = React.useState();
    const [itemData,setItemData] = React.useState();
    const [loading,setLoading] = React.useState(true);

    const [gameInfo,setGameInfo] = React.useState({
        gameWon: false,
        guesses: 0,
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
        if (itemData && itemData.length > 0 && gameInfo.correct.length === itemData.length) { 
            setGameInfo(prevData => ({ ...prevData, gameWon: true }));}
        console.log(gameInfo.correct)

        localStorage.setItem("spottedItems", JSON.stringify(gameInfo.correct))
    },[gameInfo.correct,itemData])

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

        setLoading(true)
        setIsClicked(false)
        setGameInfo(prevInfo => ({...prevInfo, guesses: prevInfo.guesses +  1}))

        const fetchParams = {
            method:"POST",
            headers:{'Content-Type':"application/json"},
            body: JSON.stringify({coords, id})
        } 
        await fetch("/api/coords", fetchParams)
        .then(res => res.json())
        .then(data => setGameInfo(prevGameInfo => ({...prevGameInfo, correct: [...prevGameInfo.correct,{...data,seen:true}]}))) //? is this where i use localstorage
        .catch(error => console.error(`Error:${error}`))
        .finally(setLoading(false))
    }
    
    const searchMapped = itemData && itemData.map((item,index) => {
        let isSeen = false;
        if (
            gameInfo.correct && 
            gameInfo.correct.length > index && 
            gameInfo.correct[index].seen  
        ) {
            isSeen = true;
        }
        return <Clicked
        key={item._id}
        id={item._id}
        name={item.name} 
        alt={item.name} 
        image={item.image} 
        handleSubmit={handleSubmit}
        isSeen={isSeen} //! Fix this ? how do i send if correct.seen === true but of that certain id
        />
    })

    if(loading){
        return <p>Loading....</p>
    }

    function playAgain(){
        setGameInfo({correct:[], gameWon:false, guesses:0}) 
        localStorage.clear()
    }
    
    return (
        <div className='content'>
            <div className="game-items">
                <img className="main-image" src={gameData && gameData.image} alt={gameData && gameData.alt} onClick={handleClick}/>
                <Link to="/">Home</Link>
                {gameInfo.guesses}
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
                    <Link to="/">Go Home</Link>
                </div>
            )}
        </div>
        
  )
  
}
  export default Game