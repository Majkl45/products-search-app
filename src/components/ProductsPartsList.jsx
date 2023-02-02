export function ProductsPartsList(props) {
  const parts = props.parts;

  return (
    <div className="products-container">
      <h2>Celkem produktů s náhradními díly: {parts?.length}</h2>
      <div className="products-wrapper">
        <ul>
          {parts?.map((item, index) => (
            <li key={index}>
              <h4>{item.product}</h4>
              <h5>Celkem náhradních dílů: {item.parts.length}</h5>
              {item.parts.map((subitem, index) => {
                return (
                  <ul>
                    <li key={subitem.code}>{subitem.item}</li>
                  </ul>
                );
              })}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}