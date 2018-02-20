import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router'
import Header from './Header';
import Footer from './Footer';
import * as constants from '../constants';

class ConnectVerify extends Component {
    static propTypes = {
        // Seems that dispatch is a magic word, binding does not seem to work with that particular value.
        // So, using a very original name instead...
        dispatchX: PropTypes.func
    };
    
    constructor(props) {
        super(props);
        this.registerIntent = this.registerIntent.bind(this);
        this.onClickCreate = this.onClickCreate.bind(this);
        this.onClickManage = this.onClickManage.bind(this);
    }

    registerIntent(intent) {
        this.props.dispatchX({ 
            type: constants.VERIFY_TENANT_INTENT, 
            payload: { intent: intent } 
        });
        this.props.history.push('/verify');        
    }
    
    onClickCreate() { this.registerIntent(constants.VERIFY_TENANT_INTENT_CREATE); }

    onClickManage() { this.registerIntent(constants.VERIFY_TENANT_INTENT_MANAGE); }
    
    render() {
        return (
            <div>
                <Header/>
                <section className="row">
                    <div className="col-xs-12 text-center">
                        <section id="connect-verify" className="wrapper style2 special flow">
                            <header className="major">
                                <h3>
                                    <p>Welcome to the <code>{window.config.CRIIPTO_VERIFY_AUTHMETHOD_NAME + " via " || ""} Criipto Verify</code> connection wizard!</p>
                                    <p>We will guide you through the process, starting with getting an account set up in <code>Criipto Verify</code></p>
                                </h3>
                            </header>
                            <p><button className="btn btn-default" onClick={this.onClickCreate}>Create account</button></p>
                            <p> - or, if you've already done that, login in and manage your account:</p>
                            <button className="btn btn-default" onClick={this.onClickManage}>Manage account</button>
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
    }
};

function mapDispatch(dispatch) {
     return {dispatchX: dispatch};
}

export default connect(null, mapDispatch)(ConnectVerify);
