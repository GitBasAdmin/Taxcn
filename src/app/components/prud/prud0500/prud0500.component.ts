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
  selector: 'app-prud0500,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prud0500.component.html',
  styleUrls: ['./prud0500.component.css']
})


export class Prud0500Component implements AfterViewInit, OnInit, OnDestroy {
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
  getToCourt:any;
  getDateType:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  @ViewChild('prud0500',{static: true}) prud0500 : ElementRef;
  //@ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  //@ViewChild('closebutton',{static: true}) closebutton : ElementRef;
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

    //this.getToCourt=[{id:'',text:'ทั้งหมด'},{id:'1',text:'ศาลอุทธรณ์'},{id:'2',text:'ศาลฎีกา'},{id:'6',text:'อุทธรณ์ภาค 1'},{id:'3',text:'ศาลรัฐธรรมนูญ'},{id:'4',text:'ศาลปกครอง'},{id:'5',text:'คณะกรรมการวินิจฉัยอำนาจหน้าที่'},{id:'7',text:'ศาลอุทธรณ์ภาค 5'},];
    this.getDateType=[{id:'1',text:'วันที่อ่านตั้งแต่วันที่'},{id:'2',text:'วันที่ตัดสินตั้งแต่วันที่'}];
    this.setDefPage();
  }

  setDefPage(){
    this.result = [];
    this.result.pto_court = '';
    this.result.pdate_type = '1';
  }

  directiveDate(date:any,obj:any){
    this.result[obj] = date;
  }

  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "prud0500"
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


    printReport(type:any){
      var ptype=0;
      if(type==1){//พิมพ์รายงาน
        ptype=1;
        var rptName = 'rud0500';
      }
      //else if(type==2){////พิมพ์รายละเอียด
      //   ptype=2;
      //   var rptName = 'rud0501';
      // }
      //var rptName = 'rud0500';

      // For no parameter : paramData ='{}'
      var paramData ='{}';

      // For set parameter to report
       var paramData = JSON.stringify({
        "pto_court" : this.result.pto_court ? this.result.pto_court.toString() : '',
        "pdate_start" : this.result.txtStartDate ? myExtObject.conDate(this.result.txtStartDate) : '',
        "pdate_end" : this.result.txtEndDate ? myExtObject.conDate(this.result.txtEndDate) : '',
        "pdate_type" : this.result.pdate_type ? this.result.pdate_type.toString() : '',
        "phold" : this.result.phold ? this.result.phold.toString() : '',
       });
       console.log(paramData)
      // alert(paramData);return false;
      this.printReportService.printReport(rptName,paramData);
    }

    changeCaseType(caseType:any){
      this.selCaseType = caseType;
    }



}






