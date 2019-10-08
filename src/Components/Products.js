import React, { Component } from 'react'
import axios from "../Utils/axios"
import storage from 'local-storage'
import {
    Container, Button, Row, Col, Input, InputGroup, Form,
    Modal, ModalHeader, ModalBody, FormGroup, Label,
    DropdownToggle, DropdownMenu, InputGroupButtonDropdown,
    DropdownItem, Pagination, PaginationItem, PaginationLink, ModalFooter
} from 'reactstrap'

import { FaCartArrowDown } from 'react-icons/fa'
import ProductsCard from './ProductCard'
import ProductsCart from './ProductCart'
import '../asset/productscreen.css'


class ContainerProducts extends Component {
    constructor(props) {
        super(props)

        this.toggleDropDown = this.toggleDropDown.bind(this);
        this.toggleCheckout = this.toggleCheckout.bind(this);
        this.toggleDropDownSortType = this.toggleDropDownSortType.bind(this);
        this.state = {
            products: [],
            cart: [],
            dropdownOpen: false,
            dropdownOpenSortType: false,
            splitButtonOpen: false,
            modalCheckout: false,
            search: '',
            sort: 'id',
            limit: '6',
            page: '1',
            sorttype: 'asc',
            allPage: [],
            totalPrice: 0,
            category: [],
            productEdit: {},
        }
    }

    async componentDidMount() {
        await this.getAll()
        this.getAllCategory()
    }

    searchValue(e) {
        let value = e.target.value
        setTimeout(() => {
            console.log(value)
            this.setState({ search: value })
            this.getAll()
        }, 1000)
    }

    sortType = async (value) => {
        await this.setState({ sorttype: value })
        this.getAll()
    }

    sortProduct = async (value) => {
        await this.setState({ sort: value })
        this.getAll()
    }

    pageChange = async (page) => {
        await this.setState({ page: page })
        this.getAll()
    }

