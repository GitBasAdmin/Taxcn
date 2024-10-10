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
import { ModalReceiptComponent } from '../../modal/modal-receipt/modal-receipt.component';
import { PrintReportService } from '@app/services/print-report.service';
import { NgSelectComponent } from '@ng-select/ng-select';
declare var myExtObject: any;

@Component({
  selector: 'app-fkr0300,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fkr0300.component.html',
  styleUrls: ['./fkr0300.component.css']
})


export class Fkr0300Component implements AfterViewInit, OnInit, OnDestroy,AfterContentInit {
  //form: FormGroup;
  title = 'datatables';

  posts:any;
  postsSearch:any;
  search:any;
  masterSelected:boolean;
  checklist:any;
  checkedList:any;
  delValue:any;
  sessData:any;
  userData:any;
  programName:any;
  modalType:any;
  cancelTypeFlag:any;
  indexDelete:any;
  myExtObject: any;
  sLitType:any;

  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  asyncObservable: Observable<string>;

  dataHead:any = [];
  result:any = [];
  runId:any

  getRcvType:any;
  getPrFlag:any;
  getCerFlag:any;
  getLitType:any;
  getRcvLitType:any;
  getCopyDetailSetup:any;
  getCopyReqTitle:any;
  item:any=[];
  edit_item:any=[];
  copy_id:any=[];
  copy_name:any=[];
  copy_desc:any=[];
  num_copy:any=[];
  guar_fag:any=[];
  index_editData:any;

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

