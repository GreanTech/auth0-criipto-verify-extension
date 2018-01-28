module.exports =
    function metaPatch (profileKey, profile) {
        var repo = 'https://raw.githubusercontent.com/GreanTech/auth0-criipto-verify-extension/master/build/' + profile.subpath;
        var patch = { 
            title: 'Criipto Verify - ' + profile.displayName,
            name: profileKey, 
            logoUrl: profile.logo,
            repository: repo,
            codeUrl: repo + '/build/bundle.js',
            description : profile.description
        };
        return patch;
    };
