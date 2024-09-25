import React, { Fragment } from "react";
import "./Footer.css";
import tt_logo_placeholder from "../../Media/tt-graphics/tt-wordmark-uci.png";
import { FaInstagram, FaFacebook, FaInbox } from "react-icons/fa";
import Credits from "../Footer/Credits";
// icons sourced from https://react-icons.github.io/search

export default class Footer extends React.Component<{}, { windowWidth: any }> {
  constructor(props: {}) {
    super(props);
    this.state = { windowWidth: window.innerWidth };
  }

  handleResize = () => {
    this.setState({ windowWidth: window.innerWidth });
  };

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    window.addEventListener("resize", this.handleResize);
  }
  render() {
    if (this.state.windowWidth > 500) {
      return (
        <Fragment>
          <section className="footer">
            <div className="row main-content">
              <div className="col sm-3 md-3 logo-column">
                <img
                  className="logo"
                  src={tt_logo_placeholder}
                  alt={"TT Logo"}
                />
                {/*<p> <strong>Engineering Leaders</strong> <i> for Service, Professionalism, and Brotherhood. </i></p>*/}
              </div>

              <div className="col sm-3 md-3 about-column">
                <div className="sm-3 md-3">
                  <strong> About</strong>
                </div>
                <div>
                  <a href={"/about#our-chapter"}> Our Chapter </a>
                </div>
                <div>
                  <a href={"/about#our-values"}>Our Values</a>
                </div>
                <div>
                  <a href={"/brothers"}>Brothers</a>
                </div>
                <div>
                  <a href="https://thetatau.org/">Theta Tau</a>
                </div>
              </div>

              <div className="col sm-3 md-3 recruitment-column">
                <div className="sm-3 md-3">
                  <strong> Recruitment</strong>
                </div>
                <div>
                  <a href={"recruitment#rush-header"}> Info </a>
                </div>
                <div>
                  <a href={"/recruitment#faq"}> FAQ</a>
                </div>
                <div>
                  <a href={"/recruitment#events"}> Events </a>
                </div>
              </div>

              <div className="col sm-3 md-3 contact-column">
                <div className="sm-3 md-3">
                  <strong> Contact</strong>
                </div>
                <div id="email">
                  <FaInbox /> ucithetatau@gmail.com
                </div>
                <div>
                  {" "}
                  <a href="https://www.instagram.com/thetatauuci/">
                    <FaInstagram /> @thetatauuci{" "}
                  </a>{" "}
                </div>
                <div>
                  {" "}
                  <a href="https://www.facebook.com/thetatauuci/">
                    {" "}
                    <FaFacebook /> @thetatauuci
                  </a>
                </div>
              </div>
            </div>

            <Credits />
          </section>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <section className="footer">
            <div className="container">
              <div className="row">
                <div id="footer-col" className="col">
                  <div className="mobile-//font-size">
                    <strong> About</strong>
                  </div>
                  <div>
                    <a className="mobile-//font-size" href={"/about#our-chapter"}>
                      {" "}
                      Our Chapter{" "}
                    </a>
                  </div>
                  <div>
                    <a className="mobile-//font-size" href={"/about#our-values"}>
                      Our Values
                    </a>
                  </div>
                  <div>
                    <a className="mobile-//font-size" href={"/brothers"}>
                      Brothers
                    </a>
                  </div>
                  <div>
                    <a
                      className="mobile-//font-size"
                      href="https://thetatau.org/"
                    >
                      Theta Tau
                    </a>
                  </div>
                </div>
                <div id="footer-col" className="col">
                  <div className="mobile-//font-size">
                    <strong> Recruitment</strong>
                  </div>
                  <div>
                    <a
                      className="mobile-//font-size"
                      href={"recruitment#rush-header"}
                    >
                      {" "}
                      Info{" "}
                    </a>
                  </div>
                  <div>
                    <a className="mobile-//font-size" href={"/recruitment#faq"}>
                      {" "}
                      FAQ
                    </a>
                  </div>
                  <div>
                    <a
                      className="mobile-//font-size"
                      href={"/recruitment#events"}
                    >
                      {" "}
                      Events{" "}
                    </a>
                  </div>
                </div>
                <div id="footer-col" className="col">
                  <div className="mobile-//font-size">
                    <strong> Contact</strong>
                  </div>
                  <div className="mobile-//font-size" id="email">
                    <FaInbox /> ucithetatau@gmail.com
                  </div>
                  <div>
                    {" "}
                    <a
                      className="mobile-//font-size"
                      href="https://www.instagram.com/thetatauuci/"
                    >
                      <FaInstagram /> @thetatauuci{" "}
                    </a>{" "}
                  </div>
                  <div>
                    {" "}
                    <a
                      className="mobile-//font-size"
                      href="https://www.facebook.com/thetatauuci/"
                    >
                      {" "}
                      <FaFacebook /> @thetatauuci
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="row main-content">
              <div className="col sm-12 md-12 logo-column">
                <img
                  className="logo-mobile"
                  src={tt_logo_placeholder}
                  alt={"TT Logo"}
                />
                {/*<p> <strong>Engineering Leaders</strong> <i> for Service, Professionalism, and Brotherhood. </i></p>*/}
              </div>
            </div>

            <Credits />
          </section>
        </Fragment>
      );
    }
  }
}
