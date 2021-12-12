import axios from 'axios';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { loginUser } from '../../actions/authentication';


class Login extends Component {

    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            errors: {},
            accesstoken: '',
            loggedIn: false
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    updateLoggedInStatus(){
        this.setState({
            loggedIn: true
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        const user = {
            username: this.state.email,
            password: this.state.password,
        };
        this.props.loginUser(user, this.updateLoggedInStatus.bind(this));
        if(this.state.loggedIn) {
            this.props.history.push('/home');
        }
    }

    componentDidMount() {
        if(this.props.auth.isAuthenticated) {
            this.props.history.push('/home');
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.auth.isAuthenticated) {
            this.props.history.push('/home')
        }
        // if(nextProps.errors) {
        //     this.setState({
        //         errors: nextProps.errors
        //     });
        // }
    }

    render() {
        const {detail} = this.props.errors;
        return(
        <div className="container" style={{ marginTop: '50px', width: '700px'}}>
            <h2 style={{marginBottom: '40px'}}>Login</h2>
            <form onSubmit={ this.handleSubmit }>
                <div className="form-group">
                    <input
                    type="text"
                    placeholder="Email"
                    className={classnames('form-control form-control-lg', {
                        'is-invalid': detail
                    })}
                    name="email"
                    onChange={ this.handleInputChange }
                    value={ this.state.email }
                    />
                    {detail && (<div className="invalid-feedback">{detail}</div>)}
                </div>
                <div className="form-group">
                    <input
                    type="password"
                    placeholder="Password"
                    className={classnames('form-control form-control-lg', {
                        'is-invalid': detail
                    })} 
                    name="password"
                    onChange={ this.handleInputChange }
                    value={ this.state.password }
                    />
                    {detail && (<div className="invalid-feedback">{detail}</div>)}
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-primary">
                        Login User
                    </button>
                </div>
            </form>
        </div>
        )
    }
}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
})

export  default connect(mapStateToProps, { loginUser })(withRouter(Login))