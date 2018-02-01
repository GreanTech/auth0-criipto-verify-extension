import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

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
      if (this.props.auth.isAuthenticated) {
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
      const token = sessionStorage.getItem('delegated-admin:apiToken');
      if (!token) {
        window.location.pathname = '/admins/login';
      }
    }

    render() {
      if (sessionStorage.getItem('delegated-admin:apiToken')) {
        return <InnerComponent {...this.props} />;
      }

      return <div></div>;
    }
  }

  return connect((state) => ({ auth: state.auth.toJS() }), { push })(RequireDashboardAdminContainer);
}