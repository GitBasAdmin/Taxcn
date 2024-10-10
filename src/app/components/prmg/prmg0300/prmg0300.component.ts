import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, NgForm } from "@angular/forms";
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay, ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatalistReturnMultipleComponent } from '../../modal/datalist-return-multiple/datalist-return-multiple.component';


// import ในส่วนที่จะใช้งานกับ Observable
import { Observable, of, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map, catchError } from 'rxjs/operators';
import { NgSelectComponent } from '@ng-select/ng-select';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
import { PrintReportService } from 'src/app/services/print-report.service';

//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
declare var myExtObject: any;

@Component({
  selector: 'app-prmg0300,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prmg0300.component.html',
  styleUrls: ['./prmg0300.component.css']
})

export class Prmg0300Component implements AfterViewInit, OnInit, OnDestroy {
  myExtObject: any;
  //form: FormGroup;
  title = 'datatables';

  posts: any;
  search: any;
  masterSelected: boolean;
  checklist: any;
  checkedList: any;
  delValue: any;
  sessData: any;
  userData: any;
  programName: any;
  defaultCaseType: any;
  defaultCaseTypeText: any;
  defaultTitle: any;
  defaultRedTitle: any;
  asyncObservable: Observable<string>;
  selectedCasetype: any = 'แพ่ง';
  getCaseType: any;
  selCaseType: any;
  selCaseId: any;

  getTitle: any;
  hid_branch_type: any;
  hid_case_type_stat: any;
  hid_title: any;
  case_type: any;
  getCaseTypeStat: any;
  case_type_stat: any;
  result: any = [];
  modalType: any;

  pcase_type_stat: any;
  getCaseTypeSt: any;
  getCaseCate: any;
  prpt_type: any;
  getRptType: any;
  pappoint_type: any;
  getAppointType: any;
  phold: any;
  getHold: any;

  pprint_by: any;
  getPprint_by: any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  public list: any;
  public listTable: any;
  public listFieldId: any;
  public listFieldName: any;
  public listFieldName2: any;
  public listFieldNull: any;
  public listFieldCond: any;
  public listFieldType: any;
  public loadModalListComponent: boolean = false;

