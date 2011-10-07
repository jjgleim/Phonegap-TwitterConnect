var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc = { _id: '_design/users' };

ddoc.views = {
  users: {
    map: function(doc) {
      emit(doc._id);
    }
  },
  usernames: {
    map: function(doc) {
      emit(doc.name, doc.cleartext);
    }
  }
};

ddoc.lists = {
  array: function(head, req) {
    start({"headers":{"Content-Type" : "application/json; charset=utf-8"}});
    if ('callback' in req.query) send(req.query['callback'] + "(");

    var headers = [];
    while (row = getRow()) {
      headers.push(row.key);
    }
    send(JSON.stringify(headers));

    if ('callback' in req.query) send(")");
  },
  arrayvalues: function(head, req) {
    start({"headers":{"Content-Type" : "application/json; charset=utf-8"}});
    if ('callback' in req.query) send(req.query['callback'] + "(");

    var headers = [];
    while (row = getRow()) {
      headers.push(row.value);
    }
    send(JSON.stringify(headers));

    if ('callback' in req.query) send(")");
  }
}

ddoc.validate_doc_update = function (newDoc, oldDoc, userCtx) {
  if (userCtx.roles.indexOf('_admin') > -1) return;
  if (oldDoc && (newDoc._id !== oldDoc._id)) throw "That username is taken!";
  if (newDoc._deleted === true && userCtx.roles.indexOf('_admin') === -1) throw "Only admin can delete documents.";
};

//couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));

module.exports = ddoc;