import React, { Component } from "react";
import "./current_rush.css";

class CurrentRush extends Component {
  render() {
    return (
      <div>
        {/* <img id = "rush-header" src = {rush_header} alt = "rush_header"/> */}
        <div id="rush-blurb">
          <h1> Spring '23 Rush </h1>
          <br />
          <p className="rush-desc">
            Pi Delta will be holding our next recruitment event in the spring.
            If you have any questions in the meantime, feel free to contact our
            recruitment directors.
            <br />
          </p>
          <p className="rush-desc">
            Rush Chair: Jeffrey Truong | (415) 401-5197
            <br />
            Rush Chair: Alec Owen | (808) 283-1202
          </p>
        </div>
      </div>
    );
  }
}

export default CurrentRush;
