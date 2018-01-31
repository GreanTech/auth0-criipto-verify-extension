import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
// import Header from './Header';
import Section from './Section';
import Footer from './Footer';
import {getVerifyTenants, getVerifyLinks} from '../actions/verify'
import {fetchConnections} from '../actions/connection'

class Home extends Component {
  static propTypes = {
    getVerifyLinks : PropTypes.func.isRequired,
    getVerifyTenants : PropTypes.func.isRequired,
    fetchConnections: PropTypes.func.isRequired
  }
  
  constructor(props){
    super(props);
  }

  componentDidMount() {
    this.props.getVerifyLinks();
    this.props.getVerifyTenants();
    this.props.fetchConnections();
  }

  render() {
    return (
      <div>
        <Section/>
        <hr />
        <Footer/>
      </div>
    )
  }
}

const mapState = ({verifyLinks, verifyTenants, connections}) => ({verifyLinks, verifyTenants, connections});
const mapDispatch = {getVerifyLinks, getVerifyTenants, fetchConnections};

export default connect(mapState, mapDispatch)(Home);