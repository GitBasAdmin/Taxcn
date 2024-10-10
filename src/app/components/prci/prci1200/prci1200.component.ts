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
  selector: 'app-prci1200,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prci1200.component.html',
  styleUrls: ['./prci1200.component.css']
})


export class Prci1200Component implements AfterViewInit, OnInit, OnDestroy {
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
  getCaseCate:any;
  getTitle:any;
  getMonth:any;

  hid_branch_type:any;
  hid_case_type_stat:any;
  hid_title:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  @ViewChild('prci1200',{static: true}) prci1200 : ElementRef;
  //@ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  //@ViewChild('closebutton',{static: true}) closebutton : ElementRef;
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
    this.getMonth = [{id:'0',text:'---เลือก---'},{id:'1',text:'มกราคม'},{id:'2',text:'กุมภาพันธ์'},{id:'3',text:'มีนาคม'},{id:'4',text:'เมษายน'},{id:'5',text:'พฤษภาคม'},{id:'6',text:'มิถุนายน'},{id:'7',text:'กรกฎาคม'},{id:'8',text:'สิงหาคม'},{id:'9',text:'กันยายน'},{id:'10',text:'ตุลาคม'},{id:'11',text:'พฤศจิกายน'},{id:'12',text:'ธันวาคม'}];
    this.setDefPage();
  }

  setDefPage(){
    this.result = [];
    this.getCaseCate = [];
    this.getTitle = [];
    this.result.pmonth = '0';
    this.result.pyear = myExtObject.curYear();
    this.result.pcase_flag = 1;
  }

  
  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "prci1200"
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

changeCaseType(caseType:any){
  this.sCaseStat.clearModel();
  this.sTitle.clearModel();
  this.fCaseStat(caseType);
}

  fCaseStat(caseType:any){
    this.sTitle.clearModel();
    var student = JSON.stringify({
      "table_name": "pcase_cate",
      "field_id": "case_cate_id",
      "field_name": "case_cate_name",
      "condition": " AND case_type='"+caseType+"' AND case_flag = 1",
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

  changeCaseCate(event:any){
    var student = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": " AND case_type='"+this.result.case_type+"' AND title_flag = 2 AND case_cate_id='"+this.result.pcase_cate_id+"'",
      "userToken" : this.userData.userToken
    });
    console.log("fCaseStat :"+student)

      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getTitle = getDataOptions;
        },
        (error) => {}
      )


  }

  
    printReport(){

      var rptName = 'rci1200';

      // For no parameter : paramData ='{}'
      var paramData ='{}';

      // For set parameter to report
       var paramData = JSON.stringify({
        "pmonth" : this.result.pmonth ? this.result.pmonth.toString() : '',
        "pyear" : this.result.pyear ? this.result.pyear.toString() : '',
        "pcase_flag" : this.result.pcase_flag ? this.result.pcase_flag.toString() : '',
        "pcase_type" : this.result.case_type ? this.result.case_type.toString() : '',
        "pcase_cate_id" : this.result.pcase_cate_id ? this.result.pcase_cate_id : '',
        "ptitle" : this.result.ptitle ? this.result.ptitle.toString() : '',
       });
       console.log(paramData);
      // alert(paramData);return false;
      this.printReportService.printReport(rptName,paramData);
    }

    



}






