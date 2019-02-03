const msg = require('./msg/lib.js');

module.exports = function (app) {
    app.post('/create',msg.createMessage);
    app.get('/messages',msg.seeAll);
    app.get('/feed',msg.seeFeed);
    app.get('/messages/:id',msg.seeAllAuthor); /* */
    app.get('/:id',msg.seeOne);
    app.get('/search/:hashtag',msg.seeByHashtag);
    app.put('/:id/edit',msg.editMessage);
    app.delete('/:id/delete',msg.deleteMessage);
}
