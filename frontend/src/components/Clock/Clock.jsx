import React, { Component } from 'react';
import classes from './Clock.module.css';
export default class Clock extends Component {
    state = {
      time: new Date()
    };
  
    componentDidMount() {
      this.timerID = setInterval(() => this.tick(), 1000);
    }
  
    componentWillUnmount() {
      clearInterval(this.timerID);
    }
  
    tick() {
      this.setState({
        time: new Date()
      });
    }
  
    render() {
      return (
          <p className={classes.clockTime}>{this.state.time.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}</p>
      );
    }
  }