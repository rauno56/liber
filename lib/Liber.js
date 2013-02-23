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

  function toJsonReplacer(key, value) {
    var val = value;

    if (key[0]=='$') {
      val = undefined;
    }

    return val;
  }
  
  function toJson(obj, pretty) {
    return JSON.stringify(obj, toJsonReplacer, pretty ? '  ' : null);
  }

  function Liber(data) {
    copy(data || {}, this);

    if (data && data['_id'] && data['_rev']) {
      this.updateImage();
    }
  }

  Liber.mapFunction = function (parse, params) {
    var prop = params.include_docs ? 'doc' : 'value';
    return function (el) {
      return parse(el[prop]);
    };
  };

  Liber.inherit = function (Child, childPrototype, opts) {
    console.log(this);
    Child = Child || function () {};
    childPrototype = childPrototype || {};
    opts = opts || {};

    console.log('opts', opts.viewShortcuts);
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

  Liber.getOne = function (id, params, cb) {
    if (isFunction(params)) {
      cb = params;
      params = {};
    }
    var me = this;

    params.limit = 1;

    db.get(id, params, function (err, body) {
      cb && cb(err, me.parse(body));
    });
  };

  var addViewGetter = Liber.addViewGetter = function (Class, name, attrs) {
    console.log('add view getter in Liber constructor', name, attrs);
    if (isArray(attrs) && attrs.length == 2) {
      console.log('capitaliseFirstLetter', capitaliseFirstLetter);
      Class[['get', capitaliseFirstLetter(name)].join('')] = function () {
        console.log('get from', attrs);
      };
      Class[['getOne', capitaliseFirstLetter(name)].join('')] = function () {
        console.log('get from', attrs);
      };
    } else {
      throw new Error('Getters are generated from array of two attributes: [design, view].');
    }
  };

  Liber.parse = function (data) {
    var constr = this.name ? this : this.constructor;
    return data ? (new constr(data)) : undefined;
  };

  Liber.prototype = {
    _: {
      image: ''
    },
    constructor: Liber,
    get dirty () {
      return toJson(this) !== this._.image;
    },
    parse: Liber.parse,
    // constructor: Liber,
    insert: function (cb) {
      delete this._id;
      delete this._rev;

      this.save(cb);
    },
    save: function (cb) {
      var me = this;

      if (this) {
        db.insert(this, function (err, body) {
          if (err) return cb && cb(err);
          me['_id'] = body['id'];
          me['_rev'] = body['rev'];
          me.updateImage();
          cb && cb(err, me, body);
        });
      } else {
        cb(new Error('Object has no properties to save'), undefined);
      }
    },
    destroy: function (cb) {
      console.log('destroying', this);
      return db.destroy(this._id, this._rev, cb);
    },
    updateImage: function () {
      this._.image = toJson(this);
    }
  };

  return Liber;
};
