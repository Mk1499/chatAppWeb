import React, { Component } from "react";
import {Link} from "react-router-dom";
import "../style.css";
import "../main";
import logo from '../logo.jpg';
export default class Registeration extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username:"",
            email: "",
            password1: "",
            password2: "",
            error: false , 

        };
    }


    addAccount = (event) => {

        // let url = "http://localhost:3005/addAccount";
        let url = "https://mk14chatserver.herokuapp.com/addAccount"
        event.preventDefault();
        if (this.state.password1 === this.state.password2)
        {
          fetch(url , {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: this.state.username,
              email: this.state.email,
              password:this.state.password1
            })
          }).then(data => this.setState({
            username :'' , 
            email : '' , 
            password1 : '' , 
            password2 : ''
          })
          ).then(this.props.history.push(`/login`))
        } else {
    
        //   Alert.alert(
        //     'Not Matched Password',
        //     'Sorry But both passwords must be matched ',
        //     [
        //       {
        //         text: 'Cancel',
        //         onPress: () => console.log('Cancel Pressed'),
        //         style: 'cancel',
        //       },
        //       {text: 'OK', onPress: () => console.log('OK Pressed')},
        //     ],
        //     {cancelable: false},
        //   );
          
          
        }  
        
     } ; 
    
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
                            <form className="login100-form validate-form" onSubmit={this.addAccount} >
                                <span className="login100-form-title p-b-26">
                                    Scorpion Chat
            </span>
                                <span className="login100-form-title p-b-48">
                                    <i className="zmdi zmdi-font"></i>
                                    <img src={logo} className="logo" width="25%" height="25%" alt="Scorpion Chat"></img>
                                </span>
                                
                                <div className="wrap-input100 validate-input" >
                                    <input className="input100" type="text" id="username" name="username" onChange={this.handleChange} />
                                    <span className="focus-input100" data-placeholder="Username"></span>
                                </div>
                                
                                <div className="wrap-input100 validate-input" data-validate="Valid email is: a@b.c">
                                    <input className="input100" type="text" id="email" name="email" onChange={this.handleChange} />
                                    <span className="focus-input100" data-placeholder="Email"></span>
                                </div>

                                <div className="wrap-input100 validate-input" data-validate="Enter password">
                                    <span className="btn-show-pass">
                                        <i className="zmdi zmdi-eye"></i>
                                    </span>
                                    <input className="input100" id="password1" type="password" name="pass" onChange={this.handleChange} />
                                    <span className="focus-input100" data-placeholder="Password"></span>
                                </div>

                                <div className="wrap-input100 validate-input" data-validate="Confirm password">
                                    <span className="btn-show-pass">
                                        <i className="zmdi zmdi-eye"></i>
                                    </span>
                                    <input className="input100" id="password2" type="password" name="pass" onChange={this.handleChange} />
                                    <span className="focus-input100" data-placeholder="Confirm Password"></span>
                                </div>

                                <div className="container-login100-form-btn">
                                    <div className="wrap-login100-form-btn">
                                        <div className="login100-form-bgbtn"></div>
                                        <button className="login100-form-btn" onClick={this.addAccount}>
                                            Sign Up
                </button>
                                    </div>
                                </div>
                                <br />
                                <div className="text-center p-t-115">
                                    <span className="txt1">
                                        Already have an account?
              </span>

                                    <Link className="txt2" to="login">
                                        Sign In
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
