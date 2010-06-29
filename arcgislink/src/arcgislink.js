/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @name ArcGIS Server Link for Google Maps JavaScript API V3
 * @version 1.0
 * @author: Nianwei Liu (nianwei at gmail dot com)
 * @fileoverview 
 *  <p><a href="examples.html">Examples</a>
 *   </p> 
 *  <p>This library lets you add map resources accessible via 
 *    <a href = 'http://sampleserver3.arcgisonline.com/ArcGIS/SDK/REST/index.html'> 
 *    ESRI ArcGIS Server&#0153; REST API</a> into <a 
 *    href='http://code.google.com/apis/maps/documentation/javascript/'>
 *    Google Maps API V3</a> and provide some additional support for map tiles created 
 *    with different spatial reference and tiling scheme.</p>
 *    </p>.
 *    <table style = 'border:0px'>
 *    <tr>
 *    <td colspan=2 style='border:0px;'>Google Maps API V3 related classes</td>
 *    <td colspan=2 style='border:0px;'>REST API related classes</td>
 *    </tr>
 *    <tr>
 *    <td style = 'border:0px;width:200px'>
 *    {@link TileLayer}<br/>
 *    {@link TileLayerOptions}<br/>
 *    {@link MapType}<br/>
 *    {@link MapTypeOptions}<br/>
 *    {@link MapOverlay}<br/>
 *    {@link MapOverlayOptions}<br/>
 *    </td>
 *    <td style = 'border:0px;width:200px'>
 *    {@link Projection}<br/>
 *    {@link Util} <br/> 
 *    </td>
 *    <td style = 'border:0px;width:200px'>
 *    {@link Catalog}<br/>
 *    {@link MapService}<br/></b>
 *    {@link Layer}<br/>
 *    {@link GeocodeService}<br/>
 *    {@link GeometryService}<br/>
 *     <br/></td>
 *     <td style = 'border:0px;width:200px'>
 *    {@link SpatialReference}<br/>
 *    {@link SpatialReferences}<br/>
 *    {@link Geographic}<br/>
 *    {@link LambertConformalConic}<br/>
 *    {@link TransverseMercator}<br/>
 *    {@link SphereMercator}<br/>
 *    {@link SpatialRelationship}<br/>
 *     </td>
 *    </tr></table>
 *    <p> There are many objects used in the REST API that do not require 
 *    a constructor and can be
 *    used just as object literal in the operation:<br/> 
 *    (note the name of the type does not matter for object literals)</p>
 *    <table style = 'border:0px'><tr>
 *    <td style = 'border:0px;width:200px'>
 *    
 *    {@link Field}<br/>
 *    {@link TileInfo}<br/>
 *    {@link LOD}<br/>
 *    {@link TimeInfo}<br/>
 *    {@link DrawingInfo}<br/>
 *    {@link ExportMapOptions}<br/>
 *    {@link MapImage}<br/>
 *    {@link IdentifyOptions}<br/>
 *    {@link IdentifyResults}<br/>
 *    {@link IdentifyResult}<br/>
 *     <br/></td>
 *     <td style = 'border:0px;width:200px'>
 *    {@link QueryOptions}<br/>
 *    {@link ResultSet}<br/>
 *    
 *    {@link FindParameters}<br/>
 *    {@link FindResults}<br/>
 *    {@link FindResult}<br/>
 *     </td>
 *     <td style = 'border:0px;width:200px'>
 *    {@link GeocodeParameters}<br/>
 *    {@link GeocodeResults}<br/>
 *    {@link GeocodeResult}<br/>
 *    {@link ReverseGeocodeParameters}<br/>
 *    {@link ReverseGeocodeResult}<br/>
 *    </td>
 *     <td style = 'border:0px;width:200px'>
 *    {@link Geometry}<br/>
 *    {@link Point}<br/>
 *    {@link Polyline}<br/>
 *    {@link Polygon}<br/>
 *    {@link Envelope}<br/>
 *    {@link Multipoint}<br/>
 *    {@link Feature}<br/>
 *    {@link Domain}<br/>
 *    </td>
 *    <td style = 'border:0px;width:200px'>
 *    {@link Color}<br/>
 *    {@link SimpleMarkerSymbol}<br/>
 *    {@link SimpleLineSymbol}<br/>
 *    {@link SimpleFillSymbol}<br/>
 *    {@link PictureMarkerSymbol}<br/>
 *    {@link PictureFillSymbol}<br/>
 *    {@link TextSymbol}<br/>
 *     </td>
 *    </tr></table>
 */
