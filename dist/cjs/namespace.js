"use strict";
var namespace = 'lio';

function tagForType(type) {
  return namespace + '-' + type;
}

exports.tagForType = tagForType;exports["default"] = namespace;