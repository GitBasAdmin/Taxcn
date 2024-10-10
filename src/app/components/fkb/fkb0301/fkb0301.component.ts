import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgSelectComponent } from '@ng-select/ng-select';
// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import { ignoreElements, takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';
import { PrintReportService } from 'src/app/services/print-report.service';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
declare var myExtObject: any;
//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
import {
  CanDeactivate, Router, ActivatedRoute, NavigationStart,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  NavigationError,Routes
}from '@angular/router'

@Component({
  selector: 'app-fkb0301,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fkb0301.component.html',
  styleUrls: ['./fkb0301.component.css']
})


export class Fkb0301Component implements AfterViewInit, OnInit, OnDestroy {
  getLitType:any;
  getProv:any;selProv:any;
  getAmphur:any;selAmphur:any;
  getTambon:any;selTambon:any;postCode:any;
  getNation:any;
  getInOut:any;selInOut:any;
  getNoMoney:any;selNoMoney:any;
  getSendBy:any;selSendBy:any;
  getPostType:any;selPostType:any;
  getSendById:any;
  getPrintType:any;selPrintType:any;
  getNoticeResult:any;selNoticeResult:any;
  getNoticeResultBy:any;
  getNoticeResultBy2:any;
  selNoticeResultBy:any;
  getSendNotice:any;
  getUnsendId:any;
  getIssueTo:any;
  getOfficer:any;
  getJudge:any;
  getSentnotice:any;
  fileToUpload1: File = null;
  myExtObject:any;

  result:any=[];
  result2:any=[];//จ่ายหมาย
  dataHead:any=[];
  send_result_id:any=[];
  runId:any;
  posts:any;
  getNoticeData:any;
  search:any;
  masterSelected:boolean;
  checklist:any;
  checkedList:any;
  delValue:any;
  sessData:any;
  userData:any;
  programName:any;
  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  modalType:any;
  modalindex:any;
  setReadonly:any;
  edit_amphur_id:any;
  edit_tambon_id:any;


  defaultCheckOffId:any;
  defaultCheckOffName:any;
  defaultPaidOffId:any;
  defaultPaidOffName:any;
  defaultApprovedOffId1:any;
  defaultApprovedOffName1:any;
  defaultApprovedOffId2:any;
  defaultApprovedOffName2:any;


  asyncObservable: Observable<string>;
  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;
  public listFieldSelect:any;
  public NoticeRunning:any;


