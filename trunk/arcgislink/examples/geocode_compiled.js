(function(){/*
 http://google-maps-utility-library-v3.googlecode.com
*/
var f, h = Math.PI / 180, i = 0;
window.ags_jsonp = window.ags_jsonp || {};
var j = google.maps, l, n, p, q = {L:null, K:false}, r = {}, s = {};
function t(a, c, b) {
  var d = c === "" ? 0 : a.indexOf(c);
  return a.substring(d + c.length, b === "" ? a.length : a.indexOf(b, d + c.length))
}
function u(a) {
  return a && a.splice
}
function v(a, c, b) {
  if(a && c) {
    var d;
    for(d in a) {
      if(b || !(d in c)) {
        c[d] = a[d]
      }
    }
  }
  return c
}
function w() {
  j.event.trigger.apply(this, arguments)
}
function x() {
  if(typeof XMLHttpRequest === "undefined") {
    try {
      return new ActiveXObject("Msxml2.XMLHTTP.6.0")
    }catch(a) {
    }
    try {
      return new ActiveXObject("Msxml2.XMLHTTP.3.0")
    }catch(c) {
    }
    try {
      return new ActiveXObject("Msxml2.XMLHTTP")
    }catch(b) {
    }
    throw new Error("This browser does not support XMLHttpRequest.");
  }else {
    return new XMLHttpRequest
  }
}
var y = "esriGeometryPoint", z = "esriGeometryMultipoint", A = "esriGeometryPolyline", B = "esriGeometryPolygon", C = "esriGeometryEnvelope";
function D(a) {
  var c = a;
  if(u(a) && a.length > 0) {
    c = a[0]
  }
  if(c instanceof j.LatLng || c instanceof j.Marker) {
    return u(a) && a.length > 1 ? z : y
  }else {
    if(c instanceof j.Polyline) {
      return A
    }else {
      if(c instanceof j.Polygon) {
        return B
      }else {
        if(c instanceof j.LatLngBounds) {
          return C
        }else {
          if(c.x !== undefined && c.y !== undefined) {
            return y
          }else {
            if(c.points) {
              return z
            }else {
              if(c.paths) {
                return A
              }else {
                if(c.rings) {
                  return B
                }
              }
            }
          }
        }
      }
    }
  }
  return null
}
function E(a) {
  var c = a;
  if(u(a) && a.length > 0) {
    c = a[0]
  }
  if(u(c) && c.length > 0) {
    c = c[0]
  }
  if(c instanceof j.LatLng || c instanceof j.Marker || c instanceof j.Polyline || c instanceof j.Polygon || c instanceof j.LatLngBounds) {
    return true
  }
  return false
}
function F(a, c) {
  for(var b = [], d, e = 0, g = a.getLength();e < g;e++) {
    d = a.getAt(e);
    b.push("[" + d.lng() + "," + d.lat() + "]")
  }
  c && b.length > 0 && b.push("[" + a.getAt(0).lng() + "," + a.getAt(0).lat() + "]");
  return b.join(",")
}
function G(a) {
  var c;
  if(typeof a === "object") {
    if(u(a)) {
      c = [];
      for(var b = 0, d = a.length;b < d;b++) {
        c.push(G(a[b]))
      }
      return"[" + c.join(",") + "]"
    }else {
      if(E(a)) {
        var e;
        d = "{";
        switch(D(a)) {
          case y:
            e = u(a) ? a[0] : a;
            if(e instanceof j.Marker) {
              e = e.getPosition()
            }
            d += "x:" + e.lng() + ",y:" + e.lat();
            break;
          case z:
            b = [];
            for(c = 0;c < a.length;c++) {
              e = a[c] instanceof j.Marker ? a[c].getPosition() : a[c];
              b.push("[" + e.lng() + "," + e.lat() + "]")
            }
            d += "points: [" + b.join(",") + "]";
            break;
          case A:
            b = [];
            a = u(a) ? a : [a];
            for(c = 0;c < a.length;c++) {
              b.push("[" + F(a[c].getPath()) + "]")
            }
            d += "paths:[" + b.join(",") + "]";
            break;
          case B:
            b = [];
            e = u(a) ? a[0] : a;
            a = e.getPaths();
            for(c = 0;c < a.getLength();c++) {
              b.push("[" + F(a.getAt(c), true) + "]")
            }
            d += "rings:[" + b.join(",") + "]";
            break;
          case C:
            e = u(a) ? a[0] : a;
            d += "xmin:" + e.getSouthWest().lng() + ",ymin:" + e.getSouthWest().lat() + ",xmax:" + e.getNorthEast().lng() + ",ymax:" + e.getNorthEast().lat();
            break
        }
        d += ", spatialReference:{wkid:4326}";
        d += "}";
        return d
      }else {
        if(a.toJSON) {
          return a.toJSON()
        }else {
          c = "";
          for(b in a) {
            if(a.hasOwnProperty(b)) {
              if(c.length > 0) {
                c += ", "
              }
              c += b + ":" + G(a[b])
            }
          }
          return"{" + c + "}"
        }
      }
    }
  }
  return a.toString()
}
function H(a) {
  var c = "";
  if(a) {
    a.f = a.f || "json";
    for(var b in a) {
      if(a.hasOwnProperty(b) && a[b] !== null && a[b] !== undefined) {
        var d = G(a[b]);
        c += b + "=" + (escape ? escape(d) : encodeURIComponent(d)) + "&"
      }
    }
  }
  return c
}
function I(a, c, b, d) {
  var e = "ags_jsonp_" + i++ + "_" + Math.floor(Math.random() * 1E6), g = null;
  c = c || {};
  c[b || "callback"] = "ags_jsonp." + e;
  c = H(c);
  var m = document.getElementsByTagName("head")[0];
  if(!m) {
    throw new Error("document must have header tag");
  }
  window.ags_jsonp[e] = function() {
    window.ags_jsonp[e] && delete window.ags_jsonp[e];
    g && m.removeChild(g);
    g = null;
    d.apply(null, arguments);
    w(s, "jsonpend", e)
  };
  if((c + a).length < 2E3 && !q.K) {
    g = document.createElement("script");
    g.src = a + (a.indexOf("?") === -1 ? "?" : "&") + c;
    g.id = e;
    m.appendChild(g)
  }else {
    b = window.location;
    b = b.protocol + "//" + b.hostname + (!b.port || b.port === 80 ? "" : ":" + b.port + "/");
    var k = true;
    if(a.toLowerCase().indexOf(b.toLowerCase()) !== -1) {
      k = false
    }
    if(q.K) {
      k = true
    }
    if(k && !q.L) {
      throw new Error("No proxyUrl property in Config is defined");
    }
    var o = x();
    o.onreadystatechange = function() {
      if(o.readyState === 4) {
        if(o.status === 200) {
          eval(o.responseText)
        }else {
          throw new Error("Error code " + o.status);
        }
      }
    };
    o.open("POST", k ? q.L + "?" + a : a, true);
    o.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    o.send(c)
  }
  w(s, "jsonpstart", e);
  return e
}
s.T = function(a, c, b, d) {
  I(a, c, b, d)
};
s.J = function(a, c) {
  if(u(c)) {
    for(var b, d = 0, e = c.length;d < e;d++) {
      b = c[d];
      if(u(b)) {
        s.J(a, b)
      }else {
        E(b) && b.setMap(a)
      }
    }
  }
};
s.V = function(a, c) {
  s.J(null, a);
  if(c) {
    a.length = 0
  }
};
function J(a) {
  a = a || {};
  this.wkid = a.wkid;
  this.wkt = a.wkt
}
J.prototype.forward = function(a) {
  return a
};
J.prototype.q = function(a) {
  return a
};
J.prototype.m = function() {
  return 360
};
J.prototype.toJSON = function() {
  return"{" + (this.wkid ? " wkid:" + this.wkid : "wkt: '" + this.wkt + "'") + "}"
};
function K(a) {
  a = a || {};
  J.call(this, a)
}
K.prototype = new J;
function L(a) {
  a = a || {};
  J.call(this, a);
  var c = a.B, b = a.G * h, d = a.H * h, e = a.C * h;
  this.a = a.n / a.unit;
  this.e = a.l * h;
  this.h = a.w;
  this.i = a.z;
  a = 1 / c;
  c = 2 * a - a * a;
  this.d = Math.sqrt(c);
  a = this.j(b, c);
  c = this.j(d, c);
  e = M(this, e, this.d);
  b = M(this, b, this.d);
  d = M(this, d, this.d);
  this.b = Math.log(a / c) / Math.log(b / d);
  this.u = a / (this.b * Math.pow(b, this.b));
  this.g = this.p(this.a, this.u, e, this.b)
}
L.prototype = new J;
L.prototype.j = function(a, c) {
  var b = Math.sin(a);
  return Math.cos(a) / Math.sqrt(1 - c * b * b)
};
function M(a, c, b) {
  a = b * Math.sin(c);
  return Math.tan(Math.PI / 4 - c / 2) / Math.pow((1 - a) / (1 + a), b / 2)
}
f = L.prototype;
f.p = function(a, c, b, d) {
  return a * c * Math.pow(b, d)
};
f.o = function(a, c, b) {
  b = c * Math.sin(b);
  return Math.PI / 2 - 2 * Math.atan(a * Math.pow((1 - b) / (1 + b), c / 2))
};
f.D = function(a, c, b) {
  var d = 0;
  b = b;
  for(var e = this.o(a, c, b);Math.abs(e - b) > 1.0E-9 && d < 10;) {
    d++;
    b = e;
    e = this.o(a, c, b)
  }
  return e
};
f.forward = function(a) {
  var c = a[0] * h;
  a = this.p(this.a, this.u, M(this, a[1] * h, this.d), this.b);
  c = this.b * (c - this.e);
  return[this.h + a * Math.sin(c), this.i + this.g - a * Math.cos(c)]
};
f.q = function(a) {
  var c = a[0] - this.h, b = a[1] - this.i;
  a = Math.atan(c / (this.g - b));
  c = Math.pow((this.b > 0 ? 1 : -1) * Math.sqrt(c * c + (this.g - b) * (this.g - b)) / (this.a * this.u), 1 / this.b);
  return[(a / this.b + this.e) / h, this.D(c, this.d, Math.PI / 2 - 2 * Math.atan(c)) / h]
};
f.m = function() {
  return Math.PI * 2 * this.a
};
function N(a) {
  a = a || {};
  J.call(this, a);
  this.a = a.n / a.unit;
  var c = a.B;
  this.s = a.S;
  var b = a.C * h;
  this.e = a.l * h;
  this.h = a.w;
  this.i = a.z;
  a = 1 / c;
  this.c = 2 * a - a * a;
  this.r = this.c * this.c;
  this.v = this.r * this.c;
  this.k = this.c / (1 - this.c);
  this.I = this.j(b, this.a, this.c, this.r, this.v)
}
N.prototype = new J;
N.prototype.j = function(a, c, b, d, e) {
  return c * ((1 - b / 4 - 3 * d / 64 - 5 * e / 256) * a - (3 * b / 8 + 3 * d / 32 + 45 * e / 1024) * Math.sin(2 * a) + (15 * d / 256 + 45 * e / 1024) * Math.sin(4 * a) - 35 * e / 3072 * Math.sin(6 * a))
};
N.prototype.forward = function(a) {
  var c = a[1] * h, b = a[0] * h;
  a = this.a / Math.sqrt(1 - this.c * Math.pow(Math.sin(c), 2));
  var d = Math.pow(Math.tan(c), 2), e = this.k * Math.pow(Math.cos(c), 2);
  b = (b - this.e) * Math.cos(c);
  var g = this.j(c, this.a, this.c, this.r, this.v);
  return[this.h + this.s * a * (b + (1 - d + e) * Math.pow(b, 3) / 6 + (5 - 18 * d + d * d + 72 * e - 58 * this.k) * Math.pow(b, 5) / 120), this.i + this.s * (g - this.I) + a * Math.tan(c) * (b * b / 2 + (5 - d + 9 * e + 4 * e * e) * Math.pow(b, 4) / 120 + (61 - 58 * d + d * d + 600 * e - 330 * this.k) * Math.pow(b, 6) / 720)]
};
N.prototype.q = function(a) {
  var c = a[0], b = a[1];
  a = (1 - Math.sqrt(1 - this.c)) / (1 + Math.sqrt(1 - this.c));
  b = (this.I + (b - this.i) / this.s) / (this.a * (1 - this.c / 4 - 3 * this.r / 64 - 5 * this.v / 256));
  a = b + (3 * a / 2 - 27 * Math.pow(a, 3) / 32) * Math.sin(2 * b) + (21 * a * a / 16 - 55 * Math.pow(a, 4) / 32) * Math.sin(4 * b) + 151 * Math.pow(a, 3) / 6 * Math.sin(6 * b) + 1097 * Math.pow(a, 4) / 512 * Math.sin(8 * b);
  b = this.k * Math.pow(Math.cos(a), 2);
  var d = Math.pow(Math.tan(a), 2), e = this.a / Math.sqrt(1 - this.c * Math.pow(Math.sin(a), 2)), g = this.a * (1 - this.c) / Math.pow(1 - this.c * Math.pow(Math.sin(a), 2), 1.5);
  c = (c - this.h) / (e * this.s);
  e = a - e * Math.tan(a) / g * (c * c / 2 - (5 + 3 * d + 10 * b - 4 * b * b - 9 * this.k) * Math.pow(c, 4) / 24 + (61 + 90 * d + 28 * b + 45 * d * d - 252 * this.k - 3 * b * b) * Math.pow(c, 6) / 720);
  return[(this.e + (c - (1 + 2 * d + b) * Math.pow(c, 3) / 6 + (5 - 2 * b + 28 * d - 3 * b * b + 8 * this.k + 24 * d * d) * Math.pow(c, 5) / 120) / Math.cos(a)) / h, e / h]
};
N.prototype.m = function() {
  return Math.PI * 2 * this.a
};
function O(a) {
  a = a || {};
  J.call(this, a);
  this.a = (a.n || 6378137) / (a.unit || 1);
  this.e = (a.l || 0) * h
}
O.prototype = new J;
O.prototype.forward = function(a) {
  var c = a[1] * h;
  return[this.a * (a[0] * h - this.e), this.a / 2 * Math.log((1 + Math.sin(c)) / (1 - Math.sin(c)))]
};
O.prototype.q = function(a) {
  return[(a[0] / this.a + this.e) / h, (Math.PI / 2 - 2 * Math.atan(Math.exp(-a[1] / this.a))) / h]
};
O.prototype.m = function() {
  return Math.PI * 2 * this.a
};
function R(a) {
  a = a || {};
  J.call(this, a);
  var c = a.B, b = a.G * h, d = a.H * h, e = a.C * h;
  this.a = a.n / a.unit;
  this.e = a.l * h;
  this.h = a.w;
  this.i = a.z;
  a = 1 / c;
  c = 2 * a - a * a;
  this.d = Math.sqrt(c);
  a = this.j(b, c);
  c = this.j(d, c);
  b = S(this, b, this.d);
  d = S(this, d, this.d);
  e = S(this, e, this.d);
  this.b = (a * a - c * c) / (d - b);
  this.t = a * a + this.b * b;
  this.g = this.p(this.a, this.t, this.b, e)
}
R.prototype = new J;
R.prototype.j = function(a, c) {
  var b = Math.sin(a);
  return Math.cos(a) / Math.sqrt(1 - c * b * b)
};
function S(a, c, b) {
  a = b * Math.sin(c);
  return(1 - b * b) * (Math.sin(c) / (1 - a * a) - 1 / (2 * b) * Math.log((1 - a) / (1 + a)))
}
f = R.prototype;
f.p = function(a, c, b, d) {
  return a * Math.sqrt(c - b * d) / b
};
f.o = function(a, c, b) {
  var d = c * Math.sin(b);
  return b + (1 - d * d) * (1 - d * d) / (2 * Math.cos(b)) * (a / (1 - c * c) - Math.sin(b) / (1 - d * d) + Math.log((1 - d) / (1 + d)) / (2 * c))
};
f.D = function(a, c, b) {
  var d = 0;
  b = b;
  for(var e = this.o(a, c, b);Math.abs(e - b) > 1.0E-8 && d < 10;) {
    d++;
    b = e;
    e = this.o(a, c, b)
  }
  return e
};
f.forward = function(a) {
  var c = a[0] * h;
  a = this.p(this.a, this.t, this.b, S(this, a[1] * h, this.d));
  c = this.b * (c - this.e);
  return[this.h + a * Math.sin(c), this.i + this.g - a * Math.cos(c)]
};
f.q = function(a) {
  var c = a[0] - this.h;
  a = a[1] - this.i;
  var b = Math.sqrt(c * c + (this.g - a) * (this.g - a)), d = this.b > 0 ? 1 : -1;
  b = (this.t - b * b * this.b * this.b / (this.a * this.a)) / this.b;
  return[(Math.atan(d * c / (d * this.g - d * a)) / this.b + this.e) / h, this.D(b, this.d, Math.asin(b / 2)) / h]
};
f.m = function() {
  return Math.PI * 2 * this.a
};
f.m = function() {
  return Math.PI * 2 * this.a
};
l = new K({wkid:4326});
n = new K({wkid:4269});
p = new O({wkid:102113, n:6378137, l:0, unit:1});
r = {"4326":l, "4269":n, "102113":p, "102100":new O({wkid:102100, n:6378137, l:0, unit:1})};
s.U = function(a, c) {
  var b = r["" + a];
  if(b) {
    return b
  }
  if(c instanceof J) {
    b = r["" + a] = c
  }else {
    b = c || a;
    var d = {wkt:a};
    if(a === parseInt(a, 10)) {
      d = {wkid:a}
    }
    var e = t(b, 'PROJECTION["', '"]'), g = t(b, "SPHEROID[", "]").split(",");
    if(e !== "") {
      d.unit = parseFloat(t(t(b, "PROJECTION", ""), "UNIT[", "]").split(",")[1]);
      d.n = parseFloat(g[1]);
      d.B = parseFloat(g[2]);
      d.C = parseFloat(t(b, '"Latitude_Of_Origin",', "]"));
      d.l = parseFloat(t(b, '"Central_Meridian",', "]"));
      d.w = parseFloat(t(b, '"False_Easting",', "]"));
      d.z = parseFloat(t(b, '"False_Northing",', "]"))
    }
    switch(e) {
      case "":
        b = new J(d);
        break;
      case "Lambert_Conformal_Conic":
        d.G = parseFloat(t(b, '"Standard_Parallel_1",', "]"));
        d.H = parseFloat(t(b, '"Standard_Parallel_2",', "]"));
        b = new L(d);
        break;
      case "Transverse_Mercator":
        d.S = parseFloat(t(b, '"Scale_Factor",', "]"));
        b = new N(d);
        break;
      case "Albers":
        d.G = parseFloat(t(b, '"Standard_Parallel_1",', "]"));
        d.H = parseFloat(t(b, '"Standard_Parallel_2",', "]"));
        b = new R(d);
        break;
      default:
        throw new Error(e + "  not supported");
    }
    if(b) {
      r["" + a] = b
    }
  }
  return b
};
function T(a) {
  this.url = a;
  this.O = false;
  var c = this;
  I(a, {}, "", function(b) {
    v(b, c);
    if(b.spatialReference) {
      c.spatialReference = r[b.spatialReference.wkid || b.spatialReference.wkt] || l
    }
    c.O = true;
    w(c, "load")
  })
}
function U(a, c, b, d) {
  var e = v(c, {});
  if(e.A) {
    v(e.A, e);
    delete e.A
  }
  if(u(e.outFields)) {
    e.outFields = e.outFields.join(",")
  }
  I(a.url + "/findAddressCandidates", e, "", function(g) {
    if(g.candidates) {
      for(var m, k, o = [], P = 0;P < g.candidates.length;P++) {
        m = g.candidates[P];
        k = m.location;
        if(!isNaN(k.x) && !isNaN(k.y)) {
          k = [k.x, k.y];
          var Q = a.spatialReference;
          if(c.outSR) {
            Q = r[c.outSR]
          }
          if(Q) {
            k = Q.q(k)
          }
          m.location = new j.LatLng(k[1], k[0]);
          o[o.length] = m
        }
      }
    }
    b({candidates:o});
    d && g && g.error && d(g.error)
  })
}
function V(a) {
  this.P = a ? a.lods : null;
  this.F = a ? r[a.spatialReference.wkid || a.spatialReference.wkt] : p;
  if(!this.F) {
    throw new Error("unsupported Spatial Reference");
  }
  this.M = a ? a.lods[0].resolution : 156543.033928;
  this.minZoom = Math.floor(Math.log(this.F.m() / this.M / 256) / Math.LN2 + 0.5);
  this.maxZoom = a ? this.minZoom + this.P.length - 1 : 20;
  if(j.Size) {
    this.W = a ? new j.Size(a.cols, a.rows) : new j.Size(256, 256)
  }
  this.N = Math.pow(2, this.minZoom) * this.M;
  this.Q = a ? a.origin.x : -2.0037508342787E7;
  this.R = a ? a.origin.y : 2.0037508342787E7;
  if(a) {
    for(var c, b = 0;b < a.lods.length - 1;b++) {
      c = a.lods[b].resolution / a.lods[b + 1].resolution;
      if(c > 2.001 || c < 1.999) {
        throw new Error("This type of map cache is not supported in V3. \nScale ratio between zoom levels must be 2");
      }
    }
  }
}
V.prototype.fromLatLngToPoint = function(a, c) {
  if(!a || isNaN(a.lat()) || isNaN(a.lng())) {
    return null
  }
  var b = this.F.forward([a.lng(), a.lat()]), d = c || new j.Point(0, 0);
  d.x = (b[0] - this.Q) / this.N;
  d.y = (this.R - b[1]) / this.N;
  return d
};
V.prototype.fromLatLngToPoint = V.prototype.fromLatLngToPoint;
new V;
new j.OverlayView;var W, X, Y, Z, $;
function aa(a) {
  var c = "Matched Address:" + a.address + "<br/>Score:" + a.score + "<br/>";
  if(a.attributes) {
    var b = a.attributes;
    for(var d in b) {
      if(b.hasOwnProperty(d)) {
        c += d + b[d] + "<br/>"
      }
    }
  }
  var e = a.location;
  a = new google.maps.Marker({title:a.address, position:e});
  google.maps.event.addListener(a, "click", function() {
    Y.setContent($ + "<br/>" + c);
    Y.setPosition(e);
    Y.open(W)
  });
  return a
}
window.onload = function() {
  var a = {zoom:4, center:new google.maps.LatLng(40, -100), mapTypeId:google.maps.MapTypeId.ROADMAP};
  W = new google.maps.Map(document.getElementById("map_canvas"), a);
  X = new T("http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Locators/ESRI_Geocode_USA/GeocodeServer");
  google.maps.event.addListenerOnce(X, "load", function() {
    var c = X.addressFields;
    $ = "";
    for(var b = 0;b < c.length;b++) {
      $ += c[b].alias + ': <input type=text size=25 id="' + c[b].name + '"/><br/>'
    }
    $ += '<input type="button" onclick="geocode()" value="Geocode!"/>';
    Y = new google.maps.InfoWindow({maxWidth:200, content:$, position:W.getCenter()});
    Y.open(W)
  })
};
window.geocode = function() {
  if(Z) {
    for(var a = 0;a < Z.length;a++) {
      Z[a].setMap(null)
    }
    Z.length = 0
  }
  var c = {}, b = X.addressFields;
  for(a = 0;a < b.length;a++) {
    c[b[a].name] = document.getElementById(b[a].name).value
  }
  U(X, {A:c}, function(d) {
    Z = [];
    if(d.candidates) {
      for(var e = 0, g = d.candidates.length;e < g;e++) {
        var m = aa(d.candidates[e]);
        m.setMap(W);
        Z.push(m);
        if(e == 0) {
          W.setCenter(m.getPosition());
          W.setZoom(15);
          google.maps.event.trigger(m, "click")
        }
      }
    }
  })
};})()
