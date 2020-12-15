/*import { Button, Modal } from "react-bootstrap"; */
import React, { Fragment } from "react";
import "./About.css"
import Pillar from "./Pillar";
import tt_logo from "../../Media/tt-logo.png";


export default class About extends React.Component<{}, { }> {
    constructor(props: {}) {
        super(props);
    }
    
    render() {
        return (
            <Fragment>
                <div id="body">
                    <div id="chaper-info">
                        <h1>Our Chapter</h1>
                        <div className="info">Founded in 1904 at the University of Minnesota in Minneapolis, Theta Tau
                            is the oldest, largest, and foremost Fraternity for Engineers. Today,
                            Theta Tau proudly has a diverse membership of men and women studying
                            engineering at more than 80 campuses across the US.
                        </div>
                    </div>
                    <div id="pillars">
                        <h1>Our Pillars</h1>
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
                    <div id="quote">
                        <h1>Our Brotherhood</h1>
                        <p>Founded in 1904 at the University of Minnesota in Minneapolis, Theta Tau
                            is the oldest, largest, and foremost Fraternity for Engineers. Today,
                            Theta Tau proudly has a diverse membership of men and women studying
                            engineering at more than 80 campuses across the US.
                        </p>
                    </div>
                </div>
            </Fragment>
        );
    }
}