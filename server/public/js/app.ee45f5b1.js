(function(e){function t(t){for(var a,o,i=t[0],l=t[1],c=t[2],m=0,v=[];m<i.length;m++)o=i[m],Object.prototype.hasOwnProperty.call(s,o)&&s[o]&&v.push(s[o][0]),s[o]=0;for(a in l)Object.prototype.hasOwnProperty.call(l,a)&&(e[a]=l[a]);u&&u(t);while(v.length)v.shift()();return n.push.apply(n,c||[]),r()}function r(){for(var e,t=0;t<n.length;t++){for(var r=n[t],a=!0,i=1;i<r.length;i++){var l=r[i];0!==s[l]&&(a=!1)}a&&(n.splice(t--,1),e=o(o.s=r[0]))}return e}var a={},s={app:0},n=[];function o(t){if(a[t])return a[t].exports;var r=a[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,o),r.l=!0,r.exports}o.m=e,o.c=a,o.d=function(e,t,r){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},o.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(o.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)o.d(r,a,function(t){return e[t]}.bind(null,a));return r},o.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="/";var i=window["webpackJsonp"]=window["webpackJsonp"]||[],l=i.push.bind(i);i.push=t,i=i.slice();for(var c=0;c<i.length;c++)t(i[c]);var u=l;n.push([0,"chunk-vendors"]),r()})({0:function(e,t,r){e.exports=r("56d7")},"034f":function(e,t,r){"use strict";var a=r("85ec"),s=r.n(a);s.a},1:function(e,t){},10:function(e,t){},11:function(e,t){},12:function(e,t){},13:function(e,t){},14:function(e,t){},15:function(e,t){},2:function(e,t){},3:function(e,t){},4:function(e,t){},5:function(e,t){},"56d7":function(e,t,r){"use strict";r.r(t);r("e260"),r("e6cf"),r("cca6"),r("a79d");var a=r("2b0e"),s=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{attrs:{id:"app"}},[r("Header",{on:{"show-login":e.showLogin,"show-register":e.showRegister,logout:e.logout}}),r("router-view"),r("Footer"),e.loginVisible?r("div",[r("transition",{attrs:{name:"modal"}},[r("div",{staticClass:"modal-mask"},[r("div",{staticClass:"modal-wrapper"},[r("div",{staticClass:"modal-dialog modal-dialog-scrollable",attrs:{role:"document"}},[r("div",{staticClass:"modal-content"},[r("div",{staticClass:"modal-header"},[r("h5",{staticClass:"modal-title"},[e._v("Log In")]),r("button",{staticClass:"close",attrs:{type:"button","data-dismiss":"modal","aria-label":"Close"},on:{click:e.hideLogin}},[r("span",{attrs:{"aria-hidden":"true"}},[r("i",{staticClass:"fas fa-times"})])])]),r("form",{on:{submit:function(t){return t.preventDefault(),e.login(t)}}},[r("div",{staticClass:"modal-body"},[e.loginForm.error?r("div",{staticClass:"alert alert-danger"},[e._v(e._s(e.loginForm.error))]):e._e(),r("div",{staticClass:"form-group"},[r("input",{directives:[{name:"model",rawName:"v-model",value:e.loginForm.username,expression:"loginForm.username"}],staticClass:"form-control",attrs:{type:"text",placeholder:"Username/email",autocomplete:"username"},domProps:{value:e.loginForm.username},on:{input:function(t){t.target.composing||e.$set(e.loginForm,"username",t.target.value)}}})]),r("div",{staticClass:"form-group"},[r("input",{directives:[{name:"model",rawName:"v-model",value:e.loginForm.password,expression:"loginForm.password"}],staticClass:"form-control",attrs:{type:"password",placeholder:"Password",autocomplete:"current-password"},domProps:{value:e.loginForm.password},on:{input:function(t){t.target.composing||e.$set(e.loginForm,"password",t.target.value)}}})]),r("div",{staticClass:"text-center"})]),r("div",{staticClass:"modal-footer"},[r("button",{staticClass:"btn btn-link mr-auto",attrs:{disabled:""}},[e._v("Forgot Password")]),r("button",{staticClass:"btn btn-outline-secondary",attrs:{type:"button"},on:{click:function(t){return t.preventDefault(),e.showRegister(t)}}},[e._v("Create Account")]),r("button",{staticClass:"btn btn-primary",attrs:{type:"submit"}},[e._v("Log In")])])])])])])])])],1):e._e(),e.registerVisible?r("div",[r("transition",{attrs:{name:"modal"}},[r("div",{staticClass:"modal-mask"},[r("div",{staticClass:"modal-wrapper"},[r("div",{staticClass:"modal-dialog modal-dialog-scrollable",attrs:{role:"document"}},[r("div",{staticClass:"modal-content"},[r("div",{staticClass:"modal-header"},[r("h5",{staticClass:"modal-title"},[e._v("Create Account")]),r("button",{staticClass:"close",attrs:{type:"button","data-dismiss":"modal","aria-label":"Close"},on:{click:e.hideRegister}},[r("span",{attrs:{"aria-hidden":"true"}},[r("i",{staticClass:"fas fa-times"})])])]),r("form",{on:{submit:function(t){return t.preventDefault(),e.register(t)}}},[r("div",{staticClass:"modal-body"},[r("div",{staticClass:"form-group row"},[r("div",{staticClass:"col-12 col-lg-6 mb-3 mb-lg-0"},[r("input",{directives:[{name:"model",rawName:"v-model",value:e.registerForm.username.value,expression:"registerForm.username.value"}],staticClass:"form-control",class:{"is-invalid":e.registerForm.username.error},attrs:{type:"text",placeholder:"Username",autocomplete:"username"},domProps:{value:e.registerForm.username.value},on:{input:function(t){t.target.composing||e.$set(e.registerForm.username,"value",t.target.value)}}}),e.registerForm.username.error?r("div",{staticClass:"invalid-feedback"},[e._v(e._s(e.registerForm.username.error))]):e._e()]),r("div",{staticClass:"col-12 col-lg-6"},[r("input",{directives:[{name:"model",rawName:"v-model",value:e.registerForm.email.value,expression:"registerForm.email.value"}],staticClass:"form-control",class:{"is-invalid":e.registerForm.email.error},attrs:{type:"email",placeholder:"Email",autocomplete:"email"},domProps:{value:e.registerForm.email.value},on:{input:function(t){t.target.composing||e.$set(e.registerForm.email,"value",t.target.value)}}}),e.registerForm.email.error?r("div",{staticClass:"invalid-feedback"},[e._v(e._s(e.registerForm.email.error))]):e._e()])]),r("div",{staticClass:"form-group row"},[r("div",{staticClass:"col-12 col-lg-6 mb-3 mb-lg-0"},[r("input",{directives:[{name:"model",rawName:"v-model",value:e.registerForm.firstname.value,expression:"registerForm.firstname.value"}],staticClass:"form-control",class:{"is-invalid":e.registerForm.firstname.error},attrs:{type:"text",placeholder:"First name",autocomplete:"given-name"},domProps:{value:e.registerForm.firstname.value},on:{input:function(t){t.target.composing||e.$set(e.registerForm.firstname,"value",t.target.value)}}}),e.registerForm.firstname.error?r("div",{staticClass:"invalid-feedback"},[e._v(e._s(e.registerForm.firstname.error))]):e._e()]),r("div",{staticClass:"col-12 col-lg-6"},[r("input",{directives:[{name:"model",rawName:"v-model",value:e.registerForm.lastname.value,expression:"registerForm.lastname.value"}],staticClass:"form-control",class:{"is-invalid":e.registerForm.lastname.error},attrs:{type:"text",placeholder:"Last name",autocomplete:"family-name"},domProps:{value:e.registerForm.lastname.value},on:{input:function(t){t.target.composing||e.$set(e.registerForm.lastname,"value",t.target.value)}}}),e.registerForm.lastname.error?r("div",{staticClass:"invalid-feedback"},[e._v(e._s(e.registerForm.lastname.error))]):e._e()])]),r("div",{staticClass:"form-group row"},[r("div",{staticClass:"col-12 col-lg-6 mb-3 mb-lg-0"},[r("input",{directives:[{name:"model",rawName:"v-model",value:e.registerForm.password.value,expression:"registerForm.password.value"}],staticClass:"form-control",class:{"is-invalid":e.registerForm.password.error},attrs:{type:"password",placeholder:"Password",autocomplete:"new-password"},domProps:{value:e.registerForm.password.value},on:{input:function(t){t.target.composing||e.$set(e.registerForm.password,"value",t.target.value)}}}),e.registerForm.password.error?r("div",{staticClass:"invalid-feedback"},[e._v(e._s(e.registerForm.password.error))]):e._e()]),r("div",{staticClass:"col-12 col-lg-6"},[r("input",{directives:[{name:"model",rawName:"v-model",value:e.registerForm.confirm.value,expression:"registerForm.confirm.value"}],staticClass:"form-control",class:{"is-invalid":e.registerForm.confirm.error},attrs:{type:"password",placeholder:"Confirm password",autocomplete:"new-password"},domProps:{value:e.registerForm.confirm.value},on:{input:function(t){t.target.composing||e.$set(e.registerForm.confirm,"value",t.target.value)}}}),e.registerForm.confirm.error?r("div",{staticClass:"invalid-feedback"},[e._v(e._s(e.registerForm.confirm.error))]):e._e()])])]),r("div",{staticClass:"modal-footer"},[r("button",{staticClass:"btn btn-outline-secondary",attrs:{type:"button"},on:{click:e.showLogin}},[e._v("Log In")]),r("button",{staticClass:"btn btn-primary",attrs:{type:"submit"}},[e._v("Create Account")])])])])])])])])],1):e._e()],1)},n=[],o=(r("7db0"),r("d3b7"),function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("nav",{staticClass:"navbar navbar-expand-lg navbar-dark bg-dark"},[r("div",{staticClass:"container"},[e._m(0),r("div",{staticClass:"collapse navbar-collapse text-center text-lg-left",attrs:{id:"navbarNav"}},[r("span",{staticClass:"navbar-brand"},[e._v("CookShare")]),r("hr",{staticClass:"d-lg-none"}),r("ul",{staticClass:"navbar-nav mr-auto"},[r("NavLink",{attrs:{page:"/",exact:"true"}}),r("NavLink",{attrs:{page:"/recipes"}}),r("NavLink",{attrs:{page:"/cookbooks"}})],1),r("hr",{staticClass:"d-lg-none"}),this.$parent.user?r("ul",{staticClass:"navbar-nav"},[r("NavLink",{attrs:{page:"/profile",exact:"true",text:this.$parent.user.username}}),r("li",{staticClass:"nav-item"},[r("a",{staticClass:"nav-link",attrs:{href:"#"},on:{click:function(t){return t.preventDefault(),e.$emit("logout")}}},[e._v("Log Out")])])],1):r("ul",{staticClass:"navbar-nav"},[r("li",{staticClass:"nav-item"},[r("a",{staticClass:"nav-link",attrs:{href:"/login"},on:{click:function(t){return t.preventDefault(),e.$emit("show-login")}}},[e._v("Log In")])]),r("li",{staticClass:"navbar-text d-none d-lg-inline-block"},[e._v("or")]),r("li",{staticClass:"nav-item"},[r("a",{staticClass:"nav-link",attrs:{href:"/register"},on:{click:function(t){return t.preventDefault(),e.$emit("show-register")}}},[e._v("Create Account")])])])])])])}),i=[function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("button",{staticClass:"navbar-toggler",attrs:{type:"button","data-toggle":"collapse","data-target":"#navbarNav","aria-controls":"navbarNav","aria-expanded":"false","aria-label":"Toggle navigation"}},[r("span",{staticClass:"navbar-toggler-icon"})])}],l=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("router-link",{attrs:{to:e.page},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.href,s=t.route,n=t.navigate,o=t.isExactActive,i=t.isActive;return[r("li",{staticClass:"nav-item",class:{active:e.exact?o:i}},[r("a",{staticClass:"nav-link",attrs:{href:a},on:{click:n}},[e._v(e._s(e.text||s.name))])])]}}])})},c=[],u={name:"NavLink",props:["page","exact","text"]},m=u,v=r("2877"),d=Object(v["a"])(m,l,c,!1,null,null,null),g=d.exports,f={name:"Header",components:{NavLink:g},methods:{loggedIn:function(){return Boolean(localStorage.getItem("token"))}}},p=f,h=Object(v["a"])(p,o,i,!1,null,"f9fbca36",null),b=h.exports,_=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("nav",{staticClass:"navbar fixed-bottom navbar-dark bg-dark"},[r("div",{staticClass:"container justify-content-between"},[e._m(0),r("span",{staticClass:"navbar-text"},[e._v("©2020"+e._s(2020===(new Date).getFullYear()?"":"-"+(new Date).getFullYear()))])])])},C=[function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"navbar-nav"},[r("span",{staticClass:"nav-item"},[r("a",{staticClass:"nav-link",attrs:{href:"https://727021.github.io",target:"_blank"}},[r("i",{staticClass:"fab fa-github"})])])])}],k={},F=Object(v["a"])(k,_,C,!1,null,null,null),w=F.exports,x=r("bc3a"),y=r.n(x),$=r("14b7"),P=r("f90c"),E=function(){var e=localStorage.getItem("token");return e?{headers:{Authorization:"Bearer ".concat(e)}}:void 0},L={get:function(e){return y.a.get(e,E())},post:function(e,t){return y.a.post(e,t,E())},put:function(e,t){return y.a.put(e,t,E())},delete:function(e){return y.a.delete(e,E())}},O="/api/auth",j={login:function(e,t){var r=Object(P["isEmail"])(e||"")?{email:e,password:t}:{username:e,password:t};return L.put(O,r).then((function(e){var t=e.data;return Promise.resolve({status:200,data:t})})).catch((function(e){var t=e.response,r=t.status,a=t.data;return Promise.resolve({status:r,data:a})}))},register:function(e,t,r,a,s,n){return L.post(O,{username:e,email:t,firstname:r,lastname:a,password:s,confirm:n}).then((function(e){var t=e.data;return Promise.resolve({status:201,data:t})})).catch((function(e){var t=e.response,r=t.status,a=t.data;return Promise.resolve({status:r,data:a})}))},logout:function(){return L.delete(O).then((function(){return Promise.resolve()})).catch((function(){return Promise.resolve()}))}},N="/api/user",S={getUser:function(e){return L.get("".concat(N).concat(e?"/".concat(e):"")).then((function(e){var t=e.data;return Promise.resolve({status:200,data:t})})).catch((function(e){var t=e.response,r=t.status,a=t.data;return Promise.resolve({status:r,data:a})}))}},R={name:"app",components:{Header:b,Footer:w},data:function(){return{user:void 0,loginForm:{username:"",password:"",error:null},registerForm:{username:{value:"",error:null},email:{value:"",error:null},firstname:{value:"",error:null},lastname:{value:"",error:null},password:{value:"",error:null},confirm:{value:"",error:null}},loginVisible:!1,registerVisible:!1}},methods:{showLogin:function(){this.hideRegister(),this.loginVisible=!0},showRegister:function(){this.hideLogin(),this.registerVisible=!0},hideLogin:function(){for(var e in this.loginVisible=!1,this.loginForm)this.loginForm[e]=void 0},hideRegister:function(){for(var e in this.registerVisible=!1,this.registerForm)this.registerForm[e].error=null,this.registerForm[e].value=""},login:function(){var e=this;j.login(this.loginForm.username,this.loginForm.password).then((function(t){var r=t.status,a=t.data;switch(r){case 200:localStorage.setItem("token",a.token),e.user=Object($["decode"])(a.token),e.hideLogin();break;case 401:e.hideLogin(),e.getUser();break;case 422:console.log(a),e.loginForm.error=a.error||"Invalid Login";break;default:e.hideLogin(),e._500();break}})).catch((function(t){console.error(t),e.hideLogin(),e._500()}))},register:function(){var e=this;j.register(this.registerForm.username.value,this.registerForm.email.value,this.registerForm.firstname.value,this.registerForm.lastname.value,this.registerForm.password.value,this.registerForm.confirm.value).then((function(t){var r=t.status,a=t.data;switch(console.log(r,a),r){case 201:e.showLogin(),e.loginForm.username=a.username;break;case 401:e.hideRegister(),e.getUser();break;case 422:var s=function(t){e.registerForm[t].error=(a.errors.find((function(e){return e.param===t}))||{msg:null}).msg};for(var n in e.registerForm)s(n);break;default:e.hideRegister(),e._500();break}})).catch((function(t){console.error(t),e.hideLogin(),e._500()}))},logout:function(){var e=this;j.logout().catch((function(t){console.error(t),e.hideLogin(),e._500()})).finally((function(){e.user=void 0,localStorage.removeItem("token"),e.$router.push("/")}))},getUser:function(){var e=this;S.getUser().then((function(t){var r=t.status,a=t.data;switch(r){case 200:e.user=a;break;default:e.hideRegister(),e._500();break}})).catch((function(t){console.error(t),e.hideLogin(),e._500()}))},_500:function(){this.$router.push("/500")}},mounted:function(){var e=this;this.getUser(),this.$router.onError((function(t){"Not logged in"===t.message&&e.showLogin()}))}},A=R,I=(r("034f"),Object(v["a"])(A,s,n,!1,null,null,null)),D=I.exports,U=(r("b0c0"),r("8c4f")),V=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},H=[function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"container"},[r("h1",[e._v("Home")])])}],M={name:"Home"},T=M,B=Object(v["a"])(T,V,H,!1,null,null,null),J=B.exports,Y=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},z=[function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"container"},[r("h1",[e._v("Profile")])])}],W={name:"Profile"},q=W,G=Object(v["a"])(q,Y,z,!1,null,null,null),K=G.exports,Q=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},X=[function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"container"},[r("h1",[e._v("Recipes")])])}],Z={name:"Recipes"},ee=Z,te=Object(v["a"])(ee,Q,X,!1,null,null,null),re=te.exports,ae=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},se=[function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"container"},[r("h1",[e._v("Recipe")])])}],ne={name:"Recipe"},oe=ne,ie=Object(v["a"])(oe,ae,se,!1,null,null,null),le=ie.exports,ce=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},ue=[function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"container"},[r("h1",[e._v("Cookbooks")])])}],me={name:"Cookbooks"},ve=me,de=Object(v["a"])(ve,ce,ue,!1,null,null,null),ge=de.exports,fe=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},pe=[function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"container"},[r("h1",[e._v("Cookbook")])])}],he={name:"Cookbook"},be=he,_e=Object(v["a"])(be,fe,pe,!1,null,null,null),Ce=_e.exports,ke=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},Fe=[function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"container text-center mt-2"},[r("h1",[e._v("Server Error")]),r("p",[e._v("It looks like we ran into an unexpected error. Sorry for any inconvenience. We'll get that fixed as soon as possible.")])])}],we={name:"ServerError"},xe=we,ye=Object(v["a"])(xe,ke,Fe,!1,null,null,null),$e=ye.exports,Pe=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"container mt-2 text-center"},[r("h1",[e._v("404 - Page Not Found")]),r("p",[e._v(" Looks like the page at "),r("code",[e._v(e._s(this.$route.params.pathMatch))]),e._v(" doesn't exist! ")])])},Ee=[],Le={name:"PageNotFound"},Oe=Le,je=Object(v["a"])(Oe,Pe,Ee,!1,null,null,null),Ne=je.exports;a["a"].use(U["a"]);var Se=[{path:"/",name:"Home",component:J},{path:"/profile",name:"Profile",component:K,meta:{needsAuth:!0}},{path:"/recipes",name:"Recipes",component:re,meta:{needsAuth:!0}},{path:"/recipes/:rid",name:"Recipe",component:le,meta:{needsAuth:!0}},{path:"/cookbooks",name:"Cookbooks",component:ge,meta:{needsAuth:!0}},{path:"/cookbooks/:cid",name:"Cookbook",component:Ce,meta:{needsAuth:!0}},{path:"/500",name:"500",component:$e},{path:"*",name:"404",component:Ne}],Re=new U["a"]({routes:Se});Re.beforeEach((function(e,t,r){e.meta.needsAuth&&!localStorage.getItem("token")?r(new Error("Not logged in")):r()})),Re.afterEach((function(e,t){document.title=e.name+" - CookShare"}));var Ae=Re;a["a"].config.productionTip=!1,new a["a"]({router:Ae,render:function(e){return e(D)}}).$mount("#app")},6:function(e,t){},7:function(e,t){},8:function(e,t){},"85ec":function(e,t,r){},9:function(e,t){}});
//# sourceMappingURL=app.ee45f5b1.js.map