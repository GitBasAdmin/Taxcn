"use strict";(self.webpackChunkcrim=self.webpackChunkcrim||[]).push([[9085],{9085:(W,E,u)=>{u.r(E),u.d(E,{PrstModule:()=>Q});var _=u(177),p=u(4341),M=u(1590),N=u(5535),C=u(6721),k=u(4646),g=u(1626),m=u(9960),j=u(1413),y=u(668),h=u(1653),e=u(4438),T=u(6554),b=u(970),v=u(671),D=u(2510),I=u(642);const B=["prst5500"],S=["scasetypeid"],c=()=>({standalone:!0});function x(r,d){1&r&&e.nrm(0,"app-case-header")}function O(r,d){if(1&r&&(e.j41(0,"ng-option",34),e.EFF(1),e.k0s()),2&r){const a=d.$implicit;e.Y8G("value",a.fieldIdValue),e.R7$(),e.SpI("",a.fieldNameValue," ")}}function P(r,d){if(1&r&&(e.j41(0,"ng-option",34),e.EFF(1),e.k0s()),2&r){const a=d.$implicit;e.Y8G("value",a.fieldIdValue),e.R7$(),e.SpI("",a.fieldNameValue," ")}}function R(r,d){if(1&r&&(e.j41(0,"ng-option",34),e.EFF(1),e.k0s()),2&r){const a=d.$implicit;e.Y8G("value",a.fieldIdValue),e.R7$(),e.SpI("",a.fieldNameValue," ")}}function V(r,d){if(1&r&&(e.j41(0,"ng-option",34),e.EFF(1),e.k0s()),2&r){const a=d.$implicit;e.Y8G("value",a.fieldIdValue),e.R7$(),e.SpI("",a.fieldNameValue," ")}}function F(r,d){if(1&r&&(e.j41(0,"ng-option",34),e.EFF(1),e.k0s()),2&r){const a=d.$implicit;e.Y8G("value",a.fieldIdValue),e.R7$(),e.JRh(a.fieldNameValue)}}let A=(()=>{class r{constructor(a,i,t,s,o){this.formBuilder=a,this.http=i,this.SpinnerService=t,this.printReportService=s,this.authService=o,this.title="datatables",this.result=[],this.tmpResult=[],this.selectedCasetype="\u0e41\u0e1e\u0e48\u0e07",this.dtOptions={},this.dtTrigger=new j.B,this.loadComponent=!1}ngOnInit(){this.sessData=localStorage.getItem(this.authService.sessJson),this.userData=JSON.parse(this.sessData),this.successHttp();var a=JSON.stringify({table_name:"pdepartment",field_id:"dep_code",field_name:"dep_name",field_name2:"print_dep_name",userToken:this.userData.userToken});this.http.post("/"+this.userData.appName+"ApiUTIL/API/getData",a).subscribe(i=>{let t=JSON.parse(JSON.stringify(i));this.getDep=t,0!=this.getDep.length&&(this.pcreate_dep_code=this.userData.depCode,this.puser_post=this.userData.depName)},i=>{}),a=JSON.stringify({table_name:"pofficer",field_id:"off_id",field_name:"off_name",userToken:this.userData.userToken}),this.http.post("/"+this.userData.appName+"ApiUTIL/API/getData",a).subscribe(i=>{let t=JSON.parse(JSON.stringify(i));this.getPoffId=t,this.getOffId=t,this.getToId=t,0!=this.getOffId.length&&(this.puser_id=this.userData.userCode,this.off_name=this.userData.offName)},i=>{}),this.getFlag=[{fieldIdValue:1,fieldNameValue:"\u0e1c\u0e25\u0e07\u0e32\u0e19\u0e41\u0e1c\u0e19\u0e01"},{fieldIdValue:2,fieldNameValue:"\u0e1c\u0e25\u0e07\u0e32\u0e19\u0e23\u0e32\u0e22\u0e1a\u0e38\u0e04\u0e04\u0e25"},{fieldIdValue:3,fieldNameValue:"\u0e1c\u0e25\u0e07\u0e32\u0e19\u0e2a\u0e48\u0e07\u0e2a\u0e33\u0e19\u0e27\u0e19"},{fieldIdValue:4,fieldNameValue:"\u0e1c\u0e25\u0e07\u0e32\u0e19\u0e40\u0e1e\u0e34\u0e48\u0e21\u0e40\u0e15\u0e34\u0e21 (\u0e44\u0e21\u0e48\u0e2d\u0e22\u0e39\u0e48\u0e43\u0e19\u0e23\u0e30\u0e1a\u0e1a)"}],this.pflag=3}successHttp(){let a=new g.Lr;a=a.set("Content-Type","application/json");var i=JSON.stringify({userToken:this.userData.userToken,url_name:"prst5500"});return new Promise((s,o)=>{this.http.post("/"+this.userData.appName+"Api/API/authen",i,{headers:a}).toPromise().then(n=>{let l=JSON.parse(JSON.stringify(n));this.programName=l.programName,this.defaultCaseType=l.defaultCaseType,this.defaultCaseTypeText=l.defaultCaseTypeText,this.defaultTitle=l.defaultTitle,this.defaultRedTitle=l.defaultRedTitle,s(n)},n=>{o(n)})})}rerender(){this.dtElement.dtInstance.then(a=>{a.destroy(),this.dtTrigger.next(null)})}ngAfterViewInit(){myExtObject.callCalendar(),this.dtTrigger.next(null)}ngOnDestroy(){this.dtTrigger.unsubscribe()}ClearAll(){window.location.reload()}directiveDate(a,i){this[i]=a}printReport(){const i=new m.sd;if(i.setTitle("\u0e02\u0e49\u0e2d\u0e04\u0e27\u0e32\u0e21\u0e41\u0e08\u0e49\u0e07\u0e40\u0e15\u0e37\u0e2d\u0e19"),myExtObject.conDate(h("#txt_date_start").val()))if(myExtObject.conDate(h("#txt_date_end").val())){typeof this.txt_date_start>"u"&&(this.txt_date_start=""),typeof this.txt_date_end>"u"&&(this.txt_date_end=""),typeof this.pcreate_dep_code>"u"&&(this.pcreate_dep_code=""),typeof this.phead_off_id>"u"&&(this.phead_off_id=""),typeof this.puser_id>"u"&&(this.puser_id="");var t=JSON.stringify({pdate_start:myExtObject.conDate(h("#txt_date_start").val()),pdate_end:myExtObject.conDate(h("#txt_date_end").val()),pcreate_dep_code:this.pcreate_dep_code?this.pcreate_dep_code.toString():"",puser_post:this.puser_post?this.puser_post:"",phead_off_id:this.phead_off_id?this.phead_off_id:"",puser_id:this.puser_id?this.puser_id:"",puser_to_id:this.puser_to_id?this.puser_to_id:"",pflag:this.pflag?this.pflag.toString():""});console.log(t),this.printReportService.printReport("rst5520",t)}else{i.setMessage("\u0e01\u0e23\u0e38\u0e13\u0e32\u0e23\u0e30\u0e1a\u0e38\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e16\u0e36\u0e07\u0e27\u0e31\u0e19\u0e17\u0e35\u0e48"),i.setButtonLabels("\u0e15\u0e01\u0e25\u0e07"),i.setConfig({layoutType:m.z.WARNING});const s=i.openConfirmBox$().subscribe(o=>{s.unsubscribe()})}else{i.setMessage("\u0e01\u0e23\u0e38\u0e13\u0e32\u0e23\u0e30\u0e1a\u0e38\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e15\u0e31\u0e49\u0e07\u0e41\u0e15\u0e48\u0e27\u0e31\u0e19\u0e17\u0e35\u0e48"),i.setButtonLabels("\u0e15\u0e01\u0e25\u0e07"),i.setConfig({layoutType:m.z.WARNING});const s=i.openConfirmBox$().subscribe(o=>{s.unsubscribe()})}}changeCaseType(a){this.selCaseType=a}tabChangeSelect(a,i,t,s){if(typeof i<"u"){if(1==s)var o=i.filter(n=>n.fieldIdValue===t.target.value);else o=i.filter(3==s?l=>l.fieldIdValue===parseInt(t.target.value):l=>l.fieldIdValue===t);this[a]=0!=o.length?o[0].fieldIdValue:null}else this[a]=null}chkUser(){1==this.pChk4?(this.puser_to_id=this.userData.directorId,this.puser_to=this.userData.directorName):(this.puser_to_id=null,this.puser_to=null)}static#e=this.\u0275fac=function(i){return new(i||r)(e.rXU(p.ok),e.rXU(g.Qq),e.rXU(T.ex),e.rXU(b.h),e.rXU(v.u))};static#t=this.\u0275cmp=e.VBU({type:r,selectors:[["app-prst5500"],["ngbd-popover-basic"],["ngbd-popover-tplcontent"]],viewQuery:function(i,t){if(1&i&&(e.GBs(B,7),e.GBs(y._,5),e.GBs(S,5)),2&i){let s;e.mGM(s=e.lsd())&&(t.prst5500=s.first),e.mGM(s=e.lsd())&&(t.dtElement=s.first),e.mGM(s=e.lsd())&&(t.scasetypeid=s.first)}},decls:79,vars:26,consts:[["prst5500",""],["sDep",""],["id","div-wraper",2,"width","100%","height","100%"],[1,"content",2,"padding","10px"],[1,"card","card-info",2,"box-shadow","none !important","border","0px !important"],[1,"",2,"height","40px","border-radius","4px","border","0px solid #17a2b8 !important","background-color","#e1f6f9"],[4,"ngIf"],["id","myForm",1,"form-horizontal"],[1,"card-body"],["align","center",1,"card",2,"box-shadow","none !important","padding","5px"],["width","100%","border","0","cellspacing","2","cellpadding","2",1,"form_table"],["align","right"],["align","left"],[2,"float","left"],["name","txt_date_start","id","txt_date_start","type","text","placeholder","\u0e48\u0e27\u0e27/\u0e14\u0e14/\u0e1b\u0e1b\u0e1b\u0e1b","value","",1,"form-control","jcalendar","date_start",2,"width","120px","height","28px"],[2,"float","left","margin-left","4px","margin-top","5px"],["onClick","$('.date_start').focus();",1,"fa","fa-calendar",2,"font-size","16px"],[2,"float","left","margin-left","8px","margin-top","5px"],["name","txt_date_end","id","txt_date_end","type","text","placeholder","\u0e27\u0e27/\u0e14\u0e14/\u0e1b\u0e1b\u0e1b\u0e1b","value","",1,"form-control","jcalendar","date_end",2,"width","120px","height","28px"],["onClick","$('.date_end').focus();",1,"fa","fa-calendar",2,"font-size","16px"],["width","44.5%","align","right"],["width","56%"],["type","text","name","pcreateDepCode","onkeypress","return (event.charCode >= 48 && event.charCode <= 57) || event.charCode == 46",1,"form-control",2,"width","80px","text-align","center","float","left",3,"ngModelChange","change","ngModel"],[2,"float","left","margin-left","2px"],[2,"width","250px",3,"ngModelChange","change","ngModel","ngModelOptions"],[3,"value",4,"ngFor","ngForOf"],["type","text","name","pheadOffId","onkeypress","return (event.charCode >= 48 && event.charCode <= 57) || event.charCode == 46",1,"form-control",2,"width","80px","text-align","center","float","left",3,"ngModelChange","change","ngModel"],["type","text","name","puserId","onkeypress","return (event.charCode >= 48 && event.charCode <= 57) || event.charCode == 46",1,"form-control",2,"width","80px","text-align","center","float","left",3,"ngModelChange","change","ngModel"],["type","checkbox","name","pChk4",2,"width","15px","height","15px","margin-top","5px",3,"ngModelChange","change","ngModel"],["type","text","name","puserToId","onkeypress","return (event.charCode >= 48 && event.charCode <= 57) || event.charCode == 46",1,"form-control",2,"width","80px","text-align","center","float","left",3,"ngModelChange","change","ngModel"],[2,"width","240px","height","28px",3,"ngModelChange","change","ngModel","ngModelOptions"],["align","center",1,"card-footer"],["type","button",1,"btn","btn-info",2,"margin-left","5px",3,"click"],["type","reset",1,"btn","btn-warning",2,"margin-left","5px","color","white",3,"click"],[3,"value"]],template:function(i,t){if(1&i){const s=e.RV6();e.j41(0,"div",2)(1,"div",3)(2,"div",4)(3,"div",5),e.DNE(4,x,1,0,"app-case-header",6),e.k0s()(),e.j41(5,"form",7,0)(7,"div",8)(8,"div",9)(9,"table",10)(10,"tr")(11,"td",11),e.EFF(12,"\u0e27\u0e31\u0e19\u0e17\u0e35\u0e48\u0e1b\u0e0f\u0e34\u0e1a\u0e31\u0e15\u0e34\u0e07\u0e32\u0e19\u0e15\u0e31\u0e49\u0e07\u0e41\u0e15\u0e48\u0e27\u0e31\u0e19\u0e17\u0e35\u0e48 :\xa0"),e.k0s(),e.j41(13,"td",12)(14,"div",13),e.nrm(15,"input",14),e.k0s(),e.j41(16,"div",15),e.nrm(17,"i",16),e.k0s(),e.j41(18,"div",17),e.EFF(19,"\xa0\u0e16\u0e36\u0e07\u0e27\u0e31\u0e19\u0e17\u0e35\u0e48\xa0\xa0"),e.k0s(),e.j41(20,"div",13),e.nrm(21,"input",18),e.k0s(),e.j41(22,"div",15),e.nrm(23,"i",19),e.k0s()()(),e.j41(24,"tr")(25,"td",20),e.EFF(26,"\u0e2b\u0e19\u0e48\u0e27\u0e22\u0e07\u0e32\u0e19\u0e17\u0e35\u0e48\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01 :\xa0"),e.k0s(),e.j41(27,"td",21)(28,"div",13)(29,"input",22),e.mxI("ngModelChange",function(n){return e.eBV(s),e.DH7(t.pcreate_dep_code,n)||(t.pcreate_dep_code=n),e.Njj(n)}),e.bIt("change",function(n){return e.eBV(s),e.Njj(t.tabChangeSelect("puser_post",t.getDep,n,3))}),e.k0s()(),e.j41(30,"div",23)(31,"ng-select",24,1),e.mxI("ngModelChange",function(n){return e.eBV(s),e.DH7(t.puser_post,n)||(t.puser_post=n),e.Njj(n)}),e.bIt("change",function(n){return e.eBV(s),e.Njj(t.tabChangeSelect("pcreate_dep_code",t.getDep,n,2))}),e.DNE(33,O,2,2,"ng-option",25),e.k0s()()()(),e.j41(34,"tr")(35,"td",20),e.EFF(36,"\u0e1c\u0e39\u0e49\u0e15\u0e23\u0e27\u0e08\u0e2a\u0e2d\u0e1a :\xa0"),e.k0s(),e.j41(37,"td",21)(38,"div",13)(39,"input",26),e.mxI("ngModelChange",function(n){return e.eBV(s),e.DH7(t.phead_off_id,n)||(t.phead_off_id=n),e.Njj(n)}),e.bIt("change",function(n){return e.eBV(s),e.Njj(t.tabChangeSelect("phead_off_name",t.getPoffId,n,1))}),e.k0s()(),e.j41(40,"div",23)(41,"ng-select",24,1),e.mxI("ngModelChange",function(n){return e.eBV(s),e.DH7(t.phead_off_name,n)||(t.phead_off_name=n),e.Njj(n)}),e.bIt("change",function(n){return e.eBV(s),e.Njj(t.tabChangeSelect("phead_off_id",t.getPoffId,n,2))}),e.DNE(43,P,2,2,"ng-option",25),e.k0s()()()(),e.j41(44,"tr")(45,"td",20),e.EFF(46,"\u0e1c\u0e39\u0e49\u0e1b\u0e0f\u0e34\u0e1a\u0e31\u0e15\u0e34 :\xa0"),e.k0s(),e.j41(47,"td",21)(48,"div",13)(49,"input",27),e.mxI("ngModelChange",function(n){return e.eBV(s),e.DH7(t.puser_id,n)||(t.puser_id=n),e.Njj(n)}),e.bIt("change",function(n){return e.eBV(s),e.Njj(t.tabChangeSelect("off_name",t.getOffId,n,1))}),e.k0s()(),e.j41(50,"div",23)(51,"ng-select",24,1),e.mxI("ngModelChange",function(n){return e.eBV(s),e.DH7(t.off_name,n)||(t.off_name=n),e.Njj(n)}),e.bIt("change",function(n){return e.eBV(s),e.Njj(t.tabChangeSelect("puser_id",t.getOffId,n,2))}),e.DNE(53,R,2,2,"ng-option",25),e.k0s()()()(),e.j41(54,"tr")(55,"td",20)(56,"input",28),e.mxI("ngModelChange",function(n){return e.eBV(s),e.DH7(t.pChk4,n)||(t.pChk4=n),e.Njj(n)}),e.bIt("change",function(){return e.eBV(s),e.Njj(t.chkUser())}),e.k0s(),e.EFF(57," \u0e40\u0e2a\u0e19\u0e2d \u0e1c.\u0e2d. :\xa0 "),e.k0s(),e.j41(58,"td",21)(59,"div",13)(60,"input",29),e.mxI("ngModelChange",function(n){return e.eBV(s),e.DH7(t.puser_to_id,n)||(t.puser_to_id=n),e.Njj(n)}),e.bIt("change",function(n){return e.eBV(s),e.Njj(t.tabChangeSelect("puser_to",t.getToId,n,1))}),e.k0s()(),e.j41(61,"div",23)(62,"ng-select",24,1),e.mxI("ngModelChange",function(n){return e.eBV(s),e.DH7(t.puser_to,n)||(t.puser_to=n),e.Njj(n)}),e.bIt("change",function(n){return e.eBV(s),e.Njj(t.tabChangeSelect("puser_to_id",t.getToId,n,2))}),e.DNE(64,V,2,2,"ng-option",25),e.k0s()()()(),e.j41(65,"tr")(66,"td",11),e.EFF(67,"\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e41\u0e1a\u0e1a\u0e23\u0e32\u0e22\u0e07\u0e32\u0e19 :\xa0"),e.k0s(),e.j41(68,"td",12)(69,"div",13)(70,"ng-select",30),e.mxI("ngModelChange",function(n){return e.eBV(s),e.DH7(t.pflag,n)||(t.pflag=n),e.Njj(n)}),e.bIt("change",function(n){return e.eBV(s),e.Njj(t.changeCaseType(n))}),e.DNE(71,F,2,2,"ng-option",25),e.k0s()()()(),e.j41(72,"div"),e.EFF(73,"\xa0"),e.k0s()()(),e.j41(74,"div",31)(75,"button",32),e.bIt("click",function(){return e.eBV(s),e.Njj(t.printReport())}),e.EFF(76,"\u0e1e\u0e34\u0e21\u0e1e\u0e4c\u0e23\u0e32\u0e22\u0e07\u0e32\u0e19"),e.k0s(),e.j41(77,"button",33),e.bIt("click",function(){return e.eBV(s),e.Njj(t.ClearAll())}),e.EFF(78,"\u0e25\u0e49\u0e32\u0e07\u0e2b\u0e19\u0e49\u0e32\u0e08\u0e2d"),e.k0s()()()()()()}2&i&&(e.R7$(4),e.Y8G("ngIf",t.programName),e.R7$(25),e.R50("ngModel",t.pcreate_dep_code),e.R7$(2),e.R50("ngModel",t.puser_post),e.Y8G("ngModelOptions",e.lJ4(21,c)),e.R7$(2),e.Y8G("ngForOf",t.getDep),e.R7$(6),e.R50("ngModel",t.phead_off_id),e.R7$(2),e.R50("ngModel",t.phead_off_name),e.Y8G("ngModelOptions",e.lJ4(22,c)),e.R7$(2),e.Y8G("ngForOf",t.getPoffId),e.R7$(6),e.R50("ngModel",t.puser_id),e.R7$(2),e.R50("ngModel",t.off_name),e.Y8G("ngModelOptions",e.lJ4(23,c)),e.R7$(2),e.Y8G("ngForOf",t.getOffId),e.R7$(3),e.R50("ngModel",t.pChk4),e.R7$(4),e.R50("ngModel",t.puser_to_id),e.R7$(2),e.R50("ngModel",t.puser_to),e.Y8G("ngModelOptions",e.lJ4(24,c)),e.R7$(2),e.Y8G("ngForOf",t.getToId),e.R7$(6),e.R50("ngModel",t.pflag),e.Y8G("ngModelOptions",e.lJ4(25,c)),e.R7$(),e.Y8G("ngForOf",t.getFlag))},dependencies:[_.Sq,_.bT,p.qT,p.me,p.Zm,p.BC,p.cb,p.vS,p.cV,D.vr,D.xt,I.L],styles:[".btn-info[_ngcontent-%COMP%]{color:#fff!important}.modal-content[_ngcontent-%COMP%]{width:600px!important;min-height:200px!important;max-height:600px!important;height:auto!important}"]})}return r})();var J=u(9163),G=u(5281);const w=["prst6400"],U=["openbutton"],H=["closebutton"],Y=["scasetypeid"];function L(r,d){1&r&&e.nrm(0,"app-case-header")}const $=[k.$.childRoutes([{path:"prst5500",component:A},{path:"prst6400",component:(()=>{class r{constructor(a,i,t,s,o,n){this.formBuilder=a,this.http=i,this.ngbModal=t,this.SpinnerService=s,this.printReportService=o,this.authService=n,this.title="datatables",this.selectedCasetype="\u0e41\u0e1e\u0e48\u0e07",this.result=[],this.loadModalComponent=!1,this.loadModalJudgeComponent=!1,this.dtOptions={},this.dtTrigger=new j.B,this.loadComponent=!1,this.onOpenJudge=()=>{const l=this.ngbModal.open(J.S,{size:"lg",backdrop:"static"});l.componentInstance.value1="pjudge",l.componentInstance.value2="judge_id",l.componentInstance.value3="judge_name",l.componentInstance.value4="",l.componentInstance.types="1",l.componentInstance.value5=JSON.stringify({type:2}),l.result.then(f=>{f&&(this.result.preport_judge_id=f.judge_id,this.result.preport_judge_name=f.judge_name)}).catch(f=>{console.log(f)})}}ngOnInit(){this.sessData=localStorage.getItem(this.authService.sessJson),this.userData=JSON.parse(this.sessData),this.successHttp();let a=new g.Lr;a=a.set("Content-Type","application/json");var i=JSON.stringify({table_name:"pcase_type",field_id:"case_type",field_name:"case_type_desc",order_by:"case_type ASC",userToken:this.userData.userToken});this.http.post("/"+this.userData.appName+"ApiUTIL/API/getData",i,{headers:a}).subscribe(t=>{let s=JSON.parse(JSON.stringify(t));this.getCaseType=s,this.selCaseType=this.userData.defaultCaseType},t=>{})}successHttp(){let a=new g.Lr;a=a.set("Content-Type","application/json");var i=JSON.stringify({userToken:this.userData.userToken,url_name:"prst6400"});return new Promise((s,o)=>{this.http.post("/"+this.userData.appName+"Api/API/authen",i,{headers:a}).toPromise().then(n=>{let l=JSON.parse(JSON.stringify(n));console.log(l),this.programName=l.programName,this.defaultCaseType=l.defaultCaseType,this.defaultCaseTypeText=l.defaultCaseTypeText,this.defaultTitle=l.defaultTitle,this.defaultRedTitle=l.defaultRedTitle,s(n)},n=>{o(n)})})}rerender(){this.dtElement.dtInstance.then(a=>{a.destroy(),this.dtTrigger.next(null)})}ngAfterViewInit(){myExtObject.callCalendar(),this.dtTrigger.next(null)}ngOnDestroy(){this.dtTrigger.unsubscribe()}ClearAll(){window.location.reload()}tabChangeInput(a,i){if("preport_judge_id"==a){var t=JSON.stringify({table_name:"pjudge",field_id:"judge_id",field_name:"judge_name",field_name2:"post_id",condition:" AND judge_id='"+i.target.value+"'",userToken:this.userData.userToken});console.log(t),this.http.post("/"+this.userData.appName+"ApiUTIL/API/getData",t).subscribe(s=>{let o=JSON.parse(JSON.stringify(s));o.length?this.result.preport_judge_name=o[0].fieldNameValue:(this.result.preport_judge_id="",this.result.preport_judge_name="")},s=>{})}}clickOpenMyModalComponent(a){this.modalType=a,this.openbutton.nativeElement.click()}loadMyModalComponent(){if(h(".modal-backdrop").remove(),1==this.modalType){var a=JSON.stringify({cond:2,userToken:this.userData.userToken});this.listTable="pjudge",this.listFieldId="judge_id",this.listFieldName="judge_name",this.listFieldNull="",this.listFieldType=JSON.stringify({type:2}),this.http.post("/"+this.userData.appName+"ApiUTIL/API/popupJudge",a).subscribe(i=>{this.list=i,this.loadComponent=!1,this.loadModalComponent=!1,this.loadModalJudgeComponent=!0;let t=JSON.parse(JSON.stringify(i));this.list=t.data.length?t.data:[]},i=>{})}}receiveJudgeListData(a){this.result.preport_judge_id=a.judge_id,this.result.preport_judge_name=a.judge_name,this.closebutton.nativeElement.click()}directiveDate(a,i){this.result[i]=a}assignReportChk(a){1==a?(this.result.preport_judge_id=this.userData.headJudgeId,this.result.preport_judge_name=this.userData.headJudgeName,this.result.preport_judge_post=this.userData.headJudgePost):(this.result.preport_judge_id="",this.result.preport_judge_name="",this.result.preport_judge_post="")}receiveFuncListData(a){console.log(a),1==this.modalType&&(this.result.preport_judge_id=a.fieldIdValue,this.result.preport_judge_name=a.fieldNameValue),this.closebutton.nativeElement.click()}closeModal(){this.loadModalJudgeComponent=!1}printReport(){var i=JSON.stringify({pjudge_id:this.result.preport_judge_id?this.result.preport_judge_id:"",pdate_start:this.result.txtStartDate?myExtObject.conDate(this.result.txtStartDate):"",pdate_end:this.result.txtEndDate?myExtObject.conDate(this.result.txtEndDate):""});console.log(i),this.printReportService.printReport("rst6400",i)}changeCaseType(a){this.selCaseType=a}static#e=this.\u0275fac=function(i){return new(i||r)(e.rXU(p.ok),e.rXU(g.Qq),e.rXU(G.Bq),e.rXU(T.ex),e.rXU(b.h),e.rXU(v.u))};static#t=this.\u0275cmp=e.VBU({type:r,selectors:[["app-prst6400"],["ngbd-popover-basic"],["ngbd-popover-tplcontent"]],viewQuery:function(i,t){if(1&i&&(e.GBs(w,7),e.GBs(U,7),e.GBs(H,7),e.GBs(y._,5),e.GBs(Y,5)),2&i){let s;e.mGM(s=e.lsd())&&(t.prst6400=s.first),e.mGM(s=e.lsd())&&(t.openbutton=s.first),e.mGM(s=e.lsd())&&(t.closebutton=s.first),e.mGM(s=e.lsd())&&(t.dtElement=s.first),e.mGM(s=e.lsd())&&(t.scasetypeid=s.first)}},decls:39,vars:5,consts:[["txtStartDate",""],["txtEndDate",""],["id","div-wraper",2,"width","100%","height","100%"],[1,"content",2,"padding","10px"],[1,"card","card-info",2,"box-shadow","none !important","border","0px !important"],[1,"",2,"height","40px","border-radius","4px","border","0px solid #17a2b8 !important","background-color","#e1f6f9"],[4,"ngIf"],[1,"card-body"],["align","center",1,"card",2,"box-shadow","none !important","padding","5px"],["width","100%","border","0","cellspacing","2","cellpadding","2",1,"form_table"],["align","right","width","44%"],[2,"float","left","margin-left","3px"],["type","text","placeholder","\u0e48\u0e27\u0e27/\u0e14\u0e14/\u0e1b\u0e1b\u0e1b\u0e1b",1,"form-control","jcalendar","txtStartDate",2,"width","120px",3,"ngModelChange","click","ngModel"],[2,"float","left","margin-left","4px","margin-top","5px"],["onClick","$('.txtStartDate').focus();",1,"fa","fa-calendar",2,"font-size","16px"],[2,"float","left","margin-left","8px","margin-top","5px"],[2,"float","left"],["type","text","placeholder","\u0e48\u0e27\u0e27/\u0e14\u0e14/\u0e1b\u0e1b\u0e1b\u0e1b",1,"form-control","jcalendar","txtEndDate",2,"width","120px",3,"ngModelChange","click","ngModel"],["onClick","$('.txtEndDate').focus();",1,"fa","fa-calendar",2,"font-size","16px"],["type","text",1,"form-control",2,"width","60px",3,"ngModelChange","change","ngModel"],[2,"float","left","margin-left","2px"],["type","text","readonly","",1,"form-control",2,"width","255px",3,"ngModelChange","ngModel"],[2,"float","left","margin-left","2px","margin-top","2px"],[1,"far","fa-list-alt",2,"font-size","20px","margin-left","2px","cursor","pointer",3,"click"],["align","center",1,"card-footer"],["type","button",1,"btn","btn-info",2,"margin-left","5px",3,"click"],["type","reset",1,"btn","btn-warning",2,"margin-left","5px","color","white",3,"click"]],template:function(i,t){if(1&i){const s=e.RV6();e.j41(0,"div",2)(1,"div",3)(2,"div",4)(3,"div",5),e.DNE(4,L,1,0,"app-case-header",6),e.k0s()(),e.j41(5,"div",7)(6,"div",8)(7,"table",9)(8,"tr")(9,"td",10),e.EFF(10,"\u0e1c\u0e25\u0e07\u0e32\u0e19\u0e15\u0e31\u0e49\u0e07\u0e41\u0e15\u0e48\u0e27\u0e31\u0e19\u0e17\u0e35\u0e48 :\xa0"),e.k0s(),e.j41(11,"div",11)(12,"input",12,0),e.mxI("ngModelChange",function(n){return e.eBV(s),e.DH7(t.result.txtStartDate,n)||(t.result.txtStartDate=n),e.Njj(n)}),e.bIt("click",function(){e.eBV(s);const n=e.sdS(13);return e.Njj(t.directiveDate(n.value,"txtStartDate"))}),e.k0s()(),e.j41(14,"div",13),e.nrm(15,"i",14),e.k0s(),e.j41(16,"div",15),e.EFF(17,"\xa0\u0e16\u0e36\u0e07\xa0\xa0"),e.k0s(),e.j41(18,"div",16)(19,"input",17,1),e.mxI("ngModelChange",function(n){return e.eBV(s),e.DH7(t.result.txtEndDate,n)||(t.result.txtEndDate=n),e.Njj(n)}),e.bIt("click",function(){e.eBV(s);const n=e.sdS(20);return e.Njj(t.directiveDate(n.value,"txtEndDate"))}),e.k0s()(),e.j41(21,"div",13),e.nrm(22,"i",18),e.k0s()(),e.j41(23,"tr")(24,"td",10),e.EFF(25,"\u0e1c\u0e39\u0e49\u0e1e\u0e34\u0e1e\u0e32\u0e01\u0e29\u0e32 :\xa0"),e.k0s(),e.j41(26,"div",11)(27,"input",19),e.mxI("ngModelChange",function(n){return e.eBV(s),e.DH7(t.result.preport_judge_id,n)||(t.result.preport_judge_id=n),e.Njj(n)}),e.bIt("change",function(n){return e.eBV(s),e.Njj(t.tabChangeInput("preport_judge_id",n))}),e.k0s()(),e.j41(28,"div",20)(29,"input",21),e.mxI("ngModelChange",function(n){return e.eBV(s),e.DH7(t.result.preport_judge_name,n)||(t.result.preport_judge_name=n),e.Njj(n)}),e.k0s()(),e.j41(30,"div",22)(31,"i",23),e.bIt("click",function(){return e.eBV(s),e.Njj(t.onOpenJudge())}),e.k0s()()(),e.j41(32,"div"),e.EFF(33,"\xa0"),e.k0s()()(),e.j41(34,"div",24)(35,"button",25),e.bIt("click",function(){return e.eBV(s),e.Njj(t.printReport())}),e.EFF(36,"\u0e1e\u0e34\u0e21\u0e1e\u0e4c\u0e23\u0e32\u0e22\u0e07\u0e32\u0e19"),e.k0s(),e.j41(37,"button",26),e.bIt("click",function(){return e.eBV(s),e.Njj(t.ClearAll())}),e.EFF(38,"\u0e25\u0e49\u0e32\u0e07\u0e2b\u0e19\u0e49\u0e32\u0e08\u0e2d"),e.k0s()()()()()}2&i&&(e.R7$(4),e.Y8G("ngIf",t.programName),e.R7$(8),e.R50("ngModel",t.result.txtStartDate),e.R7$(7),e.R50("ngModel",t.result.txtEndDate),e.R7$(8),e.R50("ngModel",t.result.preport_judge_id),e.R7$(2),e.R50("ngModel",t.result.preport_judge_name))},dependencies:[_.bT,p.me,p.BC,p.vS,I.L],styles:[".btn-info[_ngcontent-%COMP%]{color:#fff!important}.modal-content[_ngcontent-%COMP%]{width:600px!important;min-height:200px!important;max-height:600px!important;height:auto!important}"]})}return r})()}])];let z=(()=>{class r{static#e=this.\u0275fac=function(i){return new(i||r)};static#t=this.\u0275mod=e.$C({type:r});static#n=this.\u0275inj=e.G2t({imports:[C.iI.forChild($),C.iI]})}return r})(),Q=(()=>{class r{static#e=this.\u0275fac=function(i){return new(i||r)};static#t=this.\u0275mod=e.$C({type:r});static#n=this.\u0275inj=e.G2t({imports:[_.MD,z,p.YN,p.X1,M.G,N.CaseModule]})}return r})()}}]);