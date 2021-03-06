function initialize () {
  retrieveBookmarks();
  attachAddButton();
}

function retrieveBookmarks () {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/bookmarks');
  xhr.onload = function () {
    appendBookmarks(JSON.parse(xhr.response));
  };
  xhr.send(null);
}

function appendBookmarks (bookmarks) {
  var element = document.querySelector('ul');
  for (var i in bookmarks) {
    appendBookmark(element, bookmarks[i]);
  }
}

function appendBookmark (target, bookmark) {
  var li = document.createElement('li');
  var title = bookmark.title;
  var url = bookmark.url;
  li.innerHTML = '<a href="' + url + '">' + title + '</a';
  li.setAttribute('id', bookmark.id);
  target.appendChild(li);
  var deleteButton = createDeleteButton(bookmark.id);
  target.appendChild(deleteButton);
}

function attachAddButton () {
  var button = document.querySelector('.add');
  button.addEventListener('click', addBookmark);
}

function addBookmark (e) {
  e.preventDefault();
  var title = document.querySelector('.title').value;
  var url = document.querySelector('.url').value;
  var bookmark = {title: title, url: url};
  if (isValidBookmark(bookmark)) {
    bookmark.url = fixUrl(url);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "http://localhost:3000/bookmarks/", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(bookmark));
    xhr.onload = function (data) {
      bookmarkID = JSON.parse(data.currentTarget.response).id;
      bookmark.id = bookmarkID;
      debugger
      var element = document.querySelector('ul');
      appendBookmark(element, bookmark);
      addMessage("Bookmark Added!");
      resetFields();
      };
  } else {
    addMessage("Invalid Bookmark!");
  }
}

function isValidBookmark (bookmark) {
  return bookmark.title.length > 0 && bookmark.url.length > 0;
}

function fixUrl (url) {
  if (url.slice(0,7) === "http://") {
    return url;
  } else if (url.slice(0,4) === "www.") {
    return "http://" + url;
  } else {
    return "http://www." + url;
  }
}

function resetFields () {
  var fields = document.querySelectorAll('form input');
  var title = fields[0];
  var url = fields[1];
  title.value = "";
  url.value = "";
}

function createDeleteButton (id) {
  var button = document.createElement('input');
  button.type = "submit";
  button.className = "delete";
  button.value = "Delete";
  button.addEventListener('click', deleteBookmark.bind(null, id));
  return button;
}

function deleteBookmark (id) {
  var xhr = new XMLHttpRequest();
  var url = "/bookmarks/" + id;
  xhr.open('DELETE', url);
  xhr.send(null);
  xhr.onload = function () {
    removeBookmark(id);
    addMessage("Bookmark Deleted!");
  };
}

function removeBookmark (id) {
  document.getElementById(id).nextSibling.remove();
  document.getElementById(id).remove();
}

function addMessage (text) {
  var body = document.querySelector('body');
  var message = document.createElement('div');
  message.innerHTML = text;
  message.className = "message";
  body.appendChild(message);
  setTimeout(removeMessage, 1000);
}

function removeMessage () {
  var message = document.querySelector('.message');
  message.parentNode.removeChild(message);
}

document.addEventListener('DOMContentLoaded', initialize);
