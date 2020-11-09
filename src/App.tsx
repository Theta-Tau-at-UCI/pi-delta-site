import React, { Fragment } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import About from "./Pages/About/About";
import Brothers from "./Pages/Brothers/Brothers";
import Landing from "./Pages/Landing/Landing";
import Recruitment from "./Pages/Recruitment/Recruitment";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./SharedComponents/NavigationBar/NavigationBar";
import NavigationBar from "./SharedComponents/NavigationBar/NavigationBar"
import Footer from "./SharedComponents/Footer/Footer"


function App() {
  return (
      <Router>
        <Fragment>
          <NavigationBar/>
          <Route path="/" exact component={Landing} />
          <Route path="/about"  component={About} />
          <Route path="/brothers"  component={Brothers}/>
          <Route path="/recruitment"  component={Recruitment}/>
          <Footer/>
        </Fragment>
      </Router>

  );
}

export default App;
