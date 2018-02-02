import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import Section from './Section';
import Footer from './Footer';
import {fetchCore} from '../actions/verify'
import {fetchConnections} from '../actions/connection'

class Home extends Component {
  static propTypes = {
    fetchCore: PropTypes.func.isRequired,
    fetchConnections: PropTypes.func.isRequired
  }
  
  constructor(props){
    super(props);
  }

  componentDidMount() {
    this.props.fetchCore();
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
const mapDispatch = {fetchCore, fetchConnections};

export default connect(mapState, mapDispatch)(Home);