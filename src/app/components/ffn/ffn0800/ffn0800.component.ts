import { DatalistReturnComponent } from './../../modal/datalist-return/datalist-return.component';
import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,AfterContentInit,ViewChildren, QueryList,Output,EventEmitter   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import {Observable,of, Subject  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { catchError, map , } from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { PrintReportService } from '@app/services/print-report.service';
import { NgSelectComponent } from '@ng-select/ng-select';
declare var myExtObject: any;
import {
  CanDeactivate, Router, ActivatedRoute, NavigationStart,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  NavigationError,Routes
}from '@angular/router'

@Component({
  selector: 'app-ffn0800,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './ffn0800.component.html',
  styleUrls: ['./ffn0800.component.css']
})


export class Ffn0800Component implements AfterViewInit, OnInit, OnDestroy,AfterContentInit {
  //form: FormGroup;
  title = 'datatables';

  posts:any = [];
  search:any;
  masterSelected:boolean;
  checklist:any;
  checkedList:any;
  delValue:any;
  sessData:any;
  userData:any;
  programName:any;
  dataHead:any = [];
  result:any = [];
  checkObj:any = [];
  paybackObj:any = [];
  modalType:any;
  cancelTypeFlag:any;
  logRemark:any;
  indexDelete:any;
  myExtObject: any;
  sLitType:any;
  runId:any;
  run_id:any;

  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  asyncObservable: Observable<string>;


  getAttorneyType:any;
  getTypeId:any;
  getPermitFlag:any;
  getReceiveType:any;
  getBankId:any;
  getBankId2:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;

  public loadModalComponent: boolean = false;
  public loadComponent : boolean = false; 
  public loadReqLawyerComponent : boolean = false;
  public loadModalAppNextComponent : boolean = false;
  public loadPopupPrintChequeComponent : boolean = false;
  
 
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  dataHeadValue: any;


  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private printReportService: PrintReportService,
    private activatedRoute : ActivatedRoute
  ){ }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 999,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[]
    };

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

    this.activatedRoute.queryParams.subscribe(params => {
      if(params['run_id']){
        this.runId = params['run_id'];
      }
    });

    this.successHttp();
    this.setDefForm(1);
    this.getData();
    
    //======================== plit_type ======================================
    var student = JSON.stringify({
      "table_name"  : "plit_type",
      "field_id"    : "lit_type",
      "field_name"  : "lit_type_desc",
      "condition"   : " AND lit_type_desc LIKE \'%ทนาย%\' ",
      "userToken"   : this.userData.userToken
    });
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getAttorneyType = getDataOptions;
      },
      (error) => {}
    )

    //======================== pbank ======================================
    var student = JSON.stringify({
      "table_name"  : "pbank",
      "field_id"    : "bank_id",
      "field_name"  : "bank_name",
      "userToken"   : this.userData.userToken
    });
    // console.log(student);
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getBankId = getDataOptions;
        this.getBankId2 = getDataOptions;
      },
      (error) => {}
    )

    this.getTypeId = [ {fieldIdValue:'',fieldNameValue: ''},{fieldIdValue:1,fieldNameValue: '1-โทษประหารชีวิต'}, {fieldIdValue:2,fieldNameValue: '2-จำคุกเกิน 10 ปี แต่ไม่ประหารชีวิต'}, {fieldIdValue:3,fieldNameValue: '3-นอกเหนือจาก 1 และ 2'}];
    this.getPermitFlag = [ {fieldIdValue:1,fieldNameValue: 'อนุญาต'}, {fieldIdValue:2,fieldNameValue: 'ไม่อนุญาต'}];
    this.getReceiveType =  [ {fieldIdValue:1,fieldNameValue: 'จ่ายด้วยเช็ค'}, {fieldIdValue:2,fieldNameValue: 'โอนเงินเข้าบัญชี'}];
  }

  successHttp() {
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "ffn0800"
    });
    let promise = new Promise((resolve, reject) => {
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen).toPromise().then(
          res => { // Success
          //this.results = res.json().results;
          let getDataAuthen : any = JSON.parse(JSON.stringify(res));
          // console.log(getDataAuthen)
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

  setDefForm(event:any){
    this.result=[];this.paybackObj =[];this.checkObj=[];
    this.result.attorney_type = 10;//ทนาย
    this.result.rcv_running = 0;
    this.result.fileWord = 0;
    this.result.receive_type = 1;
    this.result.type_id = 3;
    this.result.attorney_amt = '0.00';
    this.paybackObj.payback_rcv_amt = '0.00';
    this.result.req_date = myExtObject.curDate();
  }

  getData(){
    // if(this.runId){
    if(typeof this.runId != "undefined"){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');

      this.SpinnerService.show();

      if(typeof this.runId === 'object'){
        this.runId = this.runId['run_id'];
      }else{
          this.run_id=this.runId;
      }

      var student = JSON.stringify({
        "run_id" : this.runId,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.disableLoading().post('/'+this.userData.appName+'ApiFN/API/FINANCE/ffn0800/getData', student).subscribe(posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          console.log("getData=>",productsJson)
          this.posts = productsJson.data;
          if(productsJson.result==1){
            productsJson.data.forEach((ele, index, array) => {
              if(productsJson.data[index]['receive_type']==1){
                if(productsJson.data[index]['checkObj'][0].check_amt, 2)
                  this.posts[index]['checkObj'][0].check_amt = this.curencyFormat(productsJson.data[index]['checkObj'][0].check_amt, 2);
                else
                  this.posts[index]['checkObj'][0].check_amt = '0.00';

              }else if(productsJson.data[index]['receive_type']==2){
                if(productsJson.data[index]['paybackObj'][0].payback_rcv_amt)
                  this.posts[index]['paybackObj'][0].payback_rcv_amt = this.curencyFormat(productsJson.data[index]['paybackObj'][0].payback_rcv_amt, 2);
                else
                  this.posts[index]['paybackObj'][0].payback_rcv_amt='0.00';
              }   
           });
            this.rerender();
          }else{
            confirmBox.setMessage(productsJson.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){}
              subscription.unsubscribe();
            });
          }
          this.SpinnerService.hide();
      });
    }else{
      this.posts = [];
    }
  }

  rerender(): void {
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      if(dtElement.dtInstance)
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();          
      });
    });
    this.dtTrigger.next(null);
  }

 ngAfterViewInit(): void {
    this.dtTrigger.next(null);
     }

  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }

  ngAfterContentInit() : void{

  }

  directiveDate(date:any,obj:any){
    this.result[obj] = date;
  }

  directiveDateCheck(date:any,obj:any){
    this.checkObj[obj] = date;
  }

  directiveDatePayback(date:any,obj:any){
    this.paybackObj[obj] = date;
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

  cancelFlag(){
    this.modalType="";
    this.cancelTypeFlag = 3;
    const confirmBox = new ConfirmBoxInitializer();
    // this.openbutton.nativeElement.click();
  }

  closeModal(){
    this.loadModalComponent = false; 
          this.loadComponent = false;
          this.loadReqLawyerComponent = false;
          this.loadModalAppNextComponent = false;
          this.loadPopupPrintChequeComponent = false;
  }

  goToLink(url: string){
    window.open(url, "_blank");
  }

  clickOpenMyModalComponent(type:any){
    if((type==1 || type==2) && !this.runId){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาค้นหาข้อมูลเลขดคี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          this.modalType = "";
        }
        subscription.unsubscribe();
      });
    }else{
      this.modalType=type;
      this.openbutton.nativeElement.click();
    }
  }

  loadMyModalComponent(){

    if(this.modalType==1){
      var student = JSON.stringify({
        "table_name": "pcase_litigant",
        "field_id": "seq",
        "field_name": "CONCAT(title || name || ' ' || seq, '') AS fieldNameValue",
        "field_name2": "license_no",
        "search_id": "",
        "search_desc": "",
        "condition": " AND run_id="+this.runId+" AND lit_type=10 ",
        "userToken" : this.userData.userToken
      }); 

      this.listTable='pcase_litigant';
      this.listFieldId='seq';
      this.listFieldName="CONCAT(title || name || ' ' || seq, '') AS fieldNameValue";
      this.listFieldName2="license_no";
      this.listFieldCond=" AND run_id="+this.runId+" AND lit_type=10 ";

      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student ).subscribe(

        (response) =>{
          this.list = response;
          this.loadModalComponent = false; 
          this.loadComponent = true;
          this.loadReqLawyerComponent = false;
          this.loadModalAppNextComponent = false;
          this.loadPopupPrintChequeComponent = false;

          $("#exampleModal").find(".modal-body").css("height","auto");
        },
        (error) => {}
      )
    }else if(this.modalType==2){
      var student = JSON.stringify({
        "req_lawyer" : 1,
        "userToken" : this.userData.userToken
      }); 
     
      this.loadModalComponent = false; 
      this.loadComponent = false;
      this.loadReqLawyerComponent = true;
      this.loadModalAppNextComponent = false;
      this.loadPopupPrintChequeComponent = false;

      $("#exampleModal").find(".modal-content").css("width","800px");



    }else if(this.modalType == 'deleteRow'){
      this.loadModalComponent = true; 
      this.loadComponent = false;
      this.loadReqLawyerComponent = false;
      this.loadModalAppNextComponent = false;
      this.loadPopupPrintChequeComponent = false;

      $("#exampleModal").find(".modal-content").css("width","600px");
    }
 }

 popupAppointNext(){
    this.openbutton.nativeElement.click();
    this.loadModalComponent = false; 
    this.loadComponent = false;
    this.loadReqLawyerComponent = false;
    this.loadModalAppNextComponent = true;
    this.loadPopupPrintChequeComponent = false;

    $("#exampleModal").find(".modal-content").css("width","850px");
  }

