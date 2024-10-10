import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,ViewEncapsulation   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';

// import ในส่วนที่จะใช้งานกับ Observable
// import {Observable,of, Subject  } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';
import { NgSelectComponent } from '@ng-select/ng-select';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
import { PrintReportService } from 'src/app/services/print-report.service';
import { DatalistReturnComponent } from '../../modal/datalist-return/datalist-return.component';
declare var myExtObject: any;

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-prco0200,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prco0200.component.html',
  styleUrls: ['./prco0200.component.css']
})


export class Prco0200Component implements AfterViewInit, OnInit, OnDestroy {
  myExtObject :any;
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
  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  // asyncObservable: Observable<string>;
  selectedCasetype:any='แพ่ง';
  getCaseType:any;
  selCaseType:any;
  selCaseId:any;

  result:any = [];
  getInOut:any;
  getRunDocTitle:any;
  getPosition:any;
  modalType:any;
  getType:any;

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;
  public loadModalListComponent: boolean = false;

  dtOptions: DataTables.Settings = {};
  // dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  @ViewChild('prco0200',{static: true}) prco0200 : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  //@ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild('scasetypeid') scasetypeid : NgSelectComponent;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private printReportService: PrintReportService,
    private authService: AuthService,
    private ngbModal: NgbModal,
  ){  }

  ngOnInit(): void {


    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    console.log(this.userData);

      //this.asyncObservable = this.makeObservable('Async Observable');
      //this.successHttp();

      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
       //======================== pcase_type ======================================
     var student = JSON.stringify({
      "table_name" : "pcase_type",
      "field_id" : "case_type",
      "field_name" : "case_type_desc",
      "order_by" : "case_type ASC",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseType = getDataOptions;
        this.selCaseType = this.userData.defaultCaseType;
      },
      (error) => {}
    )
    //----------------------end pcase_type -------------------

    this.getInOut = [{id:'1',text:'1  รับหนังสือ'},{id:'2',text:'2  ส่งหนังสือ'}];
    this.getPosition = [{id:'1',text:'ระดับที่ 1'},{id:'2',text:'ระดับที่ 2'},{id:'3',text:'ระดับที่ 3'},{id:'4',text:'ระดับที่ 4'}];
    this.getType = [{id:'3',text:'ทั้งหมด'},{id:'1',text:'สำนวน'},{id:'2',text:'ทั่วไป'}];

    //======================== getRunDocTitle ======================================
    if(this.userData.userLevel=='A'){//admin
      var Json = JSON.stringify({
        "table_name" : "pdoc_title",
        "field_id" : "doc_title",
        "field_name" : "doc_title",
        "field_name2" : "in_out",
        "condition" : " GROUP BY doc_title",
        "userToken" : this.userData.userToken
      });
    }else{//user
      var Json = JSON.stringify({
        "table_name" : "pdoc_title",
        "field_id" : "doc_title",
        "field_name" : "doc_title",
        "field_name2" : "in_out",
        "condition" : " AND dep_use= '"+this.userData.depCode+"'  GROUP BY doc_title",
        "userToken" : this.userData.userToken
      });
    }
      console.log(Json);
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', Json , {headers:headers}).subscribe(
      (response) =>{
        console.log(response);
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        getDataOptions.unshift({fieldIdValue:0,fieldNameValue: 'ทั้งหมด'});
        this.getRunDocTitle = getDataOptions;
        this.setDefPage();
      },
      (error) => {}
    )

    this.setDefPage();


  }

  setDefPage(){
    this.result = [];
    this.result.ptype = '3';
    this.result.txtStartDate = this.result.txtStartDate = myExtObject.curDate();
    this.result.txtEndDate = this.result.txtEndDate = myExtObject.curDate();
    this.result.pin_out = '1';
    this.inOut();
    this.result.pposition = '1';
    this.result.pprint_type = '1';
    this.result.prun_doc_yy = myExtObject.curYear();
  }

  inOut(){
    //var inOut = this.getRunDocTitle.filter((x:any) => x.fieldNameValue2 === parseInt(this.result.pin_out);
    //======================== getRunDocTitle ======================================
    if(this.userData.userLevel=='A'){//admin
      var Json = JSON.stringify({
        "table_name" : "pdoc_title",
        "field_id" : "doc_title",
        "field_name" : "doc_title",
        "condition" : " AND in_out ='"+this.result.pin_out+"' GROUP BY doc_title",
        "userToken" : this.userData.userToken
      });
    }else{//user
      var Json = JSON.stringify({
        "table_name" : "pdoc_title",
        "field_id" : "doc_title",
        "field_name" : "doc_title",
        "condition" : " AND dep_use= '"+this.userData.depCode+"'  AND in_out ='"+this.result.pin_out+"' GROUP BY doc_title",
        "userToken" : this.userData.userToken
      });
    }
      console.log(Json);
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', Json ).subscribe(
      (response) =>{
        console.log(response);
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        getDataOptions.unshift({fieldIdValue:0,fieldNameValue: 'ทั้งหมด'});
        this.getRunDocTitle = getDataOptions;
      },
      (error) => {}
    )
  }
  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  directiveDate(date:any,obj:any){
    this.result[obj] = date;
  }

  tabChangeInput(name:any,event:any){
    if(name=='pdep_code2'){
      var student = JSON.stringify({
        "table_name" : "pdepartment",
        "field_id" : "dep_code",
        "field_name" : "dep_name",
        "condition" : " AND dep_code='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
          (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if(productsJson.length){
            this.result.dep_name = productsJson[0].fieldNameValue;
          }else{
            this.result.pdep_code2 = '';
            this.result.dep_name = '';
          }
          },
          (error) => {}
        )
    }else if(name=='user_id'){
      var student = JSON.stringify({
        "table_name" : "pofficer",
        "field_id" : "off_id",
        "field_name" : "off_name",
        "field_name2" : "post_id",
        "condition" : " AND off_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
          (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.result.user_name = productsJson[0].fieldNameValue;
          }else{
            this.result.user_id = '';
            this.result.user_name = '';
          }
          },
          (error) => {}
        )
    }else if(name=='book_id'){
      var student = JSON.stringify({
        "table_name" : "pdoc_list_rcv",
        "field_id" : "book_id",
        "field_name" : "book_title",
        "condition" : " AND book_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
          (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.result.book_title = productsJson[0].fieldNameValue;
          }else{
            this.result.book_id = '';
            this.result.book_title = '';
          }
          },
          (error) => {}
        )
    }else if(name=='to_id'){
      var student = JSON.stringify({
        "table_name" : "pbook_to_rcv",
        "field_id" : "to_id",
        "field_name" : "to_name",
        "condition" : " AND to_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
          (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.result.to_name = productsJson[0].fieldNameValue;
          }else{
            this.result.to_id = '';
            this.result.to_name = '';
          }
          },
          (error) => {}
        )
    }
  }

  clickOpenMyModalComponent(type:any){
    this.modalType = type;
    //this.openbutton.nativeElement.click();
    this.loadMyModalComponent();
  }

  closeModal(){
    this.loadModalListComponent = false;
  }

  loadMyModalComponent(){
    $(".modal-backdrop").remove();
    if(this.modalType==1){
      $("#exampleModal").find(".modal-content").css("width","800px");
      var student = JSON.stringify({
        "table_name" : "pdepartment",
        "field_id" : "dep_code",
        "field_name" : "dep_name",
        "search_id" : "",
        "search_desc" : "",
        "userToken" : this.userData.userToken});
      this.listTable='pdepartment';
      this.listFieldId='dep_code';
      this.listFieldName='dep_name';
      this.listFieldNull='';

      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
        (response) =>{
          console.log(response)
          this.list = response;
          //this.loadModalListComponent = true;
          const modalRef = this.ngbModal.open(DatalistReturnComponent)
          modalRef.componentInstance.items = this.list
          modalRef.componentInstance.value1 = "pdepartment"
          modalRef.componentInstance.value2 = "dep_code"
          modalRef.componentInstance.value3 = "dep_name"
          modalRef.componentInstance.types = "1"

          modalRef.result.then((item: any) => {
            if(item){
              this.result.pdep_code2=item.fieldIdValue;
              this.result.dep_name=item.fieldNameValue;
            }
          })
        },
        (error) => {}
      )

    }if(this.modalType==2){
      $("#exampleModal").find(".modal-content").css("width","800px");
      var student = JSON.stringify({
        "table_name" : "pofficer",
        "field_id" : "off_id",
        "field_name" : "off_name",
        "field_name2" : "post_id",
        "search_id" : "",
        "search_desc" : "",
        "userToken" : this.userData.userToken});
      this.listTable='pofficer';
      this.listFieldId='off_id';
      this.listFieldName='off_name';
      this.listFieldName2='post_id';
      this.listFieldNull='';

      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
        (response) =>{
          console.log(response)
          this.list = response;
            //this.loadModalListComponent = true;
            const modalRef = this.ngbModal.open(DatalistReturnComponent)
            modalRef.componentInstance.items = this.list
            modalRef.componentInstance.value1 = "pofficer"
            modalRef.componentInstance.value2 = "off_id"
            modalRef.componentInstance.value3 = "post_id"
            modalRef.componentInstance.types = "1"
  
            modalRef.result.then((item: any) => {
              if(item){
                this.result.user_id=item.fieldIdValue;
                this.result.user_name=item.fieldNameValue;
              }
            })
        },
        (error) => {}
      )

    }if(this.modalType==3){
      $("#exampleModal").find(".modal-content").css("width","800px");
      var student = JSON.stringify({
        "table_name" : "pdoc_list_rcv",
        "field_id" : "book_id",
        "field_name" : "book_title",
        "search_id" : "",
        "search_desc" : "",
        "userToken" : this.userData.userToken});
      this.listTable='pdoc_list_rcv';
      this.listFieldId='book_id';
      this.listFieldName='book_title';
      this.listFieldNull='';

      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
        (response) =>{
          console.log(response)
          this.list = response;
          //this.loadModalListComponent = true;
          const modalRef = this.ngbModal.open(DatalistReturnComponent)
            modalRef.componentInstance.items = this.list
            modalRef.componentInstance.value1 = "pdoc_list_rcv"
            modalRef.componentInstance.value2 = "book_id"
            modalRef.componentInstance.value3 = "book_title"
            modalRef.componentInstance.types = "1"
  
            modalRef.result.then((item: any) => {
              if(item){
                this.result.book_id=item.fieldIdValue;
                this.result.book_title=item.fieldNameValue;
              }
            })
        },
        (error) => {}
      )

    }if(this.modalType==4){
      $("#exampleModal").find(".modal-content").css("width","800px");
      var student = JSON.stringify({
        "table_name" : "pbook_to_rcv",
        "field_id" : "to_id",
        "field_name" : "to_name",
        "search_id" : "",
        "search_desc" : "",
        "userToken" : this.userData.userToken});
      this.listTable='pbook_to_rcv';
      this.listFieldId='to_id';
      this.listFieldName='to_name';
      this.listFieldNull='';

      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
        (response) =>{
          console.log(response)
          this.list = response;
          //this.loadModalListComponent = true;
          const modalRef = this.ngbModal.open(DatalistReturnComponent)
            modalRef.componentInstance.items = this.list
            modalRef.componentInstance.value1 = "pbook_to_rcv"
            modalRef.componentInstance.value2 = "to_id"
            modalRef.componentInstance.value3 = "to_name"
            modalRef.componentInstance.types = "1"
  
            modalRef.result.then((item: any) => {
              if(item){
                this.result.to_id=item.fieldIdValue;
                this.result.to_name=item.fieldNameValue;
              }
            })
        },
        (error) => {}
      )

    }if(this.modalType==5){
      $("#exampleModal").find(".modal-content").css("width","800px");
      var student = JSON.stringify({
        "table_name" : "pcontent_form",
        "field_id" : "form_running",
        "field_name" : "form_name",
        "search_id" : "",
        "search_desc" : "",
        "userToken" : this.userData.userToken});
      this.listTable='pcontent_form';
      this.listFieldId='form_running';
      this.listFieldName='form_name';
      this.listFieldNull='';

      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
        (response) =>{
          console.log(response)
          this.list = response;
          //this.loadModalListComponent = true;
          const modalRef = this.ngbModal.open(DatalistReturnComponent)
            modalRef.componentInstance.items = this.list
            modalRef.componentInstance.value1 = "pcontent_form"
            modalRef.componentInstance.value2 = "form_running"
            modalRef.componentInstance.value3 = "form_name"
            modalRef.componentInstance.types = "1"
  
            modalRef.result.then((item: any) => {
              if(item){
                this.result.subject_id=item.fieldIdValue;
                this.result.subject_name=item.fieldNameValue;
              }
            })
        },
        (error) => {}
      )

    }if(this.modalType==6){
      $("#exampleModal").find(".modal-content").css("width","800px");
      var student = JSON.stringify({
        "table_name" : "pdoc_to",
        "field_id" : "docto_id",
        "field_name" : "docto_desc",
        "search_id" : "",
        "search_desc" : "",
        "userToken" : this.userData.userToken});
      this.listTable='pdoc_to';
      this.listFieldId='docto_id';
      this.listFieldName='docto_desc';
      this.listFieldNull='';

      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
        (response) =>{
          console.log(response)
          this.list = response;
          //this.loadModalListComponent = true;
          const modalRef = this.ngbModal.open(DatalistReturnComponent)
            modalRef.componentInstance.items = this.list
            modalRef.componentInstance.value1 = "pdoc_to"
            modalRef.componentInstance.value2 = "docto_id"
            modalRef.componentInstance.value3 = "docto_desc"
            modalRef.componentInstance.types = "1"
  
            modalRef.result.then((item: any) => {
              if(item){
                this.result.docto_id=item.fieldIdValue;
                this.result.docto_desc=item.fieldNameValue;
              }
            })
        },
        (error) => {}
      )
    }if(this.modalType==7){
      $("#exampleModal").find(".modal-content").css("width","800px");
      var student = JSON.stringify({
        "table_name" : "pcourt",
        "field_id" : "court_running",
        "field_name" : "court_name",
        "search_id" : "",
        "search_desc" : "",
        "userToken" : this.userData.userToken});
      this.listTable='pcourt';
      this.listFieldId='court_running';
      this.listFieldName='court_name';
      this.listFieldNull='';

      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
        (response) =>{
          console.log(response)
          this.list = response;
          //this.loadModalListComponent = true;
          const modalRef = this.ngbModal.open(DatalistReturnComponent)
            modalRef.componentInstance.items = this.list
            modalRef.componentInstance.value1 = "pcourt"
            modalRef.componentInstance.value2 = "court_running"
            modalRef.componentInstance.value3 = "court_name"
            modalRef.componentInstance.types = "1"
  
            modalRef.result.then((item: any) => {
              if(item){
                this.result.scourt_running=item.fieldIdValue;
                this.result.scourt_name=item.fieldNameValue;
              }
            })
        },
        (error) => {}
      )
    }
  }

  receiveFuncListData(event:any){
    console.log(event)
    if(this.modalType==1){
      this.result.pdep_code2=event.fieldIdValue;
      this.result.dep_name=event.fieldNameValue;
    }else if(this.modalType==2){
      this.result.user_id=event.fieldIdValue;
      this.result.user_name=event.fieldNameValue;
    }else if(this.modalType==3){
      this.result.book_id=event.fieldIdValue;
      this.result.book_title=event.fieldNameValue;
    }else if(this.modalType==4){
      this.result.to_id=event.fieldIdValue;
      this.result.to_name=event.fieldNameValue;
    }else if(this.modalType==5){
      this.result.subject_id=event.fieldIdValue;
      this.result.subject_name=event.fieldNameValue;
    }else if(this.modalType==6){
      this.result.docto_id=event.fieldIdValue;
      this.result.docto_desc=event.fieldNameValue;
    }else if(this.modalType==7){
      this.result.scourt_running=event.fieldIdValue;
      this.result.scourt_name=event.fieldNameValue;
    }

    this.closebutton.nativeElement.click();
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "prco0200"
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

  // rerender(): void {
  //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //   // Destroy the table first
  //   dtInstance.destroy();
  //   // Call the dtTrigger to rerender again
  //   this.dtTrigger.next(null);
  //     });}

 ngAfterViewInit(): void {
    myExtObject.callCalendar();
    // this.dtTrigger.next(null);
     }

  ngOnDestroy(): void {
      // this.dtTrigger.unsubscribe();
    }

    ClearAll(){
      window.location.reload();
    }


    printReport(){

      var rptName = 'rco0200';

      // For no parameter : paramData ='{}'
      var paramData ='{}';

      // For set parameter to report
       var paramData = JSON.stringify({

        "pdate_start" : this.result.txtStartDate ? myExtObject.conDate(this.result.txtStartDate) : '',
        "pdate_end" : this.result.txtEndDate ? myExtObject.conDate(this.result.txtEndDate) : '',
        "pin_out" : this.result.pin_out ? this.result.pin_out.toString() : '',
        "pposition" : this.result.pposition ? this.result.pposition.toString() : '',

        "pstart_run_id" : this.result.pstart_run_id ? this.result.pstart_run_id.toString() : '',
        "pend_run_id" : this.result.pend_run_id ? this.result.pend_run_id.toString() : '',
        "prun_yy" : this.result.prun_yy ? this.result.prun_yy.toString() : '',
        "prun_title" : this.result.prun_title ? this.result.prun_title.toString() : '',
        "pdep_code" : this.userData.depCode ? this.userData.depCode.toString() : '',
        "ptype" : this.result.ptype,

        "psubject1" : this.result.book_title ? this.result.book_title.toString() : '',
        "pdoc_dest" : this.result.to_name ? this.result.to_name.toString() : '',

        "psubject2" : this.result.subject_name ? this.result.subject_name.toString() : '',
        "pdocto_desc" : this.result.docto_desc ? this.result.docto_desc.toString() : '',
        "pscourt_running" : this.result.scourt_running ? this.result.scourt_running.toString() : '',
        "pscourt_name" : this.result.scourt_name,
        "puser_id" : this.result.user_id ? this.result.user_id.toString() : '',
        "pdep_code2" : this.result.pdep_code2 ? this.result.pdep_code2.toString() : '',
        // "puser_id" : this.userData.userCode ,

       });
       console.log(paramData);
      // alert(paramData);return false;
      this.printReportService.printReport(rptName,paramData);
    }

    changeCaseType(caseType:any){
      this.selCaseType = caseType;
    }



}






