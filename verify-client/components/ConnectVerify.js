import React from 'react';
import { Link } from 'react-router'
import Footer from './Footer';

const ConnectVerify = (props) => {
    function onClick() {
        props.history.push('/verify');
    };

    return (
        <div>
            <section className="row">
                <div className="col-xs-12 text-center">
                    <section id="connect-verify" className="wrapper style2 special flow">
                        <header className="major">
                            <h3>
                                <p>Welcome to the <code>{window.config.CRIIPTO_VERIFY_AUTHMETHOD_NAME + " via " || ""} Criipto Verify</code> connection wizard!</p>
                                <p>We will guide you through the process, which starts with a login to <code>Criipto Verify</code></p>
                            </h3>
                            {/* <h2>Hi there, {this.props.user.get("name")} (email: {this.props.user.get("email")})</h2> */}
                        </header>
                        <button className="btn btn-default" onClick={onClick}>Log in and get connected</button>
                    </section>
                </div>
            </section>
            <hr />
            <section className="row">
                <div className="col-xs-12 text-center">
                    <section id="connect-verify" className="wrapper style2 special flow">
                        <footer className="minor">
                            <p>Please note that, in some cases, the login to <code>Criipto Verify</code> will be automatic.</p>
                            <p>For example, that could happen if you are logged in to your Auth0 tenant with a Google account, and then uses the same Google account to log in to <code>Criipto Verify</code></p>
                        </footer>
                    </section>
                </div>
            </section>
            <hr />
            <Footer/>
        </div>
        )
};

export default ConnectVerify;