(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,98183,(t,e,o)=>{"use strict";Object.defineProperty(o,"__esModule",{value:!0});var i={assign:function(){return l},searchParamsToUrlQuery:function(){return s},urlQueryToSearchParams:function(){return a}};for(var r in i)Object.defineProperty(o,r,{enumerable:!0,get:i[r]});function s(t){let e={};for(let[o,i]of t.entries()){let t=e[o];void 0===t?e[o]=i:Array.isArray(t)?t.push(i):e[o]=[t,i]}return e}function n(t){return"string"==typeof t?t:("number"!=typeof t||isNaN(t))&&"boolean"!=typeof t?"":String(t)}function a(t){let e=new URLSearchParams;for(let[o,i]of Object.entries(t))if(Array.isArray(i))for(let t of i)e.append(o,n(t));else e.set(o,n(i));return e}function l(t,...e){for(let o of e){for(let e of o.keys())t.delete(e);for(let[e,i]of o.entries())t.append(e,i)}return t}},18967,(t,e,o)=>{"use strict";Object.defineProperty(o,"__esModule",{value:!0});var i={DecodeError:function(){return g},MiddlewareNotFoundError:function(){return T},MissingStaticPage:function(){return _},NormalizeError:function(){return v},PageNotFoundError:function(){return b},SP:function(){return m},ST:function(){return y},WEB_VITALS:function(){return s},execOnce:function(){return n},getDisplayName:function(){return u},getLocationOrigin:function(){return c},getURL:function(){return d},isAbsoluteUrl:function(){return l},isResSent:function(){return f},loadGetInitialProps:function(){return p},normalizeRepeatedSlashes:function(){return h},stringifyError:function(){return x}};for(var r in i)Object.defineProperty(o,r,{enumerable:!0,get:i[r]});let s=["CLS","FCP","FID","INP","LCP","TTFB"];function n(t){let e,o=!1;return(...i)=>(o||(o=!0,e=t(...i)),e)}let a=/^[a-zA-Z][a-zA-Z\d+\-.]*?:/,l=t=>a.test(t);function c(){let{protocol:t,hostname:e,port:o}=window.location;return`${t}//${e}${o?":"+o:""}`}function d(){let{href:t}=window.location,e=c();return t.substring(e.length)}function u(t){return"string"==typeof t?t:t.displayName||t.name||"Unknown"}function f(t){return t.finished||t.headersSent}function h(t){let e=t.split("?");return e[0].replace(/\\/g,"/").replace(/\/\/+/g,"/")+(e[1]?`?${e.slice(1).join("?")}`:"")}async function p(t,e){let o=e.res||e.ctx&&e.ctx.res;if(!t.getInitialProps)return e.ctx&&e.Component?{pageProps:await p(e.Component,e.ctx)}:{};let i=await t.getInitialProps(e);if(o&&f(o))return i;if(!i)throw Object.defineProperty(Error(`"${u(t)}.getInitialProps()" should resolve to an object. But found "${i}" instead.`),"__NEXT_ERROR_CODE",{value:"E1025",enumerable:!1,configurable:!0});return i}let m="u">typeof performance,y=m&&["mark","measure","getEntriesByName"].every(t=>"function"==typeof performance[t]);class g extends Error{}class v extends Error{}class b extends Error{constructor(t){super(),this.code="ENOENT",this.name="PageNotFoundError",this.message=`Cannot find module for page: ${t}`}}class _ extends Error{constructor(t,e){super(),this.message=`Failed to load static file for page: ${t} ${e}`}}class T extends Error{constructor(){super(),this.code="ENOENT",this.message="Cannot find the middleware module"}}function x(t){return JSON.stringify({message:t.message,stack:t.stack})}},33525,(t,e,o)=>{"use strict";Object.defineProperty(o,"__esModule",{value:!0}),Object.defineProperty(o,"warnOnce",{enumerable:!0,get:function(){return i}});let i=t=>{}},95057,(t,e,o)=>{"use strict";Object.defineProperty(o,"__esModule",{value:!0});var i={formatUrl:function(){return a},formatWithValidation:function(){return c},urlObjectKeys:function(){return l}};for(var r in i)Object.defineProperty(o,r,{enumerable:!0,get:i[r]});let s=t.r(90809)._(t.r(98183)),n=/https?|ftp|gopher|file/;function a(t){let{auth:e,hostname:o}=t,i=t.protocol||"",r=t.pathname||"",a=t.hash||"",l=t.query||"",c=!1;e=e?encodeURIComponent(e).replace(/%3A/i,":")+"@":"",t.host?c=e+t.host:o&&(c=e+(~o.indexOf(":")?`[${o}]`:o),t.port&&(c+=":"+t.port)),l&&"object"==typeof l&&(l=String(s.urlQueryToSearchParams(l)));let d=t.search||l&&`?${l}`||"";return i&&!i.endsWith(":")&&(i+=":"),t.slashes||(!i||n.test(i))&&!1!==c?(c="//"+(c||""),r&&"/"!==r[0]&&(r="/"+r)):c||(c=""),a&&"#"!==a[0]&&(a="#"+a),d&&"?"!==d[0]&&(d="?"+d),r=r.replace(/[?#]/g,encodeURIComponent),d=d.replace("#","%23"),`${i}${c}${r}${d}${a}`}let l=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function c(t){return a(t)}},18581,(t,e,o)=>{"use strict";Object.defineProperty(o,"__esModule",{value:!0}),Object.defineProperty(o,"useMergedRef",{enumerable:!0,get:function(){return r}});let i=t.r(71645);function r(t,e){let o=(0,i.useRef)(null),r=(0,i.useRef)(null);return(0,i.useCallback)(i=>{if(null===i){let t=o.current;t&&(o.current=null,t());let e=r.current;e&&(r.current=null,e())}else t&&(o.current=s(t,i)),e&&(r.current=s(e,i))},[t,e])}function s(t,e){if("function"!=typeof t)return t.current=e,()=>{t.current=null};{let o=t(e);return"function"==typeof o?o:()=>t(null)}}("function"==typeof o.default||"object"==typeof o.default&&null!==o.default)&&void 0===o.default.__esModule&&(Object.defineProperty(o.default,"__esModule",{value:!0}),Object.assign(o.default,o),e.exports=o.default)},73668,(t,e,o)=>{"use strict";Object.defineProperty(o,"__esModule",{value:!0}),Object.defineProperty(o,"isLocalURL",{enumerable:!0,get:function(){return s}});let i=t.r(18967),r=t.r(52817);function s(t){if(!(0,i.isAbsoluteUrl)(t))return!0;try{let e=(0,i.getLocationOrigin)(),o=new URL(t,e);return o.origin===e&&(0,r.hasBasePath)(o.pathname)}catch(t){return!1}}},84508,(t,e,o)=>{"use strict";Object.defineProperty(o,"__esModule",{value:!0}),Object.defineProperty(o,"errorOnce",{enumerable:!0,get:function(){return i}});let i=t=>{}},22016,(t,e,o)=>{"use strict";Object.defineProperty(o,"__esModule",{value:!0});var i={default:function(){return g},useLinkStatus:function(){return b}};for(var r in i)Object.defineProperty(o,r,{enumerable:!0,get:i[r]});let s=t.r(90809),n=t.r(43476),a=s._(t.r(71645)),l=t.r(95057),c=t.r(8372),d=t.r(18581),u=t.r(18967),f=t.r(5550);t.r(33525);let h=t.r(88540),p=t.r(91949),m=t.r(73668),y=t.r(9396);function g(e){var o,i;let r,s,g,[b,_]=(0,a.useOptimistic)(p.IDLE_LINK_STATUS),T=(0,a.useRef)(null),{href:x,as:w,children:S,prefetch:E=null,passHref:k,replace:L,shallow:C,scroll:N,onClick:I,onMouseEnter:O,onTouchStart:j,legacyBehavior:P=!1,onNavigate:z,transitionTypes:R,ref:M,unstable_dynamicOnHover:A,...$}=e;r=S,P&&("string"==typeof r||"number"==typeof r)&&(r=(0,n.jsx)("a",{children:r}));let D=a.default.useContext(c.AppRouterContext),H=!1!==E,W=!1!==E?null===(i=E)||"auto"===i?y.FetchStrategy.PPR:y.FetchStrategy.Full:y.FetchStrategy.PPR,B="string"==typeof(o=w||x)?o:(0,l.formatUrl)(o);if(P){if(r?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});s=a.default.Children.only(r)}let F=P?s&&"object"==typeof s&&s.ref:M,U=a.default.useCallback(t=>(null!==D&&(T.current=(0,p.mountLinkInstance)(t,B,D,W,H,_)),()=>{T.current&&((0,p.unmountLinkForCurrentNavigation)(T.current),T.current=null),(0,p.unmountPrefetchableInstance)(t)}),[H,B,D,W,_]),X={ref:(0,d.useMergedRef)(U,F),onClick(e){P||"function"!=typeof I||I(e),P&&s.props&&"function"==typeof s.props.onClick&&s.props.onClick(e),!D||e.defaultPrevented||function(e,o,i,r,s,n,l){if("u">typeof window){let c,{nodeName:d}=e.currentTarget;if("A"===d.toUpperCase()&&((c=e.currentTarget.getAttribute("target"))&&"_self"!==c||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.nativeEvent&&2===e.nativeEvent.which)||e.currentTarget.hasAttribute("download"))return;if(!(0,m.isLocalURL)(o)){r&&(e.preventDefault(),location.replace(o));return}if(e.preventDefault(),n){let t=!1;if(n({preventDefault:()=>{t=!0}}),t)return}let{dispatchNavigateAction:u}=t.r(99781);a.default.startTransition(()=>{u(o,r?"replace":"push",!1===s?h.ScrollBehavior.NoScroll:h.ScrollBehavior.Default,i.current,l)})}}(e,B,T,L,N,z,R)},onMouseEnter(t){P||"function"!=typeof O||O(t),P&&s.props&&"function"==typeof s.props.onMouseEnter&&s.props.onMouseEnter(t),D&&H&&(0,p.onNavigationIntent)(t.currentTarget,!0===A)},onTouchStart:function(t){P||"function"!=typeof j||j(t),P&&s.props&&"function"==typeof s.props.onTouchStart&&s.props.onTouchStart(t),D&&H&&(0,p.onNavigationIntent)(t.currentTarget,!0===A)}};return(0,u.isAbsoluteUrl)(B)?X.href=B:P&&!k&&("a"!==s.type||"href"in s.props)||(X.href=(0,f.addBasePath)(B)),g=P?a.default.cloneElement(s,X):(0,n.jsx)("a",{...$,...X,children:r}),(0,n.jsx)(v.Provider,{value:b,children:g})}t.r(84508);let v=(0,a.createContext)(p.IDLE_LINK_STATUS),b=()=>(0,a.useContext)(v);("function"==typeof o.default||"object"==typeof o.default&&null!==o.default)&&void 0===o.default.__esModule&&(Object.defineProperty(o.default,"__esModule",{value:!0}),Object.assign(o.default,o),e.exports=o.default)},40759,t=>{"use strict";var e=t.i(43476),o=t.i(22016);function i({size:t=32,className:o=""}){return(0,e.jsxs)("svg",{width:t,height:t,viewBox:"0 0 40 40",fill:"none",xmlns:"http://www.w3.org/2000/svg",className:o,"aria-label":"Librello Icon",children:[(0,e.jsx)("rect",{x:"2",y:"2",width:"36",height:"36",rx:"8",className:"stroke-border",strokeWidth:"1.2",fill:"currentColor",fillOpacity:"0.03"}),(0,e.jsx)("path",{d:"M13 10V28H27",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round"}),(0,e.jsx)("path",{d:"M13 18C16.5 16.5 21 16.5 26 18V26C21 24.5 16.5 24.5 13 26",className:"stroke-primary",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"}),(0,e.jsx)("path",{d:"M26 18C27.5 17.5 29 17.5 30 18V26C29 25.5 27.5 25.5 26 26",className:"stroke-primary",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round",strokeOpacity:"0.7"})]})}t.s(["LibrelloIcon",0,i,"default",0,function({href:t="/",size:r="default",className:s=""}){let n=(0,e.jsxs)("div",{className:`inline-flex items-center gap-2.5 group select-none ${s}`,children:[(0,e.jsx)(i,{size:"sm"===r?26:"lg"===r?40:32,className:"text-foreground transition-transform duration-300 group-hover:scale-105"}),(0,e.jsxs)("div",{className:"flex flex-col leading-none",children:[(0,e.jsx)("span",{className:`font-serif ${"sm"===r?"text-lg":"lg"===r?"text-2xl":"text-xl"} font-bold tracking-tight text-foreground group-hover:text-primary transition-colors`,children:"Librello"}),(0,e.jsx)("span",{className:"text-[9px] tracking-[0.22em] uppercase text-muted-foreground font-medium mt-0.5",children:"Curated Archive"})]})]});return t?(0,e.jsx)(o.default,{href:t,children:n}):n}])},7670,t=>{"use strict";function e(){for(var t,e,o=0,i="",r=arguments.length;o<r;o++)(t=arguments[o])&&(e=function t(e){var o,i,r="";if("string"==typeof e||"number"==typeof e)r+=e;else if("object"==typeof e)if(Array.isArray(e)){var s=e.length;for(o=0;o<s;o++)e[o]&&(i=t(e[o]))&&(r&&(r+=" "),r+=i)}else for(i in e)e[i]&&(r&&(r+=" "),r+=i);return r}(t))&&(i&&(i+=" "),i+=e);return i}t.s(["clsx",0,e,"default",0,e])},70319,t=>{"use strict";var e=t.i(71645),o=t.i(7670),i=t=>"number"==typeof t&&!isNaN(t),r=t=>"string"==typeof t||"function"==typeof t?t:null,s=t=>(0,e.isValidElement)(t)||"string"==typeof t||"function"==typeof t||i(t);function n(t,e,o=300){let{scrollHeight:i,style:r}=t;requestAnimationFrame(()=>{r.minHeight="initial",r.height=i+"px",r.transition=`all ${o}ms`,requestAnimationFrame(()=>{r.height="0",r.padding="0",r.margin="0",setTimeout(e,o)})})}function a({enter:t,exit:o,appendPosition:i=!1,collapse:r=!0,collapseDuration:s=300}){return function({children:a,position:l,preventExitTransition:c,done:d,nodeRef:u,isIn:f,playToast:h}){let p=i?`${t}--${l}`:t,m=i?`${o}--${l}`:o,y=(0,e.useRef)(0);return(0,e.useLayoutEffect)(()=>{let t=u.current,e=p.split(" "),o=i=>{i.target===u.current&&(h(),t.removeEventListener("animationend",o),t.removeEventListener("animationcancel",o),0===y.current&&"animationcancel"!==i.type&&t.classList.remove(...e))};t.classList.add(...e),t.addEventListener("animationend",o),t.addEventListener("animationcancel",o)},[]),(0,e.useEffect)(()=>{let t=u.current,e=()=>{t.removeEventListener("animationend",e),r?n(t,d,s):d()};f||(c?e():(y.current=1,t.className+=` ${m}`,t.addEventListener("animationend",e)))},[f]),e.default.createElement(e.default.Fragment,null,a)}}function l(t,e){return{content:c(t.content,t.props),containerId:t.props.containerId,id:t.props.toastId,theme:t.props.theme,type:t.props.type,data:t.props.data||{},isLoading:t.props.isLoading,icon:t.props.icon,reason:t.removalReason,status:e}}function c(t,o,i=!1){return(0,e.isValidElement)(t)&&"string"!=typeof t.type?(0,e.cloneElement)(t,{closeToast:o.closeToast,toastProps:o,data:o.data,isPaused:i}):"function"==typeof t?t({closeToast:o.closeToast,toastProps:o,data:o.data,isPaused:i}):t}function d({delay:t,isRunning:i,closeToast:r,type:s="default",hide:n,className:a,controlledProgress:l,progress:c,rtl:u,isIn:f,theme:h}){let p=n||l&&0===c,m={animationDuration:`${t}ms`,animationPlayState:i?"running":"paused"};l&&(m.transform=`scaleX(${c})`);let y=(0,o.default)("Toastify__progress-bar",l?"Toastify__progress-bar--controlled":"Toastify__progress-bar--animated",`Toastify__progress-bar-theme--${h}`,`Toastify__progress-bar--${s}`,{"Toastify__progress-bar--rtl":u}),g="function"==typeof a?a({rtl:u,type:s,defaultClassName:y}):(0,o.default)(y,a);return e.default.createElement("div",{className:"Toastify__progress-bar--wrp","data-hidden":p},e.default.createElement("div",{className:`Toastify__progress-bar--bg Toastify__progress-bar-theme--${h} Toastify__progress-bar--${s}`}),e.default.createElement("div",{role:"progressbar","aria-hidden":p?"true":"false","aria-label":"notification timer","aria-valuenow":l?Math.round(100*c):void 0,"aria-valuemin":0,"aria-valuemax":100,className:g,style:m,...{[l&&c>=1?"onTransitionEnd":"onAnimationEnd"]:l&&c<1?null:()=>{f&&r()}}}))}var u=1,f=()=>`${u++}`,h=new Map,p=[],m=new Set,y=t=>m.forEach(e=>e(t));function g(t,e){var o;if(e)return!!(null!=(o=h.get(e))&&o.isToastActive(t));let i=!1;return h.forEach(e=>{e.isToastActive(t)&&(i=!0)}),i}function v(t,e){s(t)&&(h.size>0||p.push({content:t,options:e}),h.forEach(o=>{o.buildToast(t,e)}))}function b(t,e){h.forEach(o=>{null!=e&&null!=e&&e.containerId&&(null==e?void 0:e.containerId)!==o.id||o.toggle(t,null==e?void 0:e.id)})}function _(t,e){return v(t,e),e.toastId}function T(t,e){var o;return{...e,type:e&&e.type||t,toastId:(o=e)&&("string"==typeof o.toastId||i(o.toastId))?o.toastId:f()}}function x(t){return(e,o)=>_(e,T(t,o))}function w(t,e){return _(t,T("default",e))}w.loading=(t,e)=>_(t,T("default",{isLoading:!0,autoClose:!1,closeOnClick:!1,closeButton:!1,draggable:!1,...e})),w.promise=function(t,{pending:e,error:o,success:i},r){let s;e&&(s="string"==typeof e?w.loading(e,r):w.loading(e.render,{...r,...e}));let n={isLoading:null,autoClose:null,closeOnClick:null,closeButton:null,draggable:null},a=(t,e,o)=>{if(null==e)return void w.dismiss(s);let i={type:t,...n,...r,data:o},a="string"==typeof e?{render:e}:e;return s?w.update(s,{...i,...a}):w(a.render,{...i,...a}),o},l="function"==typeof t?t():t;return l.then(t=>a("success",i,t)).catch(t=>a("error",o,t)),l},w.success=x("success"),w.info=x("info"),w.error=x("error"),w.warning=x("warning"),w.warn=w.warning,w.dark=(t,e)=>_(t,T("default",{theme:"dark",...e})),w.dismiss=function(t){!function(t){let e;if(!(h.size>0)){p=p.filter(e=>null!=t&&e.options.toastId!==t);return}if(null==t||"string"==typeof(e=t)||i(e))h.forEach(e=>{e.removeToast(t)});else if(t&&("containerId"in t||"id"in t)){let e=h.get(t.containerId);e?e.removeToast(t.id):h.forEach(e=>{e.removeToast(t.id)})}}(t)},w.clearWaitingQueue=(t={})=>{h.forEach(e=>{e.props.limit&&(!t.containerId||e.id===t.containerId)&&e.clearQueue()})},w.isActive=g,w.update=(t,e={})=>{let o=((t,{containerId:e})=>{var o;return null==(o=h.get(e||1))?void 0:o.toasts.get(t)})(t,e);if(o){let{props:i,content:r}=o,s={delay:100,...i,...e,toastId:e.toastId||t,updateId:f()};s.toastId!==t&&(s.staleId=t);let n=s.render||r;delete s.render,_(n,s)}},w.done=t=>{w.update(t,{progress:1})},w.onChange=function(t){return m.add(t),()=>{m.delete(t)}},w.play=t=>b(!0,t),w.pause=t=>b(!1,t);var S="u">typeof window?e.useLayoutEffect:e.useEffect,E=({theme:t,type:o,isLoading:i,...r})=>e.default.createElement("svg",{viewBox:"0 0 24 24",width:"100%",height:"100%",fill:"colored"===t?"currentColor":`var(--toastify-icon-color-${o})`,...r}),k={info:function(t){return e.default.createElement(E,{...t},e.default.createElement("path",{d:"M12 0a12 12 0 1012 12A12.013 12.013 0 0012 0zm.25 5a1.5 1.5 0 11-1.5 1.5 1.5 1.5 0 011.5-1.5zm2.25 13.5h-4a1 1 0 010-2h.75a.25.25 0 00.25-.25v-4.5a.25.25 0 00-.25-.25h-.75a1 1 0 010-2h1a2 2 0 012 2v4.75a.25.25 0 00.25.25h.75a1 1 0 110 2z"}))},warning:function(t){return e.default.createElement(E,{...t},e.default.createElement("path",{d:"M23.32 17.191L15.438 2.184C14.728.833 13.416 0 11.996 0c-1.42 0-2.733.833-3.443 2.184L.533 17.448a4.744 4.744 0 000 4.368C1.243 23.167 2.555 24 3.975 24h16.05C22.22 24 24 22.044 24 19.632c0-.904-.251-1.746-.68-2.44zm-9.622 1.46c0 1.033-.724 1.823-1.698 1.823s-1.698-.79-1.698-1.822v-.043c0-1.028.724-1.822 1.698-1.822s1.698.79 1.698 1.822v.043zm.039-12.285l-.84 8.06c-.057.581-.408.943-.897.943-.49 0-.84-.367-.896-.942l-.84-8.065c-.057-.624.25-1.095.779-1.095h1.91c.528.005.84.476.784 1.1z"}))},success:function(t){return e.default.createElement(E,{...t},e.default.createElement("path",{d:"M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z"}))},error:function(t){return e.default.createElement(E,{...t},e.default.createElement("path",{d:"M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z"}))},spinner:function(){return e.default.createElement("div",{className:"Toastify__spinner"})}},L=t=>{let{isRunning:i,preventExitTransition:r,toastRef:s,eventHandlers:n,playToast:a}=function(t){var o,i;let[r,s]=(0,e.useState)(!1),[n,a]=(0,e.useState)(!1),l=(0,e.useRef)(null),c=(0,e.useRef)({start:0,delta:0,removalDistance:0,canCloseOnClick:!0,canDrag:!1,didMove:!1}).current,{autoClose:d,pauseOnHover:u,closeToast:f,onClick:p,closeOnClick:m}=t;function y(){s(!0)}function g(){s(!1)}function v(e){let o=l.current;if(c.canDrag&&o){c.didMove=!0,r&&g(),"x"===t.draggableDirection?c.delta=e.clientX-c.start:c.delta=e.clientY-c.start,c.start!==e.clientX&&(c.canCloseOnClick=!1);let i="x"===t.draggableDirection?`${c.delta}px, var(--y)`:`0, calc(${c.delta}px + var(--y))`;o.style.transform=`translate3d(${i},0)`,o.style.opacity=`${1-Math.abs(c.delta/c.removalDistance)}`}}function b(){document.removeEventListener("pointermove",v),document.removeEventListener("pointerup",b);let e=l.current;if(c.canDrag&&c.didMove&&e){if(c.canDrag=!1,Math.abs(c.delta)>c.removalDistance){a(!0),t.closeToast(!0),t.collapseAll();return}e.style.transition="transform 0.2s, opacity 0.2s",e.style.removeProperty("transform"),e.style.removeProperty("opacity")}}o={id:t.toastId,containerId:t.containerId,fn:s},null==(i=h.get(o.containerId||1))||i.setToggle(o.id,o.fn),(0,e.useEffect)(()=>{if(t.pauseOnFocusLoss)return document.hasFocus()||g(),window.addEventListener("focus",y),window.addEventListener("blur",g),()=>{window.removeEventListener("focus",y),window.removeEventListener("blur",g)}},[t.pauseOnFocusLoss]);let _={onPointerDown:function(e){if(!0===t.draggable||t.draggable===e.pointerType){c.didMove=!1,document.addEventListener("pointermove",v),document.addEventListener("pointerup",b);let o=l.current;c.canCloseOnClick=!0,c.canDrag=!0,o.style.transition="none","x"===t.draggableDirection?(c.start=e.clientX,c.removalDistance=o.offsetWidth*(t.draggablePercent/100)):(c.start=e.clientY,c.removalDistance=o.offsetHeight*(80===t.draggablePercent?1.5*t.draggablePercent:t.draggablePercent)/100)}},onPointerUp:function(e){let{top:o,bottom:i,left:r,right:s}=l.current.getBoundingClientRect();"mouse"===e.pointerType&&t.pauseOnHover&&e.clientX>=r&&e.clientX<=s&&e.clientY>=o&&e.clientY<=i?g():y()}};return d&&u&&(_.onMouseEnter=g,t.stacked||(_.onMouseLeave=y)),m&&(_.onClick=t=>{p&&p(t),c.canCloseOnClick&&f(!0)}),{playToast:y,pauseToast:g,isRunning:r,preventExitTransition:n,toastRef:l,eventHandlers:_}}(t),{closeButton:l,children:u,autoClose:f,onClick:p,type:m,hideProgressBar:y,closeToast:g,transition:v,position:b,className:_,style:T,progressClassName:x,updateId:w,role:S,progress:E,rtl:L,toastId:C,deleteToast:N,isIn:I,isLoading:O,closeOnClick:j,theme:P,ariaLabel:z}=t,R=(0,o.default)("Toastify__toast",`Toastify__toast-theme--${P}`,`Toastify__toast--${m}`,{"Toastify__toast--rtl":L},{"Toastify__toast--close-on-click":j}),M="function"==typeof _?_({rtl:L,position:b,type:m,defaultClassName:R}):(0,o.default)(R,_),A=function({theme:t,type:o,isLoading:i,icon:r}){let s=null,n={theme:t,type:o};return!1===r||("function"==typeof r?s=r({...n,isLoading:i}):(0,e.isValidElement)(r)?s=(0,e.cloneElement)(r,n):i?s=k.spinner():o in k&&(s=k[o](n))),s}(t),$=!!E||!f,D={closeToast:g,type:m,theme:P},H=null;return!1===l||(H="function"==typeof l?l(D):(0,e.isValidElement)(l)?(0,e.cloneElement)(l,D):function({closeToast:t,theme:o,ariaLabel:i="close"}){return e.default.createElement("button",{className:`Toastify__close-button Toastify__close-button--${o}`,type:"button",onClick:e=>{e.stopPropagation(),t(!0)},"aria-label":i},e.default.createElement("svg",{"aria-hidden":"true",viewBox:"0 0 14 16"},e.default.createElement("path",{fillRule:"evenodd",d:"M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z"})))}(D)),e.default.createElement(v,{isIn:I,done:N,position:b,preventExitTransition:r,nodeRef:s,playToast:a},e.default.createElement("div",{id:C,tabIndex:0,onClick:p,"data-in":I,className:M,...n,style:T,ref:s,...I&&{role:S,"aria-label":z}},null!=A&&e.default.createElement("div",{className:(0,o.default)("Toastify__toast-icon",{"Toastify--animate-icon Toastify__zoom-enter":!O})},A),c(u,t,!i),H,!t.customProgressBar&&e.default.createElement(d,{...w&&!$?{key:`p-${w}`}:{},rtl:L,theme:P,delay:f,isRunning:i,isIn:I,closeToast:g,hide:y,type:m,className:x,controlledProgress:$,progress:E||0})))},C=(t,e=!1)=>({enter:`Toastify--animate Toastify__${t}-enter`,exit:`Toastify--animate Toastify__${t}-exit`,appendPosition:e}),N=a(C("bounce",!0)),I=a(C("slide",!0)),O=a(C("zoom")),j=a(C("flip")),P={position:"top-right",transition:N,autoClose:5e3,closeButton:!0,pauseOnHover:!0,pauseOnFocusLoss:!0,draggable:"touch",draggablePercent:80,draggableDirection:"x",role:"alert",theme:"light","aria-label":"Notifications Alt+T",hotKeys:t=>t.altKey&&"KeyT"===t.code};function z(t){let n={...P,...t},a=t.stacked,[c,d]=(0,e.useState)(!0),u=(0,e.useRef)(null),{getToastToRender:f,isToastActive:m,count:b}=function(t){var o;let n,{subscribe:a,getSnapshot:c,setProps:d}=(0,e.useRef)((n=t.containerId||1,{subscribe(e){let o,a,c,d,u,f,m,g,b,_,T,x=(o=1,a=0,c=[],d=[],u=t,f=new Map,m=new Set,g=()=>{d=Array.from(f.values()),m.forEach(t=>t())},b=t=>{var e,o;t.isActive&&(null==(o=null==(e=t.props)?void 0:e.onClose)||o.call(e,t.removalReason),t.isActive=!1,y(l(t,"removed")))},_=t=>{if(null==t)f.forEach(b);else{let e=f.get(t);e&&b(e)}g()},T=t=>{var e,o;let{toastId:i,updateId:r}=t.props,s=null==r;t.staleId&&f.delete(t.staleId),t.isActive=!0,f.set(i,t),g(),y(l(t,s?"added":"updated")),s&&(null==(o=(e=t.props).onOpen)||o.call(e))},{id:n,props:u,observe:t=>(m.add(t),()=>m.delete(t)),toggle:(t,e)=>{f.forEach(o=>{var i;(null==e||e===o.props.toastId)&&(null==(i=o.toggle)||i.call(o,t))})},removeToast:_,toasts:f,clearQueue:()=>{a-=c.length,c=[]},buildToast:(t,e)=>{let l,d;if((({containerId:t,toastId:e,updateId:o})=>{let i=f.has(e)&&null==o;return(t?t!==n:1!==n)||i})(e))return;let{toastId:h,updateId:p,data:m,staleId:y,delay:v}=e,b=null==p;b&&a++;let x={...u,style:u.toastStyle,key:o++,...Object.fromEntries(Object.entries(e).filter(([t,e])=>null!=e)),toastId:h,updateId:p,data:m,isIn:!1,className:r(e.className||u.toastClassName),progressClassName:r(e.progressClassName||u.progressClassName),autoClose:!e.isLoading&&(l=e.autoClose,d=u.autoClose,!1===l||i(l)&&l>0?l:d),closeToast(t){let e=f.get(h);e&&(e.removalReason=t,_(h))},deleteToast(){if(null!=f.get(h)){if(f.delete(h),--a<0&&(a=0),c.length>0)return void T(c.shift());g()}}};x.closeButton=u.closeButton,!1===e.closeButton||s(e.closeButton)?x.closeButton=e.closeButton:!0===e.closeButton&&(x.closeButton=!s(u.closeButton)||u.closeButton);let w={content:t,props:x,staleId:y};u.limit&&u.limit>0&&a>u.limit&&b?c.push(w):i(v)?setTimeout(()=>{T(w)},v):T(w)},setProps(t){u=t},setToggle:(t,e)=>{let o=f.get(t);o&&(o.toggle=e)},isToastActive:t=>{var e;return null==(e=f.get(t))?void 0:e.isActive},getSnapshot:()=>d});h.set(n,x);let w=x.observe(e);return p.forEach(t=>v(t.content,t.options)),p=[],()=>{w(),h.delete(n)}},setProps(t){var e;null==(e=h.get(n))||e.setProps(t)},getSnapshot(){var t;return null==(t=h.get(n))?void 0:t.getSnapshot()}})).current;d(t);let u=null==(o=(0,e.useSyncExternalStore)(a,c,c))?void 0:o.slice();return{getToastToRender:function(e){if(!u)return[];let o=new Map;return t.newestOnTop&&u.reverse(),u.forEach(t=>{let{position:e}=t.props;o.has(e)||o.set(e,[]),o.get(e).push(t)}),Array.from(o,t=>e(t[0],t[1]))},isToastActive:g,count:null==u?void 0:u.length}}(n),{className:_,style:T,rtl:x,containerId:E,hotKeys:k}=n;function C(){a&&(d(!0),w.play())}return S(()=>{var t;if(a){let e=u.current.querySelectorAll('[data-in="true"]'),o=null==(t=n.position)?void 0:t.includes("top"),i=0,r=0;Array.from(e).reverse().forEach((t,e)=>{t.classList.add("Toastify__toast--stacked"),e>0&&(t.dataset.collapsed=`${c}`),t.dataset.pos||(t.dataset.pos=o?"top":"bot");let s=i*(c?.2:1)+(c?0:12*e),n=Math.max(.5,1-(c?r:0));t.style.setProperty("--y",`${o?s:-1*s}px`),t.style.setProperty("--g","12"),t.style.setProperty("--s",`${n}`),i+=t.offsetHeight,r+=.025})}},[c,b,a]),(0,e.useEffect)(()=>{function t(t){var e;let o=u.current;k(t)&&(null==(e=null==o?void 0:o.querySelector('[tabIndex="0"]'))||e.focus(),d(!1),w.pause()),"Escape"===t.key&&(document.activeElement===o||null!=o&&o.contains(document.activeElement))&&(d(!0),w.play())}return document.addEventListener("keydown",t),()=>{document.removeEventListener("keydown",t)}},[k]),e.default.createElement("section",{ref:u,className:"Toastify",id:E,onMouseEnter:()=>{a&&(d(!1),w.pause())},onMouseLeave:C,"aria-live":"polite","aria-atomic":"false","aria-relevant":"additions text","aria-label":n["aria-label"]},f((t,i)=>{var s;let n,l=i.length?{...T}:{...T,pointerEvents:"none"};return e.default.createElement("div",{tabIndex:-1,className:(s=t,n=(0,o.default)("Toastify__toast-container",`Toastify__toast-container--${s}`,{"Toastify__toast-container--rtl":x}),"function"==typeof _?_({position:s,rtl:x,defaultClassName:n}):(0,o.default)(n,r(_))),"data-stacked":a,style:l,key:`c-${t}`},i.map(({content:t,props:o})=>e.default.createElement(L,{...o,stacked:a,collapseAll:C,isIn:m(o.toastId,o.containerId),key:`t-${o.key}`},t)))}))}var R=`:root {
  --toastify-color-light: #fff;
  --toastify-color-dark: #121212;
  --toastify-color-info: #3498db;
  --toastify-color-success: #07bc0c;
  --toastify-color-warning: #f1c40f;
  --toastify-color-error: hsl(6, 78%, 57%);
  --toastify-color-transparent: rgba(255, 255, 255, 0.7);

  --toastify-icon-color-info: var(--toastify-color-info);
  --toastify-icon-color-success: var(--toastify-color-success);
  --toastify-icon-color-warning: var(--toastify-color-warning);
  --toastify-icon-color-error: var(--toastify-color-error);

  --toastify-container-width: fit-content;
  --toastify-toast-width: 320px;
  --toastify-toast-offset: 16px;
  --toastify-toast-top: max(var(--toastify-toast-offset), env(safe-area-inset-top));
  --toastify-toast-right: max(var(--toastify-toast-offset), env(safe-area-inset-right));
  --toastify-toast-left: max(var(--toastify-toast-offset), env(safe-area-inset-left));
  --toastify-toast-bottom: max(var(--toastify-toast-offset), env(safe-area-inset-bottom));
  --toastify-toast-background: #fff;
  --toastify-toast-padding: 14px;
  --toastify-toast-min-height: 64px;
  --toastify-toast-max-height: 800px;
  --toastify-toast-bd-radius: 6px;
  --toastify-toast-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  --toastify-font-family: sans-serif;
  --toastify-z-index: 9999;
  --toastify-text-color-light: #757575;
  --toastify-text-color-dark: #fff;

  /* Used only for colored theme */
  --toastify-text-color-info: #fff;
  --toastify-text-color-success: #fff;
  --toastify-text-color-warning: #fff;
  --toastify-text-color-error: #fff;

  --toastify-spinner-color: #616161;
  --toastify-spinner-color-empty-area: #e0e0e0;
  --toastify-color-progress-light: linear-gradient(to right, #4cd964, #5ac8fa, #007aff, #34aadc, #5856d6, #ff2d55);
  --toastify-color-progress-dark: #bb86fc;
  --toastify-color-progress-info: var(--toastify-color-info);
  --toastify-color-progress-success: var(--toastify-color-success);
  --toastify-color-progress-warning: var(--toastify-color-warning);
  --toastify-color-progress-error: var(--toastify-color-error);
  /* used to control the opacity of the progress trail */
  --toastify-color-progress-bgo: 0.2;
}

.Toastify__toast-container {
  z-index: var(--toastify-z-index);
  -webkit-transform: translate3d(0, 0, var(--toastify-z-index));
  position: fixed;
  width: var(--toastify-container-width);
  box-sizing: border-box;
  color: #fff;
  display: flex;
  flex-direction: column;
}

.Toastify__toast-container--top-left {
  top: var(--toastify-toast-top);
  left: var(--toastify-toast-left);
}
.Toastify__toast-container--top-center {
  top: var(--toastify-toast-top);
  left: 50%;
  transform: translateX(-50%);
  align-items: center;
}
.Toastify__toast-container--top-right {
  top: var(--toastify-toast-top);
  right: var(--toastify-toast-right);
  align-items: end;
}
.Toastify__toast-container--bottom-left {
  bottom: var(--toastify-toast-bottom);
  left: var(--toastify-toast-left);
}
.Toastify__toast-container--bottom-center {
  bottom: var(--toastify-toast-bottom);
  left: 50%;
  transform: translateX(-50%);
  align-items: center;
}
.Toastify__toast-container--bottom-right {
  bottom: var(--toastify-toast-bottom);
  right: var(--toastify-toast-right);
  align-items: end;
}

.Toastify__toast {
  --y: 0px;
  position: relative;
  touch-action: none;
  width: var(--toastify-toast-width);
  min-height: var(--toastify-toast-min-height);
  box-sizing: border-box;
  margin-bottom: 1rem;
  padding: var(--toastify-toast-padding);
  border-radius: var(--toastify-toast-bd-radius);
  box-shadow: var(--toastify-toast-shadow);
  max-height: var(--toastify-toast-max-height);
  font-family: var(--toastify-font-family);
  /* webkit only issue #791 */
  z-index: 0;
  /* inner swag */
  display: flex;
  flex: 1 auto;
  align-items: center;
  word-break: break-word;
}

@media only screen and (max-width: 480px) {
  .Toastify__toast-container {
    width: 100vw;
    left: env(safe-area-inset-left);
    margin: 0;
  }
  .Toastify__toast-container--top-left,
  .Toastify__toast-container--top-center,
  .Toastify__toast-container--top-right {
    top: env(safe-area-inset-top);
    transform: translateX(0);
  }
  .Toastify__toast-container--bottom-left,
  .Toastify__toast-container--bottom-center,
  .Toastify__toast-container--bottom-right {
    bottom: env(safe-area-inset-bottom);
    transform: translateX(0);
  }
  .Toastify__toast-container--rtl {
    right: env(safe-area-inset-right);
    left: initial;
  }
  .Toastify__toast {
    --toastify-toast-width: 100%;
    margin-bottom: 0;
    border-radius: 0;
  }
}

.Toastify__toast-container[data-stacked='true'] {
  width: var(--toastify-toast-width);
}

@media only screen and (max-width: 480px) {
  .Toastify__toast-container[data-stacked='true'] {
    width: 100vw;
  }
}

.Toastify__toast--stacked {
  position: absolute;
  width: 100%;
  transform: translate3d(0, var(--y), 0) scale(var(--s));
  transition: transform 0.3s;
}

.Toastify__toast--stacked[data-collapsed] .Toastify__toast-body,
.Toastify__toast--stacked[data-collapsed] .Toastify__close-button {
  transition: opacity 0.1s;
}

.Toastify__toast--stacked[data-collapsed='false'] {
  overflow: visible;
}

.Toastify__toast--stacked[data-collapsed='true']:not(:last-child) > * {
  opacity: 0;
}

.Toastify__toast--stacked:after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: calc(var(--g) * 1px);
  bottom: 100%;
}

.Toastify__toast--stacked[data-pos='top'] {
  top: 0;
}

.Toastify__toast--stacked[data-pos='bot'] {
  bottom: 0;
}

.Toastify__toast--stacked[data-pos='bot'].Toastify__toast--stacked:before {
  transform-origin: top;
}

.Toastify__toast--stacked[data-pos='top'].Toastify__toast--stacked:before {
  transform-origin: bottom;
}

.Toastify__toast--stacked:before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  transform: scaleY(3);
  z-index: -1;
}

.Toastify__toast--rtl {
  direction: rtl;
}

.Toastify__toast--close-on-click {
  cursor: pointer;
}

.Toastify__toast-icon {
  margin-inline-end: 10px;
  width: 22px;
  flex-shrink: 0;
  display: flex;
}

.Toastify--animate {
  animation-fill-mode: both;
  animation-duration: 0.5s;
}

.Toastify--animate-icon {
  animation-fill-mode: both;
  animation-duration: 0.3s;
}

.Toastify__toast-theme--dark {
  background: var(--toastify-color-dark);
  color: var(--toastify-text-color-dark);
}

.Toastify__toast-theme--light {
  background: var(--toastify-color-light);
  color: var(--toastify-text-color-light);
}

.Toastify__toast-theme--colored.Toastify__toast--default {
  background: var(--toastify-color-light);
  color: var(--toastify-text-color-light);
}

.Toastify__toast-theme--colored.Toastify__toast--info {
  color: var(--toastify-text-color-info);
  background: var(--toastify-color-info);
}

.Toastify__toast-theme--colored.Toastify__toast--success {
  color: var(--toastify-text-color-success);
  background: var(--toastify-color-success);
}

.Toastify__toast-theme--colored.Toastify__toast--warning {
  color: var(--toastify-text-color-warning);
  background: var(--toastify-color-warning);
}

.Toastify__toast-theme--colored.Toastify__toast--error {
  color: var(--toastify-text-color-error);
  background: var(--toastify-color-error);
}

.Toastify__progress-bar-theme--light {
  background: var(--toastify-color-progress-light);
}

.Toastify__progress-bar-theme--dark {
  background: var(--toastify-color-progress-dark);
}

.Toastify__progress-bar--info {
  background: var(--toastify-color-progress-info);
}

.Toastify__progress-bar--success {
  background: var(--toastify-color-progress-success);
}

.Toastify__progress-bar--warning {
  background: var(--toastify-color-progress-warning);
}

.Toastify__progress-bar--error {
  background: var(--toastify-color-progress-error);
}

.Toastify__progress-bar-theme--colored.Toastify__progress-bar--info,
.Toastify__progress-bar-theme--colored.Toastify__progress-bar--success,
.Toastify__progress-bar-theme--colored.Toastify__progress-bar--warning,
.Toastify__progress-bar-theme--colored.Toastify__progress-bar--error {
  background: var(--toastify-color-transparent);
}

.Toastify__close-button {
  color: #fff;
  position: absolute;
  top: 6px;
  right: 6px;
  background: transparent;
  outline: none;
  border: none;
  padding: 0;
  cursor: pointer;
  opacity: 0.7;
  transition: 0.3s ease;
  z-index: 1;
}

.Toastify__toast--rtl .Toastify__close-button {
  left: 6px;
  right: unset;
}

.Toastify__close-button--light {
  color: #000;
  opacity: 0.3;
}

.Toastify__close-button > svg {
  fill: currentColor;
  height: 16px;
  width: 14px;
}

.Toastify__close-button:hover,
.Toastify__close-button:focus {
  opacity: 1;
}

@keyframes Toastify__trackProgress {
  0% {
    transform: scaleX(1);
  }
  100% {
    transform: scaleX(0);
  }
}

.Toastify__progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  opacity: 0.7;
  transform-origin: left;
}

.Toastify__progress-bar--animated {
  animation: Toastify__trackProgress linear 1 forwards;
}

.Toastify__progress-bar--controlled {
  transition: transform 0.2s;
}

.Toastify__progress-bar--rtl {
  right: 0;
  left: initial;
  transform-origin: right;
  border-bottom-left-radius: initial;
}

.Toastify__progress-bar--wrp {
  position: absolute;
  overflow: hidden;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 5px;
  border-bottom-left-radius: var(--toastify-toast-bd-radius);
  border-bottom-right-radius: var(--toastify-toast-bd-radius);
}

.Toastify__progress-bar--wrp[data-hidden='true'] {
  opacity: 0;
}

.Toastify__progress-bar--bg {
  opacity: var(--toastify-color-progress-bgo);
  width: 100%;
  height: 100%;
}

.Toastify__spinner {
  width: 20px;
  height: 20px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: var(--toastify-spinner-color-empty-area);
  border-right-color: var(--toastify-spinner-color);
  animation: Toastify__spin 0.65s linear infinite;
}

@keyframes Toastify__bounceInRight {
  from,
  60%,
  75%,
  90%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  from {
    opacity: 0;
    transform: translate3d(3000px, 0, 0);
  }
  60% {
    opacity: 1;
    transform: translate3d(-25px, 0, 0);
  }
  75% {
    transform: translate3d(10px, 0, 0);
  }
  90% {
    transform: translate3d(-5px, 0, 0);
  }
  to {
    transform: none;
  }
}

@keyframes Toastify__bounceOutRight {
  20% {
    opacity: 1;
    transform: translate3d(-20px, var(--y), 0);
  }
  to {
    opacity: 0;
    transform: translate3d(2000px, var(--y), 0);
  }
}

@keyframes Toastify__bounceInLeft {
  from,
  60%,
  75%,
  90%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  0% {
    opacity: 0;
    transform: translate3d(-3000px, 0, 0);
  }
  60% {
    opacity: 1;
    transform: translate3d(25px, 0, 0);
  }
  75% {
    transform: translate3d(-10px, 0, 0);
  }
  90% {
    transform: translate3d(5px, 0, 0);
  }
  to {
    transform: none;
  }
}

@keyframes Toastify__bounceOutLeft {
  20% {
    opacity: 1;
    transform: translate3d(20px, var(--y), 0);
  }
  to {
    opacity: 0;
    transform: translate3d(-2000px, var(--y), 0);
  }
}

@keyframes Toastify__bounceInUp {
  from,
  60%,
  75%,
  90%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  from {
    opacity: 0;
    transform: translate3d(0, 3000px, 0);
  }
  60% {
    opacity: 1;
    transform: translate3d(0, -20px, 0);
  }
  75% {
    transform: translate3d(0, 10px, 0);
  }
  90% {
    transform: translate3d(0, -5px, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}

@keyframes Toastify__bounceOutUp {
  20% {
    transform: translate3d(0, calc(var(--y) - 10px), 0);
  }
  40%,
  45% {
    opacity: 1;
    transform: translate3d(0, calc(var(--y) + 20px), 0);
  }
  to {
    opacity: 0;
    transform: translate3d(0, -2000px, 0);
  }
}

@keyframes Toastify__bounceInDown {
  from,
  60%,
  75%,
  90%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  0% {
    opacity: 0;
    transform: translate3d(0, -3000px, 0);
  }
  60% {
    opacity: 1;
    transform: translate3d(0, 25px, 0);
  }
  75% {
    transform: translate3d(0, -10px, 0);
  }
  90% {
    transform: translate3d(0, 5px, 0);
  }
  to {
    transform: none;
  }
}

@keyframes Toastify__bounceOutDown {
  20% {
    transform: translate3d(0, calc(var(--y) - 10px), 0);
  }
  40%,
  45% {
    opacity: 1;
    transform: translate3d(0, calc(var(--y) + 20px), 0);
  }
  to {
    opacity: 0;
    transform: translate3d(0, 2000px, 0);
  }
}

.Toastify__bounce-enter--top-left,
.Toastify__bounce-enter--bottom-left {
  animation-name: Toastify__bounceInLeft;
}

.Toastify__bounce-enter--top-right,
.Toastify__bounce-enter--bottom-right {
  animation-name: Toastify__bounceInRight;
}

.Toastify__bounce-enter--top-center {
  animation-name: Toastify__bounceInDown;
}

.Toastify__bounce-enter--bottom-center {
  animation-name: Toastify__bounceInUp;
}

.Toastify__bounce-exit--top-left,
.Toastify__bounce-exit--bottom-left {
  animation-name: Toastify__bounceOutLeft;
}

.Toastify__bounce-exit--top-right,
.Toastify__bounce-exit--bottom-right {
  animation-name: Toastify__bounceOutRight;
}

.Toastify__bounce-exit--top-center {
  animation-name: Toastify__bounceOutUp;
}

.Toastify__bounce-exit--bottom-center {
  animation-name: Toastify__bounceOutDown;
}

@keyframes Toastify__zoomIn {
  from {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }
  50% {
    opacity: 1;
  }
}

@keyframes Toastify__zoomOut {
  from {
    opacity: 1;
  }
  50% {
    opacity: 0;
    transform: translate3d(0, var(--y), 0) scale3d(0.3, 0.3, 0.3);
  }
  to {
    opacity: 0;
  }
}

.Toastify__zoom-enter {
  animation-name: Toastify__zoomIn;
}

.Toastify__zoom-exit {
  animation-name: Toastify__zoomOut;
}

@keyframes Toastify__flipIn {
  from {
    transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
    animation-timing-function: ease-in;
    opacity: 0;
  }
  40% {
    transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
    animation-timing-function: ease-in;
  }
  60% {
    transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
    opacity: 1;
  }
  80% {
    transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
  }
  to {
    transform: perspective(400px);
  }
}

@keyframes Toastify__flipOut {
  from {
    transform: translate3d(0, var(--y), 0) perspective(400px);
  }
  30% {
    transform: translate3d(0, var(--y), 0) perspective(400px) rotate3d(1, 0, 0, -20deg);
    opacity: 1;
  }
  to {
    transform: translate3d(0, var(--y), 0) perspective(400px) rotate3d(1, 0, 0, 90deg);
    opacity: 0;
  }
}

.Toastify__flip-enter {
  animation-name: Toastify__flipIn;
}

.Toastify__flip-exit {
  animation-name: Toastify__flipOut;
}

@keyframes Toastify__slideInRight {
  from {
    transform: translate3d(110%, 0, 0);
    visibility: visible;
  }
  to {
    transform: translate3d(0, var(--y), 0);
  }
}

@keyframes Toastify__slideInLeft {
  from {
    transform: translate3d(-110%, 0, 0);
    visibility: visible;
  }
  to {
    transform: translate3d(0, var(--y), 0);
  }
}

@keyframes Toastify__slideInUp {
  from {
    transform: translate3d(0, 110%, 0);
    visibility: visible;
  }
  to {
    transform: translate3d(0, var(--y), 0);
  }
}

@keyframes Toastify__slideInDown {
  from {
    transform: translate3d(0, -110%, 0);
    visibility: visible;
  }
  to {
    transform: translate3d(0, var(--y), 0);
  }
}

@keyframes Toastify__slideOutRight {
  from {
    transform: translate3d(0, var(--y), 0);
  }
  to {
    visibility: hidden;
    transform: translate3d(110%, var(--y), 0);
  }
}

@keyframes Toastify__slideOutLeft {
  from {
    transform: translate3d(0, var(--y), 0);
  }
  to {
    visibility: hidden;
    transform: translate3d(-110%, var(--y), 0);
  }
}

@keyframes Toastify__slideOutDown {
  from {
    transform: translate3d(0, var(--y), 0);
  }
  to {
    visibility: hidden;
    transform: translate3d(0, 500px, 0);
  }
}

@keyframes Toastify__slideOutUp {
  from {
    transform: translate3d(0, var(--y), 0);
  }
  to {
    visibility: hidden;
    transform: translate3d(0, -500px, 0);
  }
}

.Toastify__slide-enter--top-left,
.Toastify__slide-enter--bottom-left {
  animation-name: Toastify__slideInLeft;
}

.Toastify__slide-enter--top-right,
.Toastify__slide-enter--bottom-right {
  animation-name: Toastify__slideInRight;
}

.Toastify__slide-enter--top-center {
  animation-name: Toastify__slideInDown;
}

.Toastify__slide-enter--bottom-center {
  animation-name: Toastify__slideInUp;
}

.Toastify__slide-exit--top-left,
.Toastify__slide-exit--bottom-left {
  animation-name: Toastify__slideOutLeft;
  animation-timing-function: ease-in;
  animation-duration: 0.3s;
}

.Toastify__slide-exit--top-right,
.Toastify__slide-exit--bottom-right {
  animation-name: Toastify__slideOutRight;
  animation-timing-function: ease-in;
  animation-duration: 0.3s;
}

.Toastify__slide-exit--top-center {
  animation-name: Toastify__slideOutUp;
  animation-timing-function: ease-in;
  animation-duration: 0.3s;
}

.Toastify__slide-exit--bottom-center {
  animation-name: Toastify__slideOutDown;
  animation-timing-function: ease-in;
  animation-duration: 0.3s;
}

@keyframes Toastify__spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
`,M=new Map;t.s(["Bounce",0,N,"Flip",0,j,"Icons",0,k,"Slide",0,I,"ToastContainer",0,function(t){var o;return S(()=>{if(!R||"u"<typeof document)return;let t=document,e=M.get(t);if(e){o&&e.setAttribute("nonce",o);return}let i=t.createElement("style");i.textContent=R,o&&i.setAttribute("nonce",o),t.head.appendChild(i),M.set(t,i)},[o=t.nonce]),e.default.createElement(z,{...t})},"Zoom",0,O,"collapseToast",0,n,"cssTransition",0,a,"toast",0,w])},63178,t=>{"use strict";var e=t.i(71645),o=(t,e,o,i,r,s,n,a)=>{let l=document.documentElement,c=["light","dark"];function d(e){var o;(Array.isArray(t)?t:[t]).forEach(t=>{let o="class"===t,i=o&&s?r.map(t=>s[t]||t):r;o?(l.classList.remove(...i),l.classList.add(s&&s[e]?s[e]:e)):l.setAttribute(t,e)}),o=e,a&&c.includes(o)&&(l.style.colorScheme=o)}if(i)d(i);else try{let t=localStorage.getItem(e)||o,i=n&&"system"===t?window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light":t;d(i)}catch(t){}},i=["light","dark"],r="(prefers-color-scheme: dark)",s="u"<typeof window,n=e.createContext(void 0),a={setTheme:t=>{},themes:[]},l=["light","dark"],c=({forcedTheme:t,disableTransitionOnChange:o=!1,enableSystem:s=!0,enableColorScheme:a=!0,storageKey:c="theme",themes:p=l,defaultTheme:m=s?"system":"light",attribute:y="data-theme",value:g,children:v,nonce:b,scriptProps:_})=>{let[T,x]=e.useState(()=>u(c,m)),[w,S]=e.useState(()=>"system"===T?h():T),E=g?Object.values(g):p,k=e.useCallback(t=>{let e=t;if(!e)return;"system"===t&&s&&(e=h());let r=g?g[e]:e,n=o?f(b):null,l=document.documentElement,c=t=>{"class"===t?(l.classList.remove(...E),r&&l.classList.add(r)):t.startsWith("data-")&&(r?l.setAttribute(t,r):l.removeAttribute(t))};if(Array.isArray(y)?y.forEach(c):c(y),a){let t=i.includes(m)?m:null,o=i.includes(e)?e:t;l.style.colorScheme=o}null==n||n()},[b]),L=e.useCallback(t=>{let e="function"==typeof t?t(T):t;x(e);try{localStorage.setItem(c,e)}catch(t){}},[T]),C=e.useCallback(e=>{S(h(e)),"system"===T&&s&&!t&&k("system")},[T,t]);e.useEffect(()=>{let t=window.matchMedia(r);return t.addListener(C),C(t),()=>t.removeListener(C)},[C]),e.useEffect(()=>{let t=t=>{t.key===c&&(t.newValue?x(t.newValue):L(m))};return window.addEventListener("storage",t),()=>window.removeEventListener("storage",t)},[L]),e.useEffect(()=>{k(null!=t?t:T)},[t,T]);let N=e.useMemo(()=>({theme:T,setTheme:L,forcedTheme:t,resolvedTheme:"system"===T?w:T,themes:s?[...p,"system"]:p,systemTheme:s?w:void 0}),[T,L,t,w,s,p]);return e.createElement(n.Provider,{value:N},e.createElement(d,{forcedTheme:t,storageKey:c,attribute:y,enableSystem:s,enableColorScheme:a,defaultTheme:m,value:g,themes:p,nonce:b,scriptProps:_}),v)},d=e.memo(({forcedTheme:t,storageKey:i,attribute:r,enableSystem:s,enableColorScheme:n,defaultTheme:a,value:l,themes:c,nonce:d,scriptProps:u})=>{let f=JSON.stringify([r,i,a,t,c,l,s,n]).slice(1,-1);return e.createElement("script",{...u,suppressHydrationWarning:!0,nonce:"u"<typeof window?d:"",dangerouslySetInnerHTML:{__html:`(${o.toString()})(${f})`}})}),u=(t,e)=>{let o;if(!s){try{o=localStorage.getItem(t)||void 0}catch(t){}return o||e}},f=t=>{let e=document.createElement("style");return t&&e.setAttribute("nonce",t),e.appendChild(document.createTextNode("*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}")),document.head.appendChild(e),()=>{window.getComputedStyle(document.body),setTimeout(()=>{document.head.removeChild(e)},1)}},h=t=>(t||(t=window.matchMedia(r)),t.matches?"dark":"light");t.s(["ThemeProvider",0,t=>e.useContext(n)?e.createElement(e.Fragment,null,t.children):e.createElement(c,{...t}),"useTheme",0,()=>{var t;return null!=(t=e.useContext(n))?t:a}])},88653,t=>{"use strict";t.i(47167);var e=t.i(43476),o=t.i(71645),i=t.i(31178),r=t.i(47414),s=t.i(74008),n=t.i(21476),a=t.i(72846),l=o,c=t.i(37806);function d(t,e){if("function"==typeof t)return t(e);null!=t&&(t.current=e)}class u extends l.Component{getSnapshotBeforeUpdate(t){let e=this.props.childRef.current;if((0,a.isHTMLElement)(e)&&t.isPresent&&!this.props.isPresent&&!1!==this.props.pop){let t=e.offsetParent,o=(0,a.isHTMLElement)(t)&&t.offsetWidth||0,i=(0,a.isHTMLElement)(t)&&t.offsetHeight||0,r=getComputedStyle(e),s=this.props.sizeRef.current;s.height=parseFloat(r.height),s.width=parseFloat(r.width),s.top=e.offsetTop,s.left=e.offsetLeft,s.right=o-s.width-s.left,s.bottom=i-s.height-s.top,s.direction=r.direction}return null}componentDidUpdate(){}render(){return this.props.children}}function f({children:t,isPresent:i,anchorX:r,anchorY:s,root:n,pop:a}){let h=(0,l.useId)(),p=(0,l.useRef)(null),m=(0,l.useRef)({width:0,height:0,top:0,left:0,right:0,bottom:0,direction:"ltr"}),{nonce:y}=(0,l.useContext)(c.MotionConfigContext),g=function(...t){return o.useCallback(function(...t){return e=>{let o=!1,i=t.map(t=>{let i=d(t,e);return o||"function"!=typeof i||(o=!0),i});if(o)return()=>{for(let e=0;e<i.length;e++){let o=i[e];"function"==typeof o?o():d(t[e],null)}}}}(...t),t)}(p,t.props?.ref??t?.ref);return(0,l.useInsertionEffect)(()=>{let{width:t,height:e,top:o,left:l,right:c,bottom:d,direction:u}=m.current;if(i||!1===a||!p.current||!t||!e)return;let f="rtl"===u,g="left"===r?f?`right: ${c}`:`left: ${l}`:f?`left: ${l}`:`right: ${c}`,v="bottom"===s?`bottom: ${d}`:`top: ${o}`;p.current.dataset.motionPopId=h;let b=document.createElement("style");y&&(b.nonce=y);let _=n??document.head;return _.appendChild(b),b.sheet&&b.sheet.insertRule(`
          [data-motion-pop-id="${h}"] {
            position: absolute !important;
            width: ${t}px !important;
            height: ${e}px !important;
            ${g}px !important;
            ${v}px !important;
          }
        `),()=>{p.current?.removeAttribute("data-motion-pop-id"),_.contains(b)&&_.removeChild(b)}},[i]),(0,e.jsx)(u,{isPresent:i,childRef:p,sizeRef:m,pop:a,children:!1===a?t:l.cloneElement(t,{ref:g})})}let h=({children:t,initial:i,isPresent:s,onExitComplete:a,custom:l,presenceAffectsLayout:c,mode:d,anchorX:u,anchorY:h,root:m})=>{let y=(0,r.useConstant)(p),g=(0,o.useId)(),v=!0,b=(0,o.useMemo)(()=>(v=!1,{id:g,initial:i,isPresent:s,custom:l,onExitComplete:t=>{for(let e of(y.set(t,!0),y.values()))if(!e)return;a&&a()},register:t=>(y.set(t,!1),()=>y.delete(t))}),[s,y,a]);return c&&v&&(b={...b}),(0,o.useMemo)(()=>{y.forEach((t,e)=>y.set(e,!1))},[s]),o.useEffect(()=>{s||y.size||!a||a()},[s]),t=(0,e.jsx)(f,{pop:"popLayout"===d,isPresent:s,anchorX:u,anchorY:h,root:m,children:t}),(0,e.jsx)(n.PresenceContext.Provider,{value:b,children:t})};function p(){return new Map}var m=t.i(64978);let y=t=>t.key||"";function g(t){let e=[];return o.Children.forEach(t,t=>{(0,o.isValidElement)(t)&&e.push(t)}),e}t.s(["AnimatePresence",0,({children:t,custom:n,initial:a=!0,onExitComplete:l,presenceAffectsLayout:c=!0,mode:d="sync",propagate:u=!1,anchorX:f="left",anchorY:p="top",root:v})=>{let[b,_]=(0,m.usePresence)(u),T=(0,o.useMemo)(()=>g(t),[t]),x=u&&!b?[]:T.map(y),w=(0,o.useRef)(!0),S=(0,o.useRef)(T),E=(0,r.useConstant)(()=>new Map),k=(0,o.useRef)(new Set),[L,C]=(0,o.useState)(T),[N,I]=(0,o.useState)(T);(0,s.useIsomorphicLayoutEffect)(()=>{w.current=!1,S.current=T;for(let t=0;t<N.length;t++){let e=y(N[t]);x.includes(e)?(E.delete(e),k.current.delete(e)):!0!==E.get(e)&&E.set(e,!1)}},[N,x.length,x.join("-")]);let O=[];if(T!==L){let t=[...T];for(let e=0;e<N.length;e++){let o=N[e],i=y(o);x.includes(i)||(t.splice(e,0,o),O.push(o))}return"wait"===d&&O.length&&(t=O),I(g(t)),C(T),null}let{forceRender:j}=(0,o.useContext)(i.LayoutGroupContext);return(0,e.jsx)(e.Fragment,{children:N.map(t=>{let o=y(t),i=(!u||!!b)&&(T===N||x.includes(o));return(0,e.jsx)(h,{isPresent:i,initial:(!w.current||!!a)&&void 0,custom:n,presenceAffectsLayout:c,mode:d,root:v,onExitComplete:i?void 0:()=>{if(k.current.has(o)||!E.has(o))return;k.current.add(o),E.set(o,!0);let t=!0;E.forEach(e=>{e||(t=!1)}),t&&(j?.(),I(S.current),u&&_?.(),l&&l())},anchorX:f,anchorY:p,children:t},o)})})}],88653)},56712,t=>{"use strict";async function e(t,o=[]){try{let e=await fetch("/api/ai/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:t,history:o})});if(e.ok)return await e.json()}catch(t){console.warn("Internal AI route fallback:",t)}let i=await fetch(`${"https://librello-backend.vercel.app/".replace(/\/+$/,"")}/api/ai/chat`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:t,history:o})});if(!i.ok)throw Error((await i.json().catch(()=>({}))).error||"Failed to communicate with AI");return i.json()}async function o(t,e="image/jpeg"){let i=await fetch(`${"https://librello-backend.vercel.app/".replace(/\/+$/,"")}/api/ai/scan-cover`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image:t,mimeType:e})});if(!i.ok)throw Error((await i.json().catch(()=>({}))).error||"Failed to scan book cover");return i.json()}async function i({title:t,author:e,category:o,description:r}){let s=await fetch(`${"https://librello-backend.vercel.app/".replace(/\/+$/,"")}/api/ai/book-insights`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:t,author:e,category:o,description:r})});if(!s.ok)throw Error((await s.json().catch(()=>({}))).error||"Failed to generate book insights");return s.json()}async function r(t){let e=await fetch(`${"https://librello-backend.vercel.app/".replace(/\/+$/,"")}/api/ai/semantic-search`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:t})});if(!e.ok)throw Error((await e.json().catch(()=>({}))).error||"Failed to perform AI mood search");return e.json()}t.s(["fetchBookInsights",0,i,"scanBookCover",0,o,"searchBooksByMood",0,r,"sendChatMessage",0,e])},7738,t=>{"use strict";var e=t.i(43476),o=t.i(63178);t.s(["default",0,function({children:t}){return(0,e.jsx)(o.ThemeProvider,{attribute:"class",defaultTheme:"light",enableSystem:!1,disableTransitionOnChange:!0,children:t})}])},85699,t=>{"use strict";var e=t.i(43476),o=t.i(71645),i="1.3.25";function r(t,e,o){return Math.max(t,Math.min(e,o))}var s=class{isRunning=!1;value=0;from=0;to=0;currentTime=0;lerp;duration;easing;onUpdate;advance(t){if(!this.isRunning)return;let e=!1;if(this.duration&&this.easing){this.currentTime+=t;let o=r(0,this.currentTime/this.duration,1),i=(e=o>=1)?1:this.easing(o);this.value=this.from+(this.to-this.from)*i}else if(this.lerp){var o,i,s,n;this.value=(o=this.value,i=this.to,s=60*this.lerp,(1-(n=1-Math.exp(-s*t)))*o+n*i),Math.round(this.value)===Math.round(this.to)&&(this.value=this.to,e=!0)}else this.value=this.to,e=!0;e&&this.stop(),this.onUpdate?.(this.value,e)}stop(){this.isRunning=!1}fromTo(t,e,{lerp:o,duration:i,easing:r,onStart:s,onUpdate:n}){this.from=this.value=t,this.to=e,this.lerp=o,this.duration=i,this.easing=r,this.currentTime=0,this.isRunning=!0,s?.(),this.onUpdate=n}},n=class{width=0;height=0;scrollHeight=0;scrollWidth=0;debouncedResize;wrapperResizeObserver;contentResizeObserver;constructor(t,e,{autoResize:o=!0,debounce:i=250}={}){this.wrapper=t,this.content=e,o&&(this.debouncedResize=function(t,e){let o;return function(...i){clearTimeout(o),o=setTimeout(()=>{o=void 0,t.apply(this,i)},e)}}(this.resize,i),this.wrapper instanceof Window?window.addEventListener("resize",this.debouncedResize):(this.wrapperResizeObserver=new ResizeObserver(this.debouncedResize),this.wrapperResizeObserver.observe(this.wrapper)),this.contentResizeObserver=new ResizeObserver(this.debouncedResize),this.contentResizeObserver.observe(this.content)),this.resize()}destroy(){this.wrapperResizeObserver?.disconnect(),this.contentResizeObserver?.disconnect(),this.wrapper===window&&this.debouncedResize&&window.removeEventListener("resize",this.debouncedResize)}resize=()=>{this.onWrapperResize(),this.onContentResize()};onWrapperResize=()=>{this.wrapper instanceof Window?(this.width=window.innerWidth,this.height=window.innerHeight):(this.width=this.wrapper.clientWidth,this.height=this.wrapper.clientHeight)};onContentResize=()=>{this.wrapper instanceof Window?(this.scrollHeight=this.content.scrollHeight,this.scrollWidth=this.content.scrollWidth):(this.scrollHeight=this.wrapper.scrollHeight,this.scrollWidth=this.wrapper.scrollWidth)};get limit(){return{x:this.scrollWidth-this.width,y:this.scrollHeight-this.height}}},a=class{events={};emit(t,...e){let o=this.events[t]||[];for(let t=0,i=o.length;t<i;t++)o[t]?.(...e)}on(t,e){return this.events[t]?this.events[t].push(e):this.events[t]=[e],()=>{this.events[t]=this.events[t]?.filter(t=>e!==t)}}off(t,e){this.events[t]=this.events[t]?.filter(t=>e!==t)}destroy(){this.events={}}};let l=100/6,c={passive:!1};function d(t,e){return 1===t?l:2===t?e:1}var u=class{touchStart={x:0,y:0};lastDelta={x:0,y:0};window={width:0,height:0};emitter=new a;constructor(t,e={wheelMultiplier:1,touchMultiplier:1}){this.element=t,this.options=e,window.addEventListener("resize",this.onWindowResize),this.onWindowResize(),this.element.addEventListener("wheel",this.onWheel,c),this.element.addEventListener("touchstart",this.onTouchStart,c),this.element.addEventListener("touchmove",this.onTouchMove,c),this.element.addEventListener("touchend",this.onTouchEnd,c)}on(t,e){return this.emitter.on(t,e)}destroy(){this.emitter.destroy(),window.removeEventListener("resize",this.onWindowResize),this.element.removeEventListener("wheel",this.onWheel,c),this.element.removeEventListener("touchstart",this.onTouchStart,c),this.element.removeEventListener("touchmove",this.onTouchMove,c),this.element.removeEventListener("touchend",this.onTouchEnd,c)}onTouchStart=t=>{let{clientX:e,clientY:o}=t.targetTouches?t.targetTouches[0]:t;this.touchStart.x=e,this.touchStart.y=o,this.lastDelta={x:0,y:0},this.emitter.emit("scroll",{deltaX:0,deltaY:0,event:t})};onTouchMove=t=>{let{clientX:e,clientY:o}=t.targetTouches?t.targetTouches[0]:t,i=-(e-this.touchStart.x)*this.options.touchMultiplier,r=-(o-this.touchStart.y)*this.options.touchMultiplier;this.touchStart.x=e,this.touchStart.y=o,this.lastDelta={x:i,y:r},this.emitter.emit("scroll",{deltaX:i,deltaY:r,event:t})};onTouchEnd=t=>{this.emitter.emit("scroll",{deltaX:this.lastDelta.x,deltaY:this.lastDelta.y,event:t})};onWheel=t=>{let{deltaX:e,deltaY:o,deltaMode:i}=t,r=d(i,this.window.width),s=d(i,this.window.height);e*=r,o*=s,e*=this.options.wheelMultiplier,o*=this.options.wheelMultiplier,this.emitter.emit("scroll",{deltaX:e,deltaY:o,event:t})};onWindowResize=()=>{this.window={width:window.innerWidth,height:window.innerHeight}}};let f=t=>Math.min(1,1.001-2**(-10*t));var h=class{_isScrolling=!1;_isStopped=!1;_isLocked=!1;_preventNextNativeScrollEvent=!1;_resetVelocityTimeout=null;_rafId=null;_isDraggingSelection=!1;isTouching;isIos;time=0;userData={};lastVelocity=0;velocity=0;direction=0;options;targetScroll;animatedScroll;animate=new s;emitter=new a;dimensions;virtualScroll;constructor({wrapper:t=window,content:e=document.documentElement,eventsTarget:o=t,smoothWheel:r=!0,syncTouch:s=!1,syncTouchLerp:a=.075,touchInertiaExponent:l=1.7,duration:c,easing:d,lerp:h=.1,infinite:p=!1,orientation:m="vertical",gestureOrientation:y="horizontal"===m?"both":"vertical",touchMultiplier:g=1,wheelMultiplier:v=1,autoResize:b=!0,prevent:_,virtualScroll:T,overscroll:x=!0,autoRaf:w=!1,anchors:S=!1,autoToggle:E=!1,allowNestedScroll:k=!1,__experimental__naiveDimensions:L=!1,naiveDimensions:C=L,stopInertiaOnNavigate:N=!1}={}){window.lenisVersion=i,window.lenis||(window.lenis={}),window.lenis.version=i,"horizontal"===m&&(window.lenis.horizontal=!0),!0===s&&(window.lenis.touch=!0),this.isIos=/(iPad|iPhone|iPod)/g.test(navigator.userAgent),t&&t!==document.documentElement||(t=window),"number"==typeof c&&"function"!=typeof d?d=f:"function"==typeof d&&"number"!=typeof c&&(c=1),this.options={wrapper:t,content:e,eventsTarget:o,smoothWheel:r,syncTouch:s,syncTouchLerp:a,touchInertiaExponent:l,duration:c,easing:d,lerp:h,infinite:p,gestureOrientation:y,orientation:m,touchMultiplier:g,wheelMultiplier:v,autoResize:b,prevent:_,virtualScroll:T,overscroll:x,autoRaf:w,anchors:S,autoToggle:E,allowNestedScroll:k,naiveDimensions:C,stopInertiaOnNavigate:N},this.dimensions=new n(t,e,{autoResize:b}),this.updateClassName(),this.targetScroll=this.animatedScroll=this.actualScroll,this.options.wrapper.addEventListener("scroll",this.onNativeScroll),this.options.wrapper.addEventListener("scrollend",this.onScrollEnd,{capture:!0}),(this.options.anchors||this.options.stopInertiaOnNavigate)&&this.options.wrapper.addEventListener("click",this.onClick),this.options.wrapper.addEventListener("pointerdown",this.onPointerDown),this.virtualScroll=new u(o,{touchMultiplier:g,wheelMultiplier:v}),this.virtualScroll.on("scroll",this.onVirtualScroll),this.options.autoToggle&&(this.checkOverflow(),this.rootElement.addEventListener("transitionend",this.onTransitionEnd)),this.options.autoRaf&&(this._rafId=requestAnimationFrame(this.raf))}destroy(){this.emitter.destroy(),this.options.wrapper.removeEventListener("scroll",this.onNativeScroll),this.options.wrapper.removeEventListener("scrollend",this.onScrollEnd,{capture:!0}),this.options.wrapper.removeEventListener("pointerdown",this.onPointerDown),(this.options.anchors||this.options.stopInertiaOnNavigate)&&this.options.wrapper.removeEventListener("click",this.onClick),this.virtualScroll.destroy(),this.dimensions.destroy(),this.cleanUpClassName(),this._rafId&&cancelAnimationFrame(this._rafId)}on(t,e){return this.emitter.on(t,e)}off(t,e){return this.emitter.off(t,e)}onScrollEnd=t=>{t instanceof CustomEvent||"smooth"!==this.isScrolling&&!1!==this.isScrolling||t.stopPropagation()};dispatchScrollendEvent=()=>{this.options.wrapper.dispatchEvent(new CustomEvent("scrollend",{bubbles:this.options.wrapper===window,detail:{lenisScrollEnd:!0}}))};get overflow(){let t=this.isHorizontal?"overflow-x":"overflow-y";return getComputedStyle(this.rootElement)[t]}checkOverflow(){["hidden","clip"].includes(this.overflow)?this.internalStop():this.internalStart()}onTransitionEnd=t=>{t.propertyName?.includes("overflow")&&t.target===this.rootElement&&this.checkOverflow()};setScroll(t){this.isHorizontal?this.options.wrapper.scrollTo({left:t,behavior:"instant"}):this.options.wrapper.scrollTo({top:t,behavior:"instant"})}onClick=t=>{let e=t.composedPath().filter(t=>t instanceof HTMLAnchorElement&&t.href).map(t=>new URL(t.href)),o=new URL(window.location.href);if(this.options.anchors){let t=e.find(t=>o.host===t.host&&o.pathname===t.pathname&&t.hash);if(t){let e="object"==typeof this.options.anchors&&this.options.anchors?this.options.anchors:void 0,o=decodeURIComponent(t.hash);this.scrollTo(o,e);return}}if(this.options.stopInertiaOnNavigate&&e.some(t=>o.host===t.host&&o.pathname!==t.pathname))return void this.reset()};onPointerDown=t=>{1===t.button&&this.reset()};isTouchOnSelectionHandle(t){let e=window.getSelection();if(!e||e.isCollapsed||0===e.rangeCount)return!1;let o=t.targetTouches[0]??t.changedTouches[0];if(!o)return!1;let i=e.getRangeAt(0).getClientRects();if(0===i.length)return!1;let r=i[0],s=i[i.length-1],n=40>=Math.hypot(o.clientX-r.left,o.clientY-r.top),a=40>=Math.hypot(o.clientX-s.right,o.clientY-s.bottom);return n||a}onVirtualScroll=t=>{if("function"==typeof this.options.virtualScroll&&!1===this.options.virtualScroll(t))return;let{deltaX:e,deltaY:o,event:i}=t;if(this.emitter.emit("virtual-scroll",{deltaX:e,deltaY:o,event:i}),i.ctrlKey||i.lenisStopPropagation)return;let r=i.type.includes("touch"),s=i.type.includes("wheel");if(r&&this.isIos&&("touchstart"===i.type&&(this._isDraggingSelection=this.isTouchOnSelectionHandle(i)),this._isDraggingSelection)){"touchend"===i.type&&(this._isDraggingSelection=!1);return}this.isTouching="touchstart"===i.type||"touchmove"===i.type;let n=0===e&&0===o;if(this.options.syncTouch&&r&&"touchstart"===i.type&&n&&!this.isStopped&&!this.isLocked)return void this.reset();let a="vertical"===this.options.gestureOrientation&&0===o||"horizontal"===this.options.gestureOrientation&&0===e;if(n||a)return;let l=i.composedPath();l=l.slice(0,l.indexOf(this.rootElement));let c=this.options.prevent,d=Math.abs(e)>=Math.abs(o)?"horizontal":"vertical";if(l.find(t=>t instanceof HTMLElement&&("function"==typeof c&&c?.(t)||t.hasAttribute?.("data-lenis-prevent")||"vertical"===d&&t.hasAttribute?.("data-lenis-prevent-vertical")||"horizontal"===d&&t.hasAttribute?.("data-lenis-prevent-horizontal")||r&&t.hasAttribute?.("data-lenis-prevent-touch")||s&&t.hasAttribute?.("data-lenis-prevent-wheel")||this.options.allowNestedScroll&&this.hasNestedScroll(t,{deltaX:e,deltaY:o}))))return;if(this.isStopped||this.isLocked){i.cancelable&&i.preventDefault();return}if(!(this.options.syncTouch&&r||this.options.smoothWheel&&s)){this.isScrolling="native",this.animate.stop(),i.lenisStopPropagation=!0;return}let u=o;"both"===this.options.gestureOrientation?u=Math.abs(o)>Math.abs(e)?o:e:"horizontal"===this.options.gestureOrientation&&(u=e),(!this.options.overscroll||this.options.infinite||this.options.wrapper!==window&&this.limit>0&&(this.animatedScroll>0&&this.animatedScroll<this.limit||0===this.animatedScroll&&o>0||this.animatedScroll===this.limit&&o<0))&&(i.lenisStopPropagation=!0),i.cancelable&&i.preventDefault();let f=r&&this.options.syncTouch,h=r&&"touchend"===i.type;h&&(u=Math.sign(u)*Math.abs(this.velocity)**this.options.touchInertiaExponent),this.scrollTo(this.targetScroll+u,{programmatic:!1,...f?{lerp:h?this.options.syncTouchLerp:1}:{lerp:this.options.lerp,duration:this.options.duration,easing:this.options.easing}})};resize(){this.dimensions.resize(),this.animatedScroll=this.targetScroll=this.actualScroll,this.emit()}emit(){this.emitter.emit("scroll",this)}onNativeScroll=()=>{if(null!==this._resetVelocityTimeout&&(clearTimeout(this._resetVelocityTimeout),this._resetVelocityTimeout=null),this._preventNextNativeScrollEvent){this._preventNextNativeScrollEvent=!1;return}if(!1===this.isScrolling||"native"===this.isScrolling){let t=this.animatedScroll;this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity,this.velocity=this.animatedScroll-t,this.direction=Math.sign(this.animatedScroll-t),this.isStopped||(this.isScrolling="native"),this.emit(),0!==this.velocity&&(this._resetVelocityTimeout=setTimeout(()=>{this.lastVelocity=this.velocity,this.velocity=0,this.isScrolling=!1,this.emit()},400))}};reset(){this.isLocked=!1,this.isScrolling=!1,this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity=0,this.animate.stop()}start(){if(this.isStopped){if(this.options.autoToggle)return void this.rootElement.style.removeProperty("overflow");this.internalStart()}}internalStart(){this.isStopped&&(this.reset(),this.isStopped=!1,this.emit())}stop(){if(!this.isStopped){if(this.options.autoToggle)return void this.rootElement.style.setProperty("overflow","clip");this.internalStop()}}internalStop(){this.isStopped||(this.reset(),this.isStopped=!0,this.emit())}raf=t=>{let e=t-(this.time||t);this.time=t,this.animate.advance(.001*e),this.options.autoRaf&&(this._rafId=requestAnimationFrame(this.raf))};scrollTo(t,{offset:e=0,immediate:o=!1,lock:i=!1,programmatic:s=!0,lerp:n=s?this.options.lerp:void 0,duration:a=s?this.options.duration:void 0,easing:l=s?this.options.easing:void 0,onStart:c,onComplete:d,force:u=!1,userData:h}={}){if((this.isStopped||this.isLocked)&&!u)return;let p=t,m=e;if("string"==typeof p&&["top","left","start","#"].includes(p))p=0;else if("string"==typeof p&&["bottom","right","end"].includes(p))p=this.limit;else{let t=null;if("string"==typeof p?(t=p.startsWith("#")?document.getElementById(p.slice(1)):document.querySelector(p))||("#top"===p?p=0:console.warn("Lenis: Target not found",p)):p instanceof HTMLElement&&p?.nodeType&&(t=p),t){if(this.options.wrapper!==window){let t=this.rootElement.getBoundingClientRect();m-=this.isHorizontal?t.left:t.top}let e=t.getBoundingClientRect(),o=getComputedStyle(t),i=this.isHorizontal?Number.parseFloat(o.scrollMarginLeft):Number.parseFloat(o.scrollMarginTop),r=getComputedStyle(this.rootElement),s=this.isHorizontal?Number.parseFloat(r.scrollPaddingLeft):Number.parseFloat(r.scrollPaddingTop);p=(this.isHorizontal?e.left:e.top)+this.animatedScroll-(Number.isNaN(i)?0:i)-(Number.isNaN(s)?0:s)}}if("number"==typeof p){if(p+=m,this.options.infinite){if(s){this.targetScroll=this.animatedScroll=this.scroll;let t=p-this.animatedScroll;t>this.limit/2?p-=this.limit:t<-this.limit/2&&(p+=this.limit)}}else p=r(0,p,this.limit);if(p===this.targetScroll){c?.(this),d?.(this);return}if(this.userData=h??{},o){this.animatedScroll=this.targetScroll=p,this.setScroll(this.scroll),this.reset(),this.preventNextNativeScrollEvent(),this.emit(),d?.(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()});return}s||(this.targetScroll=p),"number"==typeof a&&"function"!=typeof l?l=f:"function"==typeof l&&"number"!=typeof a&&(a=1),this.animate.fromTo(this.animatedScroll,p,{duration:a,easing:l,lerp:n,onStart:()=>{i&&(this.isLocked=!0),this.isScrolling="smooth",c?.(this)},onUpdate:(t,e)=>{this.isScrolling="smooth",this.lastVelocity=this.velocity,this.velocity=t-this.animatedScroll,this.direction=Math.sign(this.velocity),this.animatedScroll=t,this.setScroll(this.scroll),s&&(this.targetScroll=t),e||this.emit(),e&&(this.reset(),this.emit(),d?.(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()}),this.preventNextNativeScrollEvent())}})}}preventNextNativeScrollEvent(){this._preventNextNativeScrollEvent=!0,requestAnimationFrame(()=>{this._preventNextNativeScrollEvent=!1})}hasNestedScroll(t,{deltaX:e,deltaY:o}){let i,r,s,n,a,l,c,d,u,f,h,p,m,y,g,v,b=Date.now();t._lenis||(t._lenis={});let _=t._lenis;if(b-(_.time??0)>2e3){_.time=Date.now();let e=window.getComputedStyle(t);if(_.computedStyle=e,i=["auto","overlay","scroll"].includes(e.overflowX),r=["auto","overlay","scroll"].includes(e.overflowY),a=["auto"].includes(e.overscrollBehaviorX),l=["auto"].includes(e.overscrollBehaviorY),_.hasOverflowX=i,_.hasOverflowY=r,!(i||r))return!1;c=t.scrollWidth,d=t.scrollHeight,u=t.clientWidth,f=t.clientHeight,s=c>u,n=d>f,_.isScrollableX=s,_.isScrollableY=n,_.scrollWidth=c,_.scrollHeight=d,_.clientWidth=u,_.clientHeight=f,_.hasOverscrollBehaviorX=a,_.hasOverscrollBehaviorY=l}else s=_.isScrollableX,n=_.isScrollableY,i=_.hasOverflowX,r=_.hasOverflowY,c=_.scrollWidth,d=_.scrollHeight,u=_.clientWidth,f=_.clientHeight,a=_.hasOverscrollBehaviorX,l=_.hasOverscrollBehaviorY;if(!(i&&s||r&&n))return!1;let T=Math.abs(e)>=Math.abs(o)?"horizontal":"vertical";if("horizontal"===T)h=Math.round(t.scrollLeft),p=c-u,m=e,y=i,g=s,v=a;else{if("vertical"!==T)return!1;h=Math.round(t.scrollTop),p=d-f,m=o,y=r,g=n,v=l}return!v&&(h>=p||h<=0)||(m>0?h<p:h>0)&&y&&g}get rootElement(){return this.options.wrapper===window?document.documentElement:this.options.wrapper}get limit(){return this.options.naiveDimensions?this.isHorizontal?this.rootElement.scrollWidth-this.rootElement.clientWidth:this.rootElement.scrollHeight-this.rootElement.clientHeight:this.dimensions.limit[this.isHorizontal?"x":"y"]}get isHorizontal(){return"horizontal"===this.options.orientation}get actualScroll(){let t=this.options.wrapper;return this.isHorizontal?t.scrollX??t.scrollLeft:t.scrollY??t.scrollTop}get scroll(){var t;return this.options.infinite?(this.animatedScroll%(t=this.limit)+t)%t:this.animatedScroll}get progress(){return 0===this.limit?1:this.scroll/this.limit}get isScrolling(){return this._isScrolling}set isScrolling(t){this._isScrolling!==t&&(this._isScrolling=t,this.updateClassName())}get isStopped(){return this._isStopped}set isStopped(t){this._isStopped!==t&&(this._isStopped=t,this.updateClassName())}get isLocked(){return this._isLocked}set isLocked(t){this._isLocked!==t&&(this._isLocked=t,this.updateClassName())}get isSmooth(){return"smooth"===this.isScrolling}get className(){let t="lenis";return this.options.autoToggle&&(t+=" lenis-autoToggle"),this.isStopped&&(t+=" lenis-stopped"),this.isLocked&&(t+=" lenis-locked"),this.isScrolling&&(t+=" lenis-scrolling"),"smooth"===this.isScrolling&&(t+=" lenis-smooth"),t}updateClassName(){this.cleanUpClassName(),this.className.split(" ").forEach(t=>{this.rootElement.classList.add(t)})}cleanUpClassName(){for(let t of Array.from(this.rootElement.classList))("lenis"===t||t.startsWith("lenis-"))&&this.rootElement.classList.remove(t)}};t.s(["default",0,function({children:t}){return(0,o.useEffect)(()=>{let t,e=new h({duration:1.2,easing:t=>Math.min(1,1.001-Math.pow(2,-10*t)),smoothWheel:!0});return t=requestAnimationFrame(function o(i){e.raf(i),t=requestAnimationFrame(o)}),()=>{cancelAnimationFrame(t),e.destroy()}},[]),(0,e.jsx)(e.Fragment,{children:t})}],85699)},71529,t=>{"use strict";var e=t.i(43476),o=t.i(71645),i=t.i(46932),r=t.i(88653),s=t.i(56712),n=t.i(40759);t.s(["default",0,function(){let[t,a]=(0,o.useState)(!1),[l,c]=(0,o.useState)(""),[d,u]=(0,o.useState)(!1),[f,h]=(0,o.useState)("Librello AI"),[p,m]=(0,o.useState)([{id:"welcome-msg",sender:"bot",text:"Greetings. I am your Librello Concierge, dedicated to assisting your archival inquiries, literary discovery, and circulation requests. How may I be of service?",time:"Just now"}]),y=(0,o.useRef)(null),g=(0,o.useRef)(null);(0,o.useEffect)(()=>{t&&y.current?.scrollIntoView({behavior:"smooth"})},[p,t,d]),(0,o.useEffect)(()=>{t&&setTimeout(()=>g.current?.focus(),150)},[t]);let v=async t=>{let e=t||l;if(!e.trim()||d)return;let o={id:`user-${Date.now()}`,sender:"user",text:e.trim(),time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})};m(t=>[...t,o]),c(""),u(!0);try{let t=p.filter(t=>"welcome-msg"!==t.id).map(t=>({sender:t.sender,text:t.text})),o=await (0,s.sendChatMessage)(e,t);o.provider&&h(o.provider);let i={id:`bot-${Date.now()}`,sender:"bot",text:o.reply,provider:o.provider,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})};m(t=>[...t,i])}catch(e){let t={id:`err-${Date.now()}`,sender:"bot",text:"The concierge network experienced an interruption. Please inquire again momentarily.",time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})};m(e=>[...e,t])}finally{u(!1)}};return(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)("div",{className:"fixed bottom-6 right-6 z-50 select-none",children:(0,e.jsx)(i.motion.button,{whileHover:{scale:1.05},whileTap:{scale:.95},onClick:()=>a(!t),"aria-label":"Open Librello Concierge",title:"Librello Concierge",className:"w-13 h-13 rounded-full bg-primary text-white flex items-center justify-center shadow-lg border border-primary/40 cursor-pointer",children:t?(0,e.jsxs)("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[(0,e.jsx)("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),(0,e.jsx)("line",{x1:"6",y1:"6",x2:"18",y2:"18"})]}):(0,e.jsx)(n.LibrelloIcon,{size:24,className:"text-white"})})}),(0,e.jsx)(r.AnimatePresence,{children:t&&(0,e.jsxs)(i.motion.div,{initial:{opacity:0,y:15,scale:.98},animate:{opacity:1,y:0,scale:1},exit:{opacity:0,y:15,scale:.98},transition:{duration:.2},className:"fixed bottom-22 right-4 sm:right-6 z-50 w-[92vw] sm:w-[390px] h-[540px] max-h-[80vh] rounded-xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden select-text text-foreground",children:[(0,e.jsxs)("div",{className:"px-4 py-3 border-b border-border bg-card-soft flex items-center justify-between shrink-0",children:[(0,e.jsxs)("div",{className:"flex items-center gap-2.5",children:[(0,e.jsx)(n.LibrelloIcon,{size:28,className:"text-foreground"}),(0,e.jsxs)("div",{children:[(0,e.jsx)("h3",{className:"text-sm font-serif font-semibold text-foreground leading-tight",children:"Librello Concierge"}),(0,e.jsxs)("p",{className:"text-[10px] text-muted-foreground uppercase tracking-wider",children:["Literary Advisor (",f,")"]})]})]}),(0,e.jsxs)("div",{className:"flex items-center gap-1",children:[(0,e.jsx)("button",{type:"button",onClick:()=>{m([{id:"welcome-msg",sender:"bot",text:"Conversation reset. How may I assist your literary research today?",time:"Just now"}])},title:"Reset conversation",className:"p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-card transition-colors cursor-pointer",children:(0,e.jsxs)("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[(0,e.jsx)("polyline",{points:"3 6 5 6 21 6"}),(0,e.jsx)("path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"})]})}),(0,e.jsx)("button",{type:"button",onClick:()=>a(!1),title:"Minimize",className:"p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-card transition-colors cursor-pointer",children:(0,e.jsx)("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:(0,e.jsx)("line",{x1:"4",y1:"12",x2:"20",y2:"12"})})})]})]}),(0,e.jsxs)("div",{className:"flex-1 min-h-0 p-4 overflow-y-auto space-y-3 text-xs leading-relaxed",children:[p.map(t=>(0,e.jsx)("div",{className:`flex ${"user"===t.sender?"justify-end":"justify-start"}`,children:(0,e.jsx)("div",{className:`max-w-[84%] px-3.5 py-2.5 rounded-lg text-xs leading-relaxed ${"user"===t.sender?"bg-primary text-white":"bg-card-soft border border-border text-foreground"}`,children:t.text.split("\n").map((t,o)=>{let i=t.split(/(\*\*.*?\*\*)/g);return(0,e.jsxs)("div",{className:t.startsWith("- ")?"ml-3 flex items-start gap-1.5 my-1":"my-0.5",children:[t.startsWith("- ")&&(0,e.jsx)("span",{className:"text-primary font-bold",children:"•"}),(0,e.jsx)("span",{children:i.map((o,i)=>o.startsWith("**")&&o.endsWith("**")?(0,e.jsx)("strong",{className:"font-semibold text-foreground",children:o.slice(2,-2)},i):t.startsWith("- ")?o.replace(/^- /,""):o)})]},o)})})},t.id)),d&&(0,e.jsx)("div",{className:"flex justify-start",children:(0,e.jsx)("div",{className:"px-3.5 py-2 rounded-lg bg-card-soft border border-border text-muted-foreground text-xs italic",children:"Consulting archive index..."})}),(0,e.jsx)("div",{ref:y})]}),(0,e.jsx)("div",{className:"px-3 py-2 border-t border-border/70 bg-card-soft/50 flex flex-wrap gap-1.5 shrink-0",children:[{label:"Circulation Process",prompt:"How does physical book circulation and delivery work?"},{label:"Reading Selections",prompt:"Can you recommend celebrated fiction or philosophy editions?"},{label:"Archival Care & Return",prompt:"What are the book care and return period guidelines?"},{label:"Membership Fees",prompt:"How are borrowing fees and payments handled?"}].map((t,o)=>(0,e.jsx)("button",{type:"button",onClick:()=>v(t.prompt),className:"px-2 py-1 rounded text-[10px] font-medium border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors cursor-pointer",children:t.label},o))}),(0,e.jsxs)("form",{onSubmit:t=>{t.preventDefault(),v()},className:"p-3 border-t border-border bg-card flex items-center gap-2 shrink-0",children:[(0,e.jsx)("input",{ref:g,type:"text",value:l,onChange:t=>c(t.target.value),placeholder:"Ask your literary concierge...",className:"input-field !h-9 !text-xs !rounded-md flex-1",disabled:d}),(0,e.jsx)("button",{type:"submit",disabled:d||!l.trim(),className:"btn-primary !h-9 !px-3 !py-1 text-xs !rounded-md disabled:opacity-40",children:"Send"})]})]})})]})}])}]);