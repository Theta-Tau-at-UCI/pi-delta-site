import React from 'react';
import Carousel from "react-multi-carousel";
import 'react-multi-carousel/lib/styles.css';
import "./Testimonial.css"
import {Container} from "react-bootstrap";
import jakeHeadshot from "../../Media/testimonials/jake_headshot.jpeg";
import lukeHeadshot from "../../Media/testimonials/lukeheadshot.jpeg";

const responsive = {
    superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 5000, min: 0 },
        items: 1
    },
    desktop: {
        breakpoint: { max: 5000, min: 0 },
        items: 1
    },
    tablet: {
        breakpoint: { max: 5000, min: 0 },
        items: 1
    },
    mobile: {
        breakpoint: { max: 5000, min: 0 },
        items: 1
    }
};


const Testimonial = () => {
    return (
        <Carousel
            swipeable={false}
            draggable={false}
            showDots={true}
            responsive={responsive}
            // ssr={true} // means to render carousel on server-side.
            infinite={true}
            // autoPlay={this.props.deviceType !== "mobile" ? true : false}
            autoPlaySpeed={1000}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={500}
            containerClass="carousel-container"
            // removeArrowOnDeviceType={["tablet", "mobile"]}
            // deviceType={this.props.deviceType}
            // dotListClass="custom-dot-list-style"
            // itemClass="carousel-item-padding-40-px"
            className="carousel"
        >
            {[
                <div className={"carousel-item"}>
                    <img className={"testimonial-headshot"} src={jakeHeadshot} />
                    <div className={"testimonial-text"}>
                        <p className={"testimonial-quote"}>"Becoming a part of Theta Tau was the single best decision I've made throughout my time in college.
                            Not only have I been able to grow immensely professionally and personally, but more importantly,
                            I've made many lifelong friends and gone on countless adventures along the way.
                            Everyone in Theta Tau is so hardworking, driven, and talented in their own unique ways,
                            and being surrounded by these amazing people each and every day has inspired me to better myself and chase my own goals.
                            There's truly no other community like ours at UC Irvine, and I'm grateful to be a part of it every single day."</p>
                        <p className={"testimonial-name"}>- Jake Silverman, Gamma Beta Class | Marshall 2024-2025</p>
                    </div>

                </div>,
                <div className={"carousel-item"}>
                    <img className={"testimonial-headshot"} src={lukeHeadshot} />
                    <div className={"testimonial-text"}>
                        <p className={"testimonial-quote"}>"Theta Tau is an amazing place, and is so much more than an organization.
                            I have made many genuine, lifelong friends in this community.
                            It can be easy to go through college just focusing on school and getting past our next assignment or exam,
                            but the time I spend studying, working, eating, and having fun with the brothers of Theta Tau grounds me in the moment,
                            and reminds me to appreciate my time in college.
                            I’d spend an extra year in college just to be with these people longer if I could.
                            We push each other, we mess around, and we get business done, and I am so thankful to lead these amazing people."
                        </p>
                        <p className={"testimonial-name"}>- Luke Vargas, Gamma Beta Class | Regent 2024-2025 </p>
                    </div>
                </div>
            ]}
        </Carousel>
    );
};

export default Testimonial;