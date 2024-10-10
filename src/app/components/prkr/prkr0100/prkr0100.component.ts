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
  selector: 'app-prkr0100,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prkr0100.component.html',
  styleUrls: ['./prkr0100.component.css']
})


export class Prkr0100Component implements AfterViewInit, OnInit, OnDestroy {
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

  getTitle:any;
  hid_branch_type:any;
  hid_case_type_stat:any;
  hid_title:any;
  case_type:any;
  case_type_stat:any;
  result:any = [];

  getCaseCate:any;
  getBurn:any;

  pprint_by:any;
  getPprint_by:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  @ViewChild('prkr0100',{static: true}) prkr0100 : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  //@ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild('scasetypeid') scasetypeid : NgSelectComponent;
  @ViewChild('sCaseStat') sCaseStat : NgSelectComponent;
  @ViewChild('sTitle') sTitle : NgSelectComponent;

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
      "case_type" : this.case_type,
      "case_type_stat" : this.case_type_stat,
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
    this.getBurn = [{id:'1',text:'1. ปลดเผา'},{id:'2',text:'2. ไม่ปลดเผา'}];
    this.getPprint_by = [{id:'1',text:'PDF'},{id:'3',text:'Excel'}];
    this.setDefPage();
  }

  setDefPage(){
    this.result = [];
    this.getCaseCate = [];
    this.getTitle = [];
    this.result.pburn = '1';
    this.result.pprint_by = '1';
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "prkr0100"
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

changeCaseType(caseType:any){
this.sCaseStat.clearModel();
this.sTitle.clearModel();
this.fCaseTitle(caseType);
}

fCaseTitle(case_type:any){
//========================== ptitle ====================================
var student = JSON.stringify({
"table_name": "ptitle",
"field_id": "title",
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

      var rptName = 'rkr0100';

      // For no parameter : paramData ='{}'
      var paramData ='{}';

      // For set parameter to report
       var paramData = JSON.stringify({

        "pburn" : this.result.pburn ? this.result.pburn.toString() : '',
        "pburn_year" : this.result.pburn_year ? this.result.pburn_year.toString() : '',
        "ptitle_group" : this.result.ptitle ? this.getTitle.find((x:any) => x.fieldIdValue === this.result.ptitle.toString()).fieldNameValue2.toString() : '',
        "pcase_type" : this.result.case_type ? this.result.case_type.toString() : '',
        "pcase_cate_id" : this.result.pcase_cate_id ? this.result.pcase_cate_id.toString() : '',
        "ptitle" : this.result.ptitle ? this.result.ptitle.toString() : '',
        "pcon_flag" : this.result.pcon_flag == true ? '1': '0',
        "pprint_by" : this.result.pprint_by,

        // "BaseDir" : this.result.BaseDir ? this.result.BaseDir.toString() : '',
        // "BaseQR" : this.result.BaseQR ? this.result.BaseQR.toString() : '',
        // "pcourt_running" : this.result.pcourt_running ? this.result.pcourt_running.toString() : '',
        // "puser_name" : this.result.puser_name ? this.result.puser_name.toString() : '',
        // "puser_post" : this.result.puser_post ? this.result.puser_post.toString() : '',
        // "pcourt_name" : this.result.pcourt_name ? this.result.pcourt_name.toString() : '',
        // "pshort_court_name" : this.result.pshort_court_name ? this.result.pshort_court_name.toString() : '',

       });
       console.log(paramData);
      // alert(paramData);return false;
      this.printReportService.printReport(rptName,paramData);
    }
}






