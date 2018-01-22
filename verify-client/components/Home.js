import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
// import Header from './Header';
import Section from './Section';
import Footer from './Footer';
import {getVerifyLinks} from '../redux/reducers/verify'
import {getGaussLinks} from '../redux/reducers/gauss'

class Home extends Component {
  static propTypes = {
    getVerifyLinks : PropTypes.func.isRequired,
    getGaussLinks : PropTypes.func.isRequired
  }
  
  constructor(props){
    super(props);
  }

  componentWillMount() {
    this.props.getVerifyLinks();
    this.props.getGaussLinks();
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

const mapState = ({verifyLinks, gaussLinks}) => ({verifyLinks, gaussLinks});
const mapDispatch = {getVerifyLinks, getGaussLinks};

export default connect(mapState, mapDispatch)(Home);