define(
  ["exports"],
  function(__exports__) {
    "use strict";
    var namespace = 'lio';

    function tagForType(type) {
      return namespace + '-' + type;
    }

    __exports__.tagForType = tagForType;__exports__["default"] = namespace;
  });