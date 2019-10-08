import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container, Row, Col } from 'reactstrap'
import SideNav from '../Components/SideNav'
import ContainerProducts from '../Components/Products'
import login from '../Screens/Login'
import AddProduct from '../Components/AddProduct'
import UpdateProduct from '../Components/UpdateProduct'

class Products extends Component {
  constructor(props) {
    super()
    this.state = {

    }
  }

  render() {
    return (
      <Container fluid>
        <Router>
          <Row style={{ background: "crimson", color: "white", borderBottom: "3px solid white" }}>
            <Col sm="1" style={{}}>
              <SideNav />
            </Col>
            <Col sm="8">
              <h2 style={{ textAlign: "center", background: "crimson", color: "white" }}>SHOP</h2>
            </Col>
            <Col sm="3">
            </Col>
          </Row>
          <Row>
            <Col sm="1">
            </Col>
            <Col sm="11" >
              <Route path='/' component={ContainerProducts} exact />
              <Route path='/login' component={login} />
              <Route path='/updateproduct/:id' component={UpdateProduct} />
              <Route path='/addproduct' component={AddProduct} />
            </Col>

          </Row>
        </Router>
      </Container>
    )

  }

}

export default Products