import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Input,Output,EventEmitter   } from '@angular/core';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { NgSelectComponent } from '@ng-select/ng-select';
import { AuthService } from 'src/app/auth.service';
//import { Fca0200Component } from 'src/app/components/fca/fca0200/fca0200.component';
import { DialogLayoutDisplay,ConfirmBoxInitializer,ToastNotificationInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { CaseService,Case } from 'src/app/services/case.service.ts';
import {Observable,of, Subject  } from 'rxjs';
declare var myExtObject: any;
@Component({
  selector: 'app-fsc0100-head',
  templateUrl: './fsc0100-head.component.html',
  styleUrls: ['./fsc0100-head.component.scss']
})

export class Fsc0100HeadComponent implements AfterViewInit, OnInit, OnDestroy {

  //@ViewChild(TemplateRef, { static: true }) foo!: TemplateRef;
  sessData:any;
  userData:any;

  getTitle:any;
  getRedTitle:any;
  getCaseCate:any;
  getCourt:any;
  getCaseType:any;
  getCaseCourtType:any;
  getCaseStatus:any;
  getCaseSpecial:any;
  getSeek:any;
  headnew:any=[];
  checkNunNoFrom:any=0;

  hResult:any = [];
  prosObj:any = [];
  accuObj:any = [];
  runIdObj:any;
  run_id:any;
  mChangCType:any;
  myExtObject: any;

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;
  public loadModalListSeekComponent: boolean = false;

  public caseObservable$: Observable<Case>;
  @ViewChild('sCaseCate') sCaseCate : NgSelectComponent;
  @ViewChild('sRedTitle') sRedTitle : NgSelectComponent;
  @ViewChild('sCaseStatus') sCaseStatus : NgSelectComponent;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @Output() sendCaseData = new EventEmitter<any>();
  @Input() set callHead(callHead: string) {//รับค่าจาก fsc0100
    console.log(callHead)
    var head = callHead;
    if(typeof callHead !='undefined'){
      if(head['event']==1){//กดปุ่มจัดเก็บ
        this.hResult.caseEvent = 2;//save ข้อมูล
        this.sendCaseData.emit($.extend({},this.hResult));//ส่งค่าไป fsc0100
      }else{
        this.run_id = head['run_id'];
          if(this.run_id > 0){
            this.searchCaseNo(3);
          }else{
            this.setDefHead();
          }
      }
    }
  }
  @Input() set runId(runId: string) {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    if(typeof runId !='undefined'){
      if(typeof runId === 'object'){
        var obj = runId ?? {};
        this.runIdObj = runId;
        if(obj['run_id']==0){
        }else{
          this.run_id = obj['run_id'];
          if(this.run_id > 0){
            //this.eventSearch = 1
            this.searchCaseNo(3);
          }else{
            this.setDefHead();
          }
        }
      }else{
        this.run_id=runId;
        if(this.run_id>0){
          //this.eventSearch = 1
          this.searchCaseNo(3);
        }else{
          this.setDefHead();
        }
      }
    }else{
      this.setDefHead();
    }
  }
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    // private fca0200Service : Fca0200Component,
    private caseService:CaseService,
  ){
    //this.config.bindValue = 'value';
  }

  ngOnInit(): void {

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    //======================== pcourt_type ======================================
    var student = JSON.stringify({
      "table_name" : "pcourt_type",
      "field_id" : "court_type_id",
      "field_name" : "court_type_name",
      "condition": "AND select_flag='1'",
      "order_by": " court_type_id ASC",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseCourtType = getDataOptions;
      },
      (error) => {}
    )


    //======================== pcourt ======================================
    var student = JSON.stringify({
      "table_name" : "pcourt",
      "field_id" : "court_id",
      "field_name" : "court_name",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCourt = getDataOptions;
        console.log(getDataOptions)
      },
      (error) => {}
    )

    //======================== pcase_status ======================================
    var student = JSON.stringify({
      "table_name" : "pcase_status",
      "field_id" : "case_status_id",
      "field_name" : "case_status",
      "order_by" : "order_no ASC, case_status_id ASC",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseStatus = getDataOptions;
        //console.log(getDataOptions)
      },
      (error) => {}
    )

    //======================== pcase_special ======================================
    var student = JSON.stringify({
      "table_name" : "pcase_special",
      "field_id" : "special_id",
      "field_name" : "special_case",
      "order_by" : "order_no ASC, special_id ASC",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseSpecial = getDataOptions;
        //console.log(getDataOptions)
      },
      (error) => {}
    )

    //======================== ptitle ======================================
    var student = JSON.stringify({
      "table_name" : "ptitle",
      "field_id" : "title",
      "field_name" : "title",
      "condition" : " AND special_case = '3'",
      "order_by" : " order_id ASC",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getTitle = getDataOptions;
        this.hResult.title = getDataOptions[0].fieldNameValue;
        console.log(student);
        console.log(getDataOptions);
      },
      (error) => {}
    )
    //==============================================================
  }

  setDefHead(){
    this.run_id = null;
    this.hResult = [];
    this.hResult.court_id = this.userData.courtId;
    this.hResult.case_type = this.userData.defaultCaseType;
    // this.hResult.title = 'ค';
    // this.hResult.red_title = this.userData.defaultTitle;
    // this.hResult.red_yy = myExtObject.curYear();
    // this.hResult.case_cate_id = this.userData.defaultCaseCate;

    // this.prosObj = [];
    // this.accuObj = [];
    this.fCaseType();
    this.hResult.yy = myExtObject.curYear();
  }

  clickOpenMyModalComponent(type:any){
    if(this.getSeek){
      this.run_id = this.getSeek.seek_data[0].run_id;
    console.log(this.run_id);
   }
   this.openbutton.nativeElement.click();
    // if(!this.run_id){
    //   const confirmBox = new ConfirmBoxInitializer();
    //   confirmBox.setTitle('ข้อความแจ้งเตือน');
    //   confirmBox.setMessage('กรุณาค้นหาข้อมูลเลขดคี');
    //   confirmBox.setButtonLabels('ตกลง');
    //   confirmBox.setConfig({
    //       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    //   });
    //   const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
    //     if (resp.success==true){}
    //     subscription.unsubscribe();
    //   });
    // }else{
    //   this.openbutton.nativeElement.click();
    //  }
  }

  loadMyModalComponent(){
    $(".modal-backdrop").remove();
      $("#exampleModal").find(".modal-content").css("width","100px");
      // var student = JSON.stringify({
      //   "table_name" : "",
      //   "field_id" : "",
      //   "field_name" : "",
      //   "search_id" : "",
      //   "search_desc" : "",
      //   "userToken" : this.userData.userToken});
      this.listTable='';
      this.listFieldId='';
      this.listFieldName='';
      this.listFieldNull='';
      this.loadModalListSeekComponent = true;

    // console.log(student)
        //   this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
        // (response) =>{
        //   console.log(response)
        //   this.list = response;
        //  this.loadModalListSeekComponent = true;
        //   }
        // ),
        // (error) => {}
    }


  receiveFuncListData(event:any){
    console.log(event)
    if(event.id){
      this.hResult.nofrom = event.sno_to ? + event.sno_from + "-" + event.sno_to : event.sno_from;
      this.hResult.id = event.id;
      this.hResult.yy = event.yy;
      this.searchSeekData();
    }
      // this.hResult.=event.fieldIdValue;
      // this.result.cost_payer=event.fieldNameValue;
    this.closebutton.nativeElement.click();
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    //console.log(this.headFca0200.defaultCaseType)
  }

  closeModal(){
    this.loadModalListSeekComponent = false;
  }


  alertHead(){
   console.log('Headddddddddddddd');
  }

  goToPage(toPage:any){
    let winURL = window.location.href;
    winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+toPage;
    //alert(winURL);
    window.open(winURL,'_blank', "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=1800,height=600");
    //myExtObject.OpenWindowMax(winURL+'?run_id='+run_id);
  }

  fCaseType(){
    //======================== pcase_type ======================================
    var student = JSON.stringify({
      "table_name" : "pcase_type",
      "field_id" : "case_type",
      "field_name" : "case_type_desc",
      "userToken" : this.userData.userToken
    });
    //console.log("fCaseType")
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    let promise = new Promise((resolve, reject) => {
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getCaseType = getDataOptions;
          this.hResult.case_type = 1;
          // if(this.hResult.run_id){//ถ้ามีเลขคดี
          //   this.changeCaseType(this.hResult.case_type,1);
          // }else{//ไม่มีเลขคดี
          //   this.changeCaseType(this.userData.defaultCaseType,1);
          // }
        },
        (error) => {}
      )
    });
    return promise;
  }

  changeCaseType(case_type:any,type:any){
    this.mChangCType = type;//2 เรียกจากหน้าจอ
    this.fCaseTitle(case_type);
  }

  fCaseTitle(case_type:any){
    //========================== ptitle ====================================
    var student = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": " AND title_flag='1' AND special_case = '3' AND case_type='"+case_type+"'",
      "order_by": " order_id ASC",
      "userToken" : this.userData.userToken
    });

    var student2 = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": "AND title_flag='2' AND case_type='"+case_type+"'",
      "order_by": " order_id ASC",
      "userToken" : this.userData.userToken
    });
    console.log(student);
    //console.log("fCaseTitle")
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    let promise = new Promise((resolve, reject) => {
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          this.getTitle = getDataOptions;
          this.fDefaultTitle(case_type);
        },
        (error) => {}
      )

      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student2 , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          this.getRedTitle = getDataOptions;
        },
        (error) => {}
      )

    });
    return promise;
  }

  fDefaultTitle(caseType:any){
    //========================== ptitle ====================================
    var student = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": " AND case_type='"+caseType+"' AND special_case ='3' AND title_flag='1'",
      "order_by":" title_id ASC",
      "userToken" : this.userData.userToken
    });

    var student2 = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": " AND case_type='"+caseType+"' AND default_value='1' AND title_flag='2'",
      "order_by":" title_id ASC",
      "userToken" : this.userData.userToken
    });

    console.log("fDefaultTitle :"+student2)
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    let promise = new Promise((resolve, reject) => {
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        if(this.mChangCType==2)
          this.hResult.title = getDataOptions[0].fieldNameValue;
        this.fCaseStat(caseType,getDataOptions[0].fieldIdValue);
        this.changeTitle(this.hResult.title,caseType,'');//เปลี่ยนชั้นพิจารณา
      },
      (error) => {}
    )

    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student2 , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        //console.log(getDataOptions)
        //if(this.mChangCType==2)
        if(!this.hResult.run_id)//ถ้าไม่มีเลขคดี
          this.hResult.red_title = getDataOptions[0].fieldNameValue;
      },
      (error) => {}
    )

    });
    return promise;
  }

  fCaseStat(caseType:any,title:any){
    var student = JSON.stringify({
      "table_name": "pcase_cate",
      "field_id": "case_cate_id",
      "field_name": "case_cate_name",
      "condition": " AND case_type='"+caseType+"'",
      "order_by":" case_cate_id ASC",
      "userToken" : this.userData.userToken
    });
    //console.log("fCaseStat :"+student)
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    let promise = new Promise((resolve, reject) => {
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseCate = getDataOptions;
        this.fDefCaseStat(caseType,title);
      },
      (error) => {}
    )
    });
    return promise;
  }

  fDefCaseStat(caseType:any,title:any){
    var student = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "case_cate_id",
      "condition": " AND title_flag='1' AND case_type='"+caseType+"' AND title='"+title+"'",
      "order_by":" case_cate_id ASC",
      "userToken" : this.userData.userToken
    });

    //console.log("fDefCaseStat :"+student)
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    let promise = new Promise((resolve, reject) => {
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        //this.selCaseCate = getDataOptions[0].fieldNameValue;
        //console.log(this.getCaseCate)
        if(getDataOptions.length){
          var sel = this.getCaseCate;
          for (var x = 0; x < sel.length; x++) {
            if(sel[x].fieldIdValue == getDataOptions[0].fieldNameValue){
              this.hResult.case_cate_id = sel[x].fieldNameValue;
            }
          }
        }else{
          this.sCaseCate.handleClearClick();
        }
      },
      (error) => {}
    )
    });
    return promise;
  }

  changeTitle(obj:any,caseType:any,type:any){
    //console.log(obj+":"+caseType+":"+type)
    if(type)
      this.fCaseStat(caseType,obj);
    	if(obj=='ผบ'||obj=='ม'||obj=='ย'){
			  //this.selCaseStatus=3;
        var sel = this.getCaseStatus;
        for (var x = 0; x < sel.length; x++) {
          if(sel[x].fieldIdValue == 3){
            this.hResult.case_status = sel[x].fieldNameValue;
          }
        }
      }else{
        var sel = this.getCaseStatus;
        for (var x = 0; x < sel.length; x++) {
          if(sel[x].fieldIdValue == 1){
            this.hResult.case_status = sel[x].fieldNameValue;
          }
        }
      }
  }

  loadHead(){
     if(this.getSeek.seek_data){
      this.hResult.run_id = this.getSeek.seek_data[0].run_id;
      this.hResult.case_cate_id = this.getSeek.data[0].case_cate_id;
      this.hResult.case_cate_name = this.getSeek.data[0].case_cate_name;

      if(this.getSeek.seek_data[0].sno_from){
        this.hResult.nofrom = this.getSeek.seek_data[0].sno_from ? this.getSeek.seek_data[0].sno_from : '';
        this.hResult.num_nofrom = this.getSeek.seek_data[0].total ? this.getSeek.seek_data[0].total : '';
      }
    }
  }

  // async searchSeekData(): Promise <void>{
    searchSeekData(){
      if(this.hResult.title && this.hResult.id && this.hResult.yy){
        var student = JSON.stringify({
          "case_type": this.hResult.case_type,
          "title": this.hResult.title,
          "id" : this.hResult.id,
          "yy": this.hResult.yy.toString(),
          "court_id" : this.userData.courtId,
          "userToken" : this.userData.userToken
        });
        console.log(student)
        let promise = new Promise((resolve, reject) => {
          this.http.post('/'+this.userData.appName+'ApiSC/API/NOTICESC/fsc0100/getNoticeSeekDataTab1', student).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            console.log(getDataOptions);
            if(getDataOptions.result==1){
              this.getSeek = getDataOptions;
              this.sendCaseData.emit(this.getSeek);
              // this.hResult.red_id = getDataOptions.red_id;
              console.log('getSeek==>',this.getSeek);
              this.loadHead();
            }else{
              this.getMessage(getDataOptions.error);
            }
          },
          (error) => {}
        )
        });
        return promise;
      }
    }

    insertTab(event:any){
      if(event==9){
        if(this.hResult.num_nofrom){
        var dataDel = [],dataTmp=[];
        var bar = new Promise((resolve, reject) => {
        // this.seekNoData.forEach((ele, index, array) => {
        //  // if(ele.edit0102 == true){
        //  if(ele.s_seq == this.delIndexAlle){
        //    dataTmp.push(this.seekNoData[index]);
        //   }
        //     });
          });
            if(bar){
              //console.log(dataTmp)
              dataDel['run_id'] = this.hResult.run_id;
              dataDel['case_type'] = this.hResult.case_type;
              dataDel['case_cate_id'] = this.hResult.case_cate_id ? this.hResult.case_cate_id : 1;
              dataDel['title'] = this.hResult.title;
              dataDel['id'] = this.hResult.id;
              dataDel['yy'] = this.hResult.yy;
              dataDel['court_id'] = this.userData.courtId;
              dataDel['num_nofrom'] = parseInt(this.hResult.num_nofrom);
              if(this.hResult.run_id){
                console.log('Oldddddddddddd');
                dataDel['data'] = this.getSeek.data;
                var num=parseInt(this.hResult.num_nofrom)-parseInt(this.getSeek.seek_data[0].total);
                if(num > 0){
                  dataDel['seek_no_data'] = this.getSeek.seek_data[0].seek_no_data;
                  for (let index = 0; index < num; index++) {
                    dataDel['seek_no_data'].push({"s_seq":0});
                  }
                }else{
                  this.checkNunNoFrom = 1;
                  dataDel['seek_no_data'] = this.getSeek.seek_data[0].seek_no_data;
                }
             }else{
                console.log('Newwwwwwwwwwwwww');
                dataTmp.push({send_date: myExtObject.curDate(),send_time: this.getTime()});
                dataDel['data'] = dataTmp;
                dataDel['seek_no_data'] = [];
              }


              dataDel['userToken'] = this.userData.userToken;
              var data = $.extend({}, dataDel);
              console.log(data);
              console.log(JSON.stringify(data));
              // return false;
              if(this.checkNunNoFrom==0){
              this.http.post('/'+this.userData.appName+'ApiSC/API/NOTICESC/fsc0100/saveNoticeSeek', data ).subscribe(
              (response) =>{
                let alertMessage : any = JSON.parse(JSON.stringify(response));
                 if(alertMessage.result==0){
                             // this.SpinnerService.hide();

                  }else{

                              // this.closebutton.nativeElement.click();
                              //$("button[type='reset']")[0].click();
                              const confirmBox = new ConfirmBoxInitializer();
                              confirmBox.setTitle('ข้อความแจ้งเตือน');
                              confirmBox.setMessage(alertMessage.error);
                              confirmBox.setButtonLabels('ตกลง');
                              confirmBox.setConfig({
                                  layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                              });
                              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                                if (resp.success==true){
                                  this.checkNunNoFrom = 0;
                                  // this.closebutton.nativeElement.click();
                                  this.searchSeekData();
                                  // this.searchData(2);
                                }
                                subscription.unsubscribe();
                              });

                            }
                          },
                          (error) => {}
                        )
                      }else{
                        this.checkNunNoFrom = 0;
                        this.getMessage('ต้องเป็นจำนวนหมายที่มากกว่าเดิมเท่านั้น');
                      }
                        }
          }else{
            this.getMessage('ระบุจำนวนหมายค้นที่ต้องการ');
          }
      }
    }


    getMessage(message:any){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage(message);
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }

    getTime(){
      var time = new Date();
      var cursecond = time.getSeconds();
      var scursecond = cursecond.toString();
      var minutes = time.getMinutes();
      var sminutes = minutes.toString();
      var hours = time.getHours();
      var shours = hours.toString();
      console.log(typeof(cursecond))
        // return((shours.length==1 ? "0"+shours : shours) +":"+(sminutes.length==1 ? "0"+sminutes : sminutes)+":"+(scursecond.length==1 ? "0"+scursecond : scursecond)); //xx:xx:xx
        return((shours.length==1 ? "0"+shours : shours) +":"+(sminutes.length==1 ? "0"+sminutes : sminutes)); //xx:xx
      }

  async searchCaseNo(type:any): Promise<void> {
    //type:any,all_data:any,run_id:any,case_type:any,title:any,id:any,yy:any
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    var objCase = [];
    if(type==1){
      objCase["type"] = 1;
      objCase["case_type"] = this.hResult.case_type;
      objCase["all_data"] = 1;
      objCase["getJudgement"] = 1;
      objCase["run_id"] = 0;
      objCase["title"] = this.hResult.title;
      objCase["id"]= this.hResult.id;
      objCase["yy"]= this.hResult.yy;
      objCase["new"]= 0;
      const cars = await this.caseService.searchCaseNo(objCase);
      console.log(cars)
      if(cars['result']==1){
        this.hResult = JSON.parse(JSON.stringify(cars['data'][0]));
        if(!this.hResult.red_title)
          this.hResult.red_title = this.userData.defaultRedTitle;
        if(!this.hResult.red_yy)
          this.hResult.red_yy = myExtObject.curYear();

        this.fCaseType();
        this.hResult.caseEvent = 1;//ค้นข้อมูล
        this.sendCaseData.emit(this.hResult);
      }else{
        confirmBox.setMessage('ไม่พบข้อมูลเลขคดี');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){
            this.setDefHead();
          }
          subscription.unsubscribe();
        });
      }
    }else if(type==2){
      objCase["type"] = 2;
      objCase["case_type"] = this.hResult.case_type;
      objCase["all_data"] = 1;
      objCase["getJudgement"] = 1;
      objCase["run_id"] = 0;
      objCase["title"] = this.hResult.red_title;
      objCase["id"]= this.hResult.red_id;
      objCase["yy"]= this.hResult.red_yy;
      const cars = await this.caseService.searchCaseNo(objCase);
      console.log(cars)
      if(cars['result']==1){
        this.hResult = JSON.parse(JSON.stringify(cars['data'][0]));
        if(!this.hResult.red_title)
          this.hResult.red_title = this.userData.defaultRedTitle;
        if(!this.hResult.red_yy)
          this.hResult.red_yy = myExtObject.curYear();
        /*
        if(this.hResult.red_title){
          this.hResult.red_title = this.hResult.red_title;
          this.hResult.red_id = this.hResult.red_id;
          this.hResult.red_yy = this.hResult.red_yy;
        }*/
        this.fCaseType();
        this.hResult.caseEvent = 1;//ค้นข้อมูล
        this.sendCaseData.emit(this.hResult);
      }else{
        confirmBox.setMessage('ไม่พบข้อมูลเลขคดี');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){
            this.setDefHead();
          }
          subscription.unsubscribe();
        });
      }
    }else if(type==3){
      objCase["type"] = 3;
      objCase["run_id"] = this.run_id;
      objCase["all_data"] = 1;
      objCase["getJudgement"] = 1;
      const cars = await this.caseService.searchCaseNo(objCase);
      console.log(cars)
      if(cars['result']==1){
        this.hResult = JSON.parse(JSON.stringify(cars['data'][0]));
        if(!this.hResult.red_title)
          this.hResult.red_title = this.userData.defaultRedTitle;
        if(!this.hResult.red_yy)
          this.hResult.red_yy = myExtObject.curYear();
        this.fCaseType();
        this.hResult.caseEvent = 1;//ค้นข้อมูล
        this.sendCaseData.emit(this.hResult);
      }else{
        confirmBox.setMessage('ไม่พบข้อมูลเลขคดี');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){
            this.setDefHead();
          }
          subscription.unsubscribe();
        });
      }
    }
  }

  runCaseNo(){
    console.log(this.hResult.id);
    if(!this.hResult.id){
    if(this.hResult.title && this.hResult.yy && this.hResult.case_type){
      var student = JSON.stringify({
        "case_type": this.hResult.case_type,
        "title": this.hResult.title,
        "yy": this.hResult.yy,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      let promise = new Promise((resolve, reject) => {
        this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/runCaseNo', student).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          if(getDataOptions.result==1){

            this.hResult.id = getDataOptions.id + 1;
            this.getHeadNew();
            this.sendCaseData.emit(this.headnew);
          }
        },
        (error) => {}
      )
      });
      return promise;
    }
  }
  }

  getHeadNew(){
    var DataHeadNew = [], dataTmp = [];
    DataHeadNew["title"] = this.hResult.title;
    DataHeadNew["id"] = this.hResult.id;
    DataHeadNew["yy"] = this.hResult.yy;
    DataHeadNew["case_type"] = this.hResult.case_type;
    DataHeadNew["case_cate_id"] = this.hResult.case_cate_id ? this.hResult.case_cate_id : 1;
    DataHeadNew["num_nofrom"] = this.hResult.num_nofrom ? this.hResult.num_nofrom : 1;
    DataHeadNew["new"] = 1;
    // DataHeadNew["create_dep_name"] = '';
    // DataHeadNew["create_user"] = '';
    // DataHeadNew["create_date"] = '';
    // DataHeadNew["update_dep_name"] = '';
    // DataHeadNew["update_user"] = '';
    // DataHeadNew["update_date"] = '';
    // dataTmp.push({'create_dep_name':''},{'create_user':''},{'create_date':''},{'update_dep_name':''},{'update_user':''},{'update_date':''});
    // dataTmp.push({'create_dep_name':''});
    DataHeadNew["data"] = dataTmp;
    DataHeadNew["seek_data"] = dataTmp;
    var ObjHeadNew = $.extend({},DataHeadNew);
    console.log('HEADNEWDATA==>',ObjHeadNew);
    this.headnew.push(ObjHeadNew);

  }

}
