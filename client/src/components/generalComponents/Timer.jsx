import React from 'react'

function Timer(props) {
    let startTime = props.timer;
    let elapsedTime = 0;
    let currentTime = 0;
    let paused = true;
    let intervalId;

    if(paused){
        paused =false;
        
    }


  return (
    <div>Timer</div>
  )
}

export default Timer