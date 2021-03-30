import React, { Fragment } from "react";
import {Container, Col, Row, Button} from "react-bootstrap";
import "./About.css"
import Pillar from "./Pillar";
import tt_logo from "../../Media/tt-logo.png";
import brotherhood from "../../Media/brotherhood.jpg"
import hammer_and_tongs from "../../Media/hammer_and_tongs.jpg"
import service from "../../Media/service.jpg"
import professionalism from "../../Media/professionalism.jpg"
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
                    <div className="section">
                        <h1> Theta Tau  </h1>
                        <div className="info">
                            Founded in 1904 at the University of Minnesota in Minneapolis as the Society of Hammer and Tongs by four engineering students,
                            Theta Tau is the oldest, largest, and foremost Fraternity for Engineers.
                            Today, Theta Tau proudly has a diverse membership of men and women studying
                            engineering and computer science at more than 80 campuses across the US.

                        <br/>
                        <div className = "learn-more">  <a href = "https://www.thetatau.org"><Button  variant="danger">Learn More</Button></a></div>
                        <div id = "hammer-and-tongs"> <img src = {hammer_and_tongs}/> </div>
                        <div className = "motto">
                            “Whatsoever thy hand findeth to do, do it with thy might…” –Ecclesiastes 9:10
                        </div>
                        </div>
                    </div>
                    <div id = "our-chapter" className="section">

                        <h1> Our Chapter: Pi Delta </h1>
                        <div className="info">
                            In the winter of 2011, Alex Staebler, Arshitha Vaidhyanathan, and Jonathan Wong sought out to create greater opportunities for professional development and networking at UCI for future engineers. Shortly after reaching out to Theta Tau’s Central Office, nine others joined them to form the founding class: Clever Tan, Jacqueline Kim, Sarah Leung, Terence Leung, Amy Nguyen, Christopher Louie, Dhivya Sridhar, Jeffrey Go, and Jonathan Turcios. After creating a constitution and pledge process, the founding fathers welcomed 20 pledges the following fall: the Alpha class. On April 14, 2013, the UCI colony was installed as the Pi Delta Chapter of Theta Tau and has only continued to grow since, now with over 200 active members and alumni.

                        <div className="charts container">
                            <div className="row">
                                <div className="col-sm">
                                    <MajorChart/>
                                </div>
                                <div className="col-sm">
                                    <GenderChart/>
                                </div>
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
                                description="We hope to help our brothers develop into engineers with strong communication, problem-solving, and leadership skills that we demonstrate in our work and our community. Whether building up professional basics or guiding each other through the job hunt, our chapter is a community of like-minded individuals preparing each other for the professional world.
    "
                            />
                            <Pillar
                                value="Service"
                                img={service}
                                description="We believe that giving back to the community is an integral part of becoming well rounded people. From taking on a rich array of community service projects or using our lessons learned to guide the next generation of students interested in STEM, we’re always looking for a way to give back to the community.

    "
                            />
                        </div>
                    </div>
                    </div>

                    <div className = "section">
                        <h1> Other Chapters in Our Region </h1>
                        <div className = "other-chapters">
                        Pi Delta is a part of the Western Region of Theta Tau. Here are the
                        other chapters and colonies in our region if you would like to learn about them.
                        </div>

                        <Container>

                            <h2> Chapters </h2>
                            <h2> Colonies </h2>

                            <ul>
                                <li> placeholder 1</li>
                                <li> placeholder 2 </li>
                            </ul>
                        </Container>

                    </div>
                </div>
                <Footer/>
            </Fragment>
        );
    }
}
