import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import Section from './Section';
import Footer from './Footer';
import {fetchCore} from '../actions/verify'

class Home extends Component {
  static propTypes = {
    fetchCore: PropTypes.func.isRequired,
  }
  
  constructor(props){
    super(props);
  }

  componentDidMount() {
    this.props.fetchCore();
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

const mapState = ({verifyLinks, verifyTenants, connections}) => ({verifyLinks, verifyTenants, connections});
const mapDispatch = {fetchCore};

export default connect(mapState, mapDispatch)(Home);