import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatalistReturnComponent } from '@app/components/modal/datalist-return/datalist-return.component';

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
  selector: 'app-prju2400,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prju2400.component.html',
  styleUrls: ['./prju2400.component.css']
})


export class Prju2400Component implements AfterViewInit, OnInit, OnDestroy {
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
  selCaseType:any;
  selCaseId:any;

  getCaseType:any;
  getCaseCate:any;
  getTitle:any;
  hid_branch_type:any;
  hid_case_type_stat:any;
  hid_title:any;
  result:any = [];
  modalType:any;

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;
  public loadModalJudgeComponent: boolean = false;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  @ViewChild('prju2400',{static: true}) prju2400 : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  //@ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild('scasetypeid') scasetypeid : NgSelectComponent;
  @ViewChild('sCaseStat') sCaseStat : NgSelectComponent;
  @ViewChild('sTitleGroup') sTitleGroup : NgSelectComponent;
  @ViewChild('sTitle') sTitle : NgSelectComponent;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private printReportService: PrintReportService,
    private ngbModal: NgbModal,
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

        //console.log(this.getCaseType)
        //console.log(this.userData.defaultCaseType)
        //console.log(this.selCaseType)
      },
      (error) => {}
    )
    //----------------------end pcase_type -------------------

this.setDefPage();
  }

setDefPage(){
this.getCaseCate = [];
this.getTitle = [];
}

directiveDate(date:any,obj:any){
this.result[obj] = date;
}

changeCaseType(caseType:any){
this.sCaseStat.clearModel();
this.sTitle.clearModel();
this.fCaseTitle(caseType);
}
  
fCaseTitle(case_type:any){
//========================== ptitle ====================================
var student = JSON.stringify({
"table_name": "ptitle",
"field_id": "title_id",
"field_name": "title",
"field_name2": "title_group",
"condition": "AND title_flag='2' AND case_type='"+case_type+"'",
"order_by": " order_id ASC",
"userToken" : this.userData.userToken
});
let promise = new Promise((resolve, reject) => {
this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
(response) =>{
let getDataOptions : any = JSON.parse(JSON.stringify(response));
console.log(getDataOptions)
this.getTitle = getDataOptions;
this.fCaseStat(case_type,getDataOptions[0].fieldIdValue);
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
},
(error) => {}
)
});
return promise;
}
  
tabChangeInput(name:any,event:any){
if(name=='pjudge_id'){
var student = JSON.stringify({
"table_name" : "pjudge",
"field_id" : "judge_id",
"field_name" : "judge_name",
"field_name2" : "post_id",
"condition" : " AND judge_id='"+event.target.value+"'",
"userToken" : this.userData.userToken
});
console.log(student)
this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
(response) =>{
let productsJson : any = JSON.parse(JSON.stringify(response));
console.log(productsJson)
if(productsJson.length){
this.result.pjudge_name = productsJson[0].fieldNameValue;
}else{
this.result.pjudge_id = '';
this.result.pjudge_name = '';
}
},
(error) => {}
)
}
}

clickOpenMyModalComponent(type:any){
this.modalType = type;
// this.openbutton.nativeElement.click();
this.loadMyModalComponent();
}

closeModal(){
this.loadModalJudgeComponent = false;
}

loadMyModalComponent(){
  $(".modal-backdrop").remove();
  if(this.modalType==1){
    $("#exampleModal").find(".modal-content").css("width","800px");
    var student = JSON.stringify({
    "table_name" : "pjudge",
    "field_id" : "judge_id",
    "field_name" : "judge_name",
    "search_id" : "",
    "search_desc" : "",
    "userToken" : this.userData.userToken});
    this.listTable='pjudge';
    this.listFieldId='pjudge_id';
    this.listFieldName='pjudge_name';
    this.listFieldNull='';
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
      (response) =>{
        console.log(response)
        this.list = response;
        // this.loadModalJudgeComponent = true;
        const modalRef = this.ngbModal.open(DatalistReturnComponent,{ size: 'lg', backdrop: 'static' })
        modalRef.componentInstance.items = this.list
        modalRef.componentInstance.value1 = "pjudge"
        modalRef.componentInstance.value2 = "pjudge_id"
        modalRef.componentInstance.value3 = "pjudge_name"
        modalRef.componentInstance.types = "1"
        modalRef.result.then((item: any) => {
          if(item){
            this.result.pjudge_id=item.fieldIdValue;
            this.result.pjudge_name=item.fieldNameValue;     
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
this.result.pjudge_id=event.fieldIdValue;
this.result.pjudge_name=event.fieldNameValue;
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
      "url_name" : "prju2400"
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

changeTitle(caseType:number,type:any){
  this.title = '';
  var student = JSON.stringify({
    "table_name": "ptitle",
    "field_id": "title_id",
    "field_name": "title",
    "field_name2": "title_group",
    "condition": " AND case_type="+caseType+ " And title_flag=2",
    "order_by":" title_id ASC",
    "userToken" : this.userData.userToken
  });
  console.log("fTitle :"+student)
  let headers = new HttpHeaders();
  headers = headers.set('Content-Type','application/json');
  let promise = new Promise((resolve, reject) => {
  this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
    (response) =>{
      let getDataOptions : any = JSON.parse(JSON.stringify(response));
      this.getTitle = getDataOptions;
      console.log(this.getTitle);
      if(type>0)
        this.title = type;
      //this.fDefCaseStat(caseType,title);
    },
    (error) => {}
  )
  });
  return promise;
}

    printReport(){

      var rptName = 'rju2400';

      // For no parameter : paramData ='{}'
      var paramData ='{}';

      // For set parameter to report
       var paramData = JSON.stringify({
        "pcase_type" : this.result.case_type ? this.result.case_type.toString() : '',
        "pcase_cate_id" : this.result.pcase_cate_id ? this.result.pcase_cate_id.toString() : '',
        "ptitle_group" : this.result.ptitle_group ? this.result.ptitle_group : '',
        "pcon_flag" : this.result.pcon_flag == true ? '1': '0',
        "pjudge_id" : this.result.pjudge_id ? this.result.pjudge_id : '',
        "pjudge_name" : this.result.pjudge_name ? this.result.pjudge_name : '',
        "pdate_start" : this.result.txtStartDate ? myExtObject.conDate(this.result.txtStartDate) : '',
        "pdate_end" : this.result.txtEndDate ? myExtObject.conDate(this.result.txtEndDate) : '',
       });
       console.log(paramData)
      // alert(paramData);return false;
      this.printReportService.printReport(rptName,paramData);
    }

}