  @ViewChild('prca0800', { static: true }) prca0800: ElementRef;
  @ViewChild('openbutton', { static: true }) openbutton: ElementRef;
  @ViewChild('closebutton', { static: true }) closebutton: ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;
  //@ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild('scasetypeid') scasetypeid: NgSelectComponent;
  @ViewChild('sCaseStat') sCaseStat: NgSelectComponent;
  @ViewChild('sType') sType: NgSelectComponent;
  @ViewChild('sTitle') sTitle: NgSelectComponent;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private printReportService: PrintReportService,
    private ngbModal: NgbModal,
    private authService: AuthService
  ) { }

  ngOnInit(): void {

    this.sessData = localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

    //this.asyncObservable = this.makeObservable('Async Observable');
    this.successHttp();

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    //======================== pcase_type ======================================
    var student = JSON.stringify({
      "table_name": "pcase_type",
      "case_type": this.case_type,
      "case_type_stat": this.case_type_stat,
      "field_id": "case_type",
      "field_name": "case_type_desc",
      "order_by": "case_type ASC",
      "userToken": this.userData.userToken
    });
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getCaseType = getDataOptions;
        this.selCaseType = this.userData.defaultCaseType;
      },
      (error) => { }
    )
    //----------------------end pcase_type -------------------

    // this.getCaseTypeSt = [{ id: '1', text: 'อาญา' }, { id: '5', text: 'สิ่งแวดล้อม (อาญา)' }, { id: '6', text: 'นักท่องเที่ยว (อาญา)' }, { id: '2', text: 'แพ่ง' }, { id: '3', text: 'ผู้บริโภค' }, { id: '4', text: 'สิ่งแวดล้อม (แพ่ง)' }, { id: '7', text: 'นักท่องเที่ยว (แพ่ง)' }];
    this.getRptType = [{ id: '1', text: '1.มีรายละเอียดคดี' }, { id: '2', text: '2.เฉพาะเลขคดี' }];
    this.getAppointType = [{ id: '0', text: '0.ทั้งหมด' }, { id: '1', text: '1.มีนัด' }, { id: '2', text: '2.ไม่มีนัด' }];
    this.getHold = [{ id: '0', text: 'ไม่แยกระยะเวลาค้าง' }, { id: '1', text: '1.แยกตามระยะเวลาค้าง(ทั้งหมด)' }, { id: '2', text: '2.ไม่เกิน 1 เดือน  (<= 30)' }, { id: '3', text: '3.เกิน 1 เดือน ไม่เกิน 3 เดือน  (>30 : <= 90)' }, { id: '4', text: '4.เกิน 3 เดือน ไม่เกิน 6 เดือน  (>90 : <= 180)' }, { id: '5', text: '5.เกิน 6 เดือน ไม่เกิน 1 ปี  (>180 : <= 365)' }, { id: '6', text: '6.เกิน 1 ปี ไม่เกิน 2 ปี  (>365 : <= 730)' }, { id: '7', text: '7.เกิน 2 ปี ไม่เกิน 3 ปี  (>730 : <= 1095)' }, { id: '8', text: '8.เกิน 3 ปี ไม่เกิน 4 ปี  (>1095 : <= 1460)' }, { id: '9', text: '9.เกิน 4 ปี ไม่เกิน 5 ปี (>1460 : <= 1825)' }, { id: '10', text: '10.เกิน 5 ปีขึ้นไป (>1825)' }];
    this.getPprint_by = [{ id: '1', text: 'PDF' }, { id: '3', text: 'Excel' }];
    this.setDefPage();
  }

  setDefPage() {
    this.result = [];
    this.result.pchk = 1;
    this.result.pprint_by = '1';
    this.result.pyear1 = this.result.pyear2 = myExtObject.curYear();
    this.result.start_date = myExtObject.curDate();
    this.result.prpt_type = '1';
    this.result.pappoint_type = '0';
    this.getCaseCate = [];
    this.getTitle = [];
    this.result.ptable = '0';
    this.result.phold = '0';
  }

  directiveDate(date: any, obj: any) {
    this.result[obj] = date;
  }

  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    var authen = JSON.stringify({
      "userToken": this.userData.userToken,
      "url_name": "prmg0300"
    });
    let promise = new Promise((resolve, reject) => {
      //let apiURL = `${this.apiRoot}?term=${term}&media=music&limit=20`;
      //this.http.get(apiURL)
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen, { headers: headers })
        .toPromise()
        .then(
          res => { // Success
            //this.results = res.json().results;
            let getDataAuthen: any = JSON.parse(JSON.stringify(res));
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
    });
  }

  ngAfterViewInit(): void {
    myExtObject.callCalendar();
    this.dtTrigger.next(null);

  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ClearAll() {
    window.location.reload();
  }

  changeCaseType(caseType: any) {
    this.sCaseStat.clearModel();
    this.sType.clearModel();
    this.sTitle.clearModel();
    this.fCaseTitle(caseType);


    var student = JSON.stringify({
      "table_name": "pcase_type_stat",
      "field_id": "case_type_stat",
      "field_name": "case_type_stat_desc",
      "condition": "AND case_type='" + caseType + "'",
      "order_by": " case_type_stat ASC",
      "userToken": this.userData.userToken
    });

    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getCaseTypeSt = getDataOptions;
        console.log( this.getCaseTypeSt);
      },
      (error) => { }
    )
  }

  changeTitle(caseType: number, type: any) {
    this.title = '';
    var student = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title_id",
      "field_name": "title",
      "field_name2": "title_eng",
      "condition": " AND case_type=" + caseType + " And title_flag=1",
      "order_by": " title_id ASC",
      "userToken": this.userData.userToken
    });
    console.log("fTitle :" + student)
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    let promise = new Promise((resolve, reject) => {
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student, { headers: headers }).subscribe(
        (response) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(response));
          this.getTitle = getDataOptions;
        },
        (error) => { }
      )
    });
    return promise;
  }

  fCaseTitle(case_type: any) {
    //========================== ptitle ====================================
    var student = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": "AND title_flag='1' AND case_type='" + case_type + "'",
      "order_by": " order_id ASC",
      "userToken": this.userData.userToken
    });


    //console.log("fCaseTitle")

    let promise = new Promise((resolve, reject) => {
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
        (response) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          this.getTitle = getDataOptions;
          this.fCaseStat(case_type, getDataOptions[0].fieldIdValue);
        },
        (error) => { }
      )



    });
    return promise;
  }

  fCaseStat(caseType: any, title: any) {
    var student = JSON.stringify({
      "table_name": "pcase_cate",
      "field_id": "case_cate_id",
      "field_name": "case_cate_name",
      "condition": " AND case_type='" + caseType + "'",
      "order_by": " case_cate_id ASC",
      "userToken": this.userData.userToken
    });
    //console.log("fCaseStat :"+student)
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    let promise = new Promise((resolve, reject) => {
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe(
        (response) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(response));
          this.getCaseCate = getDataOptions;
        },
        (error) => { }
      )
    });
    return promise;
  }

  tabChangeInput(name: any, event: any) {
    if (name == 'ptable') {
      var student = JSON.stringify({
        "table_name": "pappoint_table",
        "field_id": "table_id",
        "field_name": "table_name",
        "condition": " AND dep_code='" + event.target.value + "'",
        "userToken": this.userData.userToken
      });
      console.log(student)
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if (productsJson.length) {
            this.result.table_name = productsJson[0].fieldNameValue;
          } else {
            this.result.table_id = '';
            this.result.table_name = '';
          }
        },
        (error) => { }
      )
    }
  }

  clickOpenMyModalComponent(type: any) {
    this.modalType = type;
    // this.openbutton.nativeElement.click();
    this.loadMyModalComponent();
  }

  loadMyModalComponent() {
    $(".modal-backdrop").remove();
    if (this.modalType == 1) {
      $("#exampleModal").find(".modal-content").css("width", "800px");
      var student = JSON.stringify({
        "table_name": "pappoint_table",
        "field_id": "table_id",
        "field_name": "table_name",
        "search_id": "",
        "search_desc": "",
        "userToken": this.userData.userToken
      });
      this.listTable = 'pappoint_table';
      this.listFieldId = 'table_id';
      this.listFieldName = 'table_name';
      this.listFieldNull = '';

      this.http.disableLoading().post('/' + this.userData.appName + 'ApiUTIL/API/popup', student).subscribe(
        (response) => {
          console.log(response)
          this.list = response;
          // this.loadModalListComponent = true;

          const modalRef = this.ngbModal.open(DatalistReturnMultipleComponent, { size: 'lg', backdrop: 'static' })
          modalRef.componentInstance.items = this.list
          modalRef.componentInstance.value1 = "pappoint_table"
          modalRef.componentInstance.value2 = "table_id"
          modalRef.componentInstance.value3 = "table_name"
          modalRef.componentInstance.types = "1"

          modalRef.result.then((item: any) => {
            if (item) {
              this.result.ptable = item.fieldIdValue;
              this.result.ptable_name = item.fieldNameValue;
            }
          })
        },
        (error) => { }
      )

    }
  }

  receiveFuncListData(event: any) {
    console.log(event)
    if (this.modalType == 1) {
      this.result.ptable = event.fieldIdValue;
      this.result.ptable_name = event.fieldNameValue;
    }
    this.closebutton.nativeElement.click();
  }

  closeModal() {
    this.loadModalListComponent = false;
  }

  printReport() {

    var rptName = 'rmg0300';

    // For no parameter : paramData ='{}'
    var paramData = '{}';

    // For set parameter to report
    var paramData = JSON.stringify({
      "prpt_type": this.result.prpt_type ? this.result.prpt_type : '',
      "ptitle": this.result.ptitle ? this.result.ptitle.toString() : '',
      "pcase_type": this.result.case_type ? this.result.case_type.toString() : '',
      "pcase_type_stat": this.result.pcase_type_stat ? this.result.pcase_type_stat.toString() : '',
      "pcase_cate_id": this.result.pcase_cate_id ? this.result.pcase_cate_id.toString() : '',

      "pyear1": this.result.pyear1 ? this.result.pyear1.toString() : '',
      "pyear2": this.result.pyear2 ? this.result.pyear2.toString() : '',
      "ptoday": myExtObject.conDate(this.result.start_date),
      "pchk": this.result.pchk == true ? '1' : '0',

      "pcon_flag": this.result.pcon_flag == true ? '1' : '0',
      "pimprison_flag": this.result.imprison_flag == true ? '1' : '0',
      "ptable": this.result.ptable ? this.result.ptable.toString() : '',
      "pappoint_type": this.result.pappoint_type ? this.result.pappoint_type.toString() : '',
      "phold": this.result.phold ? this.result.phold.toString() : '',
      "pprint_by": this.result.pprint_by.toString(),
    });
    console.log(paramData);
    // alert(paramData);return false;
    this.printReportService.printReport(rptName, paramData);
  }
}