  public loadComponent: boolean = false;
  public loadModalComponent: boolean = false;//password confirm
  public loadMutipleComponent : boolean = false;
  public loadModalNoticeReceiptComponent : boolean = false;
  public loadModalAppComponent : boolean = false;
  public loadModalJudgeComponent : boolean = false;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  //@ViewChild('fca0200',{static: true}) fca0200 : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild('sProv') sProv : NgSelectComponent;
  @ViewChild('sAmphur') sAmphur : NgSelectComponent;
  @ViewChild('sTambon') sTambon : NgSelectComponent;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private printReportService: PrintReportService,
    private activatedRoute : ActivatedRoute,
    private route: ActivatedRoute,
  ){ }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 100,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[]
    };

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.successHttp();


    this.activatedRoute.queryParams.subscribe(params => {
      if(params['run_id']){
        this.runId = params['run_id'];
        this.dataHead.run_id = params['run_id'];
      }
      if(params['notice_running']){
        this.NoticeRunning =  params['notice_running'];
        console.log(this.NoticeRunning);
        this.result.notice_running = this.NoticeRunning;
        this.result2.notice_running = this.NoticeRunning;
        this.result2.send_item = 1;
        this.getNotice(2);
      }
    });

    this.setDefForm();//--set default
    this.getData();
    //======================== plit_type ======================================
    var student = JSON.stringify({
      "table_name" : "plit_type",
      "field_id" : "lit_type",
      "field_name" : "lit_type_desc",
      "userToken" : this.userData.userToken
    });
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getLitType = getDataOptions;
      },
      (error) => {}
    )
     //======================== pprovince ======================================
     var student = JSON.stringify({
      "table_name" : "pprovince",
      "field_id" : "prov_id",
      "field_name" : "prov_name",
      "userToken" : this.userData.userToken
    });
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getProv = getDataOptions;
      },
      (error) => {}
    )
    //======================== pnation ======================================
    var student = JSON.stringify({
      "table_name" : "pnation",
      "field_id" : "nation_id",
      "field_name" : "nation_name",
      "userToken" : this.userData.userToken
    });
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getNation = getDataOptions;
      },
      (error) => {}
    )
    //======================== pnotice_send_type ======================================
    var student = JSON.stringify({
      "table_name" : "pnotice_send_type",
      "field_id" : "send_by_id",
      "field_name" : "send_by_name",
      "order_by" : "send_by_id ASC",
      "userToken" : this.userData.userToken
    });
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getSendById = getDataOptions;
      },
      (error) => {}
    )

    //======================== pnotice_send_by ======================================
    var student = JSON.stringify({
      "table_name" : "pnotice_send_by",
      "field_id" : "send_by",
      "field_name" : "send_by_desc",
      "userToken" : this.userData.userToken
    });
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        getDataOptions.unshift({fieldIdValue:'',fieldNameValue: ''});
        this.getSendBy = getDataOptions;

      },
      (error) => {}
    )
    this.getInOut = [{fieldIdValue:0,fieldNameValue: ''},{fieldIdValue:1,fieldNameValue: 'ในเขต'},{fieldIdValue:2,fieldNameValue: 'ข้ามเขต'}];
    this.selInOut = this.getInOut.find((x:any) => x.fieldIdValue === 0).fieldNameValue
    this.getNoMoney = [{fieldIdValue:0,fieldNameValue: ''},{fieldIdValue:1,fieldNameValue: 'หมายศาล'},{fieldIdValue:2,fieldNameValue: 'หมายนำ'}];
    this.selNoMoney = this.getNoMoney.find((x:any) => x.fieldIdValue === 2).fieldNameValue
    this.getPostType = [{fieldIdValue:0,fieldNameValue: ''},{fieldIdValue:1,fieldNameValue: 'EMS'},{fieldIdValue:2,fieldNameValue: 'ลงทะเบียนตอบรับ'}];
    this.selPostType = this.getPostType.find((x:any) => x.fieldIdValue === 0).fieldNameValue
    this.getPrintType = [{fieldIdValue:1,fieldNameValue: 'พิมพ์หน้าและหลัง'},{fieldIdValue:2,fieldNameValue: 'พิมพ์เฉพาะหน้าหมาย'},{fieldIdValue:3,fieldNameValue: 'พิมพ์เฉพาะหลังหมาย'},{fieldIdValue:4,fieldNameValue: 'พิมพ์หมายรวม'}];
    this.selPrintType= this.getPrintType.find((x:any) => x.fieldIdValue === 1).fieldNameValue
    this.getNoticeResult = [{fieldIdValue:0,fieldNameValue: ''},{fieldIdValue:1,fieldNameValue: '1 ส่งได้'},{fieldIdValue:2,fieldNameValue: '2 ส่งไม่ได้'}];
    this.getNoticeResultBy = [{fieldIdValue:0,fieldNameValue: ''},{fieldIdValue:1,fieldNameValue: '1 รับหมาย'},{fieldIdValue:2,fieldNameValue: '2 ปิดหมาย'},{fieldIdValue:3,fieldNameValue: '3 ไปรษณีย์'},{fieldIdValue:4,fieldNameValue: '4 ปิดประกาศ'}];
    this.getNoticeResultBy2 = [{fieldIdValue:0,fieldNameValue: ''},{fieldIdValue:1,fieldNameValue: 'รับหมาย'},{fieldIdValue:2,fieldNameValue: 'ปิดหมาย'},{fieldIdValue:3,fieldNameValue: 'ไปรษณีย์'},{fieldIdValue:4,fieldNameValue: 'ปิดประกาศ'}];
  }

  successHttp() {
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fkb0301"
    });
    let promise = new Promise((resolve, reject) => {
      this.http.disableLoading().post('/'+this.userData.appName+'Api/API/authen', authen)
        .toPromise()
        .then(
          res => { // Success
          let getDataAuthen : any = JSON.parse(JSON.stringify(res));
          this.programName = getDataAuthen.programName;
          this.defaultCaseType = getDataAuthen.defaultCaseType;
          this.defaultCaseTypeText = getDataAuthen.defaultCaseTypeText;
          this.defaultTitle = getDataAuthen.defaultTitle;
          this.defaultRedTitle = getDataAuthen.defaultRedTitle;

          this.defaultCheckOffId = getDataAuthen.checkOffId;
          this.defaultCheckOffName = getDataAuthen.checkOffName;
          this.defaultPaidOffId = getDataAuthen.paidOffId;
          this.defaultPaidOffName = getDataAuthen.paidOffName;
          this.defaultApprovedOffId1 = getDataAuthen.approvedOffId1;
          this.defaultApprovedOffName1 = getDataAuthen.approvedOffName1;
          this.defaultApprovedOffId2 = getDataAuthen.approvedOffId2;
          this.defaultApprovedOffName2 = getDataAuthen.approvedOffName2;


            resolve(res);
          },
          msg => { reject(msg);}
        );
    });
    return promise;
  }

  setDefForm(){
    this.result = [];this.result2 = [];

    this.getNoticeNo(this.userData.courtId);

    this.result.notice_type_id = "";
    this.result.notice_running = "";
    this.result.notice_type_name="";
    this.result.case_cate_id = "";
    this.result.nbarcode = "";

    //ข้อมูลหมายส่วนบน readonly ทั้งหมด
    this.setReadonly = true;
    /*if(this.result.inout_flag == 2){
      this.setReadonly = false;
    } else{
      this.setReadonly = true;//result.inout_flag =1 readOnly
    }*/

    //จ่ายหมาย
    this.result2.pprint_resend = 1;
    this.result2.rcvnotice_time="กลางวัน";
    this.result2.notice_running1= null;


  }

  //เลขที่/รหัสหมาย (38)../2565
  getNoticeNo(courrId:any){
    if(courrId && !this.result.run_id){
      var student = JSON.stringify({
        "table_name" : "pcourt",
         "field_id" : "std_id",
         "field_name" : "court_name",
        "condition" : " AND court_id='"+courrId+"'",
        "userToken" : this.userData.userToken
      });
      // console.log(student)
      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
         (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.result.notice_court_running = productsJson[0].fieldIdValue;
            this.result.notice_yy = myExtObject.curYear();
          }else{
            this.result.notice_court_running = '';
            this.result.notice_yy = '';
          }
         },
         (error) => {}
       )
    }
  }

  //หมายที่จ่ายแล้วแต่ยังไม่ได้ลงผลหมายของหมายเลขคดี
  loadNotSendNOticeData(){
    if(this.dataHead.run_id){
      this.SpinnerService.show();

        var student = JSON.stringify({
        "run_id" : this.dataHead.run_id,
        "no_result_flag" : 1,
        "userToken" : this.userData.userToken});
      // console.log(student)
      this.http.disableLoading().post('/'+this.userData.appName+'ApiNO/API/NOTICE/getNoticeData', student).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log("getNoticeData", getDataOptions)
          if(getDataOptions.result==1){
            this.getNoticeData = getDataOptions.data;

            this.SpinnerService.hide();
          }else{
            this.getNoticeData = [];
            this.SpinnerService.hide();
          }
        },
        (error) => {this.SpinnerService.hide();}
      )
    }
  }

  getData(){
    if(this.dataHead.run_id){
      var student = JSON.stringify({
        "run_id" : this.dataHead.run_id,
        "userToken" : this.userData.userToken
      });
      // console.log("student=>", student);
      this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fkb0301/getNoticeResult', student).subscribe(posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          console.log("getData productsJson=>",productsJson);
          if((productsJson.result==1) && (productsJson.data.length > 0)){
            productsJson.data.forEach((ele, index, array) => {
              if(ele.alert_time == 1){
                productsJson.data[index]['alert_time_desc'] = ele.alert_time_desc + ele.alert_date1 + ele.num_day1;
              }else if(ele.alert_time == 9){
                productsJson.data[index]['alert_time_desc'] = ele.alert_time_desc + ele.active_alert_date;
              }else{
                productsJson.data[index]['alert_time_desc'] = ele.alert_time_desc + ele.num_day1;
              }
           });
            this.posts = productsJson.data;
            this.rerender();
          }else{
            this.posts = [];
          }
      },(error) => {}
      );
    }
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    // Destroy the table first
    dtInstance.destroy();
    // Call the dtTrigger to rerender again
    this.dtTrigger.next(null);
      });
  }

 ngAfterViewInit(): void {
    this.dtTrigger.next(null);
     }

  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
  }

  directiveDate(date:any, obj:any, type:any){
    if(type == 1)
      this.result[obj] = date;
    else
      this.result2[obj] = date;
  }

  clickOpenMyModalComponent(type:any){
    this.modalType=type;
    this.openbutton.nativeElement.click();
  }

  listDataTable(table_name:any, field_id:any, field_name:any, condition:any){
    var student = JSON.stringify({
      "table_name"  : table_name,
      "field_id"    : field_id,
      "field_name"  : field_name,
      "condition"   : condition,
      "userToken"   : this.userData.userToken
    });
    this.listTable = table_name;
    this.listFieldId = field_id;
    this.listFieldName = field_name;
    this.listFieldCond = condition;
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
      (response) =>{
        this.list = response;
        this.loadComponent = true;
        this.loadModalComponent = false; //password confirm
        this.loadModalNoticeReceiptComponent = false;
        this.loadModalAppComponent = false;
        this.loadModalJudgeComponent = false;//popup Judge
        $("#exampleModal").find(".modal-content").css("width","auto");
      },
      (error) => {}
    )
  }

  loadMyModalComponent(){
    if(this.modalType==1){
      // this.listDataTable("pnotice_type", "notice_type_id",  "notice_type_name", " AND notice_type_id NOT BETWEEN 8 AND 17 ");
      var student = JSON.stringify({
        "table_name" : "pnotice_type",
         "field_id" : "notice_type_id",
         "field_name" : "notice_type_name",
         "field_name2" : "notice_printleft",
         "search_id" : "",
         "search_desc" : "",
         "condition" : " AND notice_type_id NOT BETWEEN 8 AND 17",
         "userToken" : this.userData.userToken});
      this.listTable='pnotice_type';
      this.listFieldId='notice_type_id';
      this.listFieldName='notice_type_name';
      this.listFieldNull='';
      this.listFieldCond=" AND notice_type_id NOT BETWEEN 8 AND 17";
      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
        (response) =>{
          this.list = response;
          this.loadComponent = true;
          this.loadModalComponent = false; //password confirm
          this.loadModalNoticeReceiptComponent = false;
          this.loadModalAppComponent = false;
          this.loadModalJudgeComponent = false;//popup Judge
          $("#exampleModal").find(".modal-content").css("width","auto");
        },
        (error) => {}
      )
    }else if(this.modalType==2){
      this.listDataTable("pnotice_type_add", "notice_type_add",  "notice_type_add_desc", "");

    }else if(this.modalType==3){
      this.runId = this.dataHead.run_id;

      this.loadComponent = false;
      this.loadModalComponent = false; //password confirm
      this.loadModalNoticeReceiptComponent = true;
      this.loadModalAppComponent = false;
      this.loadModalJudgeComponent = false;//popup Judge
      $("#exampleModal").find(".modal-content").css("width","950px");

    }else if(this.modalType==4){//popup appointment
      var student = JSON.stringify({
        "run_id" : this.dataHead.run_id,
        "split_type" : 1,
        "userToken" : this.userData.userToken
      });
      this.http.disableLoading().post('/'+this.userData.appName+'ApiAP/API/APPOINT/getAppointData', student).subscribe(
        (response) =>{
          this.list = response;
          this.loadComponent = false;
          this.loadModalComponent = false; //password confirm
          this.loadModalNoticeReceiptComponent = false;
          this.loadModalAppComponent = true;
          this.loadModalJudgeComponent = false;//popup Judge
          $("#exampleModal").find(".modal-body").css("height","auto");
        },
        (error) => {}
      )
    }else if(this.modalType==5){
      this.listDataTable("pnotice_result_setup", "result_id",  "result_desc", "");

    }else if(this.modalType==6){
      this.listDataTable("pplace_type", "place_type_id",  "place_type_name", "");

    }else if(this.modalType==7){
      this.listDataTable("pdoc_to", "docto_id",  "docto_desc", "");

    }else if(this.modalType==8 || this.modalType==9 || this.modalType==10 || this.modalType==12 || this.modalType==16){
      this.listDataTable("pofficer", "off_id",  "off_name", "");
    }else if(this.modalType==14){
      let condition:any="";
      if(this.result.prov_id && this.result.prov_id != undefined)
        condition = condition +  " AND (prov_id IS NULL OR prov_id=" + this.result.prov_id +")";
      if(this.result.amphur_id && this.result.amphur_id != undefined)
        condition = condition +  " AND (amphur_id IS NULL amphur_id=" + this.result.amphur_id+")";
      if(this.result.tambon_id && this.result.tambon_id != undefined)
        condition = condition +  " AND (tambon_id IS NULL tambon_id=" + this.result.tambon_id+")";

      if(this.userData.sendNoticeFlag == 2){
        condition = condition +  " AND head_flag=1 AND " + this.result.tambon_id;
      }
      this.listDataTable("psentnotice_officer", "off_id",  "off_name", condition);

    }else if(this.modalType==15 ){
      this.listDataTable("psentnotice_officer", "off_id",  "off_name", "");
    }else if(this.modalType==17 ){
      let condition:any="";
      if(this.result.inout_flag)
        condition = " AND inout_flag=" + this.result.inout_flag;
      if(this.result2.notice_result)
        condition = condition +  " AND notice_result=" + this.result2.notice_result;

      this.listDataTable("pnotice_send_order", "send_order_id",  "send_order_desc", condition);

    }else if(this.modalType==11 || this.modalType==13 || this.modalType==18){//popup Judg
      var student = JSON.stringify({
        "cond":2,
        "userToken" : this.userData.userToken});
      this.listTable='pjudge';
      this.listFieldId='judge_id';
      this.listFieldName='judge_name';
      this.listFieldNull='';
      this.listFieldType=JSON.stringify({"type":2});

      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student).subscribe(
        (response) =>{
          this.loadComponent = false;
          this.loadModalComponent = false; //password confirm
          this.loadModalNoticeReceiptComponent = false;
          this.loadModalAppComponent = false;
          this.loadModalJudgeComponent = true;//popup Judge
         let productsJson : any = JSON.parse(JSON.stringify(response));
         if(productsJson.data.length){
           this.list = productsJson.data;
         }else{
           this.list = [];
         }
        },
        (error) => {}
      )
    }else{
      this.loadComponent = false;
      this.loadModalComponent = true; //password confirm
      this.loadModalNoticeReceiptComponent = false;
      this.loadModalAppComponent = false;
      this.loadModalJudgeComponent = false;//popup Judge
      $("#exampleModal").find(".modal-content").css("width","600px");
    }
  }

  receiveFuncListData(event:any){
    if(this.modalType==1){
      this.result.notice_type_id = event.fieldIdValue;
      this.result.notice_type_name = event.fieldNameValue;

    }else if(this.modalType==2){
      this.result.notice_type_name = this.result.notice_type_name + event.fieldNameValue;

    }else if(this.modalType==5){
      this.result2.unsend_id = event.fieldIdValue;
      this.result2.unsend = event.fieldNameValue;

    }else if(this.modalType==6){
      this.result2.address_style = event.fieldNameValue;

    }else if(this.modalType==7){
      this.result2.issue = event.fieldIdValue;
      this.result2.issue_to = event.fieldNameValue;

    }else if(this.modalType==8){
      this.result2.approve_user = event.fieldIdValue;
      this.result2.approve_user_name = event.fieldNameValue;


    }else if(this.modalType==9){
      this.result2.payuser_id = event.fieldIdValue;
      this.result2.pay_name = event.fieldNameValue;

    }else if(this.modalType==10){
      this.result2.approved_off_id1 = event.fieldIdValue;
      this.result2.approved_off_name1 = event.fieldNameValue;

    }else if(this.modalType==12){
      this.result2.approved_off_id2 = event.fieldIdValue;
      this.result2.approved_off_name2 = event.fieldNameValue;

    }else if(this.modalType==14 || this.modalType==15){
      this.result2.s_officer_id = event.fieldIdValue;
      this.result2.s_officer_name = event.fieldNameValue;

    }else if(this.modalType==16){
      this.result2.input_result_user_id = event.fieldIdValue;
      this.result2.input_result_user = event.fieldNameValue;

    }else if(this.modalType==17){
      this.result2.judge_order_desc = event.fieldNameValue;
    }

    this.closebutton.nativeElement.click();
  }

  //this.modalType==3
  receiveNoticeReceiptData(event:any){
    console.log(event);
    this.result.notice_court_running = event.notice_court_running;
    this.result.notice_no = event.notice_no;
    this.result.notice_yy = event.notice_yy;
    this.result.notice_date = event.notice_date;
    this.result.lit_type = event.lit_type;
    this.result.item = event.item;
    this.result.noticeto_name = event.noticeto_name;
    this.result.appoint_date = event.appoint_date;
    this.result.appoint_time = event.appoint_time;
    this.result.app_all_day = event.app_all_day;
    this.result.inout_flag = event.inout_flag;
    this.result.to_court_name = event.to_court_name
    this.result.app_id = event.app_id;
    this.result.remark3 = event.remark3;
    this.result.addr = event.addr;
    this.result.addr_no = event.addr_no;
    this.result.moo = event.moo;
    this.result.road = event.road;
    this.result.soi = event.soi;
    this.result.near_to = event.near_to;
    this.result.prov_id = event.prov_id;
    this.result.prov_name = event.prov_name;
    this.result.amphur_id = event.amphur_id;
    this.result.amphur_name = event.amphur_name;
    this.result.tambon_id = event.tambon_id;
    this.result.tambon_name = event.tambon_name;
    this.result.nation_id = event.nation_id;
    this.result.nation_name = event.nation_name;
    this.result.tel = event.tel;
    this.result.post_code = event.post_code;
    this.result.send_by_id = event.send_by_id;
    this.result.send_amt = event.send_amt;
    // this.result.devoid_amt = event.devoid_amt;  เงินค่านำหมายขาด/เกิน popup ยังไม่ return ค่านี้มา
    this.closebutton.nativeElement.click();
  }

  //this.modalType=4
  receiveFuncAppData(event:any){
    console.log("receiveFuncAppData=>", event);
    this.result.appoint_date = event.date_appoint;
    this.result.appoint_time = event.time_appoint;
    this.result.app_id = event.app_id;
    this.result.remark3 = event.app_name;

    this.closebutton.nativeElement.click();
  }

  receiveJudgeListData(event:any){
    // console.log("receiveJudgeListData event=>", event)
    if(this.modalType==11){
      this.result2.approved_off_id1 = event.judge_id;
      this.result2.approved_off_name1 = event.judge_name;
    }else if(this.modalType==13){
      this.result2.approved_off_id2 = event.judge_id;
      this.result2.approved_off_name2 = event.judge_name;
    }else if(this.modalType==18){
      this.result2.judge_order_result = event.judge_id;
      this.result2.judge_order_result_name = event.judge_name;
    }


    this.closebutton.nativeElement.click();
  }

  changeSendNotice(event:any){
    if(event){
      this.result2.input_result_user_id = this.userData.userCode;
      this.result2.input_result_user = this.userData.offName;
      this.result2.input_result_date = myExtObject.curDate();
    }
    if(this.result2.send_by && this.result2.notice_result){
      var student = JSON.stringify({
        "table_name" : "pnotice_send_result",
        "field_id" : "notice_send_id",
        "field_name" : "notice_send_desc",
        "field_name2" : "key_in_flag",
        "condition"   : " AND send_by="+this.result2.send_by+" AND result_flag="+this.result2.notice_result,
        "order_by"   : " notice_send_id ASC ",
        "userToken" : this.userData.userToken
      });
      // console.log(student);
      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          //radio ใต้*ส่งโดย
          this.getSendNotice = getDataOptions;
        },
        (error) => {}
      )
    }
    else{
      this.getSendNotice = [];
    }
    //----------------------------------------------------------
    if((this.result2.notice_result) && (this.result.inout_flag)){
      var student = JSON.stringify({
        "table_name" : "pnotice_send_order",
        "field_id" : "send_order_id",
        "field_name" : "send_order_desc",
        "condition"   : " AND notice_result=" + this.result2.notice_result+" AND inout_flag=" + this.result.inout_flag,
        "userToken" : this.userData.userToken
      });
      // console.log(student);
      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          //คำสั่งศาล
          // if(getDataOptions.length > 0)
          //   this.result2.judge_order_desc = getDataOptions[0].fieldNameValue;
          // else
          //   this.result2.judge_order_desc = "";
        },
        (error) => {}
      )
    }else{
      this.result2.judge_order_desc = "";
    }
  }

  changeSendResultId(event){
    if(this.result2.send_result_id){
      var val = this.getSendNotice.filter((x:any) => x.fieldIdValue === this.result2.send_result_id)
      if(val.length!=0){

        if(val[0].fieldNameValue2 == 1){
          const confirmBox = new ConfirmBoxInitializer();
          confirmBox.setTitle('ข้อความแจ้งเตือน');
          confirmBox.setMessage('กรุณากรอกรายละเอียดเพิ่มเติม');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){
              this.result2.rcv_name =  val[0].fieldNameValue

            }
            subscription.unsubscribe();
          });

        }else{
          this.result2.rcv_name = "";
        }
      }
    }
  }

  tabChangeSelect(objName:any,event:any,type:any){
    if(objName == "unsend_id"){
      var student = JSON.stringify({
        "table_name" : "pnotice_result_setup",
        "field_id" : "result_id",
        "field_name" : "result_desc",
        "condition" : " AND result_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });
      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.result2.unsend = productsJson[0].fieldNameValue;
          }else{
            this.result2.unsend_id = null;
            this.result2.unsend = "";
          }
        },
        (error) => {}
      )
    }else if(objName == "issue_to"){
      var student = JSON.stringify({
        "table_name" : "pdoc_to",
        "field_id" : "docto_id",
        "field_name" : "docto_desc",
        "condition" : " AND docto_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });
      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.result2.issue_to = productsJson[0].fieldNameValue;
          }else{
            this.result2.issue = null;
            this.result2.issue_to = "";
          }
        },
        (error) => {}
      )

    }else if(objName == "approve_user" || objName == "approved_off_id1" ||
             objName == "payuser_id" || objName == "approved_off_id2" ||
             objName == "s_officer_id" || objName == "input_result_user_id"){
      var student = JSON.stringify({
        "table_name" : "pofficer",
        "field_id" : "off_id",
        "field_name" : "off_name",
        "condition" : " AND off_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });
      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            if(objName == "approve_user")
              this.result2.approve_user_name = productsJson[0].fieldNameValue;
            else if(objName == "approved_off_id1")
              this.result2.approved_off_name1 = productsJson[0].fieldNameValue;
            else if(objName == "payuser_id")
              this.result2.pay_name = productsJson[0].fieldNameValue;
            else if(objName == "approved_off_id2")
              this.result2.approved_off_name2 = productsJson[0].fieldNameValue;
            else if(objName == "s_officer_id")
              this.result2.s_officer_name = productsJson[0].fieldNameValue;
            else if (objName == "input_result_user_id")
              this.result2.input_result_user = productsJson[0].fieldNameValue;
          }else{
            if(objName == "approve_user"){
              this.result2.approve_user = null;
              this.result2.approve_user_name = "";
            }else if(objName == "approved_off_id1"){
              this.result2.approved_off_id1 = null;
              this.result2.approved_off_name1 = "";
            }else if(objName == "payuser_id"){
              this.result2.payuser_id = null;
              this.result2.pay_name = "";
            }else if(objName == "approved_off_id2"){
              this.result2.approved_off_id2 = null;
              this.result2.approved_off_name2 = "";
            }else if(objName == "s_officer_id"){
              this.result2.s_officer_id = null;
              this.result2.s_officer_name = "";
            }else if (objName == "input_result_user"){
              this.result2.input_result_user_id = null;
              this.result2.input_result_user = "";
            }
          }
        },
        (error) => {}
      )
    }else if(objName == "judge_order_result"){
      var student = JSON.stringify({
        "table_name" : "pjudge",
        "field_id" : "judge_id",
        "field_name" : "judge_name",
        "condition" : " AND judge_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });
      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.result2.judge_order_result_name = productsJson[0].fieldNameValue;
          }else{
            this.result2.judge_order_result = null;
            this.result2.judge_order_result_name = "";
          }
        },
        (error) => {}
      )
    }
  }

  changeAssagnData(event:any){
   if(this.result2.approve_flag)
      this.result2.approve_date = myExtObject.curDate();
    else
      this.result2.approve_date = "";
  }

  onFileChange(e:any,type:any) {
    this.fileToUpload1 =null;

    if(e.target.files.length){
      this.fileToUpload1 = e.target.files[0];
      var fileName = e.target.files[0].name;
      $(e.target).parent('div').find('label').html(fileName);
    }else{
      this.fileToUpload1 =  null;
      $(e.target).parent('div').find('label').html('');
    }
  }

  clickOpenFile(filename:any){
    let winURL = window.location.host;
    winURL = winURL+'/'+this.userData.appName+"ApiNO/API/NOTICE/fsn3500/openImage";
    myExtObject.OpenWindowMax("http://"+winURL+'?image='+filename);
  }

  rotatRight(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    confirmBox.setMessage('ต้องการหมุนภาพไปทางขวาใช่หรือไม่');
    confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
    confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    });
    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      if (resp.success==true){
        this.SpinnerService.show();
        var student = JSON.stringify({
        // "notice_running" : this.result.notice_running,
        // "send_item" : this.result2.send_item,
        "direction" : 2,
        "img_attach_type" : 'att_'+this.result.notice_running+'.jpg'  //1 : img_attach , 2 : map_attach
        // "userToken" : this.userData.userToken
        });
        console.log("rotage image=>", student);
        this.http.disableLoading().post('/'+this.userData.appName+'ApiNO/API/NOTICE/fkb0301/rotageImage', student).subscribe(
          (response) =>{
            let alertMessage : any = JSON.parse(JSON.stringify(response));
            // console.log("delete word alertMessage=>", alertMessage)
            if(alertMessage.result==0){
              this.SpinnerService.hide();
              const confirmBox = new ConfirmBoxInitializer();
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
            }else{
              this.SpinnerService.hide();
              const confirmBox = new ConfirmBoxInitializer();
              confirmBox.setMessage(alertMessage.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  //$("button[type='reset']")[0].click();
                  // this.SpinnerService.hide();
                }
                // this.result2.img_attach = "";
                // this.ngOnInit();
                // this.getData();
                subscription.unsubscribe();
              });
              //this.result.file_exists=false;

            }
          },
          (error) => {this.SpinnerService.hide();}
          )
    }
    subscription.unsubscribe();
  });

}

  rotateLeft(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    confirmBox.setMessage('ต้องการหมุนภาพไปทางซ้ายใช่หรือไม่');
    confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
    confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    });
    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      if (resp.success==true){
        this.SpinnerService.show();

          var student = JSON.stringify({
          // "notice_running" : this.result.notice_running,
          // "send_item" : this.result2.send_item,
          "direction" : 1,
          "img_attach_type" : 'att_'+this.result.notice_running+'.jpg'  //1 : img_attach , 2 : map_attach
          // "userToken" : this.userData.userToken
          });
          console.log("rotage image=>", student);
          this.http.disableLoading().post('/'+this.userData.appName+'ApiNO/API/NOTICE/fkb0301/rotageImage', student).subscribe(
            (response) =>{
              let alertMessage : any = JSON.parse(JSON.stringify(response));
              // console.log("delete word alertMessage=>", alertMessage)
              if(alertMessage.result==0){
                this.SpinnerService.hide();
                const confirmBox = new ConfirmBoxInitializer();
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
              }else{
                this.SpinnerService.hide();
                const confirmBox = new ConfirmBoxInitializer();
                confirmBox.setMessage(alertMessage.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                    //$("button[type='reset']")[0].click();
                    // this.SpinnerService.hide();
                  }
                  // this.result2.img_attach = "";
                  // this.ngOnInit();
                  // this.getData();
                  subscription.unsubscribe();
                });
                //this.result.file_exists=false;

              }
            },
            (error) => {this.SpinnerService.hide();}
            )
      }
      subscription.unsubscribe();
    });

  }

  clickDeleteFile(type:any){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(type==1)
      confirmBox.setMessage('ต้องการลบรูปภาพถ่ายสถานที่นี้ใช่หรือไม่');
    else if(type==2)
      confirmBox.setMessage('ต้องการลบรูปภาพแผนที่นี้ใช่หรือไม่');
    confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
      // Choose layout color type
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          this.SpinnerService.show();

          var student = JSON.stringify({
          "notice_running" : this.result.notice_running,
          "send_item" : this.result2.send_item,
          "img_attach_type" : type,//1 : img_attach , 2 : map_attach
          "userToken" : this.userData.userToken
          });
          this.http.disableLoading().post('/'+this.userData.appName+'ApiNO/API/NOTICE/fkb0301/deleteImage', student).subscribe(
            (response) =>{
              let alertMessage : any = JSON.parse(JSON.stringify(response));
              if(alertMessage.result==0){
                this.SpinnerService.hide();
                const confirmBox = new ConfirmBoxInitializer();
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
              }else{
                this.SpinnerService.hide();
                const confirmBox = new ConfirmBoxInitializer();
                confirmBox.setMessage(alertMessage.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                  }
                  this.result2.img_attach = "";
                  this.getData();
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

  //-----head ข้อมูลเลขคดี
  fnDataHead(event:any){
    this.dataHead = event;
    if(this.dataHead.buttonSearch==1){
      this.runId = {'run_id' : event.run_id,'counter' : Math.ceil(Math.random()*10000),'notSearch':1}
      this.result.run_id = this.dataHead.run_id;
      this.result.case_flag = this.dataHead.case_flag;
      this.ngOnInit();
      this.loadNotSendNOticeData();
    }
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
      if (resp.success==true){
        //this.SpinnerService.hide();
      }
      subscription.unsubscribe();
    });

  }else if(!chkForm.log_remark){
    confirmBox.setMessage('กรุณาป้อนเหตุผล');
    confirmBox.setButtonLabels('ตกลง');
    confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    });
    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      if (resp.success==true){
        //this.SpinnerService.hide();
      }
      subscription.unsubscribe();
    });
  }else{
    var student = JSON.stringify({
      "user_running" : this.userData.userRunning,
      "password" : chkForm.password,
      "log_remark" : chkForm.log_remark,
      "userToken" : this.userData.userToken
    });
    this.http.disableLoading().post('/'+this.userData.appName+'Api/API/checkPassword', student).subscribe(
      posts => {
        let productsJson : any = JSON.parse(JSON.stringify(posts));
        if(productsJson.result==1){

          this.SpinnerService.show();
          var student = JSON.stringify({
            "notice_running" : this.result2.notice_running,
            "send_item" : this.result2.send_item,
            "edit_send_item" : this.result2.edit_send_item,
            "log_remark" : chkForm.log_remark,
            "userToken" : this.userData.userToken
          });
          // console.log("student=>", student);

          this.http.disableLoading().post('/'+this.userData.appName+'ApiNO/API/NOTICE/fkb0301/cancelResult', student).subscribe(
          (response) =>{
            let alertMessage : any = JSON.parse(JSON.stringify(response));
            // console.log("alertMessage=>", alertMessage);
            if(alertMessage.result==0){
              this.SpinnerService.hide();
              confirmBox.setMessage(alertMessage.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  this.closebutton.nativeElement.click();
                }
                subscription.unsubscribe();
              });
            }else{

              confirmBox.setMessage(alertMessage.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  this.SpinnerService.hide();
                  this.closebutton.nativeElement.click();
                  this.loadNotSendNOticeData();
                  this.getNotice(4);
                  this.getData();
                }
                subscription.unsubscribe();
              });
            }
          },
          (error) => {this.SpinnerService.hide();}
          )

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

