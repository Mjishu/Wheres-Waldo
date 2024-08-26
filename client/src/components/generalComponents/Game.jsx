import React from "react";
import Clicked from "./Clicked";
import { Link } from "react-router-dom";
import AddLeaderboard from "./AddLeaderboard";
import Timer from "./Timer";
import ItemComponent from "../ItemComponent";

function Game() {
    const [isClicked, setIsClicked] = React.useState(false);
    const [coords, setCoords] = React.useState({ x: 0, y: 0 });
    //*-------------------------------------------------- API State
    const [backendData, setBackendData] = React.useState();
    const [gameData, setGameData] = React.useState();
    const [itemData, setItemData] = React.useState();
    const [loading, setLoading] = React.useState(true);

    const [gameInfo, setGameInfo] = React.useState({
        gameWon: false,
        correct: [],
        username: "",
        timer: 0,
        running: true
    })
    //?---------------------------------------------------API Calls
    const url = window.location.href;
    const split = url.split("/")
    const gameId = split[split.length - 1]

    React.useEffect(() => {
        //todo Add cleanup 
        fetch("/api")
            .then(res => res.json())
            .then(data => setBackendData(data))
            .catch(error => console.error("error", error))
            .finally(() => setLoading(false))
    }, [])

    React.useEffect(() => {
        const foundItems = []
        if (backendData) {
            const foundGame = backendData.gameBoard.find(item => item._id === gameId)
            if (foundGame) { setGameData(foundGame) }

            for (const item of backendData.items) {
                if (item.gameBoard._id === gameId) {
                    foundItems.push(item)
                }
            }
            localStorage.setItem("items", JSON.stringify(foundItems))
            setItemData(foundItems)
        }
    }, [backendData])

    React.useEffect(() => { //* Checks win condition
        const localItems = JSON.parse(localStorage.getItem("items"))
        if (!localItems) { return }
        const itemsSpotted = new Set()
        for (const item of localItems) {
            item.spotted && itemsSpotted.add(item.name)
        }

        if (itemData && itemData.length > 0 && itemsSpotted.size === itemData.length) {
            setGameInfo(prevData => ({ ...prevData, gameWon: true }))
            stopTimer()
        }

    }, [gameInfo.correct, itemData])



    //*-------------------------------------------------Game Logic


    function handleClick(event) {
        const rect = event.target.getBoundingClientRect();
        const offsetX = rect.left;
        const offsetY = rect.top;

        const mouseX = event.pageX - offsetX
        const mouseY = event.pageY - offsetY

        if (!isClicked) {
            setCoords({ x: mouseX, y: mouseY })
            // console.log(`x:${mouseX} | y: ${mouseY}`)
        }
        setIsClicked(!isClicked)
    }

    async function handleSubmit(id) {
        console.log(`submitted id ${id}`)

        setLoading(true)
        setIsClicked(false)

        const fetchParams = {
            method: "POST",
            headers: { 'Content-Type': "application/json" },
            body: JSON.stringify({ coords, id })
        }
        await fetch("/api/coords", fetchParams)
            .then(res => res.json())
            .then(data => (
                setGameInfo(prevGameInfo => ({ ...prevGameInfo, correct: [...prevGameInfo.correct, { id: data.id, ...data }] })))
            )
            .catch(error => console.error(`Error:${error}`))
            .finally(setLoading(false))


        const localItems = JSON.parse(localStorage.getItem("items"))
        for (const item of localItems) {
            if (item._id === id) {
                item.spotted = true
            }
        }
        localStorage.setItem("items", JSON.stringify(localItems))
    }

    const localItem = JSON.parse(localStorage.getItem(`items`)) || []
    const localMapped = localItem.map((item) => {
        if (!item.spotted) {
            return <Clicked
                key={item._id}
                id={item._id}
                name={item.name}
                alt={item.name}
                image={item.image}
                handleSubmit={handleSubmit}
                isSeen={item.spotted}
            />
        }
    })
    const itemsMapped = localItem.map(item => {
        return <ItemComponent
            image={item.image}
            key={item._id}
            name={item.name}
            spotted={item.spotted ? true : false}
        />
    })


    if (loading) {
        return <p>Loading....</p>
    }

    function playAgain() {
        setGameInfo({ correct: [], gameWon: false, username: "", timer: 0 })


        const localItems = JSON.parse(localStorage.getItem("items"))
        for (const item of localItems) {
            item.spotted = false
        }
        localStorage.setItem("items", JSON.stringify(localItems))
        startTimer()
    }

    function handleLeaderboardSubmit(e) {
        e.preventDefault()
        console.log(gameInfo.username, gameInfo.username.length);

        const fetchParams = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username: gameInfo.username, gameBoard: gameData._id, time: gameInfo.timer })
        }

        fetch("/api/leaderboard/add", fetchParams)
            .then(res => res.json)
            .then(data => console.log(`data: ${data}`))
            .catch(err => console.error(err))

        playAgain();
    }

    function handleLeaderboardChange(e) {
        const { name, value } = e.target;
        setGameInfo(prevGameInfo => {
            return { ...prevGameInfo, [name]: value }
        })
    }

    //* -------------------------------------------Timer functions
    function startTimer() {
        setGameInfo(prevInfo => ({ ...prevInfo, running: true }))
    }
    function stopTimer() {
        setGameInfo(prevInfo => ({ ...prevInfo, running: false }))
    }

    //?--------------------------------------------- Return

    return (
        <div className='content Game-bg'>
            <h2 className="h2 game-header sans-dm">{gameData && gameData.name}</h2>
            <div className="game-items">
                <img className="main-image" id={gameData && gameData.name} src={gameData && gameData.image} alt={gameData && gameData.alt} onClick={handleClick} />
                <Link to="/" className="h6 home-link">Home</Link>

                {isClicked && (
                    <>
                        <div className="clicked"
                            style={{ left: `${coords.x}px`, top: `${coords.y}px` }}
                        >
                            {localMapped}
                        </div>
                        <div className="clicked-circle" style={{ left: `${coords.x - 12.5}px`, top: `${coords.y + 100}px` }}></div>
                    </>)}
            </div>
            <Timer timer={gameInfo.timer} running={gameInfo.running} setInfo={setGameInfo} />

            {gameInfo.gameWon && (
                <AddLeaderboard time={gameInfo.timer} playAgain={playAgain} handleSubmit={handleLeaderboardSubmit} handleChange={handleLeaderboardChange} username={gameInfo.username} />
            )}
            <div className="item-shown">
                {itemsMapped}
            </div>

        </div>

    )

}

export default Game