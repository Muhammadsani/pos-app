import React, { Component } from 'react'
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button
} from 'reactstrap';
import { Link } from 'react-router-dom'
import { FaEraser, FaEdit } from 'react-icons/fa'


class ProductCard extends Component {
    render() {
        return (
            <div>
                <Card style={{marginTop: '5px'}}>
                    <CardImg top width="100%" src={"http://localhost:3020/img/" + this.props.products.image} alt="Card image cap" />
                    <CardBody>
                        <CardTitle style={{fontWeight:"bold"}}>{this.props.products.name}</CardTitle>
                        <CardSubtitle>Rp.{this.props.products.price}</CardSubtitle>
                        <CardText>{this.props.products.description}</CardText>
                        <Button color="success" onClick={() => this.props.addToCart(this.props.products)}>Add to Cart</Button>
                        <Button color="danger" className="mr-2 ml-2" onClick={() => this.props.deleteProduct(this.props.products.id)}><FaEraser /></Button>
                        <Link to={"/updateproduct/"+ this.props.products.id}><FaEdit /></Link>

                        
                        
                    </CardBody>

                </Card>
            </div>
        );
    }

};

export default ProductCard;