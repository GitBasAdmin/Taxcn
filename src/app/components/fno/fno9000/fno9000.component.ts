import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterContentInit, OnDestroy, Injectable, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { ExcelService } from 'src/app/services/excel.service.ts';
import { ActivatedRoute } from '@angular/router';

// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';

import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
import * as e from 'cors';
import { HighlightSpanKind } from 'typescript';

declare var myExtObject: any;
//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-fno9000,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fno9000.component.html',
  styleUrls: ['./fno9000.component.css']
})


export class Fno9000Component implements AfterViewInit, OnInit, OnDestroy {
  //form: FormGroup;
  title = 'datatables';

  getCaseType:any;selCaseType:any;
  getDateType:any;selDateType:any;
  getJudge:any;
  posts:any;
  search:any;
  masterSelected:boolean;
  checklist:any;
  checkedList:any;
  delValue:any;
  getDep:any;
  getNoticeType:any;
  getNoticeTypeC:any;
  getCaseStatus:any;
  getAccuStatus:any;
  getNoMoney:any;
  getImprison:any;
  imprison_id:any;
  notice_type_id:any;
  dep_id:any;
  sessData:any;
  userData:any;
  programName:any;
  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  numCase:any;
  numNotice:any;
  numLit:any;
  retPage:any;
  myExtObject:any;
  toPage:any="fno0900";
  asyncObservable: Observable<string>;
  result:any = [];
  tmpResult:any = [];
  dataSearch:any = [];
  judge_id:any;
  judge_name:any;
  inter_id:any;
  getInter:any;
  stype:any;
  modalType:any;
  order_by:any="notice_no";
  order:any="ASC";
  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldType:any;
  public listFieldCond:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  public loadModalComponent: boolean = false;
  public loadModalJudgeComponent: boolean = false;

  //@ViewChild('fca0200',{static: true}) fca0200 : ElementRef;
  //@ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  // @ViewChild('fno9000',{static: true}) case_type : ElementRef;
  //@ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private excelService: ExcelService,
    private activatedRoute: ActivatedRoute
  ){ }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 30,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      // order:[2],
      destroy: true
    };
    this.activatedRoute.queryParams.subscribe(params => {
      if(params['program'])
        this.retPage = params['program'];
    });

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.result.c_flag = 1;
    this.result.old_flag = "2";
    this.result.cond1 = "1";
    this.result.cond2 = "1";
    this.result.cond3 = "1";
    this.result.inout_flag = "0";
    this.result.inout = "0";
    this.result.status_id = "0";
    this.result.cancel_flag = "0";
    this.result.no_money = "0";
    // this.result.notice_sdate = myExtObject.curDate();
    // this.result.notice_edate = myExtObject.curDate();
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');

     //======================== pcase_type ======================================
     var student = JSON.stringify({
      "table_name" : "pcase_type",
      "field_id" : "case_type",
      "field_name" : "case_type_desc",
      "order_by": " case_type ASC",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseType = getDataOptions;
        this.selCaseType = $("body").find("ng-select#case_type span.ng-value-label").html();

      },
      (error) => {}
    )


    var student = JSON.stringify({
      "cond":2,
      "userToken" : this.userData.userToken
    });
  this.listTable='pjudge';
  this.listFieldId='judge_id';
  this.listFieldName='judge_name';
  this.listFieldNull='';
  this.listFieldType=JSON.stringify({"type":2});

