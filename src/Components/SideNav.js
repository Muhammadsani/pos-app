import React, { Component } from 'react'
import { FaHome, FaClipboard, FaBars, FaPlusSquare, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa'
import axios from "../Utils/axios"
import '../asset/SideNav.css'
import { Link, Redirect } from 'react-router-dom'
import storage from 'local-storage'
import { Button, Modal, ModalHeader, ModalBody, FormGroup, Label, Input, Form } from 'reactstrap';

class SideNav extends Component {
    constructor(props) {
        super(props)
        this.toggle = this.toggle.bind(this);
        this.state = {
            width: "67px",
            currentNav: "open",
            redirect: false,
            category: [],
            modal: false
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


    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    onChange = (state) => {
        // this.state.currentNav = state
        this.setState({
            currentNav: (state === "open" ? "close" : "open")
        })

        console.log(this.state.currentNav)

        if (state === "open") {
            this.openNav()
        } else {
            this.closeNav()
        }
    }

    openNav() {
        this.setState({ width: "250px" })
    }

    closeNav() {
        this.setState({ width: "70px" })
    }

    logout() {
        storage.remove('token')
        window.location.href = "/"
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
            window.location.href = "/"
        })
        .catch(err => {
            console.log(err.response)
        })
        this.toggle()
    }

    render() {
        const { redirect } = this.state;

        if (redirect) {
            return <Redirect to='/' />;
        }
        return (
            <div>
                <div id="mySidebar" className="sidebar" style={{ width: this.state.width }} >
                    <button id="btnNav" className="closebtn" onClick={() => this.onChange(this.state.currentNav)}><FaBars /></button>

                    <Link to="/" className="sidemenu" ><FaHome /></Link>
                    <Link to="/history" className="sidemenu" ><FaClipboard /></Link>
                    <Button className="btnside" onClick={this.toggle}><FaPlusSquare /></Button>
                    {(storage.get('token') ? <Button className="btnside" onClick={() => this.logout()}><FaSignOutAlt /></Button> : <Link to="/login" className="sidemenu" ><FaSignInAlt /></Link>)}

                    <div>
                        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} >
                            <ModalHeader>Modal title</ModalHeader>
                            <ModalBody>
                                <Form method="POST" onSubmit={this.handleSubmit}>
                                    <FormGroup>
                                        <Label for="name">Product Name</Label>
                                        <Input type="text" name="name" id="name" placeholder="Name" />
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
                                    <Button color="primary">Add Product</Button>
                                </Form>
                            </ModalBody>
                        </Modal>
                    </div>
                </div>
            </div>
        );
    }

};

export default SideNav;