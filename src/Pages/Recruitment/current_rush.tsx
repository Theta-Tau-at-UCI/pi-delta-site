import React, { Component } from "react";
import "./current_rush.css";
import rushflyer from "../../Media/rush/rushflyerfall2024.png";

class CurrentRush extends Component {
  render() {
    return (
      <div>
        {/* <img id = "rush-header" src = {rush_header} alt = "rush_header"/> */}
        <div id="rush-blurb">
          <h1> Fall '24 Rush </h1>
          <br/>
          <p className="rush-desc">
            The Pi Delta Chapter of Theta Tau will be holding our next recruitment event from September 30th to October 4th, 2024!
            We would love to meet you!
            Details are in the graphic below and on our Instagram <a href={"https://www.instagram.com/thetatauuci"}
                                                                     rel={"noreferrer"}
                                                                     target={"_blank"}>@thetatauuci</a>.
            <br></br><br></br>If you have any questions in the meantime, feel free to contact our
            recruitment directors.
            <br/>
          </p>
          <img className="media" src={rushflyer} alt="rushflyer"/>
          <p className="rush-desc">
            Rush Chair: Ellen So
            <br/>
            Rush Chair: Miguel Murillo | (916) 895-0339
          </p>
        </div>
      </div>
    );
  }
}

export default CurrentRush;
