class CheckDomainForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: '' };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.onCheck(`${this.state.value}.${window.config.CRIIPTO_VERIFY_TLD}`);
    }

    render() {
        var tld = window.config.CRIIPTO_VERIFY_TLD;
        var placeholder = `<YOUR DESIRED PREFIX>.${tld}`;
        return (
            <div>
                <form onSubmit={this.handleSubmit} className="form-horizontal col-xs-9">
                    <div className="form-group">
                        <div className="col-xs-4">
                            <input type="text" value={this.state.value} placeholder={placeholder} onChange={this.handleChange} className="form-control"/>
                        </div>
                        <div className="col-xs-2">
                            <input type="submit" value="Use if available" className="form-control" />
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default CheckDomainForm;