var config = require('./config');

module.exports = {
    name : function(req) {
        if (req.webtaskContext) {
            return req.webtaskContext.meta['auth0-extension-name'];
        }
        
        return config('AUTH0-EXTENSION-NAME');
    }
}