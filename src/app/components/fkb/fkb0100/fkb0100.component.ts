import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,AfterContentInit,ViewChildren, QueryList,Output,EventEmitter     } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap'; 
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
// import { NgInputFileComponent, GoogleApiConfig, GoogleDriveService } from 'ng-input-file';
import { ActivatedRoute } from '@angular/router';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PopupDittoComponent } from '@app/components/modal/popup-ditto/popup-ditto.component';

// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';

import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
declare var myExtObject: any;


@Component({
  selector: 'app-fkb0100,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fkb0100.component.html',
  styleUrls: ['./fkb0100.component.css']
})


export class Fkb0100Component implements AfterViewInit, OnInit, OnDestroy,AfterContentInit {
  //form: FormGroup;
  title = 'datatables';
  getLitType:any;
  sessData:any;
  userData:any;
  programName:any;
  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  asyncObservable: Observable<string>;

  dataHead:any = [];
  run_id:any;
  runId:any;
  reqRunning:any;
  appealRunning:any;
  result:any = [];
  resultTmp:any = [];
  items:any = [];
  getReq:any;
  req_id:any;
  modalType:any;
  myExtObject: any;
  fileToUpload1: File = null;
  fileToUpload2: File = null;
  dataDelete:any;
  file_running:any;
  file_type:any;
  reqObjTmp:any = [];//
  //searchEvent:any;

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;
 
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  public loadModalComponent: boolean = false;
  public loadModalLitComponent: boolean = false;
  public loadModalJudgeComponent: boolean = false;
  public loadConfirmComponent: boolean = false;
  
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('req_no',{static: true}) req_no : ElementRef;
  @ViewChild('file1',{static: true}) file1: ElementRef;
  @ViewChild('file2',{static: true}) file2: ElementRef;
  @ViewChild('inputFile') myInputVariable: ElementRef;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ; 

