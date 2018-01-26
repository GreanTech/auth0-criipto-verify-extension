import React from 'react';

const Header = (props) => {
    return (
        <header className="dashboard-header" style={{borderBottom: '0'}}>
            <div className="container">
                <img src={window.config.CRIIPTO_VERIFY_AUTHMETHOD_LOGO} style={{maxHeight: "70px"}}/>
            </div>
        </header>
    );
};

export default Header;