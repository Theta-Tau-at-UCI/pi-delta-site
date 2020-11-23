/*import { Button, Modal } from "react-bootstrap"; */
import React, { Fragment } from "react";
import "./About.css"
import Pillar from "./Pillar";
import tt_logo_placeholder from "../../Media/tt-wordmark-uci.png";


export default class About extends React.Component<{}, { selected: string }> {
    constructor(props: {}) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <div id="chaper-info">
                    <h1>Our Chapter</h1>
                    <p>Founded in 1904 at the University of Minnesota in Minneapolis, Theta Tau
                        is the oldest, largest, and foremost Fraternity for Engineers. Today,
                        Theta Tau proudly has a diverse membership of men and women studying
                        engineering at more than 80 campuses across the US.
                    </p>
                    {/* Pie charts with brother stats */}
                </div>
                <div id="pillars">
                    <h1>Our Pillars</h1>
                    <Pillar
                        value="BROTHERHOOD"
                        img={tt_logo_placeholder}
                        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do 
                            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim 
                            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo 
                            consequat."
                    />
                    <Pillar
                        value="PROFESSIONALISM"
                        img={tt_logo_placeholder}
                        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do 
                            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim 
                            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo 
                            consequat."
                    />
                    <Pillar
                        value="SERVICE"
                        img={tt_logo_placeholder}
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
            </Fragment>
        );
    }
}