(function () {

  /*jslint browser:true */
  /*global escape */
  

  //======= utility/helper functions ==========//
  /**
   * create a namespace by name such as a.b.c
   * @param {String} ns
   */
  var namespace = function (ns) {
    var i, c, n;
    var names = ns.split('.');
    n = window;
    for (i = 0, c = names.length; i < c; i ++) {
      n[names[i]] = n[names[i]] || {};
      n = n[names[i]];
    }
    return n;
  };

  var W = window;
  var G = namespace('google.maps');
 /**
   * Extract the substring from full string, between start string and end string
   * @param {String} full
   * @param {String} start
   * @param {String} end
   */
  var extractString = function (full, start, end) {
    var i = (start === '') ? 0 : full.indexOf(start);
    var e = end === '' ? full.length : full.indexOf(end, i + start.length);
    return full.substring(i + start.length, e);
  };

  /**
   * Check if the object is String
   * @param {Object} o
   */
  var isString = function (o) {
    return typeof o === 'string';
  };
  
  /**
   * Check if the object is array
   * @param {Object} o
   */
  var isArray = function (o) {
    return o && o.splice;
  };

  /**
   * Add the property of the source object to destination object 
   * if not already exists.
   * @param {Object} dest
   * @param {Object} src
   * @param {Boolean} force
   * @return {Object}
   */
  var augmentObject = function (src, dest, force) {
    if (src && dest) {
      var p;
      for (p in src) {
        if (force || !(p in dest)) {
          dest[p] = src[p];
        }
      }
    }
    return dest;
  };

  /**
   * Find out the index of obj in array
   * @param {Array} arr
   * @param {Object} obj
   * @param {Boolean} ignoreCase
   */
  var indexOfObj = function (arr, obj, ignoreCase) {
    if (arr && obj) {
      if (arr.indexOf && !ignoreCase) {
        return arr.indexOf(obj);
      } else {
        for (var i = 0, c = arr.length; i < c; i++) {
          if (arr[i] === obj || (ignoreCase === true && arr[i].toString().toLowerCase() === obj.toString().toLowerCase())) {
            return i;
          }
        }
      }
    }
    return -1;
  };
  
  var mergeArray = function (arr, sub) {
    for (var i = 0, c = sub.length; i < c; i++) {
      arr.push(sub[i]);
    }
    return arr;
  };
  
  /**
   * Remove element from array
   * @param {Array} arr
   * @param {Object} elm
   */
  var removeFromArray = function (arr, elm) {
    var i = indexOfObj(arr, elm);
    if (i !== -1) {
      arr.splice(i, 1);
    }
  };
  /**
   * Get the attribute value, case insensitive
   * @param {Object} attrs object with name-value pair
   * @param {String} name attribue name
   * @return {Object}
   */
  var getAttrValue = function (attrs, name) {
    if (typeof attrs[name] !== 'undefined') {
      return attrs[name];
    }
    for (var x in attrs) {
      if (attrs.hasOwnProperty(x)) {
        if (name.toLowerCase() === x.toString().toLowerCase()) {
          return attrs[x];
        }
      }
    }
    return null;
  };
  
  /*
   * Wrapper around google.maps.event.trigger
   * @param {Object} src
   * @param {String} evtName
   * @param {Object} args
   */
  var triggerEvent = function (src, evtName, args) {
    if (G.event) {
      G.event.trigger.apply(this, arguments);
    }
  };
  /**
   * get REST format for 2 time
   * @param {Date} time
   * @param {Date} endTime
   */
  var getTimeString = function (time, endTime) {
    var ret = '';
    if (time) {
      ret +=  (time.getTime() - time.getTimezoneOffset() * 60000);
    }
    if (endTime) {
      ret += ', ' + (endTime.getTime() - endTime.getTimezoneOffset() * 60000);
    } 
    return ret;
  }
  /**
   * Set opacity of a node.
   * @param {Node} node
   * @param {Number} 0-1
   */
  var setOpacity = function (node, op) {
    op = Math.min(Math.max(op, 0), 1);
    if (node) {
      var st = node.style;
      if (typeof st.opacity !== 'undefined') {
        st.opacity = op;
      }
      if (typeof st.filters !== 'undefined') {
        st.filters.alpha.opacity = Math.floor(100 * op);
      }
      if (typeof st.filter !== 'undefined') {
        st.filter = "alpha(opacity:" + Math.floor(op * 100) + ")";
      }
    }
  };
  
  var log = function (msg) {
    if (window.console) {
      console.log(msg);
    } else {
      var l = document.getElementById('_ags_log');
      if (l) {
        l.innerHTML = l.innerHTML + msg + '<br/>';
      }
    }
  };
  
 
 /** Radius Per Degree
 * @private
 */
  var RAD_DEG  =  Math.PI / 180;
 
  // The JSDOC tool not work with enums yet?
  
  /*
   * A list of utilities ((<code>gmaps.gis.Util</code>) 
   * for commonly used functions.
   * @name ArcGISUtil
   * @namespace
   */
  var Util = {};
  var jsonpID_ = 0;
  // cross domain function list. this namespace is what gmap is using
  window.ags_jsonp = window.ags_jsonp || {};
  var xdc = window.ags_jsonp;
  var C = {
    json: 'json',
    callback: 'callback'
  };
  
  /**
   * Make Cross Domain Calls. This function returns the
   * script ID which can be used to track the requests. parameters:
   * <ul>
   * <li>url: url of server resource
   * <li>params: an object with name,value pairs. value must be string
   * <li>callbackName: Callback parameter name the server is expecting.e.g:'callback'
   * <li>callbackFn: the actual callback function.
   * </ul>
   * @param {String} url
   * @param {Object} params
   * @param {String} callbackName
   * @param {Function} callbackFn
   * @return {String} scriptID
   */
  Util.getJSON = function (url, params, callbackName, callbackFn) {
    var sid = 'ags_jsonp' + (jsonpID_++) + '_' + Math.floor(Math.random() * 1000000);
    var full = url + (url.indexOf('?') === -1 ? '?' : '&');
    if (params) {
      params.f = params.f || 'json';
      for (var x in params) {
        if (params.hasOwnProperty(x) && params[x] !== null && params[x] !== undefined) { // wont sent undefined.
          //jslint complaint about escape cause NN does not support it.
          full += (x + '=' + (escape?escape(params[x]):encodeURIComponent(params[x])) + '&');
        }
      }
    }
    var head = document.getElementsByTagName("head")[0];
    if (!head) {
      throw new Error("document must have header tag");
    }
    var script = document.createElement("script");
    script.src = full + callbackName + '=ags_jsonp.' + sid;
    script.id = sid;
    var jsonpcallback = function () {
      delete xdc[sid];
      head.removeChild(script);
      script = null;
      callbackFn.apply(null, arguments);
      /**
       * This event is fired after a REST JSONP response was returned by server.
       * @name Util#jsonpend
       * @param {String} scriptID
       * @event
       */
      triggerEvent(Util, 'jsonpend', sid);
    };
    xdc[sid] = jsonpcallback;
    head.appendChild(script);
    /**
     * This event is fired before a REST request sent to server.
     * @name Util#jsonpstart
     * @param {String} scriptID
     * @event
     */
    triggerEvent(Util, 'jsonpstart', sid);
    return sid;
  };
  /**
   * @private for now.
   * Get the computed value of a property in an option Hierarchy: root, serviceOptions, layerOptions, etc.
   * passing default value, option object
   * @param {Object} defaultValue
   * @param {Object} options
   * @param {String} propName
   * @param {String} opt_serviceName
   * @param {String} opt_layerName
   * @return {Object}
   
  Util.getOptionValue = function (defaultValue, options, propName, opt_serviceName, opt_layerName) {
    var val = augmentObject(defaultValue, {});
    if (options) {
      val = augmentObject(options[propName], val, true);
      if (opt_serviceName && options.serviceOptions && options.serviceOptions[opt_serviceName]) {
        var svcOpts = options.serviceOptions[opt_serviceName];
        val = augmentObject(svcOpts[propName], val, true);
        if (opt_layerName && svcOpts.layerOptions && svcOpts.layerOptions[opt_layerName]) {
          var layOpts = svcOpts.layerOptions[opt_layerName];
          val = augmentObject(layOpts[propName], val, true);
        }
      }
    }
    return val;
  };
*/
  
  /**
   * Some operations such as identify and find are operated against multiple layers.
   * The results are in a flat list. This method will group the result by layer and
   * return an object with key as layer name, value as a {@link ResultSet}.
   * @param {IdentifyResults|FindResults} results
   * @return {Object}
   */
  Util.groupResultsByLayer = function (json) {
    var ret = {};
    var res, layerName;
    var results = json.results;
    if (results) {
      for (var i = 0, c = results.length; i < c; i++) {
        res = results[i];
        layerName = res.layerName;
        if (!ret[layerName]) {
          var fieldAliases = {};//[];
          for (var x in res.attributes) {
            if (res.attributes.hasOwnProperty(x)) {
             // fields.push(x);
              fieldAliases[x] = x;
            }
          }
          var set = {
            displayFieldName: res.displayFieldName,
            spatialReference: res.geometry ? res.geometry.spatialReference : null,
            geometryType: res.geometryType,
            fieldAliases: fieldAliases,
            features: []
          };
          ret[layerName] = set;
        }
        // more than we need but no need to remove them.
        ret[layerName].features.push(res);
      }
    }
    return ret;
  };
  /**
   * @private for now
   * Get html for a resultset
   * @param {Object} res
   * @param {Boolean} vertical
   */
  Util.getResultSetHtml = function (res, style) {
    var html = '<table class="ags-resultset">';
    var i, j, c, d;
    style = style || (res.features.length === 1? 'v' : 'h');
    var fields = [];
    for (var x in res.fieldAliases) {
      if (res.fieldAliases.hasOwnProperty(x)) {
        fields.push(x);
      }
    }
    if (style === 'h') {
      html += '<tr>';
      for (i = 0, c = fields.length; i < c; i++) {
        html += '<th class="ags-fieldname">' + res.fieldAliases[fields[i]] + '</th>';
      }
      html += '</tr>';
    }
    for (i = 0, c = res.features.length; i < c; i++) {
      var atts = res.features[i].attributes;
      if (style === 'h') {
        html += '<tr>';
      } else if (i > 0) {
        html += '<tr><td colspan="2"><hr/></td></tr>';
      }
      for (j = 0, d = fields.length; j < d; j++) {
        if (style === 'h') {
          html += '<td class="ags-fieldvalue">' + atts[fields[j]] + '</td>';
        } else {
          html += '<tr><td class="ags-fieldname">' + res.fieldAliases[fields[j]] + '</td><td class="ags-fieldvalue">' + atts[fields[j]] + '</td></tr>';
        }
      }
      if (style === 'h') {
        html += '</tr>';
      }
    }
    html += '</table>';
    return html;
  };
  /**
   * @name Config
   * @class This is an object literal that sets common configuration values used across the lib.
   * @property {Number} [maxPolyPoints  = 1000] max number of points allowed in polyline's path or polygon's ring. If exceed, no overlay will be created.(for now)
   * @property {StyleOptions} [style] The default style used for OverlayViews.
   */
  var Config = {
    maxPolyPoints: 1000,
    style: {
      icon: null,
      strokeColor: "#FFFF00",
      strokeWeight: 8,
      strokeOpacity: 0.5,
      outlineColor: "#FF0000",
      outlineWeight: 2,
      outlineOpacity: 0.5,
      fillColor: "#FFFF00",
      fillOpacity: 0.5
    }
  };
  /**
   * @name SpatialReferences
   * @class SpatialReferences has an internal collection of Spatial Refeneces supported in the application.
   * The key of the collection is the wkid, and value is an instance of
   * {@link ArcGISSpatialReference}.
   * The {@link TileLayer}'s Spatial Refeneces <b>must be already added to collection
   * before it's constructor can be called</b>.
   * The following ArcGISSpatialReference are added by default:
   * <code>
   * <br/> 4326: WGS84 ArcGISGeographic Coordinate System;
   * <br/> 102113: Web-Mercator used by Google Maps, Virtual Earth etc.
   * </code>
   * <br/> The application can add a supported spatial references using static method
   * <code>SpatialReferences.addSpatialReference(wkid,sr);</code>
   */
  var SpatialReferences = {};
  
  /**
   * Create A Generic Spatial Reference Object
   * The <code>params </code> passed in constructor is a javascript object literal and depends on
   * the type of Coordinate System to construct.
   * @name SpatialReference
   * @class This  class (<code>gmaps.ags.SpatialReference</code>) is for coordinate systems that converts value 
   * between geographic and real-world coordinates. The following classes extend this class:
   *    {@link Geographic}, {@link SphereMercator}, {@link LambertConformalConic}, and {@link TransverseMercator}.
   * @constructor
   * @property {String} [wkid] well-known coodinate system id (EPSG code)
   * @property {String} [wkt] well-known coodinate system text (EPSG code)
   * @param {Object} params
   */
  function SpatialReference(params) {
    params  =  params || {};
    this.wkid  =  params.wkid;
    this.wkt  =  params.wkt;
  }

  /**
   * get wkid or wkt depending on which is available.
   * @return {wkid or wkt}
   */
  SpatialReference.prototype.getKey  =  function () {
    return this.wkid? this.wkid : this.wkt?this.wkt:null;
  };
  /**
   * Convert Lat Lng to real-world coordinates.
   * Note both input and output are array of [x,y], although their values in different units.
   * @param {Number[]} lnglat
   * @return {Number[]}
   */
  SpatialReference.prototype.forward  =  function (lnglat) {
    return lnglat;
  };
  /**
   * Convert real-world coordinates  to Lat Lng.
   * Note both input and output are are array of [x,y], although their values are different.
   * @param {Number[]}  coords
   * @return {Number[]}
   */
  SpatialReference.prototype.reverse  =  function (coords) {
    return coords;
  };
  /**
   * Get the map the periodicity in x-direction, in map units NOT pixels
   * @return {Number} periodicity in x-direction
   */
  SpatialReference.prototype.getCircumference  =  function () {
    return 360;
  };

  /**
   * Creates a Geographic Coordinate System. e.g.:<br/>
   * <code>var g  = new Geographic({"wkid":4326});<br/>
   * var g2 = new gmaps.ags.Geographic({"wkid":4326});
   * </code>
   * @name Geographic
   * @class This class (<code>gmaps.ags.Geographic</code>) will simply retuns same LatLng as Coordinates. 
   *   The <code>param</code> should have wkid property. Any Geographic Coordinate Systems (eg. WGS84(4326)) can 
   *   use this class As-Is. 
   *   <br/>Note:<b> This class does not support datum transformation</b>.
   * @extends SpatialReference
   * @param {Object} params
   */
  function Geographic(params) {
    params  = params || {};
    SpatialReference.call(this, params);
  }
  Geographic.prototype  = new SpatialReference();

/**
 * Create a Lambert Conformal Conic Projection based Spatial Reference. The <code>params</code> passed in construction should
 * include the following properties:<code>
 * <br/>-wkid: well-known id
 * <br/>-semi_major:  ellipsoidal semi-major axis in meter
 * <br/>-unit: meters per unit
 * <br/>-inverse_flattening: inverse of flattening of the ellipsoid where 1/f  =  a/(a - b)
 * <br/>-standard_parallel_1: phi1, latitude of the first standard parallel
 * <br/>-standard_parallel_2: phi2, latitude of the second standard parallel
 * <br/>-latitude_of_origin: phiF, latitude of the false origin
 * <br/>-central_meridian: lamdaF, longitude of the false origin  (with respect to the prime meridian)
 * <br/>-false_easting: FE, false easting, the Eastings value assigned to the natural origin
 * <br/>-false_northing: FN, false northing, the Northings value assigned to the natural origin
 * </code>
 * <br/> e.g. North Carolina State Plane NAD83 Feet: <br/>
 * <code> var ncsp82  = new gmaps.ags.LambertConformalConic({wkid:2264, semi_major: 6378137.0,inverse_flattening: 298.257222101,
 *   standard_parallel_1: 34.33333333333334, standard_parallel_2: 36.16666666666666,
 *   central_meridian: -79.0, latitude_of_origin: 33.75,'false_easting': 2000000.002616666,
 *   'false_northing': 0, unit: 0.3048006096012192 }); </code>
 * @name LambertConformalConic
 * @class This class (<code>gmaps.ags.LambertConformalConic</code>) represents a Spatial Reference System based on <a target  = wiki href  = 'http://en.wikipedia.org/wiki/Lambert_conformal_conic_projection'>Lambert Conformal Conic Projection</a>. 
 * @extends SpatialReference
 * @constructor
 * @param {Object} params
 */
  function LambertConformalConic(params) {
    //http://pubs.er.usgs.gov/djvu/PP/PP_1395.pdf
    // http://www.posc.org/Epicentre.2_2/DataModel/ExamplesofUsage/eu_cs34.html
    //for NCSP83: GLatLng(35.102363,-80.5666)<  === > GPoint(1531463.95, 495879.744);
    params = params || {};
    SpatialReference.call(this, params);
    var f_i = params.inverse_flattening;
    var phi1 = params.standard_parallel_1 * RAD_DEG;
    var phi2 = params.standard_parallel_2 * RAD_DEG;
    var phiF = params.latitude_of_origin * RAD_DEG;
    this.a_ = params.semi_major / params.unit;
    this.lamdaF_ = params.central_meridian * RAD_DEG;
    this.FE_ = params.false_easting;
    this.FN_ = params.false_northing;
    
    var f = 1.0 / f_i; //e: eccentricity of the ellipsoid where e^2  =  2f - f^2 
    var es = 2 * f - f * f;
    this.e_ = Math.sqrt(es);
    var m1 = this.calc_m_(phi1, es);
    var m2 = this.calc_m_(phi2, es);
    var tF = this.calc_t_(phiF, this.e_);
    var t1 = this.calc_t_(phi1, this.e_);
    var t2 = this.calc_t_(phi2, this.e_);
    this.n_ = Math.log(m1 / m2) / Math.log(t1 / t2);
    this.F_ = m1 / (this.n_ * Math.pow(t1, this.n_));
    this.rF_ = this.calc_r_(this.a_, this.F_, tF, this.n_);
  }
  
  LambertConformalConic.prototype = new SpatialReference();
  /**
   * calc_m_
   * @param {Object} phi
   * @param {Object} es
   */
  LambertConformalConic.prototype.calc_m_ = function (phi, es) {
    var sinphi = Math.sin(phi);
    return Math.cos(phi) / Math.sqrt(1 - es * sinphi * sinphi);
  };
  /**
   * calc_t_
   * @param {Object} phi
   * @param {Object} e
   */
  LambertConformalConic.prototype.calc_t_ = function (phi, e) {
    var esinphi = e * Math.sin(phi);
    return Math.tan(Math.PI / 4 - phi / 2) / Math.pow((1 - esinphi) / (1 + esinphi), e / 2);
  };
  /**
   * calc_r_
   * @param {Object} a
   * @param {Object} F
   * @param {Object} t
   * @param {Object} n
   */
  LambertConformalConic.prototype.calc_r_ = function (a, F, t, n) {
    return a * F * Math.pow(t, n);
  };
  /**
   * calc_phi_
   * @param {Object} t_i
   * @param {Object} e
   * @param {Object} phi
   */
  LambertConformalConic.prototype.calc_phi_ = function (t_i, e, phi) {
    var esinphi = e * Math.sin(phi);
    return Math.PI / 2 - 2 * Math.atan(t_i * Math.pow((1 - esinphi) / (1 + esinphi), e / 2));
  };
  /**
   * solve phi iteratively.
   * @param {Object} t_i
   * @param {Object} e
   * @param {Object} init
   */
  LambertConformalConic.prototype.solve_phi_ = function (t_i, e, init) {
    // iteration
    var i = 0;
    var phi = init;
    var newphi = this.calc_phi_(t_i, e, phi);//this.
    while (Math.abs(newphi - phi) > 0.000000001 && i < 10) {
      i++;
      phi = newphi;
      newphi = this.calc_phi_(t_i, e, phi);//this.
    }
    return newphi;
  };
  /** 
   * see {@link SpatialReference}
   * @param {Number[]} lnglat
   * @return {Number[]}
   */
  LambertConformalConic.prototype.forward = function (lnglat) {
    var phi = lnglat[1] * RAD_DEG;// (Math.PI / 180);
    var lamda = lnglat[0] * RAD_DEG;
    var t = this.calc_t_(phi, this.e_);
    var r = this.calc_r_(this.a_, this.F_, t, this.n_);
    var theta = this.n_ * (lamda - this.lamdaF_);
    var E = this.FE_ + r * Math.sin(theta);
    var N = this.FN_ + this.rF_ - r * Math.cos(theta);
    return [E, N];
  };
  /**
   * see {@link SpatialReference}
   * @param {Number[]}  coords
   * @return {Number[]}
   */
  LambertConformalConic.prototype.reverse = function (coords) {
    var E = coords[0];
    var N = coords[1];
    var theta_i = Math.atan((E - this.FE_) / (this.rF_ - (N - this.FN_)));
    var r_i = (this.n_ > 0 ? 1 : -1) * Math.sqrt((E - this.FE_) * (E - this.FE_) + (this.rF_ - (N - this.FN_)) * (this.rF_ - (N - this.FN_)));
    var t_i = Math.pow((r_i / (this.a_ * this.F_)), 1 / this.n_);
    var phi = this.solve_phi_(t_i, this.e_, 0);
    var lamda = theta_i / this.n_ + this.lamdaF_;
    return [lamda / RAD_DEG, phi / RAD_DEG];
    
  };
  /**
   *  see {@link SpatialReference}
   *  @return {Number}
   */
  LambertConformalConic.prototype.getCircumference = function () {
    return Math.PI * 2 * this.a_;
  };
		
		
/**
 * Create a Transverse Mercator Projection. The <code>params</code> passed in constructor should contain the 
 * following properties: <br/>
 * <code>
 * <br/>-wkid: well-known id
 * <br/>-semi_major:  ellipsoidal semi-major axis in meters
 * <br/>-unit: meters per unit
 * <br/>-inverse_flattening: inverse of flattening of the ellipsoid where 1/f  =  a/(a - b)
 * <br/>-Scale Factor: scale factor at origin
 * <br/>-latitude_of_origin: phiF, latitude of the false origin
 * <br/>-central_meridian: lamdaF, longitude of the false origin  (with respect to the prime meridian)
 * <br/>-false_easting: FE, false easting, the Eastings value assigned to the natural origin 
 * <br/>-false_northing: FN, false northing, the Northings value assigned to the natural origin 
 * </code>
 * <br/>e.g. Georgia West State Plane NAD83 Feet:  
 * <br/><code> var gawsp83  = new gmaps.ags.TransverseMercator({wkid: 102667, semi_major:6378137.0,
 *  inverse_flattening:298.257222101,central_meridian:-84.16666666666667, latitude_of_origin: 30.0,
 *  scale_factor:0.9999,'false_easting':2296583.333333333, 'false_northing':0, unit: 0.3048006096012192});
 *  </code>
 * @param {Object} params 
 * @name TransverseMercator
 * @class This class (<code>gmaps.ags.TransverseMercator</code>) represents a Spatial Reference System based on 
 * <a target  = wiki href  = 'http://en.wikipedia.org/wiki/Transverse_Mercator_projection'>Transverse Mercator Projection</a>
 * @extends SpatialReference
 */
  function TransverseMercator(params) {
    params = params || {};
    SpatialReference.call(this, params);
    //GLatLng(33.74561,-84.454308)<  === >  GPoint(2209149.07977075, 1362617.71496891);
    this.a_ = params.semi_major / params.unit;//this.
    var f_i = params.inverse_flattening;
    this.k0_ = params.scale_factor;
    var phiF = params.latitude_of_origin * RAD_DEG;//(Math.PI / 180);
    this.lamdaF_ = params.central_meridian * RAD_DEG;
    this.FE_ = params.false_easting;//this.
    this.FN_ = params.false_northing;//this.
    var f = 1.0 / f_i;//this.
    /*e: eccentricity of the ellipsoid where e^2  =  2f - f^2 */
    this.es_ = 2 * f - f * f;
    //var _e  =  Math.sqrt(this.es_);
    /* e^4 */
    this.ep4_ = this.es_ * this.es_;
    /* e^6 */
    this.ep6_ = this.ep4_ * this.es_;
    /* e'  second eccentricity where e'^2  =  e^2 / (1-e^2) */
    this.eas_ = this.es_ / (1 - this.es_);
    this.M0_ = this.calc_m_(phiF, this.a_, this.es_, this.ep4_, this.ep6_);
  }
  
  TransverseMercator.prototype = new SpatialReference();
  /**
   * calc_m_
   * @param {Object} phi
   * @param {Object} a
   * @param {Object} es
   * @param {Object} ep4
   * @param {Object} ep6
   */
  TransverseMercator.prototype.calc_m_ = function (phi, a, es, ep4, ep6) {
    return a * ((1 - es / 4 - 3 * ep4 / 64 - 5 * ep6 / 256) * phi - (3 * es / 8 + 3 * ep4 / 32 + 45 * ep6 / 1024) * Math.sin(2 * phi) + (15 * ep4 / 256 + 45 * ep6 / 1024) * Math.sin(4 * phi) - (35 * ep6 / 3072) * Math.sin(6 * phi));
  };
  /**
   * see {@link SpatialReference}
   * @param {Number[]} lnglat
   * @return {Number[]}
   */
  TransverseMercator.prototype.forward = function (lnglat) {
    var phi = lnglat[1] * RAD_DEG;// (Math.PI / 180);
    var lamda = lnglat[0] * RAD_DEG;//(Math.PI / 180);
    var nu = this.a_ / Math.sqrt(1 - this.es_ * Math.pow(Math.sin(phi), 2));
    var T = Math.pow(Math.tan(phi), 2);
    var C = this.eas_ * Math.pow(Math.cos(phi), 2);
    var A = (lamda - this.lamdaF_) * Math.cos(phi);
    var M = this.calc_m_(phi, this.a_, this.es_, this.ep4_, this.ep6_);
    var E = this.FE_ + this.k0_ * nu * (A + (1 - T + C) * Math.pow(A, 3) / 6 + (5 - 18 * T + T * T + 72 * C - 58 * this.eas_) * Math.pow(A, 5) / 120);
    var N = this.FN_ + this.k0_ * (M - this.M0_) + nu * Math.tan(phi) * (A * A / 2 + (5 - T + 9 * C + 4 * C * C) * Math.pow(A, 4) / 120 + (61 - 58 * T + T * T + 600 * C - 330 * this.eas_) * Math.pow(A, 6) / 720);
    return [E, N];
  };
  /**
   * see {@link SpatialReference}
   * @param {Number[]}  coords
   * @return {Number[]}
   */
  TransverseMercator.prototype.reverse = function (coords) {
    var E = coords[0];
    var N = coords[1];
    var e1 = (1 - Math.sqrt(1 - this.es_)) / (1 + Math.sqrt(1 - this.es_));
    var M1 = this.M0_ + (N - this.FN_) / this.k0_;
    var mu1 = M1 / (this.a_ * (1 - this.es_ / 4 - 3 * this.ep4_ / 64 - 5 * this.ep6_ / 256));
    var phi1 = mu1 + (3 * e1 / 2 - 27 * Math.pow(e1, 3) / 32) * Math.sin(2 * mu1) + (21 * e1 * e1 / 16 - 55 * Math.pow(e1, 4) / 32) * Math.sin(4 * mu1) + (151 * Math.pow(e1, 3) / 6) * Math.sin(6 * mu1) + (1097 * Math.pow(e1, 4) / 512) * Math.sin(8 * mu1);
    var C1 = this.eas_ * Math.pow(Math.cos(phi1), 2);
    var T1 = Math.pow(Math.tan(phi1), 2);
    var N1 = this.a_ / Math.sqrt(1 - this.es_ * Math.pow(Math.sin(phi1), 2));
    var R1 = this.a_ * (1 - this.es_) / Math.pow((1 - this.es_ * Math.pow(Math.sin(phi1), 2)), 3 / 2);
    var D = (E - this.FE_) / (N1 * this.k0_);
    var phi = phi1 - (N1 * Math.tan(phi1) / R1) * (D * D / 2 - (5 + 3 * T1 + 10 * C1 - 4 * C1 * C1 - 9 * this.eas_) * Math.pow(D, 4) / 24 + (61 + 90 * T1 + 28 * C1 + 45 * T1 * T1 - 252 * this.eas_ - 3 * C1 * C1) * Math.pow(D, 6) / 720);
    var lamda = this.lamdaF_ + (D - (1 + 2 * T1 + C1) * Math.pow(D, 3) / 6 + (5 - 2 * C1 + 28 * T1 - 3 * C1 * C1 + 8 * this.eas_ + 24 * T1 * T1) * Math.pow(D, 5) / 120) / Math.cos(phi1);
    return [lamda / RAD_DEG, phi / RAD_DEG];
  };
  /**
   * see {@link SpatialReference}
   * @return {Number}
   */
  TransverseMercator.prototype.getCircumference = function () {
    return Math.PI * 2 * this.a_;
  };

/**
 * Creates a Spatial Reference based on Sphere Mercator Projection. 
 * The <code>params</code> passed in constructor should have the following properties:
 * <code><br/>-wkid: wkid
 * <br/>-semi_major:  ellipsoidal semi-major axis 
 * <br/>-unit: meters per unit
 * <br/>-central_meridian: lamdaF, longitude of the false origin  (with respect to the prime meridian)
 * </code>
 * <br/>e.g. The "Web Mercator" used in ArcGIS Server:<br/>
 * <code> var web_mercator  = new SphereMercator({wkid: 102113,  semi_major:6378137.0,  central_meridian:0, unit: 1 });
 * </code>
 * @name SphereMercator
 * @class This class (<code>gmaps.ags.SphereMercator</code>) is the Projection Default Google Maps uses. It is a special form of Mercator.
 * @param {Object} params 
 * @extends SpatialReference
 */
  function SphereMercator(params) {
    /*  =========== parameters  =  ===================== */
    params = params ||
    {};
    SpatialReference.call(this, params);
    this.a_ = (params.semi_major || 6378137.0) / (params.unit || 1);
    this.lamdaF_ = (params.central_meridian || 0.0) * RAD_DEG;
  }
  
  SphereMercator.prototype = new SpatialReference();
  
  /**
   * See {@link SpatialReference}
   * @param {Number[]} lnglat
   * @return {Number[]}
   */
  SphereMercator.prototype.forward = function (lnglat) {
    var phi = lnglat[1] * RAD_DEG;
    var lamda = lnglat[0] * RAD_DEG;
    var E = this.a_ * (lamda - this.lamdaF_);
    var N = (this.a_ / 2) * Math.log((1 + Math.sin(phi)) / (1 - Math.sin(phi)));
    return [E, N];
  };
  /**
   * See {@link SpatialReference}
   * @param {Number[]}  coords
   * @return {Number[]}
   */
  SphereMercator.prototype.reverse = function (coords) {
    var E = coords[0];
    var N = coords[1];
    var phi = Math.PI / 2 - 2 * Math.atan(Math.exp(-N / this.a_));
    var lamda = E / this.a_ + this.lamdaF_;
    return [lamda / RAD_DEG, phi / RAD_DEG];
  };
  /**
   * See {@link SpatialReference}
   * @return {Number}
   */
  SphereMercator.prototype.getCircumference = function () {
    return Math.PI * 2 * this.a_;
  };
  
  /**
   * Create a flat transform spatial reference. The <code>params</code> passed in constructor should have the following properties:
   * <li><code>wkid</code>: wkid
   * <li><code>latlng</code>:  {@link Envelope} in latlng unit;
   * <li><code>coords</code>: {@link Envelope} in coords unit
   * @class This class (<code>gmaps.ags.FlatSpatialReference</code>) is a special type of coordinate reference assuming lat/lng will increase
   * evenly as if earth is flat. Approximate for small regions without implementing
   * a real projection.
   * @name FlatSpatialReference
   * @param {Object} params
   * @extends SpatialReference
   */
  function FlatSpatialReference(params) {
    /*  =========== parameters  =  ===================== */
    params = params || {};
    SpatialReference.call(this, params);
    this.lng_ = params.latlng.xmin;
    this.lat_ = params.latlng.ymin;
    this.x_ = params.coords.xmin;
    this.y_ = params.coords.ymin;
    this.xscale_ = (params.coords.xmax - params.coords.xmin) / (params.latlng.xmax - params.latlng.xmin);
    this.yscale_ = (params.coords.ymax - params.coords.ymin) / (params.latlng.ymax - params.latlng.ymin);
  }
  
  FlatSpatialReference.prototype = new SpatialReference();
  
  /**
   * See {@link SpatialReference}
   * @param {Number[]} lnglat
   * @return {Number[]}
   */
  FlatSpatialReference.prototype.forward = function (lnglat) {
    var E = this.x_ + (lnglat[0] - this.lng_) * this.xscale_;
    var N = this.y_ + (lnglat[1] - this.lat_) * this.yscale_;
    return [E, N];
  };
  /**
   * See {@link SpatialReference}
   * @param {Number[]}  coords
   * @return {Number[]}
   */
  FlatSpatialReference.prototype.reverse = function (coords) {
    var lng = this.lng_ + (coords[0] - this.x_) / this.xscale_;
    var lat = this.lat_ + (coords[1] - this.y_) / this.yscale_;
    return [lng, lat];
  };
  /**
   * See {@link SpatialReference}
   * @return {Number}
   */
  FlatSpatialReference.prototype.getCircumference = function () {
    return this.xscale_ * 360;
  };


  var WGS84 = new Geographic({
    wkid: 4326
  });
  var NAD83 = new Geographic({
    wkid: 4269
  });
  var WEB_MERCATOR = new SphereMercator({
    wkid: 102113,
    semi_major: 6378137.0,
    central_meridian: 0,
    unit: 1
  });
  var WEB_MERCATOR_AUX = new SphereMercator({
      wkid: 102100,
      semi_major: 6378137.0,
      central_meridian: 0,
      unit: 1
    });
	
  // declared early but assign here to avoid dependency error by jslint
  SpatialReferences = {
    '4326': WGS84,
    '4269': NAD83,
    '102113': WEB_MERCATOR,
    '102100': WEB_MERCATOR_AUX
  };
  /**
   * Add A Spatial Reference to the collection of Spatial References.
   * the {@link ArcGISwktOrSR} parameter can be String format of "well-known text" of the
   * Spatial Reference, or an instance of {@link SpatialReference}.
   * <br/><li> If passes in String WKT format, to be consistent, it should use the same format as listed
   * in <a  href  = 'http://edndoc.esri.com/arcims/9.2/elements/pcs.htm'>
   * ESRI documentation</a>. For example, add NC State Plane NAD83 as String:
   * <br/><code>
   * SpatialReferences.addSpatialReference('2264','PROJCS["NAD_1983_StatePlane_North_Carolina_FIPS_3200_Feet",
   * GEOGCS["GCS_North_American_1983",
   * DATUM["D_North_American_1983",
   * SPHEROID["GRS_1980",6378137.0,298.257222101]],
   * PRIMEM["Greenwich",0.0],
   * UNIT["Degree",0.0174532925199433]],
   * PROJECTION["Lambert_Conformal_Conic"],
   * PARAMETER["False_Easting",2000000.002616666],
   * PARAMETER["False_Northing",0.0],
   * PARAMETER["Central_Meridian",-79.0],
   * PARAMETER["Standard_Parallel_1",34.33333333333334],
   * PARAMETER["Standard_Parallel_2",36.16666666666666],
   * PARAMETER["Latitude_Of_Origin",33.75],
   * UNIT["Foot_US",0.3048006096012192]]');
   * <br/></code>
   * Note: only <b>Lambert Conformal Conic</b> and <b>Transverse Mercator</b> Projection
   * based Spatial References are supported if added via WKT String.
   * <br/><li> If passes in an instance of {@link SpatialReference}, it can be one of the
   * built in classes, or a class that extends SpatialReference. For example, add NC State Plane NAD83 as SR:
   * <br/><code>
   * SpatialReferences.addSpatialReference('2264': new LambertConformalConic({
   * wkid: 2264,
   * semi_major: 6378137.0,
   * inverse_flattening: 298.257222101,
   * standard_parallel_1: 34.33333333333334,
   * standard_parallel_2: 36.16666666666666,
   * central_meridian: -79.0,
   * latitude_of_origin: 33.75,
   * 'false_easting': 2000000.002616666,
   * 'false_northing': 0,
   * unit: 0.3048006096012192
   * });
   * <br/></code>
   * @param {String} wkid/wkt
   * @param {Object} wktOrSR
   */
  SpatialReferences.addSpatialReference = function (wkidt, wktOrSR) {
    var sr = this['' + wkidt];
    if (sr) {
      return sr;
    }
    if (wktOrSR instanceof SpatialReference) {
      this['' + wkidt] = wktOrSR;
      return wktOrSR;
    }
    var wkt = wktOrSR;
    var params = {
      wkt: wkidt
    };
    if (wkidt === parseInt(wkidt, 10)) {
      params = {
        wkid: wkidt
      };
    }
    var prj = extractString(wkt, "PROJECTION[\"", "\"]");
    var spheroid = extractString(wkt, "SPHEROID[", "]").split(",");
    if (prj !== "") {
      params.unit = parseFloat(extractString(extractString(wkt, "PROJECTION", ""), "UNIT[", "]").split(",")[1]);
      params.semi_major = parseFloat(spheroid[1]);
      params.inverse_flattening = parseFloat(spheroid[2]);
      params.latitude_of_origin = parseFloat(extractString(wkt, "\"Latitude_Of_Origin\",", "]"));
      params.central_meridian = parseFloat(extractString(wkt, "\"Central_Meridian\",", "]"));
      params.false_easting = parseFloat(extractString(wkt, "\"False_Easting\",", "]"));
      params.false_northing = parseFloat(extractString(wkt, "\"False_Northing\",", "]"));
    }
    switch (prj) {
    case "":
      sr = new SpatialReference(params);
      break;
    case "Lambert_Conformal_Conic":
      params.standard_parallel_1 = parseFloat(extractString(wkt, "\"Standard_Parallel_1\",", "]"));
      params.standard_parallel_2 = parseFloat(extractString(wkt, "\"Standard_Parallel_2\",", "]"));
      sr = new LambertConformalConic(params);
      break;
    case "Transverse_Mercator":
      params.scale_factor = parseFloat(extractString(wkt, "\"Scale_Factor\",", "]"));
      sr = new TransverseMercator(params);
      break;
      // more implementations here.
    default:
      //throw new Error(prj + "  not supported";
    }
    if (sr) {
      this['' + wkidt] = sr;
    }
    return sr;
  };
  /**
   * Gets the {@link SpatialReference} from the internal colection by well-known id. Returns undefined if not added.
   * @param {String} wkid/wkt
   * @return {SpatialReference}
   */
  SpatialReferences.getSpatialReference = function (wkidt) {
    return this['' + wkidt];
  };	
  //end of projection related code//
  
  /**
   * @name GeometryType
   * @class List of Geometry type supported by ArcGIS server.
   * @property {String} [POINT] esriGeometryPoint 
   * @property {String} [MULTIPOINT] esriGeometryMultipoint
   * @property {String} [POLYLINE] esriGeometryPolyline
   * @property {String} [POLYGON] esriGeometryPolygon
   * @property {String} [ENVELOPE] esriGeometryEnvelope
   */
  var GeometryType = {
    POINT: 'esriGeometryPoint',
    MULTIPOINT: 'esriGeometryMultipoint',
    POLYLINE: 'esriGeometryPolyline',
    POLYGON: 'esriGeometryPolygon',
    ENVELOPE: 'esriGeometryEnvelope'
  };
  var getGeometryType = function (obj) {
    var o = obj;
    if (isArray(obj) && obj.length > 0) {
      o = obj[0];
    }
    if (o instanceof G.LatLng || o instanceof G.Marker) {
      if (isArray(obj) && obj.length > 1) {
        return GeometryType.MULTIPOINT;
      } else {
        return GeometryType.POINT;
      }
    } else if (o instanceof G.Polyline) {
      return GeometryType.POLYLINE;
    } else if (o instanceof G.Polygon) {
      return GeometryType.POLYGON;
    } else if (o instanceof G.LatLngBounds) {
      return GeometryType.ENVELOPE;
    }
    return null;
  };
  /**
   * 
   * @param {MVCArray.&lt;LatLng>} pts
   */
  var fromPointsToJSON = function (pts) {
    var arr = [];
    var latlng;
    for (var i = 0, c = pts.getLength(); i < c; i++) {
      latlng = pts.getAt(i);
      arr.push('[' + latlng.lng() + ',' + latlng.lat() + ']');
    }
    return arr.join(',');
  };
  /**
   * Convert overlays (Marker, Polyline, Polygons) to JSON string in AGS format.
   * @param {OverlayView|OverlayView[]} geom 
   */
  var fromOverlaysToJSON = function (geom) {
    var gtype = getGeometryType(geom);
    var g, gs, i, pts;
    var json = '{';
    switch (gtype) {
    case GeometryType.POINT:
      g = isArray(geom) ? geom[0] : geom;
      if (g instanceof G.Marker) {
        g = g.getPosition();
      }
      json += 'x:' + g.lng() + ',y:' + g.lat();
      break;
    case GeometryType.MULTIPOINT:
      pts = [];
      for (i = 0; i < geom.length; i++) {
        if (geom[i] instanceof G.Marker) {
          g = geom[i].getPosition();
        } else {
          g = geom[i];
        }
        pts.push('[' + g.lng() + ',' + g.lat() + ']');
      }
      json += 'points: [' + pts.join(',') + ']';
      break;
    case GeometryType.POLYLINE:
      // V3 does not support multiple paths yet
      pts = [];
      gs = isArray(geom) ? geom : [geom];
      for (i = 0; i < gs.length; i++) {
        pts.push('[' + fromPointsToJSON(gs[i].getPath()) + ']');
      }
      json += 'paths: [' + pts.join(',') + ']';
      break;
    case GeometryType.POLYGON:
      pts = [];
      g = isArray(geom) ? geom[0] : geom;
      var paths = g.getPaths();
      for (i = 0; i < paths.getLength(); i++) {
        pts.push('[' + fromPointsToJSON(paths.getAt(i)) + ']');
      }
      json += 'rings:[' + pts.join(',') + ']';
      
      break;
    case GeometryType.ENVELOPE:
      g = isArray(geom) ? geom[0] : geom;
      json += 'xmin:' + g.getSouthWest().lng() + ',ymin:' + g.getSouthWest().lat() + ',xmax:' + g.getNorthEast().lng() + ',ymax:' + g.getNorthEast().lat();
      break;
    }
    json += ', spatialReference:{wkid:4326}';
    json += '}';
    return json;
  };
  
  /**
   * Helper method to convert an Envelope object to <code>google.maps.LatLngBounds</code> 
   * @private 
   * @param {Envelope} extent
   * @return {google.maps.LatLngBounds} gLatLngBounds
   */
  var fromEnvelopeToLatLngBounds  =  function (extent) {
    var sr  =  SpatialReferences.getSpatialReference(extent.spatialReference.wkid || extent.spatialReference.wkt);
    sr  =  sr || SpatialReferences.WGS84;
    var sw  =  sr.reverse([extent.xmin, extent.ymin]);
    var ne  =  sr.reverse([extent.xmax, extent.ymax]);
    return new G.LatLngBounds(new G.LatLng(sw[1], sw[0]), new G.LatLng(ne[1], ne[0]));
  };
  
  
  /**
   * Convert a ArcGIS Geometry JSON object to core Google Maps API 
   * overlays such as  <code>google.maps.Marker</code>, <code>google.maps.Polyline</code> or <code>google.maps.Polygon</code>
   * Note ArcGIS Geometry may have multiple parts, but the coresponding OverlayView 
   * may (Polygon) or may not (Polyline) support multi-parts, so the result is an array for consistency.
   * @param {Object} json geometry
   * @param {OverlayOptions} opts see {@link OverlayOptions}
   * @param {String} opt_displayName
   * @return {OverlayView[]} 
   */
  var fromJSONToOverlays = function (geom, opts, opt_title) {
    var ovs = [];
    var sr = null;
    var ov;
    var x, i, ic, j, jc, parts, part, lnglat, latlngs;
    var title = '';
    opts = opts || {};
    if (geom.x) {
      ov = new G.Marker(augmentObject(opts.marker, {
        position: new G.LatLng(geom.y, geom.x)
      }));
      ovs.push(ov);
    } else {
      //mulpt, line and poly
      parts = geom.points || geom.paths || geom.rings;
      if (!parts) {
        return ovs;
      }
      var rings = [];
      for (i = 0, ic = parts.length; i < ic; i++) {
        part = parts[i];
        if (geom.points) {
          // multipoint
          ov = new G.Marker(augmentObject(opts.marker, {
            position: new G.LatLng(part[1], part[0])
          }));
          ovs.push(ov);
        } else {
          latlngs = [];
          for (j = 0, jc = part.length; j < jc; j++) {
            lnglat = part[j];
            latlngs.push(new G.LatLng(lnglat[1], lnglat[0]));
          }
          if (geom.paths) {
            ov = new G.Polyline(augmentObject(opts.polyline, {
              path: latlngs
            }));
            ovs.push(ov);
          } else if (geom.rings) {
            // V3 supports multiple rings
            rings.push(latlngs);
          }
        }
      }
      if (geom.rings) {
        ov = new G.Polygon(augmentObject(opts.polygon, {
          paths: rings
        }));
        ovs.push(ov);
      }
    }
    return ovs;
  };
  
  /**@name Error
   * @class Error returned from Server.
   * Syntax:
   * <pre>
   * {
   "error" : 
  {
    "code" : 500, 
    "message" : "Object reference not set to an instance of an object.", 
    "details" : [
      "'geometry' parameter is invalid"
    ]
  }
  }
  </pre>
   */
  /**
   * Create a ArcGIS service catalog instance using it's url:<code> http://&lt;host>/&lt;instance>/rest/services</code>
   * @name Catalog
   * @class  The catalog resource is the root node and initial entry point into an ArcGIS Server host.
   * This resource represents a catalog of folders and services published on the host.
   *  @param {String} url
   * @property {String} [currentVersion] currentVersion
   * @property {Array} [folders] folders list
   * @property {Array} [services] list of services. Each has <code>name, type</code> property.
   */
  function Catalog(url) {
    this.url = url;
    var me = this;
    Util.getJSON(url, {
      f: C.json
    }, 'callback', function (json) {
      augmentObject(json, me);
      /**
       * This event is fired when the catalog info is loaded.
       * @name Catalog#load
       * @event
       */
      triggerEvent(me, 'load');
    });
  }
  /**
   * Create a ArcGIS map Layer using it's url ( 	http://[mapservice-url]/[layerId])
   * @name Layer
   * @class This class (<code>gmaps.ags.Layer</code>) The layer / table(v10+)
   *  resource represents a single layer / table in a map of a map service 
   *  published by ArcGIS Server.
   * @param {String} url
   * @property {Number} [id] layer ID
   * @property {String} [name] layer Name
   * @property {String} [type] Feature Layer|Image Layer
   * @property {String} [description] description
   * @property {String} [definitionExpression] Layer definition.
   * @property {String} [geometryType] geometryType type(esriGeometryPoint|..), only available after load.
   * @property {String} [copyrightText] copyrightText, only available after load.
   * @property {Layer} [parentLayer] parent Layer {@link ArcGISLayer}
   * @property {Boolean} [defaultVisibility] defaultVisibility
   * @property {Layer[]} [subLayers] sub Layers. {@link ArcGISLayer}[].
   * @property {Boolean} [visibility] Visibility of this layer
   * @property {Number} [minScale] minScale
   * @property {Number} [maxScale] maxScale
   * @property {Envelope} [extent] extent
   * @property {TimeInfo} [timeInfo] timeInfo
   * @property {DrawingInfo} [drawingInfo] rendering info See {@link DrawingInfo}
   * @property {Boolean} [hasAttachments] hasAttachments
   * @property {String} [typeIdField] typeIdField
   * @property {Field[]} [fields] fields, only available after load. See {@link Field}
   * @property {Array} [types] subtypes: id, name, domains.
   * @property {Array} [relationships] relationships (id, name, relatedTableId)
   */
  function Layer(url) {
    this.url = url;
    this.definition = null;
  }
  /**
   * Returns all field names
   * @return {String[]}
  Layer.prototype.getFieldNames = function () {
    var ret = [];
    if (this.hasLoaded()) {
      for (var i = 0; i < this.fields.length; i++) {
        ret.push(this.fields[i].name);
      }
    }
    return ret;
  }; */
  
  /**
   * Whether the layer is viewable at given scale
   * @param {Number} scale
   * @return {Boolean}
   */
  Layer.prototype.isInScale = function (scale) {
    // note if the layer's extra info is not loaded, it will return true
    if (this.maxScale && this.maxScale > scale) {
      return false;
    }
    if (this.minScale && this.minScale < scale) {
      return false;
    }
    return true;
  };
 // * @property {String} [geometryType]  esriGeometryPoint | esriGeometryMultipoint | esriGeometryPolygon | esriGeometryPolyline
  /**
   * @name SpatialRelationship
   * @class This is actually a list of constants that represent spatial 
   * relationship types. 
   * @property {String} [INTERSECTS] esriSpatialRelIntersects 
   * @property {String} [CONTAINS] esriSpatialRelContains
   * @property {String} [CROSSES] esriSpatialRelCrosses
   * @property {String} [ENVELOPE_INTERSECTS] esriSpatialRelEnvelopeIntersects
   * @property {String} [INDEX_INTERSECTS] esriSpatialRelIndexIntersects
   * @property {String} [OVERLAPS] esriSpatialRelOverlaps
   * @property {String} [TOUCHES] esriSpatialRelTouches
   * @property {String} [WITHIN] esriSpatialRelWithin
  */
  var SpatialRelationship = {
    INTERSECTS: 'esriSpatialRelIntersects',
    CONTAINS: 'esriSpatialRelContains',
    CROSSES: 'esriSpatialRelCrosses',
    ENVELOPE_INTERSECTS: 'esriSpatialRelEnvelopeIntersects',
    INDEX_INTERSECTS: 'esriSpatialRelIndexIntersects',
    OVERLAPS: 'esriSpatialRelOverlaps',
    TOUCHES: 'esriSpatialRelTouches',
    WITHIN: 'esriSpatialRelWithin'
  };
 //  * @property {Number|SpatialReference} [inSR] The well-known ID of the spatial reference of the input geometries
   /**
   * @name QueryOptions
   * @class This class represent the parameters needed in an query operation for a {@link Layer}.
   *   There is no constructor, use JavaScript object literal.
   * <br/>For more info see <a  href  = 'http://sampleserver3.arcgisonline.com/ArcGIS/SDK/REST/query.html'>Query Operation</a>.
   * @property {String} [text]  A literal search text. If the layer has a display field
   *   associated with it, the server searches for this text in this field.
   *   This parameter is a short hand for a where clause of:
   *   where [displayField]like '%[text]%'. The text is case sensitive.
   *   This parameter is ignored if the where parameter is specified.
   * @property {OverlayView|OverlayView[]} [geometry] The geometry to apply as the spatial filter.
   * @property {SpatialRelationship} [spatialRelationship] The spatial relationship to be applied on the
   *    input geometry while performing the query. The supported spatial relationships
   *    include intersects, contains, envelope intersects, within, etc.
   *    The default spatial relationship is intersects. See {@link SpatialRelationship}
   * @property {String} [where] A where clause for the query filter. Any legal SQL where clause operating on the fields in the layer is allowed.
   * @property {String[]} [outFields] The list of fields to be included in the returned resultset.
   * @property {Boolean} [returnGeometry  = true] If true, If true, the resultset will include the geometries associated with each result.
   * @property {Int[]} [objectIds] The object IDs of this layer / table to be queried
   * @property [String[]] [outFields] The list of fields to be included in the returned resultset. This list is a comma delimited list of field names.
   * @property [Number] [maxAllowableOffset] This option can be used to specify the maximum allowable offset  to be used for generalizing geometries returned by the query operation
   * @property [Boolean] [returnIdsOnly] If true, the response only includes an array of object IDs. Otherwise the response is a feature set. The default is false. 
   * @property [OverlayOptions] [overlayOptions] See {@link OverlayOptions}
   */
  /**
   * @name ResultSet
   * @class This class represent the results of an query operation for a {@link Layer}.
   *   There is no constructor, use JavaScript object literal.
   * <br/>For more info see <a  href  = 'http://sampleserver3.arcgisonline.com/ArcGIS/SDK/REST/query.html'>Query Operation</a>.
   * @property {String} [displayFieldName] display Field Name for layer
   * @property {Object} [fieldAliases] Field Name's Aliases. key is field name, value is alias.
   * @property {GemetryType} [geometryType] esriGeometryPoint | esriGeometryMultipoint | esriGeometryPolygon | esriGeometryPolyline
   * @property {Features[]} [features] result as array of {@link Feature}
   * @property {String} [objectIdFieldName] objectIdFieldName when returnIdsOnly=true
   * @property {int[]} [objectIds] objectIds when returnIdsOnly=true
   */
  /**
   * The query operation is performed on a layer resource. The result of this operation is a resultset resource that will be
   * passed in the callback function. param is an instance of {@link QueryOptions}
   * <br/>For more info see <a href  = 'http://sampleserver3.arcgisonline.com/ArcGIS/SDK/REST/query.html'>Query Operation</a>.
   * @param {QueryOptions} params
   * @param {Function} callback
   */
 Layer.prototype.query = function (p, callback) {
   if (!p) {
     return;
   }
   // handle text, where, relationParam, objectIds, maxAllowableOffset
   var params = augmentObject(p, {});
   if (p.geometry && !isString(p.geometry)) {
     params.geometry = fromOverlaysToJSON(p.geometry);
     params.geometryType = getGeometryType(p.geometry);
     params.inSR = 4326;
   }
   if (p.spatialRelationship) {
     params.spatialRel = p.spatialRelationship;
     delete params.spatialRelationship;
   }
   if (p.outFields && !isArray(p.outFields)) {
     params.outFields = p.outFields.join(',');
   }
   if (p.objectIds) {
     params.objectIds = p.objectIds.join(',');
   }
   if (p.time) {
     params.time = getTimeString(p.time, p.endTime);
   }
   params.outSR = 4326;
   params.returnGeometry = p.returnGeometry === false ? false : true;
   params.returnIdsOnly = p.returnIdsOnly === true ? true : false;
   Util.getJSON(this.url + '/query', params, 'callback', function(json) {
     var i, f;
     if (json.features) {
       for (i = 0; i < json.features.length; i++) {
         f = json.features[i];
         if (f.geometry) {
           f.geometry = fromJSONToOverlays(f.geometry, p.overlayOptions);
         }
       }
     }
     callback(json, json.error);
   });
 };
 /**
   * @name QueryRelatedRecordsParameters
   * @class This class represent the parameters needed in an query related records operation for a {@link Layer}.
   *   There is no constructor, use JavaScript object literal.
   * <br/>For more info see <a  href  = 'http://sampleserver3.arcgisonline.com/ArcGIS/SDK/REST/queryrelatedrecords.html'>Query Related Records Operation</a>.
   * @property {String} [f  = json] The response format. html | json | kmz .
   * @property {Int,Int} [objectIds] The object IDs of this layer / table to be queried
   * @property {Int} [relatioshipId] The ID of the relationship to be queried
   * @property [String,] [outFields] The list of fields to be included in the returned resultset. This list is a comma delimited list of field names.
   * @property {String} [definitionExpression]  The definition expression to be applied to the related table / layer. From the list of objectIds, only those records that conform to this expression will be returned.
   * @property {Boolean} [returnGeometry  = true] If true, If true, the resultset will include the geometries associated with each result.
   * @property [Number] [maxAllowableOffset] This option can be used to specify the maximum allowable offset  to be used for generalizing geometries returned by the query operation
   * @property {Number} [outSR] The well-known ID of the spatial reference of the output geometries
   */
  /**
   * @name RelatedRecords
   * @class This class represent the results of an query related records operation for a {@link Layer}.
   *   There is no constructor, use JavaScript object literal.
   * <br/>For more info see <a  href  = 'http://sampleserver3.arcgisonline.com/ArcGIS/SDK/REST/queryrelatedrecords.html'>Query Operation</a>.
   * @property {String} [geometryType] esriGeometryPoint | esriGeometryMultipoint | esriGeometryPolygon | esriGeometryPolyline
   * @property {Object} [spatialReference] spatial Reference <b>wkid info only</b>
   * @property {String} [displayFieldName] display Field Name for layer
   * @property {Array} [relatedRecordGroups] list of related records
   */
   /**
   * @name RelatedRecord
   * @class This class represent the result of an query related records operation for a {@link Layer}.
   *   There is no constructor, use JavaScript object literal.
   * <br/>For more info see <a  href  = 'http://sampleserver3.arcgisonline.com/ArcGIS/SDK/REST/queryrelatedrecords.html'>Query Operation</a>.
   * @property {int} [objectId] objectid of original record
   * @property {Array} [relatedRecords] list of {@link Feature}s. 
   */
  /**
   * The query related records operation is performed on a layer / table resource. 
   * The result of this operation are featuresets grouped by source layer / table 
   * object IDs. Each featureset contains Feature objects including the values for 
   * the fields requested by the user. For related layers, if you request geometry 
   * information, the geometry of each feature is also returned in the featureset. 
   * For related tables, the featureset does not include geometries. 
   * @param {QueryRelatedRecordsParameters} params
   * @param {Function} callback
   */
  Layer.prototype.queryRelatedRecords = function (qparams, callback) {
    if (!qparams) {
      return;
    } 
    var params = augmentObject(qparams, {});
    params.f = params.f || 'json';
    if (params.outFields && !isString(params.outFields)) {
      params.outFields = params.outFields.join(',');
    }
    params.returnGeometry = params.returnGeometry === false ? false : true;
    Util.getJSON(this.url + '/query', params, 'callback', callback);
  };
  /**
   * Creates a MapService objects that can be used by UI components.
   * <ul><li> <code> url</code> (required) is the URL of the map servive, e.g. <code>
   * http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer</code>.
   * <ul/> Note the spatial reference of the map service must already exists
   * in the {@link SpatialReferences} if actual coordinates transformation is needed.
   * @name MapService
   * @class This class (<code>gmaps.ags.MapService</code>) is the core class for all map service operations.
   * It represents an ArcGIS Server map service that offer access to map and layer content
   * @param {String} url
   * @property {String} [url] map service URL
   * @property {Boolean} [loaded] if map service meta data is loaded. 
   * @property {String} [serviceDescription] serviceDescription
   * @property {String} [mapName] map frame Name inside the map document
   * @property {String} [description] description
   * @property {String} [copyrightText] copyrightText
   * @property {Array(Layer)} [layers] array of Layers.
   * @property {Array(Layer)} [tables] array of Tables.
   * @property {SpatialReference} [spatialReference] spatialReference
   * @property {Boolean} [singleFusedMapCache] if map cache is singleFused
   * @property {TileInfo} [tileInfo] See {@link TileInfo}
   * @property {Envelope} [initialExtent] initialExtent, see {@link Envelope}
   * @property {Envelope} [fullExtent] fullExtent, see {@link Envelope}
   * @property {TimeInfo} [timeInfo] see {@link TimeInfo}
   * @property {String} [units] unit
   * @property {String} [supportedImageFormatTypes] supportedImageFormatTypes, comma delimited list.
   * @property {Object} [documentInfo] Object with the folloing properties: <code>Title, Author,Comments,Subject,Category,Keywords</code>
   */
  function MapService(url) {
    this.url = url;
    this.loaded = false;
    var tks = url.split("/");
    this.name = tks[tks.length - 2].replace(/_/g, ' ');
    var me = this;
    Util.getJSON(url, {
      'f': 'json'
    }, C.callback, function (json) {
      me.init_(json);
    });
   
  }
  
  /**
   * initialize an ArcGIS Map Service from the meta data information.
   * The <code>json</code> parameter is the json object returned by Map Service.
   * @private
   * @param {Object} json
   */
  MapService.prototype.init_ = function (json) {
    var me = this;
    augmentObject(json, this);
    if (json.spatialReference.wkt) {
      this.spatialReference = SpatialReferences.addSpatialReference(json.spatialReference.wkt, json.spatialReference.wkt);
    } else {
      this.spatialReference = SpatialReferences.getSpatialReference(json.spatialReference.wkid);
    }
    if (json.tables !== undefined) {
      // v10.0 +
      Util.getJSON(this.url + '/layers', {
        f: C.json
      }, C.callback, function (json2) {
        me.initLayers_(json2);
      });
    } else {
      // v9.3
      this.initLayers_(json);
    }
  };
   /**
   * initialize an Layers.
   * The <code>json</code> parameter is the json object returned by Map Service or layers operation(v10+).
   * @private
   * @param {Object} json2
   */ 
  MapService.prototype.initLayers_ = function (json2) {
    var layers = [];
    var tables = [];
    var layer, i, c, info;
    for (i = 0, c = json2.layers.length; i < c; i++) {
      info = json2.layers[i];
      layer = new Layer(this.url + '/' + info.id);
      augmentObject(info, layer);
      layer.visible = layer.defaultVisibility;
      layers.push(layer);
    }
    if (json2.tables) {
      for (i = 0, c = json2.tables.length; i < c; i++) {
        info = json2.tables[i];
        layer = new Layer(this.url + '/' + info.id);
        augmentObject(info, layer);
        tables.push(layer);
      }
    }
    for (i = 0, c = layers.length; i < c; i++) {
      layer = layers[i];
      if (layer.subLayerIds) {
        layer.subLayers = [];
        for (var j = 0, jc = layer.subLayerIds.length; j < jc; j++) {
          var subLayer = this.getLayer(layer.subLayerIds[j]);
          layer.subLayers.push(subLayer);
          subLayer.parentLayer = layer;
        }
      }
    }
    this.layers = layers;
    if (json2.tables) {
      this.tables = tables;
    }
    this.loaded = true;
    /**
     * This event is fired when the service and it's service info is loaded.
     * @name MapService#load
     * @param {MapService} service
     * @event
     */
    triggerEvent(this, "load");
  };
  /**
   * Get a map layer by it's name(String) or id (Number), return {@link Layer}.
   * @param {String|Number} nameOrId
   * @return {Layer}
   */
  MapService.prototype.getLayer = function (nameOrId) {
    var layers = this.layers;
    if (layers) {
      for (var i = 0, c = layers.length; i < c; i++) {
        if (nameOrId === layers[i].id) {
          return layers[i];
        }
        if (isString(nameOrId) && layers[i].name.toLowerCase() === nameOrId.toLowerCase()) {
          return layers[i];
        }
      }
    }
    return null;
  };

/**
 * Get the layer definitions.
 * @return {Object} key as id, value as string of definition expression. 
 */
  MapService.prototype.getLayerDefs = function () {
    var ret = {};
    if (this.layers) {
      for (var i = 0, c = this.layers.length; i < c; i++) {
        var layer = this.layers[i];
        if (layer.definition) {
          ret[String(layer.id)] = layer.definition;
        }
      }
    }
    return ret;
  };
  /**
   * get a  list of visible layer's Ids
   * @return {Number[]}
   */
  MapService.prototype.getVisibleLayerIds = function () {
    var ret = [];
    if (this.layers) { // in case service not loaded
      var layer;
      // a special behavior of REST (as of 9.3.1): 
      // if partial group then parent must be off
      var i, c;
      for (i = 0, c = this.layers.length; i < c; i++) {
        layer = this.layers[i];
        if (layer.subLayers) {
          for (var j = 0, jc = layer.subLayers.length; j < jc; j++) {
            if (layer.subLayers[j].visible === false) {
              layer.visible = false;
              break;
            }
          }
        }
      }
      for (i = 0, c = this.layers.length; i < c; i++) {
        layer = this.layers[i];
        if (layer.visible === true) {
          ret.push(layer.id);
        }
      }
    }
    return ret;
  };
  
  MapService.prototype.getInitialBounds = function () {
    if (this.initialExtent) {
      return fromEnvelopeToLatLngBounds(this.initialExtent);
    }
    return null;
  };
  
/**
 * @name ExportMapOptions
 * @class This class represent the parameters needed in an exportMap operation for a {@link MapService}.
 *   There is no constructor, use JavaScript object literal.
 * <br/>For more info see <a  href='http://sampleserver3.arcgisonline.com/ArcGIS/SDK/REST/export.html'>Export Operation</a>.
 * @property {Number} [width] width of image, ignored if <code>size</code> is specified;
 * @property {Number} [height] height of image, ignored if <code>size</code> is specified;
 * @property {SpatialReference} [imageSR] The well-known ID of the spatial reference of the exported image or instance of {@link SpatialReference}.
 * @property {String} [format  = png] The format of the exported image. png | png8 | png24 | jpg | pdf | bmp | gif | svg
 * @property {Number} [dpi] The dpi of the exported image, default 96
 * @property {Object} [layerDefinitions] Allows you to filter the features of individual layers in the exported map by specifying 
 *   definition expressions for those layers. Syntax: { "&lt;layerId1>" : "&lt;layerDef1>" , "&lt;layerId2>" : "&lt;layerDef2>" }
 *   key is layerId returned by server, value is definition for that layer.
 * @property {Number[]} [layerIds] list of layer ids. If not specified along with layerOptions, show list of visible layers. 
 * @property {String} [layerOptions] show | hide | include | exclude. If not specified with along layerIds, show list of visible layers. 
 * @property {Boolean} [transparent  = true] If true, the image will be exported with 
 *  the background color of the map set as its transparent color. note the REST API default value is false.
 * @property {LatLngBounds} [bounds] bounds of map
 * @property {Date} [time] The time instant the exported map image if the service supports time (since AGS10).
 * @property {Date} [endTime] The end time instant the exported map image if the service supports time (since AGS10).
 *  time=&lt;timeInstant> or time=&lt;startTime>, &lt;endTime>, e.g. time=1199145600000, 1230768000000 (1 Jan 2008 00:00:00 GMT to 1 Jan 2009 00:00:00 GMT) 
 * @property {Object} [layerTimeOptions] layerTimeOptions The time options per layer. Users can indicate whether or not the layer should use the time extent
 *  specified by the time parameter or not, whether to draw the layer 
 *  features cumulatively or not and the time offsets for the layer. Syntax: <pre>
 *  {
  "&lt;layerId1>" : {
    //If true, use the time extent specified by the time parameter
    "useTime" : &lt; true | false >,
    //If true, draw all the features from the beginning of time for that data
    "timeDataCumulative" : &lt; true | false >,
    //Time offset for this layer so that it can be overlaid on the top of a previous or future time period
    "timeOffset" : &lt;timeOffset1>,
    "timeOffsetUnits" : "&lt;esriTimeUnitsCenturies | esriTimeUnitsDays | esriTimeUnitsDecades | 
                             esriTimeUnitsHours | esriTimeUnitsMilliseconds | esriTimeUnitsMinutes | 
                             esriTimeUnitsMonths | esriTimeUnitsSeconds | esriTimeUnitsWeeks | esriTimeUnitsYears |
                             esriTimeUnitsUnknown>"
  },
  "&lt;layerId2>" : {
    "useTime" : &lt; true | false >,
    "timeDataCumulative" : &lt; true | false >,
    "timeOffsetOffset" : &lt;timeOffset2>,
    "timeOffsetUnits" : "&lt;timeOffsetUnits2>"
  }
}
</pre>
 */

/**
 * @name MapImage
 * @class This is the result of {@link MapService}.exportMap operation.
 *   There is no constructor, use as JavaScript object literal.
 * @property {String} [href] URL of image
 * @property {LatLngBounds} [bounds] The bounding box of the exported image. 
 * @property {Number} [width] width of the exported image.
 * @property {Number} [height] height of the exported image.
 * @property {Number} [scale] scale of the exported image.
 */

  /**
   * Export an image with given parameters.
   * For more info see <a  href  = 'http://sampleserver3.arcgisonline.com/ArcGIS/SDK/REST/export.html'>Export Operation</a>.
   * <br/> The <code>params</code> is an instance of {@link ExportMapOptions}.
   * The following properties will be set automatically if not specified:...
   * <br/> The <code>callback</code> is the callback function with argument of
   * an instance of {@link MapImage}.
   * @param {ExportMapOptions} params
   * @param {Function} callback
   */
  MapService.prototype.exportMap = function (eparams, callback) {
    if (!eparams || !eparams.bounds) {
      return;
    }
    // note: dynamic map may overlay on top of maptypes with different projection
    var params = {f: 'json'};// augmentObject(eparams, );
    var bnds = eparams.bounds;
    params.bbox = '' + bnds.getSouthWest().lng() + ',' + '' + bnds.getSouthWest().lat() + ',' +
    bnds.getNorthEast().lng() +
    ',' +
    '' +
    bnds.getNorthEast().lat();
    //delete params.bounds;
    
    params.size = '' + eparams.width + ',' + eparams.height;
    params.dpi = eparams.dpi;
    
    if (eparams.imageSR) {
      if (eparams.imageSR.wkid) {
        params.imageSR = eparams.imageSR.wkid;
      } else {
        params.imageSR = '{wkt:' + eparams.imageSR.wkt + '}';
      }
    }
    params.bboxSR = '4326';
    params.format = eparams.format;
    var defs = eparams.layerDefinitions;
    // there is a slightly difference between {} and undefined
    // if do not want use def at all, pass in {}, if want to use 
    // in service, do not pass in anything.
    if (defs === undefined) {
      defs = this.getLayerDefs();
    } 
    // for 9.3 compatibility:
    var strDefs = '';
    for (var x in defs) {
      if (defs.hasOwnProperty(x)) {
        if (strDefs.length > 0) {
          strDefs += ';';
        }
        strDefs += (x + ':' + defs[x]);
      }
    }
    params.layerDefs = strDefs;
    var vlayers = eparams.layerIds;
    var layerOpt = eparams.layerOption || 'show';   
    if (vlayers === undefined) {
      vlayers = this.getVisibleLayerIds();
    }
    if (vlayers.length > 0) {
      params.layers =  layerOpt + ':' + vlayers.join(',');
    } else {
      // no layers visible, no need to go to server
      callback({
        href: null
      });
      return;
    }
    params.transparent = (eparams.transparent === false ? false : true);
    if (eparams.time) {
      params.time = getTimeString(eparams.time, eparams.endTime);
    }
    //TODO: finish once v10 released
    params.layerTimeOptions = eparams.layerTimeOptions;
    
    Util.getJSON(this.url + '/export', params, 'callback', function (json) {
      json.bounds = fromEnvelopeToLatLngBounds(json.extent);
      delete json.extent;
      callback(json); //callback.apply(null,json);
    });
  };
 /**
 * @name Feature
 * @class This class represent JSON feature object as returned by the REST API.
 *   There is no constructor, use JavaScript object literal.
 * <br/>For more info see <a  href  = 'http://sampleserver3.arcgisonline.com/ArcGIS/SDK/REST/feature.html'>Feature Object</a>.
 * Syntax:
 * <pre>
{
  "geometry" : &lt;overlays>,

  "attributes" : {
    "name1" : &lt;value1>,
    "name2" : &lt;value2>,
  }
}
 * </pre>
 * @property {Marker[]|Polyline[]|Polygon[]} [geometry] geometry
 * @property {Object} [attributes] attributes as name-value JSON object.
 */
  /**
   * @name IdentifyOptions
   * @class This class represent the parameters needed in an identify operation for a {@link MapService}.
   *   There is no constructor, use JavaScript object literal.
   * <br/>For more info see <a  href  = 'http://sampleserver3.arcgisonline.com/ArcGIS/SDK/REST/identify.html'>Identify Operation</a>.
   * @property {String} [f  = json] The response format. html | json .
   * @property {Geometry} [geometry] The geometry to identify on, <code>google.maps.LatLng</code>, <code>Polyline</code>, or <code>Polygon</code>.
   * @property {Number[]} [layerIds] The layers to perform the identify operation on. 
   * @property {String} [layerOption] The layers to perform the identify operation on. 'top|visible|all'. 
   * @property {Number} [tolerance] The distance in screen pixels from the specified geometry within which the identify should be performed
   * @property {google.maps.LatLngBounds} [bounds] The bounding box of the map currently being viewed.
   * @property {Number} [width] width of image in pixel
   * @property {Number} [height] height of image in pixel
   * @property {Number} [dpi] dpi of image, default 96;
   * @property {Boolean} [returnGeometry  = true] If true, the resultset will include the geometries associated with each result.
   * @property {Number} [maxAllowableOffset] This option can be used to specify the maximum allowable offset  to be used for generalizing geometries returned by the identify operation
   * @property {OverlayOptions} [overlayOptions] how results should be rendered. See {@link OverlayOptions}
   */
  /**
   * @name IdentifyResults
   * @class This class represent the results of an identify operation for
   * a {@link MapService}.
   *   There is no constructor, use JavaScript object literal.
   * <br/>For more info see <a  href  = 'http://sampleserver3.arcgisonline.com/ArcGIS/SDK/REST/identify.html'>Identify Operation</a>.
   * @property {IdentifyResult[]} [results] The identify results as an array of {@link ArcGISIdentifyResult}
   */
  /**
   * @name IdentifyResult
   * @class This class represent one entry in the results of an identify operation for a {@link MapService}.
   *   There is no constructor, use JavaScript object literal.
   * <br/>For more info see <a  href  = 'http://sampleserver3.arcgisonline.com/ArcGIS/SDK/REST/identify.html'>Identify Operation</a>.
   * @property {Number} [layerId] layerId
   * @property {String} [layerName] layerName
   * @property {String} [value] value of the display field
   * @property {String} [displayFieldName] displayFieldName
   * @property {Feature} [features] {@link Feature}
   */
  /**
   * Identify features on a particular Geographic location, using {@link ArcGISIdenitfyParameters} and
   * process {@link IdentifyResults} using the <code>callback</code> function.
   * For more info see <a
   * href  = 'http://sampleserver3.arcgisonline.com/ArcGIS/SDK/REST/identify.html'>Identify Operation</a>.
   * @param {IdentifyOptions} params
   * @param {Function} callback
   */
  MapService.prototype.identify = function (iparams, callback) {
    if (!iparams) {
      return;
    }
    var params = {};//augmentObject(iparams, );
    params.geometry = fromOverlaysToJSON(iparams.geometry);
    params.geometryType = getGeometryType(iparams.geometry);
    params.mapExtent = fromOverlaysToJSON(iparams.bounds);
    params.tolerance = iparams.tolerance || 2;
    params.sr = 4326;
    params.imageDisplay = '' + iparams.width + ',' + iparams.height + ',' + (iparams.dpi || 96);
    params.layers = (iparams.layerOption || 'all') + ':' + (iparams.layerIds || this.getLayerIds()).join(',');
    if (iparams.layerDefs) {
      params.layerDefs = iparams.layerDefs;//TODO
    }
    params.maxAllowableOffset = iparams.maxAllowableOffset;
    params.returnGeometry = (iparams.returnGeometry === false ? false : true);
    
    Util.getJSON(this.url + '/identify', params, 'callback', function (json) {
      // process results;
      var rets = null;
      var i, js, f, g;
      
      if (json.results) {
        rets = [];
        for (i = 0; i < json.results.length; i++) {
          js = json.results[i];
          g = fromJSONToOverlays(js.geometry, iparams.overlayOptions);
          rets.push({
            feature: {
              geometry: g,
              attributes: js.attributes
            },
            displayFieldName: js.displayFieldName,
            layerId: js.layerId,
            layerName: js.layerName,
            value: js.value
          });
        }
      }
      callback({
        results: rets
      }, json.error);
    });
  };
  /**
   * @name FindParameters
   * @class This class represent the parameters needed in an find operation for a {@link MapService}.
   *   There is no constructor, use JavaScript object literal.
   * <br/>For more info see <a  href  = 'http://sampleserver3.arcgisonline.com/ArcGIS/SDK/REST/find.html'>Find Operation</a>.
   * @property {String} [f  = json] The response format. html | json .
   * @property {String} [searchText] The search string. This is the text that is searched across the layers and the fields that the user specifies.
   * @property {Boolean} [contains  = true] If false, the operation searches for an exact match of
   *   the searchText string. An exact match is case sensitive.
   *   Otherwise, it searches for a value that contains the searchText provided.
   *    This search is not case sensitive. The default is true.
   * @property {String|String[]} [searchFields] The names of the fields to search. The fields are specified as a comma-separated list of field names.
   *    If this parameter is not specified, all fields are searched.
   *    <i>This can also be an array with field names </i>.
   * @property {Number} [sr] The well-known ID of the spatial reference of the output geometries.
   * @property {String} [layers] The layers to perform the find operation on. The layers to perform the find operation on.
   *   The layers are specified as a comma-separated list of layer ids. <i>It can also be an array of layer NAMEs</i>.
   * @property {Boolean} [returnGeometry  = true] If true, the resultset will include the geometries associated with each result.
   * @property {Number} [maxAllowableOffset] This option can be used to specify the maximum allowable offset  to be used for generalizing
   *             geometries returned by the find operation 
   */
  /**
   * @name FindResults
   * @class This class represent the results of a find operation for a {@link MapService}.
   *   There is no constructor, use JavaScript object literal.
   * <br/>For more info see <a  href  = 'http://sampleserver3.arcgisonline.com/ArcGIS/SDK/REST/find.html'>Find Operation</a>.
   * @property {FindResult[]} [results] The find results as an array of {@link FindResult}
   */
  /**
   * @name FindResult
   * @class This class represent one entry in the results of a find operation for a {@link MapService}.
   *   There is no constructor, use JavaScript object literal.
   * <br/>For more info see <a  href  = 'http://sampleserver3.arcgisonline.com/ArcGIS/SDK/REST/find.html'>Find Operation</a>.
   * @property {Number} [layerId] layerId
   * @property {String} [layerName] layerName
   * @property {String} [value] value of the display field
   * @property {String} [displayFieldName] displayFieldName
   * @property {String} [foundFieldName] foundFieldName
   * @property {String} [geometryType] esriGeometryPoint | esriGeometryPolyline | esriGeometryPolygon | esriGeometryEnvelope
   * @property {Geometry} [geometry] {@link Geometry}
   * @property {Object} [attributes] attributes as name-value JSON object.
   */
  /**
   * Find features using the {@link FindParameters} and process {@link FindResults}
   * using the <code>callback</code> function.
   * For more info see <a
   * href  = 'http://sampleserver3.arcgisonline.com/ArcGIS/SDK/REST/find.html'>Find Operation</a>.
   * @param {FindParameters} params
   * @param {Function} callback
   */
  MapService.prototype.find = function (fparams, callback) {
    if (!fparams) {
      return;
    }
    var params = augmentObject(fparams, {});
    params.f = params.f || 'json';
    if (params.layers && !isString(params.layers)) {
      params.layers = this.getLayerIds(params.layers).join(',');
    }
    if (params.searchFields && !isString(params.searchFields)) {
      params.searchFields = params.searchFields.join(',');
    }
    params.contains = (params.contains === false ? false : true);
    if (!params.layerDefs) {
      params.layerDefs = this.getLayerDefs();
    }
    params.returnGeometry = (params.returnGeometry === false ? false : true);
    Util.getJSON(this.url + '/find', params, 'callback', callback);
  };
  
  /**
   * Query a layer with given id or name using the {@link QueryOptions} and process {@link ResultSet}
   * using the <code>callback</code> function.
   * See {@link Layer}.
   * For more info see <a  href  = 'http://sampleserver3.arcgisonline.com/ArcGIS/SDK/REST/query.html'>Query Layer Operation</a>.
   * @param {Number|String} layerNameOrId
   * @param {QueryOptions} params
   * @param {Function} callback
   */
  MapService.prototype.queryLayer = function (layerNameOrId, params, callback) {
    var layer = this.getLayer(layerNameOrId);
    if (layer) {
      layer.query(params, callback);
    }
  };
  
 
 /**
 * Creates an GeometryService class.
 * Params:<li><code>url</code>: URL of service, syntax:<code>	http://{catalog-url}/{serviceName}/GeometryServer</code>
 * @name GeometryService
 * @class This class (<code>gmaps.ags.GeometryService</code>) represent an ArcGIS 
 * <a href="http://sampleserver3.arcgisonline.com/ArcGIS/SDK/REST/geometryserver.html">Geometry</a>
 *  service.
 * @param {String} url
 */
  function GeometryService(url) {
    this.url  = url;
  }
  /**
   * @name ProjectParameters
   * @class This class represent the parameters needed in an project operation
   *  for a {@link GeometryService}.
   *   There is no constructor, use JavaScript object literal.
   * <br/>For more info see <a  href  = 'http://sampleserver3.arcgisonline.com/ArcGIS/SDK/REST/project.html'>Project Operation</a>.
   * @property {String} [f  = json] The response format. html | json .
   * @property {Geometry[]} [geometries] Array of {@link Geometry} to project. In the case of points, the following syntax also works:
   *   <code>geometries  = x1, y1, x2, y2, ..., xn, yn</code>
   * @property {String} [geometryType] esriGeometryPoint | esriGeometryPolyline | esriGeometryPolygon | esriGeometryEnvelope
   * @property {Number} [inSR] The well-known ID of the spatial reference of the input geometries
   * @property {Number} [outSR] The well-known ID of the spatial reference of the out geometries
   */
  /**
   * This resource projects an array of input geometries from an input spatial reference
   * to an output spatial reference
   * @param {ProjectParameters} params
   * @param {Function} callback
   */
  GeometryService.prototype.project = function (params, callback) {
    if (!params) {
      return;
    }
    params.f = params.f || 'json';
    if (!isString(params.geometries)) {
      var gt = C.esriGeometryPoint;
      var json = [];
      for (var i = 0, c = params.geometries.length; i < c; i++) {
        var g = params.geometries[i];
        if (i === 0) {
          if (g.points) {
            gt = C.esriGeometryMultipoint;
          } else if (g.paths) {
            gt = C.esriGeometryPolyline;
          } else if (g.rings) {
            gt = C.esriGeometryPolygon;
          } else if (g.xmin) {
            gt = C.esriGeometryEnvelope;
          }
        }
        json.push(Util.fromOverlaysToJSON(g, false));
      }
      params.geometries = '{ geometryType:' + gt + ', geometries:[' + json.join(',') + ']}';
    }
    Util.getJSON(this.url + '/project', params, "callback", callback);
  };

  /**
 * Creates a GeocodeService class.
 * Params:<li><code>url</code>: URL of service, syntax:<code>	http://{catalog-url}/{serviceName}/GeocodeServer</code>
 * @name GeocodeService
 * @class This class (<code>gmaps.ags.GeocodeService</code>) represent an ArcGIS <a href="http://sampleserver3.arcgisonline.com/ArcGIS/SDK/REST/geocodeserver.html">GeocodeServer</a>
 *  service.
 * @param {String} url
 * @property {String} [serviceDescription] serviceDescription
 * @property {Field[]} [addressFields] input fields. 
 *    Each entry is an object of type {@link ArcGISField}, plus <code>required(true|false)</code>
 * @property {Field[]} [candidateFields] candidate Fields. 
 *    Each entry is an object of type {@link ArcGISField}
 * @property {Field[]} [intersectionCandidateFields] intersectionCandidateFields
 *    Each entry is an object of type {@link ArcGISField}
 * @property {SpatialReference} [spatialReference] spatialReference <b>wkid info only</b>
 * @property {Object} [locatorProperties] an object with key-value pair that is specific to Locator type.
 */
  function GeocodeService(url) {
    this.url = url;
    this.loaded = false;
    var me = this;
    Util.getJSON(url, {
      f: 'json'
    }, 'callback', function (json) {
      me.init_(json);
    });
  }
  
  /**
   * init
   * @param {Object} json
   */
  GeocodeService.prototype.init_ = function (json) {
    augmentObject(json, this);
    this.loaded = true;
    /**
     * This event is fired when the service and it's service info is loaded.
     * @name GeocodeService#load
     * @event
     */
    triggerEvent(this, 'load');
  };
  
  
/**
 * @name GeocodeParameters
 * @class This class represent the parameters needed in a find address candidate operation
 *  on a {@link GeocodeService}.
 *   There is no constructor, use JavaScript object literal.
 * <br/>For more info see <a  href  = 'http://sampleserver3.arcgisonline.com/ArcGIS/SDK/REST/candidates.html'>Find Adddress Candidates Operation</a>.
 * @property {String} [f  = json] The response format. html | json |kmz.
 * @property {Object} [inputs] an object literal with name-value pair of input values.
 * @property {String|String[]} [outFields] The list of fields to be included in the returned resultset. 
 *   This list can be a comma delimited String or an array of String.
 * @property {int|SpatialReference} [outSR] 
 */
/**
 * @name GeocodeResults
 * @class This class represent the results of an find address candidate operation for a 
 *  {@link GeocodeService}.
 *   There is no constructor, use JavaScript object literal.
 * <br/>For more info see <a  href  = 'http://sampleserver3.arcgisonline.com/ArcGIS/SDK/REST/candidates.html'>Find Adddress Candidates Operation</a>.
 * @property {GeocodeResult[]} [candidates] The find address results as 
 * an array of {@link GeocodeResult}
 */
/**
 * @name GeocodeResult
 * @class This class represent one entry in the results of a find address operation for a
 *  {@link GeocodeService}.
 *   There is no constructor, use JavaScript object literal.
 * <br/>For more info see <a  href  = 'http://sampleserver3.arcgisonline.com/ArcGIS/SDK/REST/candidates.html'>Find Adddress Candidates Operation</a>.
 * @property {String} [address] matched address
 * @property {Geometry} [location] matched location
 * @property {Number} [score] matching score
 * @property {Object} [attributes] attributes as name-value JSON object. 
 * e.g. <code>{"StreetName" : "MASON", "StreetType" : "ST"}</code>
 */
/**
 * The findAddressCandidates operation is performed on a geocode service
 *  resource. The result of this operation is a resource representing 
 *  the list of address candidates. This resource provides information 
 *  about candidates including the address, location, and score.
 *  param is an instance of {@link GeocodeParameters}. An instance of
 *  {@link GeocodeResults} will be passed into callback function.
 * @param {GeocodeParameters} params
 * @param {Function} callback
 */
  GeocodeService.prototype.findAddressCandidates = function (gparams, callback) {
    var params = augmentObject(gparams, {});
    params.f = params.f || 'json';
    if (params.inputs) {
      augmentObject(params.inputs, params);
      delete params.inputs;
    }
    if (isArray(params.outFields)) {
      params.outFields = params.outFields.join(',');
    }
    Util.getJSON(this.url + '/findAddressCandidates', params, 'callback', callback);
  };
  /**
   * Alias of <code>GeocodeService.findAddressCandidates</code>;
   * @param {GeocodeParameters} params
   * @param {Function} callback
   */
  GeocodeService.prototype.geocode = function (params, callback) {
    this.findAddressCandidates(params, callback);
  };

/**
 * @name ReverseGeocodeParameters
 * @class This class represent the parameters needed in a reverseGeocode operation
 *  on a {@link GeocodeService}.
 *   There is no constructor, use JavaScript object literal.
 * <br/>For more info see <a  href  = 'http://sampleserver3.arcgisonline.com/ArcGIS/SDK/REST/reverse.html'>Reverse Geocode Operation</a>.
 * @property {String} [f  = json] The response format. html | json |kmz.
 * @property {Geometry|String} [location] an object literal of type {@link ArcGISPoint}. You can also use x,y string.
 * @property {Number} [distance] The distance in meters from the given location within which 
 *  a matching address should be searched.
 */

/**
 * @name ReverseGeocodeResult
 * @class This class represent one entry in the results of a find address operation for a
 *  {@link GeocodeService}.
 *   There is no constructor, use JavaScript object literal.
 * <br/>For more info see <a  href  = 'http://sampleserver3.arcgisonline.com/ArcGIS/SDK/REST/reverse.html'>Reverse Geocode Operation</a>.
 * @property {Object} [address] matched address, object literal with name-value address parts. 
 *  e.g.: <code>{  "Street" : "771 TUNNEL AVE",  "Zone" : "94005"  }</code>
 * @property {Geometry} [location] matched location
 */
/**
 * The reverseGeocode operation is The reverseGeocode operation is performed on a geocode service resource. 
 * The result of this operation is a reverse geocoded address resource.
 *  param is an instance of {@link ReverseGeocodeParameters}. An instance of
 *  {@link ReverseGeocodeResult} will be passed into callback function.
 * @param {ReverseGeocodeParameters} params
 * @param {Function} callback
 */
  GeocodeService.prototype.reverseGeocode = function (params, callback) {
    params.f = params.f || 'json';
    if (!isString(params.location)) {
      params.location = fromOverlaysToJSON(params.location);
    }
    Util.getJSON(this.url + '/reverseGeocode', params, 'callback', callback);
  };
 
  

// end of REST API stuff
   /**
   * @name TileInfo
   * @class This class contains information about map tile infornation for a cached map service.
   *    It is the type of {@link TileInfo} property of {@link ArcGISArcGISTileReference}
   *    <br/>There is no constructor for this class.
   * @property {Number} [rows] tile row size,  e.g. 512, must be same as cols
   * @property {Number} [cols] tile cols size,  e.g. 512, must be same as rows
   * @property {Number} [dpi] dot per inch for map tiles.
   * @property {String} [format] PNG8 | PNG24 | PNG32 | GIF | JPEG
   * @property {Number} [compressionQuality] JPEG only.0-100.
   * @property {Point} [origin] origin of tile system of type {@link ArcGISPoint}
   * @property {SpatialReference} [spatialReference] spatial reference.  <b>wkid info only</b>.
   * @property {LOD[]} [lods] Array of Level of Details. See {@link ArcGISLOD}
   */
  /**
   * @name LOD
   * @class This class contains information about one "Level Of Detail" for a cached map service.
   *   It is the type of {@link ArcGISlods} property of {@link TileInfo}
   *   <br/>There is no constructor for this class. Use as object literal.
   * @property {Number} [level] zoom level.
   * @property {Number} [resolution] map unit per pixel
   * @property {Number} [scale] actual map scale. e.g a value of 5000 means 1:5000 scale.
   */
  /**
   * Creates an ArcGIS Map Tiling Reference System.
   * <ul>
   * <li><code>tileInfo</code> tiling information. An instance of {@link TileInfo}
   * <li><code>opt_fullExtent</code> full extent of the tiles. An instance of {@link Envelope}
   * </ul>Applications normally do not create instances of this class directly.
   * If needed, it can be accessed by <code>Map.getCurrentMapType().getProjection()</code>
   * for customized <code>GMapType</code>s.
   * @name Projection
   * @class This class (<code>gmaps.ags.Projection</code>) implements a custom
   * <a href  = 'http://code.google.com/apis/maps/documentation/javascript/reference.html#Projection'>google.maps.Projection</a> 
   * from the core Google Maps API.
   *   It carries a real {@link SpatialReference} object to convert LatLng from/to
   *   map coordinates, and tiling scheme informations to convert
   *   map coordinates from/to pixel coordinates. 
   * @param {TileInfo} tileInfo
   */
  function Projection(tileInfo) {//}, opt_fullExtent) {
    if (!tileInfo) {
      throw new Error('map service is not tiled');
    }
    this.tileInfo_  =  tileInfo;
    this.spatialReference  =  SpatialReferences.getSpatialReference(tileInfo.spatialReference.wkid || tileInfo.spatialReference.wkt);
    if (!this.spatialReference) {
      throw new Error('unsupported Spatial Reference'); 
    }
    // resolution (unit/pixel) at lod level 0. Due to changes from V2-V3, 
    // zoom is no longer defined in Projection. It is assumed that level's zoom factor is 2. 
    this.resolution0_ = this.tileInfo_.lods[0].resolution;
    // zoom offset of this tileinfo's zoom 0 to Google's zoom0
    this.minZoom  =  Math.floor(Math.log(this.spatialReference.getCircumference() / this.resolution0_ / 256) / Math.LN2 + 0.5);
    this.maxZoom = this.minZoom + this.tileInfo_.lods.length - 1;
    this.tileSize = new G.Size(this.tileInfo_.cols, this.tileInfo_.rows);  
    // Find out how the map units scaled to 1 tile at zoom 0. 
    // from V2-V3, coords must scaled to 256 pixel under Mercator at zoom 0.
    // scale can be considered under this SR, what's the actual pixel number to 256 to cover whole earth?
    this.scale_ = Math.pow(2, this.minZoom) * this.resolution0_;
    this.originX_ = this.tileInfo_.origin.x;        
    this.originY_ = this.tileInfo_.origin.y;        
    // validation check
    var ratio;
    for (var i = 0; i < tileInfo.lods.length - 1; i++) {
      ratio = tileInfo.lods[i].resolution / tileInfo.lods[i + 1].resolution;
      if (ratio > 2.001 || ratio < 1.999) {
        throw new Error('This type of map cache is not supported in V3. \nScale ratio between zoom levels must be 2');
      }
    }
    
  }
  
  /**
   * See <a href  = 'http://code.google.com/apis/maps/documentation/javascript/reference.html#Projection'>google.maps.Projection</a>.
   * @param {LatLng} gLatLng
   * @param {Point} opt_point
   * @return {Point} pixel
   */
  Projection.prototype.fromLatLngToPoint  =  function (latlng, opt_point) {
    if (!latlng || isNaN(latlng.lat()) || isNaN(latlng.lng())) {
      return null;
    }
    var coords  =  this.spatialReference.forward([latlng.lng(), latlng.lat()]);
    var point = opt_point || new G.Point(0, 0);
    point.x = (coords[0] - this.originX_) / this.scale_;
    point.y = (this.originY_ - coords[1]) / this.scale_; 
    return point;
  };
  /**
   * See <a href  = 'http://code.google.com/apis/maps/documentation/javascript/reference.html#Projection'>google.maps.Projection</a>.
   * @param {Point} pixel
   * @param {Boolean} opt_nowrap
   * @return {LatLng}
   */
  Projection.prototype.fromPointToLatLng = function (pixel, opt_nowrap) {
    //TODO: handle nowrap
    if (pixel === null) {
      return null;
    }
    var x = pixel.x * this.scale_ + this.originX_;
    var y = this.originY_ - pixel.y * this.scale_;
    var geo = this.spatialReference.reverse([x, y]);
    return new G.LatLng(geo[1], geo[0]);
  };
  /**
   * Get the scale at given level;
   * @param {Number} zoom
   * @return {Number}
   */
  Projection.prototype.getScale  =  function (zoom) {
    var zoomIdx  =  zoom - this.minZoom;
    var res  = 0;
    if (this.tileInfo_.lods[zoomIdx]) {
      res  = this.tileInfo_.lods[zoomIdx].scale;
    } 
    return res;
  };
  
  
  
  /**
   * @name TileLayerOptions
   * @class Instances of this class are used in the {@link opt_layerOpts} argument
   *   to the constructor of the {@link TileLayer} class. 
   * @property {String} [hosts] host pattern of tile servers if they are numbered. Most browser
   *   has default restrictions on how many concurrent connections can be made to
   *   a single host. One technique to workaround this is to create multiple hosts and rotate them when
   *   loading tiles.
   *   The syntax is <code>prefix[<i>numberOfHosts</i>]suffix</code>, for example, <code>"mt[4].google.com"</code> means
   *   rotate hosts in <code>mt0.google.com, mt1.google.com, mt2.google.com, mt3.google.com</code> (4 hosts).
   * @property {Number} [minZoom] min zoom level. 
   * @property {Number} [maxZoom] max zoom level.
   * @property {Number} [opacity] opacity (0-1).
   */
  
  /** Creates a tile layer from a cached by ArcGIS map service. 
   * <br/> <code> service</code> (required) is the underline {@link MapService}
   * <br/> <code>opt_layerOpts</code> (optional) is an instance of {@link TileLayerOptions}.
   * @name TileLayer
   * @class This class (<code>gmaps.ags.TileLayer</code>) provides access to a cached ArcGIS Server 
   * map service. There is no GTileLayer class in Google Maps API V3, but this class is kept to allow
   * finer control of zoom levels for each individual tile sets within a map type, such as zoom level range and opacity.
   * <br/> This class can be used in {@link MapType} 
   * @param {MapService} service
   * @param {TileLayerOptions} opt_layerOpts
   */
  function TileLayer(service, opt_layerOpts) {
    opt_layerOpts  =  opt_layerOpts || {};
    if (opt_layerOpts.opacity) {
      this.opacity_ = opt_layerOpts.opacity;
      delete opt_layerOpts.opacity;
    }
    augmentObject(opt_layerOpts, this);
    this.mapService  =  (service instanceof MapService)?service:new MapService(service);
    //In the format of mt[number].domain.com
    if (opt_layerOpts.hosts) {
      var pro  =  extractString(this.mapService.url, '', '://');
      var host  =  extractString(this.mapService.url, '://', '/');
      var path  =  extractString(this.mapService.url, pro + '://' + host, '');
      this.urlTemplate_  =  pro + '://' + opt_layerOpts.hosts + path;
      this.numOfHosts_  =  parseInt(extractString(opt_layerOpts.hosts, '[', ']'), 10);
    }
    this.name = this.name || this.mapService.name;
    this.maxZoom = this.maxZoom || 19;
    this.minZoom = this.minZoom || 0;
    if (this.mapService.loaded) {
      this.init_(opt_layerOpts);
    } else {
      var me  =  this;
      G.event.addListenerOnce(this.mapService, 'load', function () {
        me.init_(opt_layerOpts);
      });
    }
    this.tiles = {};
  }
  
  
  /**
   * Initialize the tile layer from a loaded map service
   * @param {MapService} mapService
   * @param {Object} opt_layerOpts
   */
  TileLayer.prototype.init_  =  function (opt_layerOpts) {
    this.projection  =  new Projection(this.mapService.tileInfo);//, this.mapService_.fullExtent);
    this.minZoom = opt_layerOpts.minZoom || this.projection.minZoom;
    this.maxZoom = opt_layerOpts.maxZoom || this.projection.maxZoom;
  };
 

  /**
   * Returns a string (URL) for given tile coordinate (x, y) and zoom level
   * @private not meant to be called by client
   * @param {Object} tile
   * @param {Number} zoom
   * @return {String} url
   */
  TileLayer.prototype.getTileUrl  =  function (tile, zoom) {
    var z  = zoom - (this.projection?this.projection.minZoom:this.minZoom);
    var url = '';
    if (!isNaN(tile.x) && !isNaN(tile.y) && z >= 0 && tile.x >= 0 && tile.y >= 0) {
      var u  =  this.mapService.url;
      if (this.urlTemplate_) {
        u  =  this.urlTemplate_.replace('[' + this.numOfHosts_ + ']', '' + ((tile.y + tile.x) % this.numOfHosts_));
      }
      url = u + '/tile/' + z + '/' + tile.y + '/' + tile.x;
    }
    //log('url=' + url);
    return url;
  };
  
  TileLayer.prototype.setOpacity  =  function (op) {
    this.opacity_ = op;
    var tiles = this.tiles;
    for (var x in tiles) {
      if (tiles.hasOwnProperty(x)) {
        setOpacity(tiles[x], op);
      }
    }
  };
  
  TileLayer.prototype.getOpacity  =  function () {
    return this.opacity_;
  };
  /**
   * @name MapTypeOptions
   * @class Instance of this class are used in the {@link opt_typeOpts} argument
   *  to the constructor of the {@link MapType} class. See 
   *  <a href=http://code.google.com/apis/maps/documentation/javascript/reference.html#MapType>google.maps.MapType</a>.
   * @property {String} [name] map type name
   * @property {Projection} [projection] an instance of {@link Projection}. 
   * @property {String} [alt] Alt text to display when this MapType's button is hovered over in the MapTypeControl. Optional.
   * @property {Number} [maxZoom] The maximum zoom level for the map when displaying this MapType. Required for base MapTypes, ignored for overlay MapTypes.
   * @property {Number} [minZoom] The minimum zoom level for the map when displaying this MapType. Optional; defaults to 0.
   * @property {Number} [radius] Radius of the planet for the map, in meters. Optional; defaults to Earth's equatorial radius of 6378137 meters.
   * @property {Size} [tileSize] The dimensions of each tile. Required.
   * @property {google.maps.Map} [map] The map instance. Can be useful for copyright info. 
   *   May not need if API provides access to map instance later.
   */
  /**
   * Creates a MapType, with the following parameters:
   * <li><code>tileLayers</code>: a array of {@link TileLayer}s, 
   *  or a single URL as shortcut.
   * <li><code>opt_typeOpts</code>: optional. An instance of {@link MapTypeOptions}
   * @name MapType
   * @class This class (<code>gmaps.ags.MapType</code>) extends the Google Maps API's
   * <a href  = http://code.google.com/apis/maps/documentation/javascript/reference.html#MapType>GMapType</a>.
   * It holds a list of {@link TileLayer}s.
   * <p> Because all tileLayers are loaded asynchronously, and currently the
   * core API does not have method to refresh tiles on demand, if you do not load the default
   * Google maps, you should either 1) add to
   * map after it "load" event is fired, or) trigger an map type change to force refresh.
   * See <a href  = http://code.google.com/p/gmaps-api-issues/issues/detail?id  = 279&can  = 1&q  = refresh&colspec  = ID%20Type%20Status%20Introduced%20Fixed%20Summary%20Stars%20ApiType%20Internal>Issue 279</a>
   * </p>
   * <p> Note: all tiled layer in the same map type must use same spatial reference and tile scheme.</p>
   * @param {String|TileLayer[]} tileLayers
   * @param {MapTypeOptions} opt_typeOpts
   */
  function MapType(tileLayers, opt_typeOpts) {
    //TODO: handle copyright info.
    opt_typeOpts = opt_typeOpts || {};
    var i;
    if (opt_typeOpts.opacity) {
      this.opacity_ = opt_typeOpts.opacity;
      delete opt_typeOpts.opacity;
    }
    augmentObject(opt_typeOpts, this);
    var layers = tileLayers;
    if (isString(tileLayers)) {
      layers = [new TileLayer(tileLayers)];
    } else if (tileLayers instanceof TileLayer) {
      layers = [tileLayers];
    } else if (tileLayers.length > 0 && isString(tileLayers[0])) {
      layers = [];
      for (i = 0; i < tileLayers.length; i++) {
        layers[i] = new TileLayer(tileLayers[i]);
      }
    }
    this.tileLayers = layers;
    this.tiles = {};
    //this.map_ = opt_typeOpts.map;
    if (opt_typeOpts.maxZoom !== undefined) {
      this.maxZoom = opt_typeOpts.maxZoom;
    } else {
      var maxZ = 0;
      for (i = 0; i < layers.length; i++) {
        maxZ = Math.max(maxZ, layers[i].maxZoom);
      }
      this.maxZoom = maxZ;
    }
    if (layers[0].projection) {
      this.tileSize = layers[0].projection.tileSize;
      this.projection = layers[0].projection;
    } else {
      this.tileSize = new G.Size(256, 256);
    }
    if (!this.name) {
      this.name = layers[0].name;
    }
    
  }
  
  /**
   * Get a tile for given tile coordinates Returns a tile for the given tile coordinate (x, y) and zoom level. 
   * This tile will be appended to the given ownerDocument.
   * @param {Point} tileCoord
   * @param {Number} zoom
   * @return {Node}
   */
  MapType.prototype.getTile = function (tileCoord, zoom, ownerDocument) {
    var div = ownerDocument.createElement('div');
    var tileId = '_' + tileCoord.x + '_' + tileCoord.y + '_' + zoom;
    for (var i = 0; i < this.tileLayers.length; i++) {
      var t = this.tileLayers[i];
      if (zoom <= t.maxZoom && zoom >= t.minZoom) {
        var url = t.getTileUrl(tileCoord, zoom);
        if (url) {
          var img = ownerDocument.createElement(document.all ? 'img' : 'div');//IE does not like img
          img.style.border = '0px none';
          img.style.margin = '0px';
          img.style.padding = '0px';
          img.style.overflow = 'hidden';
          img.style.position = 'absolute';
          img.style.top = '0px';
          img.style.left = '0px';
          img.style.width = '' + this.tileSize.width + 'px';
          img.style.height = '' + this.tileSize.height + 'px';
          //log(url);
          if (document.all) {
            img.src = url;
          } else {
            img.style.backgroundImage = 'url(' + url + ')';
          }
          div.appendChild(img);
          t.tiles[tileId] = img;
          if (t.opacity_ !== undefined) {
            setOpacity(img, t.opacity_);
          } else if (this.opacity_ !== undefined) {
            // in FF it's OK to set parent div just once but IE does not like it.
            setOpacity(img, this.opacity_);
          }
        } else {
          // TODO: use a div to display NoData
        }
      }
    }
    div.setAttribute('tid', tileId);
    this.tiles[tileId] = div;
    return div;
  };
  /**
   * Release tile and cleanup
   * @param {Node} node
   */
  MapType.prototype.releaseTile = function (node) {
    var tileId = node.getAttribute('tid');
    if (tileId) {
      if (this.tiles[tileId]) {
        delete this.tiles[tileId];
      }
      for (var i = 0; i < this.tileLayers.length; i++) {
        var t = this.tileLayers[i];
        if (t.tiles[tileId]) {
          delete t.tiles[tileId];
        } 
      }
    }
  };
  
  MapType.prototype.setOpacity = function (op) {
    this.opacity_ = op;
    var tiles = this.tiles;
    for (var x in tiles) {
      if (tiles.hasOwnProperty(x)) {
        var nodes = tiles[x].childNodes;
        for (var i = 0; i < nodes.length; i++) {
          setOpacity(nodes[i], op);
        }
      }
    }
  };
  
  MapType.prototype.getOpacity  =  function () {
    return this.opacity_;
  };
  
  /**
   * @name MapOverlayOptions
   * @class Instance of this class are used in the {@link ArcGISopt_ovelayOpts} argument
   *  to the constructor of the {@link MapOverlay} class.
   * @property {Number} [opacity  = 1.0] Opacity of map image from 0.0 (invisible) to 1.0 (opaque)
   * @property {ExportMapOptions} [exportOptions] See {@link ExportMapOptions}
   * @property {String} [name] name assigned to this {@link MapOverlay}
   * @property {Number} [minResolution] min zoom level.
   * @property {Number} [maxResolution] max zoom level.
   * @property {google.maps.Map} [map] map to attach to.
   */
  
  /**
   * Creates an Map Overlay using <code>url</code> of the map service and optional {@link MapOverlayOptions}.
   * <li/> <code> service</code> (required) is url of the underline {@link MapService} or the MapService itself.
   * <li/> <code>opt_overlayOpts</code> (optional) is an instance of {@link MapOverlayOptions}.
   * @name MapOverlay
   * @class This class (<code>gmaps.ags.MapOverlay</code>) extends the Google Maps API's
   * <a href  = http://code.google.com/apis/maps/documentation/reference.html#OverlayView>OverlayView</a>
   * that draws map images from data source on the fly. It is also known as "<b>Dynamic Maps</b>".
   * It can be added to the map via <code>GMap.addOverlay </code> method.
   * The similar class in the core GMap API is <a href  = http://code.google.com/apis/maps/documentation/javascript/reference.html#GroundOverlay>GGroundOverlay</a>,
   * however, the instance of this class always cover the viewport exactly, and will redraw itself as map moves.
   * @constructor
   * @param {String|MapService} service
   * @param {MapOverlayOptions} opt_overlayOpts
   */
  function MapOverlay(service, opt_overlayOpts) {
    opt_overlayOpts  =  opt_overlayOpts || {};
    this.mapService  = (service instanceof MapService)?service:new MapService(service);
    
    this.minZoom  = opt_overlayOpts.minZoom;
    this.maxZoom  = opt_overlayOpts.maxZoom;
    this.opacity_  =  opt_overlayOpts.opacity || 1;
    this.exportOptions_  = opt_overlayOpts.exportOptions || {};
    this.drawing_ = false;
    // do we need another refresh. Normally happens bounds changed before server returns image.
    this.needsNewRefresh_ = false;
    this.div_ = null;
    // Once the LatLng and text are set, add the overlay to the map.  This will
    // trigger a call to panes_changed which should in turn call draw.
    if (opt_overlayOpts.map) {
      this.setMap(opt_overlayOpts.map);
    }
  }
  
  MapOverlay.prototype  =  new G.OverlayView();
 
  /**
   * Handler when overlay is added. Interface method.
   * This will be called after setMap(map) is called.
   */
  MapOverlay.prototype.onAdd = function () {
    var div = document.createElement("div");
    div.style.position = "absolute";
    
    div.style.border = 'none'; //'1px solid red';
    div.style.position = "absolute";
    
    this.div_ = div;
    
    var panes = this.getPanes();
    panes.overlayLayer.appendChild(div);
    if (this.opacity_) {
      setOpacity(div, this.opacity_);
    }
    var me = this;
    this.boundsChangedListener_ = G.event.addListener(this.getMap(), 'bounds_changed', function () {
      me.refresh();
    });
  };
  
  MapOverlay.prototype.onRemove = function () {
    G.event.removeListener(this.boundsChangedListener_);
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
  };
  
  /**
   * The API invokes a separate draw() method on the overlay whenever it needs to draw 
   * the overlay on the map (including when first added).
   * Implement this method to draw or update the overlay. 
   * This method is called after onAdd() and when 
   * the position from projection.fromLatLngToPixel() 
   * would return a new value for a given LatLng. 
   * This can happen on change of zoom, center, or 
   * map type. It is not necessarily called on drag or resize.
   * See OverlayView.draw.
   */
  MapOverlay.prototype.draw = function () {
    if (!this.drawing_ || this.needsNewRefresh_ === true) {
      this.refresh();
    }
  };
  
  /**
   * Gets Image Opacity. return <code>opacity</code> between 0-1.
   * @return {Number} opacity
   */
  MapOverlay.prototype.getOpacity  =  function () {
    return this.opacity_;
  };
  /**
   * Sets Image Opacity. parameter <code>opacity</code> between 0-1.
   * @param {Number} opacity
   */
  MapOverlay.prototype.setOpacity = function (opacity) {
    var op = Math.min(Math.max(opacity, 0), 1);
    this.opacity_ = op;
    var img = this.div_;
    setOpacity(img, op);
  };
  
  /**
   * Refresh the map image in current view port.
   */
  MapOverlay.prototype.refresh  =  function () {
    
    if (this.drawing_ === true) {
      this.needsNewRefresh_ = true;
      return;
    }
    var m = this.getMap();
    var bnds = m ? m.getBounds() : null;
    if (!bnds) {
      return;
    }
    var params = this.exportOptions_;
    params.bounds = bnds;
    var sr = WEB_MERCATOR;
    // V3 no map.getSize()
    var s = m.getDiv();
    params.width = s.offsetWidth; 
    params.height = s.offsetHeight;
    var prj = m.getProjection(); // note this is not same as this.getProjection which returns MapCanvasProjection
    if (prj && prj instanceof Projection) {
      sr = prj.spatialReference;
    }
    params.imageSR = sr;
    /**
     * This event is fired before the the drawing request was sent to server.
     * @name MapOverlay#drawstart
     * @event
     */
    G.event.trigger(this, 'drawstart');
    var me = this;
    this.drawing_ = true;
    this.div_.style.backgroundImage = '';
    this.mapService.exportMap(params, function (json) {
      me.drawing_ = false;
      if (me.needsNewRefresh_ === true) {
        me.needsNewRefresh_ = false;
        me.refresh();
        return;
      }
      if (json.href) {
        // Size and position the overlay. We use a southwest and northeast
        // position of the overlay to peg it to the correct position and size.
        // We need to retrieve the projection from this overlay to do this.
        var overlayProjection = me.getProjection();
        
        var bounds = json.bounds;//this.getMap().getBounds();
        var sw = overlayProjection.fromLatLngToDivPixel(bounds.getSouthWest());
        var ne = overlayProjection.fromLatLngToDivPixel(bounds.getNorthEast());
        
        // Resize the image's DIV to fit the indicated dimensions.
        var div = me.div_;
        div.style.left = sw.x + 'px';
        div.style.top = ne.y + 'px';
        div.style.width = (ne.x - sw.x) + 'px';
        div.style.height = (sw.y - ne.y) + 'px';
        me.div_.style.backgroundImage = 'url(' + json.href + ')';
        me.setOpacity(me.opacity_);
      }
      /**
       * This event is fired after the the drawing request was returned by server.
       * @name MapOverlay#drawend
       * @event
       */
      G.event.trigger(me, 'drawend');
    });
  };

  /**
   * Get full bounds of the to the underline {@link MapService}
   * @return {GLatLngBounds}
   */
  MapOverlay.prototype.getFullBounds  =  function () {
    this.fullBounds_  = this.fullBounds_ || fromEnvelopeToLatLngBounds(this.mapService.fullExtent);
    return this.fullBounds_;
  };
  /**
   * Get initial bounds of the to the underline {@link MapService}
   * @return {GLatLngBounds}
   */
  MapOverlay.prototype.getInitialBounds  =  function () {
    this.initialBounds_  = this.initialBounds_ || fromEnvelopeToLatLngBounds(this.mapService.initialExtent);
    return this.initialBounds_;
  };
 
  
  

  
  /**
   * Get the copyright information for the underline {@link MapService}.
   * @param {GLatLngBounds} bounds
   * @param {Number} zoom
   * @return {String}
   //TODO
  MapOverlay.prototype.getCopyright  = function (bounds, zoom) {
    if (!this.isHidden() && this.getFullBounds().intersects(bounds) && this.isInZoomRange_()) {
      return this.mapService_.copyrightText;
    }
  };
  */
  /**
   * Check if the overlay is visible, and within zoomzoom range and current map bounds intersects with it's fullbounds.
   * @return {Boolean} visible
   */
  MapOverlay.prototype.isHidden  =  function () {
    return !(this.visible_ && this.isInZoomRange_());
  };
  /**
   * If this in zoom range
   * @return {Boolean}
   */
  MapOverlay.prototype.isInZoomRange_  =  function () {
    var z  = this.getMap().getZoom();
    if ((this.minZoom !== undefined && z < this.minZoom) || 
     (this.maxZoom !== undefined && z > this.maxZoom)) {
      return false; 
    } 
    return true;
  };
  
  /**
   * Makes the overlay visible.
   */
  MapOverlay.prototype.show  =  function () {
    this.visible_  =  true;
    this.div_.style.visibility  =  'visible';
    this.refresh();
  };
  /**
   * Hide the overlay
   */
  MapOverlay.prototype.hide  =  function () {
    this.visible_  =  false;
    this.div_.style.visibility  =  'hidden';
  };
  
  
  
  //start of add-on classes
  
  /**
   * @name OverlayOptions
   * @class Instance of this classes that specify how
   *   the geometry features returned by ArcGIS server should be rendered in the browser.
   * @property {google.maps.MarkerOptions} [marker] style option for points.
   * @property {google.maps.PolylineOptions} [polyline] style option for polylines. {@link http://code.google.com/apis/maps/documentation/javascript/reference.html#PolylineOptions}
   * @property {google.maps.PolygonOptions} [polygon] style option for polygons {@link http://code.google.com/apis/maps/documentation/javascript/reference.html#PolygonOptions}
   */
  
  
  var arcgis = {
    'SpatialReference': SpatialReference,
    'Geographic': Geographic,
    'LambertConformalConic': LambertConformalConic,
    'SphereMercator': SphereMercator,
    'TransverseMercator': TransverseMercator,
    'FlatSpatialReference': FlatSpatialReference,
    'SpatialReferences': SpatialReferences,
    'SpatialRelationship': SpatialRelationship,
    'GeometryType': GeometryType,
    'Catalog': Catalog,
    'MapService': MapService,
    'Layer': Layer,
    'GeocodeService': GeocodeService,
    'GeometryService': GeometryService,
    'Util': Util,
    'Config': Config,
    'Projection': Projection,
    'TileLayer': TileLayer,
    'MapOverlay': MapOverlay,
    'MapType': MapType
  };
  var NS = namespace('gmaps');
  NS.ags = arcgis;
})();
 

 /* *
 * @name Domain
 * @class This class represent JSON domain objects as returned by the REST API. Domains specify the set of valid values for a field. 
 *   There is no constructor, use JavaScript object literal.
 * <br/>For more info see <a  href  = 'http://sampleserver3.arcgisonline.com/ArcGIS/SDK/REST/domain.html'>Domain Objects</a>.
 * Syntax:
 * <pre>
    {
      "type" : "range",
      "name" : "&lt;domainName>",
      "range" : [ minValue, maxValue ]
    }
    {
      "type" : "codedValue",
      "name" : "&lt;domainName>",
      "codedValues" : [
        { "name" : "codeName1", "code" : code1 },
        { "name" : "codeName2", "code" : code2 }
      ]
    }
 * </pre>
 * @property {type} [String] range | codedValue
 * @property {String} [name] domain name.
 * @property {Array} [codedValue] name-code pairs. only if type=codedValue.
 * @property {Array} [range] min,max values. only if type=codedValue.
 */ 
