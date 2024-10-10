import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';

// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
import { NgSelectComponent } from '@ng-select/ng-select';
import { PrintReportService } from 'src/app/services/print-report.service';

//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
declare var myExtObject: any;

@Component({
  selector: 'app-prkr0900,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prkr0900.component.html',
  styleUrls: ['./prkr0900.component.css']
})


export class Prkr0900Component implements AfterViewInit, OnInit, OnDestroy {
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
  getCaseType:any;
  getCaseCate:any;
  getTitle:any;
  case_type:any;
  case_type_stat:any;
  selCaseType:any;
  selCaseId:any;

  result:any = [];

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  @ViewChild('prkr0900',{static: true}) prkr0900 : ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
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

    this.successHttp();
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
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getCaseType = getDataOptions;
          this.selCaseType = this.userData.defaultCaseType;
        },
        (error) => {}
      )
  }



  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  async successHttp() {
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "prkr0900"
    });
    console.log(authen)
    let promise = new Promise((resolve, reject) => {
      //let apiURL = `${this.apiRoot}?term=${term}&media=music&limit=20`;
      //this.http.get(apiURL)
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen)
        .toPromise()
        .then(
          res => { // Success
          //this.results = res.json().results;
          let getDataAuthen : any = JSON.parse(JSON.stringify(res));
          console.log(getDataAuthen)
          this.programName = getDataAuthen.programName;
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


    printReport(){

      var rptName = 'rkr0900';

      // For no parameter : paramData ='{}'
      var paramData ='{}';

      // For set parameter to report
       var paramData = JSON.stringify({
        "pno_year" : this.result.pno_year ? this.result.pno_year.toString() : '',
        "phold" : this.result.p_hold == true ? '1': '0',
        "ptitle_group" : this.result.ptitle ? this.getTitle.find((x:any) => x.fieldIdValue === this.result.ptitle.toString()).fieldNameValue2.toString() : '',
        "pcase_type" : this.result.case_type ? this.result.case_type.toString() : '',
        "pcase_cate_id" : this.result.pcase_cate_id ? this.result.pcase_cate_id.toString() : '',
        "ptitle" : this.result.ptitle ? this.result.ptitle.toString() : '',
        "pcon_flag" : this.result.pcon_flag == true ? '1': '0',
        "ptoday" : this.result.ptoday ? myExtObject.conDate(this.result.ptoday) : '',
       });
       console.log(paramData)
       console.log(this.result.ptoday)
      // alert(paramData);return false;
      this.printReportService.printReport(rptName,paramData);
    }



}






