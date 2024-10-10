import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, NgForm } from "@angular/forms";
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay, ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatalistReturnComponent } from '@app/components/modal/datalist-return/datalist-return.component';
import { ModalJudgeComponent } from '@app/components/modal/modal-judge/modal-judge.component';

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
  selector: 'app-prmg0200,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prmg0200.component.html',
  styleUrls: ['./prmg0200.component.css']
})


export class Prmg0200Component implements AfterViewInit, OnInit, OnDestroy {
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
  selCaseType: any;
  selCaseId: any;

  getCaseType: any;
  getCaseCate: any;
  result: any = [];
  modalType: any;
  getpJudgeStatus: any;

  public list: any;
  public listTable: any;
  public listFieldId: any;
  public listFieldName: any;
  public listFieldName2: any;
  public listFieldNull: any;
  public listFieldCond: any;
  public listFieldType: any;
  public loadModalListComponent: boolean = false;
  public loadModalJudgeComponent: boolean = false;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  @ViewChild('prmg0200', { static: true }) prmg0200: ElementRef;
  @ViewChild('openbutton', { static: true }) openbutton: ElementRef;
  @ViewChild('closebutton', { static: true }) closebutton: ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;
  //@ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild('scasetypeid') scasetypeid: NgSelectComponent;
  @ViewChild('sCaseStat') sCaseStat: NgSelectComponent;
  @ViewChild('sTitleGroup') sTitleGroup: NgSelectComponent;

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
      "field_id": "case_type",
      "field_name": "case_type_desc",
      "order_by": "case_type ASC",
      "userToken": this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student, { headers: headers }).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getCaseType = getDataOptions;
        this.selCaseType = this.userData.defaultCaseType;

        //console.log(this.getCaseType)
        //console.log(this.userData.defaultCaseType)
        //console.log(this.selCaseType)
      },
      (error) => { }
    )
    //----------------------end pcase_type -------------------

    this.getpJudgeStatus = [{ id: '0', text: 'ทั้งหมด' }, { id: '1', text: 'อยู่' }, { id: '2', text: 'ย้าย' }];
    this.setDefPage();
  }

  setDefPage() {
    this.result = [];
    this.result.pjudge_status = '0';
    this.result.ptoday = this.result.ptoday = myExtObject.curDate();
    this.result.ptable_id = '0';
  }

  fCaseTitle(case_type: any) {
    //============ ptitle ============
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
    if (name == 'pjudge_id') {
      var student = JSON.stringify({
        "table_name": "pjudge",
        "field_id": "judge_id",
        "field_name": "judge_name",
        "field_name2": "post_id",
        "condition": " AND judge_id='" + event.target.value + "'",
        "userToken": this.userData.userToken
      });
      console.log(student)
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if (productsJson.length) {
            this.result.conciliate_name = productsJson[0].fieldNameValue;
          } else {
            this.result.pjudge_id = '';
            this.result.pjudge_name = '';
          }
        },
        (error) => { }
      )
    } else if (name == 'ptable_id') {
      var student = JSON.stringify({
        "table_name": "pappoint_table",
        "field_id": "table_id",
        "field_name": "table_name",
        "condition": " AND table_id='" + event.target.value + "'",
        "userToken": this.userData.userToken
      });
      console.log(student)
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if (productsJson.length) {
            this.result.ptable_name = productsJson[0].fieldNameValue;
          } else {
            this.result.ptable_id = '';
            this.result.ptable_name = '';
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

  closeModal() {
    this.loadModalListComponent = false;
    this.loadModalJudgeComponent = false;
  }

  loadMyModalComponent() {
    $(".modal-backdrop").remove();
    if (this.modalType == 1) {
      var student = JSON.stringify({
        "cond": 2,
        "userToken": this.userData.userToken
      });
      this.listTable = 'pjudge';
      this.listFieldId = 'judge_id';
      this.listFieldName = 'judge_name';
      this.listFieldNull = '';
      this.listFieldType = JSON.stringify({ "type": 2 });
      this.loadModalListComponent = false;
      this.loadModalJudgeComponent = true;
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/popupJudge', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          if (productsJson.data.length) {
            this.list = productsJson.data;
            console.log(this.list)
          } else {
            this.list = [];
          }

          const modalRef: NgbModalRef = this.ngbModal.open(ModalJudgeComponent, { size: 'lg', backdrop: 'static' })
          modalRef.componentInstance.value1 = "pjudge"
          modalRef.componentInstance.value2 = "judge_id"
          modalRef.componentInstance.value3 = "judge_name"
          modalRef.componentInstance.value4 = ''
          modalRef.componentInstance.types = "1"
          modalRef.componentInstance.value5 = JSON.stringify({"type":1})

          modalRef.result.then((item: any) => {
            if (item) {
              this.result.pjudge_id = item.judge_id;
              this.result.pjudge_name = item.judge_name;
            }
          }).catch((error: any) => {
            console.log(error)
          })


        },
        (error) => { }
      )
    } if (this.modalType == 2 || this.modalType == 3) {
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
          const modalRef = this.ngbModal.open(DatalistReturnComponent,{ size: 'lg', backdrop: 'static' })
          modalRef.componentInstance.items = this.list
          modalRef.componentInstance.value1 = "pappoint_table"
          modalRef.componentInstance.value2 = "table_id"
          modalRef.componentInstance.value3 = "table_name"
          modalRef.componentInstance.types = "1"

          modalRef.result.then((item: any) => {
            if(item){
              this.result.ptable_id=item.fieldIdValue;
              this.result.ptable_name=item.fieldNameValue;
              
            }
          })
        },
        (error) => { }
      )
    }
  }

  receiveFuncListData(event: any) {
    console.log(event)
    if (this.modalType == 2) {
      this.result.ptable_id = event.fieldIdValue;
      this.result.ptable_name = event.fieldNameValue;
    }
    this.closebutton.nativeElement.click();
  }
  receiveJudgeListData(event: any) {
    this.result.pjudge_id = event.judge_id;
    this.result.pjudge_name = event.judge_name;
    this.closebutton.nativeElement.click();
  }



  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    var authen = JSON.stringify({
      "userToken": this.userData.userToken,
      "url_name": "prmg0200"
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


  printReport(flag: any) {
    var rptName = 'rmg0200';
    // For no parameter : paramData ='{}'
    var paramData = '{}';
    // For set parameter to report
    var paramData = JSON.stringify({
      "pcase_type": this.result.pcase_type ? this.result.pcase_type.toString() : '',
      "pcase_cate_id": this.result.pcase_cate_id ? this.result.pcase_cate_id.toString() : '',
      "pjudge_id": this.result.pjudge_id ? this.result.pjudge_id : '',
      "ptable": this.result.ptable_id ? this.result.ptable_id : '0',
      "ptoday": this.result.ptoday ? myExtObject.conDate(this.result.ptoday) : '',
      "pjudge_status": this.result.pjudge_status ? this.result.pjudge_status : '',
      "pflag": flag.toString(),
    });
    console.log(paramData)
    // alert(paramData);return false;
    this.printReportService.printReport(rptName, paramData);
  }

  directiveDate(date: any, obj: any) {
    this.result[obj] = date;
  }

  changeCaseType(caseType: any) {
    this.sCaseStat.clearModel();
    this.fCaseTitle(caseType);
  }

}






