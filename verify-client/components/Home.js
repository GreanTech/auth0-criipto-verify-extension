import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
// import Header from './Header';
import Section from './Section';
import Footer from './Footer';
import {getVerifyLinks} from '../redux/reducers/verify'
import {getVerifyTenants} from '../redux/reducers/gauss'

class Home extends Component {
  static propTypes = {
    getVerifyLinks : PropTypes.func.isRequired,
    getVerifyTenants : PropTypes.func.isRequired
  }
  
  constructor(props){
    super(props);
  }

  componentWillMount() {
    this.props.getVerifyLinks();
    this.props.getVerifyTenants();
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

const mapState = ({verifyLinks, verifyTenants}) => ({verifyLinks, verifyTenants});
const mapDispatch = {getVerifyLinks, getVerifyTenants};

export default connect(mapState, mapDispatch)(Home);