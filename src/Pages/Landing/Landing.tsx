import React, { Fragment } from "react";
import "./Landing.css"
import chapter_photo from "../../Media/winter_photoshoot_2020.jpg";
import Pillar from "./Pillar";
import {CardDeck, Container, Row, Col, Button} from "react-bootstrap";
import tt_logo_placeholder from "../../Media/possible_logo.png";
import Footer from "../../SharedComponents/Footer/Footer"

export default class Landing extends React.Component<{}, { selected: string }> {
    constructor(props: {}) {
        super(props);
    }


    render() {
        return (
            <Fragment>

                    <header>
                        <div className={"overlay"}/>
                        <video playsInline={true} autoPlay={true} muted={true} loop={true}>
                            <source src={"https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4"} type={"video/mp4"}/>
                        </video>
                        <div className={"container h-100"}>
                            <div className={"d-flex h-100 align-items-center"}>
                                <div className={"w-100 text-white"}>
                                    <h1 className={"display-3"}>Theta Tau at UC Irvine</h1>
                                    <div>Co-ed Professional Engineering Fraternity</div>
                                </div>
                            </div>
                        </div>
                    </header>



                <Container id="who-we-are">

                    <Row>
                        <Col> <h1>Who We Are</h1>
                              Theta Tau is the premier co-ed professional engineering fraternity at UC Irvine.
                              We foster an environment for our brothers to develop individually and professionally
                              while giving back to the community.
                              <br/> <br/>
                              <Button variant="danger">Learn More</Button> <Button variant = "danger"> Spring '21 Rush</Button></Col>
                        <Col> <img className = "media" src={chapter_photo} alt="theta-tau-logo" /></Col>
                    </Row>
                </Container>

                <Container id = "pillars">
                    <h1>Our Pillars</h1>
                    <CardDeck id={"pillar-cards"}>
                        <Pillar value={"Brotherhood"} img={chapter_photo} description={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do \n" +
                        "                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim \n" +
                        "                                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo \n" +
                        "                                consequat."}
                        />
                        <Pillar value={"Professionalism"} img={chapter_photo} description={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do \n" +
                        "                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim \n" +
                        "                                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo \n" +
                        "                                consequat."}
                        />
                        <Pillar value={"Service"} img={chapter_photo} description={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do \n" +
                        "                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim \n" +
                        "                                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo \n" +
                        "                                consequat."}
                        />
                    </CardDeck>
                </Container>

                <Footer/>
            </Fragment>
        );
    }
}