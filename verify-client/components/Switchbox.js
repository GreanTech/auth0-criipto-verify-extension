
import React, { Component, PropTypes } from 'react';

const Switchbox = (props) => (
    <div className="switch switch-small has-switch">
        <div className="switch-animate switch-off switch-on">
            <div className="switch-animate">
                <input
                    name="status" className="uiswitch"
                    type="checkbox" checked={props.isChecked}
                    value={props.label}
                    onChange={props.onChange} />
                <span className="switch-left switch-small">ON</span>
                <label className="switch-small">&nbsp;</label>
                <span className="switch-right switch-small">OFF</span>
            </div>
            <span className="switch-left"></span>
        </div>
    </div>
);

Switchbox.propTypes = {
    label: PropTypes.string.isRequired,
    isChecked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default Switchbox;