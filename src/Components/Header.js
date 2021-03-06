import React from "react";
import '../Styles/header.css';
import { withRouter } from "react-router-dom";
import Modal from "react-modal";
import GoogleLogin from 'react-google-login';
import axios from "axios";


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        border: 'solid 1px red',
        background: 'white',
        width: '36%'
    },
};
class Header extends React.Component {
    constructor() {
        super();
        this.state = {
            loginModalIsOpen: false,
            userName: undefined,
            isLoggedIn: false,
            createModalIsOpen: false,
            signinUpModalIsOpen: false,
            user: undefined,
            pwd: undefined,
            fn: undefined,
            ln: undefined,
            isAuthenticated: localStorage.getItem("logindata") ? true : false,
            logindata: localStorage.getItem("logindata") ? JSON.parse(localStorage.getItem("logindata")) : null
        }

    }



    handleNavigate = () => {
        this.props.history.push('/');
    }
    handleLogin = () => {
        this.setState({ loginModalIsOpen: true, signinUpModalIsOpen: false });
    }
    responseGoogle = (response) => {
        this.setState({ isLoggedIn: true, userName: response.profileObj.name, loginModalIsOpen: false });
    }

    handleLogout = () => {
        this.setState({ isLoggedIn: false, userName: undefined });

    }
    handleCaccount = () => {
        this.setState({ createModalIsOpen: true });
    }
    handleModal = (state, value) => {
        this.setState({ [state]: value });
    }


    handleInputChange = (state, event) => {
        this.setState({ [state]: event.target.value });
    }

    handleSignup = (event) => {
        const { user, pwd, fn, ln } = this.state;

        const userObj = ({
            user: user,
            pwd: pwd,
            fn: fn,
            ln: ln
        });
        axios({
            method: "POST",
            url: "http://localhost:4545/usersignup",
            headers: {
                'Content-Type': 'application/json'
            },
            data: userObj
        })
            .then((response) => {

                alert(response.data.message);

            }).catch(err => console.log(err))
        event.preventDefault();
    }

    handleSignin = (event) => {
        const { user, pwd } = this.state;

        const userObj = {
            user: user,
            pwd: pwd
        }
        axios({
            method: "POST",
            url: "http://localhost:4545/userlogin",
            headers: {
                'Content-Type': 'application/json'
            },
            data: userObj
        }).then((response) => {
            this.setState({
                userName: response.data.user,
                isLoggedIn: response.data.isAuthenticated,
                loginModalIsOpen: false

            });
            localStorage.setItem(
                "logindata", JSON.stringify(response.data.response[0])
            )
        }).catch(err => console.log(err))
        event.preventDefault();

    }


    render() {
        const { loginModalIsOpen, signinUpModalIsOpen, isLoggedIn, userName, createModalIsOpen } = this.state;

        return (

            <div className="header">
                <div className="title_name" onClick={this.handleNavigate}>
                    <i>ZOMATO</i>
                </div>
                {
                    !isLoggedIn ? <div className="login-group">
                        <button type="button" className="btn btn-light login " onClick={this.handleLogin}>
                            Login
                        </button>
                        <button type="button" className="btn btn-danger signup" onClick={this.handleCaccount}>
                            Create an account
                        </button>
                    </div> : <div className="login-group">
                        <button type="button" className="btn btn-light login ">
                            {userName}
                        </button>
                        <button type="button" className="btn btn-danger signup" onClick={this.handleLogout}>
                            Logout
                        </button>
                    </div>
                }

                <Modal
                    isOpen={loginModalIsOpen}
                    style={customStyles}
                >
                    <div>
                        <div className="glyphicon glyphicon-remove" style={{ float: 'right', marginBottom: '10px' }}
                            onClick={() => this.handleModal('loginModalIsOpen', false)}></div>
                        <form>
                            <label className="form-label">Email</label>
                            <input type="text" className="form-control" onChange={(event) => this.handleInputChange('email', event)} />
                            <label class="form-label">Password</label>
                            <input type="password" className="form-control" onChange={(event) => this.handleInputChange('password', event)} />
                            <button className="btn btn-danger" style={{ marginTop: '25px', float: 'left' }} onClick={(event) => this.handleSignin(event)}>Login</button>

                        </form>
                        <GoogleLogin
                            clientId="832901541200-4afobklqppbthf0kk6eslhi7dj97ctg2.apps.googleusercontent.com"
                            buttonText="Login with Google" className="glogin"
                            onSuccess={this.responseGoogle}
                            onFailure={this.responseGoogle}
                            cookiePolicy={'single_host_origin'}
                        />

                    </div>
                </Modal>
                <Modal
                    isOpen={createModalIsOpen}
                    style={customStyles}

                >
                    <div>
                        <div className="glyphicon glyphicon-remove" style={{ float: 'right', marginBottom: '10px' }}
                            onClick={() => this.handleModal('createModalIsOpen', false)}></div>
                        <form>
                            <label className="form-label">First Name</label>
                            <input style={{ width: '100%' }} type="text" class="form-control" onChange={(event) => this.handleInputChange('fn', event)} />
                            <label className="form-label">Last Name</label>
                            <input style={{ width: '100%' }} type="text" class="form-control" onChange={(event) => this.handleInputChange('ln', event)} />
                            <label className="form-label">Email</label>
                            <input type="text" class="form-control" onChange={(event) => this.handleInputChange('user', event)} />
                            <label className="form-label">Password</label>
                            <input type="text" class="form-control" onChange={(event) => this.handleInputChange('pwd', event)} />
                            <label className="form-label">Confirm Password</label>
                            <input type="text" class="form-control" onChange={(event) => this.handleInputChange('pwd', event)} />
                            <button className="btn btn-danger" style={{ marginTop: '25px', float: 'left' }} onClick={this.handleSignup}>Sign Up</button>

                        </form>
                        <GoogleLogin
                            clientId="832901541200-4afobklqppbthf0kk6eslhi7dj97ctg2.apps.googleusercontent.com"
                            buttonText="Login with Google" className="glogin"
                            onSuccess={this.responseGoogle}
                            onFailure={this.responseGoogle}
                            cookiePolicy={'single_host_origin'}
                        />
                    </div>
                </Modal>
                <Modal
                    isOpen={signinUpModalIsOpen}
                    style={customStyles}

                >
                    <div>
                        <h3>Account is created</h3>
                        <button className="btn btn-danger" onClick={this.handleLogin}>Login</button>
                    </div>
                </Modal>
            </div>
        )
    }
}
export default withRouter(Header);