var Utils = require('./Utils.js');

module.exports = exports = function (db) {
  if (!(db.config && db.config.url && db.config.db)) {
    throw new Error('Provided nano config has to target a database.');
  }

  var copy = Utils.copy;
  var isFunction = Utils.isFunction;
  var isString = Utils.isString;
  var isArray = Utils.isArray;
  var forEach = Utils.forEach;
  var extend = Utils.extend;
  var capitaliseFirstLetter = Utils.capitaliseFirstLetter;
  var concat = Utils.concat;

  function Liber(data) {
    copy(data || {}, this);
  }

  Liber.mapFunction = function (parse, params) {
    var prop = params.include_docs ? 'doc' : 'value';
    return function (el) {
      return parse(el[prop]);
    };
  };

  Liber.inherit = function (Child, childPrototype, opts) {
    Child = Child || function () {};
    childPrototype = childPrototype || {};
    opts = opts || {};

    if (opts.viewShortcuts) {
      var me = this;
      forEach(opts.viewShortcuts, function (value, key) {
        me.addViewGetter(Child, key, value);
      });
    }

    extend(Child, this);

    Child.prototype = extend(new this, childPrototype, {
      constructor: Child,
      superClass: this
    });
    
    return Child;
  };

  Liber.getFromView = function (design, view, params, cb) {
    if (isFunction(params)) {
      cb = params;
      params = {};
    } else if (isString(params) || isArray(params)) {
      params = {key: params};
    }

    var me = this;

    var mapView = function (el) {
      if (params.include_docs) {
        return me.parse(el.doc);
      } else {
        return me.parse(el.value);
      }
    };
    db.view(design, view, params, function (err, body) {
      if (err) return cb(err);
      cb && cb(err, body.rows.map(me.mapFunction(me.parse.bind(me), params)) );
    });
  };


  Liber.getOneFromView = function (design, view, params, cb) {
    if (isFunction(params)) {
      cb = params;
      params = {};
    } else if (isString(params)) {
      params = {key: params};
    }

    var me = this;

    params.limit = 1;

    db.view(design, view, params, function (err, body) {
      if (err || !body.rows[0]) {
        var e = new Error('Not found.');
        e.status = 409;
        cb && cb(err || e);
      } else {
        cb && cb(err, me.mapFunction(me.parse.bind(me), params)(body.rows[0]) );
      }
    });
  };

  Liber.get = function (params, cb) {
    if (isFunction(params)) {
      cb = params;
      params = {};
    } else if (isString(params)) {
      params = {key: params};
    }

    var me = this;

    var mapView = function (el) {
      if (params.include_docs) {
        return me.parse(el.doc);
      } else {
        return me.parse(el.value);
      }
    };

    db.get(params, function (err, body) {
      if (err) return cb(err);
      cb && cb(err, body.rows.map(me.mapFunction(me.parse.bind(me), params)) );
    });
  };

  Liber.getOne = function (id, params, cb) {
    if (isFunction(params)) {
      cb = params;
      params = {};
    }
    var me = this;

    params.limit = 1;

    db.get(id, params, function (err, body) {
      cb && cb(err, me.parse.call(me, body));
    });
  };

  Liber.parse = function (data) {
    var constr = isFunction(this) ? this : this.constructor;
    return data ? (new constr(data)) : undefined;
  };

  Liber.addViewGetter = function (Class, name, attrs) {
    if (isArray(attrs)) {
      name = capitaliseFirstLetter(name);
      Class[['get', name].join('')] = function () {
        return this.getFromView.apply(this, concat(copy(attrs), arguments));
      };
      Class[['getOne', name].join('')] = function () {
        return this.getOneFromView.apply(this, concat(copy(attrs), arguments));
      };
    } else {
      throw new Error('Getters are generated from array of parameters.');
    }
  };

  Liber.prototype = {
    _: {
    },
    constructor: Liber,
    parse: Liber.parse,
    insert: function (cb) {
      delete this._id;
      delete this._rev;

      this.save(cb);
    },
    save: function (cb) {
      var me = this;

      db.insert(this, function (err, body) {
        if (err) return cb && cb(err);
        me['_id'] = body['id'];
        me['_rev'] = body['rev'];
        cb && cb(err, me, body);
      });
    },
    destroy: function (cb) {
      return db.destroy(this._id, this._rev, cb);
    }
  };

  return Liber;
};

