function Clicked(props) {
  // console.log(`id: ${props.id} | seen: ${props.isSeen}`);

  return (
      <button className={`item-holder ${props.className}`} onClick={() => props.handleSubmit(props.id)}>
          <img className="find-image" src={props.image} alt={props.alt} />
          <h5 className="find-name">{props.name}</h5>
      </button>
  );
}

export default Clicked;