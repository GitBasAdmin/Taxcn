import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Renderer2,Input,Output,EventEmitter,ViewEncapsulation   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
declare var myExtObject: any;
// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
import { PrintReportService } from 'src/app/services/print-report.service';
import { PopupStatComponent } from '@app/components/modal/popup-stat/popup-stat.component';
import { NgbModal, NgbModalRef   } from '@ng-bootstrap/ng-bootstrap';
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-fst2530,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fst2530.component.html',
  styleUrls: ['./fst2530.component.css']
})


export class Fst2530Component implements AfterViewInit, OnInit, OnDestroy {
  //form: FormGroup;
  title = 'datatables';
  toPage1 = 'fst2530';
  posts: any;
  search: any;
  masterSelected: boolean;
  checklist: any;
  checkedList: any;
  delValue: any;
  sessData: any;
  userData: any;
  programName: any;
  defaultCaseType: any;
  defaultCaseTypeText: any;
  defaultTitle: any;
  defaultRedTitle: any;
  myExtObject: any;
  modalType: any;
  result: any = [];
  data: any = [];
  cType: any;
  cTypeData: any;
  case_old: any = [];
  case_new: any = [];
  case_def1_win: any = [];
  case_def2_win: any = [];
  case_def1_win2: any = [];
  case_reconcile: any = [];
  case_cancel: any = [];
  case_dispense: any = [];
  case_dispense_other: any = [];
  case_other: any = [];
  total: any = [];
  total_hold: any = [];
  sum_deposit1: any;


  public list: any;
  public listTable: any;
  public listFieldId: any;
  public listFieldName: any;
  public listFieldName2: any;
  public listFieldNull: any;
  public listFieldCond: any;
  public listFieldType:any;

  asyncObservable: Observable<string>;
  dtOptions: DataTables.Settings = {};
  dtTrigger1: Subject<any> = new Subject<any>();
  dtTrigger2: Subject<any> = new Subject<any>();
  dtTrigger3: Subject<any> = new Subject<any>();
  dtTrigger4: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  public loadModalComponent: boolean = false;
  public loadModalJudgeComponent: boolean = false;

