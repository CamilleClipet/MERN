exports.linkHashtag = function linkHashtag(text){
    var text2 = text.replace(
        /(:\/\/[^ <]*|>)?(\#([_a-z0-9-]+))/gi,
        function($0, $1, $2, $3) {
            //return ($1 ? $0 : '<a href="message/'+$3+'">$3</a>');
            return ($1 ? $0 : '&lt;a href=&quot;search#'+$3+'&quot;&gt;#'+$3+'&lt;/a&gt;');
        });
      return text2;
}

exports.htmlDecode = function htmlDecode(input){
  var e = document.createElement('div');
  e.innerHTML = input;
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}
