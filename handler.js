/**
* Date: 28.05.2012.
* Version: 0.1
* Description: Simple context search for movie via imdbapi.com
*/ 

var title = "Find on IMDB";
var displayTime = 15000; //time to display popup

var id = chrome.contextMenus.create({"title": title, "contexts":["selection"],
                                       "onclick": sendRequest});

function sendRequest(info, tab) {

var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function(data) {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        var data = JSON.parse(xhr.responseText);
        show(data, beautifyString(info.selectionText));
      } else {
        show(false, beautifyString(info.selectionText));
      }
    }
}

var iaurl = 'http://www.imdbapi.com/?t=' + encodeURI(beautifyString(info.selectionText));

xhr.open("GET", iaurl , true);
xhr.send();

}


function show(data, query) {

if (!data) {
  showError(query);
}
else {
  if (data.Response == "True") {

  var notification = window.webkitNotifications.createNotification(
    data.Poster,
    data.Title + '  (' + data.Year + ')' + ' - ' + data.imdbRating,
    data.Genre
  );
  notification.ondisplay = function() {
               setTimeout(function(){
                  notification.cancel();
               },displayTime); };
  notification.onclick = function() {
    chrome.tabs.create({
                'url': 'http://www.imdb.com/title/' +data.imdbID,
                'selected':true
                });
  };

  notification.show();

  }
  else {
    showError(query);
  }

}


}

function showError(query) {

  var notification = window.webkitNotifications.createNotification(
    '',
    'Movie was not found.',
    'Sorry, but there was no movie ' + query + ' found on IMDB database' 
  );
  notification.ondisplay = function() {
               setTimeout(function(){
                  notification.cancel();
               }, displayTime); };
  notification.onclick = function() {
            notification.cancel();
  };

  notification.show();
}

/**
* This function replaces common separators with blank space
*/
function beautifyString(mname) {

  mname  = mname.split('.').join(' ');
  mname  = mname.split('-').join(' ');
  mname  = mname.split('_').join(' ');

  return mname;
}