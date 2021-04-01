import React, { Fragment } from "react";
import {Container, Col, Row, Button} from "react-bootstrap";
import "./About.css"
import Pillar from "./Pillar";
import brotherhood from "../../Media/chapter-photos/brotherhood.jpg"
import hammer_and_tongs from "../../Media/tt-graphics/hammer_and_tongs.jpg"
import service from "../../Media/chapter-photos/service.jpg"
import professionalism from "../../Media/chapter-photos/professionalism.jpg"
import Footer from '../../SharedComponents/Footer/Footer'
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
                    <ThetaTau/>
                    <OurChapter/>

                    <div className = "section">
                        <h1> Other Chapters in Our Region </h1>
                        <div className = "other-chapters">
                        Pi Delta is a part of the Western Region of Theta Tau. Here are the
                        other chapters and colonies in our region.
                        </div>

                        <Container className = "chapters-and-colonies">
                            <h3> Chapters </h3>
                            <ul>

                                <li> Chi Chapter (University of Arizona) </li>
                                <li> Delta Gamma Chapter (Arizona State University)</li>
                                <li> Epsilon Chapter (University of California, Berkeley)</li>
                                <li> Epsilon Delta Chapter (University of California, San Diego)</li>
                                <li> Kappa Epsilon Chapter (University of Southern California) </li>
                                <li> Lambda Delta Chapter (University of the Pacific) </li>
                                <li> Lambda Epsilon Chapter (University of San Diego)</li>
                                <li> Mu Delta Chapter (University of California, Merced) </li>
                                <li> Omicron Epsilon Chapter (Northern Arizona University)</li>
                                <li> Omicron Gamma Chapter (University of California, Davis) </li>
                                <li> Phi Epsilon (California State University, Fullerton)</li>
                                <li> Rho Delta Chapter (University of Nevada, Reno)</li>
                                <li> Sigma Delta Chapter (University of California, Riverside) </li>
                                <li> Sigma Epsilon Chapter (University of California, Santa Barbara) </li>
                                <li> Upsilon Delta Chapter (University of California, Los Angeles)</li>
                                <li> Upsilon Epsilon (Santa Clara University)</li>
                                <li> Xi Epsilon Chapter (California State University, Long Beach) </li>
                            </ul>
                            <h3> Colonies </h3>
                            <ul>
                                <li> University of Nevada, Las Vegas Colony of Theta Tau </li>
                                <li> University of Washington Colony</li>
                            </ul>
                        </Container>

                    </div>
                </div>
                <Footer/>
            </Fragment>
        );
    }
}


class OurChapter extends React.Component<{},{}>{
    render(){
        return(
            <div id = "our-chapter" className="section">
                <h1> Our Chapter: Pi Delta </h1>
                <div className="info">
                    In the winter of 2011, Alex Staebler, Arshitha Vaidhyanathan, and Jonathan Wong sought out to create greater opportunities for professional development and networking at UCI for future engineers. Shortly after reaching out to Theta Tau’s Central Office, nine others joined them to form the founding class: Clever Tan, Jacqueline Kim, Sarah Leung, Terence Leung, Amy Nguyen, Christopher Louie, Dhivya Sridhar, Jeffrey Go, and Jonathan Turcios. After creating a constitution and pledge process, the founding fathers welcomed 20 pledges the following fall: the Alpha class. On April 14, 2013, the UCI colony was installed as the Pi Delta Chapter of Theta Tau and has only continued to grow since, now with over 200 active members and alumni.
                    <div className="charts container">
                        <div className="row">
                            <Col xs = {12} lg = {6} > <MajorChart/> </Col>
                            <Col xs = {12} lg = {6}>  <GenderChart/> </Col>
                        </div>
                    </div>
                    <div id = "our-values">
                        <Pillar
                            value="Brotherhood"
                            img={brotherhood}
                            description="Our chapter takes pride in the close bond between our brothers. From seasonal retreats and mixers to regionals with brothers from all over the state and nation, we make sure to take time to relax and connect with each other."
                        />
                        <Pillar
                            value="Professionalism"
                            img={professionalism}
                            description="We hope to help our brothers develop into engineers with strong communication, problem-solving, and leadership skills that we demonstrate in our work and our community. Whether building up professional basics or guiding each other through the job hunt, our chapter is a community of like-minded individuals preparing each other for the professional world."
                        />
                        <Pillar
                            value="Service"
                            img={service}
                            description="We believe that giving back to the community is an integral part of becoming well rounded people. From taking on a rich array of community service projects or using our lessons learned to guide the next generation of students interested in STEM, we’re always looking for a way to give back to the community."
                        />
                    </div>
                </div>
            </div>
        );
    }
}

class ThetaTau extends React.Component<{}, {windowWidth:any }> {
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
            return (
                <div className="section">
                    <h1> Theta Tau  </h1>
                    <div id = "hammer-and-tongs-div">
                        <img id ="hammer-and-tongs-img" src = {hammer_and_tongs}/>
                    </div>
                    <div className = "motto">
                        “Whatsoever thy hand findeth to do, do it with thy might…” –Ecclesiastes 9:10
                    </div>
                    <div className="info">
                        Founded in 1904 at the University of Minnesota in Minneapolis as the Society of Hammer and Tongs by four engineering students,
                        Theta Tau is the oldest, largest, and foremost Fraternity for Engineers.
                        Today, Theta Tau proudly has a diverse membership of men and women studying
                        engineering and computer science at more than 80 campuses across the US.
                        <br/>
                        <div className = "learn-more">  <a href = "https://www.thetatau.org"><Button  variant="danger">Learn More</Button></a></div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="section">
                    <h1> Theta Tau  </h1>

                    <div className="info">
                        Founded in 1904 at the University of Minnesota in Minneapolis as the Society of Hammer and Tongs by four engineering students,
                        Theta Tau is the oldest, largest, and foremost Fraternity for Engineers.
                        Today, Theta Tau proudly has a diverse membership of men and women studying
                        engineering and computer science at more than 80 campuses across the US.
                        <div id = "hammer-and-tongs-div">
                            <img id ="hammer-and-tongs-img" src = {hammer_and_tongs}/>
                        </div>
                        <div className = "motto">
                            “Whatsoever thy hand findeth to do, do it with thy might…” –Ecclesiastes 9:10
                        </div>
                    <div className = "text-center learn-more">  <a href = "https://www.thetatau.org"><Button  variant="danger">Learn More</Button></a></div>
                    </div>
                </div>
            )
        }
    }





}