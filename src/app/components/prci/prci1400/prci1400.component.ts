import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, NgForm } from "@angular/forms";
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay, ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatalistReturnComponent } from '@app/components/modal/datalist-return/datalist-return.component';

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
  selector: 'app-prci1400,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prci1400.component.html',
  styleUrls: ['./prci1400.component.css']
})


export class Prci1400Component implements AfterViewInit, OnInit, OnDestroy {
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

  result: any = [];
  modalType: any;
  getFlag: any;

  public list: any;
  public listTable: any;
  public listFieldId: any;
  public listFieldName: any;
  public listFieldName2: any;
  public listFieldNull: any;
  public listFieldCond: any;
  public listFieldType: any;
  public loadModalListComponent: boolean = false;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  @ViewChild('prci1400', { static: true }) prci1400: ElementRef;
  @ViewChild('openbutton', { static: true }) openbutton: ElementRef;
  @ViewChild('closebutton', { static: true }) closebutton: ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;
  //@ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild('scasetypeid') scasetypeid: NgSelectComponent;

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
      },
      (error) => { }
    )
    //----------------------end pcase_type -------------------
    this.getFlag = [{ id: '1', text: 'ตั้งเบิก ตั้งแต่วันที่' }, { id: '2', text: 'จ่าย ตั้งแต่วันที่' }];
    this.setDefPage();
  }

  setDefPage() {
    this.result = [];
    // this.result.txtStartDate = this.result.txtStartDate = myExtObject.curDate();
    // this.result.txtEndDate = this.result.txtEndDate = myExtObject.curDate();
    this.result.pflag = '1';
  }

  directiveDate(date: any, obj: any) {
    this.result[obj] = date;
  }

  changeCaseType(caseType: any) {
    this.selCaseType = caseType;
  }

  tabChangeInput(name: any, event: any) {
    if (name == 'puser_report') {
      var student = JSON.stringify({
        "table_name": "pofficer",
        "field_id": "off_id",
        "field_name": "off_name",
        "field_name2": "post_id",
        "condition": " AND off_id='" + event.target.value + "'",
        "userToken": this.userData.userToken
      });
      console.log(student)
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          if (productsJson.length) {
            this.result.user_report_name = productsJson[0].fieldNameValue;
          } else {
            this.result.puser_report = '';
            this.result.user_report_name = '';
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
  }

  loadMyModalComponent() {
    $(".modal-backdrop").remove();
    if (this.modalType == 1) {
      $("#exampleModal").find(".modal-content").css("width", "800px");
      var student = JSON.stringify({
        "table_name": "pofficer",
        "field_id": "off_id",
        "field_name": "off_name",
        "field_name2": "post_id",
        "search_id": "",
        "search_desc": "",
        "userToken": this.userData.userToken
      });
      this.listTable = 'pofficer';
      this.listFieldId = 'off_id';
      this.listFieldName = 'off_name';
      this.listFieldName2 = 'post_id';
      this.listFieldNull = '';

      this.http.disableLoading().post('/' + this.userData.appName + 'ApiUTIL/API/popup', student).subscribe(
        (response) => {
          console.log(response)
          this.list = response;
          // this.loadModalListComponent = true;
          const modalRef = this.ngbModal.open(DatalistReturnComponent, { size: 'lg', backdrop: 'static' })
          modalRef.componentInstance.items = this.list
          modalRef.componentInstance.value1 = "pofficer"
          modalRef.componentInstance.value2 = "off_id"
          modalRef.componentInstance.value3 = "off_name"
          modalRef.componentInstance.value4 = "post_id"
          modalRef.componentInstance.types = "1"

          modalRef.result.then((item: any) => {
            if (item) {
              this.result.puser_report = item.fieldIdValue;
              this.result.user_report_name = item.fieldNameValue;
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
      this.result.puser_report = event.fieldIdValue;
      this.result.user_report_name = event.fieldNameValue;
    }
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
      "url_name": "prci1400"
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

  printReport(type: any) {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if (!this.result.txtStartDate) {
      confirmBox.setMessage('กรุณาระบุข้อมูล ตั้งแต่วันที่');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    } else if (!this.result.txtEndDate) {
      confirmBox.setMessage('กรุณาระบุข้อมูล ถึงวันที่');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    } else {
      var ptype = 0;
      if (type == 1) {//พิมพ์รายงาน1
        ptype = 1;
        var rptName = 'rci1400';
      } else if (type == 2) {////พิมพ์ราย2
        ptype = 2;
        var rptName = 'rci1410';
      }
      //var rptName = 'rci1400';
      // For no parameter : paramData ='{}'
      var paramData = '{}';
      // For set parameter to report
      var paramData = JSON.stringify({
        "pdate_start": this.result.txtStartDate ? myExtObject.conDate(this.result.txtStartDate) : '',
        "pdate_end": this.result.txtEndDate ? myExtObject.conDate(this.result.txtEndDate) : '',
        "pflag": this.result.pflag ? this.result.pflag.toString() : '',
        "puser_report": this.result.puser_report ? this.result.puser_report.toString() : '',
        "user_report_name": this.result.user_report_name ? this.result.user_report_name.toString() : '',
      });
      console.log(paramData);
      // alert(paramData);return false;
      this.printReportService.printReport(rptName, paramData);
    }
  }
}