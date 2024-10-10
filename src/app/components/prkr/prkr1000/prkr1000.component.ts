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
  selector: 'app-prkr1000,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prkr1000.component.html',
  styleUrls: ['./prkr1000.component.css']
})


export class Prkr1000Component implements AfterViewInit, OnInit, OnDestroy {
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

  pprint_by:any;
  getPprint_by:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  @ViewChild('prkr1000',{static: true}) prkr1000 : ElementRef;
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
    
    this.getPprint_by = [{id:'1',text:'PDF'},{id:'3',text:'Excel'}];
    this.setDefPage();
  }

  setDefPage(){
    this.result = [];
    this.getCaseCate = [];
    this.getTitle = [];
    this.pprint_by = '1';
    this.result.pprint_by = '1';
    this.result.pcon_flag = '1';
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "prkr1000"
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

    directiveDate(date:any,obj:any){
      this.result[obj] = date;
    }    

    getMessageday(){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาระบุข้อมูล บันทึกปลดเผาวันที่');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }
    getMessageyear(){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาระบุข้อมูล คดีที่ยังไม่ปลดเผาระหว่างปี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }

    printReport(){
      if(!this.result.txtStartDate && !this.result.txtEndDate){
        this.getMessageday();
      }
      if( !this.result.pyear_start && !this.result.pyear_end){
  this.getMessageyear();
      }
   if( this.result.txtStartDate && this.result.txtEndDate && this.result.pyear_start && this.result.pyear_end) {
     var rptName = 'rkr1000';

      // For no parameter : paramData ='{}'
      var paramData ='{}';

      // For set parameter to report
       var paramData = JSON.stringify({

        "ptitle_group" : this.result.ptitle ? this.getTitle.find((x:any) => x.fieldIdValue === this.result.ptitle.toString()).fieldNameValue2.toString() : '',
        "pcase_type" : this.result.case_type ? this.result.case_type.toString() : '',
        "pcase_cate_id" : this.result.pcase_cate_id ? this.result.pcase_cate_id.toString() : '',
        // "ptitle" : this.result.ptitle ? this.result.ptitle.toString() : '',
        "pcon_flag" : this.result.pcon_flag == true ? '1': '0',
        "pdate_start" : this.result.txtStartDate ? myExtObject.conDate(this.result.txtStartDate) : '',
        "pdate_end" : this.result.txtEndDate ? myExtObject.conDate(this.result.txtEndDate) : '',
        "pyear_start" : this.result.pyear_start ? this.result.pyear_start.toString() : '',
        "pyear_end" : this.result.pyear_end ? this.result.pyear_end.toString() : '',

        "pprint_by" : this.result.pprint_by ? this.result.pprint_by.toString() : '',
       });
       console.log(paramData);
      // alert(paramData);return false;
      this.printReportService.printReport(rptName,paramData);
   }
  }
}






