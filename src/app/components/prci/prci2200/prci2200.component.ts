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
import { isTypeAliasDeclaration } from 'typescript';

//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
declare var myExtObject: any;

@Component({
  selector: 'app-prci2200,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prci2200.component.html',
  styleUrls: ['./prci2200.component.css']
})


export class Prci2200Component implements AfterViewInit, OnInit, OnDestroy {
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

  public list: any;
  public listTable: any;
  public listFieldId: any;
  public listFieldName: any;
  public listFieldName2: any;
  public listFieldNull: any;
  public listFieldCond: any;
  public listFieldType: any;
  public loadModalListComponent: boolean = false;
  public loadModalJudgeComponent: boolean = false;//popup ผู้พิพากษา

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  @ViewChild('prci1900', { static: true }) prci1900: ElementRef;
  @ViewChild('openbutton', { static: true }) openbutton: ElementRef;
  @ViewChild('closebutton', { static: true }) closebutton: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;
  @ViewChild('scasetypeid') scasetypeid: NgSelectComponent;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private ngbModal: NgbModal,
    private SpinnerService: NgxSpinnerService,
    private printReportService: PrintReportService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.sessData = localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    //this.asyncObservable = this.makeObservable('Async Observable');
    this.successHttp();
    this.result.pcheck_date = myExtObject.curDate();

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
  }



  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    var authen = JSON.stringify({
      "userToken": this.userData.userToken,
      "url_name": "prci2200"
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
    this.selCaseType = caseType;
  }

  tabChangeInput(name: any, event: any) {
    if (name == 'pcon_id') {
      var student = JSON.stringify({
        "table_name": "pconciliate",
        "field_id": "conciliate_id",
        "field_name": "conciliate_name",
        "condition": " AND conciliate_id='" + event.target.value + "'",
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
            this.result.pcon_id = '';
            this.result.conciliate_name = '';
          }
        },
        (error) => { }
      )
    } else if (name == 'puser_check_id') {
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
            this.result.puser_check = productsJson[0].fieldNameValue;
            this.getPost(productsJson[0].fieldNameValue2);
          } else {
            this.result.puser_check_id = '';
            this.result.puser_check = '';
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
        "table_name": "pconciliate",
        "field_id": "conciliate_id",
        "field_name": "conciliate_name",
        "search_id": "",
        "search_desc": "",
        "userToken": this.userData.userToken
      });
      this.listTable = 'pconciliate';
      this.listFieldId = 'conciliate_id';
      this.listFieldName = 'conciliate_name';
      this.listFieldNull = '';

      this.http.disableLoading().post('/' + this.userData.appName + 'ApiUTIL/API/popup', student).subscribe(
        (response) => {
          console.log(response)
          this.list = response;
          // this.loadModalListComponent = true;
          // this.loadModalJudgeComponent = false;

          const modalRef = this.ngbModal.open(DatalistReturnComponent, { size: 'lg', backdrop: 'static' })
          modalRef.componentInstance.items = this.list
          modalRef.componentInstance.value1 = "pconciliate"
          modalRef.componentInstance.value2 = "conciliate_id"
          modalRef.componentInstance.value3 = "conciliate_name"
          modalRef.componentInstance.types = "1"

          modalRef.result.then((item: any) => {
            if (item) {
              this.result.pcon_id = item.fieldIdValue;
              this.result.conciliate_name = item.fieldNameValue;
            }
          })
        },
        (error) => { }
      )

    } else if (this.modalType == 2) {
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
          // this.loadModalJudgeComponent = false;
          const modalRef = this.ngbModal.open(DatalistReturnComponent, { size: 'lg', backdrop: 'static' })
          modalRef.componentInstance.items = this.list
          modalRef.componentInstance.value1 = "pofficer"
          modalRef.componentInstance.value2 = "off_id"
          modalRef.componentInstance.value3 = "off_name"
          modalRef.componentInstance.value4 = "post_id"
          modalRef.componentInstance.types = "1"

          modalRef.result.then((item: any) => {
            if (item) {
              this.result.puser_check_id = item.fieldIdValue;
              this.result.puser_check = item.fieldNameValue;
              this.getPost(item.fieldNameValue2);
            }
          })
        },
        (error) => { }
      )
    }
  }
  closeModal() {
    this.loadModalListComponent = false;
    this.loadModalJudgeComponent = false;
  }

  receiveFuncListData(event: any) {
    console.log(event)
    if (this.modalType == 1) {
      this.result.pcon_id = event.fieldIdValue;
      this.result.conciliate_name = event.fieldNameValue;
    } else if (this.modalType == 2) {
      this.result.puser_check_id = event.fieldIdValue;
      this.result.puser_check = event.fieldNameValue;
      this.getPost(event.fieldNameValue2);
    }
    this.closebutton.nativeElement.click();
  }
  receiveJudgeListData(event: any) {
    this.result.pid = event.judge_id;
    this.result.pstat_name = event.judge_name;
    this.closebutton.nativeElement.click();
  }

  directiveDate(date: any, obj: any) {
    this.result[obj] = date;
  }

  getPost(post_id: any) {
    if (post_id) {
      var student = JSON.stringify({
        "table_name": "pposition",
        "field_id": "post_id",
        "field_name": "post_name",
        "condition": " AND post_id='" + post_id + "'",
        "userToken": this.userData.userToken
      });
      console.log(student)
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          if (productsJson.length) {
            this.result.post_name = productsJson[0].fieldNameValue;
            //ตรงนี้เมื่อต้องตาเพิ่มตำแหน่งใน form แล้ว เปลี่ยนชื่อให้ตรง
          } else {
            this.result.post_name = '';
            //ตรงนี้เมื่อต้องตาเพิ่มตำแหน่งใน form แล้ว เปลี่ยนชื่อให้ตรง
          }
        },
        (error) => { }
      )
    }
  }

  printReport() {
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
      var rptName = 'rci2200';
      // For no parameter : paramData ='{}'
      var paramData = '{}';
      // For set parameter to report
      var paramData = JSON.stringify({
        //  "pcase_type" : this.selCaseType,
        "pdate_start": myExtObject.conDate(this.result.txtStartDate),
        "pdate_end": myExtObject.conDate(this.result.txtEndDate),
        "pcon_id": this.result.pcon_id ? this.result.pcon_id.toString() : '',
        "pcheck_date": myExtObject.conDate(this.result.pcheck_date),
        "puser_check": this.result.conciliate_name ? this.result.conciliate_name.toString() : '',
        "ppost_check": this.result.post_name ? this.result.post_name.toString() : '',
      });
      console.log(paramData);
      // alert(paramData);return false;
      this.printReportService.printReport(rptName, paramData);
    }
  }
}