    getAll = async () => {
        const { search, sort, sorttype, limit, page } = this.state
        await axios.get(`/product?search=${search}&sort=${sort}&sorttype=${sorttype}&limit=${limit}&page=${page}`)
            .then(result => {
                let page = []
                this.setState({ products: result.data.result })
                const currentAllpage = Math.ceil(result.data.totalData / this.state.limit)

                for (let i = 0; i < currentAllpage; i++) {
                    page.push(i + 1)
                }

                this.setState({ allPage: page })
            })
            .catch(err => {
                console.log(err)
            })
        console.log(this.state.products)
        console.log(storage.get('token'))
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

    deleteProduct(id) {
        axios.delete("/product/" + id)
        console.log(id)
        this.getAll()
    }

    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    toggleCheckout() {
        this.setState(prevState => ({
            modalCheckout: !prevState.modalCheckout
        }));
        console.log(this.state.modalCheckout)
    }

    handleSubmit = async (event) => {
        event.preventDefault()

        const data = new FormData(event.target)

        fetch('http://localhost:3020/product',
            {
                method: "POST",
                body: data
            }
        )
            .then(result => {
                console.log("success")
            })
            .catch(err => {
                console.log(err.response)
            })
        this.toggle()
        window.location.href = "/"
    }


    addToCart(product) {
        const istoken = storage.get('token')
        if (!istoken || istoken === undefined) {
            alert("Sorry, You need to login first")
        } else {
            const exist = this.state.cart.find(({ id }) => id === product.id)
            if (exist) {
                const index = this.state.cart.findIndex(productCart => productCart.id === product.id)
                console.log(index)
                var cart = [...this.state.cart]
                cart[index].count++
                cart[index].totalPrice = cart[index].count * cart[index].price
                const totalPrice = this.state.totalPrice + product.price
                this.setState({ cart, totalPrice })
            } else {
                const productWithCountPrice = { ...product, count: 1, totalPrice: product.price }
                const totalPrice = this.state.totalPrice + product.price
                this.setState({ cart: [...this.state.cart, productWithCountPrice], totalPrice })
            }
            console.log(this.state.cart)
        }
    }

    async reduceCart(product) {
        const index = this.state.cart.findIndex(productCart => productCart.id === product.id)
        let cart = [...this.state.cart]
        if (cart[index].count > 1) {
            const totalPrice = this.state.totalPrice - product.price
            cart[index].count--
            this.setState({ cart, totalPrice })
            console.log(this.state.cart)
        } else {
            const totalPrice = this.state.totalPrice - product.price
            const id = cart[index].id
            this.setState({ cart: this.state.cart.filter(cart => cart.id !== id), totalPrice })
        }
    }

    deleteCart(product) {
        const index = this.state.cart.findIndex(productCart => productCart.id === product.id)
        const cart = [...this.state.cart]
        const id = cart[index].id
        const totalPrice = this.state.totalPrice - product.price * cart[index].count
        this.setState({ cart: this.state.cart.filter(cart => cart.id !== id), totalPrice })
    }

    cancelCart(e) {
        e.preventDefault()
        if (window.confirm("Are you sure cancel all cart ?")) {
            this.setState({ cart: [], totalPrice: 0 })
        }
    }

    toggleDropDown() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    toggleDropDownSortType() {
        this.setState({
            dropdownOpenSortType: !this.state.dropdownOpenSortType
        });
    }


    render() {
        let productCard = this.state.products.map(product => {
            return (
                <Col sm="4" key={product.id}>
                    <ProductsCard addToCart={(id) => this.addToCart(id)} deleteProduct={(id) => this.deleteProduct(id)} products={product} />
                </Col>
            )
        })

        let productInCart = this.state.cart.map(product => {
            return (
                <Row>
                    <Col key={product.id} className="productInCart">
                        <ProductsCart addToCart={(id) => this.addToCart(id)} reduceCart={(id) => this.reduceCart(id)} deleteCart={(id) => this.deleteCart(id)} products={product} />
                    </Col>
                </Row>
            )
        })

        let productCheckout = this.state.cart.map(product => {
            return (
                <Row className='productInCheckout'>
                    <Col key={product.id} xs='7'>
                        {product.name}
                    </Col>
                    <Col xs='1'>
                        {product.count}X
                    </Col>
                    <Col xs='1'>
                        Rp.
                    </Col>
                    <Col xs='3' className='text-right' >
                        {product.price * product.count}
                    </Col>
                </Row>
            )
        })

        return (
            <Container className="container" fluid>
                <Row>
                    <Col sm="9">

                        <InputGroup>
                        {/* Input Search */}
                            <Input type="text" placeholder="&#xF002; Search" className="inputSearch" onChange={(e) => this.searchValue(e)} />
                            <InputGroupButtonDropdown className="mr-1 ml-1" addonType="append" isOpen={this.state.dropdownOpenSortType} toggle={this.toggleDropDownSortType}>
                                <DropdownToggle caret>
                                    {this.state.sorttype}
                                </DropdownToggle>
                            {/* Sort Type */}
                                <DropdownMenu>
                                    <DropdownItem onClick={() => this.sortType("asc")}>ASC</DropdownItem>
                                    <DropdownItem onClick={() => this.sortType("desc")}>DESC</DropdownItem>
                                </DropdownMenu>
                            </InputGroupButtonDropdown>
                            {/* Sort By */}
                            <InputGroupButtonDropdown addonType="append" isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown}>
                                <DropdownToggle caret>
                                    Sort By
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem onClick={() => this.sortProduct("name")}>Name</DropdownItem>
                                    <DropdownItem onClick={() => this.sortProduct("price")}>Price</DropdownItem>
                                    <DropdownItem onClick={() => this.sortProduct("date_update")}>Date Updated</DropdownItem>
                                </DropdownMenu>
                            </InputGroupButtonDropdown>
                        </InputGroup>

                    </Col>
                    <Col sm="3">
                        <h2 className="cartTitle"><FaCartArrowDown /> CART</h2>
                    </Col>
                </Row>
                <Row>
                    <Col sm="9" >
                        <Row className="mb-5">
                            {productCard}
                        </Row>

                    </Col>
                    <Col sm="3" className={this.state.cart.length === 0 ? "emptyCart" : ""} >
                        {productInCart}
                    </Col>
                </Row>

                <Row className="fixed-bottom">
                    <Col sm="9" className="nav justify-conten-center mt-4 pt-3 bg-white">
                        <Pagination className="m-auto" aria-label="Page navigation example">
                            {
                                this.state.allPage.map(item => (
                                    <PaginationItem key={item}>
                                        <PaginationLink onClick={() => this.pageChange(item)}>
                                            {item}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))
                            }
                        </Pagination>
                    </Col>
                    <Col sm="3">
                        <span className='text-right'>Total Price: Rp. {this.state.totalPrice} </span>
                        <Button color="success" size="sm" onClick={this.toggleCheckout} block>Checkout</Button>
                        <Button color="danger" size="sm" onClick={(e) => this.cancelCart(e)} block>Cancel</Button>
                    </Col>
                </Row>

                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} >
                    <ModalHeader>Edit Product</ModalHeader>
                    <ModalBody>
                        <Form method="POST" onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <Label for="name">Product Name</Label>
                                <Input type="name" name="name" id="name" placeholder="Name" value={this.state.productEdit.name} onChange={(e) => this.handleChange(e)} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="price">Price</Label>
                                <Input type="number" name="price" id="price" placeholder="Price" value={this.state.productEdit.price} />
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
                                <Input type="textarea" name="description" id="description" value={this.state.productEdit.description} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="quantity">Quantity</Label>
                                <Input type="number" name="quantity" id="quantity" placeholder="Quantity" value={this.state.productEdit.quantity} />
                            </FormGroup>
                            <Button color="primary">Add Product</Button>
                        </Form>
                    </ModalBody>
                </Modal>

                {/* modal Checkout */}

                <Modal isOpen={this.state.modalCheckout} className={this.props.className}>
                    <ModalHeader toggleCheckout={this.toggleCheckout}>Check Out</ModalHeader>
                    <ModalBody>
                        {productCheckout}
                        Total Price Rp. {this.state.totalPrice}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" >Do Something</Button>{' '}
                        <Button color="secondary" onClick={this.toggleCheckout}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </Container>
        )

    }

}

export default ContainerProducts