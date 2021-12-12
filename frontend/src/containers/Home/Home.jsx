import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class Home extends Component {
    componentDidMount() {
        if(!this.props.auth.isAuthenticated) {
            this.props.history.push('/');
        }
    }
    render() {
        return (
            <div>
                Home Page
            </div>
        );
    }
}
Home.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth
});
export default connect(mapStateToProps)(withRouter(Home));