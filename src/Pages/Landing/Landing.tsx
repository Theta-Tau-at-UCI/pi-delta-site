import React, { Fragment } from "react";
import "./Landing.css"
import chapter_photo from "../../Media/chapter-photos/winter_photoshoot_2020.jpg";
import tt_logo from "../../Media/tt-graphics/tt-logo.png"
import Pillar from "./Pillar";
import {CardDeck, Container, Row, Col, Button} from "react-bootstrap";
import chapter_photo_2 from "../../Media/chapter-photos/winter_retreat.jpg"
import Footer from "../../SharedComponents/Footer/Footer"


export default class Landing extends React.Component<{}, { windowWidth: any }> {
    constructor(props: {}) {
        super(props);
        this.state = { windowWidth: window.innerWidth };
    }

    handleResize = (e:any) => {
        this.setState({ windowWidth: window.innerWidth });
    };

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
    }

    componentWillUnmount() {
        window.addEventListener("resize", this.handleResize);
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
                                    <img id = "video-overlay-graphic" src = {tt_logo}/>
                                    <h6 className={ "video-subtext"}>Pi Delta Chapter at UC Irvine</h6>
                                </div>
                            </div>
                        </div>
                    </header>


                    <WhoWeAre/>


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
               <Join/>

                <Footer/>
            </Fragment>
        );
    }
}


class WhoWeAre extends React.Component<{}, { windowWidth: any }> {
    constructor(props: {}) {
        super(props);
        this.state = { windowWidth: window.innerWidth };
    }

    handleResize = (e:any) => {
        this.setState({ windowWidth: window.innerWidth });
    };

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
    }

    componentWillUnmount() {
        window.addEventListener("resize", this.handleResize);
    }

    render(){
        if (this.state.windowWidth > 375){
            return(
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
                </Container>)
        } else {
            return(
                <Container id="who-we-are">
                    <Row>
                        <Col>
                            <h1>Who We Are</h1>


                            <img className = "media" src={chapter_photo} alt="chapter-photo" />
                            <br/>
                            Theta Tau is the premier co-ed professional engineering fraternity at UC Irvine.
                            We foster an environment for our brothers to develop individually and professionally
                            while giving back to the community.
                            <br/>
                            <div className = "text-center"> <a href = "/about"><Button id = "learn-more" variant="danger">Learn More</Button></a> </div>


                        </Col>
                    </Row>
                </Container>
            )
        }
    }
}

class Join extends React.Component<{}, { windowWidth: any }> {
    constructor(props: {}) {
        super(props);
        this.state = { windowWidth: window.innerWidth };
    }

    handleResize = (e:any) => {
        this.setState({ windowWidth: window.innerWidth });
    };

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
    }

    componentWillUnmount() {
        window.addEventListener("resize", this.handleResize);
    }

    render(){
        if (this.state.windowWidth > 375){
            return(
                <Container id = "join">
                    <Row>
                        <Col> <h1> Interested In Joining Our Brotherhood? </h1>
                            We hold recruitment events every fall and spring quarter. Feel free to stop
                            by at our booth at the engineering quad or contact us via email or social media.
                            <br/> <br/>
                            <a href = "/recruitment"> <Button variant = "danger"> Spring '21 Rush</Button> </a> </Col>
                        <Col> <img className = "media" src={chapter_photo_2} alt="chapter-photo-2" /></Col>
                    </Row>
                </Container>)
        } else {
            return(
                <Container id = "join">
                    <Row>
                        <Col> <h1> Interested In Joining Our Brotherhood? </h1>
                            <Row>
                                <Col> <img className = "media" src={chapter_photo_2} alt="chapter-photo-2" /></Col>
                            </Row>

                            We hold recruitment events every fall and spring quarter. Feel free to stop
                            by at our booth at the engineering quad or contact us via email or social media.
                            <br/> <br/>
                            <div className = "text-center" ><a href = "/recruitment"> <Button variant = "danger"> Spring '21 Rush</Button> </a> </div>
                        </Col>
                    </Row>

                </Container>
            )
        }
    }
}