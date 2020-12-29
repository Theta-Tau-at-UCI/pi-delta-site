import React, { Fragment } from "react";
import "./About.css"
import Pillar from "./Pillar";
import tt_logo from "../../Media/tt-logo.png";
import Image from 'react-bootstrap/Image';
// import Chart from "./Chart";


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
                        <div className="info">Founded in 1904 at the University of Minnesota in Minneapolis, Theta Tau
                            is the oldest, largest, and foremost Fraternity for Engineers. Today,
                            Theta Tau proudly has a diverse membership of men and women studying
                            engineering at more than 80 campuses across the US.
                        </div>
                        <div className="container">
                            <div className="row">
                                <div className="col-sm">
                                    <Image src={tt_logo} fluid />
                                    {/* <Chart></Chart> */}
                                </div>
                                <div className="col-sm">
                                    <Image src={tt_logo} fluid />
                                    Pie chart of gender
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="quote">
                        <div className="quote-title">Our Purpose</div>
                        <div className="quote-description">The purpose of Theta Tau is to develop and maintain a high standard of professional 
                            interest among its members, and to unite them in a strong bond of fraternal fellowship.
                        </div>
                    </div>
                    <div className="section">
                        <div className="section-title">Our Pillars</div>
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
                    <div className="quote">
                        <div className="quote-title">Our Open Motto</div>
                        <div className="quote-description">
                            “Whatsoever thy hand findeth to do, do it with thy might;…” –Ecclesiastes 9:10
                        </div>
                    </div>
                    <div className="section">
                        <div className="section-title">Our Chapters around the US</div>
                        Map Placeholder
                    </div>
                </div>
            </Fragment>
        );
    }
}