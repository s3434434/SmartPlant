(this.webpackJsonpdemeter=this.webpackJsonpdemeter||[]).push([[12],{111:function(e,t,n){},138:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return l}));var a=n(4),i=n(1),r=n(44),c=n.n(r),s=(n(111),n(0));function l(e){var t=e.getLogin,r=e.wideView,l=Object(i.lazy)((function(){return n.e(3).then(n.bind(null,52))})),o=Object(i.useState)("Loading plants..."),h=Object(a.a)(o,2),u=h[0],d=h[1];return Object(i.useEffect)((function(){document.title="Plants | Demeter - The plant meter";var e=t();if(null!==e){var n=e.token;e.admin?c.a.get("https://smart-plant.azurewebsites.net/api/Admin/Plants",{headers:{Authorization:"Bearer ".concat(n)}}).then((function(e){var t=e.data;if(t.length>0){var a=t.sort((function(e,t){var n=e.name,a=t.name;return n<a?-1:n>a?1:0}));c.a.get("https://smart-plant.azurewebsites.net/api/Admin/Users",{headers:{Authorization:"Bearer ".concat(n)}}).then((function(e){e.data.forEach((function(e){a.forEach((function(t){e.id===t.userID&&(t.email=e.email)}))})),d(a)})).catch((function(e){d("There was an error retrieving the plant data. Please try again later.")}))}else d("No current plants.")})).catch((function(e){d("There was an error retrieving the plant data. Please try again later.")})):window.location.pathname="/"}else window.location.pathname="/"}),[]),Object(s.jsxs)("section",{children:[Object(s.jsx)("h1",{className:"text-center gold",children:"Plants"}),"string"===typeof u?Object(s.jsx)("div",{className:r?"text-center mt-3":"text-center mt-3 mb-2",style:{color:"white"},children:u}):Object(s.jsx)(i.Suspense,{fallback:Object(s.jsx)("div",{}),children:Object(s.jsx)(l,{items:u,itemID:"plantID",heading1:"Name",heading2:"Email",itemTitle1:"name",itemTitle2:"email",path:"plant-admin",wideView:r})})]})}}}]);
//# sourceMappingURL=12.23228dfb.chunk.js.map