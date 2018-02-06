
import React, { Component, PropTypes } from 'react';

class Switchbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isChecked: props.isChecked,
        }
    }

    toggleSwitchboxChange = () => {
        const { onChange, label } = this.props;

        this.setState(({ isChecked }) => (
            {
                isChecked: !isChecked,
            }
        ));

        onChange(label);
    }

    render() {
        const { label } = this.props;
        const { isChecked } = this.state;

        return (
            <div className="switch switch-small has-switch">
                <div className="switch-animate switch-off switch-on">
                    <div className="switch-animate">
                        <input
                            name="status" className="uiswitch"
                            type="checkbox" checked={isChecked}
                            value={label}
                            onChange={this.toggleSwitchboxChange} />
                        <span className="switch-left switch-small">ON</span>
                        <label className="switch-small">&nbsp;</label>
                        <span className="switch-right switch-small">OFF</span>
                    </div>
                    <span className="switch-left"></span>
                </div>
            </div>
        );
    }
}

Switchbox.propTypes = {
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default Switchbox;