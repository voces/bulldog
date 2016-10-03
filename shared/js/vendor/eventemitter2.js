!function(a){function d(){this._events={},this._conf&&e.call(this,this._conf)}function e(a){a&&(this._conf=a,a.delimiter&&(this.delimiter=a.delimiter),a.maxListeners&&(this._events.maxListeners=a.maxListeners),a.wildcard&&(this.wildcard=a.wildcard),a.newListener&&(this.newListener=a.newListener),this.wildcard&&(this.listenerTree={}))}function f(a){this._events={},this.newListener=!1,e.call(this,a)}function g(a,b,c,d){if(!c)return[];var f,h,i,j,k,l,m,e=[],n=b.length,o=b[d],p=b[d+1];if(d===n&&c._listeners){if("function"==typeof c._listeners)return a&&a.push(c._listeners),[c];for(f=0,h=c._listeners.length;f<h;f++)a&&a.push(c._listeners[f]);return[c]}if("*"===o||"**"===o||c[o]){if("*"===o){for(i in c)"_listeners"!==i&&c.hasOwnProperty(i)&&(e=e.concat(g(a,b,c[i],d+1)));return e}if("**"===o){m=d+1===n||d+2===n&&"*"===p,m&&c._listeners&&(e=e.concat(g(a,b,c,n)));for(i in c)"_listeners"!==i&&c.hasOwnProperty(i)&&("*"===i||"**"===i?(c[i]._listeners&&!m&&(e=e.concat(g(a,b,c[i],n))),e=e.concat(g(a,b,c[i],d))):e=i===p?e.concat(g(a,b,c[i],d+2)):e.concat(g(a,b,c[i],d)));return e}e=e.concat(g(a,b,c[o],d+1))}if(j=c["*"],j&&g(a,b,j,d+1),k=c["**"])if(d<n){k._listeners&&g(a,b,k,n);for(i in k)"_listeners"!==i&&k.hasOwnProperty(i)&&(i===p?g(a,b,k[i],d+2):i===o?g(a,b,k[i],d+1):(l={},l[i]=k[i],g(a,b,{"**":l},d+1)))}else k._listeners?g(a,b,k,n):k["*"]&&k["*"]._listeners&&g(a,b,k["*"],n);return e}function h(a,d){a="string"==typeof a?a.split(this.delimiter):a.slice();for(var e=0,f=a.length;e+1<f;e++)if("**"===a[e]&&"**"===a[e+1])return;for(var g=this.listenerTree,h=a.shift();h;){if(g[h]||(g[h]={}),g=g[h],0===a.length){if(g._listeners){if("function"==typeof g._listeners)g._listeners=[g._listeners,d];else if(b(g._listeners)&&(g._listeners.push(d),!g._listeners.warned)){var i=c;"undefined"!=typeof this._events.maxListeners&&(i=this._events.maxListeners),i>0&&g._listeners.length>i&&(g._listeners.warned=!0,console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",g._listeners.length),console.trace&&console.trace())}}else g._listeners=d;return!0}h=a.shift()}return!0}var b=Array.isArray?Array.isArray:function(b){return"[object Array]"===Object.prototype.toString.call(b)},c=10;f.EventEmitter2=f,f.prototype.delimiter=".",f.prototype.setMaxListeners=function(a){this._events||d.call(this),this._events.maxListeners=a,this._conf||(this._conf={}),this._conf.maxListeners=a},f.prototype.event="",f.prototype.once=function(a,b){return this.many(a,1,b),this},f.prototype.many=function(a,b,c){function e(){0===--b&&d.off(a,e),c.apply(this,arguments)}var d=this;if("function"!=typeof c)throw new Error("many only accepts instances of Function");return e._origin=c,this.on(a,e),d},f.prototype.emit=function(){this._events||d.call(this);var a=arguments[0];if("newListener"===a&&!this.newListener&&!this._events.newListener)return!1;var c,e,f,h,i,b=arguments.length;if(this._all&&this._all.length){if(i=this._all.slice(),b>3)for(c=new Array(b),h=0;h<b;h++)c[h]=arguments[h];for(f=0,e=i.length;f<e;f++)switch(this.event=a,b){case 1:i[f].call(this,a);break;case 2:i[f].call(this,a,arguments[1]);break;case 3:i[f].call(this,a,arguments[1],arguments[2]);break;default:i[f].apply(this,c)}}if(this.wildcard){i=[];var j="string"==typeof a?a.split(this.delimiter):a.slice();g.call(this,i,j,this.listenerTree,0)}else{if(i=this._events[a],"function"==typeof i){switch(this.event=a,b){case 1:i.call(this);break;case 2:i.call(this,arguments[1]);break;case 3:i.call(this,arguments[1],arguments[2]);break;default:for(c=new Array(b-1),h=1;h<b;h++)c[h-1]=arguments[h];i.apply(this,c)}return!0}i&&(i=i.slice())}if(i&&i.length){if(b>3)for(c=new Array(b-1),h=1;h<b;h++)c[h-1]=arguments[h];for(f=0,e=i.length;f<e;f++)switch(this.event=a,b){case 1:i[f].call(this);break;case 2:i[f].call(this,arguments[1]);break;case 3:i[f].call(this,arguments[1],arguments[2]);break;default:i[f].apply(this,c)}return!0}if(!this._all&&"error"===a)throw arguments[1]instanceof Error?arguments[1]:new Error("Uncaught, unspecified 'error' event.");return!!this._all},f.prototype.emitAsync=function(){this._events||d.call(this);var a=arguments[0];if("newListener"===a&&!this.newListener&&!this._events.newListener)return Promise.resolve([!1]);var e,f,h,i,j,b=[],c=arguments.length;if(this._all){if(c>3)for(e=new Array(c),i=1;i<c;i++)e[i]=arguments[i];for(h=0,f=this._all.length;h<f;h++)switch(this.event=a,c){case 1:b.push(this._all[h].call(this,a));break;case 2:b.push(this._all[h].call(this,a,arguments[1]));break;case 3:b.push(this._all[h].call(this,a,arguments[1],arguments[2]));break;default:b.push(this._all[h].apply(this,e))}}if(this.wildcard){j=[];var k="string"==typeof a?a.split(this.delimiter):a.slice();g.call(this,j,k,this.listenerTree,0)}else j=this._events[a];if("function"==typeof j)switch(this.event=a,c){case 1:b.push(j.call(this));break;case 2:b.push(j.call(this,arguments[1]));break;case 3:b.push(j.call(this,arguments[1],arguments[2]));break;default:for(e=new Array(c-1),i=1;i<c;i++)e[i-1]=arguments[i];b.push(j.apply(this,e))}else if(j&&j.length){if(c>3)for(e=new Array(c-1),i=1;i<c;i++)e[i-1]=arguments[i];for(h=0,f=j.length;h<f;h++)switch(this.event=a,c){case 1:b.push(j[h].call(this));break;case 2:b.push(j[h].call(this,arguments[1]));break;case 3:b.push(j[h].call(this,arguments[1],arguments[2]));break;default:b.push(j[h].apply(this,e))}}else if(!this._all&&"error"===a)return arguments[1]instanceof Error?Promise.reject(arguments[1]):Promise.reject("Uncaught, unspecified 'error' event.");return Promise.all(b)},f.prototype.on=function(a,e){if("function"==typeof a)return this.onAny(a),this;if("function"!=typeof e)throw new Error("on only accepts instances of Function");if(this._events||d.call(this),this.emit("newListener",a,e),this.wildcard)return h.call(this,a,e),this;if(this._events[a]){if("function"==typeof this._events[a])this._events[a]=[this._events[a],e];else if(b(this._events[a])&&(this._events[a].push(e),!this._events[a].warned)){var f=c;"undefined"!=typeof this._events.maxListeners&&(f=this._events.maxListeners),f>0&&this._events[a].length>f&&(this._events[a].warned=!0,console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",this._events[a].length),console.trace&&console.trace())}}else this._events[a]=e;return this},f.prototype.onAny=function(a){if("function"!=typeof a)throw new Error("onAny only accepts instances of Function");return this._all||(this._all=[]),this._all.push(a),this},f.prototype.addListener=f.prototype.on,f.prototype.off=function(c,d){function n(b){if(b!==a){var c=Object.keys(b);for(var d in c){var e=c[d],f=b[e];f instanceof Function||"object"!=typeof f||(Object.keys(f).length>0&&n(b[e]),0===Object.keys(f).length&&delete b[e])}}}if("function"!=typeof d)throw new Error("removeListener only takes instances of Function");var e,f=[];if(this.wildcard){var h="string"==typeof c?c.split(this.delimiter):c.slice();f=g.call(this,null,h,this.listenerTree,0)}else{if(!this._events[c])return this;e=this._events[c],f.push({_listeners:e})}for(var i=0;i<f.length;i++){var j=f[i];if(e=j._listeners,b(e)){for(var k=-1,l=0,m=e.length;l<m;l++)if(e[l]===d||e[l].listener&&e[l].listener===d||e[l]._origin&&e[l]._origin===d){k=l;break}if(k<0)continue;return this.wildcard?j._listeners.splice(k,1):this._events[c].splice(k,1),0===e.length&&(this.wildcard?delete j._listeners:delete this._events[c]),this.emit("removeListener",c,d),this}(e===d||e.listener&&e.listener===d||e._origin&&e._origin===d)&&(this.wildcard?delete j._listeners:delete this._events[c],this.emit("removeListener",c,d))}return n(this.listenerTree),this},f.prototype.offAny=function(a){var d,b=0,c=0;if(a&&this._all&&this._all.length>0){for(d=this._all,b=0,c=d.length;b<c;b++)if(a===d[b])return d.splice(b,1),this.emit("removeListenerAny",a),this}else{for(d=this._all,b=0,c=d.length;b<c;b++)this.emit("removeListenerAny",d[b]);this._all=[]}return this},f.prototype.removeListener=f.prototype.off,f.prototype.removeAllListeners=function(a){if(0===arguments.length)return!this._events||d.call(this),this;if(this.wildcard)for(var b="string"==typeof a?a.split(this.delimiter):a.slice(),c=g.call(this,null,b,this.listenerTree,0),e=0;e<c.length;e++){var f=c[e];f._listeners=null}else{if(!this._events||!this._events[a])return this;this._events[a]=null}return this},f.prototype.listeners=function(a){if(this.wildcard){var c=[],e="string"==typeof a?a.split(this.delimiter):a.slice();return g.call(this,c,e,this.listenerTree,0),c}return this._events||d.call(this),this._events[a]||(this._events[a]=[]),b(this._events[a])||(this._events[a]=[this._events[a]]),this._events[a]},f.prototype.listenerCount=function(a){return this.listeners(a).length},f.prototype.listenersAny=function(){return this._all?this._all:[]},"function"==typeof define&&define.amd?define(function(){return f}):"object"==typeof exports?module.exports=f:window.EventEmitter2=f}();