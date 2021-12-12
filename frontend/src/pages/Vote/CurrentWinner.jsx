import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from "axios/index";

class CurrentWinner extends Component {
    componentDidMount() {
        if(!this.props.auth.isAuthenticated) {
            this.props.history.push('/');
        }
        this.fetchCurrentWinner()
    }
    constructor(props){
        super(props);
        this.state = {
            winner: 'No Current Winner!'
        }
    }
    fetchCurrentWinner(){
        axios({
          url: "/api/winners",
          method: 'get',
          type: 'json',
        }).then(data => {
          this.setState({
            winner: data.data.data,
          });
        }).catch(err => {

        });
    }
    render() {
        return (
            <div>
                <h2>{this.state.winner}</h2>
            </div>
        );
    }
}
CurrentWinner.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth
});
export default connect(mapStateToProps)(withRouter(CurrentWinner));