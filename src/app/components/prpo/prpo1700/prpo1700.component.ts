import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, NgForm } from "@angular/forms";
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay, ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';

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
  selector: 'app-prpo1700,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prpo1700.component.html',
  styleUrls: ['./prpo1700.component.css']
})


export class Prpo1700Component implements AfterViewInit, OnInit, OnDestroy {
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
  getNoticeNew: any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  @ViewChild('prpo1700', { static: true }) prpo1700: ElementRef;
  //@ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  //@ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;
  //@ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild('scasetypeid') scasetypeid: NgSelectComponent;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private printReportService: PrintReportService,
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
    this.getNoticeNew = [{ id: '1', text: 'หมายใหม่' }, { id: '2', text: 'หมายเก่า' }];
    this.setDefPage();
  }

  setDefPage() {
    this.result = [];
    this.result.pnotice_new = '1';
    this.result.psize = 1;
  }

  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    var authen = JSON.stringify({
      "userToken": this.userData.userToken,
      "url_name": "prpo1700"
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
      var rptName = 'rpo1700';
      // For no parameter : paramData ='{}'
      var paramData = '{}';
      // For set parameter to report
      var paramData = JSON.stringify({
        "psize": this.result.psize ? this.result.psize.toString() : '',
        "pdate_start": this.result.txtStartDate ? myExtObject.conDate(this.result.txtStartDate) : '',
        "pdate_end": this.result.txtEndDate ? myExtObject.conDate(this.result.txtEndDate) : '',
        "pnotice_new": this.result.pnotice_new ? this.result.pnotice_new.toString() : '',
      });
      console.log(paramData);
      // alert(paramData);return false;
      this.printReportService.printReport(rptName, paramData);
    }
  }

  directiveDate(date: any, obj: any) {
    this.result[obj] = date;
  }
  changeCaseType(caseType: any) {
    this.selCaseType = caseType;
  }
}