(this.webpackJsonpdemeter=this.webpackJsonpdemeter||[]).push([[29],{107:function(e,t,a){},134:function(e,t,a){"use strict";a.r(t),a.d(t,"default",(function(){return m}));var n=a(4),c=a(1),r=a(46),l=a.n(r),s=a(44),o=a.n(s),i=(a(107),a(0));function m(e){var t=e.getLogin,a=e.wideView,r=Object(c.useState)({EmailSubject:"",EmailBody:""}),s=Object(n.a)(r,2),m=s[0],u=s[1],d=Object(c.useState)(!1),b=Object(n.a)(d,2),j=b[0],p=b[1],h=Object(c.useState)("-"),f=Object(n.a)(h,2),x=f[0],O=f[1];Object(c.useEffect)((function(){document.title="Support | Demeter - The plant meter",null===t()&&(window.location.pathname="/")}),[]);var v=function(e){var t=e.target,a=l.a.cloneDeep(m);a[t.name]=t.value,u(a)};return Object(i.jsxs)("section",{children:[Object(i.jsx)("h1",{className:"gold text-center",children:"Support"}),Object(i.jsxs)("form",{className:a?"w-25 m-auto mt-4":"m-auto mt-4 px-2",onSubmit:function(e){e.preventDefault(),O("Please wait..."),p(!0);var a=t();if(null!==a){var n=a.token;o.a.post("https://smart-plant.azurewebsites.net/api/user/contactsupport",m,{headers:{Authorization:"Bearer ".concat(n)}}).then((function(e){window.location.pathname="/support-successful"})).catch((function(e){var t="Server error. Please try again later.",a=e.response.data.errors;void 0!==a.EmailSubject?t=a.EmailSubject[0]:void 0!==a.EmailBody&&(t=a.EmailBody[0]),O(t)}))}else O("You are not logged in."),setTimeout((function(){window.location.pathname="/"}),500)},children:[Object(i.jsx)("label",{className:"form-label gold",htmlFor:"EmailSubject",children:"Subject"}),Object(i.jsx)("input",{className:"form-control",name:"EmailSubject",type:"text",value:m.EmailSubject,onChange:v,required:!0}),Object(i.jsx)("label",{className:"form-label mt-3 gold",htmlFor:"EmailBody",children:"Message"}),Object(i.jsx)("textarea",{className:"form-control",name:"EmailBody",value:m.EmailBody,onChange:v,required:!0}),j?Object(i.jsx)("div",{className:"text-center mt-3",children:Object(i.jsx)("span",{children:x})}):Object(i.jsx)("div",{className:"hidden-field mt-3",children:Object(i.jsx)("span",{children:x})}),Object(i.jsx)("div",{className:a?"text-center mt-3":"text-center mt-3 mb-2",children:Object(i.jsx)("button",{className:"btn btn-primary",type:"submit",children:"Send"})})]})]})}}}]);
//# sourceMappingURL=29.0343ff47.chunk.js.map