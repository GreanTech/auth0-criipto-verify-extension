import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import VerifyLink from './VerifyLink';

class Section extends Component {
  // static propTypes = {
  //   verifyLinks: PropTypes.array.isRequired
  // }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <section id="one" className="wrapper style2 special flow">
        <header className="major">
          <h2>Links from Criipto Verify root</h2>
        </header>
        {
          this.props.verifyLinks && this.props.verifyLinks.map((verifyLink) => {
            if (!verifyLink)
              return <div></div>
            return (
              <VerifyLink key={verifyLink.href} Obj={verifyLink} isComplete={false} Name={verifyLink.rel}/>
            )
          })
        }
      </section>
    );
  }

}
;

const mapState = ({verifyLinks}) => ({verifyLinks});
function mapStateToProps(state) {
  return {
    verifyLinks: state.verify.verifyLinks
  };
}
export default connect(mapStateToProps)(Section);