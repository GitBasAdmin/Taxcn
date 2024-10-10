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
  selector: 'app-prdo2600,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prdo2600.component.html',
  styleUrls: ['./prdo2600.component.css']
})


export class Prdo2600Component implements AfterViewInit, OnInit, OnDestroy {
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

  result:any = [];
  getCaseType:any;
  getCaseCate:any;
  getTitle:any;
  getToCourt:any;
  getHold:any;

  hid_branch_type:any;
  hid_case_type_stat:any;
  hid_title:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  @ViewChild('prdo2600',{static: true}) prdo2600 : ElementRef;
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
    // this.getToCourt=[{id:'0',text:'ทั้งหมด'},{id:'1',text:'ศาลอุทธรณ์'},{id:'2',text:'ศาลฎีกา'},{id:'6',text:'อุทธรณ์ภาค 1'},{id:'3',text:'ศาลรัฐธรรมนูญ'},{id:'4',text:'ศาลปกครอง'},{id:'5',text:'คณะกรรมการวินิจฉัยอำนาจหน้าที่'},{id:'7',text:'ศาลอุทธรณ์ภาค 5'},];
    // this.getHold=[{id:'1',text:'ค้างส่ง'},{id:'2',text:'ค้างพิจารณา(ค้างรับ)'}];
    this.setDefPage();
    this.fCaseTitle();
  }

  directiveDate(date:any,obj:any){
    this.result[obj] = date;
  }

  setDefPage(){
    this.result = [];
    // this.getCaseCate = [];
    this.getTitle = [];
    this.result.pflag = 1;
    // result.pto_court = '0';
    // this.result.phold = '1';
  }

  changeCaseType(caseType:any){
    this.selCaseType = caseType;
    //this.sCaseStat.clearModel();
    this.sTitle.clearModel();

    // this.fCaseTitle(caseType);
  }

  fCaseTitle(){
    //========================== pmaterialtitle ====================================
    var student = JSON.stringify({
      "table_name": "pmaterial_title",
      "field_id": "case_title_id",
      "field_name": "case_title",
      "order_by": "case_title_id ASC",
      "userToken" : this.userData.userToken
    });
    console.log(student);
    let promise = new Promise((resolve, reject) => {
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            console.log(getDataOptions)
            this.getTitle = getDataOptions;
            // this.fCaseStat(case_type,getDataOptions[0].fieldIdValue);
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


  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "prdo2600"
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

    clearFlag(val:any){
      if(val==1){
        this.result.pcase_title = null;
        this.result.pcase_id = '';
        this.result.pcase_yy = '';
      }else{
        this.result.txtStartDate = '';
        this.result.txtEndDate = '';
      }
    }

    printReport(){

      var rptName = 'rdo2600';

      // For no parameter : paramData ='{}'
      var paramData ='{}';

      // For set parameter to report
       var paramData = JSON.stringify({
        "pcase_type" : this.result.case_type ? this.result.case_type.toString() : '',
        "pflag" : this.result.pflag ? this.result.pflag.toString() : '',
        "pdate_start" : this.result.txtStartDate ? myExtObject.conDate(this.result.txtStartDate) : '',
        "pdate_end" : this.result.txtEndDate ? myExtObject.conDate(this.result.txtEndDate) : '',
        "pcase_title" : this.result.pcase_title ? this.result.pcase_title : '',
        "pcase_id" : this.result.pcase_id ? this.result.pcase_id.toString() : '',
        "pcase_yy" : this.result.pcase_yy ? this.result.pcase_yy.toString() : '',
       });
       console.log(paramData)
      // alert(paramData);return false;
      this.printReportService.printReport(rptName,paramData);
    }



}






