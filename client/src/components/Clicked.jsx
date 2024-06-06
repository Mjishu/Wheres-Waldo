// import React from 'react'

function Clicked(props) {
  return (
        <div className="item-holder">
            <button>
                <img className="find-image" src={props.image} alt={props.alt} />
                <h5 className="find-name">{props.name}</h5>
            </button>
        </div>
  )
}

export default Clicked