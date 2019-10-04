import React, { Component } from 'react'
import { Media, Button } from 'reactstrap';

class ProductCard extends Component {
    render() {
        return (
            <div>
                <Media style={{margin:"10px"}}>
                    <Media left >
                        <Media object style={{ maxWidth: "60px" }} src={"http://localhost:3020/img/" + this.props.products.image} alt="Generic placeholder image" />
                    </Media>
                    <Media body>
                        <Media style={{ fontWeight: "bold" }}>
                            {this.props.products.name}
                        </Media>
                        Rp.{this.props.products.price}

                        <Media>
                            <Media style={{ fontWeight: "bold" }}>
                                <Button outline color="success" size='sm' onClick={() => this.props.addToCart(this.props.products)}>+</Button>{' '}
                                <span style={{margin: " 0 8px 0 8px"}}> {this.props.products.count} </span>
                                <Button outline color="danger" size='sm' onClick={() => this.props.reduceCart(this.props.products)}>-</Button>{' '}
                                <Button style={{marginLeft:"8px"}} color="danger" size='sm' onClick={() => this.props.deleteCart(this.props.products)}>Delete</Button>
                            </Media>
                        </Media>
                    </Media>
                </Media>
            </div>
        );
    }

};

export default ProductCard;