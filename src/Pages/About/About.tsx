import React, { Fragment } from "react";
import {Container, Col, Row, Button} from "react-bootstrap";
import "./About.css"
import Pillar from "./Pillar";
import tt_logo from "../../Media/tt-logo.png";
import brotherhood from "../../Media/brotherhood.jpg"
import Image from 'react-bootstrap/Image';
import Footer from '../../SharedComponents/Footer/Footer'
import { PieChart } from 'react-minimal-pie-chart';
import MajorChart from "./MajorChart";
import GenderChart from "./GenderChart"

export default class About extends React.Component<{}, {}> {
    constructor(props: {}) {
        super(props);
    }
    
    render() {
        return (
            <Fragment>

                <div id="body">
                    <div className="section">
                        <h1> Theta Tau </h1>
                        <div className="info">
                            Founded in 1904 at the University of Minnesota in Minneapolis as the Society of Hammer and Tongs by four engineering students,
                            Theta Tau is the oldest, largest, and foremost Fraternity for Engineers.
                            Today, Theta Tau proudly has a diverse membership of men and women studying
                            engineering and computer science at more than 80 campuses across the US.
                        </div>
                        <br/>

                        <div className = "motto">
                            “Whatsoever thy hand findeth to do, do it with thy might…” –Ecclesiastes 9:10
                        </div>
                        <a href = "https://www.thetatau.org"><Button  variant="danger">Learn More</Button></a>

                    </div>
                    <div className="section">

                        <h1> Our Chapter: Pi Delta </h1>
                        <div className="info">
                            In the winter of 2011, Alex Staebler, Arshitha Vaidhyanathan, and Jonathan Wong sought out to create greater opportunities for professional development and networking at UCI for future engineers. Shortly after reaching out to Theta Tau’s Central Office, nine others joined them to form the founding class: Clever Tan, Jacqueline Kim, Sarah Leung, Terence Leung, Amy Nguyen, Christopher Louie, Dhivya Sridhar, Jeffrey Go, and Jonathan Turcios. After creating a constitution and pledge process, the founding fathers welcomed 20 pledges the following fall: the Alpha class. On April 14, 2013, the UCI colony was installed as the Pi Delta Chapter of Theta Tau and has only continued to grow since, now with over 200 active members and alumni.
                        </div>
                        <div className="container">
                            <div className="row">
                                <div className="col-sm">
                                    <MajorChart/>
                                </div>
                                <div className="col-sm">
                                    <GenderChart/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="section">
                        <Pillar
                            value="Brotherhood"
                            img={brotherhood}
                            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do 
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim 
                                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo 
                                consequat."
                        />
                        <Pillar
                            value="Professionalism"
                            img={tt_logo}
                            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do 
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim 
                                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo 
                                consequat."
                        />
                        <Pillar
                            value="Service"
                            img={tt_logo}
                            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do 
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim 
                                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo 
                                consequat."
                        />
                    </div>

                    <div className = "section">
                        <h1> Other Chapters in Our Region </h1>
                        <div>
                        Pi Delta is a part of the Western Region of Theta Tau. Here are the
                        other chapters and colonies in our region if you would like to learn about them.
                        </div>

                        <Container>
                            <Row>
                                <Col>1 of 2</Col>
                                <Col>2 of 2</Col>
                            </Row>
                            <Row>
                                <Col>1 of 3</Col>
                                <Col>2 of 3</Col>

                            </Row>
                        </Container>

                    </div>
                </div>
                <Footer/>
            </Fragment>
        );
    }
}
