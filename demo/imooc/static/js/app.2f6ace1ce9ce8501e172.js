webpackJsonp([3],{100:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=e(46),a=e.n(o),r=e(45),c=e.n(r),s=e(19),i=e.n(s),u=e(23),p=e(4),l=e(92),d=e(11);n.default={name:"app",methods:i()({},e.i(d.a)({setUserState:p.a}),{getsessionID:function(t){var n=this;return c()(a.a.mark(function o(){var r;return a.a.wrap(function(o){for(;;)switch(o.prev=o.next){case 0:if(e.i(u.a)(p.a)&&e.i(u.b)(p.b)){o.next=15;break}return o.prev=1,o.next=4,l.a();case 4:r=o.sent,1===r.state?(console.log("服务器状态未过期，自动登录"),n.setUserState(r.result),n.$router.push(t)):(console.log("服务器状态已过期，请重新登录"),n.$router.push("/account")),o.next=13;break;case 8:o.prev=8,o.t0=o.catch(1),console.log("服务器状态已过期，请重新登录"),n.$router.push("/account"),console.log(o.t0);case 13:o.next=18;break;case 15:console.log("本地数据完整，自动登录"),n.setUserState({userinfo:JSON.parse(e.i(u.b)(p.b))}),n.$router.push(t);case 18:case"end":return o.stop()}},o,n,[[1,8]])}))()},askForSessionID:function(t){var n=this;return c()(a.a.mark(function e(){var o;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,l.a();case 3:o=e.sent,1===o.state?(console.log("服务器状态未过期，自动登录"),n.setUserState(o.result),n.$router.push(t)):(console.log("服务器状态已过期，请重新登录"),n.$router.push("/account")),e.next=12;break;case 7:e.prev=7,e.t0=e.catch(0),console.log("服务器状态已过期，请重新登录"),n.$router.push("/account"),console.log(e.t0);case 12:case"end":return e.stop()}},e,n,[[0,7]])}))()}}),created:function(){this.getsessionID("/index")},watch:{$route:function(t,n,e){-1!==["/message"].indexOf(t.path)&&this.askForSessionID(t.path)}}}},101:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=e(19),a=e.n(o),r=e(11),c=e(4);n.default={name:"login",data:function(){return{accountTitle:"欢迎登录慕课网",account:"",password:"",cansee:!1}},computed:{},methods:a()({},e.i(r.a)({setAccountTitle:c.c}),{clearAccountInput:function(){this.account=""},togglePasswordCansee:function(){this.cansee=!this.cansee}}),watch:{},created:function(){this.setAccountTitle(this.accountTitle)}}},102:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=e(19),a=e.n(o),r=e(11),c=e(4);n.default={name:"reg",data:function(){return{accountTitle:"注册慕课网账号",account:"",password:"",cansee:!1}},computed:{},methods:a()({},e.i(r.a)({setAccountTitle:c.c}),{clearAccountInput:function(){this.account=""},togglePasswordCansee:function(){this.cansee=!this.cansee}}),watch:{},created:function(){this.setAccountTitle(this.accountTitle)}}},133:function(t,n){},134:function(t,n){},135:function(t,n){},140:function(t,n,e){function o(t){e(135)}var a=e(17)(e(101),e(144),o,"data-v-7d7acf4a",null);t.exports=a.exports},141:function(t,n,e){function o(t){e(134)}var a=e(17)(e(102),e(143),o,"data-v-439ac286",null);t.exports=a.exports},142:function(t,n){t.exports={render:function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{attrs:{id:"app"}},[e("router-view")],1)},staticRenderFns:[]}},143:function(t,n){t.exports={render:function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{staticClass:"login"},[e("div",{staticClass:"input-wrapper"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.account,expression:"account"}],attrs:{type:"text",name:"account",placeholder:"输入注册邮箱"},domProps:{value:t.account},on:{input:function(n){n.target.composing||(t.account=n.target.value)}}}),t._v(" "),t.account?e("span",{on:{click:t.clearAccountInput}},[e("i",{staticClass:"iconfont icon-guanbifuzhi"})]):t._e()]),t._v(" "),e("div",{staticClass:"input-wrapper"},[t.cansee?e("input",{directives:[{name:"model",rawName:"v-model",value:t.password,expression:"password"}],attrs:{type:"text",name:"password",placeholder:"密码"},domProps:{value:t.password},on:{input:function(n){n.target.composing||(t.password=n.target.value)}}}):e("input",{directives:[{name:"model",rawName:"v-model",value:t.password,expression:"password"}],attrs:{type:"password",name:"password",placeholder:"密码"},domProps:{value:t.password},on:{input:function(n){n.target.composing||(t.password=n.target.value)}}}),t._v(" "),e("span",{on:{click:t.togglePasswordCansee}},[e("i",{class:t.cansee?"icon-see iconfont":"icon-eye_forbid iconfont"})])]),t._v(" "),e("button",{attrs:{type:"button",name:"button"}},[t._v("注册")]),t._v(" "),e("router-link",{attrs:{to:"/account/login"}},[e("p",{staticClass:"tips"},[t._v("已有慕课网账号？去登录")])])],1)},staticRenderFns:[]}},144:function(t,n){t.exports={render:function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{staticClass:"login"},[e("div",{staticClass:"input-wrapper"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.account,expression:"account"}],attrs:{type:"text",name:"account",placeholder:"手机号/邮箱"},domProps:{value:t.account},on:{input:function(n){n.target.composing||(t.account=n.target.value)}}}),t._v(" "),t.account?e("span",{on:{click:t.clearAccountInput}},[e("i",{staticClass:"iconfont icon-guanbifuzhi"})]):t._e()]),t._v(" "),e("div",{staticClass:"input-wrapper"},[t.cansee?e("input",{directives:[{name:"model",rawName:"v-model",value:t.password,expression:"password"}],attrs:{type:"text",name:"password",placeholder:"密码"},domProps:{value:t.password},on:{input:function(n){n.target.composing||(t.password=n.target.value)}}}):e("input",{directives:[{name:"model",rawName:"v-model",value:t.password,expression:"password"}],attrs:{type:"password",name:"password",placeholder:"密码"},domProps:{value:t.password},on:{input:function(n){n.target.composing||(t.password=n.target.value)}}}),t._v(" "),e("span",{on:{click:t.togglePasswordCansee}},[e("i",{class:t.cansee?"icon-see iconfont":"icon-eye_forbid iconfont"})])]),t._v(" "),e("button",{attrs:{type:"button",name:"button"}},[t._v("登录")]),t._v(" "),e("router-link",{attrs:{to:"/account/reg"}},[e("p",{staticClass:"tips"},[t._v("注册")])])],1)},staticRenderFns:[]}},23:function(t,n,e){"use strict";e.d(n,"c",function(){return o}),e.d(n,"b",function(){return a}),e.d(n,"d",function(){return r}),e.d(n,"a",function(){return c});var o=function(t,n){return t&&n?void window.localStorage.setItem("imooc"+t,n):null},a=function(t){return t?window.localStorage.getItem("imooc"+t):null},r=function(t,n){return t?n?void window.sessionStorage.setItem("imooc"+t,n):n:null},c=function(t){return t?window.sessionStorage.getItem("imooc"+t):null}},4:function(t,n,e){"use strict";e.d(n,"d",function(){return o}),e.d(n,"c",function(){return a}),e.d(n,"e",function(){return r}),e.d(n,"a",function(){return c}),e.d(n,"b",function(){return s});var o="INDEX_SWIPER",a="ACCOUNT_TITLE",r="SOURCE_URL",c="USER_STATE",s="USER_INFO"},43:function(t,n,e){"use strict";e.d(n,"b",function(){return o}),e.d(n,"a",function(){return a});var o={state:1,result:[{url:"xx",img:"http://img.mukewang.com/5941f480000133f207500250.jpg"},{url:"yy",img:"http://img.mukewang.com/5941e6500001cc6007500250.jpg"},{url:"zz",img:"http://img.mukewang.com/593e52e70001eba207500250.jpg"}]},a={state:1,result:{sessionID:"1234567890",userinfo:{username:"admin"}}}},55:function(t,n){!function(t,n,e){var o=t.documentElement,a="orientationchange"in window?"orientationchange":"resize",r=function(){var t=o.clientWidth;t&&(o.style.fontSize=t/750*100+"px")};t.addEventListener&&(n.addEventListener(a,r,!1),t.addEventListener("DOMContentLoaded",r,!1))}(document,window)},56:function(t,n,e){"use strict";var o=e(16),a=e(145);o.a.use(a.a),n.a=new a.a({routes:[{path:"/account",name:"account",component:function(t){return e.e(1).then(function(){var n=[e(149)];t.apply(null,n)}.bind(this)).catch(e.oe)},children:[{path:"/account/",redirect:"/account/login"},{path:"/account/login",name:"login",component:e(140)},{path:"/account/reg",name:"reg",component:e(141)}]},{path:"/index",name:"index",component:function(t){return e.e(0).then(function(){var n=[e(150)];t.apply(null,n)}.bind(this)).catch(e.oe)}}]})},57:function(t,n,e){"use strict";var o=e(16),a=e(11),r=e(99),c=e(95),s=e(94),i=e(98),u=e(97),p=e(96);o.a.use(a.b),n.a=new a.b.Store({state:r.a,getters:c.a,actions:s.a,mutations:i.a,modules:{index:u.a,account:p.a}})},58:function(t,n){},59:function(t,n){},60:function(t,n){},62:function(t,n,e){function o(t){e(133)}var a=e(17)(e(100),e(142),o,null,null);t.exports=a.exports},90:function(t,n,e){"use strict";e.d(n,"a",function(){return l});var o=e(46),a=e.n(o),r=e(44),c=e.n(r),s=e(45),i=e.n(s),u=e(23),p=this,l=function(t,n){return function(o){var r=o.commit,s=500,l=0;r(t,JSON.parse(e.i(u.b)(t)));var d=function(){var o=i()(a.a.mark(function o(){var i;return a.a.wrap(function(o){for(;;)switch(o.prev=o.next){case 0:return o.prev=0,o.next=3,n();case 3:if(i=o.sent,c()(i.result)!==e.i(u.b)(t)){o.next=6;break}return o.abrupt("return");case 6:1===i.state&&(r(t,i.result),e.i(u.c)(t,c()(i.result))),o.next=12;break;case 9:o.prev=9,o.t0=o.catch(0),!e.i(u.b)(t)&&l<6&&setTimeout(function(){d(),s*=3,l++},s);case 12:case"end":return o.stop()}},o,p,[[0,9]])}));return function(){return o.apply(this,arguments)}}();d()}}},91:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=e(16),a=e(62),r=e.n(a),c=e(56),s=e(57),i=e(61),u=e.n(i),p=e(54),l=e.n(p),d=e(55),f=(e.n(d),e(60)),v=(e.n(f),e(58)),m=(e.n(v),e(59));e.n(m);l.a.defaults.withCredentials=!0,o.a.config.productionTip=!1,o.a.$http=l.a,"addEventListener"in document&&document.addEventListener("DOMContentLoaded",function(){u.a.attach(document.body)},!1),new o.a({el:"#app",router:c.a,store:s.a,template:"<App/>",components:{App:r.a}})},92:function(t,n,e){"use strict";e.d(n,"a",function(){return c});var o=e(24),a=e.n(o),r=e(43),c=function(t){return new a.a(function(t,n){var e=Math.random();setTimeout(function(){e>.5?t(r.a):n("fail")},10)})}},93:function(t,n,e){"use strict";var o=e(24),a=e.n(o),r=e(43),c=function(){return new a.a(function(t,n){var e=Math.random();setTimeout(function(){e>.5?t(r.b):n("fail")},10)})};n.a={getIndexSwiper:c}},94:function(t,n,e){"use strict";var o=e(4),a=function(t,n){(0,t.commit)(o.e,n)};n.a={setSourceUrl:a}},95:function(t,n,e){"use strict";var o=function(t){return t.sourceUrl},a=function(t){return t.userinfo};n.a={sourceUrl:o,userinfo:a}},96:function(t,n,e){"use strict";var o=e(25),a=e.n(o),r=e(4),c={accountTitle:"欢迎登录慕课网"},s={accountTitle:function(t){return t.accountTitle}},i={},u=a()({},r.c,function(t,n){t.accountTitle=n});n.a={state:c,getters:s,actions:i,mutations:u}},97:function(t,n,e){"use strict";var o=e(25),a=e.n(o),r=e(93),c=e(4),s=e(90),i={indexSwiper:null},u={indexSwiper:function(t){return t.indexSwiper}},p={getIndexSwiper:e.i(s.a)(c.d,r.a.getIndexSwiper)},l=a()({},c.d,function(t,n){t.indexSwiper=n});n.a={state:i,getters:u,actions:p,mutations:l}},98:function(t,n,e){"use strict";var o,a=e(25),r=e.n(a),c=e(44),s=e.n(c),i=e(4),u=e(23);n.a=(o={},r()(o,i.e,function(t,n){t.sourceUrl=n}),r()(o,i.a,function(t,n){var o=n.sessionID,a=n.userinfo;a&&(t.userinfo=a,e.i(u.c)(i.b,s()(a))),o&&e.i(u.d)(i.a,o)}),o)},99:function(t,n,e){"use strict";n.a={sourceUrl:"/index"}}},[91]);
//# sourceMappingURL=app.2f6ace1ce9ce8501e172.js.map