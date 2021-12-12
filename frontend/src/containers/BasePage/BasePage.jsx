import PropTypes from 'prop-types';
import { Component } from 'react';
class BasePage extends Component {

    constructor(props){
        super(props);
        if(!this.props.auth.isAuthenticated) {
            this.props.history.push('/');
            window.location.href = '/';
        }
    }
    render() {}
}
BasePage.propTypes = {
    auth: PropTypes.object.isRequired
}

export default BasePage;