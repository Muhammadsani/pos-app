import React, { Component } from 'react'
import axios from "../Utils/axios"
import storage from 'local-storage'
import {
    Container, Button, Row, Col, Input, InputGroup,
    Modal, ModalHeader, ModalBody,
    DropdownToggle, DropdownMenu, InputGroupButtonDropdown,
    DropdownItem, Pagination, PaginationItem, PaginationLink, ModalFooter
} from 'reactstrap'

import { FaCartArrowDown } from 'react-icons/fa'
import ProductsCard from './ProductCard'
import ProductsCart from './ProductCart'
import '../asset/productscreen.css'

import { connect } from 'react-redux'
import { getproducts } from "../Public/Redux/Actions/GetProduct";

const rupiah = require('rupiah-format')

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
        const tes = await getproducts(search, sort, sorttype, limit, page)
        this.props.dispatch(tes)
        console.log(this.props)
        let allpage = []
        const currentAllpage = Math.ceil(this.props.data.totalData / this.state.limit)
        for (let i = 0; i < currentAllpage; i++) {
            allpage.push(i + 1)
        }
        this.setState({ allPage: allpage })
        // await axios.get(`/product?search=${search}&sort=${sort}&sorttype=${sorttype}&limit=${limit}&page=${page}`)
        //     .then(result => {
        //         this.setState({ products: result.data.result })


        //     })
        //     .catch(err => {
        //         console.log(err)
        //     })
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

    deleteProduct = async (id) => {
        if (window.confirm('Are you sure want to delete this product?')) {

            await axios.delete("/product/" + id)
                .then(result => {
                    console.log(id)
                    this.getAll()
                })
                .catch(error => {
                    console.log(error.response.data.message)
                    alert(error.response.data.message)
                });

        }
    }

    toggleCheckout() {
        this.setState(prevState => ({
            modalCheckout: !prevState.modalCheckout
        }));
        if (!this.state.modalCheckout) {
            this.checkoutProduct()
        } else {
            this.setState({ cart: [], totalPrice: 0 })
            this.getAll()

        }
    }

    checkoutProduct = () => {
        let order = { order: this.state.cart, totalPrice: this.state.totalPrice }
        console.log(order)
        axios.post('/product/order', order)
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
                if (cart[index].count < cart[index].quantity) {
                    cart[index].count++
                    cart[index].totalPrice = cart[index].count * cart[index].price
                    const totalPrice = this.state.totalPrice + product.price
                    this.setState({ cart, totalPrice })
                } else {
                    alert("Sorry, stoctout!")
                }
            } else {
                if (product.quantity > 0) {
                    const productWithCountPrice = { ...product, count: 1, totalPrice: product.price, user: storage.get('email')}
                    const totalPrice = this.state.totalPrice + product.price
                    this.setState({ cart: [...this.state.cart, productWithCountPrice], totalPrice })
                } else {
                    alert("Sorry, stoctout!")
                }
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
        let productCard = this.props.data.products.map(product => {
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
                <Row className='border-bottom'>
                    <Col key={product.id} xs='7'>
                        {product.name}
                    </Col>
                    <Col xs='1'>
                        {product.count}X
                    </Col>
                    <Col xs='4' className='text-right' >
                        {rupiah.convert(product.price * product.count)}
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
                        <Row className="mb-5 pb-5">
                            {productCard}
                        </Row>

                    </Col>
                    <Col sm="3" className={this.state.cart.length === 0 ? "emptyCart" : ""} >
                        {productInCart}
                    </Col>
                </Row>

                <Row className="fixed-bottom mr-4 ml-5">
                    <Col sm='1'></Col>
                    <Col sm="8" className="nav justify-conten-center mt-4 pt-3 bg-white">
                        <Pagination className="m-auto" aria-label="Page navigation example">
                            {
                                this.state.allPage.map(item => (
                                    <PaginationItem key={item} active={item===this.state.page? true: false}> 
                                        <PaginationLink className={item===this.state.page? "font-weight-bold pageselect": "font-weight-bold" }  onClick={() => this.pageChange(item)}>
                                            {item}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))
                            }
                        </Pagination>
                    </Col>
                    <Col sm="3" className="pr-4" >
                        <Row>
                            <Col className='text-left'> Total Price:</Col>
                            <Col className='text-right'> {rupiah.convert(this.state.totalPrice)}</Col>
                        </Row>
                        <Row className='pl-2'>
                            <Button color="success" size="sm" onClick={this.toggleCheckout} block>Checkout</Button>
                            <Button color="danger" size="sm" onClick={(e) => this.cancelCart(e)} block>Cancel</Button>
                        </Row>
                    </Col>
                </Row>

                {/* modal Checkout */}

                <Modal isOpen={this.state.modalCheckout} className={this.props.className}>
                    <ModalHeader toggleCheckout={this.toggleCheckout}>Check Out</ModalHeader>
                    <ModalBody>
                        {productCheckout}
                        <Row className='font-weight-bold'>
                            <Col xs='8'>
                                Total Price
                            </Col>
                            <Col xs='4' className='text-right' >
                                {rupiah.convert(this.state.totalPrice)}
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.toggleCheckout}>OK</Button>
                    </ModalFooter>
                </Modal>
            </Container>
        )

    }

}
const mapStateToProps = state => {
    console.log(state.ProductsList)
    return {
        data: state.ProductsList,
    }
}

export default connect(mapStateToProps)(ContainerProducts)