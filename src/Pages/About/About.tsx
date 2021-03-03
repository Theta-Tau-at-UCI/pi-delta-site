import React, { Fragment } from "react";
import "./About.css"
import Pillar from "./Pillar";
import tt_logo from "../../Media/tt-logo.png";
import Image from 'react-bootstrap/Image';
import Footer from '../../SharedComponents/Footer/Footer'
import { PieChart } from 'react-minimal-pie-chart';

export default class About extends React.Component<{}, {}> {
    constructor(props: {}) {
        super(props);
    }
    
    render() {
        return (
            <Fragment>
                <div id="body">
                    <div className="section">

                        <div className="section-title">Our Chapter: Pi Delta</div>
                        <div className="info">
                            In the winter of 2011, Alex Staebler, Arshitha Vaidhyanathan, and Jonathan Wong sought out to create greater opportunities for professional development and networking at UCI for future engineers. Shortly after reaching out to Theta Tau’s Central Office, nine others joined them to form the founding class: Clever Tan, Jacqueline Kim, Sarah Leung, Terence Leung, Amy Nguyen, Christopher Louie, Dhivya Sridhar, Jeffrey Go, and Jonathan Turcios. After creating a constitution and pledge process, the founding fathers welcomed 20 pledges the following fall: the Alpha class. On April 14, 2013, the UCI colony was installed as the Pi Delta Chapter of Theta Tau and has only continued to grow since, now with over 200 active members and alumni.
                        </div>
                        <div className="container">
                            <div className="row">
                                <div className="col-sm">
                                    <PieChart
                                        data={[
                                            { title: 'One', value: 10, color: '#E38627' },
                                            { title: 'Two', value: 15, color: '#C13C37' },
                                            { title: 'Three', value: 20, color: '#6A2135' },
                                        ]}
                                    />
                                </div>
                                <div className="col-sm">



                                    <PieChart
                                        data={[
                                            { title: 'One', value: 10, color: '#E38627' },
                                            { title: 'Two', value: 15, color: '#C13C37' },
                                            { title: 'Three', value: 20, color: '#6A2135' },
                                        ]}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="section">
                        <Pillar
                            value="Brotherhood"
                            img={tt_logo}
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

                    <div className="section">
                        <div className="section-title">Theta Tau</div>
                        <div className="info">
                            Founded in 1904 at the University of Minnesota in Minneapolis, Theta Tau
                            is the oldest, largest, and foremost Fraternity for Engineers. Today,
                            Theta Tau proudly has a diverse membership of men and women studying
                            engineering at more than 80 campuses across the US. “Whatsoever thy hand findeth to do, do it with thy might;…” –Ecclesiastes 9:10
                        </div>

                        <div className="section-title">Other Chapters in Our Region</div>
                        Map Placeholder
                    </div>
                </div>
                <Footer/>
            </Fragment>
        );
    }
}