popupPrintCheque(){
  this.openbutton.nativeElement.click();
    this.loadModalComponent = false; 
    this.loadComponent = false;
    this.loadReqLawyerComponent = false;
    this.loadModalAppNextComponent = false;
    this.loadPopupPrintChequeComponent = true;

    $("#exampleModal").find(".modal-content").css("width","350px");
  
  } 

 receiveFuncListData(event:any){
  this.result.lawyer_id = event.fieldIdValue;
  this.result.lawyer_name = event.fieldNameValue;
  this.result.license_no = event.fieldNameValue2;
  this.closebutton.nativeElement.click();
 }

  receiveFuncLitReqData(event:any){
    this.result.lawyer_id = event.lawyer_id;
    this.result.lawyer_name = event.lawyer_name;
    this.result.license_no = event.license_no;
    this.closebutton.nativeElement.click();
  }

  receiveFuncPrintCheque(event:any){
    this.closebutton.nativeElement.click();
    this.printCheque(event);
  }

  printCheque(event:any){//พิมพ์เช็ค
    var rptName = 'rfn0601';
    if(!this.checkObj.payback_running)
      this.checkObj.payback_running = "";

    var paramData = JSON.stringify({
      "ppayback_running" : this.checkObj.payback_running,
      "pbook_no" : this.checkObj.book_no,
      "pcheck_no" : this.checkObj.check_no,
      "ppay" : event.ppay,
      "pmark" : event.pmark,
      "pcase" : event.pcase,
      "pdate" : event.pdate,
      "pbank" : event.pbank
      // ,"pline" : event.pline,
      // "pline_unit" : event.pline_unit
    });
    console.log(paramData);
    this.printReportService.printReport(rptName,paramData);
  }

  //-----head ข้อมูลเลขคดี
  fnDataHead(event:any){
    this.dataHead = event;
    if(this.dataHead.buttonSearch==1){
      this.runId = this.dataHead.run_id;
      this.runId = {'run_id' : event.run_id,'counter' : Math.ceil(Math.random()*10000),'notSearch':1}
      this.ngOnInit();
    }
  }

  submitForm() {
  
    this.SpinnerService.show();
    if(this.result.receive_type == 1){//จ่ายด้วยเช็ค
      this.paybackObj = [];
      this.result.attorney_amt = Number(this.curencyFormatRemove(this.result.attorney_amt));
    }else if(this.result.receive_type == 2){//โอนเงินเข้าบัญชี
      this.checkObj = [];
      this.paybackObj.payback_rcv_amt = Number(this.curencyFormatRemove(this.paybackObj.payback_rcv_amt));
      this.result.attorney_amt = Number(this.curencyFormatRemove(this.paybackObj.payback_rcv_amt));
    }
    
    this.result['run_id'] = this.runId;
    this.result['userToken'] = this.userData.userToken;
    var student = $.extend({},this.result);
    student['checkObj']=[];
    student['paybackObj']=[];
    if(this.result.receive_type == 1){
      student['checkObj'].push($.extend({},this.checkObj));
    }
    if(this.result.receive_type == 2){
      student['paybackObj'].push($.extend({},this.paybackObj));
    }
     console.log("student=>",student);
    this.http.disableLoading().post('/'+this.userData.appName+'ApiFN/API/FINANCE/ffn0800/saveData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        if(getDataOptions.result==0){
          const confirmBox = new ConfirmBoxInitializer();
          confirmBox.setTitle('ข้อความแจ้งเตือน');
          confirmBox.setMessage(getDataOptions.error);
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){
              this.SpinnerService.hide();
            }
            subscription.unsubscribe();
          });
        }else{
          const confirmBox = new ConfirmBoxInitializer();
          confirmBox.setTitle('ข้อความแจ้งเตือน');
          confirmBox.setMessage(getDataOptions.error);
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){
              this.SpinnerService.hide();
            }
            subscription.unsubscribe();
            this.result.rcv_running = getDataOptions.rcv_running;
            this.getData();
          });
        }
      },
      (error) => {this.SpinnerService.hide();}
    )
  }
  checkForm(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    
    if(!this.runId){
      confirmBox.setMessage('กรุณาระบุข้อมูลคดีก่อนบันทึก');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
        }
        subscription.unsubscribe();
      });
    }else if(!this.result.req_date) {
      confirmBox.setMessage('กรุณาระบุวันที่รับคำร้อง');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
        }
        subscription.unsubscribe();
      });
    }else if(!this.result.type_id){
      confirmBox.setMessage('กรุณาระบุประเภทคดี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
        }
        subscription.unsubscribe();
      });
    }else if((this.result.receive_type == 1)&& (!this.checkObj.bank_id)){
      confirmBox.setMessage('กรุณาระบุธนาคาร');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
        }
        subscription.unsubscribe();
      });
    }else if((this.result.receive_type == 1)&& (!this.checkObj.check_no)){
      confirmBox.setMessage('กรุณาระบุเลขที่เช็ค');
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
      if((this.result.receive_type == 1)&& (!this.checkObj.checkrcv_date)){
        confirmBox.setMessage('กรุณาระบุวันที่รับเช็ค');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){
            this.submitForm();
            subscription.unsubscribe();
          }
        });
      }else{
        this.submitForm();
      }
    }
  }

  deleteData(index:any){ 
    const confirmBox = new ConfirmBoxInitializer();
    this.indexDelete=index;
    this.modalType="deleteRow";
    this.openbutton.nativeElement.click();
  }

  ClearAll(){
    window.location.reload();
  }

  editData(index:any){
    this.SpinnerService.show();

    this.runId = this.posts[index]['run_id'];
    this.result = this.posts[index];
    var receive_type = this.getReceiveType.filter((x:any) => x.fieldIdValue === parseInt(this.posts[index]['receive_type']));
    if(receive_type.length){
      this.getReceiveType = receive_type
    }

    if(this.posts[index]['checkObj'].length > 0){
      this.checkObj = this.posts[index]['checkObj'][0];
      this.result.attorney_amt = this.posts[index]['checkObj'][0].check_amt;
      this.checkObj.checkrcv_date = this.posts[index].checkrcv_date;
    }else if(this.posts[index]['paybackObj'].length > 0){
      this.paybackObj = this.posts[index]['paybackObj'][0];

      if(this.posts[index]['paybackObj'][0].bank_id == 0)
        this.paybackObj.bank_id = '';
    } 

    setTimeout(() => {
      this.SpinnerService.hide();
    }, 500);
  }

  submitModalForm(){
    var chkForm = JSON.parse(this.child.ChildTestCmp());

    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!chkForm.password){
      confirmBox.setMessage('กรุณาป้อนรหัสผ่าน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){ }
        subscription.unsubscribe();
      });

    }else if(!chkForm.log_remark){
      confirmBox.setMessage('กรุณาป้อนเหตุผล');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else{
      var student = JSON.stringify({
        "user_running" : this.userData.userRunning,
        "password" : chkForm.password,
        "log_remark" : chkForm.log_remark,
        "userToken" : this.userData.userToken
      });
      this.http.post('/'+this.userData.appName+'Api/API/checkPassword', student).subscribe(
        posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          if(productsJson.result==1){
            const confirmBox = new ConfirmBoxInitializer();
              confirmBox.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
              confirmBox.setMessage('ยืนยันการลบข้อมูลที่เลือก');
              confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
              // Choose layout color type
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                if(this.indexDelete >= 0 && this.posts[this.indexDelete]['rcv_running'] != ""){
                  var dataDel = [],dataTmp=[];
                  var bar = new Promise((resolve, reject) => {
                      dataTmp.push(this.posts[this.indexDelete]);
                  });
                  if(bar){
                    dataDel['userToken'] = this.userData.userToken;
                    dataDel['log_remark'] = chkForm.log_remark;
                    dataDel['data']= dataTmp;
                    var data = $.extend({}, dataDel);
                    // console.log("dataDel", data);
                    this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/ffn0800/delData', data).subscribe(
                    (response) =>{
                      let alertMessage : any = JSON.parse(JSON.stringify(response));
                      if(alertMessage.result==0){
                        this.SpinnerService.hide();
                      }else{
                        this.closebutton.nativeElement.click();
                        this.modalType="";
                        this.indexDelete="";
                        this.ngOnInit();
                      }
                    },
                      (error) => {this.SpinnerService.hide();}
                    )
                  }
                }
              }
              subscription.unsubscribe();
            });
          }else{
            confirmBox.setMessage(productsJson.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){}
              subscription.unsubscribe();
            });
          }
        },
        (error) => {}
      );
    }
  }

  deleteWord(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    confirmBox.setMessage('ต้องการลบใบเสร็จหรือไม่');
    confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
      // Choose layout color type
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        
        if (resp.success==true){
          this.SpinnerService.hide();

          var student = JSON.stringify({
          "rcv_running" : this.result.rcv_running,
          "userToken" : this.userData.userToken
          });
          // console.log("delete word student=>", student);  
          this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/ffn0800/deleteFile', student).subscribe(
            (response) =>{
              let alertMessage : any = JSON.parse(JSON.stringify(response));
              // console.log("delete word alertMessage=>", alertMessage)
              if(alertMessage.result==0){
                const confirmBox = new ConfirmBoxInitializer();
                confirmBox.setTitle('ข้อความแจ้งเตือน');
                confirmBox.setMessage(alertMessage.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                    this.SpinnerService.hide();
                  }
                  subscription.unsubscribe();
                });
              }else{
                const confirmBox = new ConfirmBoxInitializer();
                confirmBox.setTitle('ข้อความแจ้งเตือน');
                confirmBox.setMessage(alertMessage.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                    this.SpinnerService.hide();
                  }
                  subscription.unsubscribe();
                });
              }
            },
            (error) => {this.SpinnerService.hide();}
            )
          }
          subscription.unsubscribe();
      });
  }

  openPwordForm(){//ใบรับเงิน
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    var student = JSON.stringify({
      "rcv_running" : this.result.rcv_running,
      "run_id" : this.runId,
      "form_type" : 8,
      "form_id" : 2,
      "userToken" : this.userData.userToken
      });  
      this.SpinnerService.show();
 
      // console.log("save student=>", student);  
      this.http.disableLoading().post('/'+this.userData.appName+'ApiKN/API/KEEPN/openReport', student).subscribe(
        (response) =>{
          let alertMessage : any = JSON.parse(JSON.stringify(response));
          // console.log("print Word alertMessage=>", alertMessage)
          if(alertMessage.result==0){
            this.SpinnerService.hide();
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){;
              }
              subscription.unsubscribe();
            });
          }else{
            this.SpinnerService.hide();
            myExtObject.OpenWindowMax(alertMessage.file);
          }
        },
        (error) => {this.SpinnerService.hide();}
      )

  }

  printReport(){//พิมพ์ใบรับเช็ค
    var rptName = 'rffn0800';

    // For no parameter : paramData ='{}'
    // var paramData ='{}';

    // For set parameter to report
    var paramData = JSON.stringify({
      "prcv_running" : this.result.rcv_running,
    });

    this.printReportService.printReport(rptName,paramData);
  }

  buttonNew(){
    this.ngOnInit();
  }

  buttonCancle(){
    let winURL = window.location.href.split("/#/")[0]+"/#/";
    location.replace(winURL+'ffn0800')
    window.location.reload();
  }
}