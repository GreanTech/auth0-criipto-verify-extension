import React from 'react';
import { Link } from 'react-router'
import Header from './Header';
import Footer from './Footer';

const ConnectVerify = (props) => {
    function onClick() {
        props.history.push('/verify');
    };

    return (
        <div>
            <Header/>
            <section className="row">
                <div className="col-xs-12 text-center">
                    <section id="connect-verify" className="wrapper style2 special flow">
                        <header className="major">
                            <h3>
                                <p>Welcome to the <code>{window.config.CRIIPTO_VERIFY_AUTHMETHOD_NAME + " via " || ""} Criipto Verify</code> connection wizard!</p>
                                <p>We will guide you through the process, which starts with a login to <code>Criipto Verify</code></p>
                            </h3>
                        </header>
                        <button className="btn btn-default" onClick={onClick}>Create Criipto Verify account</button>
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
            <Footer/>
        </div>
        )
};

export default ConnectVerify;