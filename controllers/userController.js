const account = require('./account/lib.js');

module.exports = function (app) {
    app.post('/login',account.login);
    app.post('/signup',account.signup);
    app.get('/users',account.seeAll);
    app.get('/users/:id',account.seeOne);
    app.get('/me',account.seeMe);
    app.get('/profile',account.getUser);
    app.put('/edit',account.updateUser);
    app.put('/follow/:username',account.follow);
    app.put('/unfollow/:username',account.unfollow);
    app.put('/delete',account.deleteCurrent);
}

//5c339b96bce1a801ecbf2c58
