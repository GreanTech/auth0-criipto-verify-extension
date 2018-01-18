import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
// import Header from './Header';
import Section from './Section';
import Footer from './Footer';
import {getVerifyLinks} from '../redux/reducers/verify'

class Home extends Component {
  static propTypes = {
    getVerifyLinks : PropTypes.func.isRequired
  }
  
  constructor(props){
    super(props);
  }

  componentWillMount() {
    this.props.getVerifyLinks();
  }

  render() {
    return (
      <div>
        <Section/>
        <Footer/>
      </div>
    )
  }
}

const mapState = ({verifyLinks}) => ({verifyLinks});
const mapDispatch = {getVerifyLinks};

export default connect(mapState, mapDispatch)(Home);