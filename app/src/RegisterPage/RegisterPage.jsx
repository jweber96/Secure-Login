import React from 'react';
const QRCode = require('qrcode.react');
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';

import { userActions } from '../_actions';

import './RegisterPage.css';

class RegisterPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {
                FirstName: '',
                LastName: '',
                Email: '',
                Password: '',
                PasswordValidate: '',
                Phone: ''
            },
            recaptcha: false,
            submitted: false,
            two_factor_code: '',
            test_code: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.checkCode = this.checkCode.bind(this);
    }

    handleReCAPTCHA() {
        this.state.recaptcha = true;
    }

    handleChange(event) {
        const { name, value } = event.target;
        const { user } = this.state;
        this.setState({
            user: {
                ...user,
                [name]: value
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        this.setState({ submitted: true });
        const { user } = this.state;

        var re = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);

        if (user.FirstName && user.LastName && user.Email && user.Password == user.PasswordValidate && re.test(user.Password) && user.Phone /* && this.state.recaptcha */) {
            axios.post(
                'http://localhost:3000/user/newUser', 
                this.state.user,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        "Access-Control-Allow-Origin": "Origin"
                    }
                }
            ).then((response) => {
                this.setState({ two_factor_code: response.data })
            })
            .catch((error) => {
                alert("Use a unique email address.");
            });
        }
        if (user.Password != user.PasswordValidate || !re.test(user.Password)) {
            alert("Passwords must be the same and meet the requirements.")
        }
    }

    checkCode(event) {
        event.preventDefault();

        const { two_factor_code, test_code } = this.state;
        alert(window.otplib.authenticator.check(test_code, two_factor_code));
    }

    render() {
        const { registering  } = this.props;
        const { user, submitted, two_factor_code, test_code } = this.state;
        const QrURI = (secret) => {
            console.log(secret);
            return `otpauth://totp/Infosec%20Example:${user.Email}?secret=${secret}&issuer=Infosec%20Web%20App`;
        };
        return (
            <div className="Register">
                <div className="col-md-2 col-md-offset-5">
                    Register<br/><i class="material-icons account_box">account_box</i>
                </div>
                <div className="col-md-6 col-md-offset-3">
                    <form name="form" onSubmit={this.handleSubmit}>
                        <div className={'form-group' + (submitted && !user.FirstName ? ' has-error' : '')}>
                            <label htmlFor="FirstName">First Name</label>
                            <input type="text" className="form-control" name="FirstName" value={user.FirstName} onChange={this.handleChange} />
                            {submitted && !user.FirstName &&
                                <div className="help-block">First Name is required</div>
                            }
                        </div>
                        <div className={'form-group' + (submitted && !user.LastName ? ' has-error' : '')}>
                            <label htmlFor="LastName">Last Name</label>
                            <input type="text" className="form-control" name="LastName" value={user.LastName} onChange={this.handleChange} />
                            {submitted && !user.LastName &&
                                <div className="help-block">Last Name is required</div>
                            }
                        </div>
                        <div className={'form-group' + (submitted && !user.Email ? ' has-error' : '')}>
                            <label htmlFor="Email">Email</label>
                            <input type="text" className="form-control" name="Email" value={user.Email} onChange={this.handleChange} />
                            {submitted && !user.Email &&
                                <div className="help-block">Email is required</div>
                            }
                        </div>
                        <div className={'form-group' + (submitted && !user.Phone ? ' has-error' : '')}>
                            <label htmlFor="Phone">Phone #</label>
                            <input type="text" className="form-control" name="Phone" value={user.Phone} onChange={this.handleChange} />
                            {submitted && !user.Phone &&
                                <div className="help-block">Phone is required</div>
                            }
                        </div>
                        <div className={'form-group' + (submitted && !user.Password ? ' has-error' : '')}>
                            <label htmlFor="Password">Password
                                    <p><font size="2">--minimum of 8 chars<br/>
                                                    --must have at least one letter<br/>
                                                    --must have at least one number
                                                    </font></p></label>
                            <input type="Password" className="form-control" name="Password" value={user.Password} onChange={this.handleChange} />
                            {submitted && !user.Password &&
                                <div className="help-block">Password is required</div>
                            }
                        </div>
                        <div className={'form-group' + (submitted && !user.PasswordValidate ? ' has-error' : '')}>
                            <label htmlFor="PasswordValidate">Re-enter Password</label>
                            <input type="Password" className="form-control" name="PasswordValidate" value={user.PasswordValidate} onChange={this.handleChange} />
                            {submitted && !user.PasswordValidate &&
                                <div className="help-block">Password is required</div>
                            }
                        </div>
                        {
                            /*
                            <ReCAPTCHA
                                sitekey="Your client site key"
                                onChange={this.handleReCAPTCHA}
                            />
                            */
                        }
                        <div className="form-group">
                            <div className="LoginRegister">
                                <button className="btn btn-primary">Register</button>
                                {registering && 
                                    <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                }
                                <Link to="/login" className="btn btn-link">Cancel</Link>
                            </div>
                        </div>
                    </form>
                    { two_factor_code && <div className="LoginRegister">
                        <QRCode
                            id="2fa"
                            value={QrURI(two_factor_code)}
                            size={290}
                            level={"H"}
                            includeMargin={true}
                        />
                        <div className="LoginRegister">
                            <div className="QR text">Thank you for registering!<br/>
                                Scan the QR code above then click below to login!
                            </div>
                            <Link to="/login" className="btn btn-link">Return to Login</Link>
                        </div>
                    </div>}
                </div>
            </div>
        );
    }
}

function mapState(state) {
    const { registering } = state.registration;
    return { registering };
}

const actionCreators = {
    register: userActions.register
}

const connectedRegisterPage = connect(mapState, actionCreators)(RegisterPage);
export { connectedRegisterPage as RegisterPage };