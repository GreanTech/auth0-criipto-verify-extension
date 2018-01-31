import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
// import Header from './Header';
import Section from './Section';
import Footer from './Footer';
import {fetchVerifyTenants, fetchVerifyLinks} from '../actions/verify'
import {fetchConnections} from '../actions/connection'

class Home extends Component {
  static propTypes = {
    fetchVerifyLinks : PropTypes.func.isRequired,
    fetchVerifyTenants : PropTypes.func.isRequired,
    fetchConnections: PropTypes.func.isRequired
  }
  
  constructor(props){
    super(props);
  }

  componentDidMount() {
    this.props.fetchVerifyLinks();
    this.props.fetchVerifyTenants();
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
const mapDispatch = {fetchVerifyLinks, fetchVerifyTenants, fetchConnections};

export default connect(mapState, mapDispatch)(Home);