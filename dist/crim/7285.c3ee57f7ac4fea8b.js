"use strict";(self.webpackChunkcrim=self.webpackChunkcrim||[]).push([[7285],{7285:(k,E,n)=>{n.r(E),n.d(E,{PrasModule:()=>I});var h=n(177),p=n(2510),l=n(4341),g=n(1590),m=n(6721),v=n(4646),c=n(1626),y=n(1413),x=n(668),f=n(1653),t=n(4438),C=n(6554),T=n(970),j=n(671);const b=["pras0100"],D=["scasetypeid"],O=()=>({standalone:!0});function N(i,J){if(1&i&&(t.j41(0,"ng-option",28),t.EFF(1),t.k0s()),2&i){const e=J.$implicit;t.Y8G("value",e.fieldIdValue),t.R7$(),t.JRh(e.fieldNameValue)}}const F=[v.$.childRoutes([{path:"pras1000",component:(()=>{class i{constructor(e,a,r,s,o){this.formBuilder=e,this.http=a,this.SpinnerService=r,this.printReportService=s,this.authService=o,this.title="datatables",this.selectedCasetype="\u0e41\u0e1e\u0e48\u0e07",this.dtOptions={},this.dtTrigger=new y.B,this.loadComponent=!1}ngOnInit(){this.sessData=localStorage.getItem(this.authService.sessJson),this.userData=JSON.parse(this.sessData),this.successHttp();let e=new c.Lr;e=e.set("Content-Type","application/json");var a=JSON.stringify({table_name:"pcase_type",field_id:"case_type",field_name:"case_type_desc",order_by:"case_type ASC",userToken:this.userData.userToken});this.http.post("/"+this.userData.appName+"ApiUTIL/API/getData",a,{headers:e}).subscribe(s=>{let o=JSON.parse(JSON.stringify(s));this.getCaseType=o,this.selCaseType=this.userData.defaultCaseType},s=>{});var r=JSON.stringify({table_name:"passet_title",field_id:"asset_type",field_name:"asset_group_title",userToken:this.userData.userToken});console.log(r),this.http.post("/"+this.userData.appName+"ApiUTIL/API/getData",r,{headers:e}).subscribe(s=>{console.log("xxxxxxxxxxx"+s);let o=JSON.parse(JSON.stringify(s));this.getAssetTitle=o},s=>{})}successHttp(){let e=new c.Lr;e=e.set("Content-Type","application/json");var a=JSON.stringify({userToken:this.userData.userToken,url_name:"pras0100"});return new Promise((s,o)=>{this.http.post("/"+this.userData.appName+"Api/API/authen",a,{headers:e}).toPromise().then(u=>{let d=JSON.parse(JSON.stringify(u));console.log(d),this.programName=d.programName,this.defaultCaseType=d.defaultCaseType,this.defaultCaseTypeText=d.defaultCaseTypeText,this.defaultTitle=d.defaultTitle,this.defaultRedTitle=d.defaultRedTitle,s(u)},u=>{o(u)})})}rerender(){this.dtElement.dtInstance.then(e=>{e.destroy(),this.dtTrigger.next(null)})}ngAfterViewInit(){myExtObject.callCalendar(),this.dtTrigger.next(null)}ngOnDestroy(){this.dtTrigger.unsubscribe()}ClearAll(){window.location.reload()}printReport(){var a=JSON.stringify({pcase_type:this.selCaseType,pdate_start:myExtObject.conDate(f("#txt_date_start").val()),pdate_end:myExtObject.conDate(f("#txt_date_end").val()),passet_title:this.passet_title});console.log(a),this.printReportService.printReport("ras0100",a)}changeCaseType(e){this.selCaseType=e}static#t=this.\u0275fac=function(a){return new(a||i)(t.rXU(l.ok),t.rXU(c.Qq),t.rXU(C.ex),t.rXU(T.h),t.rXU(j.u))};static#e=this.\u0275cmp=t.VBU({type:i,selectors:[["app-pras0100"],["ngbd-popover-basic"],["ngbd-popover-tplcontent"]],viewQuery:function(a,r){if(1&a&&(t.GBs(b,7),t.GBs(x._,5),t.GBs(D,5)),2&a){let s;t.mGM(s=t.lsd())&&(r.pras0100=s.first),t.mGM(s=t.lsd())&&(r.dtElement=s.first),t.mGM(s=t.lsd())&&(r.scasetypeid=s.first)}},decls:44,vars:5,consts:[["pras0100",""],["sType",""],["id","div-wraper",2,"width","100%","height","100%"],[1,"content",2,"padding","10px"],[1,"card","card-info",2,"box-shadow","none !important"],[1,"",2,"height","40px","border-radius","4px","border","1px solid #17a2b8 !important","background-color","#e1f6f9"],[2,"float","left","margin-top","6px"],[1,"fa","fa-folder-open-o",2,"font-size","24px","margin-left","8px"],[2,"font-size","16px","margin-left","5px"],["id","myForm",1,"form-horizontal"],[1,"card-body"],["align","center",1,"card",2,"box-shadow","none !important","padding","5px"],["width","100%","border","0","cellspacing","2","cellpadding","2",1,"form_table"],["align","center",2,"width","60%","margin","0 auto"],["align","right"],[2,"float","left","margin-left","3px"],["name","txt_date_start","id","txt_date_start","type","text","placeholder","\u0e48\u0e27\u0e27/\u0e14\u0e14/\u0e1b\u0e1b\u0e1b\u0e1b","value","",1,"form-control","jcalendar","date_start",2,"width","120px"],["onClick","$('.date_start').focus();",1,"fa","fa-calendar",2,"font-size","16px"],[2,"float","left","margin-left","15px"],[2,"float","left"],["name","txt_date_end","id","txt_date_end","type","text","placeholder","\u0e27\u0e27/\u0e14\u0e14/\u0e1b\u0e1b\u0e1b\u0e1b","value","",1,"form-control","jcalendar","date_end",2,"width","120px"],["onClick","$('.date_end').focus();",1,"fa","fa-calendar",2,"font-size","16px"],["align","left"],[2,"width","150px",3,"ngModelChange","ngModel","ngModelOptions"],[3,"value",4,"ngFor","ngForOf"],["align","center",1,"card-footer"],["type","button",1,"btn","btn-info",2,"margin-left","5px",3,"click"],["type","reset",1,"btn","btn-warning",2,"margin-left","5px","color","white",3,"click"],[3,"value"]],template:function(a,r){if(1&a){const s=t.RV6();t.nrm(0,"app-menu"),t.j41(1,"div",2)(2,"div",3)(3,"div",4)(4,"div",5)(5,"div",6),t.nrm(6,"i",7),t.j41(7,"span",8),t.EFF(8),t.k0s()()()(),t.j41(9,"form",9,0)(11,"div",10)(12,"div",11)(13,"table",12)(14,"div",13)(15,"tr")(16,"td",14),t.EFF(17,"\u0e23\u0e31\u0e1a\u0e2b\u0e25\u0e31\u0e01\u0e1b\u0e23\u0e30\u0e01\u0e31\u0e19\u0e15\u0e31\u0e49\u0e07\u0e41\u0e15\u0e48\u0e27\u0e31\u0e19\u0e17\u0e35\u0e48 :\xa0"),t.k0s(),t.j41(18,"td")(19,"div",15),t.nrm(20,"input",16),t.k0s(),t.j41(21,"div",15),t.nrm(22,"i",17),t.k0s(),t.j41(23,"div",18),t.EFF(24,"\xa0\u0e16\u0e36\u0e07\xa0\xa0"),t.k0s(),t.j41(25,"div",19),t.nrm(26,"input",20),t.k0s(),t.j41(27,"div",15),t.nrm(28,"i",21),t.k0s()()(),t.j41(29,"tr")(30,"td",14),t.EFF(31,"\u0e04\u0e33\u0e19\u0e33\u0e2b\u0e19\u0e49\u0e32\u0e2b\u0e25\u0e31\u0e01\u0e17\u0e23\u0e31\u0e1e\u0e22\u0e4c\u0e41\u0e22\u0e01\u0e40\u0e01\u0e47\u0e1a :\xa0"),t.k0s(),t.j41(32,"td",22)(33,"div",15)(34,"ng-select",23,1),t.mxI("ngModelChange",function(u){return t.eBV(s),t.DH7(r.passet_title,u)||(r.passet_title=u),t.Njj(u)}),t.DNE(36,N,2,2,"ng-option",24),t.k0s()()()()(),t.j41(37,"div"),t.EFF(38,"\xa0"),t.k0s()()(),t.j41(39,"div",25)(40,"button",26),t.bIt("click",function(){return t.eBV(s),t.Njj(r.printReport())}),t.EFF(41,"\u0e1e\u0e34\u0e21\u0e1e\u0e4c\u0e23\u0e32\u0e22\u0e07\u0e32\u0e19"),t.k0s(),t.j41(42,"button",27),t.bIt("click",function(){return t.eBV(s),t.Njj(r.ClearAll())}),t.EFF(43,"\u0e25\u0e49\u0e32\u0e07\u0e2b\u0e19\u0e49\u0e32\u0e08\u0e2d"),t.k0s()()()()()()}2&a&&(t.R7$(8),t.JRh(r.programName),t.R7$(26),t.R50("ngModel",r.passet_title),t.Y8G("ngModelOptions",t.lJ4(4,O)),t.R7$(2),t.Y8G("ngForOf",r.getAssetTitle))},dependencies:[h.Sq,l.qT,l.BC,l.cb,l.vS,l.cV,p.vr,p.xt],styles:[".btn-info[_ngcontent-%COMP%]{color:#fff!important}.modal-content[_ngcontent-%COMP%]{width:600px!important;min-height:200px!important;max-height:600px!important;height:auto!important}"]})}return i})()}])];let S=(()=>{class i{static#t=this.\u0275fac=function(a){return new(a||i)};static#e=this.\u0275mod=t.$C({type:i});static#a=this.\u0275inj=t.G2t({imports:[m.iI.forChild(F),m.iI]})}return i})();var A=n(8603),M=n(6850),R=n(9001),P=n(5535);let I=(()=>{class i{static#t=this.\u0275fac=function(a){return new(a||i)};static#e=this.\u0275mod=t.$C({type:i});static#a=this.\u0275inj=t.G2t({imports:[h.MD,S,l.YN,l.X1,g.G,A.jL,M.RI,R.ModalModule,P.CaseModule,p.MQ]})}return i})()}}]);