//console.log(student)

 this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student , {headers:headers}).subscribe(
     (response) =>{
       let productsJson :any = JSON.parse(JSON.stringify(response));
       if(productsJson.data.length){
         this.list=productsJson.data;
         console.log(this.list)
       }else{
          this.list = [];
       }
      //  this.list = response;
      // console.log('xxxxxxx',response)
     },
     (error) => {}
   )

   //======================== pdepartment ======================================
   var student = JSON.stringify({
    "table_name" : "pdepartment",
    "field_id" : "dep_code",
    "field_name" : "dep_name",
    "field_name2" : "print_dep_name",
    "userToken" : this.userData.userToken
  });
  this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
    (response) =>{
      let getDataOptions : any = JSON.parse(JSON.stringify(response));
      this.getDep = getDataOptions;
      this.getDep.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
      console.log(this.getDep)
      // var Dep = this.getDep.filter((x:any) => x.fieldIdValue === this.userData.depCode.toString()) ;
      // if(Dep.length!=0){
      //   this.result.dep_id = this.dep_id = Dep[0].fieldIdValue;
      // }
    },
    (error) => {}
  )

  //======================== pnotice_type ======================================
     var student = JSON.stringify({
    "table_name" : "pnotice_type",
    "field_id" : "notice_type_id",
    "field_name" : "notice_type_name",
    // "field_name2" : "",
    "condition" : " AND (color_flag is null or color_flag = 0)",
    "userToken" : this.userData.userToken
  });

  console.log(student);
  this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
    (response) =>{
      let getDataOptions : any = JSON.parse(JSON.stringify(response));
      this.getNoticeType = getDataOptions;
      console.log(this.getNoticeType);
      // var NoticeType = this.getNoticeType.filter((x:any) => x.fieldIdValue === this.userData.userCode) ;
      // if(Off.length!=0){
      //   this.result.off_id = this.off_id = Off[0].fieldIdValue;
      // }
    },
    (error) => {}
  )

    //======================== pnotice_typeC ======================================
    var student = JSON.stringify({
      "table_name" : "pnotice_type",
      "field_id" : "notice_type_id",
      "field_name" : "notice_type_name",
      // "field_name2" : "",
      "condition" : " AND (color_flag is not null or color_flag > 0)",
      "userToken" : this.userData.userToken
    });

    console.log(student);
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getNoticeTypeC = getDataOptions;
        console.log(this.getNoticeTypeC);
        // var NoticeType = this.getNoticeType.filter((x:any) => x.fieldIdValue === this.userData.userCode) ;
        // if(Off.length!=0){
        //   this.result.off_id = this.off_id = Off[0].fieldIdValue;
        // }
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

//======================== pjail ======================================
var student = JSON.stringify({
  "table_name" : "pjail",
  "field_id" : "jail_id",
  "field_name" : "jail_name",
  "order_by" : "jail_id ASC",
  "userToken" : this.userData.userToken
});
this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
  (response) =>{
    let getDataOptions : any = JSON.parse(JSON.stringify(response));
    this.getImprison = getDataOptions;
    //console.log(getDataOptions)
  },
  (error) => {}
)

