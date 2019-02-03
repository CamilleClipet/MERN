exports.getHashTags = function getHashTags(inputText) {
    var regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/gm;
    var matches = [];
    var match;

    while ((match = regex.exec(inputText))) {
        matches.push(match[1]);
    }

    return matches;
}


exports.linkHashtag = function linkHashtag(text){
    var text2 = text.replace(
        /(:\/\/[^ <]*|>)?(\#([_a-z0-9-]+))/gi,
        function($0, $1, $2, $3) {
            //return ($1 ? $0 : '<a href="message/'+$3+'">$3</a>');
            return ($1 ? $0 : '&lt;a href=&quot;message/'+$3+'&quot;&gt;#'+$3+'&lt;/a&gt;');
        });
      return text2;
}

//console.log(getHashTags("hello this is a #text"));
//console.log(hashtag("hello this is a #text"));