  @ViewChild('openbutton', { static: true }) openbutton: ElementRef;
  @ViewChild('closebutton', { static: true }) closebutton: ElementRef;
  @ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;
  @ViewChild(ModalConfirmComponent) child: ModalConfirmComponent;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private printReportService: PrintReportService,
    private authService: AuthService,
    private renderer: Renderer2,
    private ngbModal: NgbModal
  ) { }


  ngOnInit(): void {
    this.dtOptions = {
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      lengthChange : false,
      info : false,
      paging : false,
      searching : false
    };

    this.sessData = localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.successHttp();
    this.setDefForm();
    // this.getData();

    var student = JSON.stringify({
      "table_name": "pcase_type_stat",
      "field_id": "case_type_stat",
      "field_name": "case_type_stat_desc",
      "condition": "AND case_type=2 ",
      "order_by": " case_type_stat ASC",
      "userToken": this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.cType = getDataOptions;
        this.cTypeData = getDataOptions;

        console.log(this.cType);
      },
      (error) => { }
    )
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    var authen = JSON.stringify({
      "userToken": this.userData.userToken,
      "url_name": "fst2530"
    });
    let promise = new Promise((resolve, reject) => {
      this.http.post('/' + this.userData.appName + 'Api/API/authen', authen, { headers: headers })
        .toPromise()
        .then(
          res => { // Success
            let getDataAuthen: any = JSON.parse(JSON.stringify(res));
            console.log(getDataAuthen)
            this.programName = getDataAuthen.programName;
            this.defaultCaseType = getDataAuthen.defaultCaseType;
            this.defaultCaseTypeText = getDataAuthen.defaultCaseTypeText;
            this.defaultTitle = getDataAuthen.defaultTitle;
            this.defaultRedTitle = getDataAuthen.defaultRedTitle;
            resolve(res);
          },
          msg => { // Error
            reject(msg);
          }
        );
    });
    return promise;
  }

  setDefForm() {
    this.posts =[];
    this.result.off_id = this.userData.userCode;
    this.result.off_name = this.userData.offName;
    this.result.off_post = this.userData.postName;
    this.result.sign_id = this.userData.directorId;
    this.result.sign_name = this.userData.directorName;
    this.result.sign_post = this.userData.directorPostName;
    this.result.stat_year = myExtObject.curYear();
  }

  getData() {
    var student = JSON.stringify({
      "case_type" : 2,
      "stat_year" : "0",
      "userToken" : this.userData.userToken
    });
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiST/API/STAT/fst2530', student ).subscribe(
      (response) =>{
        let alertMessage: any = JSON.parse(JSON.stringify(response));
        if (alertMessage.result == 1) {

          this.posts=alertMessage;
        }else{
          this.posts =[];
        }
      },
      (error) => {}
    )
  }

  tabChangeInput(name:any,event:any){

    if(name=='assign_judge_id' || name=='judge_id' || name=='case_judge_gid' || name=='case_judge_gid2'){
    var student = JSON.stringify({
      "table_name" : "pjudge",
      "field_id" : "judge_id",
      "field_name" : "judge_name",
      "condition" : " AND judge_id='"+event.target.value+"'",
      "userToken" : this.userData.userToken
    });
    console.log(student)
  this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));

        if(productsJson.length){
          if(name=='assign_judge_id'){
            this.result.assign_judge_name = productsJson[0].fieldNameValue;
          }else if(name=='judge_id'){
            this.result.judge_name = productsJson[0].fieldNameValue;
          }else if(name=='case_judge_gid'){
            this.result.case_judge_gname = productsJson[0].fieldNameValue;
          }else if(name=='case_judge_gid2'){
            this.result.case_judge_gname2 = productsJson[0].fieldNameValue;
          }

        }else{
          if(name=='assign_judge_id'){
            this.result.assign_judge_id = null;
            this.result.assign_judge_name = '';
          }else if(name=='judge_id'){
            this.result.judge_id = null;
            this.result.judge_name = '';
          }else if(name=='case_judge_gid'){
            this.result.case_judge_gid = null;
            this.result.case_judge_gname = '';
          }else if(name=='case_judge_gid2'){
            this.result.case_judge_gid2 = null;
            this.result.case_judge_gname2 = '';
          }
        }
      },
      (error) => {}
    )
  }else if(name=='result_id'){
    var student = JSON.stringify({
      "table_name" : "pjudge_result",
      "field_id" : "result_id",
      "field_name" : "result_desc",
      "condition" : " AND result_id='"+event.target.value+"' AND case_type='"+this.result.case_type+"'",
      "userToken" : this.userData.userToken
    });
    console.log(student)
  this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));

        if(productsJson.length){
          this.result.result_desc = productsJson[0].fieldNameValue;

        }else{

          this.result.result_id = '';
          this.result.result_desc = '';
        }
      },
      (error) => {}
    )
  }
}

