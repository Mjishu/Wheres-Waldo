import React from 'react'


function Leaderboard(props) {
    const [leaderboardData, setLeaderboardData] = React.useState([])
    const [loading, setLoading] = React.useState(true)


    React.useEffect(() => { // todo Set a max to the amount it grabs(probably 5) prob just do this by getting first 5 items and mapping those
        fetch("https://mjis-wheres-waldo.fly.dev/api/leaderboard", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: props.id }) }) //? why doesnt this send id
            .then(res => res.json())
            .then(data => setLeaderboardData(data.leaderboardItems))
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [props.id])

    if (loading) {
        return <h4>Loading...</h4>
    }

    const itemsMap = leaderboardData.length > 0 && leaderboardData.map(item => {
        return (
            <div key={item._id} className='leaderboard-item fjord'>
                <div className='user-info'>
                    <h5>{item.username}</h5>
                    <h6>Time: {(item.time / 10).toFixed(2)} seconds</h6>
                </div>
                <p>Map: {item.gameBoard.name}</p>
            </div>
        )
    })

    console.log(leaderboardData)
    return (
        <div>
            {itemsMap}
        </div>
    )
}

export default Leaderboard