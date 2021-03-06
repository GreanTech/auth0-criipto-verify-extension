import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import {fetchCore} from '../actions/verify';

export default function RequireAuthentication(InnerComponent) {
  class RequireAuthenticationContainer extends Component {
    static propTypes = {
      push: PropTypes.func.isRequired,
      auth: PropTypes.object.isRequired,
      location: PropTypes.object.isRequired
    }

    componentWillMount() {
      this.requireAuthentication();
    }

    componentWillReceiveProps() {
      this.requireAuthentication();
    }

    requireAuthentication() {
      if (!this.props.auth.isAuthenticated && !this.props.auth.isAuthenticating) {
        if (!this.props.location) {
          this.props.push('/login');
        } else {
          this.props.push(`/login?returnUrl=${this.props.location.pathname}`);
        }
      }
    }

    render() {
      if (this.props.auth.isAuthenticated || this.props.auth.renewingAuthentication) {
        return <InnerComponent {...this.props} />;
      }
      
      return <div></div>;
    }
  }

  return connect((state) => ({ auth: state.auth.toJS() }), { push })(RequireAuthenticationContainer);
}

export function RequireDashboardAdmin(InnerComponent) {
  class RequireDashboardAdminContainer extends Component {
    
    componentWillMount() {
      this.requireDashboardAdmin();
    }

    componentWillReceiveProps() {
      this.requireDashboardAdmin();
    }

    requireDashboardAdmin() {
      if (window.location.hostname !== 'localhost') {
        const token = sessionStorage.getItem('delegated-admin:apiToken');
        if (!token) {
          window.location.pathname = '/admins/login';
        }
      }
    }

    render() {
      if (window.location.hostname === 'localhost' || sessionStorage.getItem('delegated-admin:apiToken')) {
        return <InnerComponent {...this.props} />;
      }

      return <div></div>;
    }
  }

  return connect((state) => ({ auth: state.auth.toJS() }), { push })(RequireDashboardAdminContainer);
}

export function RequireCoreVerifyData(InnerComponent) {
  class RequireCoreVerifyDataContainer extends Component {

    constructor(props) {
      super(props);
      this.requireCoreVerifyData = this.requireCoreVerifyData.bind(this);
    }

    componentWillMount() {
      this.requireCoreVerifyData();
    }

    componentWillReceiveProps() {
      this.requireCoreVerifyData();
    }

    requireCoreVerifyData() {
      if (this.props.coreVerifyDataAvailable) {
        return;
      }
      if (this.props.coreVerifyDataLoading) {
        return;
      }
      
      this.props.fetchCore();
    }

    render() {
      if(this.props.coreVerifyDataAvailable) {
        return <InnerComponent {...this.props} />;
      }

      return (
        <div>Fetching data from Criipto Verify
          <div className="loader"></div>
        </div>
      );
    }
  }

  function mapStateToProps (state) {
    return {
      coreVerifyDataLoading: state.verifyTenants.get('loading'),
      coreVerifyDataAvailable: state.verifyTenants.get('coreFetchCompleted')
    };
  }

  return connect(mapStateToProps, {fetchCore})(RequireCoreVerifyDataContainer);
}