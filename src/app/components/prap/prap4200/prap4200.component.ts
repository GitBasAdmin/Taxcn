import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';

// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';
import { NgSelectComponent } from '@ng-select/ng-select';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
import { PrintReportService } from 'src/app/services/print-report.service';

//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
declare var myExtObject: any;

@Component({
  selector: 'app-prap4200,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prap4200.component.html',
  styleUrls: ['./prap4200.component.css']
})


export class Prap4200Component implements AfterViewInit, OnInit, OnDestroy {
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
  asyncObservable: Observable<string>;
  selectedCasetype:any='แพ่ง';
  getCaseType:any;
  selCaseType:any;
  selCaseId:any;

  result:any = [];
  modalType:any;
  getSize:any;

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
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  @ViewChild('prap4200',{static: true}) prap4200 : ElementRef;
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
    private authService: AuthService
  ){  }

  ngOnInit(): void {


    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

      //this.asyncObservable = this.makeObservable('Async Observable');
      this.successHttp();

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

    this.getSize=[{id:'1',text:'พิมพ์แนวนอน'},{id:'2',text:'พิมพ์แนวตั้ง'},];
    this.setDefPage();
  }

  setDefPage(){
    this.result = [];
    this.result.psize = '1';
  }

  directiveDate(date:any,obj:any){
    this.result[obj] = date;
  }

  tabChangeInput(name:any,event:any){
  if(name=='ptable_id'){
  var student = JSON.stringify({
  "table_name" : "pappoint_table",
  "field_id" : "table_id",
  "field_name" : "table_name",
  "condition" : " AND table_id='"+event.target.value+"'",
  "userToken" : this.userData.userToken
  });
  console.log(student)
  this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
  (response) =>{
  let productsJson : any = JSON.parse(JSON.stringify(response));
  console.log(productsJson)
  if(productsJson.length){
  this.result.ptable_name = productsJson[0].fieldNameValue;
  }else{
  this.result.ptable_id = '';
  this.result.ptable_name = '';
  }
  },
  (error) => {}
  )
  }
  }
    
  clickOpenMyModalComponent(type:any){
  this.modalType = type;
  this.openbutton.nativeElement.click();
  }
    
  closeModal(){
  this.loadModalListComponent = false;
  }
    
  loadMyModalComponent(){
  $(".modal-backdrop").remove();
  if(this.modalType==1){
  $("#exampleModal").find(".modal-content").css("width","800px");
  var student = JSON.stringify({
  "table_name" : "pappoint_table",
  "field_id" : "table_id",
  "field_name" : "table_name",
  "search_id" : "",
  "search_desc" : "",
  "userToken" : this.userData.userToken});
  this.listTable='pappoint_table';
  this.listFieldId='table_id';
  this.listFieldName='table_name';
  this.listFieldNull='';
  this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
  (response) =>{
  console.log(response)
  this.list = response;
  this.loadModalListComponent = true;
  },
  (error) => {}
  )
  }
  }

  receiveFuncListData(event:any){
  console.log(event)
  if(this.modalType==1){
  this.result.ptable_id=event.fieldIdValue;
  this.result.ptable_name=event.fieldNameValue;
  }
  this.closebutton.nativeElement.click();
  }

  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "prap4200"
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

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    // Destroy the table first
    dtInstance.destroy();
    // Call the dtTrigger to rerender again
    this.dtTrigger.next(null);
      });}

 ngAfterViewInit(): void {
    myExtObject.callCalendar();
    this.dtTrigger.next(null);
     }

  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }

    ClearAll(){
      window.location.reload();
    }


    printReport(){

      var rptName = 'rap4200';

      // For no parameter : paramData ='{}'
      var paramData ='{}';

      // For set parameter to report
       var paramData = JSON.stringify({
        "pcase_type" : this.result.pcase_type ? this.result.pcase_type.toString() : '',
        "pdate_start" : this.result.txtStartDate ? myExtObject.conDate(this.result.txtStartDate) : '',
        "pdate_end" : this.result.txtEndDate ? myExtObject.conDate(this.result.txtEndDate) : '',
        "ptable_id" : this.result.ptable_id ? this.result.ptable_id.toString() : '0',
        "psize" : this.result.psize ? this.result.psize.toString() : '',
       });
       console.log(paramData);
      // alert(paramData);return false;
      this.printReportService.printReport(rptName,paramData);
    }

    changeCaseType(caseType:any){
      this.selCaseType = caseType;
    }



}






