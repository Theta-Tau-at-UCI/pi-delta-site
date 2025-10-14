import React, { Fragment, useState } from "react";
import "./Landing.css";
import chapter_photo from "../../Media/chapter-photos/winter_photoshoot_2024.jpg";
import tt_logo from "../../Media/tt-graphics/ttbadge.png";
import rushVid from "../../Media/animations/rush_teaser.mp4";
import Pillar from "./Pillar";
import { CardDeck, Container, Row, Col, Button } from "react-bootstrap";
import chapter_photo_2 from "../../Media/chapter-photos/landing/winter_retreat_2024.jpg";
import Footer from "../../SharedComponents/Footer/Footer";
import background_main from "../../Media/chapter-photos/landing/thetatau.jpg";
import Testimonial from "./Testimonial";
import ImagesCarousel from "./ImagesCarousel";


export default class Landing extends React.Component<{}, { windowWidth: any }> {
  constructor(props: {}) {
    super(props);
    this.state = { windowWidth: window.innerWidth };
  }

  handleResize = () => {
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
          <img
              className="overlay"
              // id={"video"}
              src={background_main}
              alt={"Theta Tau Logo"}
          />
          {/*<div className={"overlay"}/>*/}
          {/*<video playsInline={true} autoPlay={true} muted={true} loop={true}>*/}
          {/*  <source*/}
          {/*      src={*/}
          {/*        "https://www.dropbox.com/s/ysz6cfcbkavkzsp/TT_Website_Video.mp4?raw=1"*/}
          {/*      }*/}
          {/*      type={"video/mp4"}*/}
          {/*  />*/}
          {/*</video>*/}

          <div className={"container h-100"}>
            <div className={"d-flex h-100 align-items-center"}>
              <div className={"w-100 text-white"}>
                <img
                    id="video-overlay-graphic"
                    src={tt_logo}
                    alt={"Theta Tau Logo"}
                />
                <h1 id="title-text">Theta Tau</h1>
                <h6 className={"video-subtext"}>
                  Pi Delta Chapter at UC Irvine
                </h6>
              </div>
            </div>
          </div>
        </header>

        <WhoWeAre/>

        <Container id="pillars">
          <Col>
            {" "}
            <h1>OUR PILLARS</h1>{" "}
            <br></br>
          </Col>
          <div className="pillar-container" id={"pillar-cards"}>
            <Pillar
              value={"Brotherhood"}
              img={chapter_photo}
              description={
                "We forge lifelong bonds of fraternal friendship, a journey that develops and delivers a network of lasting personal and professional relationships. We foster an inviting, safe, and social environment in which our members become lifelong friends."
              }
            />
            <Pillar
              value={"Professionalism"}
              img={chapter_photo}
              description={
                "We develop and nurture engineers with strong communication, problem-solving, collaboration, and leadership skills that we demonstrate in our profession, our community, and in our lives."
              }
            />
            <Pillar
              value={"Service"}
              img={chapter_photo}
              description={
                "We are known for our service to our college, university and the larger community. Our service projects create a unifying environment for learning and personal growth for our members."
              }
            />
          </div>
        </Container>
        <Container id="testimonials">
          <Col>
            <h1>TESTIMONIALS</h1>{" "}
          </Col>
          <Testimonial></Testimonial>
        </Container>
        <Join />
        {/*<Container  id ="imagecarousel">*/}
        {/*  <ImagesCarousel/>*/}
        {/*</Container>*/}



        <Footer />
      </Fragment>
    );
  }
}

class WhoWeAre extends React.Component<{}, { windowWidth: any }> {
  constructor(props: {}) {
    super(props);
    this.state = { windowWidth: window.innerWidth };
  }

  handleResize = () => {
    this.setState({ windowWidth: window.innerWidth });
  };

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    window.addEventListener("resize", this.handleResize);
  }

  render() {
    // const [className, setClassName] = useState("");
    // const handleSetClassName = () => {
    //   setClassName("gfg-card-class")};

    if (this.state.windowWidth > 500) {
      return (
        <Container id="who-we-are">
          <Row>
            <Col className="who-we-are-card">
              {/*{" "}*/}
              <h1>WHO WE ARE</h1>
              <br></br>
            </Col>

            <Col className="who-we-are-card">
              {/*{" "}*/}

              <p>Theta Tau is the premier co-ed professional engineering fraternity
                at UC Irvine. We foster an environment for our brothers to develop
                individually and professionally while giving back to the
                community.</p>

            </Col>
            <Col className="who-we-are-card">
              <Button className="button" variant="danger" href="/about">LEARN MORE</Button>
              <a href={"/about"}>
              </a>
              <br></br>
            </Col>
            <Col className="who-we-are-card">
              {/*{" "}*/}
              <img className="media" src={chapter_photo} alt="chapter"/>
            </Col>

          </Row>
        </Container>
      );
    } else {
      return (
        <Container id="who-we-are">
          <Row>
            <Col>
              <h1>WHO WE ARE</h1>
              <br></br>
              <img className="media" src={chapter_photo} alt="chapter"/>
              <br/>
              Theta Tau is the premier co-ed professional engineering fraternity
              at UC Irvine. We foster an environment for our brothers to develop
              individually and professionally while giving back to the
              community.
              <br/>
              <div className="text-center">
                {" "}
                <a href={"/about"}>
                  <Button className="button" id="learn-more" variant="danger" href="/about">LEARN MORE</Button>
                </a>{" "}
              </div>
            </Col>
          </Row>
        </Container>
      );
    }
  }
}

class Join extends React.Component<{}, { windowWidth: any }> {
  constructor(props: {}) {
    super(props);
    this.state = { windowWidth: window.innerWidth };
  }

  handleResize = () => {
    this.setState({ windowWidth: window.innerWidth });
  };

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    window.addEventListener("resize", this.handleResize);
  }

  render() {
    if (this.state.windowWidth > 500) {
      return (
        <Container id="join">
          <Row>
            <Col className="who-we-are-card">
              {/*{" "}*/}
              <h1> INTERESTED IN JOINING? </h1>
              <br></br>
            </Col>
            <Col className="who-we-are-card">
              <p>
                We hold recruitment events every fall and spring quarter. Feel
                free to stop by at our booth at the engineering quad or contact us
                via email or social media.
              </p>

            </Col>
            <Col className="who-we-are-card">
              <Button className="button" variant="danger" href="/recruitment"> FALL '25 RUSH</Button>
              <a href={"/recruitment"}>
            </a>
              <br></br>
          </Col>
          </Row>
        </Container>
      );
    } else {
      return (
        <Container id="join">
          <Row>
            <Col>
              {" "}
              <h1> INTERESTED IN JOINING? </h1>
              <br></br>
              <Row>
                <Col>
                  {" "}
                  <img
                      className="media"
                      src={chapter_photo_2}
                      alt="chapter 2"
                  />
                </Col>
              </Row>
              <p>We hold recruitment events every fall and spring quarter. Feel
                free to stop by at our booth at the engineering quad or contact us
                via email or social media.
              </p>
              <br/> <br/>
              <div className="text-center">
                <a href={"/recruitment"}>
                  {" "}
                  <Button className="button" variant="danger" href="/recruitement"> FALL '25 RUSH</Button>{" "}
                </a>{" "}
              </div>
            </Col>
          </Row>
        </Container>
      );
    }
  }
}
