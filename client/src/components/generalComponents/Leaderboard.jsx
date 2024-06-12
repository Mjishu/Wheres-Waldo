import React from 'react'

//todo Make a tab system that grabs the name of each map and sends that id to backend to populate the leaderboard with those ids matching

function Leaderboard(props) {
    const [leaderboardData, setLeaderboardData] = React.useState([])
    const [loading,setLoading] = React.useState(true)


    React.useEffect(()=>{
        fetch("/api/leaderboard",{method:"POST",headers:{"Content-Type":"application/json"}, body:JSON.stringify({id:props.id})}) //? why doesnt this send id
        .then(res => res.json())
        .then(data=> setLeaderboardData(data.leaderboardItems))
        .catch(err => console.error(err))
        .finally(() => setLoading(false))
    },[props.id])

    if(loading){
        return <h4>Loading...</h4>
    }

    const itemsMap = leaderboardData.length > 0 && leaderboardData.map(item => {
        return (
            <div key={item._id} className='leaderboard-item fjord'>
                <div className='user-info'>
                    <h5>{item.username}</h5>
                    <h6>Time: {(item.time/ 10).toFixed(2)} seconds</h6>
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