export function ProductsList(props) {
  const products = props.products;
  
  return (
    <div className="products-container">
      <h2>Celkem produktů: {products?.length}</h2>
      <div className="products-wrapper">
        <ul>
          {products?.map((item, i) => (
            <li key={i}>
              <h4>{item.name}</h4>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}