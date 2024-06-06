// import React from 'react'

function Clicked(props) {
  return (
            <button className="item-holder"  onClick={() => props.handleSubmit(props.name /* send id when using DB */)}>
                <img className="find-image" src={props.image} alt={props.alt} />
                <h5 className="find-name">{props.name}</h5>
            </button>
  )
}

export default Clicked