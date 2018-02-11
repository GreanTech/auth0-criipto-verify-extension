import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import Section from './Section';
import Footer from './Footer';
import {RequireCoreVerifyData} from '../containers/RequireAuthentication';

class Home extends Component {

  render() {
    return (
      <div>
        <Section/>
        <Footer/>
      </div>
    )
  }
}

export default connect()(Home);