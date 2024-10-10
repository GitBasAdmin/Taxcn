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
  selector: 'app-prud1100,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prud1100.component.html',
  styleUrls: ['./prud1100.component.css']
})


export class Prud1100Component implements AfterViewInit, OnInit, OnDestroy {
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
  getTitleGroup:any;
  getFlag:any;
  getEventTypeId:any;
  getToCourt:any;

  hid_branch_type:any;
  hid_case_type_stat:any;
  hid_title:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  @ViewChild('prud1100',{static: true}) prud1100 : ElementRef;
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

        //console.log(this.getCaseType)
        //console.log(this.userData.defaultCaseType)
        //console.log(this.selCaseType)
      },
      (error) => {}
    )
    //----------------------end pcase_type -------------------

//======================== getToCourt======================================
var Json = JSON.stringify({
  "table_name" : "pappeal_send_to",
  "field_id" : "send_to_id",
  "field_name" : "send_to_name",
  "order_by" : "order_no ASC",
  "userToken" : this.userData.userToken
});
console.log(Json);
this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', Json , 
{headers:headers}).subscribe(
  (response) =>{console.log('xxxxxxxxxxx'+response);
    let getDataOptions : any = JSON.parse(JSON.stringify(response));
    this.getToCourt=getDataOptions;},
  (error) => {}
)
//========================END getToCourt====================================

    this.getEventTypeId=[{id:'1',text:'รับสำนวน'},{id:'2',text:'ส่งสำนวน'}];
    this.getFlag=[{id:'0',text:'ทั้งหมด'},{id:'1',text:'ส่งเกินกำหนด'},{id:'2',text:'ส่งภายในกำหนด'}];
    //this.getToCourt=[{id:'',text:'ทั้งหมด'},{id:'1',text:'ศาลอุทธรณ์'},{id:'2',text:'ศาลฎีกา'},{id:'6',text:'อุทธรณ์ภาค 1'},{id:'3',text:'ศาลรัฐธรรมนูญ'},{id:'4',text:'ศาลปกครอง'},{id:'5',text:'คณะกรรมการวินิจฉัยอำนาจหน้าที่'},{id:'7',text:'ศาลอุทธรณ์ภาค 5'},];
    this.setDefPage();
  }

  directiveDate(date:any,obj:any){
    this.result[obj] = date;
  }

  setDefPage(){
    this.result = [];
    this.getCaseCate = [];
    this.getTitleGroup = [];
    this.result.pflag = '0';
    this.result.pevent_type = '2';
    this.result.pto_court = '';
  }

  changeCaseType(caseType:any){
    this.selCaseType = caseType;
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
      "condition": " AND (special_case = 0 or special_case is null) AND title_flag='1' AND case_type='"+case_type+"'",
      "order_by": " order_id ASC",
      "userToken" : this.userData.userToken
    });
  
    let promise = new Promise((resolve, reject) => {
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            console.log(getDataOptions)
            this.getTitleGroup = getDataOptions;
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


  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "prud1100"
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

      var rptName = 'rud1100';

      // For no parameter : paramData ='{}'
      var paramData ='{}';

      // For set parameter to report
       var paramData = JSON.stringify({
        "pcase_type" : this.result.case_type ? this.result.case_type.toString() : '',
        "pcase_cate_id" : this.result.pcase_cate_id ? this.result.pcase_cate_id.toString() : '',
        "ptitle_group" : this.result.ptitle_group ? this.result.ptitle_group.toString() : '',
        "pcon_flag" : this.result.pcon_flag==true ? '1': '0',
        // "pappeal_sub_type" : this.result.pevent_type ? this.result.pevent_type.toString() : '',
        "pflag" : this.result.pflag ? this.result.pflag.toString() : '', // ประเภทการส่ง 0 ทั้งหมด 1 ส่งเกินกำหนด 2 ส่งภายในกำหนด(นับจากวันที่ศาลสั่ง ถึงวันที่ส่งจริงต้องไม่เกิน 3 วัน)
        "pdate_start" : this.result.txtStartDate ? myExtObject.conDate(this.result.txtStartDate) : '',
        "pdate_end" : this.result.txtEndDate ? myExtObject.conDate(this.result.txtEndDate) : '',
        "pto_court" : this.result.pto_court ? this.result.pto_court.toString() : '', // 1-อุทธรณ์ 2-ฎีกา
        "pevent_type" : this.result.pevent_type ? this.result.pevent_type.toString() : '', // 1 รับ 2 ส่ง
       });
       console.log(paramData)
      // alert(paramData);return false;
      this.printReportService.printReport(rptName,paramData);
    }



}






