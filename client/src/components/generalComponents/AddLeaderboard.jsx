// import React from 'react'

function AddLeaderboard(props) {
  return (
    <div className="add-leaderboard">
        <h4>Add to Leaderboard</h4>
        <label htmlFor="username">Username: </label>
        <input type="text" name='username' id='username' value={props.username} onChange={props.handleChange}/>
        <p>Your time was {(props.time/10).toFixed(2)} seconds</p>
        <div className="leaderboard-buttons">
            <button onClick={props.playAgain}>Play Again</button>
            <button onClick={props.handleSubmit}>Submit</button>
        </div>
    </div>
  )
}

export default AddLeaderboard