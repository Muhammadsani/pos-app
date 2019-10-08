import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Products from './Screens/Products'
import login from './Screens/Login'
import AddProduct from './Components/AddProduct'
import UpdateProduct from './Components/UpdateProduct'

function App() {
  return (
    <div>
      <Router>
          <Route exact path={'/'} component = {Products} />
          <Route  path={'/login'} component = {login} />
          <Route  path={'/addproduct'} component = {AddProduct} />
          <Route  path={'/updateproduct/:id'} component = {UpdateProduct} />
        </Router>
    </div>
  );
}

export default App;
