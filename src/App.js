import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from './components/Login/Login';
import Registeration from './components/Registration/Registeration';
import Chat from './components/Chat/Chat';



export default class App extends Component {

    render() {


        return (<Router >
            <Route exact path="/"
                component={Login}
            />
            <Route path="/login"
                component={Login}
            />  
            <Route path="/register"
                component={Registeration}
            />
            <Route path="/chat"
                component={Chat}
            /> </Router >
        )
    }
}