import React from 'react'

function Timer(props) { 
    React.useEffect(()=>{
      let intervalId
      if(props.running){
        intervalId = setInterval(() => props.setInfo(prevInfo => ({...prevInfo, timer: prevInfo.timer + 1})), 100)
      }
      return () => clearInterval(intervalId)
    },[props.running])

    const seconds = (props.timer/10).toFixed(2) 

  return (
    <div>{seconds}seconds</div>
  )
}

export default Timer