/* *
 * @name Color
 * @class Color is represented as a 4-element array. The 4 elements represent values for red, green, blue and alpha in that order. Values range from 0 through 255.
 *   There is no constructor, use JavaScript object literal.
 * <br/>For more info see <a  href  = 'http://sampleserver3.arcgisonline.com/ArcGIS/SDK/REST/symbol.html'>Symbol Objects</a>.
 * Syntax:
 * <pre>
   [ &lt;red>, &lt;green>, &lt;blue>, &lt;alpha> ]
 * </pre>
 */ 
/* *
 * @name SimpleMarkerSymbol
 * @class Simple marker symbols can be used to symbolize point geometries. The type property for simple marker symbols is esriSMS. 
 *   There is no constructor, use JavaScript object literal.
 * <br/>For more info see <a  href  = 'http://sampleserver3.arcgisonline.com/ArcGIS/SDK/REST/symbol.html'>Symbol Objects</a>.
 * Example:
 * <pre>
   {
"type" : "esriSMS",
"style" : "&lt;esriSMSCircle | esriSMSCross | esriSMSDiamond | esriSMSSquare | esriSMSX&gt;",
"color" : &lt;color>,
"size" : &lt;size>,
"angle" : &lt;angle>,
"xoffset" : &lt;xoffset>,
"yoffset" : &lt;yoffset>,
"outline" : { //if outline has been specified
  "color" : &lt;color>,
  "width" : &lt;width>
}
}

 * </pre>
 */ 