  //@Output() runId = new EventEmitter<any>();

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private ngbModal: NgbModal,
  ){ }
   
  ngOnInit(): void {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 30,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      destroy: true
    };

    this.activatedRoute.queryParams.subscribe(params => {
      this.run_id = params['run_id'];
      this.runId = {'run_id' : this.run_id,'counter' : Math.ceil(Math.random()*10000),'sendCase':1}
      this.reqRunning = params['req_running'];
      if(params['appeal_running'])
        this.result.appeal_running = params['appeal_running'];
      if(this.reqRunning)
        this.searchDataRunning(this.reqRunning);
      if(this.run_id){
        this.searchDataRunId(this.run_id);
        this.result.run_id = this.dataHead.run_id = this.run_id;
      }
    });
    
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    //======================== plit_type ======================================
    var student = JSON.stringify({
      "table_name" : "plit_type",
      "field_id" : "lit_type",
      "field_name" : "lit_type_desc",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getLitType = getDataOptions;
        this.getLitType.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
        this.result.req_type = "1";
      },
      (error) => {}
    )
    //======================== prequest_type ======================================
    var student = JSON.stringify({
      "table_name" : "prequest_type",
      "field_id" : "req_type_id",
      "field_name" : "req_type_desc",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getReq = getDataOptions;
        //this.getReq.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
      },
      (error) => {}
    )
    if(!this.reqRunning){
      this.setDefPage();
      this.runningReq();
    }
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
      "url_name" : "fkb0100"
    });
    let promise = new Promise((resolve, reject) => {
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
      myExtObject.callCalendar();
    }

    
  
  tabChangeSelect(objName:any,objData:any,event:any,type:any){
    if(typeof objData!='undefined'){
      if(type==1){
        var val = objData.filter((x:any) => x.fieldIdValue === parseInt(event.target.value)) ;
      }else{
          var val = objData.filter((x:any) => x.fieldIdValue === event);
      }
      console.log(objData)
      //console.log(event.target.value)
      //console.log(val)
      if(val.length!=0){
        this.result[objName] = val[0].fieldIdValue;
        this[objName] = val[0].fieldIdValue;
      }
    }else{
      this.result[objName] = null;
      this[objName] = null;
    }
  }

  clickOpenMyModalComponent(type:any){
    if((type==3 || type==4) && !this.dataHead.run_id){
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
      this.modalType = type;
      this.openbutton.nativeElement.click();
    }
  }

  receiveFuncListData(event:any){
    console.log(event)
    if(this.modalType==1 ){
      this.result.subject_id = event.fieldIdValue;
      this.result.subject_name = event.fieldNameValue;
    }else if(this.modalType==2){
      this.result.req_type = event.fieldIdValue;
    }else if(this.modalType==3 || this.modalType==4){
      if(event.fieldIdValue){
        this.result.sequence = event.fieldIdValue;
        this.result.req_name = event.fieldNameValue;
      }else{
        this.result.sequence = event.seq;
        this.result.req_name = event.lit_name+" "+event.lit_type_desc2;
      }
      if(this.modalType==4)
        this.result.req_type = event.lit_type.toString();
    }else if(this.modalType==5){
      this.result.order_id = event.fieldIdValue;
      this.result.order_name = event.fieldNameValue;
      this.result.req_order = event.fieldNameValue2;
      this.assignOrder();
    }else if(this.modalType==6){
      this.result.judge_id = event.judge_id;
      this.result.judge_name = event.judge_name;
    }else if(this.modalType==7){
      this.result.req_id = event.fieldIdValue;
      this.result.req_desc = event.fieldNameValue;
    }
    
    this.closebutton.nativeElement.click();
  }
  

  loadMyModalComponent(){
    if(this.modalType==1){
      $("#exampleModal").find(".modal-content").css("width","800px");
      var student = JSON.stringify({
        "table_name" : "prequest_subject",
         "field_id" : "subject_id",
         "field_name" : "subject_name",
         "search_id" : "",
         "search_desc" : "",
         "userToken" : this.userData.userToken});
      this.listTable='prequest_subject';
      this.listFieldId='subject_id';
      this.listFieldName='subject_name';
      this.listFieldNull='';
    }else if(this.modalType==2){
      $("#exampleModal").find(".modal-content").css("width","650px");
      var student = JSON.stringify({
        "table_name" : "plit_type",
         "field_id" : "lit_type",
         "field_name" : "lit_type_desc",
         "search_id" : "",
         "search_desc" : "",
         "userToken" : this.userData.userToken});
      this.listTable='plit_type';
      this.listFieldId='lit_type';
      this.listFieldName='lit_type_desc';
      this.listFieldNull='';
    }else if(this.modalType==3 || this.modalType==4){
      
        $("#exampleModal").find(".modal-content").css("width","800px");
        if(this.modalType==3){
          this.listTable='1';
        }else{
          this.listTable='2';
        }
        this.loadModalComponent = false;  
        this.loadComponent = false;
        this.loadModalLitComponent = true;
        this.loadModalJudgeComponent = false;
        this.loadConfirmComponent = false;
      
    }else if(this.modalType==5){
      $("#exampleModal").find(".modal-content").css("width","1000px");
      var student = JSON.stringify({
        "table_name" : "preq_order",
         "field_id" : "req_order_id",
         "field_name" : "req_order_name",
         "field_name2" : "req_order_desc",
         "search_id" : "",
         "search_desc" : "",
         "userToken" : this.userData.userToken});
      this.listTable='preq_order';
      this.listFieldId='req_order_id';
      this.listFieldName='req_order_name';
      this.listFieldName2='req_order_desc';
      this.listFieldNull='';
    }else if(this.modalType==6){
      $("#exampleModal").find(".modal-content").css("width","650px");
      this.loadModalComponent = false;  
        this.loadComponent = false;
        this.loadModalLitComponent = false;
        this.loadModalJudgeComponent = true;
        this.loadConfirmComponent = false;
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
    }else if(this.modalType==7){
      $("#exampleModal").find(".modal-content").css("width","650px");
      var student = JSON.stringify({
        "table_name" : "prequest_type",
         "field_id" : "req_type_id",
         "field_name" : "req_type_desc",
         "search_id" : "",
         "search_desc" : "",
         "userToken" : this.userData.userToken});
      this.listTable='prequest_type';
      this.listFieldId='req_type_id';
      this.listFieldName='req_type_desc';
      this.listFieldNull='';
    }else if(this.modalType==8 || this.modalType==9){
      $("#exampleModal").find(".modal-content").css("width","600px");
      this.loadModalComponent = false;  
      this.loadComponent = false;
      this.loadModalLitComponent = false;
      this.loadModalJudgeComponent = false;
      this.loadConfirmComponent = true;
    }

    if(this.modalType==1 || this.modalType==2 || this.modalType==5 || this.modalType==7){
      console.log(student)
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student , {headers:headers}).subscribe(
        (response) =>{
          console.log(response)
          this.list = response;
          if(this.modalType==1 || this.modalType==5){
            this.loadModalComponent = true; 
            this.loadComponent = false;
            this.loadModalLitComponent = false;
            this.loadModalJudgeComponent = false;
            this.loadConfirmComponent = false;
          }else if(this.modalType==2 || this.modalType==7){
            this.loadModalComponent = false;  
            this.loadComponent = true;
            this.loadModalLitComponent = false;
            this.loadModalJudgeComponent = false;
            this.loadConfirmComponent = false;
          }
        },
        (error) => {}
      )
    }
  
  }

  closeModal(){
    this.loadModalComponent = false;
    this.loadComponent = false;
    this.loadModalLitComponent = false;
    this.loadModalJudgeComponent = false;
    this.loadConfirmComponent = false;
  }

  clickOpenFile(index:any,type:any){
      let winURL = window.location.host;
      winURL = winURL+'/'+this.userData.appName+"ApiKB/API/KEEPB/fkb0100/openAttach";
      console.log("http://"+winURL+'?req_running='+this.items[index].req_running+'&attach_type='+type)
      myExtObject.OpenWindowMax("http://"+winURL+'?req_running='+this.items[index].req_running+'&attach_type='+type);
  }
  clickOpenFileRunning(running:any,type:any){
    let winURL = window.location.host;
    winURL = winURL+'/'+this.userData.appName+"ApiKB/API/KEEPB/fkb0100/openAttach";
    console.log("http://"+winURL+'?req_running='+running+'&attach_type='+type)
    myExtObject.OpenWindowMax("http://"+winURL+'?req_running='+running+'&attach_type='+type);
}

  directiveDate(date:any,obj:any){
    this.result[obj] = date;
  }

  assignOrder(){
    if(this.result.order_id || this.result.req_order){
      this.result.user_type_order_name = this.userData.offName;
      this.result.user_type_order = this.userData.userCode;
      this.result.user_type_dep_name = this.userData.depName;
      this.result.user_type_dep_code = this.userData.depCode;
      this.result.user_type_date = myExtObject.curDate();
      this.result.order_date = myExtObject.curDate();
      this.result.order_time = this.pad(myExtObject.curHour(), 2,'')+":"+this.pad(myExtObject.curMinutes(), 2,'')+":"+this.pad(myExtObject.curSeconds(), 2,'');
    }else{
      this.result.order_name = '';
      this.result.user_type_order_name = '';
      this.result.user_type_order = '';
      this.result.user_type_dep_name = '';
      this.result.user_type_dep_code = '';
      this.result.user_type_date = '';
      this.result.order_date = '';
      this.result.order_time = '';
    }
  }

  submitOrder(event:any){
    if(event.target.checked){
      this.result.submit_date = myExtObject.curDate();
      this.result.submit_time = this.pad(myExtObject.curHour(), 2,'')+":"+this.pad(myExtObject.curMinutes(), 2,'')+":"+this.pad(myExtObject.curSeconds(), 2,'');
      this.result.user_submit_name  = this.userData.offName;
      this.result.user_submit_order = this.userData.userCode;
      this.result.dep_submit_name = this.userData.depName;
      this.result.dep_code_submit = this.userData.depCode;
    }else{
      this.result.submit_date = '';
      this.result.submit_time = '';
      this.result.user_submit_name  = '';
      this.result.user_submit_order = '';
      this.result.dep_submit_name = '';
      this.result.dep_code_submit = '';
    }
  }
  returnOrder(event:any){
    if(event.target.checked){
      this.result.return_date = myExtObject.curDate();
      this.result.return_time = this.pad(myExtObject.curHour(), 2,'')+":"+this.pad(myExtObject.curMinutes(), 2,'')+":"+this.pad(myExtObject.curSeconds(), 2,'');
      this.result.user_return_name  = this.userData.offName;
      this.result.user_return_order = this.userData.userCode;
      this.result.dep_return_name = this.userData.depName;
      this.result.dep_code_return = this.userData.depCode;
    }else{
      this.result.return_date = '';
      this.result.return_time = '';
      this.result.user_return_name  = '';
      this.result.user_return_order = '';
      this.result.dep_return_name = '';
      this.result.dep_code_return = '';
    }
  }

  pad(n:any, width:any, z:any) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  onFileChange(e:any,type:any) {
    /*
    this.labelImport.nativeElement.innerText = Array.from(files)
      .map(f => f.name)
      .join(', ');
    this.fileToUpload = files.item(0);
    */
    if(e.target.files.length){
      if(type==1){
        this.fileToUpload1 = e.target.files[0];
      }else{
        this.fileToUpload2 = e.target.files[0];
      }
      var fileName = e.target.files[0].name;
      $(e.target).parent('div').find('label').html(fileName);
    }else{
      $(e.target).parent('div').find('label').html('');
    }
  }

  tabChangeInput(name:any,event:any){
    let headers = new HttpHeaders();
     headers = headers.set('Content-Type','application/json');
    if(name=='judge_id'){
      var student = JSON.stringify({
        "table_name" : "pjudge",
        "field_id" : "judge_id",
        "field_name" : "judge_name",
        "condition" : " AND judge_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });    
      console.log(student)
     this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
         (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));

          if(productsJson.length){
            this.result.judge_name = productsJson[0].fieldNameValue;
          }else{
            this.result.judge_id = null;
            this.result.judge_name = '';
          }
         },
         (error) => {}
       )
    }else if(name=='order_id'){
      var student = JSON.stringify({
        "table_name" : "preq_order",
         "field_id" : "req_order_id",
         "field_name" : "req_order_name",
         "field_name2" : "req_order_desc",
         "condition" : " AND req_order_id='"+event.target.value+"'",
         "userToken" : this.userData.userToken});
         console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
         (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if(productsJson.length){
            this.result.order_name = productsJson[0].fieldNameValue;
            this.result.req_order = productsJson[0].fieldNameValue2;
            this.assignOrder();
          }else{
            this.result.order_id = '';
            this.assignOrder();
          }
         },
         (error) => {}
       )
    }else if(name=='sequence'){
      if(this.dataHead.run_id){
        var student = JSON.stringify({
          "run_id": this.dataHead.run_id,
          "lit_type": this.result.req_type,
          "seq": parseInt(event.target.value),
          "userToken" : this.userData.userToken
        });
        console.log(student)
      //}
        this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/popupLitName', student , {headers:headers}).subscribe(
          datalist => {
            let getDataOptions : any = JSON.parse(JSON.stringify(datalist));
            console.log(getDataOptions)
            if(getDataOptions.data.length){
              this.result.req_name = getDataOptions.data[0]['lit_name']+" "+getDataOptions.data[0]['lit_type_desc2'];
            }else{
              this.result.sequence= '';
              this.result.req_name = '';
            }
          },
          (error) => {}
        );
      }
    }else if(name=='subject_id'){
      var student = JSON.stringify({
        "table_name" : "prequest_subject",
         "field_id" : "subject_id",
         "field_name" : "subject_name",
         "condition" : " AND subject_id='"+event.target.value+"'",
         "userToken" : this.userData.userToken});
         console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
         (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if(productsJson.length){
            this.result.subject_name = productsJson[0].fieldNameValue;
          }else{
            this.result.subject_id = '';
            this.result.subject_name = '';
          }
         },
         (error) => {}
       )
    }else if(name=='req_id'){
      var student = JSON.stringify({
        "table_name" : "prequest_type",
         "field_id" : "req_type_id",
         "field_name" : "req_type_desc",
         "condition" : " AND req_type_id='"+event.target.value+"'",
         "userToken" : this.userData.userToken});
         console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
         (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if(productsJson.length){
            this.result.req_desc = productsJson[0].fieldNameValue;
          }else{
            this.result.req_id = '';
            this.result.req_desc = '';
          }
         },
         (error) => {}
       )
    }
  }

  runningReq(){
    var student = JSON.stringify({
      "req_yy" : myExtObject.curYear(),
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    let headers = new HttpHeaders();
     headers = headers.set('Content-Type','application/json');
    this.http.post('/'+this.userData.appName+'ApiKB/API/KEEPB/fkb0100/runReqNo ', student , {headers:headers}).subscribe(
      (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        console.log(productsJson)
        if(productsJson.length){
          this.result.req_yy = myExtObject.curYear();
          this.result.req_no = productsJson[0].req_no;
        }
      },
      (error) => {}
    )
  }

  setDefPage(){
    this.result.court_level = 1;
    this.result.date_rcv = myExtObject.curDate();
    this.result.rcv_time = this.pad(myExtObject.curHour(), 2,'')+":"+this.pad(myExtObject.curMinutes(), 2,'')+":"+this.pad(myExtObject.curSeconds(), 2,'');
    this.result.rcv_req = this.userData.userCode;
    this.result.rcv_req_name = this.userData.offName;
    this.result.rcv_dep_name = this.userData.depName;
    this.result.rcv_dep_code = this.userData.depCode;
    this.req_id = null;
    this.result.req_type = "1";
    if(this.dataHead.run_id)
      this.result.run_id = this.dataHead.run_id;
    $('body').find("input.submitOrder").prop("checked",false);
    $('body').find("input.returnOrder").prop("checked",false);
    this.file1.nativeElement.value = '';
    this.file2.nativeElement.value = '';
    this.fileToUpload1 = null;
    this.fileToUpload2 = null;
    $('.custom-file-input').closest("div").find('label').html('');
    //this.result.req_yy = myExtObject.curYear();
  }

  resetPage(){
    this.result = [];
    this.runningReq();
    this.setDefPage();
  }

  saveData(){
    if(!this.run_id && !this.dataHead.run_id){
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
    }else if(!this.result.req_no || !this.result.req_yy){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาระบุเลขที่อ้างอิงให้ครบถ้วน');
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
      //let headers = new HttpHeaders();
     //headers = headers.set('Content-Type','multipart/form-data');
     
     var formData = new FormData();
     this.result['userToken'] = this.userData.userToken;
     formData.append('req_attach', this.fileToUpload1);
     formData.append('order_attach', this.fileToUpload2);
    formData.append('data', JSON.stringify($.extend({}, this.result)));
    //formData.append('data','{"court_running":6,"req_running":23420,"run_id":145031,"appeal_running":null,"req_no":1,"req_yy":2564,"req_id":1,"req_desc":"คำร้อง","subject_id":null,"subject_name":"ขอขยายระยะเวลาอุทธรณ์ ครั้งที่ 3","date_rcv":"06/01/2564","rcv_time":"15:10:43","rcv_req":"00030","rcv_dep_code":2,"req_type":"1  ","sequence":"1","req_name":"ธนาคารออมสิน โจทก์","req_attach":null,"req_attach_date":null,"dep_code_submit":2,"user_submit_order":"00030","submit_date":"06/01/2564","submit_time":"15:10","dep_code_return":2,"user_return_order":"00030","return_date":"07/01/2564","return_time":"08:57","order_id":38,"order_date":"07/01/2564","order_time":"08:58:55","req_order":"ครั้งที่ 3 - อนุญาตขยายระยะเวลายื่นอุทธรณ์ให้แก่โจทก์  จนถึงวันที่ 8 กุมภาพันธ์ 2564","sms_order":null,"sms_flag":null,"order_judge_id":null,"order_judge_name":null,"judge_id":"69","send_date":null,"send_time":null,"send_to":null,"send_for":null,"remark":null,"file_exists":null,"check_flag":null,"check_user_id":null,"check_user_name":null,"check_date":null,"court_level":1,"due_date":null,"order_attach":null,"attach_date":null,"order_flag":null,"print_flag":null,"open_flag":null,"user_type_date":"07/01/2564 08:57:43","user_type_order":"00030","user_type_dep_code":2,"web_running":null,"create_dep_code":2,"create_user_id":"00030","create_user":"นางสาวมะลิ  แสงหล้า","create_date":"07/01/2564 08:59:08","update_dep_code":19,"update_user_id":"99999","update_user":"ADMINISTRATOR","update_date":"16/12/2564 13:42:37","request_no":"1/2564","date_flag":null,"judge_name":"นายคำปุน   ภูธรศรี","dep_code":null,"dep_name":null,"rcv_req_name":"เจ้าหน้าที่-00030","user_type_order_name":"นางสาวมะลิ  แสงหล้า","user_submit_name":"เจ้าหน้าที่-00030","user_return_name":"เจ้าหน้าที่-00030","dep_return_name":"งานรับฟ้อง","dep_submit_name":"งานรับฟ้อง","create_dep_name":"งานรับฟ้อง","update_dep_name":"บริษัทฯ ผู้ดูแลระบบ","rcv_dep_name":"งานรับฟ้อง","user_type_dep_name":"งานรับฟ้อง","order_name":"ขยายยื่นอุทธรณ์"}')
    
    for (var pair of formData.entries()) {
      console.log(pair[0]+ ', ' + pair[1]); 
    }
    
     
      this.http.disableHeader().post('/'+this.userData.appName+'ApiKB/API/KEEPB/fkb0100/saveData ', formData ).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if(productsJson.result==1){
            //this.searchData('');
            //this.searchDataRunId(productsJson.run_id);
            //this.result.req_yy = myExtObject.curYear();
            //this.result.req_no = productsJson[0].req_no;
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage(productsJson.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                this.searchDataRunning(productsJson.req_running);
                this.SpinnerService.hide();}
              subscription.unsubscribe();
            });
            
          }
        },
        (error) => {this.SpinnerService.hide();}
      )
      
    }
    //taxcApiKB/API/KEEPB/fkb0100/saveData

  }

  searchData(index:any){
    if(!this.result.req_no || !this.result.req_yy){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาระบุเลขที่อ้างอิงให้ครบถ้วน');
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
      if(typeof index == 'string'){
        var student = JSON.stringify({
          "req_no" : this.result.req_no,
          "req_yy" : this.result.req_yy,
          "userToken" : this.userData.userToken
        });
        console.log(student)
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
          this.http.post('/'+this.userData.appName+'ApiKB/API/KEEPB/fkb0100/getReqData', student , {headers:headers}).subscribe(
            (response) =>{
              let productsJson : any = JSON.parse(JSON.stringify(response));
              console.log(productsJson)
              if(productsJson.result == 1){
                this.result = productsJson.data[0];
                this.result.req_location_date = this.result.req_location_date+' '+this.result.req_location_time;
                //this.req_id = this.result.req_id;
                //if(this.result.req_id)
                  //this.req_id = this.result.req_id;
                if(this.result.req_type)
                  this.result.req_type = this.result.req_type.toString();
                this.run_id = this.result.run_id;
                //console.log(this.result.run_id)
                if(this.reqObjTmp && this.reqObjTmp!=this.result.run_id)
                  this.runId = this.runId = {'run_id' : this.result.run_id,'counter' : Math.ceil(Math.random()*10000)}
                console.log(this.runId)
                //this.searchEvent = 1;//ถ้าค้นจากตรงนี้ไม่ต้องเคลียร์ data
                this.searchDataRunId(this.result.run_id);
                this.reqObjTmp = this.result.run_id;
                this.resultTmp = JSON.parse(JSON.stringify(this.result));
              }else{
                const confirmBox = new ConfirmBoxInitializer();
                confirmBox.setTitle('ข้อความแจ้งเตือน');
                confirmBox.setMessage(productsJson.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){this.SpinnerService.hide();}
                  subscription.unsubscribe();
                });
              }
            },
            (error) => {this.SpinnerService.hide();}
          )
      }else{
        this.result = [];
        setTimeout(() => {
          this.result = this.items[index];
          console.log(this.result)
          this.req_id = this.result.req_id;
          this.result.req_location_date = this.result.req_location_date+' '+this.result.req_location_time;
          this.result.req_type = this.result.req_type.toString();
          this.req_no.nativeElement.focus();
          this.SpinnerService.hide();
        }, 200);
      }
      
    }
  }

  searchDataRunId(run_id:any){
    //alert(run_id)
    var student = JSON.stringify({
      "run_id" : run_id,
      "userToken" : this.userData.userToken
    });
    console.log(student)
    let headers = new HttpHeaders();
   headers = headers.set('Content-Type','application/json');
    this.http.post('/'+this.userData.appName+'ApiKB/API/KEEPB/fkb0100/getReqData', student , {headers:headers}).subscribe(
      (response) =>{
        //console.log(response)
        let productsJson : any = JSON.parse(JSON.stringify(response));
        console.log(productsJson)
        if(productsJson.result == 1){
          this.items = productsJson.data;
          this.rerender();
          this.SpinnerService.hide();
        }else{
          this.items = [];
          this.rerender();
          this.SpinnerService.hide();
        }
      },
      (error) => {this.SpinnerService.hide();}
    )
  }

  searchDataRunning(running:any){
    //alert(run_id)
    var student = JSON.stringify({
      "req_running" : running,
      "userToken" : this.userData.userToken
    });
    console.log(student)
    let headers = new HttpHeaders();
   headers = headers.set('Content-Type','application/json');
    this.http.post('/'+this.userData.appName+'ApiKB/API/KEEPB/fkb0100/getReqData', student , {headers:headers}).subscribe(
      (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        console.log(productsJson)
        if(productsJson.result == 1){
          this.result = productsJson.data[0];
          this.req_id = this.result.req_id;
          this.file1.nativeElement.value = '';
          this.file2.nativeElement.value = '';
          this.fileToUpload1 = null;
          this.fileToUpload2 = null;
          $('.custom-file-input').closest("div").find('label').html('');
          this.run_id = productsJson.data[0].run_id;
          //this.searchEvent = 1;//ถ้าค้นจากตรงนี้ไม่ต้องเคลียร์ data
          this.searchDataRunId(this.run_id);
        }else{
          const confirmBox = new ConfirmBoxInitializer();
          confirmBox.setTitle('ข้อความแจ้งเตือน');
          confirmBox.setMessage(productsJson.error);
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){this.SpinnerService.hide();}
            subscription.unsubscribe();
          });
        }
      },
      (error) => {this.SpinnerService.hide();}
    )
  }

  fnDataHead(event:any){
    console.log(event)
    this.dataHead = event;
    
    if(this.dataHead.buttonSearch==1){
      this.result = [];
      this.result.run_id = this.dataHead.run_id;
      this.runningReq();
      this.setDefPage();
      this.searchDataRunId(this.dataHead.run_id);
      this.run_id = this.dataHead.run_id;
      this.runId = {'run_id' : event.run_id,'counter' : Math.ceil(Math.random()*10000),'notSearch':1}
      //this.searchEvent = null;
    }

  }

  delData(index:any){
    this.dataDelete = this.items[index];
    this.clickOpenMyModalComponent(8);
  }
  delFile(req_running:any,type:any){
    this.file_running = req_running;
    this.file_type = type;
    this.clickOpenMyModalComponent(9);
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
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
        this.http.post('/'+this.userData.appName+'Api/API/checkPassword', student , {headers:headers}).subscribe(
          posts => {
            let productsJson : any = JSON.parse(JSON.stringify(posts));
            console.log(productsJson)
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
                    
                      this.SpinnerService.show();
                      let headers = new HttpHeaders();
                      headers = headers.set('Content-Type','application/json');
                    if(this.modalType==8){
                      var run_id = this.dataDelete.run_id;
                      var data = this.dataDelete;
                      data["userToken"] = this.userData.userToken;
                      console.log(data)
                      this.http.post('/'+this.userData.appName+'ApiKB/API/KEEPB/fkb0100/deleteData', data , {headers:headers}).subscribe(
                        (response) =>{
                          let alertMessage : any = JSON.parse(JSON.stringify(response));
                          if(alertMessage.result==0){
                            this.SpinnerService.hide();
                          }else{
                            const confirmBox2 = new ConfirmBoxInitializer();
                            confirmBox2.setMessage(alertMessage.error);
                            confirmBox2.setButtonLabels('ตกลง');
                            confirmBox2.setConfig({
                                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                            });
                            const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                              if (resp.success==true){
                                this.closebutton.nativeElement.click();
                                this.searchDataRunId(run_id);
                                this.SpinnerService.hide();
                              }
                              subscription2.unsubscribe();
                            });
                            
                          }
                        },
                        (error) => {this.SpinnerService.hide();}
                      )
                    }else if(this.modalType==9){
                      var student = JSON.stringify({
                        "req_running" : this.file_running,
                        "attach_type" : this.file_type,
                        "log_remark" : chkForm.log_remark,
                        "userToken" : this.userData.userToken
                      });
                      console.log(student)
                      this.http.post('/'+this.userData.appName+'ApiKB/API/KEEPB/fkb0100/deleteFile', student , {headers:headers}).subscribe(
                        (response) =>{
                          let alertMessage : any = JSON.parse(JSON.stringify(response));
                          if(alertMessage.result==0){
                            this.SpinnerService.hide();
                          }else{
                            const confirmBox2 = new ConfirmBoxInitializer();
                            confirmBox2.setMessage(alertMessage.error);
                            confirmBox2.setButtonLabels('ตกลง');
                            confirmBox2.setConfig({
                                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                            });
                            const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                              if (resp.success==true){
                                this.closebutton.nativeElement.click();
                                this.searchDataRunning(this.file_running);
                                this.SpinnerService.hide();
                              }
                              subscription2.unsubscribe();
                            });
                            
                          }
                        },
                        (error) => {this.SpinnerService.hide();}
                      )
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

  gotoLink(){
    let winURL = window.location.href.split("/#/")[0]+"/#/";
    console.log(winURL)
    myExtObject.OpenWindowMaxName(winURL+'fct0208','fct0208');
  }

  closeWin(){
    let winURL = window.location.href.split("/#/")[0]+"/#/";
    if(window.opener.location.hash.indexOf('fud0100') !== -1 ){
      if(this.run_id && this.result.appeal_running){
        var url = 'fud0100?run_id='+this.run_id+'&appeal_running='+this.result.appeal_running;
        window.opener.myExtObject.openerReloadUrl(url);
      }else if(this.run_id && !this.result.appeal_running){
        var url = 'fud0100?run_id='+this.run_id;
        window.opener.myExtObject.openerReloadUrl(url);
      }else
        window.opener.myExtObject.openerReloadUrl('fud0100');
    }else{
      if(this.run_id)
        window.opener.myExtObject.openerReloadRunId(this.run_id);
      else
        window.opener.myExtObject.openerReloadRunId(0);
    }
    window.close();
  }

  onOpenDitto = () => {
    if(this.run_id){
      const modalRef = this.ngbModal.open(PopupDittoComponent)
      modalRef.componentInstance.run_id = this.run_id
      modalRef.componentInstance.doc_type_id = 12
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
              //-----------------------------//
              myExtObject.OpenWindowMax(getDataOptions.file);
              //-----------------------------//
          }else{
            //-----------------------------//
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
            //-----------------------------//
          }
    
        },
        (error) => {}
      )
    }
  }


}







