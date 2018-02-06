import React from 'react';

const Footer = (props) => {
  return (
    <div>
      <footer id="footer">
        <div className="row">
          <div className="col-xs-12 text-center">
            <a href="https://manage.criipto.id" style={{textDecoration: "none", borderBottom: "none"}}>
              <img src="https://www.criipto.com/images/logo-criipto-dark-3.svg"/>
              <p>Powered by Auth0</p>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;