/* *
 * @name SimpleLineSymbol
 * @class Simple line symbols can be used to symbolize polyline geometries. The type property for simple line symbols is esriSLS. 
 *   There is no constructor, use JavaScript object literal.
 * <br/>For more info see <a  href  = 'http://sampleserver3.arcgisonline.com/ArcGIS/SDK/REST/symbol.html'>Symbol Objects</a>.
 * Syntax:
 * <pre>
   {
"type" : "esriSLS",
"style" : "&lt; esriSLSDash | esriSLSDashDotDot | esriSLSDot | esriSLSNull | esriSLSSolid >",
"color" : &lt;color>,
"width" : &lt;width>
}

 * </pre>
 */ 
/* *
 * @name SimpleFillSymbol
 * @class SimpleFillSymbol can be used to symbolize polygon geometries. The type property for simple line symbols is esriSFS. 
 *   There is no constructor, use JavaScript object literal.
 * <br/>For more info see <a  href  = 'http://sampleserver3.arcgisonline.com/ArcGIS/SDK/REST/symbol.html'>Symbol Objects</a>.
 * Syntax:
 * <pre>
   {
"type" : "esriSFS",
"style" : "&lt; esriSFSBackwardDiagonal | esriSFSCross | esriSFSDiagonalCross | esriSFSForwardDiagonal | esriSFSHorizontal | esriSFSNull | esriSFSSolid | esriSFSVertical >",
"color" : &lt;color>,
"outline" : &lt;simpleLineSymbol> //if outline has been specified
}

 * </pre>
 */ 
