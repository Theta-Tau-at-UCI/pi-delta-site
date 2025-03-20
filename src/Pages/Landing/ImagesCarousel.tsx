import React from 'react';
import Carousel from "react-multi-carousel";
import 'react-multi-carousel/lib/styles.css';
import "./ImagesCarousel.css"
import {Col, Container} from "react-bootstrap";
import jakeHeadshotSideways from "../../Media/testimonials/img.png";
import jakeHeadshot from "../../Media/testimonials/jakeHeadshot.png";
import chapter_photo_2 from "../../Media/chapter-photos/landing/winter_retreat_2024.jpg";
import chapter_photo_3 from "../../Media/chapter-photos/landing/ZBonfire.jpeg";


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


const ImagesCarousel = () => {
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
        >
            {[
                <div className={"carousel-item-brotherhood"}>
                    {/*<img className={"images-carousel"} src={jakeHeadshot} />*/}
                    <Col className="carousel-item-card">
                        {" "}
                        <img className="carousel-image" src={chapter_photo_2} alt="chapter 2" />
                    </Col>
                </div>,
                <div className={"carousel-item-brotherhood"}>
                    <Col className="carousel-item-card">
                        {" "}
                        <img className="carousel-image" src={chapter_photo_3} alt="chapter 3" />
                    </Col>
                    {/*<img className={"images-carousel"} src={jakeHeadshotSideways} />*/}
                </div>
            ]}
        </Carousel>
    );
};

export default ImagesCarousel;