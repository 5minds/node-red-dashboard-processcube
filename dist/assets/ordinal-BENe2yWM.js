import{i as a}from"./init-Gi6I4Gst.js";class o extends Map{constructor(n,t=h){if(super(),Object.defineProperties(this,{_intern:{value:new Map},_key:{value:t}}),n!=null)for(const[r,s]of n)this.set(r,s)}get(n){return super.get(c(this,n))}has(n){return super.has(c(this,n))}set(n,t){return super.set(p(this,n),t)}delete(n){return super.delete(g(this,n))}}function c({_intern:e,_key:n},t){const r=n(t);return e.has(r)?e.get(r):t}function p({_intern:e,_key:n},t){const r=n(t);return e.has(r)?e.get(r):(e.set(r,t),t)}function g({_intern:e,_key:n},t){const r=n(t);return e.has(r)&&(t=e.get(t),e.delete(r)),t}function h(e){return e!==null&&typeof e=="object"?e.valueOf():e}const f=Symbol("implicit");function l(){var e=new o,n=[],t=[],r=f;function s(i){let u=e.get(i);if(u===void 0){if(r!==f)return r;e.set(i,u=n.push(i)-1)}return t[u%t.length]}return s.domain=function(i){if(!arguments.length)return n.slice();n=[],e=new o;for(const u of i)e.has(u)||e.set(u,n.push(u)-1);return s},s.range=function(i){return arguments.length?(t=Array.from(i),s):t.slice()},s.unknown=function(i){return arguments.length?(r=i,s):r},s.copy=function(){return l(n,t).unknown(r)},a.apply(s,arguments),s}export{l as o};
