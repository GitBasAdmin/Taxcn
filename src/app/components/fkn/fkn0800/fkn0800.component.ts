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
import { PopupDittoComponent } from '@app/components/modal/popup-ditto/popup-ditto.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
declare var myExtObject: any;
import {
  CanDeactivate, Router, ActivatedRoute, NavigationStart,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  NavigationError,Routes
}from '@angular/router'
// import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-fkn0800,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fkn0800.component.html',
  styleUrls: ['./fkn0800.component.css']
})


export class Fkn0800Component implements AfterViewInit, OnInit, OnDestroy,AfterContentInit {
  //form: FormGroup;
  title = 'datatables';

  posts:any;
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
  resultTmp:any = [];
  modalType:any;
  cancelTypeFlag:any;
  logRemark:any;
  indexDelete:any;
  myExtObject: any;
  sLitType:any;
  runId:any;
  receipt_running:any;
  led_running:any;
  appeal_running:any;
  notice_running:any;
  guar_running:any;
  seq_running:any;

  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  asyncObservable: Observable<string>;
 

  // Datalist:any;
  //--
  getDataAnnounce:any;
  getSendLitType:any;
  getLitType:any;
  getCategoryName:any;
  getNoticeData:any;
  appealDate:any;

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

  public loadComponent: boolean = false;//popup form_id
  public loadModalComponent: boolean = false;//password confirm
  public loadMutipleComponent : boolean = false; //popup SendList
  public loadModalJudgeComponent : boolean = false; //popup judge
  public loadModalAppComponent : boolean = false; //popup AppComponent
  public loadModalLitComponent : boolean = false; //popup AppComponent
  
 
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
    private activatedRoute : ActivatedRoute,
    private ngbModal: NgbModal

  ){ 
  }

  ngOnInit(): void {

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

    console.log(this.activatedRoute)
    this.activatedRoute.queryParams.subscribe(params => {
      if(params['run_id']){
        this.runId = params['run_id'];
        this.getData(1);
      }

      if(params['receipt_running'])
        this.receipt_running = params['receipt_running'];
      if(params['led_running'])
        this.led_running = params['led_running'];
      if(params['appeal_running'])
        this.appeal_running = params['appeal_running'];
      if(params['notice_running'])
        this.notice_running = params['notice_running'];
      if(params['guar_running'])
        this.guar_running = params['guar_running'];
    });

    this.successHttp();
    this.setDefForm(1);//--set default
    
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 999,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[]
    };
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(typeof this.dataHead.run_id != "undefined"){
      var student = JSON.stringify({
        "run_id" : this.dataHead.run_id,
        "userToken" : this.userData.userToken
      });
       // console.log("student=>", student);
      this.http.post('/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0800/getData', student).subscribe(
      posts => {
        let productsJson : any = JSON.parse(JSON.stringify(posts));
        this.posts = productsJson.data;
        // console.log("productsJson=>", productsJson.data);
        if(productsJson.result==1){
          this.checklist = this.posts;
          if(productsJson.data.length)
            this.posts.forEach((x : any ) => x.edit0401 = false);
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
    this.posts=[];
  }
  //======================== plit_type ======================================
  var student = JSON.stringify({
    "table_name"  : "plit_type",
    "field_id"    : "lit_type",
    "field_name"  : "lit_type_desc",
    "userToken"   : this.userData.userToken
  });
  this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
    (response) =>{
      let getDataOptions : any = JSON.parse(JSON.stringify(response));
      this.getLitType = getDataOptions;
      this.getSendLitType = getDataOptions;
    },
    (error) => {}
  )

  //======================== ชื่อหมวดหมู่ category_name ======================================
  this.http.get('https://enotice.coj.go.th:8080/api/v1/category').subscribe(
    (response) =>{
      let getDataOptions : any = JSON.parse(JSON.stringify(response));
      this.getCategoryName = getDataOptions.data;
    },
    (error) => {}
  )
  this.getDataAnnounce = [{fieldIdValue:'',fieldNameValue: ''}, 
                  {fieldIdValue:1,fieldNameValue: 'หนังสือพิมพ์'}, 
                  {fieldIdValue:2,fieldNameValue: 'หน้าศาล'}, 
                  {fieldIdValue:3,fieldNameValue: 'อิเล็กทรอนิกส์'}, 
                  {fieldIdValue:4,fieldNameValue: 'ปิดประกาศชุมชน'}];
  }

  successHttp() {
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fkn0800"
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
    var checked = this.result.form_type;
    this.result = [];
    if(event==1){
      this.result.form_type = 2;
    }else{
      this.result.form_type = checked;
      if( this.seq_running)
        this.result.seq = this.seq_running;
    }
    this.result.create_user = this.userData.offName;
    this.result.type_date = myExtObject.curDate();
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

  cancelFlag(){
    this.modalType="cancelFlag";
    this.cancelTypeFlag = "cancelFlag";
    this.openbutton.nativeElement.click();
  }

  closeModal(){
    this.loadModalComponent = false; //password confirm
    this.loadComponent = false;//popup form_id
    this.loadMutipleComponent = false;//popup Mutiple
    this.loadModalJudgeComponent = false;//popup Judg
    this.loadModalAppComponent = false;//popup appointment
    this.loadModalLitComponent = false;

    if(this.cancelTypeFlag == "cancelFlag"){
      var tmp = !this.result.cancel_flag;
      this.result.cancel_flag = tmp;
    }
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

  goToLink(url: string){
    window.open(url, "_blank");
  }

  tabChangeInput(name:any,event:any){
     if(name=='form_id'){// 1 2
      var student = JSON.stringify({
        "table_name" : "pword_form",
        "field_id" : "form_id",
        "field_name" : "form_name",
        "field_name2" : "form_add",
        "condition" : " AND form_id='"+event.target.value+"' AND form_type='"+this.result.form_type+"'",
        "userToken" : this.userData.userToken
      });   
      // console.log("form_id=>", student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        // console.log("form_id=>", productsJson);
        if(productsJson.length){
          if(productsJson[0].fieldNameValue2)
            this.result.form_desc = productsJson[0].fieldNameValue + " "+productsJson[0].fieldNameValue2+"";
          else
          this.result.form_desc = productsJson[0].fieldNameValue ;
        }else{
          this.result.form_id = '';
          this.result.form_desc = '';
        }
        },
        (error) => {}
      )
    }else if(name=='send_lit_seq'){//3
      var student = JSON.stringify({
        "table_name" : "pcase_litigant",
         "field_id" : "lit_running",
         "field_name" : "title",
         "field_name2" : "name",
         "condition" : " AND run_id='"+this.dataHead.run_id+"' AND seq='"+event.target.value+"' AND lit_type='"+this.result.send_lit_type+"'",
        "userToken" : this.userData.userToken
      });    
      // console.log("send_lit_seq student=>", student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        // console.log("send_lit_seq productsJson=>", productsJson);
        if(productsJson.length){
          this.result.send_lit_name = productsJson[0].fieldNameValue+productsJson[0].fieldNameValue2;
        }else{
          this.result.send_lit_seq = '';
          this.result.send_lit_name = '';
        }
        },
        (error) => {}
      )
    }else if(name=='accu_item'){//4 5
      var student = JSON.stringify({
        "table_name" : "pcase_litigant",
         "field_id" : "lit_running",
         "field_name" : "title",
         "field_name2" : "name",
         "condition" : " AND run_id='"+this.dataHead.run_id+"' AND seq='"+event.target.value+"' AND lit_type='"+this.result.lit_type+"'",
        "userToken" : this.userData.userToken
      }); 
      // console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        // console.log("accu_item", productsJson);
        if(productsJson.length){
            this.result.accu_item_name = productsJson[0].fieldNameValue+productsJson[0].fieldNameValue2;
        }else{
          this.result.accu_item = '';
          this.result.accu_item_name = '';
        }
        },
        (error) => {}
      )

    }else if(name=='judge_id'){//7
      var student = JSON.stringify({
        "table_name" : "pjudge",
        "field_id" : "judge_id",
        "field_name" : "judge_name",
        "condition" : " AND judge_id='"+ this.result.judge_id+"'",
        "userToken" : this.userData.userToken});
        // console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
          (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          // console.log("judge_id", productsJson);
          if(productsJson.length){
              this.result.judge_name = productsJson[0].fieldNameValue ;
          }else{
            this.result.judge_id = '';
            this.result.judge_name = '';
          }
          },
          (error) => {}
        )

    }else if(name=='sign_off_id'){//8
      var student = JSON.stringify({
        "table_name" : "pofficer",
        "field_id" : "off_id",
        "field_name" : "off_name",
        "condition" : " AND off_id='"+ this.result.sign_off_id+"'",
        "userToken" : this.userData.userToken
      });
      // console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        // console.log("form_id", productsJson);
        if(productsJson.length){
          this.result.sign_off_name = productsJson[0].fieldNameValue ;
        }else{
          this.result.sign_off_id = '';
          this.result.sign_off_name = '';
        }
        },
        (error) => {}
      )
    }
  }

  clickOpenMyModalComponent(type:any){
    this.modalType='';
    if((type==3 || type==4  || type==6) && !this.dataHead.run_id){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาค้นหาข้อมูลเลขดคี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else{
      this.modalType=type;
      this.openbutton.nativeElement.click();
    }
  }

  loadMyModalComponent(){
    if(this.modalType==3 || this.modalType==4){//popup case-litigant
      if(this.modalType==3){
        this.sLitType = this.result.send_lit_type;
      }else{
        this.sLitType = this.result.lit_type;
      }
      this.listTable='1';

      this.loadModalComponent = false; //password confirm
      this.loadComponent = false;//popup form_id
      this.loadMutipleComponent = false;//popup Mutiple
      this.loadModalJudgeComponent = false;//popup Judg
      this.loadModalAppComponent = false;//popup appointment
      this.loadModalLitComponent = true;//popup case-litigant
      $("#exampleModal").find(".modal-content").css("width","800px");
    }else if(this.modalType==6){//popup appointment
      var student = JSON.stringify({
        "run_id" : this.dataHead.run_id,
        "split_type" : 1,
        "userToken" : this.userData.userToken
      });
      this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/getAppointData', student).subscribe(
        (response) =>{
          this.list = response;
          this.loadModalComponent = false; //password confirm
          this.loadComponent = false;//popup form_id
          this.loadMutipleComponent = false;//popup Mutiple
          this.loadModalJudgeComponent = false;//popup Judg
          this.loadModalAppComponent = true;//popup appointment
          this.loadModalLitComponent = false;
          $("#exampleModal").find(".modal-body").css("height","auto");
        },
        (error) => {}
      )
    }else if(this.modalType==7){//popup Judg
      var student = JSON.stringify({
        "cond":2,
        "userToken" : this.userData.userToken});
      this.listTable='pjudge';
      this.listFieldId='judge_id';
      this.listFieldName='judge_name';
      this.listFieldNull='';
      this.listFieldType=JSON.stringify({"type":2});

      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student).subscribe(
        (response) =>{
          this.loadModalComponent = false; //password confirm
          this.loadComponent = false;//popup form_id
          this.loadMutipleComponent = false;//popup Mutiple
          this.loadModalJudgeComponent = true;//popup Judg
          this.loadModalAppComponent = false;//popup appointment
          this.loadModalLitComponent = false;//
         let productsJson : any = JSON.parse(JSON.stringify(response));
         if(productsJson.data.length){
           this.list = productsJson.data;
         }else{
           this.list = [];
         }
        },
        (error) => {}
      )
    }else if(this.modalType==1 || this.modalType==2 || this.modalType==5 || this.modalType==8){
      if(this.modalType==1){
        var student = JSON.stringify({
          "table_name" : "pword_form",
          "field_id" : "form_id",
          "field_name" : "form_name",
          "field_name2" : "form_add",
          "condition" : " AND dep_use='"+this.userData.dep_use+"' AND form_type='"+this.result.form_type+"'",
          "userToken" : this.userData.userToken
        });
        this.listTable='pword_form';
        this.listFieldId='form_id';
        this.listFieldName='form_name';
        this.listFieldName2='form_add';
        this.listFieldCond=" AND dep_use='"+this.userData.dep_use+"' AND form_type='"+this.result.form_type+"'";

      }else if(this.modalType==2){
        var student = JSON.stringify({
          "table_name" : "pword_form",
          "field_id" : "form_id",
          "field_name" : "form_name",
          "field_name2" : "form_add",
          "condition" : " AND form_type='"+this.result.form_type+"'",
          "userToken" : this.userData.userToken
        });
        this.listTable='pword_form';
        this.listFieldId='form_id';
        this.listFieldName='form_name';
        this.listFieldName2='form_add';
        this.listFieldCond=" AND form_type='"+this.result.form_type+"'";

      }else if(this.modalType==5){
        var student = JSON.stringify({
          "table_name" : "pdoc_to",
          "field_id" : "docto_id",
          "field_name" : "docto_desc",
          "userToken" : this.userData.userToken
        });
        this.listTable='pdoc_to';
        this.listFieldId='docto_id';
        this.listFieldName='docto_desc';
        this.listFieldName2="";
        this.listFieldCond="";
      }else if(this.modalType==8){
        var student = JSON.stringify({
          "table_name" : "pofficer",
          "field_id" : "off_id",
          "field_name" : "off_name",
          "userToken" : this.userData.userToken
        });
        this.listTable='pofficer';
        this.listFieldId='off_id';
        this.listFieldName='off_name';
        this.listFieldName2="";
        this.listFieldCond="";
      }

      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
        (response) =>{
          this.list = response;
          this.loadModalComponent = false; //password confirm
          this.loadComponent = true;//popup form_id
          this.loadMutipleComponent = false;//popup Mutiple
          this.loadModalJudgeComponent = false;//popup Judg
          this.loadModalAppComponent = false;//popup appointment
          this.loadModalLitComponent = false;//
          $("#exampleModal").find(".modal-body").css("height","auto");
        },
        (error) => {}
      )
    }else if( this.modalType == 'cancelFlag' || this.modalType == 'deleteRow'){
      this.loadModalComponent = true; //password confirm
      this.loadComponent = false;//popup form_id
      this.loadMutipleComponent = false;//popup Mutiple
      this.loadModalJudgeComponent = false;//popup Judg
      this.loadModalAppComponent = false;//popup appointment
      this.loadModalLitComponent = false;//
      $("#exampleModal").find(".modal-content").css("width","600px");
    }
 }
 //-----popup 
  receiveFuncListData(event:any){
    // console.log("receiveFuncListData event=>", event)

    if(this.modalType==1 || this.modalType==2){
      this.result.form_id = event.fieldIdValue;
      if(event.fieldNameValue2){;
        this.result.form_desc = event.fieldNameValue + " "+event.fieldNameValue2+" ";
      }else{
        this.result.form_desc = event.fieldNameValue ;
      }
    }else if(this.modalType==3){
      this.result.send_lit_seq = event.fieldIdValue; 
      this.result.send_lit_name = event.fieldNameValue

    }else if(this.modalType==4 || this.modalType==5){
      this.result.accu_item = event.fieldIdValue; 
      this.result.accu_item_name = event.fieldNameValue

    }else if(this.modalType==6){
      this.result.app_name = event.fieldNameValue; 

    }else if(this.modalType==8){
      this.result.sign_off_id = event.fieldIdValue; 
      this.result.sign_off_name = event.fieldNameValue; 
    }
    this.closebutton.nativeElement.click();
  }

  //this.modalType==6
  receiveFuncAppData(event:any){
    // console.log("receiveFuncAppData=>", event);
    this.result.date_appoint = event.date_appoint;
    this.result.time_appoint = event.time_appoint;
    this.result.app_name = event.app_name;

    this.closebutton.nativeElement.click();
  }

  // this.modalType 3 4
  receiveFuncLitData(event:any){
    // console.log("receiveFuncLitData=>", event);
    if(this.modalType == 3)
    {
      if(event.fieldIdValue){
        this.result.send_lit_seq = event.fieldIdValue;
        this.result.send_lit_name = event.fieldNameValue;
      }else{
        this.result.send_lit_seq = event.seq;
        this.result.send_lit_name = event.lit_name;
      }
    }else{
      if(event.fieldIdValue){
        this.result.accu_item = event.fieldIdValue;
        this.result.accu_item_name = event.fieldNameValue;
      }else{
        this.result.accu_item = event.seq;
        this.result.accu_item_name = event.lit_name;
      }
    }
    this.closebutton.nativeElement.click();
  }

  //this.modalType==7
  receiveJudgeListData(event:any){
    // console.log("receiveJudgeListData event=>", event)
    this.result.judge_id = event.judge_id;
    this.result.judge_name = event.judge_name;
    this.closebutton.nativeElement.click();
  }

  //-----head ข้อมูลเลขคดี
  fnDataHead(event:any){
    console.log(this.runId)
    this.dataHead = event;
    if(this.dataHead.buttonSearch==1){
      this.runId = {'run_id' : event.run_id,'counter' : Math.ceil(Math.random()*10000),'notSearch':1}
      this.getData(1);
      // this.ngOnInit();
    }
    if(this.runId){
      this.getAppealDate();
      this. getNotice();
    }
  }
  //------------------

  getAppealDate(){
    if(typeof this.dataHead !='undefined' && this.dataHead.run_id){
      var student = JSON.stringify({
        "run_id" : this.dataHead.run_id,
        // "court_level" : 2,//เอามาทั้งหมด
        "userToken" : this.userData.userToken
      });
      console.log(student)
      
      this.http.post('/'+this.userData.appName+'ApiUD/API/APPEAL/getAppealList', student ).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          if(getDataOptions.data.length){
            var bar = new Promise((resolve, reject) => {
              getDataOptions.data.forEach((ele, index, array) => {
                if(ele.lit_send_name)
                  ele.description =  ele.description +' '+ ele.lit_send_name +' ผู้ยื่น';
              });  
              this.appealDate = getDataOptions.data;   
            });
            if(bar){   
              if(this.appeal_running)
                this.result.appeal_running=parseInt(this.appeal_running); 
            }    
          }else{
            this.appealDate =[];  
          }
        },
        (error) => {}
      );
    }
  }

  getNotice(){
    if(this.dataHead.run_id){
      var student = JSON.stringify({
        "run_id" : this.dataHead.run_id,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/getNoticeData', student).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if(productsJson.data.length){
            var bar = new Promise((resolve, reject) => {
              this.getNoticeData = productsJson.data;      
              this.getNoticeData.forEach((ele, index, array) => {
                ele.notice_desc = '('+ele.notice_court_running+')'+'-'+ele.notice_no+'/'+ele.notice_yy+' '+ ele.notice_type_name;
                if(ele.lit_type_desc)
                  ele.notice_desc = ele.notice_desc+' '+ele.lit_type_desc;
                if(ele.notice_date)
                  ele.notice_desc = ele.notice_desc + '('+ele.notice_date + ')'
              }); 
            });
            if(bar){ 
              if(this.notice_running)
                this.result.notice_running=parseInt(this.notice_running);
            }
          }else{
            this.getNoticeData = [];
          }
        },
        (error) => {}
      )
    }
  }

  assagnPrintJudge(){
    // console.log(this.result.print_judge);
    if(this.result.print_judge){
      if(this.dataHead.run_id){
        this.result.judge_id = this.dataHead.case_judge_id;
        this.result.judge_name = this.dataHead.case_judge_name;
      }
    }else{
      this.result.judge_id = "";
      this.result.judge_name = "";
    }
  }

  changeSelect(event:any){
    this.result.category_name = this.getCategoryName.find((x: any) => x.id === parseInt(event)).name;
  }

  submitForm() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    //เอาไว้เช็คตอน ส่งขอมูลให้ E-Notice
    if((this.result.form_type == 3 && this.result.announce_by == 3) && (!this.result.ditto_ref_no || !this.result.ditto_file_name)){
      confirmBox.setMessage('กรุณาระบุไฟล์คำสั่ง');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else if((this.result.form_type == 3 && this.result.announce_by == 3) && !this.result.announce_subject){
      confirmBox.setMessage('กรุณาระบุหัวข้อประกาศ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else{
      if(this.result.form_type == 3){
        var student = JSON.stringify({
          "run_id" : this.dataHead.run_id,
          "seq" : this.result.seq,
          "form_type" : this.result.form_type,
          "form_id" : this.result.form_id,
          "form_desc" : this.result.form_desc,
          "type_date" : this.result.type_date,
          "create_user" : this.result.create_user,
          "subject_name" : this.result.subject_name,
          "send_lit_type" : this.result.send_lit_type,
          "send_lit_seq" : this.result.send_lit_seq,
          "send_lit_name" : this.result.send_lit_name,
          "lit_type" : this.result.lit_type,
          "accu_item" : this.result.accu_item,
          "accu_item_name" : this.result.accu_item_name,
          "date_appoint" : this.result.date_appoint,
          "time_appoint" : this.result.time_appoint,
          "app_name" : this.result.app_name,
          "cancel_flag" : this.result.cancel_flag,
          "room_id" : this.result.room_id,
          "print_judge" : this.result.print_judge,
          "judge_id" : this.result.judge_id,
          "judge_name" : this.result.judge_name,
          "announce_date1" : this.result.announce_date1,
          "announce_date2" : this.result.announce_date2,
          "sign_off_id" : this.result.sign_off_id,
          "sign_off_name" : this.result.sign_off_name,
          "announce_by" : this.result.announce_by,
          "remark" : this.result.remark,
          "log_remark" : this.logRemark,
          "receipt_running" : this.receipt_running ? this.receipt_running : '',
          "led_running" : this.led_running ? this.led_running : '',
          // "appeal_running" : this.appeal_running ? this.appeal_running : '',
          "guar_running" : this.guar_running ? this.guar_running : '',
  
           //(เพิ่ม field ใหม่)
           "ditto_ref_no" : this.result.ditto_ref_no ?this.result.ditto_ref_no.toString() : "",
           "ditto_file_name" : this.result.ditto_file_name,
           "announce_subject" : this.result.announce_subject,
           "short_content" : this.result.short_content,
           "category_name" : this.result.category_name,
           "deed_number" : this.result.deed_number,
           "license_plate_number" : this.result.license_plate_number,
          //  "enotice_send_date":this.result.enotice_send_date, //พี่ต้อมบอกตอน save ไม่ต้องส่ง
          "notice_running" : this.result.notice_running,//รหัสหมาย
          "appeal_running" : this.result.appeal_running,//รายการอุทธรณ์/ฎีกา

          "userToken" : this.userData.userToken
          }); 
      }else{
        var student = JSON.stringify({
        "run_id" : this.dataHead.run_id,
        "seq" : this.result.seq,
        "form_type" : this.result.form_type,
        "form_id" : this.result.form_id,
        "form_desc" : this.result.form_desc,
        "type_date" : this.result.type_date,
        "create_user" : this.result.create_user,
        "lit_type" : this.result.lit_type,
        "accu_item" : this.result.accu_item,
        "accu_item_name" : this.result.accu_item_name,
        "date_appoint" : this.result.date_appoint,
        "time_appoint" : this.result.time_appoint,
        "app_name" : this.result.app_name,
        "room_id" : this.result.room_id,
        "print_judge" : this.result.print_judge,
        "judge_id" : this.result.judge_id,
        "judge_name" : this.result.judge_name,
        "announce_by" : this.result.announce_by,
        "remark" : this.result.remark,
        "receipt_running" : this.receipt_running ? this.receipt_running : '',
        "led_running" : this.led_running ? this.led_running : '',
        // "appeal_running" : this.appeal_running ? this.appeal_running : '',
        "guar_running" : this.guar_running ? this.guar_running : '',
        //(เพิ่ม field ใหม่)
        "ditto_ref_no" : this.result.ditto_ref_no ?this.result.ditto_ref_no.toString() : "",
        "ditto_file_name" : this.result.ditto_file_name,
        "announce_subject" : this.result.announce_subject,
        
        "short_content" : this.result.short_content,
        "category_name" : this.result.category_name,
        "deed_number" : this.result.deed_number,
        "license_plate_number" : this.result.license_plate_number,
        // "enotice_send_date" : this.result.enotice_send_date,//พี่ต้อมบอกตอน save ไม่ต้องส่ง
        "notice_running" : this.result.notice_running,//รหัสหมาย
        "appeal_running" : this.result.appeal_running,//รายการอุทธรณ์/ฎีกา
        "userToken" : this.userData.userToken
        });
      }
      this.SpinnerService.show();
  
      this.http.disableLoading().post('/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0800/saveData', student).subscribe(
        (response) =>{
          let alertMessage : any = JSON.parse(JSON.stringify(response));
          if(alertMessage.result==0){
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
          }else{
            this.result.seq=alertMessage.seq;
            this.SpinnerService.hide();
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                this.getData(1);
              }
              subscription.unsubscribe();
            });
          }
        },
        (error) => {this.SpinnerService.hide();}
      )
    }
  }

  deleteData(index:any){ 
    // console.log("deleteData=>", index);
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
    if(this.posts[index]['form_type'] == 3){
      this.result.seq  = this.posts[index]['seq'];
      this.result.file_exists  = this.posts[index]['file_exists'];
      this.result.form_type  = this.posts[index]['form_type'];
      this.result.form_id  = this.posts[index]['form_id'];
      this.result.form_desc  = this.posts[index]['form_desc'];
      this.result.type_date = this.posts[index]['type_date'];
      this.result.create_user = this.posts[index]['create_user'];
      this.result.subject_name = this.posts[index]['subject_name'];
      this.result.send_lit_type = this.posts[index]['send_lit_type'];
      this.result.send_lit_seq = this.posts[index]['send_lit_seq'];
      this.result.send_lit_name  = this.posts[index]['send_lit_name'];
      this.result.lit_type  = this.posts[index]['lit_type'];
      this.result.accu_item  = this.posts[index]['accu_item'];
      this.result.accu_item_name  = this.posts[index]['accu_item_name'];
      this.result.date_appoint  = this.posts[index]['date_appoint'];
      this.result.time_appoint  = this.posts[index]['time_appoint'];
      this.result.app_name  = this.posts[index]['app_name'];
      this.result.room_id  = this.posts[index]['room_id'];
      this.result.cancel_flag  = this.posts[index]['cancel_flag'];
      this.result.print_judge  = this.posts[index]['print_judge'];
      this.result.judge_id  = this.posts[index]['judge_id'];
      this.result.judge_name  = this.posts[index]['judge_name'];
      this.result.announce_date1  = this.posts[index]['announce_date1'];
      this.result.announce_date2  = this.posts[index]['announce_date2'];
      this.result.announce_by  = this.posts[index]['announce_by'];
      this.result.sign_off_id  = this.posts[index]['sign_off_id'];
      this.result.sign_off_name  = this.posts[index]['sign_off_name'];
      this.result.remark  = this.posts[index]['remark'];
    }else{
      this.result.seq  = this.posts[index]['seq'];
      this.result.file_exists  = this.posts[index]['file_exists'];
      this.result.form_type  = this.posts[index]['form_type'];
      this.result.form_id  = this.posts[index]['form_id'];
      this.result.form_desc  = this.posts[index]['form_desc'];
      this.result.type_date = this.posts[index]['type_date'];
      this.result.create_user = this.posts[index]['create_user'];
      this.result.lit_type  = this.posts[index]['lit_type'];
      this.result.accu_item  = this.posts[index]['accu_item'];
      this.result.accu_item_name  = this.posts[index]['accu_item_name'];
      this.result.date_appoint  = this.posts[index]['date_appoint'];
      this.result.time_appoint  = this.posts[index]['time_appoint'];
      this.result.app_name  = this.posts[index]['app_name'];
      this.result.room_id  = this.posts[index]['room_id'];
      this.result.print_judge  = this.posts[index]['print_judge'];
      this.result.judge_id  = this.posts[index]['judge_id'];
      this.result.judge_name  = this.posts[index]['judge_name'];
      this.result.announce_by  = this.posts[index]['announce_by'];
      this.result.remark  = this.posts[index]['remark'];
    }

    
    this.seq_running = this.posts[index]['seq'];
    this.receipt_running = this.posts[index]['receipt_running'];
    this.led_running = this.posts[index]['led_running'];
    this.appeal_running = this.posts[index]['appeal_running'] ;
    this.guar_running = this.posts[index]['guar_running'];

    //(เพิ่ม field ใหม่)
    this.resultTmp.ditto_file_name = this.posts[index]['ditto_file_name'];
    this.result.ditto_ref_no  = this.posts[index]['ditto_ref_no'];
    this.result.ditto_file_name  = this.posts[index]['ditto_file_name'];
    this.result.announce_subject  = this.posts[index]['announce_subject'];
    this.result.enotice_send_date  = this.posts[index]['enotice_send_date'];
    this.result.enotice_file  = this.posts[index]['enotice_file'];
    this.result.short_content  = this.posts[index]['short_content'];
    this.result.category_name  = this.posts[index]['category_name'];
    this.result.deed_number  = this.posts[index]['deed_number'];
    this.result.license_plate_number  = this.posts[index]['license_plate_number'];

    if(this.posts[index]['appeal_running']== 0)
    this.result.appeal_running  = '';//รายการอุทธรณ์/ฎีกา
    else
      this.result.appeal_running  = this.posts[index]['appeal_running'];//รายการอุทธรณ์/ฎีกา
    
    this.result.notice_running  = this.posts[index]['notice_running'];//รหัสหมาย

    setTimeout(() => {
      this.SpinnerService.hide();
    }, 500);

  }

  submitModalForm(){
    console.log("submitModalForm=>");
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
        if (resp.success==true){}
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
          // console.log(this.modalType)
          if(productsJson.result==1){
            if(this.modalType == 'cancelFlag'){//ยกเลิกประกาศ
              // if(this.cancelTypeFlag == 3){//ยกเลิกประกาศ
              const confirmBox = new ConfirmBoxInitializer();
              if(this.result.cancel_flag){
                confirmBox.setMessage('ต้องการยกเลิกประกาศ');
              }else{
                confirmBox.setMessage('ต้องการยกเลิกการยกเลิกประกาศ');
              }
              confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                    this.cancelTypeFlag = "";
                    this.closebutton.nativeElement.click();
                    this.logRemark = chkForm.log_remark;
                    this.submitForm();
                  }
                  subscription.unsubscribe();
              });
              this.modalType = ""
            }else{
              this.closebutton.nativeElement.click();
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
                  if(this.indexDelete >= 0 && this.posts[this.indexDelete]['seq'] != ""){
                    var dataDel = [],dataTmp=[];
                    var bar = new Promise((resolve, reject) => {
                        dataTmp.push(this.posts[this.indexDelete]);
                    });
                    if(bar){
                      dataDel['userToken'] = this.userData.userToken;
                      dataDel['log_remark'] = chkForm.log_remark;
                      dataDel['data']= dataTmp;
                      var data = $.extend({}, dataDel);
                      this.http.post('/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0800/deleteDataSelect', data).subscribe(
                      (response) =>{
                        let alertMessage : any = JSON.parse(JSON.stringify(response));
                        if(alertMessage.result==0){
                          this.SpinnerService.hide();
                        }else{
                          this.modalType="";
                          this.getData(1);
                          this.setDefForm(1);
                        }
                      },
                        (error) => {this.SpinnerService.hide();}
                      )
                    }
                  }
                }
                subscription.unsubscribe();
              });
            }
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

  getData(type:any){
    if(type ==1){
      this.posts = [];
      var run_id = this.dataHead.run_id?this.dataHead.run_id:this.runId;
      if(run_id){
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');

        this.SpinnerService.show();

        var student = JSON.stringify({
          "run_id" : run_id,
          "userToken" : this.userData.userToken
        });
        this.http.disableLoading().post('/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0800/getData', student).subscribe(posts => {
            let productsJson : any = JSON.parse(JSON.stringify(posts));
            this.posts = productsJson.data;
            if(productsJson.result==1){
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
      }
    }else if(type==2){
      if(this.result.seq){
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
  
        this.SpinnerService.show();
  
        var student = JSON.stringify({
          "seq" : this.result.seq,
          "userToken" : this.userData.userToken
        });
        this.http.disableLoading().post('/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0800/getData', student).subscribe(posts => {
            let productsJson : any = JSON.parse(JSON.stringify(posts));
            if(productsJson.result==1){
              this.result = productsJson.data[0];
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
      }
    }
  }

  deleteWord(){
    var run_id = this.dataHead.run_id?this.dataHead.run_id:this.runId;
    if(run_id){
      var student = JSON.stringify({
        "run_id" : this.dataHead.run_id,
        "userToken" : this.userData.userToken
      });
      this.http.disableLoading().post('/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0800/getData', student).subscribe(posts => {
      let productsJson : any = JSON.parse(JSON.stringify(posts));  
      let file:any="";
      productsJson.data.forEach((ele, index, array) => {
        if((ele.run_id == this.dataHead.run_id)&&(ele.seq == this.result.seq)){
          if(ele.file_exists)
            file = ele.file_exists;
        }
      });
      if(file){
          const confirmBox = new ConfirmBoxInitializer();
          confirmBox.setTitle('ข้อความแจ้งเตือน');
          confirmBox.setMessage('ต้องการลบไฟล์ Word');
          confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){
            const confirmBox2 = new ConfirmBoxInitializer();
            confirmBox2.setTitle('ข้อความแจ้งเตือน');
            confirmBox2.setMessage('ยืนยันการลบไฟล์ word อีกครั้ง');
            confirmBox2.setButtonLabels('ตกลง', 'ยกเลิก');
            confirmBox2.setConfig({
                layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox2.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){
              var student = JSON.stringify({
              "seq" : this.result.seq,
              "userToken" : this.userData.userToken
              });
              this.http.post('/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0800/deleteFile', student).subscribe(
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
                      if (resp.success==true){}
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
                      if (resp.success==true){}
                      subscription.unsubscribe();
                    });
                    this.getData(1);
                  }
                },
                (error) => {this.SpinnerService.hide();}
                )
              }
              subscription.unsubscribe();
              });
            }
            subscription.unsubscribe();
            });
          }else{
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage('ไม่พบไฟล์ Word');
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){}
              subscription.unsubscribe();
            });
          }
      }); 
    } 
  }

  clickOpenFile(index:any){
    if(this.posts[index]['file_exists']){
      myExtObject.OpenWindowMax('/'+this.userData.appName+'ApiKN/API/KEEPN/loadReport?file_name='+this.posts[index]['file_name']);
    // var student = JSON.stringify({
    //   "seq" : this.posts[index]['seq'],
    //   "userToken" : this.userData.userToken
    //   }); 
    //   this.http.post('/'+this.userData.appName+'ApiKN/API/KEEPN/loadReport', student).subscribe(
    //     (response) =>{
    //       let alertMessage : any = JSON.parse(JSON.stringify(response));
    //       if(alertMessage.result==1){
    //         myExtObject.OpenWindowMax(alertMessage.file);
    //       }
    //     },
    //     (error) => {this.SpinnerService.hide();}
    //   )
    }
  }

  printReport(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!this.result.form_id){
      confirmBox.setMessage('กรุณาเลือกแบบ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          // this.setFocus('type_date');
        }
        subscription.unsubscribe();
      });
    }else if(!this.result.seq){
        confirmBox.setMessage('กรุณาจัดเก็บข้อมูลก่อน');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){
            // this.setFocus('type_date');
          }
          subscription.unsubscribe();
        });
    }else{
      var student = JSON.stringify({
        "seq" : this.result.seq,
        "form_id" : this.result.form_id,
        "print_judge" : this.result.print_judge,
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
              //this.result.file_exists = true;
              myExtObject.OpenWindowMax(alertMessage.file);
              this.getData(1);
            }
          },
          (error) => {this.SpinnerService.hide();}
        )
    }
  }

  printReportAdmin(){//โดยปุ่ม นีั้จะทำการเปิด word  แล้ว save ไปที่ server ไม่ใช down load มาเปิดที่เครื่อง client
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!this.result.form_id){
      confirmBox.setMessage('กรุณาเลือกแบบ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else if(!this.result.seq){
        confirmBox.setMessage('กรุณาจัดเก็บข้อมูลก่อน');
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
        "seq" : this.result.seq,
        "form_id" : this.result.form_id,
        "print_judge" : this.result.print_judge,
        "open_flag" : 1,
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
              this.getData(1);
            }
          },
          (error) => {this.SpinnerService.hide();}
        )
    }
  }

  sendToENotice(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!this.result.seq){
      confirmBox.setMessage('กรุณาจัดเก็บข้อมูลก่อน');
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
      "seq" : this.result.seq,
      "form_id" : this.result.form_id,
      "print_judge" : this.result.print_judge,
      "userToken" : this.userData.userToken
      }); 
      this.SpinnerService.show(); 
      this.http.disableLoading().post('/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0800/sendToENotice', student).subscribe(
        (response) =>{
          let alertMessage : any = JSON.parse(JSON.stringify(response));
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
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                this.getData(2);
              }
              subscription.unsubscribe();
            });
          }
        },
        (error) => {this.SpinnerService.hide();}
      )
    }
  }

  buttonNew(){
    this.ngOnInit();
    // let winURL = window.location.href.split("/#/")[0]+"/#/";
    // //console.log(winURL+'fkn0800')
    // location.replace(winURL+'fkn0800')
    // window.location.reload();
  }

  onOpenDitto = () => {
    if(this.dataHead.run_id){
      const modalRef = this.ngbModal.open(PopupDittoComponent)
      modalRef.componentInstance.run_id = this.dataHead.run_id
      modalRef.componentInstance.doc_type_id = 100
      modalRef.result.then((item: any) => {
        if(item){
          console.log(item)
          this.result.ditto_ref_no = item.ref_no;
          this.result.ditto_file_name = item.file_name;
        }
      }).catch((error: any) => {
        console.log(error)
      })
    }
  }

  clickOpenFileDitto(ref_no:any){
    if(ref_no){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      var student = JSON.stringify({
        "ref_no" : ref_no
      });
      this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/fca0230/openDittoAttach', student).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          if(getDataOptions.result==1){
              myExtObject.OpenWindowMax(getDataOptions.file);
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
}