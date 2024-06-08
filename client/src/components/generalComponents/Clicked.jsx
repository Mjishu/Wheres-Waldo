// import React from 'react'

function Clicked(props) {
  return (
            <button className={props.isSeen ? "item-holder seen" : "item-holder"}  onClick={() => props.handleSubmit(props.id /* send id when using DB */)}>
                <img className="find-image" src={props.image} alt={props.alt} />
                <h5 className="find-name">{props.name}</h5>
            </button>
  )
}

export default Clicked