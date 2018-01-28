var fs = require('fs-extra')
var path = require('path');
var baseline = require('./webtask.json');
var metaPatch = require('./server/lib/metaPatch');

var constants = require('./server/constants');

(function run() {
    var thisDir = path.dirname(require.main.filename);
    
    console.info('Creating Identity Service specific extension bundles', thisDir);
    Object.keys(constants.ID_SERVICE_PROFILES).forEach((key) => {
        var value = constants.ID_SERVICE_PROFILES[key];
        var delta = metaPatch(key, value);
        var webtaskConfig = Object.assign({}, baseline, delta);
        var idSvcBuildDir = path.join(thisDir, 'build', value.subpath);
        var targetBundleDir = path.join(idSvcBuildDir, 'build');
        fs.ensureDir(targetBundleDir, function(err) {
            if (err) {
                console.error(err);
            }
            else {
                var targetManifest = path.join(idSvcBuildDir, 'webtask.json');
                console.info(' - writing Identity Service specific extension manifest', targetManifest);
                fs.writeFileSync(targetManifest, JSON.stringify(webtaskConfig));
                console.info(' - copying bundle.js');
                fs.copySync('./build/bundle.js', path.join(targetBundleDir, 'bundle.js'));            
            }
        });
    });
})();