changeProv(province:any,type:any){
  this.result.prov_id=province;

  let headers = new HttpHeaders();
  headers = headers.set('Content-Type','application/json');
  var student = JSON.stringify({
    "table_name" : "pamphur",
    "field_id" : "amphur_id",
    "field_name" : "amphur_name",
    "condition" : " AND prov_id='"+province+"'",
    "userToken" : this.userData.userToken
  });
  this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
    (response) =>{
      let getDataOptions : any = JSON.parse(JSON.stringify(response));
      this.getAmphur = getDataOptions;
      setTimeout(() => {
        if(this.result.amphur_id){
          this.changeAmphur(this.result.amphur_id,type);
        }
      }, 100);
    },
    (error) => {}
  )
  if(typeof province=='undefined' || type==1){
    this.sAmphur.clearModel();
    this.sTambon.clearModel();
    this.result.amphur_id = "";
    this.result.tambon_id = "";
  }
}

changeAmphur(Amphur:any,type:any){

  this.result.amphur_id=Amphur;
  var student = JSON.stringify({
    "table_name" : "ptambon",
    "field_id" : "tambon_id",
    "field_name" : "tambon_name",
    "condition" : " AND amphur_id='"+Amphur+"' AND prov_id='"+this.result.prov_id+"'",
    "userToken" : this.userData.userToken
  });
  this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
    (response) =>{
      let getDataOptions : any = JSON.parse(JSON.stringify(response));
      this.getTambon = getDataOptions;
    },
    (error) => {}
  )
  if(typeof Amphur=='undefined' || type==1){
    this.sTambon.clearModel();
    this.result.tambon_id="";
  }
}

