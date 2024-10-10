import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, NgForm } from "@angular/forms";
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay, ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatalistReturnMultipleComponent } from '@app/components/modal/datalist-return-multiple/datalist-return-multiple.component';
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
  selector: 'app-prkb1300,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prkb1300.component.html',
  styleUrls: ['./prkb1300.component.css']
})

export class Prkb1300Component implements AfterViewInit, OnInit, OnDestroy {
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
  // pcheck:any;
  getTableId: any;
  result: any = [];
  pown_flag: any;
  getOwnFlag: any;

  public list: any;
  public listTable: any;
  public listFieldId: any;
  public listFieldName: any;
  public listFieldName2: any;
  public listFieldNull: any;
  public listFieldType: any;
  public listFieldCond: any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  @ViewChild('prkb1300', { static: true }) prkb1300: ElementRef;
  @ViewChild('openbutton', { static: true }) openbutton: ElementRef;
  @ViewChild('closebutton', { static: true }) closebutton: ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;
  //@ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild('scasetypeid') scasetypeid: NgSelectComponent;
  public loadModalComponent: boolean = false;

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
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student, { headers: headers }).subscribe(
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

    // //======================== pappoint_table ======================================
    // var Json = JSON.stringify({
    //   "table_name" : "pappoint_table",
    //   "field_id" : "table_id",
    //   "field_name" : "table_name",
    //   "userToken" : this.userData.userToken
    // });
    //   console.log(Json);
    // this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', Json , {headers:headers}).subscribe(
    //   (response) =>{
    //     console.log('xxxxxxxxxxx'+response);
    //     let getDataOptions : any = JSON.parse(JSON.stringify(response));
    //     this.getTableId = getDataOptions;
    //     // this.getBank.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
    //   },
    //   (error) => {}
    // )
    this.getOwnFlag = [{ id: '0', text: 'ทั้งหมด' }, { id: '1', text: 'มี' }, { id: '2', text: 'ไม่มี' }];
    this.setDefPage();
  }

  setDefPage() {
    this.result = [];
    this.result.txtStartDate = myExtObject.curDate();
    this.result.txtEndDate = myExtObject.curDate();
    this.result.pdepartment = '';
    this.result.pown_flag = '0';
  }

  directiveDate(date: any, obj: any) {
    this.result[obj] = date;
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    var authen = JSON.stringify({
      "userToken": this.userData.userToken,
      "url_name": "prkb1300"
    });
    let promise = new Promise((resolve, reject) => {
      //let apiURL = `${this.apiRoot}?term=${term}&media=music&limit=20`;
      //this.http.get(apiURL)
      this.http.post('/' + this.userData.appName + 'Api/API/authen', authen, { headers: headers })
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

  clickOpenMyModalComponent(val: any) {
    $("#exampleModal").find(".modal-content").css("width", "700px");
    var student = JSON.stringify({
      "table_name": "pappoint_table",
      "field_id": "table_id",
      "field_name": "table_name",
      "search_id": "",
      "search_desc": "",
      "condition": " AND table_type=2",
      "userToken": this.userData.userToken
    });
    this.listTable = 'pappoint_table';
    this.listFieldId = 'table_id';
    this.listFieldName = 'table_name';
    this.listFieldNull = '';
    this.listFieldCond = " AND table_type=2";
    this.loadModalComponent = false;
    this.loadComponent = true;
    console.log(student)
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/popup', student).subscribe(
      (response) => {
        console.log(response)
        this.list = response;

        
        const modalRef = this.ngbModal.open(DatalistReturnMultipleComponent,{ size: 'lg', backdrop: 'static' })
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

  loadMyModalComponent() {
    this.loadComponent = true;
    // this.loadModalComponent = true;
    $("#exampleModal").find(".modal-body").css("height", "100px");
  }

  tabChangeInput(name: any, event: any) {
    if (name == 'ptable_id') {
      var student = JSON.stringify({
        "table_name": "pappoint_table",
        "field_id": "table_id",
        "field_name": "table_name",
        "condition": " AND table_id='" + event.target.value + "' AND table_type=2",
        "userToken": this.userData.userToken
      });
      console.log(student)
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
        (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));

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

  closeModal() {
    $('.modal')
      .find("input[type='text'],input[type='password'],textarea,select")
      .val('')
      .end()
      .find("input[type=checkbox], input[type=radio]")
      .prop("checked", "")
      .end();
    this.loadModalComponent = false;
    this.loadModalComponent = false;
    // this.loadModalJudgeComponent = false;
  }

  receiveFuncListData(event: any) {
    this.result.ptable_id = event.fieldIdValue;
    this.result.ptable_name = event.fieldNameValue;
    this.closebutton.nativeElement.click();
    console.log(event)
  }

  printReport() {

    var rptName = 'rkb1300';
    // For no parameter : paramData ='{}'
    var paramData = '{}';
    // For set parameter to report
    var paramData = JSON.stringify({
      //  "pcase_type" : this.selCaseType,
      //  "pcheck" : this.pcheck==true ? '1': '0',
      "ptable": this.result.ptable_id ? this.result.ptable_id.toString() : '0',
      //  "pdate_start" : myExtObject.conDate($("#txt_date_start").val()),
      //  "pdate_end" : myExtObject.conDate($("#txt_date_end").val()),
      "pdate_start": this.result.txtStartDate ? myExtObject.conDate(this.result.txtStartDate) : '',
      "pdate_end": this.result.txtEndDate ? myExtObject.conDate(this.result.txtEndDate) : '',
      "papp_name": this.result.papp_name ? this.result.papp_name : '',
      "palle_desc": this.result.palle_desc ? this.result.palle_desc : '',
      "pown_flag": this.result.pown_flag ? this.result.pown_flag.toString() : '',
    });
    console.log(paramData);
    // alert(paramData);return false;
    this.printReportService.printReport(rptName, paramData);
  }

}