//======================== pinter ======================================
var student = JSON.stringify({
  "table_name" : "pinter",
  "field_id" : "inter_id",
  "field_name" : "inter_name",
  "order_by" : "inter_id ASC",
  "userToken" : this.userData.userToken
});
this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
  (response) =>{
    let getDataOptions : any = JSON.parse(JSON.stringify(response));
    this.getInter = getDataOptions;
    //console.log(getDataOptions)
  },
  (error) => {}
)


    //======================== paccu_status ======================================
    var student = JSON.stringify({
      "table_name" : "paccu_status",
      "field_id" : "status_id",
      "field_name" : "status_desc",
      "order_by" : "status_id ASC",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getAccuStatus = getDataOptions;
        //console.log(getDataOptions)
      },
      (error) => {}
    )

     //======================== pjudge ======================================
     var student = JSON.stringify({
      "table_name" : "pjudge",
      "field_id" : "judge_id",
      "field_name" : "judge_name",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getJudge = getDataOptions;
        this.getJudge.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
      },
      (error) => {}
    )
   // this.getConResult = [{id:'',text:''},{id: '1',text: 'จำหน่ายคดี'},{id: '2',text: 'สำเร็จ'},{id: '3',text: 'ไม่สำเร็จ'}];
       this.getNoMoney = [{id:'0',text:'หมายทั้งหมด'},{id:'1',text:'หมายศาล'},{id:'2',text:'หมายนำ'}];
       this.getDateType = [{id:'1',text:'วันที่ออกแดงตั้งแต่'},{id:'2',text:'วันที่แจ้งการอ่านตั้งแต่'}];
       this.result.stype = '1';

       //this.asyncObservable = this.makeObservable('Async Observable');
      this.successHttp();
  }

  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fno9000"
    });
    let promise = new Promise((resolve, reject) => {
      //let apiURL = `${this.apiRoot}?term=${term}&media=music&limit=20`;
      //this.http.get(apiURL)
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen , {headers:headers})
        .toPromise()
        .then(
          res => { // Success
          //this.results = res.json().results;
          let getDataAuthen : any = JSON.parse(JSON.stringify(res));
          console.log(getDataAuthen)
          this.programName = getDataAuthen.programName;
          this.defaultCaseType = getDataAuthen.defaultCaseType;
          this.defaultCaseTypeText = getDataAuthen.defaultCaseTypeText;
          // this.defaultTitle = getDataAuthen.defaultTitle;
          // this.defaultRedTitle = getDataAuthen.defaultRedTitle;
            resolve(res);
          },
          msg => { // Error
            reject(msg);
          }
        );
    });
    return promise;
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    // Destroy the table first
    dtInstance.destroy();
    // Call the dtTrigger to rerender again
    this.dtTrigger.next(null);
      });}

 ngAfterViewInit(): void {
    this.dtTrigger.next(null);
    myExtObject.callCalendar();
     }

  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }

    ngAfterContentInit() : void{
      this.result.cFlag = 1;
      myExtObject.callCalendar();
    }

    // changeNotice(){
    //   window.location.reload;
    // }
      // alert('xxxxx');
     // this.result.notice_type_id
    // $(document).ready(function(){
    //   $('form').find("input[type=textarea], input[type=password], textarea").each(function(ev)
    //   {
    //       if(!$(this).val()) {
    //      $(this).attr("placeholder", "Type your answer here");
    //   }
    //   });
    // });

    loadMyModalComponent(){
      this.loadComponent = false;
      this.loadModalComponent = true;
      $("#exampleModal").find(".modal-body").css("height","100px");
    }

    receiveFuncListData(event:any){
      if(this.modalType==4){
        this.result.result_id = event.fieldIdValue;
        this.result.result_desc = event.fieldNameValue;
      }else if(this.modalType==5){
        this.result.title_id = event.fieldIdValue;
        this.result.title_desc = event.fieldNameValue;
      }
      this.closebutton.nativeElement.click();
      console.log(event)
    }

    // clearsModel(){
    //   this.result.notice_type_id.clearModel();
    // }



    closeModal(){
      $('.modal')
      .find("input[type='text'],input[type='password'],textarea,select")
      .val('')
      .end()
      .find("input[type=checkbox], input[type=radio]")
      .prop("checked", "")
      .end();
    }

    loadTableComponent(val:any){
      this.loadModalComponent = false;
      this.loadComponent = false;
      this.loadModalJudgeComponent = true;
      $("#exampleModal").find(".modal-body").css("height","auto");
   }

  //  tabChange(obj:any){
  //    if(obj.target.value){
  //      this.renderer.setProperty(this.req_title_id.nativeElement['dep_name'],'value', this.list.find((x:any) => x.fieldIdValue === parseInt(obj.target.value)).fieldNameValue);
  //    }else{
  //      this.req_title_id.nativeElement['dep_use'].value="";
  //      this.req_title_id.nativeElement['dep_name'].value="";
  //    }
  //  }

  clickOpenMyModalComponent(val:any){
    this.modalType = val;
    if(this.modalType==1 || this.modalType==2 || this.modalType==3){
      this.loadModalJudgeComponent = true;
      this.loadModalComponent = false;
      this.loadComponent = false;
      var student = JSON.stringify({
        "cond":2,
        "userToken" : this.userData.userToken
      });
      this.listTable='pjudge';
      this.listFieldId='judge_id';
      this.listFieldName='judge_name';
      this.listFieldNull='';
      this.listFieldType=JSON.stringify({"type":2});

      console.log(student)
      let headers = new HttpHeaders();
     headers = headers.set('Content-Type','application/json');

     this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student , {headers:headers}).subscribe(
         (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.data.length){
            this.list = productsJson.data;
            console.log(this.list)
          }else{
            this.list = [];
          }
         },
         (error) => {}
       )
    }else if(this.modalType==4){//ผลคำพิพากษา
      $("#exampleModal").find(".modal-content").css("width","700px");
      var student = JSON.stringify({
        "table_name" : "pjudge_result",
        "field_id" : "result_id",
        "field_name" : "result_desc",
        "search_id" : "",
        "search_desc" : "",
        "condition" : " AND case_type='"+this.result.case_type+"'",
        "userToken" : this.userData.userToken});
      this.listTable='pjudge_result';
      this.listFieldId='result_id';
      this.listFieldName='result_desc';
      this.listFieldNull='';
      this.listFieldCond=" AND case_type='"+this.result.case_type+"'";
    }else if(this.modalType==5){//คำนำหน้าคดี
      $("#exampleModal").find(".modal-content").css("width","700px");
      var student = JSON.stringify({
        "table_name" : "ptitle",
        "field_id" : "title_id",
        "field_name" : "title",
        "search_id" : "",
        "search_desc" : "",
        "condition" : " AND title_flag = 1 AND case_type='"+this.result.case_type+"'",
        "userToken" : this.userData.userToken});
      this.listTable='ptitle';
      this.listFieldId='title_id';
      this.listFieldName='title';
      this.listFieldNull='';
      this.listFieldCond=" AND title_flag = 1 AND case_type='"+this.result.case_type+"'";
    }



    //ส่วนนี้จะใช้กับ popup return ธรรมดา
    if(this.modalType==4 || this.modalType==5){
      this.loadModalComponent = false;
      this.loadComponent = true;
      this.loadModalJudgeComponent = false;
      console.log(student)
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student , {headers:headers}).subscribe(
        (response) =>{
          console.log(response)
          this.list = response;
        },
        (error) => {}
      )
    }
  }

    tabChangeSelect(objName:any,objData:any,event:any,type:any){
      if(typeof objData!='undefined'){
        if(type==1){
          var val = objData.filter((x:any) => x.fieldIdValue === event.target.value) ;
        }else{
            var val = objData.filter((x:any) => x.fieldIdValue === event);
        }
        console.log(objData)
        //console.log(event.target.value)
        //console.log(val)
        if(val.length!=0){
          this.result[objName] = val[0].fieldIdValue;
          this[objName] = val[0].fieldIdValue;
        }else{
          this.result[objName] = null;
          this[objName] = null;
        }
      }else{
        this.result[objName] = null;
        this[objName] = null;
      }
    }

    tabChangeInput(name:any,event:any){
      let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
      if(name=='title_id'){
        var student = JSON.stringify({
          "table_name" : "ptitle",
          "field_id" : "title_id",
          "field_name" : "title",
          "condition" : " AND title_flag = '1' AND case_type ='"+this.result.case_type +"' AND title_id='"+event.target.value+"'",
          "userToken" : this.userData.userToken
        });
        console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
          (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));

            if(productsJson.length){
              this.result.title_desc = productsJson[0].fieldNameValue;
            }else{
              this.result.title_id = null;
              this.result.title_desc = '';
            }
          },
          (error) => {}
        )
      }
      if(name=='result_id'){
        var student = JSON.stringify({
          "table_name" : "pjudge_result",
          "field_id" : "result_id",
          "field_name" : "result_desc",
          "condition" : " AND case_type ='"+this.result.case_type +"' AND result_id='"+event.target.value+"'",
          "userToken" : this.userData.userToken
        });
        console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
          (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));

            if(productsJson.length){
              this.result.result_desc = productsJson[0].fieldNameValue;
            }else{
              this.result.result_id = null;
              this.result.result_desc = '';
            }
          },
          (error) => {}
        )
      }
    }

    receiveJudgeListData(event:any){
      this.result.judge_id = event.judge_id;
      this.result.judge_name = event.judge_name;
      this.closebutton.nativeElement.click();
    }

    searchData(){
      console.log(this.result)
      if(!this.result.case_type &&
        !this.result.old_flag && !this.result.inout_flag && !this.result.c_flag &&
        !this.result.no_money && !this.result.in_out && !this.result.dep_id &&
        !this.result.notice_sdate && !this.result.notice_edate &&
        !this.result.apoint_sdate && !this.result.appoint_edate &&
        !this.result.judge_sdate && !this.result.judge_edate &&
        !this.result.release_sdate && !this.result.release_edate &&
        !this.result.send_sdate && !this.result.send_edate &&
        !this.result.rcvnotice_sdate && !this.result.rcvnotice_edate &&
        !this.result.notice_type_id && !this.result.case_status && !this.result.title_id &&
        !this.result.result_id && !this.result.status_id && !this.result.cancel_flag &&
        !this.result.catch_flag &&  !this.result.chk_q &&  !this.result.f_month &&
        !this.result.givered &&  !this.result.con_app &&  !this.result.last_flag &&
        !this.result.cond1 &&
        !this.result.cond2 &&
        !this.result.cond3){
          const confirmBox = new ConfirmBoxInitializer();
          confirmBox.setTitle('ข้อความแจ้งเตือน');
          confirmBox.setMessage('ป้อนเงื่อนไขเพื่อค้นหา');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){this.SpinnerService.hide();}
            subscription.unsubscribe();
          });
      // }else if((!this.result.notice_sdate && !this.result.notice_edate) || (!this.result.appoint_sdate && !this.result.appoint_edate)){
      //   const confirmBox = new ConfirmBoxInitializer();
      //   confirmBox.setTitle('ข้อความแจ้งเตือน');
      //   confirmBox.setMessage('เลือกวันที่ออกหมาย และ/หรือ วันที่นัดในหมาย');
      //   confirmBox.setButtonLabels('ตกลง');
      //   confirmBox.setConfig({
      //       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      //   });
      //   const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      //     if (resp.success==true){this.SpinnerService.hide();}
      //     subscription.unsubscribe();
      //   });
      }else{

        if((this.result.cond1=='2' || this.result.cond1=='3') && (!this.result.release_sdate || !this.result.release_edate)){
          const confirmBox = new ConfirmBoxInitializer();
         confirmBox.setTitle('ข้อความแจ้งเตือน');
         confirmBox.setMessage('ระบุวันที่ปลดหมายให้ครบถ้วน');
         confirmBox.setButtonLabels('ตกลง');
         confirmBox.setConfig({
             layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
         });
         const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
           if (resp.success==true){this.SpinnerService.hide();}
           subscription.unsubscribe();
         });
         return false;
        }
        if((this.result.cond2=='2' || this.result.cond2=='3') && (!this.result.send_sdate || !this.result.send_edate)){
          const confirmBox = new ConfirmBoxInitializer();
         confirmBox.setTitle('ข้อความแจ้งเตือน');
         confirmBox.setMessage('ระบุวันที่จ่ายหมายให้ครบถ้วน');
         confirmBox.setButtonLabels('ตกลง');
         confirmBox.setConfig({
             layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
         });
         const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
           if (resp.success==true){this.SpinnerService.hide();}
           subscription.unsubscribe();
         });
         return false;
        }
        if((this.result.cond3=='2' || this.result.cond3=='3') && (!this.result.rcvnotice_sdate || !this.result.rcvnotice_edate)){
          const confirmBox = new ConfirmBoxInitializer();
         confirmBox.setTitle('ข้อความแจ้งเตือน');
         confirmBox.setMessage('ระบุวันที่รายงานผลหมายให้ครบถ้วน');
         confirmBox.setButtonLabels('ตกลง');
         confirmBox.setConfig({
             layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
         });
         const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
           if (resp.success==true){this.SpinnerService.hide();}
           subscription.unsubscribe();
         });
         return false;
        }
        this.SpinnerService.show();
        this.tmpResult = this.result;
        var jsonTmp = $.extend({}, this.tmpResult);
        jsonTmp['order_by'] = this.order_by;
        jsonTmp['order'] = this.order;
        jsonTmp['userToken'] = this.userData.userToken;

        /*
        if(jsonTmp.admit_flag== 0) delete jsonTmp.admit_flag;
        if(jsonTmp.case_level== 0) delete jsonTmp.case_level;
        if(jsonTmp.case_yes_no== 0) delete jsonTmp.case_yes_no;
        if(jsonTmp.customer_flag== 0) delete jsonTmp.customer_flag;
        if(jsonTmp.guar_pros== 0) delete jsonTmp.guar_pros;
        if(jsonTmp.prosType== 0) delete jsonTmp.prosType;
        jsonTmp['userToken'] = this.userData.userToken;
        */
        //console.log(jsonTmp)
        // if(jsonTmp.card_type==1){
        //   jsonTmp.id_card = this.idCard0+this.idCard1+this.idCard2+this.idCard3+this.idCard4;
        // }
        // if(jsonTmp.card_type1==1){
        //   jsonTmp.id_card1 = this.idCard0_0+this.idCard1_1+this.idCard2_2+this.idCard3_3+this.idCard4_4;
        // }

        var student = jsonTmp;
        console.log(JSON.stringify(student))
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');

        this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fno9000', student , {headers:headers}).subscribe(
          (response) =>{
              let productsJson : any = JSON.parse(JSON.stringify(response));
              if(productsJson.result==1){

                // var bar = new Promise((resolve, reject) => {
                //   productsJson.data.forEach((ele, index, array) => {
                //         if(ele.indict_desc != null){
                //           if(ele.indict_desc.length > 47 )
                //             productsJson.data[index]['indict_desc_short'] = ele.indict_desc.substring(0,47)+'...';
                //         }
                //         if(ele.deposit != null){
                //           productsJson.data[index]['deposit_comma'] = this.curencyFormat(ele.deposit,2);
                //         }
                //     });
                // });

                // bar.then(() => {
                //   //this.dataSearch = productsJson.data;
                //   //console.log(this.dataSearch)
                // });

                this.dataSearch = productsJson.data;
                this.numNotice = productsJson.data.length;
                this.numCase = productsJson.num_case;
                // this.numCase = productsJson.num_case;
                // this.numLit = productsJson.num_lit;
                //this.dtTrigger.next(null);
                this.rerender();
                console.log(this.dataSearch)
              }else{
                this.dataSearch = [];
                this.rerender();
                // this.numCase = 0;
                // this.numLit = 0;
              }
              console.log(productsJson)
              this.SpinnerService.hide();
          },
          (error) => {}
        )

      }
    }

    curencyFormat(n:any,d:any) {
      return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    }

    directiveDate(date:any,obj:any){
      this.result[obj] = date;
    }

    exportAsXLSX(): void {
      if(this.dataSearch){
        var excel =  JSON.parse(JSON.stringify(this.dataSearch));
        console.log(excel)
        var data = [];var extend = [];
        var bar = new Promise((resolve, reject) => {

          for(var i = 0; i < excel.length; i++){

            // if(excel[i]['num_case']){
            //   excel[i]['numCase'] = excel[i]['num_case'];
            //   excel[i]['numNotice'] = excel.length;
            // }


              //
            // else

            // if(excel[i]['title'] && excel[i]['id'] && excel[i]['yy'])
            //   excel[i]['case_no'] = excel[i]['title']+excel[i]['id']+'/'+excel[i]['yy'];
            // else
            //   excel[i]['case_no'] = "";
            // if(excel[i]['red_title'] && excel[i]['red_title'] && excel[i]['red_title'])
            //   excel[i]['red_no']  = excel[i]['red_title']+excel[i]['red_id']+'/'+excel[i]['red_yy'];
            // else
            //   excel[i]['red_no'] = "";
            // if(excel[i]['date_appoint'])
            //   excel[i]['dateAppoint'] = excel[i]['date_appoint']+"  "+excel[i]['time_appoint'];
            // else
            //   excel[i]['dateAppoint'] = "";
            // if(excel[i]['old_red_no'])
            //   excel[i]['oldCaseNo'] = excel[i]['old_case_no']+" ("+excel[i]['old_red_no']+")";
            // else
            //   excel[i]['oldCaseNo'] = excel[i]['old_case_no'];

            for(var x=0;x<19;x++){
              if(x==0)
                data.push(excel[i]['court_name']);
              if(x==1)
                data.push(excel[i]['black_no']);
              if(x==2)
                data.push(excel[i]['notice_number']);
              if(x==3)
                data.push(excel[i]['notice_type_name']);
              if(x==4)
                data.push(excel[i]['noticeto_name']);
              if(x==5)
                data.push(excel[i]['status_desc']);
              if(x==6)
                data.push(excel[i]['type_date']);
              if(x==7)
                data.push(excel[i]['no_money_desc']);
              if(x==8)
                data.push(excel[i]['release_date']);
              if(x==9)
                data.push(excel[i]['send_date']);
              if(x==10)
                data.push(excel[i]['rcvnotice_date']);
              if(x==12)
                data.push(excel[i]['notice_result_desc']);
              if(x==12)
                data.push(excel[i]['s_officer_name']);
              if(x==13)
                data.push(excel[i]['create_dep_name']);
              if(x==14)
                data.push(excel[i]['create_user']);
              if(x==15)
                data.push(excel[i]['create_date']);
              if(x==16)
                data.push(excel[i]['update_dep_name']);
              if(x==17)
                data.push(excel[i]['update_user']);
              if(x==18)
                data.push(excel[i]['update_date']);
              // if(x==13)
              //   data.push(excel[i]['judge_name']);
              // if(x==14)
              //   data.push(excel[i]['oldCaseNo']);
              // if(x==15)
              //   data.push(excel[i]['admit_desc']);
              // if(x==17)
              //   data.push(excel[i]['transfer_court_name']);
            }

            extend[i] = $.extend([], data)
            data = [];
            //extend[i] = Object.values(data)
          }
        });
        if(bar){
          var objExcel = [];
          objExcel['numCase'] = this.numCase;
          objExcel['numNotice'] = this.numNotice;
          objExcel['data'] = extend;
          console.log(objExcel)
          this.excelService.exportAsExcelFile(objExcel,'fno9000' ,this.programName);
        }

      }else{
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('กรุณาค้นหาข้อมูล');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
      }
    }

    goToPage(run_id:any,notice_running:any){
      let winURL = window.location.href;
      winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+this.toPage+'?run_id='+run_id+'&notice_running='+notice_running;
      //alert(winURL);
      window.open(winURL,'_blank', "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=1200,height=400");
      //myExtObject.OpenWindowMax(winURL+'?run_id='+run_id);
    }

    setCalendar(value:any){
      if(value==1){
        setTimeout(() => {
          myExtObject.callCalendarSet('appoint_sdate');
          myExtObject.callCalendarSet('appoint_edate');
          myExtObject.callCalendarSet('release_sdate');
          myExtObject.callCalendarSet('release_edate');
          myExtObject.callCalendarSet('send_sdate');
          myExtObject.callCalendarSet('send_edate');
          myExtObject.callCalendarSet('rcvnotice_sdate');
          myExtObject.callCalendarSet('rcvnotice_edate');
        }, 200);
      }else{
        setTimeout(() => {
          myExtObject.callCalendarSet('judge_sdate');
          myExtObject.callCalendarSet('judge_edate');
          this.result.notice_type_id.clearModel();
        }, 200);
      }
      this.notice_type_id = "";
      this.result.notice_type_id = null;
    }
  //   retToPage(run_id:any){
  //    let winURL = this.authService._baseUrl;
  //   // winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+this.retPage;
  //   //let winURL = this.authService._baseUrl.substring(0,this.authService._baseUrl.indexOf("#")+1)+'/'+this.retPage;
  //   myExtObject.OpenWindowMax(winURL+'?run_id='+run_id);
  // }

}







