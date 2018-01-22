import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import VerifyLink from './VerifyLink';
import GaussLink from './GaussLink';

class Section extends Component {
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
        <header className="major">
          <h2>Links from Gauss</h2>
        </header>
        {
          this.props.gaussLinks && this.props.gaussLinks.map((gaussLink) => {
            if (!gaussLink)
              return <div></div>
            return (
              <GaussLink key={gaussLink.href} Obj={gaussLink} isComplete={false} Name={gaussLink.rel}/>
            )
          })
        }
        <header className="major">
          <h2>Links templates from Gauss</h2>
        </header>
        {
          this.props.gaussLinkTemplates && this.props.gaussLinkTemplates.map((gaussLinkTemplate) => {
            if (!gaussLinkTemplate)
              return <div></div>
            return (
              <GaussLink key={gaussLinkTemplate.href} Obj={gaussLinkTemplate} isComplete={false} Name={gaussLinkTemplate.rel}/>
            )
          })
        }
      </section>
    );
  }

}
;

const mapState = ({verifyLinks, gaussLinks, gaussLinkTemplates}) => ({verifyLinks, gaussLinks, gaussLinkTemplates});
function mapStateToProps(state) {
  return {
    verifyLinks: state.verify.verifyLinks,
    gaussLinks: state.gauss.gaussLinks,
    gaussLinkTemplates: state.gauss.gaussLinkTemplates,
  };
}
export default connect(mapStateToProps)(Section);