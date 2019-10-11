import React, { Component } from 'react'
import axios from "../Utils/axios"
import { Row, Col, Table, Form, FormGroup, Label, Input, Pagination, PaginationItem, PaginationLink } from 'reactstrap'
import Moment from 'react-moment';
import { Line } from "react-chartjs-2";
import '../asset/History.css'
import 'moment-timezone';
const rupiah = require('rupiah-format')

class History extends Component {
    constructor(props) {
        super(props)
        this.state = {
            order: [],
            orderItem: [],
            receiptNo: '',
            year: 0,
            month: 0,
            orderInWeek: 0,
            orderLastWeek: 0,
            totalOrder: 0,
            incomeToday: 0,
            incomeyesterday:0,
            incomeInYear: 0,
            orderBy: 'day',
            chart: [],
            page: '1',
            allPage: [],

        }
    }

    async componentDidMount() {
        await this.setState({ year: new Date().getFullYear() })
        await this.setState({ month: new Date().getMonth() + 1 })
        this.getOrder()
        this.getOrderItemAll()
        this.getIncomeToday()
        this.getRevenue()
        this.getIncomeinYear()
        this.getOrderInWeek()
        this.getOrderLastWeek()

        console.log(this.state.month)
    }

    getOrder = async () => {
        await axios.get(`/product/order?month=${this.state.month}&year=${this.state.year}&page=${this.state.page}`)
            .then(result => {
                this.setState({ order: result.data.result })
                console.log(result.data.totalData)

                let allpage = []
                const currentAllpage = Math.ceil(result.data.totalData / 20)
                for (let i = 0; i < currentAllpage; i++) {
                    allpage.push(i + 1)
                }
                this.setState({ allPage: allpage })
                
            })
            .catch(err => {
                console.log(err)
            })

    }
    
    pageChange = async (page) => {
        await this.setState({ page: page })
        this.getOrder()
    }

    getOrderItemAll = async () => {
        await axios.get(`/product/orderitem`)
            .then(result => {
                this.setState({ orderItem: result.data.result })
            })
            .catch(err => {
                console.log(err)
            })
        console.log(this.state.orderItem)
        let total = 0
        this.state.orderItem.forEach(item => {
            total = total + item.quantity
        })
        this.setState({ totalOrder: total })
    }

    getOrderInWeek= async () => {
        let total = 0
        await axios.get(`/product/getorderinweek`)
            .then(result => {
                result.data.result.forEach(item => {
                    total = total + item.quantity
                })
                this.setState({ orderInWeek: total })
                console.log(this.state.orderInWeek)
            })
            .catch(err => {
                console.log(err)
            })
    }

    getOrderLastWeek= async () => {
        let total = 0
        await axios.get(`/product/getorderlastweek`)
            .then(result => {
                result.data.result.forEach(item => {
                    total = total + item.quantity
                })
                this.setState({ orderLastWeek: total })
                console.log(this.state.orderLastWeek)
            })
            .catch(err => {
                console.log(err)
            })
    }

    getIncomeToday = async () => {
        await axios.get(`/product/getincometoday`)
            .then(result => {
                let incomeToday= result.data.result[0].income?result.data.result[0].income: 0
                this.setState({ incomeToday: incomeToday, incomeyesterday: result.data.result[0].incomeyesterday})
                console.log(result.data.result[0].incomeyesterday)
                console.log(incomeToday)
            })
            .catch(err => {
                console.log(err)
            })

    }

    getIncomeinYear = async () => {
        await axios.get(`/product/getincomeyear`)
            .then(result => {
                this.setState({ incomeInYear: result.data.result[0].income })
            })
            .catch(err => {
                console.log(err)
            })
        console.log(this.state.incomeInYear)

    }


    handleRevenue = async (event) => {
        await this.setState({ orderBy: event.target.value })
        this.getRevenue()
        console.log(event.persist())
    }
    getRevenue = async () => {
        let orderBy = this.state.orderBy
        let label = []
        if (orderBy === 'day') {
            label = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        } else if (orderBy === 'week') {
            label = ['Week 1', 'Week 2', 'Week 3', 'Week 4',]
        } else {
            label = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        }
        await axios.get('/product/revenue?orderBy=' + this.state.orderBy)
            .then(result => {
                this.setState({ chart: result.data.result, label: label })
            })
        console.log(this.state.label)
    }

    render() {
        let income = []
        this.state.chart.forEach(item => {
            income.push(item.income)
        })
        const data = {
            labels: this.state.label,
            datasets: [
                {
                    label: 'My First dataset',
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: income
                }
            ]
        }


        let orderlist = this.state.order.map(item => {
            return (
                <tr sm="4" key={item.id}>
                    <td>#{item.receipt_no}</td>
                    <td>{item.user_id}</td>
                    <td><Moment format="DD MMMM YYYY">{item.created_at}</Moment></td>
                    <td title={item.name_order}>{item.name_order.length < 45 ? item.name_order : item.name_order.substring(0, 45) + "..."}</td>
                    <td align="right">{rupiah.convert(item.total_price)}</td>
                </tr>
            )
        })
        return (
            <div className="mr-4">
                <Row>
                    <Col className="CardCol1">
                        <div className="cardtext">Today's Income
                            <h4>{rupiah.convert(this.state.incomeToday)}</h4>
                            {Math.round(((this.state.incomeToday-this.state.incomeyesterday)/this.state.incomeyesterday)*100)}% Yesterday
                        </div>
                    </Col>
                    <Col className="CardCol2">
                        <div className="cardtext">Orders
                            <h4>{this.state.orderInWeek}</h4>
                            {Math.round(((this.state.orderInWeek-this.state.orderLastWeek)/this.state.orderLastWeek)*100)}% Last Week
                        </div>
                    </Col>
                    <Col className="CardCol3">
                        <div className="cardtext">This Year's Income
                            <h4>{rupiah.convert(this.state.incomeInYear)}</h4>
                        </div>
                    </Col>
                </Row>

                <Row className="recentCard">
                    <Col>
                        <Form>
                            <FormGroup row>
                                <Label for="selectrevenue" sm={10}><h4>Revenue</h4> </Label>
                                <Col sm={2} className="float-right">
                                    <Input type="select" name="selectrevenue" id="selectrevenue" onChange={this.handleRevenue} className="selectYear">
                                        <option value='day'>Daily</option>
                                        <option value='week'>Weekly</option>
                                        <option value='month'>Monthly</option>
                                    </Input>
                                </Col>
                            </FormGroup>
                        </Form>
                    </Col>
                    <Line data={data} />
                </Row>

                <Row className="recentCard mt-5">
                    <Col sm='6'><h4 className="m-2">Recent Order</h4></Col>
                    <Col sm="6" className="nav justify-content-end">
                        <Pagination aria-label="Page navigation example">
                            {
                                this.state.allPage.map(item => (
                                    <PaginationItem key={item} active={item===this.state.page? true: false}> 
                                        <PaginationLink className="font-weight-bold"   onClick={() => this.pageChange(item)}>
                                            {item}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))
                            }
                        </Pagination>
                    </Col>
                    <Table striped>
                        <thead>
                            <tr>
                                <th>INVOICES</th>
                                <th>USER</th>
                                <th>DATE</th>
                                <th>ORDER</th>
                                <th align="right">AMOUNT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderlist}
                        </tbody>
                    </Table>
                </Row>

            </div>
        );
    }

};

export default History;