import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../style.css";
import "../main";
import logo from '../logo.jpg';

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      error: false,
      url: "https://mk14chatserver.herokuapp.com/login",
      urlLocal: "http://192.168.1.115:3005/login"

    };
    
  }


  LoginFun = (event) => {

    event.preventDefault();
    console.log("Email : ", this.state.email);
    let url = this.state.url;
    return fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*"
      },

      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      }),
    })
    .then(response => {
      if (response.status === 200) {
        response.json()
          .then(response => {
            localStorage.setItem('MK14ChatToken', response.token)
            this.props.history.push(`/chat`);
          })

      } else {
        alert(response.status)
      }

    }).catch(err => alert(err));
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }



  render() {
    return (
      <>
        <div className="limiter">
          <div className="container-login100">
            <div className="wrap-login100">
              <form className="login100-form validate-form" onSubmit={this.LoginFun} >
                <span className="login100-form-title p-b-26">
                  Scorpion Chat
            </span>
                <span className="login100-form-title p-b-48">
                  <i className="zmdi zmdi-font"></i>
                  <img src={logo} className="logo" width="25%" height="25%" alt="Scorpion Chat"></img>
                </span>

                <div className="wrap-input100 validate-input" data-validate="Valid email is: a@b.c">
                  <input className="input100" type="text" id="email" name="email" onChange={this.handleChange} />
                  <span className="focus-input100" data-placeholder="Email"></span>
                </div>

                <div className="wrap-input100 validate-input" data-validate="Enter password">
                  <span className="btn-show-pass">
                    <i className="zmdi zmdi-eye"></i>
                  </span>
                  <input className="input100" id="password" type="password" name="pass" onChange={this.handleChange} />
                  <span className="focus-input100" data-placeholder="Password"></span>
                </div>

                <div className="container-login100-form-btn">
                  <div className="wrap-login100-form-btn">
                    <div className="login100-form-bgbtn"></div>
                    <button className="login100-form-btn" onClick={this.LoginFun}>
                      Login
                </button>
                  </div>
                </div>
                <br />
                <div className="text-center p-t-115">
                  <span className="txt1">
                    Don’t have an account?
              </span>

                  <Link className="txt2" to="/register">
                    Sign Up
              </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div id="dropDownSelect1"></div>

      </>

    );
  }
}