/* *
 * @name PictureMarkerSymbol
 * @class Picture marker symbols can be used to symbolize point geometries. The type property for picture marker symbols is esriPMS.  
 *  There is no constructor, use JavaScript object literal.
 * <br/>For more info see <a  href  = 'http://sampleserver3.arcgisonline.com/ArcGIS/SDK/REST/symbol.html'>Symbol Objects</a>.
 * Syntax:
 * <pre>
  {
"type" : "esriPMS",
"url" : "&lt;pictureUrl>",
"color" : &lt;color>,
"width" : &lt;width>,
"height" : &lt;height>,
"angle" : &lt;angle>,
"xoffset" : &lt;xoffset>,
"yoffset" : &lt;yoffset>
}
 * </pre>
 */ 
/* *
 * @name PictureFillSymbol
 * @class Picture fill symbols can be used to symbolize polygon geometries. The type property for picture fill symbols is esriPFS. 
 * There is no constructor, use JavaScript object literal.
 * <br/>For more info see <a  href  = 'http://sampleserver3.arcgisonline.com/ArcGIS/SDK/REST/symbol.html'>Symbol Objects</a>.
 * Syntax:
 * <pre>
{
"type" : "esriPFS",
"url" : "&lt;pictureUrl>",
"color" : &lt;color>,
"outline" : &lt;simpleLineSymbol>, //if outline has been specified
"width" : &lt;width>,
"height" : &lt;height>,
"angle" : &lt;angle>,
"xoffset" : &lt;xoffset>,
"yoffset" : &lt;yoffset>,
"xscale": &lt;xscale>,
"yscale": &lt;yscale>
}
 * </pre>
 */ 
