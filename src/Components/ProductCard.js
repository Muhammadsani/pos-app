import React, { Component } from 'react'
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button
} from 'reactstrap';
import { Link } from 'react-router-dom'
import { FaEraser, FaEdit } from 'react-icons/fa'
const rupiah = require('rupiah-format')


class ProductCard extends Component {
    render() {
        return (
            <div>
                <Card style={{marginTop: '5px'}}>
                    <CardImg top width="100%" src={"http://localhost:3020/img/" + this.props.products.image} alt="Card image cap" />
                    <CardBody>
                        <CardTitle style={{fontWeight:"bold"}} title={this.props.products.name} >{this.props.products.name.length<25 ? this.props.products.name : this.props.products.name.substring(0,24)+"..." }</CardTitle>
                        <CardSubtitle>{rupiah.convert(this.props.products.price)}</CardSubtitle>
                        <CardText title={this.props.products.description}>{this.props.products.description.length<47 ? this.props.products.description : this.props.products.description.substring(0,47)+"..."}</CardText>
                        <CardText> <small className="text-muted"> Stock: {this.props.products.quantity} </small> </CardText>
                        <div fontWeight="light"></div>
                        <Button color="success" onClick={() => this.props.addToCart(this.props.products)}>Add to Cart</Button>
                        <Button color="danger" className="mr-2 ml-2" onClick={() => this.props.deleteProduct(this.props.products.id)}><FaEraser /></Button>
                        <Link to={"/updateproduct/"+ this.props.products.id} className="btn btn-primary"><FaEdit /></Link>

                        
                        
                    </CardBody>

                </Card>
            </div>
        );
    }

};

export default ProductCard;