changeTambon(Tambon:any,type:any){
  this.result.tambon_id=Tambon;

  var student = JSON.stringify({
    "table_name" : "ptambon",
    "field_id" : "tambon_id",
    "field_name" : "tambon_name",
    "field_name2" : "post_code",
    "condition" : " AND tambon_id='"+Tambon+"' AND amphur_id='"+this.result.amphur_id+"' AND prov_id='"+this.result.prov_id+"'",
    "userToken" : this.userData.userToken
  });
  this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
    (response) =>{
      let getDataOptions : any = JSON.parse(JSON.stringify(response));
      if(this.result.tambon_id){
          setTimeout(() => {
          this.result.post_code = getDataOptions[0].fieldNameValue2;
       }, 100);
      }
    },
    (error) => {}
  )
  if(typeof Tambon=='undefined'){
    this.result.post_code = "";
  }
}

  closeModal(){
    this.loadComponent = false;
    this.loadModalComponent = false; //password confirm
    this.loadModalNoticeReceiptComponent = false;
    this.loadModalAppComponent = false;
  }

  btnSaveHistory(){
    let deposit=[];
    var data = {
      "notice_running" : this.result.notice_running,
      "run_id" : this.dataHead.run_id
    };
    deposit.push(data);

    var student = JSON.stringify({
      "notice_running" : this.result.notice_running,
      "event_type" : 1,
      "send_flag" : 1,
      "userToken" : this.userData.userToken,
      "data" : deposit
    });
    var arrayData = [];
    arrayData['data'] = student;
    this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fkb0600/insertHistoricalData', student).subscribe(
      (response) =>{
        let alertMessage : any = JSON.parse(JSON.stringify(response));
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
              subscription.unsubscribe();
            }
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
              this.getNotice(3);
              this.getData();
              this.SpinnerService.hide();
            }
            subscription.unsubscribe();
          });
        }
      },
      (error) => {this.SpinnerService.hide();}
    )
  }

  sendLocation(){
    if(!this.result.nbarcode){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('ต้องการส่งผลหมายไปยังหน่วยงาน'+this.dataHead.case_location);
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          subscription.unsubscribe();
          this.btnSaveHistory();
        }else{
          subscription.unsubscribe();
        }
      });
    } 
    /*if(this.result.nbarcode == ""){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      // confirmBox.setMessage('ต้องการส่งผลหมายไปยังหน่วยงาน(ค้างรับ - '+this.result.notice_no+'/'+this.result.notice_yy+')');
      confirmBox.setMessage('ต้องการส่งผลหมายไปยังหน่วยงาน'+this.result.location);
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          let deposit=[];
          var data = {
            "notice_running" : this.result.notice_running,
            "run_id" : this.dataHead.run_id
            };
          deposit.push(data);

          var student = JSON.stringify({
          "notice_running" : this.result.notice_running,
          "event_type" : 1,
          "send_flag" : 1,
          "userToken" : this.userData.userToken,
          "data" : deposit
          });
          var arrayData = [];
          arrayData['data'] = student;
          // console.log("btnSaveHistory=>", student);
          this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fkb0600/insertHistoricalData', student).subscribe(
            (response) =>{
              let alertMessage : any = JSON.parse(JSON.stringify(response));
              // console.log("delete insertHistoricalData =>", alertMessage)
              if(alertMessage.result==0){
                // this.SpinnerService.hide();
                const confirmBox = new ConfirmBoxInitializer();
                confirmBox.setMessage(alertMessage.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                    subscription.unsubscribe();
                  }
                });
              }else{
                // this.SpinnerService.hide();
                const confirmBox = new ConfirmBoxInitializer();
                confirmBox.setMessage(alertMessage.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                    this.getNotice(3);
                    this.getData();
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
    }*/
  }

  //save insert update
  submitForm() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!this.result.notice_running){
      confirmBox.setMessage('กรุณาระบุเลือกข้อมูหมาย');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          // this.setFocus('req_date');
        }
        subscription.unsubscribe();
      });
    }else if(!this.result2.input_result_date){
      confirmBox.setMessage('กรุณาระบุวันที่บันทึกผลหมาย');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          // this.setFocus('date_run_no');
        }
        subscription.unsubscribe();
      });
    }else if(!this.result2.send_by){
      confirmBox.setMessage('กรุณาระบุเข้อมูลส่งโดย');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          // this.setFocus('date_run_no');
        }
        subscription.unsubscribe();
      });
    }else{
      this.SpinnerService.show();

      if(this.result2.notice_result == 2){
        this.result2.rcv_type = "";
      }
      if(this.result2.send_result_id == "" || this.result2.notice_result == ""){
        this.result2.send_result_id = "";
      }
      if(this.result2.img_attach == null){
        this.result2.img_attach = "";
      }

      // this.result2.issue_to = this.result2.issue_desc;

      this.result['userToken'] = this.userData.userToken;
      this.result2['userToken'] = this.userData.userToken;

      var formData = new FormData();
      formData.append('data', JSON.stringify($.extend({}, this.result)));
      formData.append('send_data', JSON.stringify($.extend({}, this.result2)));
      formData.append('attach_file', this.fileToUpload1);
      formData.append('run_id', this.dataHead.run_id);
      formData.append('userToken',this.userData.userToken);
      // console.log("formfile=>", formData.get('attacqh_file'));

      this.http.disableHeader().post('/'+this.userData.appName+'ApiNO/API/NOTICE/fkb0301/saveNoticeResult', formData ).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          // console.log("save",getDataOptions)
          if(getDataOptions.result==1){
              confirmBox.setMessage(getDataOptions.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  this.result2.send_item = getDataOptions.send_item;
                  this.result.notice_running = getDataOptions.notice_running;
                  this.result2.notice_running = getDataOptions.notice_running;

                  this.loadNotSendNOticeData();
                  this.getNotice(3);
                  this.getData();
                  this.SpinnerService.hide();
                }
                subscription.unsubscribe();
              });
          }else{
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
          }
        },
        (error) => {}
      )
    }
  }

  editData(index:any){
    console.log(this.posts[index]);
    this.modalindex = index;
    this.getNotice(7);
  }

  searchData(){
  }


  getNotice(type:any){
    if((type == 1 )&&(!this.result.notice_court_running || !this.result.notice_no || !this.result.notice_yy)){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาระบุรหัสหมายให้ครบถ้วน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else if((type == 2 )&&(!this.result.notice_running)){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาค้นจ่ายหมายก่อน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });

    }else{
      this.SpinnerService.show();
      if(type == 1){// ค้นหาตาม เลขที่/รหัสหมาย (36).../2565
        var student = JSON.stringify({
          "notice_court_running" : this.result.notice_court_running,
          "notice_no" : this.result.notice_no,
          "notice_yy" : this.result.notice_yy,
          "userToken" : this.userData.userToken
        });
      }else if(type == 2){ // ค้นหา ครั้งที่จ่ายหมาย
        var student = JSON.stringify({
          "notice_running" : this.result2.notice_running,
          "send_item" : this.result2.send_item,
          "userToken" : this.userData.userToken
        });
      }else if(type == 3 || type == 4){ // ดึงข้อมูลมาแสดงตอน save, ยกเลิกผลหมาย
        var student = JSON.stringify({
          "run_id" : this.dataHead.run_id,
          "notice_running" : this.result2.notice_running,
          "send_item" : this.result2.send_item,
          "userToken" : this.userData.userToken
        });
      }else if(type == 5){//ค้นหา barcode
        var student = JSON.stringify({
          "barcode" : this.result.nbarcode,
          "userToken" : this.userData.userToken
        });
      }else if(type == 6){//คลิก head หมายที่จ่ายแล้วแต่ยังไม่ได้ลงผลหมายของหมายเลขคดี
        var student = JSON.stringify({
          "notice_running" : this.getNoticeData[this.modalindex]['notice_running'],
          "send_item" : this.getNoticeData[this.modalindex]['send_item'],
          "userToken" : this.userData.userToken
        });
      }else if(type == 7){//คลิก editData
        var student = JSON.stringify({
          "notice_running" : this.posts[this.modalindex]['notice_running'],
          "send_item" : this.posts[this.modalindex]['send_item'],
          "userToken" : this.userData.userToken
        });
      }
      console.log(student);
      this.result = [];this.result2 = [];
      this.http.disableLoading().post('/'+this.userData.appName+'ApiNO/API/NOTICE/fkb0301/getNotice', student).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.result==1){
            if(productsJson.data.length > 0){
              this.runId  = productsJson.data[0].run_id;
              this.result = productsJson.data[0];

              if(type == 1){//// ค้นหาตาม เลขที่/รหัสหมาย (36).../2565
                this.dataHead.run_id =productsJson.data[0].run_id;
                this.loadNotSendNOticeData();
                this.getData();
              }
              this.setReadonly = true;
              /*if(this.result.inout_flag == 2){
                this.setReadonly = false;
              } else{
                this.setReadonly = true;//result.inout_flag =1 readOnly
              }*/

              if(this.result.prov_id){
                if(!this.result.amphur_id)
                  this.sAmphur.clearModel();
                if(!this.result.tambon_id)
                  this.sTambon.clearModel();

                  this.changeProv(this.result.prov_id,'');
              }
              else{
                this.sAmphur.clearModel();
                this.sTambon.clearModel();
              }
              if(productsJson.data[0]['nation_id'] == 0)
                this.result.nation_id = "";

              this.edit_amphur_id = this.result.amphur_id;
              this.edit_tambon_id = this.result.tambon_id;
            }

            if(productsJson.send_data.length > 0){
              this.result2 = productsJson.send_data[0];
              this.changeSendNotice('');
              this.result2.edit_notice_resul = productsJson.send_data[0]['notice_result'];
              // this.result2.approve_user_name = productsJson.send_data[0]['s_approve_user_name'];
              this.result2.remark3x = productsJson.send_data[0]['notice_result_location'];//ผลหมายอยู่ที่งาน
              if(!this.result2.send_item)
                this.result2.send_item = 1;
              if(this.result2.approve_date)
                this.result2.approve_flag = 1;
              if(!this.result2.rcvnotice_time)
                this.result2.rcvnotice_time = "กลางวัน";
              if(!this.result2.input_result_date){
                this.result2.approve_user = this.defaultCheckOffId;//ผู้ตรวจ
                this.result2.approve_user_name = this.defaultCheckOffName;
                this.result2.payuser_id =this.defaultPaidOffId;//ผู้จ่ายเงิน
                this.result2.pay_name =this.defaultPaidOffName;
                this.result2.approved_off_id1 =this.defaultApprovedOffId1;//ผู้อนุมัติผลหมาย คนที่1
                this.result2.approved_off_name1 =this.defaultApprovedOffName1;
                this.result2.approved_off_id2 =this.defaultApprovedOffId2;//ผู้อนุมัติผลหมาย คนที่2
                this.result2.approved_off_name2 =this.defaultApprovedOffName2;
              }
            }else{
              if(!this.result2.rcvnotice_time)
                this.result2.rcvnotice_time = "กลางวัน";
            }

            this.SpinnerService.hide();

        }else{
          const confirmBox = new ConfirmBoxInitializer();
          confirmBox.setTitle('ข้อความแจ้งเตือน');
          confirmBox.setMessage(productsJson.error);
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
        }
        },
        (error) => {this.SpinnerService.hide();}
      )
    }
  }

  editNotice(index:any){
    this.modalindex = index;
    this.getNotice(6);
  }

  btnCancel2(){}

  printReport(type:any){
    var rptName = 'rsn0300';
    var paramData ='{}';

    // For set parameter to report
    paramData = JSON.stringify({
      "pnotice_running" : this.result.notice_running,
      "psend_item" : this.result2.send_item,
      "psend_by" : this.result.send_by,
      "puser_code" : this.userData.userCode,
      "psign" : type,
      "pprint_resend" : this.result2.pprint_resend,
      "ppay_name" : this.result2.pay_name
    });
    this.printReportService.printReport(rptName,paramData);
  }

  printImage(type:any){
    var rptName = 'rsn0300_img';
    var paramData ='{}';

    if(!this.result.notice_running){

      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาเลือกหมาย');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else{
        paramData = JSON.stringify({
          "pnotice_running" : this.result.notice_running,
          "psend_by" : this.result.send_by,
          "psend_item" : this.result2.send_item,
          "puser_code" : this.userData.userCode,
          "ptype" : type
        });
        console.log(paramData);
      this.printReportService.printReport(rptName,paramData);
    }
  }

  //พิมพ์ผลหมายหน้าหลัง
  printReportAll(psign:any){
    var rptName = 'rsn0300_all';
    var paramData ='{}';

    paramData = JSON.stringify({
      "pnotice_running" : this.result.notice_running,
      "ptype" : 1,
      "psend_item" : this.result2.send_item,
      "psend_by" : this.result.send_by,
      "puser_code" : this.userData.userCode,
      "psign" : psign,
      "pprint_resend" : this.result.pprint_resend,
      "ppay_name" : this.result2.pay_name
    });
    this.printReportService.printReport(rptName,paramData);

  }

  //ติดตามผลหมาย
  // followNotice(){
  //   if(!this.result.notice_running){
  //     let toPage="";
  //     let winURL = window.location.href.split("/#/")[0]+"/#/";
  //     winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+toPage+"?notice_running="+this.result.pnotice_running;
  //     window.open(winURL,'_blank', "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=auto,height=auto");
  //   }
  // }


  //พิมพ์ใบรับหมาย
  printNotice(){
    var topage = 'prno5000';
    if(!this.result.notice_running){

      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาเลือกหมาย');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else{
      var notice_no = "(" + this.result.notice_court_running  + ")-"+ this.result.notice_no +"/"+ this.result.notice_yy;
      let winURL = window.location.href;
      winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+topage+"?notice_running="+this.result.notice_running+"&notice_no="+notice_no+"&notice_type_name="+this.result.notice_type_name;
      window.open(winURL,'_blank', "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=1200,height=500");
      console.log(winURL);
    }
  }

  //พิมพ์ใบรับเงิน (แบบ 5)
  printReceipt(){

    var rptName = 'rsn0320';
    var paramData ='{}';

    if(!this.result.notice_running){

      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาเลือกหมาย');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else{
      paramData = JSON.stringify({
        "pnotice_running" : this.result.notice_running,
        "psend_item" : this.result2.send_item,
        "psend_by" : this.result.send_by,
        "puser_code" : this.userData.userCode,
        "ppay_name" : this.result2.pay_name
      });
      this.printReportService.printReport(rptName,paramData);
    }

  }

  curencyFormat(n:any,d:any) {
    if (n !== undefined && n !== null) {
      return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    }else{
      return "";
    }
  }

  curencyFormatRemove(val: number): string {
    if (val !== undefined && val !== null) {
      return val.toString().replace(/,/g, "");
    } else {
      return "";
    }
  }

  cancelNotice(){
    this.modalType="cancelNotice";
    this.openbutton.nativeElement.click();

  }

  ClearAll(){
    window.location.reload();
  }

  closeWindow(){

    if(window.close() == undefined){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('ไม่พบหน้าจอหลัก ไม่สามารถปิดหน้าจอได้');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }
    else
      window.close();
  }


}







