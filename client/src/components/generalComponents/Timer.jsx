import React from 'react'

function Timer(props) {
    let startTime = props.timer;
    const[elapsedTime,setElapsedTime] = React.useState();
    // let currentTime = 0;
    let paused = true;
    let intervalId;

    if(paused){
        paused =false;
        startTime - Date.now() - elapsedTime;
        intervalId = setInterval(updateTime,1000)
    }
    if(!paused){
        paused = true;
        setElapsedTime(Date.now() - startTime);
        clearInterval(intervalId)
    }

    function updateTime(){
        setElapsedTime(Date.now() - startTime)
    }
    
    React.useEffect(()=> {console.log(elapsedTime)}, [elapsedTime])

  return (
    <div>Timer</div>
  )
}

export default Timer