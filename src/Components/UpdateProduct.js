import React from 'react';
import { Button, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import axios from "../Utils/axios"

export default class Example extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      categories: [],
      category: 0,
      description: '',
      image: "",
      name: "",
      price: 0,
      quantity: 0,
    }
  }

  componentDidMount = async () => {
    await this.getAllCategory()
    this.getProduct()
    console.log(this.props.match.params.id)
  }

  getAllCategory = async () => {
    await axios.get("/categories")
      .then(result => {
        this.setState({ categories: result.data.result })
      })
      .catch(err => {
        console.log(err)
      })
    console.log(this.state.category)
  }


  getProduct = async () => {
    await axios.get(`/product/${this.props.match.params.id}`)
      .then(result => {
        console.log(result.data.result[0])
        this.setState({
          category: result.data.result[0].category,
          description: result.data.result[0].description,
          image: result.data.result[0].image,
          name: result.data.result[0].name,
          price: result.data.result[0].price,
          quantity: result.data.result[0].quantity,
        })
        console.log(this.state)
      })
      .catch(err => {
        console.log(err)
      })
    //console.log(storage.get('token'))
  }

  handlerChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    this.setState({
      [name]: value
    })
    console.log(this.state.category)
  }

  handlerImage = (event) => {
    if (typeof event.target.files[0] != "undefined") {
      this.setState({
        image: event.target.files[0]
      })
    }
  }

  updateProduct = () => {
    let data = new FormData();
    data.append('name', this.state.name);
    data.append('price', this.state.price);
    data.append('category', this.state.category);
    data.append('description', this.state.description);
    data.append('quantity', this.state.quantity);
    data.append('image', this.state.image);


    axios.patch('/product/' + this.props.match.params.id, data)
      .then(response => {
        console.log(response)
        window.location.href = "/"
      })
      .catch(error => {
        console.log(error.response.data.message)
        alert(error.response.data.message)

      });
  }

  render() {
    return (
      <Row>
        <Col sm="9">
          <FormGroup>
            <Label for="name">Product Name</Label>
            <Input type="text" name="name" id="name" placeholder="Name" value={this.state.name} onChange={(event) => this.handlerChange(event)} />
          </FormGroup>
          <FormGroup>
            <Label for="price">Price</Label>
            <Input type="number" name="price" id="price" placeholder="Price" value={this.state.price} onChange={(event) => this.handlerChange(event)} />
          </FormGroup>
          <FormGroup>
            <Label for="image">File Image</Label>
            <Input type="file" name="image" id="image" onChange={(event) => this.handlerImage(event)} />
          </FormGroup>
          <FormGroup>
            <Label for="category">Category</Label>
            <Input type="select" name="category" id="category" onChange={(event) => this.handlerChange(event)}>
              {this.state.categories.map(item => (
                <option key={item.id} value={item.id} selected={this.state.category === item.id ? true : false}>{item.name}</option>
              ))}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="description">Description</Label>
            <Input type="textarea" name="description" id="description" value={this.state.description} onChange={(event) => this.handlerChange(event)} />
          </FormGroup>
          <FormGroup>
            <Label for="quantity">Quantity</Label>
            <Input type="number" name="quantity" id="quantity" placeholder="Quantity" value={this.state.quantity} onChange={(event) => this.handlerChange(event)} />
          </FormGroup>
          <Button color="success" onClick={() => this.updateProduct()}>Update Product</Button>
        </Col>
        <Col sm="3">
        </Col>
      </Row>

    );
  }
}
