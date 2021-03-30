import React, { Fragment } from "react";
import "./Landing.css"
import chapter_photo from "../../Media/winter_photoshoot_2020.jpg";
import Pillar from "./Pillar";
import {CardDeck, Container, Row, Col, Button} from "react-bootstrap";
import chapter_photo_2 from "../../Media/winter_retreat.jpg"
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
                            <source src={"https://www.dropbox.com/s/ysz6cfcbkavkzsp/TT_Website_Video.mp4?raw=1"} type={"video/mp4"}/>
                        </video>

                        <div className={"container h-100"}>
                            <div className={"d-flex h-100 align-items-center"}>
                                <div className={"w-100 text-white"}>
                                    <h1 className="video-text display-3">Theta Tau at UC Irvine</h1>
                                    <h6 className={ "video-subtext"}>Co-ed Professional Engineering Fraternity</h6>
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
                            <a href = "/about"><Button variant="danger">Learn More</Button></a> </Col>
                        <Col> <img className = "media" src={chapter_photo} alt="chapter-photo" /></Col>
                    </Row>
                </Container>

                <Container id = "pillars">
                    <Col> <h1>Our Pillars</h1> </Col>
                    <CardDeck id={"pillar-cards"}>
                        <Pillar value={"Brotherhood"} img={chapter_photo} description={"We forge lifelong bonds of fraternal friendship, a journey that develops and delivers a network of lasting personal and professional relationships. We foster an inviting, safe, and social environment in which our members become lifelong friends."}
                        />
                        <Pillar value={"Professionalism"} img={chapter_photo} description={"We develop and nurture engineers with strong communication, problem-solving, collaboration, and leadership skills that we demonstrate in our profession, our community, and in our lives."}
                        />
                        <Pillar value={"Service"} img={chapter_photo} description={"We are known for our service to our college, university and the larger community. Our service projects create a unifying environment for learning and personal growth for our members."}
                        />
                    </CardDeck>
                </Container>
                <Container id = "join">


                    <Row>
                        <Col> <h1> Interested In Joining Our Brotherhood? </h1>
                            We hold recruitment events every fall and spring quarter. Feel free to stop
                            by at our booth at the engineering quad or contact us via email or social media.
                            <br/> <br/>
                            <a href = "/recruitment"> <Button variant = "danger"> Spring '21 Rush</Button> </a> </Col>
                        <Col> <img className = "media" src={chapter_photo_2} alt="chapter-photo-2" /></Col>
                    </Row>
                </Container>

                <Footer/>
            </Fragment>
        );
    }
}