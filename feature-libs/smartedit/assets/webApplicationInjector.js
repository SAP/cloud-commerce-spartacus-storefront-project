/*! For license information please see webApplicationInjector.js.LICENSE.txt */
(()=>{var t={874:(t,e,n)=>{var r,a,o;o=function(){var t,e,n=document,r=n.getElementsByTagName("head")[0],a={},o={},i={},s={};function c(t,e){for(var n=0,r=t.length;n<r;++n)if(!e(t[n]))return!1;return 1}function l(t,e){c(t,(function(t){return e(t),1}))}function d(e,n,r){e=e.push?e:[e];var p=n&&n.call,m=p?n:r,f=p?e.join(""):n,g=e.length;function h(t){return t.call?t():a[t]}function w(){if(!--g)for(var t in a[f]=1,m&&m(),i)c(t.split("|"),h)&&!l(i[t],h)&&(i[t]=[])}return setTimeout((function(){l(e,(function e(n,r){return null===n?w():(r||/^https?:\/\//.test(n)||!t||(n=-1===n.indexOf(".js")?t+n+".js":t+n),s[n]?(f&&(o[f]=1),2==s[n]?w():setTimeout((function(){e(n,!0)}),0)):(s[n]=1,f&&(o[f]=1),void u(n,w)))}))}),0),d}function u(t,a){var o,i=n.createElement("script");i.onload=i.onerror=i.onreadystatechange=function(){i.readyState&&!/^c|loade/.test(i.readyState)||o||(i.onload=i.onreadystatechange=null,o=1,s[t]=2,a())},i.async=1,i.src=e?t+(-1===t.indexOf("?")?"?":"&")+e:t,r.insertBefore(i,r.lastChild)}return d.get=u,d.order=function(t,e,n){!function r(a){a=t.shift(),t.length?d(a,r):d(a,e,n)}()},d.path=function(e){t=e},d.urlArgs=function(t){e=t},d.ready=function(t,e,n){t=t.push?t:[t];var r,o=[];return!l(t,(function(t){a[t]||o.push(t)}))&&c(t,(function(t){return a[t]}))?e():(r=t.join("|"),i[r]=i[r]||[],i[r].push(e),n&&n(o)),d},d.done=function(t){d([null],t)},d},t.exports?t.exports=o():void 0===(a="function"==typeof(r=o)?r.call(e,n,e,t):r)||(t.exports=a)},597:(t,e)=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.Heartbeat=void 0;class n{static startSendingHeartBeatToIframe(t){const e=n.getHeartBeatInterval(t);setInterval((()=>{parent.postMessage({pk:Math.random(),gatewayId:"heartBeatGateway",eventId:"heartBeat",data:{location:document.location.href}},"*")}),e)}static getHeartBeatInterval(t){return parseInt(t.getAttribute("data-smartedit-heart-beat-interval")||n.DEFAULT_HEARTBEAT_INTERVAL,10)}}e.Heartbeat=n,n.DEFAULT_HEARTBEAT_INTERVAL="500"},167:(t,e,n)=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0});const r=n(874);class a{static getWebappScriptElementFromDocument(t){if(t.currentScript){if(!(t.currentScript instanceof HTMLScriptElement))throw new Error("getWebappScriptElementFromDocument() found non htlm script element");return t.currentScript}const e=t.querySelector(`script#${a.webappScriptId}`);if(e)return e;const n=t.querySelectorAll(`script[src*=${a.webappScriptName}]`);if(1!==n.length)throw new Error(`SmartEdit unable to load - invalid ${a.webappScriptName} script tag`);return n.item(0)}static extractQueryParameter(t,e){const n={};return t.replace(/([?&])([^&=]+)=([^&]*)?/g,((t,e,r,a)=>(n[r]=a,""))),n[e]}static injectJS(t,e=0){t.length&&e<t.length&&a.getScriptJs()(t[e],(function(){a.injectJS(t,e+1)}))}static injectCSS(t,e,n=0){if(!e||0===e.length||e[n].includes("fiori")&&!e[n].includes("dark"))return;const r=document.createElement("link");r.rel="stylesheet",r.type="text/css",r.id=`themeCss${n}`,r.href=e[n],t.appendChild(r),n+1<e.length&&a.injectCSS(t,e,n+1)}static removeThemeCSS(){const t=document.getElementById("themeCss0"),e=document.getElementById("themeCss1");t&&e&&(null==t||t.remove(),null==e||e.remove())}static getScriptJs(){return r}}e.default=a,a.webappScriptId="smartedit-injector",a.webappScriptName="webApplicationInjector"},750:(t,e,n)=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0});const r=n(167);class a{static convertWhitelistingToRegexp(t){return(t=t||[]).map((t=>{const e=t.trim();if(a.whitelistingConfigRegex.test(e)){const t=["^","$"].join(e.replace(/\./g,"\\.").replace(/\*/g,"[-a-zA-Z0-9]*"));return new RegExp(t)}throw new Error(a.whitelistingErrorMsg)}))}static getWhitelistFromScriptElement(t,e){let n=[a.getSanitizedHostFromLocation(e.location)];const o=t.getAttribute(a.allowOriginAttributeName)||"";o&&(n=n.concat(o.split(",")));let i="";const s=e.document.createElement("a");s.href=t.src;const c=r.default.extractQueryParameter(s.search,a.allowOriginQueryParamName);return c&&(i=decodeURI(c),i&&i.split(",").forEach((t=>n.push(t)))),n}static isAllowed(t,e,n){if(!/^(https?:)\/\/([-.a-zA-Z0-9]+(:[0-9]{1,5})?)$/.test(t))return!1;const r=e.document.createElement("a");return r.href=t,("https:"!==e.location.protocol||"https:"===r.protocol)&&n.some((t=>(t.lastIndex=0,t.test(a.getSanitizedHostFromLocation(r)))))}static getSanitizedHostFromLocation(t){const e=t.port||("https"===t.protocol.replace(/:/g,"")?"443":"80");return`${t.hostname}:${e}`}}e.default=a,a.whitelistingConfigRegex=new RegExp(/^(([-*a-zA-Z0-9]+[.])*([-a-zA-Z0-9]+[.]))?[-a-zA-Z0-9]+(:[0-9]{1,5})$/),a.allowOriginAttributeName="data-smartedit-allow-origin",a.allowOriginQueryParamName="allow-origin",a.whitelistingErrorMsg="\n\t\tAllowed whitelist characters are a-z, A-Z, 0-9, -, period, or *\n\t\tThe wildcard * can be used to represent a prefixed domain, Good example: *.domain.com:80\n\t\tbut not a suffix or port, Bad examples: subdomain.*.com subdomain.domain.com:*.\n\t\tEvery whitelisting must contain a specific port.\n\t"}},e={};function n(r){var a=e[r];if(void 0!==a)return a.exports;var o=e[r]={exports:{}};return t[r](o,o.exports,n),o.exports}(()=>{"use strict";const t=n(597),e=n(167),r=n(750),a="smartEditBootstrap",o=e.default.getWebappScriptElementFromDocument(document);if(!o)throw new Error("Unable to location webappInjector script");const i=r.default.getWhitelistFromScriptElement(o,window),s=r.default.convertWhitelistingToRegexp(i);parent.postMessage({pk:Math.random(),gatewayId:a,eventId:"loading",data:{location:document.location.href}},"*"),window.addEventListener("load",(function(){parent.postMessage({pk:Math.random(),gatewayId:a,eventId:"bootstrapSmartEdit",data:{location:document.location.href}},"*")})),window.addEventListener("message",(function(t){if(t.data.gatewayId===a&&"bundle"===t.data.eventId){if(!r.default.isAllowed(t.origin,window,s))throw new Error(t.origin+" is not allowed to override this storefront.");!function(t,n){if(window.smartedit=window.smartedit||{},parent.postMessage({gatewayId:a,eventId:"promiseAcknowledgement",data:{pk:t}},"*"),n){const t=document.getElementsByTagName("body")[0];!function(t){if(t.properties)for(const e in t.properties)t.properties.hasOwnProperty(e)&&(window.smartedit[e]=t.properties[e])}(n),function(t){if(!(t.js&&t.js.length>0))return;let n;n="string"==typeof t.js[0]?t.js:t.js.filter((t=>!t.namespaceToCheck||!window[t.namespaceToCheck])).map((t=>t.src)),e.default.injectJS(n)}(n),n.css&&n.css.length>0&&(e.default.removeThemeCSS(),e.default.injectCSS(t,n.css))}parent.postMessage({gatewayId:a,eventId:"promiseReturn",data:{pk:t,type:"success"}},"*")}(t.data.pk,t.data.data.resources)}}),!1),window.onbeforeunload=function(){parent.postMessage({pk:Math.random(),gatewayId:a,eventId:"unloading",data:{location:document.location.href}},"*")},t.Heartbeat.startSendingHeartBeatToIframe(o)})()})();