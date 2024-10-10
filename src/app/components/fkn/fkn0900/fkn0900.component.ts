import { DatalistReturnComponent } from './../../modal/datalist-return/datalist-return.component';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Injectable, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, NgForm } from "@angular/forms";
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay, ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { catchError, map, } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import * as $ from 'jquery';
declare var myExtObject: any;
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { PrintReportService } from 'src/app/services/print-report.service';
// import { viewClassName } from '@angular/compiler';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { parseInt } from 'lodash';

@Component({
  selector: 'app-fkn0900,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fkn0900.component.html',
  styleUrls: ['./fkn0900.component.css']
})


export class Fkn0900Component implements AfterViewInit, OnInit, OnDestroy {

  title: any;

  posts: any;
  delList: any = [];
  search: any;
  delValue: any;
  delValue2: any;
  sessData: any;
  userData: any;
  myExtObject: any;
  programName: string;
  dep_code: any;
  dep_name: any;

  Datalist: any;
  defaultCaseType: any;

  pcaseData: any;
  pjudgementData: any;
  pcaseAlleStatData: any;
  pcaseLitigantData: any;
  prequestData: any;
  pnoticeData: any;
  pappointmentData: any;
  pappealData: any;
  preceiptData: any;
  searchFlag:boolean =false;
  tableData: any;
  sendHead:any;
  result: any = [];
  getCaseType: any;
  getTable: any;
  getAction: any;
  getTitle: any;
  getRedTitle: any;
  sendData: any;
  getLitType: any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  @ViewChild('openbutton', { static: true }) openbutton: ElementRef;
  @ViewChild('closebutton', { static: true }) closebutton: ElementRef;
  @ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;
  @ViewChild(ModalConfirmComponent) child: ModalConfirmComponent;
  public loadModalComponent: boolean = false;

  constructor(
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private printReportService: PrintReportService,
    private renderer: Renderer2,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 99,
      order: [],
      lengthChange: false,
      info: false,
      paging: false,
      searching: false
    };

    this.sessData = localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.setDefault();

    var authen = JSON.stringify({
      "userToken": this.userData.userToken,
      "url_name": "fkn0900"
    });
    this.http.post('/' + this.userData.appName + 'Api/API/authen', authen).subscribe(
      (response) => {
        let getDataAuthen: any = JSON.parse(JSON.stringify(response));
        this.programName = getDataAuthen.programName;
      },
      (error) => { }
    )

    var student = JSON.stringify({
      "table_name" : "pcase_type",
      "field_id" : "case_type",
      "field_name" : "case_type_desc",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseType = getDataOptions;
        this.fCaseTitle(this.result.case_type);//โหลด ptitle
      },
      (error) => {}
    )

    var student = JSON.stringify({
      "table_name" : "plit_type",
      "field_id" : "lit_type",
      "field_name" : "lit_type_desc",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getLitType = getDataOptions;
      },
      (error) => {}
    )

