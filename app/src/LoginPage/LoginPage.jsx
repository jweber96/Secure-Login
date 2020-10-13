import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import { history } from '../_helpers';

import { userActions } from '../_actions';

import './LoginPage.css';

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        // reset login status
        this.props.logout();

        this.state = {
            email: '',
            password: '',
            code: '',
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({ submitted: true });
        const { email, password, code } = this.state;
        if (email && password && code) {
            axios.post('http://localhost:3000/auth/login', 
            {
                'email': email,
                'password': password,
                'code': code
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "Origin"
                }
            })
            .then(function (response) {
                if (response.status == 200) {
                    document.cookie = "auth=" + response.data;
                    history.push("/notes");
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    }

    render() {
        const { loggingIn } = this.props;
        const { email, password, code, submitted } = this.state;
        return (
            <div className="Login">
                <div className="col-md-2 col-md-offset-5">
                    Login<br/><i class="material-icons lock">lock</i>
                </div>
                <div className="col-md-6 col-md-offset-3">
                    <form name="form" onSubmit={this.handleSubmit}>
                        <div className={'form-group' + (submitted && !email ? ' has-error' : '')}>
                            <div class="input">
                                <div class="input-addon">
                                    <i class="material-icons">email</i>
                                </div>
                                <label htmlFor="email">Email</label><input type="text" className="form-control" name="email" placeholder="Email" value={email} onChange={this.handleChange} />
                                {submitted && !email &&
                                    <div className="help-block">email is required</div>
                                }
                            </div>
                        </div>
                        <div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
                        <div class="input">
                            <div class="input-addon">
                                    <i class="material-icons">vpn_key</i>
                                </div>
                                <label htmlFor="password">Password</label>
                                <input type="password" className="form-control" name="password" placeholder="Password" value={password} onChange={this.handleChange} />
                                {submitted && !password &&
                                    <div className="help-block">Password is required</div>
                                }
                            </div>
                        </div>
                        <div className={'form-group' + (submitted && !code ? ' has-error' : '')}>
                        <div class="input">
                            <div class="input-addon">
                                    <i class="material-icons">phonelink_lock</i>
                                </div>
                                <label htmlFor="code">2FA Code</label>
                                <input type="text" className="form-control" name="code" value={code} placeholder="2FA Code" onChange={this.handleChange} />
                                {submitted && !code &&
                                    <div className="help-block">2FA Code is required</div>
                                }
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="LoginRegister">
                                <button className="btn btn-primary">Login</button>
                                {loggingIn &&
                                    <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                }
                                <Link to="/register" className="btn btn-link">Register</Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

function mapState(state) {
    const { loggingIn } = state.authentication;
    return { loggingIn };
}

const actionCreators = {
    login: userActions.login,
    logout: userActions.logout
};

const connectedLoginPage = connect(mapState, actionCreators)(LoginPage);
export { connectedLoginPage as LoginPage };