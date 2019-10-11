import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Products from './Screens/Products'
import login from './Screens/Login'
import History from './Components/History'
import UpdateProduct from './Components/UpdateProduct'
import { Provider } from "react-redux";
import store from "./Public/Redux/Store"

function App() {
  return (
    <Provider store={store}>
      <div>
        <Router>
          <Route exact path={'/'} component={Products} />
          <Route path={'/login'} component={login} />
          <Route path={'/updateproduct/:id'} component={UpdateProduct} />
          <Route path={'/history'} component={History} />
        </Router>
      </div>
    </Provider>
  );
}

export default App;