    this.getTable = [{ fieldIdValue: 'pcase', fieldNameValue: 'คำฟ้อง' }, { fieldIdValue: 'pjudgement', fieldNameValue: 'คดีแดง' },
                    { fieldIdValue: 'pcase_alle_stat', fieldNameValue: 'ข้อหา' }, { fieldIdValue: 'pcase_litigant', fieldNameValue: 'คู่ความ' },
                    { fieldIdValue: 'prequest', fieldNameValue: 'คำคู่ความ' }, { fieldIdValue: 'pnotice', fieldNameValue: 'หมาย/ผลหมาย' },
                    { fieldIdValue: 'pappointment', fieldNameValue: 'นัดความ/ผลการนัด' }, { fieldIdValue: 'pappeal', fieldNameValue: 'อุทธรณ์/ฏีกา' },
                    { fieldIdValue: 'preceipt', fieldNameValue: 'ใบเสร็จรับเงิน' }];
    this.getAction = [{ fieldIdValue: '', fieldNameValue: 'ทั้งหมด' }, { fieldIdValue: 'INSERT', fieldNameValue: 'บันทึก' },
                      {fieldIdValue: 'UPDATE', fieldNameValue: 'แก้ไข' }, { fieldIdValue: 'DELETE', fieldNameValue: 'ลบ' }];
  }

  setDefault(){
    this.result.case_type = this.userData.defaultCaseType;
    this.result.title = this.userData.defaultTitle;
    this.result.red_title = this.userData.defaultRedTitle;
    this.result.table= 'pcase';
    this.result.action= '';
  }

  fCaseTitle(val:any){
    var student = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": "AND title_flag='1' AND case_type='"+val+"' ",
      "order_by": " order_id ASC",
      "userToken" : this.userData.userToken
    });

    var student2 = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": "AND title_flag='2' AND case_type='"+val+"'",
      "order_by": " order_id ASC",
      "userToken" : this.userData.userToken
    });
    let promise = new Promise((resolve, reject) => {
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getTitle = getDataOptions;
          this.fDefaultTitle(val);//กำหนดค่าตัวแรก
        },
        (error) => {}
      )
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student2).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getRedTitle = getDataOptions;
        },
        (error) => {}
      )
    });
    return promise;
  }

  fDefaultTitle(caseType:any){
    //========================== ptitle ====================================    
    var student = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": " AND case_type='"+caseType+"' AND default_value='1' AND title_flag='1' ",
      "order_by":" title_id ASC",
      "userToken" : this.userData.userToken
    });

    var student2 = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": " AND case_type='"+caseType+"' AND default_value='1' AND title_flag='2'",
      "order_by":" title_id ASC",
      "userToken" : this.userData.userToken
    });

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    let promise = new Promise((resolve, reject) => {
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        if(getDataOptions.length){
          this.result.title = getDataOptions[0].fieldIdValue;       
        }
      },
      (error) => {}
    )
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student2 , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        if(getDataOptions.length){
          this.result.red_title = getDataOptions[0].fieldIdValue;
        }
      },
      (error) => {}
    )
    });
    return promise;
  }

  changeCaseType(obj:any,type:any){
    this.fCaseTitle(obj);
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
    this.dtTrigger.next(null);
    myExtObject.callCalendar();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  closeModal(){
  }

  ClearAll() {
    window.location.reload();
  }

  closeWindow() {
    if (window.close() == undefined) {
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('ไม่พบหน้าจอหลัก ไม่สามารถปิดหน้าจอได้');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {}
        subscription.unsubscribe();
      });
    }
    else
      window.close();
  }

  searchData() {
    if(this.result.table){
      this.searchFlag = true;
      this.tableData = this.result.table;
      this.result.getTable = '';
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');

      if((!this.result.id && !this.result.yy) && (!this.result.red_id && !this.result.red_yy)){
        confirmBox.setMessage('กรุณาระบุหมายเลขคดีที่ต้องการตรวจสอบ');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){
          }
          subscription.unsubscribe();
        });
      }else{
        this.result.userToken = this.userData.userToken;
        var student = JSON.stringify({
          "case_type" : this.result.case_type ,
          "title" : this.result.title ?this.result.title:'',
          "id" : this.result.id ? parseInt(this.result.id):null,
          "yy" : this.result.yy ? parseInt(this.result.yy):null,
          "red_title" : this.result.red_title ?this.result.red_title:'',
          "red_id" : this.result.red_id ? parseInt(this.result.red_id):null,
          "red_yy" : this.result.red_yy ? parseInt(this.result.red_yy):null,
          "table" : this.result.table ,
          "lit_type" : this.result.lit_type ,
          "action" : this.result.action ,
          "userToken" : this.userData.userToken,
        });

        console.log(student)
        this.sendData={'sendData' : student,'counter' : Math.ceil(Math.random()*10000)};
      }
    }
  }
}
