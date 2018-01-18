import React from 'react';

const Footer = (props) => {
  return (
    <footer id="footer">
      <div className="row">
        <div className="col-xs-12 text-center">
          <a href="https://manage.criipto.id" style={{textDecoration: "none", borderBottom: "none"}}>
            <img src="https://manage.criipto.id/assets/images/criiptoverify-white.svg"/>
            <p>Powered by Auth0 and Criipto</p>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;