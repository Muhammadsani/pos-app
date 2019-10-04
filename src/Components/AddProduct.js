import React from 'react';
import { Button, Form, FormGroup, Label, Input,  Row, Col } from 'reactstrap';
import axios from "../Utils/axios"

export default class Example extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      category: [],
    }
  }

  componentDidMount = async () => {
    await this.getAllCategory()
  }

  getAllCategory = async () => {
    await axios.get("/categories")
      .then(result => {
        this.setState({ category: result.data.result })
      })
      .catch(err => {
        console.log(err)
      })
    console.log(this.state.category)
  }



  render() {
    return (
      <Row>
        <Col sm="9">
          <Form method="POST" onSubmit={this.handleSubmit}>
            <FormGroup>
              <Label for="name">Product Name</Label>
              <Input type="email" name="email" id="name" placeholder="Name" />
            </FormGroup>
            <FormGroup>
              <Label for="price">Price</Label>
              <Input type="number" name="price" id="price" placeholder="Price" />
            </FormGroup>
            <FormGroup>
              <Label for="image">File Image</Label>
              <Input type="file" name="image" id="image" />
            </FormGroup>
            <FormGroup>
              <Label for="category">Category</Label>
              <Input type="select" name="category" id="category">
                {this.state.category.map(item => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input type="textarea" name="description" id="description" />
            </FormGroup>
            <FormGroup>
              <Label for="quantity">Quantity</Label>
              <Input type="number" name="quantity" id="quantity" placeholder="Quantity" />
            </FormGroup>
            <Button>Add Product</Button>
          </Form>
        </Col>
        <Col sm="3">
        </Col>
      </Row>

    );
  }
}
