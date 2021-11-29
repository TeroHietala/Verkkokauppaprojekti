import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
import { Switch, Route, useLocation } from 'react-router-dom'
import Home from './Home';
import Products from './inc/Products';
import Discount from './inc/Discount';
import NotFound from './inc/Notfound';
import ContactUs from './inc/ContactUs';
import Register from './inc/register';
import Navbari from './inc/Navbar';
import Header from './inc/Header';
import Footer from './inc/Footer';
import Order from './inc/Order';
import GDPR from './inc/GDPR';
import Maksutavat from './inc/Maksutavat';
import Takuu from './inc/Takuu';
import Toimitusehdot from './inc/Toimitusehdot';
import Login from './inc/Login';

const URL = 'http://localhost/verkkokauppa/';

function App() {
  const [category, setCategory] = useState(null); //tuote kategoriat
  //const [searchPharse, setSearchPharse] = useState('')
  const [cart, setCart] = useState([]); //shopping cart
  const [discount, setDiscount] = useState([]);

  let location = useLocation();

  useEffect(() => {
    if ('cart' in localStorage) {
      setCart(JSON.parse(localStorage.getItem('cart')));
    }
  }, [])

  useEffect(() => {
    if (location.state !== undefined) {
      setCategory({ id: location.state.id, name: location.state.name });
    }
  }, [location.state])


  // LISÄÄ OSTOSKORIIN
  function addToCart(product) {
    if (cart.some(item => item.id === product.id)) {
      const existingProduct = cart.filter(item => item.id === product.id);
      updateAmount(parseInt(existingProduct[0].amount) + 1, product);
    } else {
      product["amount"] = 1;
      const newCart = [...cart, product]; // Create new table
      setCart(newCart); // update state variable.
      localStorage.setItem('Cart', JSON.stringify(newCart));
    }
  }

  // POISTA OSTOSKORISTA
  function removeFromCart(product) {
    const itemsWithoutRemoved = cart.filter(item => item.id !== product.id);
    setCart(itemsWithoutRemoved);
    localStorage.setItem('cart', JSON.stringify(itemsWithoutRemoved));
  }

  function empty() {
    localStorage.clear(cart);
  }


  // MUUTA OSTOSKORIA
  function updateAmount(amount, product) {
    product.amount = amount;
    const index = cart.findIndex((item => item.id === product.id));
    const modifiedCart = Object.assign([...cart],{[index]:product});
    setCart(modifiedCart);
    localStorage.setItem('cart', JSON.stringify(modifiedCart));
  }

  return (
    <>
      <Navbari url={URL} setCategory={setCategory} cart={cart} />
      <Header />
      <div id="content" className="container-fluid">
        <Switch>
          <Route path="/Home" component={Home} />
          <Route
            path="/inc/Products" render={() =>
              <Products
                url={URL}
                category={category}
                addToCart={addToCart}
                cart={cart}
              />
            }
            exact
          />
          <Route path="/inc/Discount" render={() => 
            <Discount 
            url={URL}
            addToCart={addToCart}
            cart={cart}
            />
          }

           />

          <Route path="/inc/Login" component={Login} />
          <Route path="/inc/Register" component={Register} />
          <Route path="/inc/GDPR" component={GDPR} />
          <Route path="/inc/ContactUs" component={ContactUs} />
          <Route path="/inc/Maksutavat" component={Maksutavat} />
          <Route path="/inc/Takuu" component={Takuu} />
          <Route path="/inc/Toimitusehdot" component={Toimitusehdot} />

          <Route
            path="/inc/Order" setCart={setCart} render={() =>
              <Order
                url={URL}
                cart={cart}
                empty={empty}
                removeFromCart={removeFromCart}
                updateAmount={updateAmount}
              />
            }
            exact
          />
          <Route path="/" component={NotFound} />
        </Switch>
      </div>
      <Footer />
    </>
  );

}

export default App;