receiveJudgeListData(event:any){
  if(this.modalType==1){
     this.result.assign_judge_id = event.judge_id;
     this.result.assign_judge_name = event.judge_name;
  }else if(this.modalType==2){
     this.result.judge_id = event.judge_id;
     this.result.judge_name = event.judge_name;
  }else if(this.modalType==3){
    this.result.case_judge_gid = event.judge_id;
    this.result.case_judge_gname = event.judge_name;
  }else if(this.modalType==4){
    this.result.case_judge_gid2 = event.judge_id;
    this.result.case_judge_gname2 = event.judge_name;
  }

  this.closebutton.nativeElement.click();
}


  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger1.next(null);
      this.dtTrigger2.next(null);
      this.dtTrigger3.next(null);
      this.dtTrigger4.next(null);
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger1.next(null);
    this.dtTrigger2.next(null);
    this.dtTrigger3.next(null);
    this.dtTrigger4.next(null);
  }

  ngOnDestroy(): void {
    this.dtTrigger1.unsubscribe();
    this.dtTrigger2.unsubscribe();
    this.dtTrigger3.unsubscribe();
    this.dtTrigger4.unsubscribe();
  }

  ngAfterContentInit(): void {
    myExtObject.callCalendar();
  }

  directiveDate(date: any, obj: any) {
    this.result[obj] = date;
  }

  searchData() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!this.result.judge_id || !this.result.start_date || !this.result.end_date){
      confirmBox.setMessage('กรุณาเลือกข้อมูลผู้พิพากษาและวันที่ให้ครบถ้วน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
        }
        subscription.unsubscribe();
      });
    }else{
      this.SpinnerService.show();

      var student = JSON.stringify({
        "judge_id" : this.result.judge_id,
        "start_date" : this.result.start_date,
        "end_date" : this.result.end_date,
        "userToken" : this.userData.userToken
      });
      console.log(student);
      this.http.disableLoading().post('/' + this.userData.appName + 'ApiST/API/STAT/fst2530', student).subscribe(
        (response) => {
          let alertMessage: any = JSON.parse(JSON.stringify(response));
          if (alertMessage.result == 0) {
            this.SpinnerService.hide();
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) { }
              subscription.unsubscribe();
            });
          } else {

            this.posts = alertMessage;
            this.assingData(this.posts);
            console.log('posts=>');
            console.log(this.posts);

            this.SpinnerService.hide();
          }
        },
        (error) => { this.SpinnerService.hide(); }
      )
    }
  }

  submitModalForm() {
  }

  processForm() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(!this.result.stat_year){
      confirmBox.setMessage('กรุณาเลือกปีสถิติ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
        }
        subscription.unsubscribe();
      });
    }else{
      this.SpinnerService.show();

      var student = JSON.stringify({
        "judge_id" : this.result.judge_id,
        "start_date" : this.result.start_date,
        "end_date" : this.result.end_date,
        "userToken" : this.userData.userToken
      });
      console.log(student);
      this.http.disableLoading().post('/' + this.userData.appName + 'ApiST/API/STAT/fst2530/getStatData', student).subscribe(
        (response) => {
          let alertMessage: any = JSON.parse(JSON.stringify(response));
          if (alertMessage.result == 0) {
            this.SpinnerService.hide();
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) { }
              subscription.unsubscribe();
            });
          } else {
            this.posts = alertMessage;
            this.assingData(this.posts);
            console.log('posts=>');
            console.log(this.posts);
            this.SpinnerService.hide();

            // this.SpinnerService.hide() ปิดที่ assingData
          }
        },
        (error) => { this.SpinnerService.hide(); }
      )
    }
  }

  assingData(productsJson :any){
    // this.setDefForm();
    // this.posts = productsJson;

    // data1
    this.posts.data1.forEach((ele, i, array) => {
      ele.total = this.assignValue(ele.nover3m) + this.assignValue(ele.over3m_nover6m) + this.assignValue(ele.over6m_nover1y) +
      this.assignValue(ele.over1y_nover2y) + this.assignValue(ele.over2y) ;
      if(ele.sum_deposit != null ){
        ele.sum_deposit = this.curencyFormat(ele.sum_deposit,2);
      }
     });

    //data2
    // this.posts.data2.forEach((ele, i, array) => {
    //   ele.total2 = this.assignValue(ele.nodeposit) +
    //   this.assignValue(ele.nover50t) + this.assignValue(ele.over50t_nover300t) + this.assignValue(ele.over300t_nover500t) +
    //   this.assignValue(ele.over500t_nover1m) + this.assignValue(ele.over1m_nover5m) + this.assignValue(ele.over5m_nover10m) +
    //   this.assignValue(ele.over10m_nover50m) + this.assignValue(ele.over50m_nover100m)+ this.assignValue(ele.over100m) ;

    //   // this.posts.data3[i].nodeposit_txt = ele.nodeposit_txt;
    // });

    //data3
    // this.sum_deposit1=0;
    // this.posts.data3.forEach((ele, i, array) => {
    //   this.sum_deposit1 +=this.assignValueFloat(ele.deposit1);
    //   ele.deposit1 = this.curencyFormat(this.assignValueFloat(ele.deposit1),2);
    // });
    // this.sum_deposit1 = this.curencyFormat(this.sum_deposit1,2);

    setTimeout(() => {
      this.SpinnerService.hide();
    }, 500);
  }

  calHold1(i:any){

      this.posts.data1[i].total1 = this.assignValue( this.posts.data1[i].case_def1_win) + this.assignValue( this.posts.data1[i].case_def1_win2) + this.assignValue( this.posts.data1[i].case_def2_win) +
      this.assignValue( this.posts.data1[i].case_reconcile) + this.assignValue( this.posts.data1[i].case_cancel) + this.assignValue( this.posts.data1[i].case_dispense) +
      this.assignValue( this.posts.data1[i].case_dispense_other) + this.assignValue( this.posts.data1[i].case_other) ;

      this.posts.data1[i].total_hold = this.assignValue( this.posts.data1[i].case_new) + this.assignValue( this.posts.data1[i].case_old) - this.assignValue( this.posts.data1[i].total1);
  }

  calHold2(i:any){
      this.posts.data2[i].total2 = this.assignValue(this.posts.data2[i].nodeposit) +
      this.assignValue(this.posts.data2[i].nover50t) + this.assignValue(this.posts.data2[i].over50t_nover300t) + this.assignValue(this.posts.data2[i].over300t_nover500t) +
      this.assignValue(this.posts.data2[i].over500t_nover1m) + this.assignValue(this.posts.data2[i].over1m_nover5m) + this.assignValue(this.posts.data2[i].over5m_nover10m) +
      this.assignValue(this.posts.data2[i].over10m_nover50m) + this.assignValue(this.posts.data2[i].over50m_nover100m)+ this.assignValue(this.posts.data2[i].over100m) ;
  }

  calHold3(){
    this.sum_deposit1=0;
    this.posts.data3.forEach((ele, i, array) => {
      var tmp =this.curencyFormatRemove(ele.deposit1);
      console.log(this.assignValueFloat(tmp));
      this.sum_deposit1 +=this.assignValueFloat(tmp);
    });
    this.sum_deposit1 = this.curencyFormat(this.sum_deposit1,2);
  }

  assignValue(num:any){
    if((num == undefined) || (num == "") || (num == null))
      return 0;
    else
      return parseInt(num);
  }

  assignValueFloat(num:any){
    if((num == undefined) || (num == "") || (num == null))
      return 0;
    else
      return parseFloat(num);
  }

  curencyFormat(n:any,d:any) {
    return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  }

  curencyFormatRemove(val: number): string {
    if (val !== undefined && val !== null) {
      return val.toString().replace(/,/g, "");
    } else {
      return "";
    }
  }

  saveForm() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    this.SpinnerService.show();
    var data =  this.posts;

    // data.data3.forEach((ele, i, array) => {
    //   ele.deposit1 = this.curencyFormatRemove(ele.deposit1);
    // });

    data['judge_id'] = this.result.judge_id;
    data['start_date'] = this.result.start_date;
    data['end_date'] = this.result.end_date;
    data['userToken'] = this.userData.userToken;
    console.log("student=>", data);
    this.http.disableLoading().post('/' + this.userData.appName + 'ApiST/API/STAT/fst2530/saveData', data).subscribe(
      (response) => {
        let alertMessage: any = JSON.parse(JSON.stringify(response));
        if (alertMessage.result == 0) {
          this.SpinnerService.hide();
          confirmBox.setMessage(alertMessage.error);
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success == true) { }
            subscription.unsubscribe();
          });
        } else {
          this.SpinnerService.hide();
          confirmBox.setMessage('ข้อความแจ้งเตือน');
          confirmBox.setMessage(alertMessage.error);
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success == true) {
              this.searchData();
            }
            subscription.unsubscribe();
          });
        }
      },
      (error) => { this.SpinnerService.hide(); }
    )
  }

  clickOpenMyModalComponent(type: any) {
    this.modalType = type;
    this.openbutton.nativeElement.click();
  }

  loadMyModalComponent(){
    if(this.modalType==1 || this.modalType==2 || this.modalType==3 || this.modalType==4){
      this.loadModalJudgeComponent = true;
      // this.loadModalJudgeComponentArry = false;
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

     this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student ).subscribe(
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
    }else if(this.modalType==5){//ผลคำพิพากษา
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
    }else if(this.modalType==6){
      // alert(this.modalType)
      $("#exampleModal").find(".modal-content").css("width","650px");
      this.loadModalJudgeComponent = false;
          this.loadModalComponent = true;
      this.loadComponent = false;
    }

    //ส่วนนี้จะใช้กับ popup return ธรรมดา
    if(this.modalType==5){
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

  receiveFuncListData(event: any) {
    if (this.modalType == 1) {
      this.result.off_id = event.fieldIdValue;
      this.result.off_name = event.fieldNameValue;

      this.getId(event.fieldIdValue, this.modalType);
    } else if (this.modalType == 2) {
      this.result.sign_id = event.fieldIdValue;
      this.result.sign_name = event.fieldNameValue;

      this.getId(event.fieldIdValue, this.modalType);
    }
    this.closebutton.nativeElement.click();
  }

  getId(id: any, type: any) {
    if (type == 1 || type == 2) {
      var student = JSON.stringify({
        "table_name": "pofficer",
        "field_id": "off_id",
        "field_name": "off_name",
        "field_name2": "post_id",
        "condition": " AND off_id='" + id + "' ",
        "userToken": this.userData.userToken
      });
    } else if (type == 3) {
      var student = JSON.stringify({
        "table_name": "pjudge",
        "field_id": "judge_id",
        "field_name": "judge_name",
        "field_name2": "post_id",
        "condition": " AND judge_id='" + id + "' ",
        "userToken": this.userData.userToken
      });
    }
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        if (getDataOptions.length) {
          this.getPost(getDataOptions[0].fieldNameValue2, type);
        }
      },
      (error) => { }
    )
  }

  getPost(post_id: any, modalType: any) {
    if (post_id) {
      var student = JSON.stringify({
        "table_name": "pposition",
        "field_id": "post_id",
        "field_name": "post_name",
        "condition": " AND post_id='" + post_id + "'",
        "userToken": this.userData.userToken
      });
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          if (modalType == 1) {
            if (productsJson.length) {
              this.result.off_post = productsJson[0].fieldNameValue;
            } else {
              this.result.off_post = '';
            }
          } else if (modalType == 2) {
            if (productsJson.length) {
              this.result.sign_post = productsJson[0].fieldNameValue + this.userData.courtName;
            } else {
              this.result.sign_post = '';
            }
          } else if (modalType == 3) {
            if (productsJson.length) {
              this.result.report_judge_post = productsJson[0].fieldNameValue + this.userData.courtName;
            } else {
              this.result.report_judge_post = '';
            }
          }
        },
        (error) => { }
      )
    } else {
      if (modalType == 1)
        this.result.off_post = '';
      else if (modalType == 2)
        this.result.sign_post = '';
      else if (modalType == 3)
        this.result.report_judge_post = '';
    }
  }

  closeModal() {
    this.loadComponent = false;
    this.loadModalComponent = false;
  }

  tabChangeSelect(objId: any, objName: any, objPost: any, event: any) {
    if (objId == "off_id" || objId == "sign_id") {
      var student = JSON.stringify({
        "table_name": "pofficer",
        "field_id": "off_id",
        "field_name": "off_name",
        "field_name2": "post_id",
        "condition": " AND off_id='" + event.target.value + "' ",
        "userToken": this.userData.userToken
      });
    }
    // console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        if (getDataOptions.length) {
          this.result[objId] = getDataOptions[0].fieldIdValue;
          this.result[objName] = getDataOptions[0].fieldNameValue;

          if (objId == "off_id")
            this.getPost(getDataOptions[0].fieldNameValue2, 1);
          else if (objId == "sign_id")
            this.getPost(getDataOptions[0].fieldNameValue2, 2);
        } else {
          this.result[objId] = "";
          this.result[objName] = "";
        }
      },
      (error) => { }
    )
  }

  printReport() {
    var rptName = 'rst2530';
    var paramData = '{}';
    var paramData = JSON.stringify({
      // "pcase_type" : '2',
      "pjudge_id": this.result.judge_id ? this.result.judge_id.toString() : '',
      "pdate_start": this.result.start_date ? myExtObject.conDate(this.result.start_date) : '',
      "pdate_end": this.result.end_date ? myExtObject.conDate(this.result.end_date) : '',
     });
    console.log("paramData->", paramData);
    this.printReportService.printReport(rptName, paramData);
  }

  ClearAll() {
    let winURL = window.location.href.split("/#/")[0] + "/#/";
    location.replace(winURL + this.toPage1)
    window.location.reload();
  }

  showCaseAll(item:any){
    if(item){
      const modalRef: NgbModalRef = this.ngbModal.open(PopupStatComponent,{ windowClass: 'my-class'})
      modalRef.componentInstance.items = item
    }
  }

  closeWindow() {
    if (window.close() == undefined) {
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('ไม่พบหน้าจอหลัก ไม่สามารถปิดหน้าจอได้');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    }
    else
      window.close();
  }

  confirmData(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    console.log(this.posts)
    if(!this.posts.judge_id  || !this.posts.start_date  || !this.posts.end_date || !this.posts.create_user){
      confirmBox.setMessage('กรุณาประมวลผลและจัดเก็บ ก่อนการยืนยันข้อมูลส่งผู้บริหารตรวจ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else{
      confirmBox.setMessage('ยืนยันข้อมูลส่งผู้บริหารตรวจ');
      confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          this.SpinnerService.show();
          
          var student = JSON.stringify({
            "judge_id" : this.posts.judge_id,
            "start_date" : this.posts.start_date,
            "end_date" : this.posts.end_date,
            "userToken" : this.userData.userToken
          });
          this.http.post('/' + this.userData.appName + 'ApiST/API/STAT/fst2530/confirmData', student).subscribe(
            (response) => {
              let alertMessage: any = JSON.parse(JSON.stringify(response));
              if (alertMessage.result == 1) {
                confirmBox.setMessage(alertMessage.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                    this.SpinnerService.hide();
                    this.posts.confirm_user=alertMessage.confirm_user;
                    this.posts.confirm_date=alertMessage.confirm_date;
                  }
                  subscription.unsubscribe();
                });
              }else{
                this.SpinnerService.hide();
                confirmBox.setMessage(alertMessage.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                  }
                  subscription.unsubscribe();
                });
              }
            },
            (error) => { this.SpinnerService.hide(); }
          )
        }
        subscription.unsubscribe();
      });
    }
    
  }

  cancelData(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!this.posts.judge_id  || !this.posts.start_date  || !this.posts.end_date || !this.posts.create_user){
      confirmBox.setMessage('กรุณาประมวลผลและจัดเก็บ ก่อนการยืนยันข้อมูลส่งผู้บริหารตรวจ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else{
      confirmBox.setMessage('ยืนยันยกเลิกยืนยันข้อมูล');
      confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        subscription.unsubscribe();
        if (resp.success==true){

          this.SpinnerService.show();

          var student = JSON.stringify({
            "judge_id" : this.posts.judge_id,
            "start_date" : this.posts.start_date,
            "end_date" : this.posts.end_date,
            "userToken" : this.userData.userToken
          });
          this.http.post('/' + this.userData.appName + 'ApiST/API/STAT/fst2530/cancelData', student).subscribe(
            (response) => {
              let alertMessage: any = JSON.parse(JSON.stringify(response));
              if (alertMessage.result == 1) {
                confirmBox.setMessage(alertMessage.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                    this.SpinnerService.hide();
                    this.posts.confirm_user="";
                    this.posts.confirm_date="";
                  }
                  subscription.unsubscribe();
                });
              }else{
                this.SpinnerService.hide();
                confirmBox.setMessage(alertMessage.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                  }
                  subscription.unsubscribe();
                });
              }
            },
            (error) => { this.SpinnerService.hide(); }
          )
        }
      });
    }
  }
}
