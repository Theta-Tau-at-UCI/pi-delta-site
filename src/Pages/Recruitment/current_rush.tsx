import React, { Component } from "react";
import "./current_rush.css";
import rushflyerfront from "../../Media/rush/hb-rush-flyers/flyer_front.png";
import rushflyerback from "../../Media/rush/hb-rush-flyers/flyer_back.png";

class CurrentRush extends Component {
  render() {
    return (
      <div>
        {/* <img id = "rush-header" src = {rush_header} alt = "rush_header"/> */}
        <div id="rush-blurb">
          <h1> Spring '25 Rush </h1>
          <br/>
          <p className="rush-desc">
            The Pi Delta Chapter of Theta Tau will be holding our next recruitment event in Spring Quarter 2025!
            We would love to meet you!
            Closer to the date, we will be sharing more details on our Instagram <a href={"https://www.instagram.com/thetatauuci"}
                                                                     rel={"noreferrer"}
                                                                     target={"_blank"}>@thetatauuci</a>.
            <br></br><br></br>If you have any questions in the meantime, feel free to reach out via Instagram or email.
            <br/>
          </p>
          <div id="rush-flyer"><img className="media" src={rushflyerfront} alt="rushflyerfront"/>
            <img className="media" src={rushflyerback} alt="rushflyerback"/></div>

        </div>
      </div>
    );
  }
}

export default CurrentRush;