/* *
 * @name TextSymbol
 * @class Text symbols are used to add text to a feature (labeling). The type property for text symbols is esriTS.
 * There is no constructor, use JavaScript object literal.
 * <br/>For more info see <a  href  = 'http://sampleserver3.arcgisonline.com/ArcGIS/SDK/REST/symbol.html'>Symbol Objects</a>.
 * Syntax:
 * <pre>
 {
 "type" : "esriTS",
 "color" : &lt;color>,
 "backgroundColor" : &lt;color>,
 "borderLineColor" : &lt;color>,
 "verticalAlignment" : "&lt;baseline | top | middle | bottom>",
 "horizontalAlignment" : "&lt;left | right | center | justify>",
 "rightToLeft" : &lt;true | false>,
 "angle" : &lt;angle>,
 "xoffset" : &lt;xoffset>,
 "yoffset" : &lt;yoffset>,
 "kerning" : &lt;true | false>,
 "font" : {
 "family" : "&lt;fontFamily>",
 "size" : &lt;fontSize>,
 "style" : "&lt;italic | normal | oblique>",
 "weight" : "&lt;bold | bolder | lighter | normal>",
 "decoration" : "&lt;line-through | underline | none>"
 }
 }
 * </pre>
 */
/* *
   * @name Field
   * @class This class represents a field in a {@link Layer}. It is accessed from
   * the <code> fields</code> property. There is no constructor for this class,
   *  use Object Literal.
   * @property {String} [name] field Name
   * @property {String} [type] field type (esriFieldTypeOID|esriFieldTypeString|esriFieldTypeInteger|esriFieldTypeGeometry}.
   * @property {String} [alias] field alias.
   * @property {Domain} [domain] domain
   * @property {Int} [length] length.
   */
  /* *
   * @name DrawingInfo
   * @class Layer rendering info
   * Syntax:<pre>
   * "drawingInfo" : {
  "renderer" : &lt;renderer>,
  "scaleSymbols" : &lt; true | false >,
  "transparency" : &lt;transparency>,
  "brightness" : &lt;brightness>,
  "contrast" : &lt;contrast>,
  "labelingInfo" : &lt;labelingInfo>
}
  </pre>
  */
  /* *
   * @name TimeInfo
   * @class TimeInfo if the layer / table supports querying and exporting maps based on time.
   * Syntax:
   * <pre>
   * "timeInfo" : {
  "startTimeField" : "&lt;startTimeFieldName>",
  "endTimeField" : "&lt;endTimeFieldName>",
  "trackIdField" : "&lt;trackIdFieldName>",
  "timeExtent" : [&lt;startTime>, &lt;endTime>],
  "timeReference" : {
    "timeZone" : "&lt;timeZone>",
    "respectsDaylightSaving" : &lt;true | false>
  },
  "timeInterval" : &lt;timeInterval>,
  "timeIntervalUnits" : "&lt;timeIntervalUnits>",
  //the default time-related export options for this layer
  "exportOptions" : { 
    //If true, use the time extent specified by the time parameter
    "useTime" : &lt; true | false >,
    //If true, draw all the features from the beginning of time for that data
    "timeDataCumulative" : &lt; true | false >,
    //Time offset for this layer so that it can be overlaid on the top of a previous or future time period
    "timeOffset" : &lt;timeOffset1>,
    "timeOffsetUnits" : "&lt;esriTimeUnitsCenturies | esriTimeUnitsDays | esriTimeUnitsDecades | 
                             esriTimeUnitsHours | esriTimeUnitsMilliseconds | esriTimeUnitsMinutes | 
                             esriTimeUnitsMonths | esriTimeUnitsSeconds | esriTimeUnitsWeeks | esriTimeUnitsYears |
                             esriTimeUnitsUnknown>"
  }
   * </pre>
   */
  
  
