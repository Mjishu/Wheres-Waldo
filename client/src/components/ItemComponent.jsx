
function ItemComponent(props) {
  return (
    <div className="item-component sans-dm">
        <img src={props.image} alt={props.name} />
        <h3 className={props.spotted ? "spotted" : ""}>{props.name}</h3>
    </div>
  )
}

export default ItemComponent