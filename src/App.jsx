import { useState, useEffect } from "react";
import { ProductsList } from "./components/ProductsList";
import { ProductsPartsList } from "./components/ProductsPartsList";
import jsZip from "jszip";

function App() {
  //const url = 'https://www.retailys.cz/wp-content/uploads/astra_export_xml.zip'; /* Blocked by CORS? */
  const url = '/data/astra_export_xml.zip'; // zip file from public folder
  const [xmlDoc, setXmlDoc] = useState(undefined);
  const [product, setProduct] = useState([]);
  const [part, setPart] = useState([]);
  const [isShown, setIsShown] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    getZIPFileData(); 
  },[]);

  useEffect(() => {
    if(xmlDoc!=undefined) {
      getAllProducts(xmlDoc);
    }
  }, [xmlDoc])

  // fetch zip file
  const getZIPFileData = () => {
    setIsLoading(true);
    setMsg('Probíhá stahování souboru');

    fetch(url).then(res => res.blob()).then(file => {
      // unzip file
      var unZip = new jsZip();
      unZip.loadAsync(file).then((zip) => {
        Object.keys(zip.files).forEach((filename) => {
          zip.files[filename].async('text').then(function (data) {
            data = data.trim();
            const xml = new DOMParser().parseFromString(data, "text/xml");
            const tagObj = xml.querySelectorAll('items > item');
            
            if(tagObj) {
              setXmlDoc(tagObj);
              setIsLoading(false);
            }
          })
        })
      })
    }).catch(() => {
        setIsLoading(false)
        alert("Failed to download file!");
    });
  };

  const getAllProducts = (tagObj) => {
    setMsg('Probíhá načtení všech produktů');
    setIsLoading(true);
    let products = [];

    for (let i = 0; i < tagObj.length; i++) {
      let productName = tagObj[i].getAttribute('name');
      if(productName != undefined)
        products.push({name: productName});
      else return
    }
    setProduct(products);
    setIsLoading(false);
  }

  const getAllProductsParts = (tagObj) => {
    handleClick();
    setMsg('Probíhá načítaní produktů s náhradními díly');
    setIsLoading(true);
    var productsParts = []; 

    if(tagObj!=undefined) {
      for (let i = 0; i < tagObj.length; i++) {
        let productName = tagObj[i].getAttribute('name');
        let part = tagObj[i].querySelectorAll('part');
  
        if(part.length > 0) {
          for (let j = 0; j < part.length; j++) {
            if(part[j].getAttribute('categoryId') == 1) {
              const parts = Object.values(part[j].getElementsByTagName('item'));
              const partName = parts.map((item) => {
                return {code: item.getAttribute('code'), item: item.getAttribute('name')};
              })
              productsParts.push({product: productName, parts: partName });
            }
          }
        }
      }
      setPart(productsParts);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      alert('Failed to load xml data');
    }
  }

  const handleClick = () => {
    setIsShown(current => !current);
  };
  
  return (
    <div className="app">
      <header className="app-header container">
        <nav>
          <ul>
            <li onClick={handleClick}><a href="#"><h4>Seznam produktů</h4></a></li>
            <li onClick={() => getAllProductsParts(xmlDoc)}><a href="#"><h4>Seznam náhradních dílů</h4></a></li>
          </ul>
        </nav>
      </header>
      <main>
        {isLoading &&
          <div className="container">
            <h2>{msg}</h2>
            <p>{isLoading}</p>
          </div>
        }

        <div className="container">
          {isShown ?
            <ProductsList products={product}/> :
            <ProductsPartsList parts={part}/>
          }
        </div>
      </main>
    </div>
  )
}
export default App