exports.home = (req, res) => {

    res.render('index', {
        title: 'Startseite'
    });
};

exports.login = (req, res) => {

    res.render('login', {
        title: 'Login'
    });    
};

exports.register = (req, res) => {

    res.render('register', {
        title: 'Register'
    })
};

exports.wallet = (req, res) => {

    res.render('wallet', {
        title: 'Wallet'
    })
};

exports.aboutUs = (req, res) => {

    res.render('aboutUs', {
        title: 'aboutUs'
    })
};