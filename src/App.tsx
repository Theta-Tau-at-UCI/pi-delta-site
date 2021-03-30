import React, { Fragment } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import About from "./Pages/About/About";
import Actives from "./Pages/Brothers/Actives";
import Officers from "./Pages/Brothers/Officers"
import Classes from "./Pages/Brothers/Classes"
import Landing from "./Pages/Landing/Landing";
import Recruitment from "./Pages/Recruitment/Recruitment";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import "./SharedComponents/NavigationBar/NavigationBar";
import NavigationBar from "./SharedComponents/NavigationBar/NavigationBar"


function App() {
  return (
      <Router>
        <Fragment>
          <NavigationBar/>

          {/*<Route exact path="/pi-delta-react-site"><Redirect to="/" /></Route>*/}
          <Route path="/" exact component={Landing}/>
          <Route path="/about" component={About} />
          <Route path="/actives" component={Actives}/>
          <Route path="/officers" component={Officers}/>
          <Route path="/classes" component={Classes}/>
          <Route path="/recruitment" component={Recruitment}/>

        </Fragment>
      </Router>

  );
}

export default App;
