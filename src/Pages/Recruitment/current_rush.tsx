import React, { Component } from "react";
import "./current_rush.css";
import rushflyerfront from "../../Media/rush/hb-rush-flyers/flyer_front.png";
import rushflyerback from "../../Media/rush/hb-rush-flyers/flyer_back.png";
import rushFallVideo from "../../Media/rush/rush_section2.mp4";

interface RushEvent {
  date: string;
  title: string;
  description: string;
  dressCode: string;
}

const rushEvents: RushEvent[] = [
  {
    date: "9/29",
    title: "Info Night",
    description: "Meet the brothers and learn what Theta Tau is all about.",
    dressCode: "Business Casual",
  },
  {
    date: "9/30",
    title: "E-Challenge",
    description: "Compete and work with other Rushees in teams to build a small engineering project.",
    dressCode: "Casual",
  },
  {
    date: "10/1",
    title: "Pro-Dev Night",
    description: "Resume and career-building tips from alumni.",
    dressCode: "Professional",
  },
  {
    date: "10/2",
    title: "BBQ Night",
    description: "Invite only. A casual night to hang out and get to know members.",
    dressCode: "Casual",
  },
  {
    date: "10/3",
    title: "Interview Day",
    description: "Invite only. Formal interviews for prospective members.",
    dressCode: "Formal",
  },
];

class CurrentRush extends Component {
  render() {
    return (
      <div>

        <header className="hero-section">
          <video
              className="hero-video"
              autoPlay
              loop
              muted
              playsInline
          >
            <source src={rushFallVideo} type="video/mp4" />
          </video>
          <div className="hero-overlay h-100 d-flex flex-column justify-content-center align-items-center text-white">
            <h1 id="title-text">Rush</h1>
            <h6 className="video-subtext">
              Find out more about our community of engineers!
            </h6>
          </div>
        </header>
        {/* <img id = "rush-header" src = {rush_header} alt = "rush_header"/> */}
        <div id="rush-blurb">

          <br/>
          {/*<p className="rush-desc">*/}
          {/*  The Pi Delta Chapter of Theta Tau will be holding our next recruitment event in Fall Quarter 2025!*/}
          {/*  We would love to meet you!*/}
          {/*  Closer to the date, we will be sharing more details on our Instagram <a href={"https://www.instagram.com/thetatauuci"}*/}
          {/*                                                           rel={"noreferrer"}*/}
          {/*                                                           target={"_blank"}>@thetatauuci</a>.*/}
          {/*  <br></br><br></br>If you have any questions in the meantime, feel free to reach out via Instagram or email.*/}
          {/*  <br/>*/}
          {/*</p>*/}
        </div>
        <h1 className="fall-rush">Fall Rush 25'</h1>
        <div className="rush-timeline">

          <div className="timeline-line" />
          {rushEvents.map((event, index) => (
              <div className="timeline-item" key={index}>
                <div className="timeline-bubble">{event.date}</div>
                <div className="timeline-content">
                  <p className="timeline-dresscode">{event.dressCode}</p>
                  <h3 className="timeline-title">{event.title}</h3>
                  <p className="timeline-desc">{event.description}</p>
                </div>
              </div>
          ))}
        </div>
      </div>


    );
  }
}

export default CurrentRush;