  public loadComponent: boolean = false;
  public loadModalComponent: boolean = false;//password confirm
  public loadModalLitComponent : boolean = false; 
  public loadPopupReceiptComponent : boolean = false; 
  
 
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
    private printReportService: PrintReportService
  ){ }

  ngOnInit(): void {

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.successHttp();
    this.setDefPage(1);//--set default
    
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 30,
      processing: true,
      searching : false,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[]
    };
    //-----
    if(typeof this.dataHead.run_id != "undefined"){
      var student = JSON.stringify({
        "run_id" : this.dataHead.run_id,
        "userToken" : this.userData.userToken
      });
      // console.log("student=>", student);
      this.http.post('/'+this.userData.appName+'ApiKR/API/KEEPR/fkr0300', student).subscribe(
      posts => {
        let productsJson : any = JSON.parse(JSON.stringify(posts));
        this.posts = productsJson.data;
        // console.log("productsJson=>", productsJson.data);
        if(productsJson.result==1){

          var bar = new Promise((resolve, reject) => {
            productsJson.data.forEach((ele, index, array) => {
                  if(ele.copy_title != null){
                    productsJson.data[index]['copy_title_desc'] = ele.copy_title + ele.copy_no + '/' + ele.copy_yy;
                  }

                  productsJson.data[index]['rcv_fee']= this.curencyFormat(productsJson.data[index]['rcv_fee'],2);
              });
          });

          this.checklist = this.posts;
          if(productsJson.data.length)
            this.posts.forEach((x : any ) => x.edit0401 = false);
          this.rerender();
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
        this.getRcvLitType = getDataOptions;
      },
      (error) => {}
    )

    //======================== pcopy_detail_setup ======================================
    var student = JSON.stringify({
      "table_name"  : "pcopy_detail_setup",
      "field_id"    : "copy_id",
      "field_name"  : "copy_name",
      "order_by"  : "order_no ASC",
      "userToken"   : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCopyDetailSetup = getDataOptions;
        // console.log("this.getCopyDetailSetup=>", this.getCopyDetailSetup);
        for(var i = 0; i < this.getCopyDetailSetup.length; i++){
              this.item[i]=i+1;
              this.guar_fag[i]=1;
              this.copy_id[i]=this.getCopyDetailSetup[i].fieldIdValue;
              this.copy_name[i]=this.getCopyDetailSetup[i].fieldNameValue;
        }
      },
      (error) => {}
    )
    //======================== pcase_litigant ======================================
    var student = JSON.stringify({
      "table_name"  : "pcopy_req_title",
      "field_id"    : "req_title",
      "field_name"  : "req_title",
      "userToken"   : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCopyReqTitle = getDataOptions;
        this.runDateNo(this.getCopyReqTitle);
        // console.log("this.getCopyReqTitle=>", this.getCopyReqTitle);
      },
      (error) => {}
    )

    this.getRcvType=[{fieldIdValue:1,fieldNameValue: 'นัดรับเอกสาร'},{fieldIdValue:2,fieldNameValue: 'รอรับเอกสาร'},{fieldIdValue:3,fieldNameValue: 'ส่งไปรษณีย์'}];
    this.getPrFlag=[{fieldIdValue:'',fieldNameValue: ''},{fieldIdValue:1,fieldNameValue: 'จ่ายเพิ่ม'},{fieldIdValue:2,fieldNameValue: 'รับคืน'}];
    this.getCerFlag=[{fieldIdValue:'',fieldNameValue: ''},{fieldIdValue:1,fieldNameValue: 'จ่ายเพิ่ม'},{fieldIdValue:2,fieldNameValue: 'รับคืน'}];
  }

  successHttp() {
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fkr0300"
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

  setDefPage(type:any){
    this.result=[];
    this.copy_desc=[];
    this.num_copy=[];
    

    if(type == 1){
      this.copy_id=[];
      this.guar_fag=[];
      this.item=[];
      this.edit_item=[];
      this.runId = "";
      this.index_editData="";

      this.result.copy_running=0;
      this.result.rcv_fee = "0.00";
      this.result.rcv_certificate = "0.00";
      this.result.pr_amt = "0.00";
      this.result.cer_amt = "0.00";
      this.result.req_date = myExtObject.curDate();
      this.result.date_run_title = "A";
      this.result.lit_type = 1;
      this.result.rcv_lit_type = 1;
      this.result.rcv_type = 1;
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

  closeModal(){
    this.loadModalComponent = false; //password confirm
    this.loadComponent = false;
    this.loadModalLitComponent = false;//
    this.loadPopupReceiptComponent = false;//
  }

  goToLink(url: string){
    window.open(url, "_blank");
  }

  assignNumCopy(index:any){
    this.num_copy[index] = 1;
  }

  tabChangeInput(name:any,event:any){
     if(name=='req_user_id'){//1 2
      var student = JSON.stringify({
        "table_name" : "pcase_litigant",
         "field_id" : "lit_running",
         "field_name" : "title",
         "field_name2" : "name",
         "condition" : " AND run_id='"+this.dataHead.run_id+"' AND seq='"+event.target.value+"' AND lit_type='"+this.result.lit_type+"'",
        "userToken" : this.userData.userToken
      });    
      // console.log("send_lit_seq student=>", student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        // console.log("send_lit_seq productsJson=>", productsJson);
        if(productsJson.length){
          this.result.req_user_name = productsJson[0].fieldNameValue+productsJson[0].fieldNameValue2;
        }else{
          this.result.req_user_id = '';
          this.result.req_user_name = '';
        }
        },
        (error) => {}
      )
    }else if(name=='rcv_user_id'){//3
      var student = JSON.stringify({
        "table_name" : "pcase_litigant",
         "field_id" : "lit_running",
         "field_name" : "title",
         "field_name2" : "name",
         "condition" : " AND run_id='"+this.dataHead.run_id+"' AND seq='"+event.target.value+"' AND lit_type='"+this.result.rcv_lit_type+"'",
        "userToken" : this.userData.userToken
      });    
      // console.log("send_lit_seq student=>", student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        // console.log("send_lit_seq productsJson=>", productsJson);
        if(productsJson.length){
          this.result.rcv_user_name = productsJson[0].fieldNameValue+productsJson[0].fieldNameValue2;
        }else{
          this.result.rcv_user_id = '';
          this.result.rcv_user_name = '';
        }
        },(error) => {}
      )
    }
  }

  clickOpenMyModalComponent(type:any){
    this.modalType=type;
    if((type==1 || type==2 || type==3|| type==4) && !this.dataHead.run_id){
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
      this.openbutton.nativeElement.click();
    }
  }


  loadMyModalComponent(){
    if(this.modalType==1 || this.modalType==2 || this.modalType==3){//popup case-litigant
      $("#exampleModal").find(".modal-content").css("width","800px");
      if(this.modalType==1){
        this.listTable='3';
        this.sLitType = this.result.lit_type;
      }else if(this.modalType==2){
        this.listTable='2';
        this.sLitType = this.result.lit_type;
      }else{
        this.listTable='3';
        this.sLitType = this.result.rcv_lit_type;
      }
     
      this.loadModalComponent = false; //password confirm
      this.loadComponent = false;
      this.loadModalLitComponent = true;
      this.loadPopupReceiptComponent = false;
      
    }else if(this.modalType==4){

      this.loadModalComponent = false; //password confirm
      this.loadComponent = false;
      this.loadModalLitComponent = false;
      this.loadPopupReceiptComponent = true;
      $("#exampleModal").find(".modal-content").css("width","1000px");

    }else{
      this.loadModalComponent = true; //password confirm
      this.loadComponent = false;
      this.loadModalLitComponent = false;
      this.loadPopupReceiptComponent = false;
      $("#exampleModal").find(".modal-content").css("width","600px");
    }
     
 }
 //-----popup 
  receiveFuncListData(event:any){
    this.closebutton.nativeElement.click();
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

  curencyFormatInt(val: string){
    if (val !== undefined && val !== null) {
      let tmp=val.split(".");
      return  tmp[0]
    } else {
      return "";
    }
  }


  receiveFuncLitData(event:any){
    // console.log("receiveFuncLitData=>",this.modalType,"=>", event);
    if(this.modalType==1 || this.modalType==2){
      if(this.modalType==2){
        this.result.lit_type = event.lit_type; 
      }
      this.result.req_user_id = event.seq; 
      this.result.req_user_name = event.lit_name

    }else if(this.modalType==3){

      this.result.rcv_lit_type = event.lit_type; 
      this.result.rcv_user_id = event.seq; 
      this.result.rcv_user_name = event.lit_name

    }else if(this.modalType==4){
      this.result.receipt_running = event.receipt_running; 
      this.result.receipt_no = event.receipt_no; 
      this.result.receipt_item = event.rcv_amt; 
    }

    this.closebutton.nativeElement.click();
  }

  //--------------------
  //-----head ข้อมูลเลขคดี
  fnDataHead(event:any){
    this.dataHead = event;
    if(this.dataHead.buttonSearch==1){
      this.ngOnInit();
      this.result.run_id= this.dataHead;
      this.runId = {'run_id' : event.run_id,'counter' : Math.ceil(Math.random()*10000),'notSearch':1}
    }
  }

  submitForm() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!this.dataHead.run_id){
      confirmBox.setMessage('กรุณาค้นหาข้อมูลเลขดคี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          // this.setFocus('judgName');
        }
        subscription.unsubscribe();
      });
    }else if(!this.result.req_date){
      confirmBox.setMessage('กรุณาระบุวันที่ขอคัดถ่าย');
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
    }else if(!this.result.date_run_no){
      confirmBox.setMessage('กรุณาระบุเลขที่อ้างอิงประจำวัน');
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
      let deposit=[];

        // console.log("item",this.item.length);
      for(var index=0;index<this.item.length;index++){

        if(this.edit_item[index]){
          if(this.copy_desc[index] || this.num_copy[index]){
            //update row
            var update_row = {
              "item" : this.item[index],
              "edit_item" : this.edit_item[index],
              "copy_id" : this.copy_id[index],
              "copy_desc" : this.copy_desc[index],
              "num_copy" : this.num_copy[index],
              "guar_fag" : this.guar_fag[index]
            };
            deposit.push(update_row);
          }else  if(!this.copy_desc[index] && !this.num_copy[index]){
            // delete row
            var detete_row = {
            "item" : this.item[index],
            "edit_item" : this.edit_item[index],
            "copy_id" : this.copy_id[index],
            "copy_desc" : this.copy_desc[index],
            "num_copy" : this.num_copy[index],
            "guar_fag" : this.guar_fag[index],
            "delete" : 1
          };
            deposit.push(detete_row);
          }
        }else{
          //insert row
          this.item[index] = index+1;
          if(this.copy_desc[index] || this.num_copy[index]){
            var insert_row = {
              "item" : this.item[index],
              "edit_item" : 0,
              "copy_id" : this.copy_id[index],
              "copy_desc" : this.copy_desc[index],
              "num_copy" : this.num_copy[index],
              "guar_fag" : this.guar_fag[index]
            };
            deposit.push(insert_row);
          }
        }
      }

      //-----------------------------
      if(!this.result.receipt_running)
          this.result.receipt_running = null;
      if(!this.result.receipt_item){
        this.result.receipt_item = null;
      }else{
        this.result.receipt_item = this.curencyFormatRemove(this.result.receipt_item);//
        this.result.receipt_item = this.curencyFormatInt(this.result.receipt_item);//
      }
        
      var student1 = JSON.stringify({

        "run_id" : this.dataHead.run_id,
        "copy_running" : this.result.copy_running,
        "copy_title" : this.result.date_run_title,
        "copy_no" : this.result.copy_no,
        "copy_yy" : this.result.copy_yy,
        "req_date" : this.result.req_date,
        "date_run_title" : this.result.date_run_title,
        "date_run_no" : this.result.date_run_no,
        "lit_type" : this.result.lit_type,
        "req_user_id" : this.result.req_user_id,
        "req_user_name" : this.result.req_user_name,
        "rcv_due_date" : this.result.rcv_due_date,
        "rcv_type" : this.result.rcv_type,
        "round_flag" : this.result.round_flag,
        "rcv_fee" : this.curencyFormatRemove(this.result.rcv_fee),//
        "rcv_certificate" : this.curencyFormatRemove(this.result.rcv_certificate),//
        "rcv_date" : this.result.rcv_date,
        "pr_flag" : this.result.pr_flag,
        "pr_amt" : this.curencyFormatRemove(this.result.pr_amt),//
        "cer_flag" : this.result.cer_flag,
        "cer_amt" : this.curencyFormatRemove(this.result.cer_amt),//
        "rcv_lit_type" : this.result.rcv_lit_type,
        "rcv_user_id" : this.result.rcv_user_id,
        "rcv_user_name" : this.result.rcv_user_name,
        "page_qty" : parseInt(this.curencyFormatRemove(this.result.page_qty)),
        "finish_flag" : this.result.finish_flag,
        "finish_date" : this.result.finish_date,
        "cancel_flag" : this.result.cancel_flag,
        "cancel_reason" : this.result.cancel_reason,
        "receipt_running" : this.result.receipt_running,//
        "receipt_item" : this.result.receipt_item,//
        "remark" : this.result.remark,
        "userToken" : this.userData.userToken,
        "data" : deposit
      });        
      // console.log("student1=>", student1);
      this.http.post('/'+this.userData.appName+'ApiKR/API/KEEPR/fkr0300/saveData', student1).subscribe(
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
                  this.SpinnerService.hide();
                }
                subscription.unsubscribe();
              });
            }else{
              this.SpinnerService.hide();
              confirmBox.setMessage('ข้อความแจ้งเตือน');
              confirmBox.setMessage(alertMessage.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  // $("button[type='reset']")[0].click();
                }
                subscription.unsubscribe();
              });
              this.result.copy_running = alertMessage.copy_running;
              this.getData();
              //list ทุนทรัพย์
              this.getCopyReqDetail(this.result.copy_running);
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
    this.setDefPage('');
    this.SpinnerService.show();
    this.runId = this.posts[index]['run_id'];

    this.result.run_id  = this.posts[index]['run_id'];
    this.result.copy_running  = this.posts[index]['copy_running'];
    this.result.copy_title  = this.posts[index]['copy_title'];
    this.result.copy_yy  = this.posts[index]['copy_yy'];
    this.result.copy_no  = this.posts[index]['copy_no'];
    this.result.copy_yy  = this.posts[index]['copy_yy'];
    this.result.req_date  = this.posts[index]['req_date'];
    this.result.date_run_title  = this.posts[index]['date_run_title'];
    this.result.date_run_no  = this.posts[index]['date_run_no'];
    this.result.lit_type  = this.posts[index]['lit_type'];
    this.result.req_user_id  = this.posts[index]['req_user_id'];
    this.result.req_user_name  = this.posts[index]['req_user_name'];
    this.result.rcv_due_date  = this.posts[index]['rcv_due_date'];
    this.result.rcv_type  = this.posts[index]['rcv_type'];
    this.result.round_flag  = this.posts[index]['round_flag'];
    this.result.rcv_fee  = this.posts[index]['rcv_fee'],2;//
    this.result.rcv_certificate  = this.curencyFormat(this.posts[index]['rcv_certificate'],2);//
    this.result.rcv_date  = this.posts[index]['rcv_date'];
    this.result.pr_amt  = this.curencyFormat(this.posts[index]['pr_amt'],2);
    this.result.cer_amt  = this.curencyFormat(this.posts[index]['cer_amt'],2);
    this.result.rcv_lit_type  = this.posts[index]['rcv_lit_type'];
    this.result.rcv_user_id  = this.posts[index]['rcv_user_id'];
    this.result.rcv_user_name  = this.posts[index]['rcv_user_name'];
    this.result.page_qty  = this.curencyFormat(this.posts[index]['page_qty'], 2);
    this.result.finish_flag  = this.posts[index]['finish_flag'];
    this.result.finish_date  = this.posts[index]['finish_date'];
    this.result.cancel_flag  = this.posts[index]['cancel_flag'];
    this.result.cancel_reason  = this.posts[index]['cancel_reason'];
    this.result.remark  = this.posts[index]['remark'];
    this.result.create_dep_code  = this.posts[index]['create_dep_code'];
    
    if(this.posts[index]['pr_flag'] == 0){this.result.pr_flag  = "";}
    else {this.result.pr_flag  = this.posts[index]['pr_flag'];}

    if(this.posts[index]['cer_flag'] == 0){this.result.cer_flag  = "";}
    else{this.result.cer_flag  = this.posts[index]['cer_flag'];}

    if(this.posts[index]['receipt_running'] == 0){
      this.result.receipt_running  = "";
      this.result.receipt_no = "";
      this.result.receipt_item  = "";
    }
    else{
      this.result.receipt_running  = this.posts[index]['receipt_running'];
      this.result.receipt_no  = this.posts[index]['receipt_no'];
      this.result.receipt_item  = this.curencyFormat(this.posts[index]['receipt_item'],2);
    }

    //list ทุนทรัพย์
    this.getCopyReqDetail(this.result.copy_running);

    setTimeout(() => {
      this.SpinnerService.hide();
    }, 100);

  }

  //ทุนทรัพย์
  getCopyReqDetail(copyRunning:any){
    var student = JSON.stringify({
      "copy_running" : copyRunning,
      "userToken" : this.userData.userToken
    });
    // console.log("editData=>",student)
    this.item = [];
    this.http.post('/'+this.userData.appName+'ApiKR/API/KEEPR/fkr0300/getCopyReqDetail', student ).subscribe(
    (response) =>{
      let getDataOptions : any = JSON.parse(JSON.stringify(response));
      let addItem=false;
     
      console.log("edit getDataOptions=>", getDataOptions);
      this.rerender();
      var bar = new Promise((resolve, reject) => {
        getDataOptions.data.forEach((ele, index, array) => {
          if(ele.item){
            this.item[index] = ele.item;
            this.copy_id[index] = ele.copy_id1;
            this.copy_name[index]= ele.copy_name;
            this.edit_item[index] = ele.item;
            this.copy_desc[index] = ele.copy_desc;
            this.num_copy[index] = ele.num_copy;
            this.guar_fag[index] = ele.guar_fag
          }else{
            this.item[index] = index;
            this.copy_id[index] = ele.copy_id1;
            this.copy_name[index]= ele.copy_name;
            this.edit_item[index] = ele.item;
            this.copy_desc[index] = ele.copy_desc;
            this.num_copy[index] = ele.num_copy;
            this.guar_fag[index] = 1
          }
          //copy_id=12 อื่นๆ
          if(ele.copy_id == 12){
            addItem = true;
          }
        });
      });
      if(addItem){
        //มีการป้อนรายละเอียดอื่นๆ แล้วกดปุ่ม จัดเก็บ จะต้องเพิ่มบรรทัดอื่นๆ
        let index  = getDataOptions.data.length;
        this.item[index] = getDataOptions.data.length;
        this.copy_id[index] = 12;
        this.copy_name[index]= "อื่นๆ";
        this.edit_item[index] = "";
        this.copy_desc[index] = "";
        this.num_copy[index] = "";
        this.guar_fag[index]= 1;
      }
    });
  }

  submitModalForm(){
    // console.log("submitModalForm=>");
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
      // console.log("checkPassword student=> ", student);
      this.http.post('/'+this.userData.appName+'Api/API/checkPassword', student).subscribe(
        posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          // console.log(productsJson)
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
                console.log((this.indexDelete >= 0 && this.posts[this.indexDelete]['copy_running'] != ""))
                console.log((this.indexDelete ,this.posts[this.indexDelete]['copy_running'] ))
                if(this.indexDelete >= 0 && this.posts[this.indexDelete]['copy_running'] != ""){
                  var dataDel = [],dataTmp=[];
                  var bar = new Promise((resolve, reject) => {
                      dataTmp.push(this.posts[this.indexDelete]);
                  });
                  if(bar){
                    dataDel['userToken'] = this.userData.userToken;
                    dataDel['data']= dataTmp;
                    var data = $.extend({}, dataDel);
                    this.http.post('/'+this.userData.appName+'ApiKR/API/KEEPR/fkr0300/deleteSelect', data).subscribe(
                    (response) =>{
                      let alertMessage : any = JSON.parse(JSON.stringify(response));
                      if(alertMessage.result==0){
                        this.SpinnerService.hide();
                      }else{
                        this.modalType="";
                        this.closebutton.nativeElement.click();
                        //$("button[type='reset']")[0].click();
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
        },(error) => {}
      );
    }
  }

  getData(){
    this.posts = [];
    if(typeof this.dataHead.run_id != "undefined"){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      this.SpinnerService.show();

      var student = JSON.stringify({
        "run_id" : this.dataHead.run_id,
        "userToken" : this.userData.userToken
      });
      // console.log("student=>", student);
      this.http.post('/'+this.userData.appName+'ApiKR/API/KEEPR/fkr0300', student).subscribe(posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          // console.log("getData=>",productsJson)
          this.posts = productsJson.data;
          if(productsJson.result==1){

            var bar = new Promise((resolve, reject) => {
              productsJson.data.forEach((ele, index, array) => {
                    if(ele.copy_title != null){
                      productsJson.data[index]['copy_title_desc'] = ele.copy_title + ele.copy_no + '/' + ele.copy_yy;
                    }
                    productsJson.data[index]['rcv_fee']= this.curencyFormat(productsJson.data[index]['rcv_fee'],2);
                });
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
    }
  }

  deleteWord(){

    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    confirmBox.setMessage('ต้องการลบไฟล์ Word');
    confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
      // Choose layout color type
    confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
    });
    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      
      // console.log("this.result.seq", this.result.seq);
      if (resp.success==true){
        this.SpinnerService.hide();

        var student = JSON.stringify({
        "file_name" : "cp-"+ this.result.copy_running +".doc",
        "userToken" : this.userData.userToken
        });
        // console.log("delete word student=>", student);  
        this.http.post('/'+this.userData.appName+'ApiKN/API/KEEPN/deleteFile', student).subscribe(
          (response) =>{
            let alertMessage : any = JSON.parse(JSON.stringify(response));
            // console.log("delete word alertMessage=>", alertMessage)
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
                  this.SpinnerService.hide();
                }
                subscription.unsubscribe();
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
                  //$("button[type='reset']")[0].click();
                  this.SpinnerService.hide();
                }
                subscription.unsubscribe();
              });
              this.getData();
            }
          },
          (error) => {this.SpinnerService.hide();}
          )
        }
        subscription.unsubscribe();
      });
  }

  printReport(){
    var rptName = 'rkr0600';

    // For no parameter : paramData ='{}'
    var paramData ='{}';

    // For set parameter to report
    var paramData = JSON.stringify({
      "pcopy_running" : this.result.copy_running,
      "pcopy_no" : this.result.copy_no,
      "pcopy_yy" : this.result.copy_yy
    });
    // console.log("paramData", paramData);
    this.printReportService.printReport(rptName,paramData);
  }

  printWord(formId:any){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!this.result.copy_running){
      confirmBox.setMessage('ไม่พบแบบรายงาน');
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
      this.SpinnerService.show();

      var student = JSON.stringify({
      "run_id" : this.dataHead.run_id,
      "form_type" : 2,
      "form_id" : formId,
      "copy_running" : this.result.copy_running,
      "userToken" : this.userData.userToken
      }); 

      // console.log("print student=>", student);  
      this.http.post('/'+this.userData.appName+'ApiKN/API/KEEPN/openReport', student).subscribe(
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
            // this.getData();
          }
        },
        (error) => {this.SpinnerService.hide();}
      )
    }
  }

  buttonNew(){
    this.ngOnInit();
  }

  runDateNo(objData:any){
    let runTitle:any="";
    if(this.result.date_run_title != undefined){
      runTitle =this.result.date_run_title;
    }
    var student = JSON.stringify({
      "req_date" : this.result.req_date,
      "date_run_title" : runTitle,
      "userToken" : this.userData.userToken
    });
    // console.log("student productsJson=>", student);

    this.http.post('/'+this.userData.appName+'ApiKR/API/KEEPR/fkr0300/runDateNo', student).subscribe(posts => {
      let productsJson : any = JSON.parse(JSON.stringify(posts));
      // console.log("runDateNo productsJson=>", productsJson);
      if(productsJson.result==1){
        this.result.date_run_no = productsJson.date_run_no;
        this.result.copy_title = runTitle;
        this.result.copy_no = productsJson.copy_no;
        this.result.copy_yy = productsJson.copy_yy;

      }
    });
  }

  searchData(){
    // this.posts = [];
    if(typeof this.dataHead.run_id == "undefined"){
      this.dataHead.run_id= null;
    }
     
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!this.result.req_date){
      confirmBox.setMessage('กรุณาป้อนวันที่ขอคัดถ่ายเพื่อค้นหา');
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
    }else if(!this.result.date_run_no){
        confirmBox.setMessage('กรุณาป้อนเลขที่อ้างอิงเพื่อค้นหา');
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
      this.SpinnerService.show();

      var student = JSON.stringify({
        "run_id" : this.dataHead.run_id,
        "copy_running" : this.result.copy_running,
        "req_date" : this.result.req_date,
        "date_run_no" : this.result.date_run_no,
        "date_run_title" : this.result.date_run_title,
        "userToken" : this.userData.userToken
      });
      // console.log("searchData student=>", student);
      this.http.post('/'+this.userData.appName+'ApiKR/API/KEEPR/fkr0300', student).subscribe(
        posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          // console.log("searchData=>",productsJson)
          if(productsJson.result==1){
            var bar = new Promise((resolve, reject) => {
              productsJson.data.forEach((ele, index, array) => {
                    if(ele.copy_title != null){
                      productsJson.data[index]['copy_title_desc'] = ele.copy_title + ele.copy_no + '/' + ele.copy_yy;
                    }
                    productsJson.data[index]['rcv_fee']= this.curencyFormat(productsJson.data[index]['rcv_fee'],2);
                });
            });
            this.postsSearch=[];
            this.postsSearch=productsJson.data;
            this.dataHead.run_id = this.postsSearch[0]['run_id'];
            this.getData();
            this.assignSearchData();
            
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

  assignSearchData(){
    this.setDefPage('');
    this.SpinnerService.show();
    
    this.runId = this.postsSearch[0]['run_id'];
    this.dataHead.run_id = this.postsSearch[0]['run_id'];
    this.result.run_id  = this.postsSearch[0]['run_id'];
    this.result.copy_running  = this.postsSearch[0]['copy_running'];
    this.result.copy_title  = this.postsSearch[0]['copy_title'];
    this.result.copy_yy  = this.postsSearch[0]['copy_yy'];
    this.result.copy_no  = this.postsSearch[0]['copy_no'];
    this.result.copy_yy  = this.postsSearch[0]['copy_yy'];
    this.result.req_date  = this.postsSearch[0]['req_date'];
    this.result.date_run_title  = this.postsSearch[0]['date_run_title'];
    this.result.date_run_no  = this.postsSearch[0]['date_run_no'];
    this.result.lit_type  = this.postsSearch[0]['lit_type'];
    this.result.req_user_id  = this.postsSearch[0]['req_user_id'];
    this.result.req_user_name  = this.postsSearch[0]['req_user_name'];
    this.result.rcv_due_date  = this.postsSearch[0]['rcv_due_date'];
    this.result.rcv_type  = this.postsSearch[0]['rcv_type'];
    this.result.round_flag  = this.postsSearch[0]['round_flag'];
    this.result.rcv_fee  = this.postsSearch[0]['rcv_fee'];
    this.result.rcv_certificate  = this.curencyFormat(this.postsSearch[0]['rcv_certificate'],2);
    this.result.rcv_date  = this.postsSearch[0]['rcv_date'];
    this.result.pr_flag  = this.postsSearch[0]['pr_flag'];
    this.result.pr_amt  = this.curencyFormat(this.postsSearch[0]['pr_amt'],2);
    this.result.cer_flag  = this.postsSearch[0]['cer_flag'];
    this.result.cer_amt  = this.curencyFormat(this.postsSearch[0]['cer_amt'],2);
    this.result.rcv_lit_type  = this.postsSearch[0]['rcv_lit_type'];
    this.result.rcv_user_id  = this.postsSearch[0]['rcv_user_id'];
    this.result.rcv_user_name  = this.postsSearch[0]['rcv_user_name'];
    this.result.page_qty  =  this.curencyFormat(this.postsSearch[0]['page_qty'], 2);
    this.result.finish_flag  = this.postsSearch[0]['finish_flag'];
    this.result.finish_date  = this.postsSearch[0]['finish_date'];
    this.result.cancel_flag  = this.postsSearch[0]['cancel_flag'];
    this.result.cancel_reason  = this.postsSearch[0]['cancel_reason'];
    this.result.receipt_running  = this.postsSearch[0]['receipt_running'];
    this.result.receipt_no  = this.postsSearch[0]['receipt_no'];
    this.result.receipt_item  = this.curencyFormat(this.postsSearch[0]['receipt_item'], 2);
    this.result.remark  = this.postsSearch[0]['remark'];
    this.result.create_dep_code  = this.postsSearch[0]['create_dep_code'];
    
    //list ทุนทรัพย์
    this.getCopyReqDetail( this.result.copy_running);

    setTimeout(() => {
      this.SpinnerService.hide();
    }, 100);

  }

}