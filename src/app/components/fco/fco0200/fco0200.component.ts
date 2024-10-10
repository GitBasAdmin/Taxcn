import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, NgForm } from "@angular/forms";
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay, ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
declare var myExtObject: any;
// import ในส่วนที่จะใช้งานกับ Observable
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map, catchError } from 'rxjs/operators';

import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import {
  CanDeactivate, Router, ActivatedRoute, NavigationStart,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  NavigationError, Routes
} from '@angular/router'

@Component({
  selector: 'app-fco0200,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fco0200.component.html',
  styleUrls: ['./fco0200.component.css']
})


export class Fco0200Component implements AfterViewInit, OnInit, OnDestroy {
  //form: FormGroup;
  title = 'datatables';
  toPage1 = "fco0200";
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
  //-----
  runId: any;
  run_id: any;
  result: any = [];
  dataHead: any = [];
  getSCourt: any;
  indexDelete: any;
  modalType: any;

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;


  asyncObservable: Observable<string>;
  dtOptions: DataTables.Settings = {};
  dtOptions2: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadModalComponent: boolean = false;
  public loadComponent: boolean = false;

  @ViewChild('openbutton', { static: true }) openbutton: ElementRef;
  @ViewChild('closebutton', { static: true }) closebutton: ElementRef;
  @ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;
  @ViewChild(ModalConfirmComponent) child: ModalConfirmComponent;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.dtOptions2 = {
      columnDefs: [{ "targets": 'no-sort', "orderable": false }],
      order: [[2, 'asc']],
      lengthChange: false,
      info: false,
      paging: false,
      searching: false
    };

    this.activatedRoute.queryParams.subscribe(params => {
      if (params['run_id']) {
        this.runId = params['run_id'];
        this.run_id = params['run_id'];
        this.getData();
      }
    });

    this.sessData = localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

    this.successHttp();
    this.setDefPage();

    this.getData();
    //======================== pcourt ======================================
    var student = JSON.stringify({
      "table_name": "pcourt",
      "field_id": "court_id",
      "field_name": "court_name",
      "userToken": this.userData.userToken
    });
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getSCourt = getDataOptions;
      },
      (error) => { }
    )
  }

  setDefPage() {
    this.posts=[];
    this.result=[];
    this.result.issue_type = 1;
  }


  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    var authen = JSON.stringify({
      "userToken": this.userData.userToken,
      "url_name": "fca0200"
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
    this.dtTrigger.next(null);
    myExtObject.callCalendar();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  directiveDate(date: any, obj: any) {
    this.result[obj] = date;
  }

  //-----head ข้อมูลเลขคดี
  fnDataHead(event: any) {
    this.dataHead = event;
    if (this.dataHead.buttonSearch == 1) {
      this.runId = { 'run_id': event.run_id, 'counter': Math.ceil(Math.random() * 10000), 'notSearch': 1 }
      this.result.run_id = this.dataHead.run_id;
      this.run_id = this.dataHead.run_id;
      this.ngOnInit();
    }
  }

  clickOpenMyModalComponent(type){
    this.modalType=type;
      this.openbutton.nativeElement.click();
  }

  loadMyModalComponent(){
    if(this.modalType==1){
      var student = JSON.stringify({
        "table_name" : "pcourt",
        "field_id" : "court_id",
        "field_name" : "court_name",
        "field_name2" : "court_running",
        "userToken" : this.userData.userToken
      });
      this.listTable='pcourt';
      this.listFieldId='court_id';
      this.listFieldName='court_name';
      this.listFieldName2="court_running";
      this.listFieldCond="";
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
        (response) =>{
          this.list = response;
          this.loadModalComponent = false; 
          this.loadComponent = true;
        },
        (error) => {}
      )
    }else{
      this.loadModalComponent = true; 
      this.loadComponent = false;
    }
 }

 receiveFuncListData(event:any){
  // console.log("receiveFuncListData event=>", event)
  if(this.modalType==1 ){
    this.result.scourt_id = event.fieldIdValue;
    this.result.scourt_name = event.fieldNameValue ;
    this.result.courtsend_running = event.fieldNameValue2 ;
  }
  this.closebutton.nativeElement.click();
}

  getData() {
    // console.log("this.runId=>",this.result.run_id,this.run_id);
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    this.SpinnerService.show();

    var student = JSON.stringify({
      "run_id": this.run_id,
      "userToken": this.userData.userToken
    });
    this.http.post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco0200/getData', student).subscribe(posts => {
      let productsJson: any = JSON.parse(JSON.stringify(posts));
      this.posts = productsJson.data;
      if (productsJson.result == 1) {
        this.checklist = this.posts;
        if (productsJson.data.length)
          this.posts.forEach((x: any) => x.edit0200 = false);
        this.rerender();
      } else {
        this.posts = [];
      }
      this.SpinnerService.hide();
    });
  }

  openAppointment() {
    let toPage = "fap0111";
    let winURL = window.location.href.split("/#/")[0] + "/#/";
    //window.open(winURL, '_blank', "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=auto,height=auto");
    myExtObject.OpenWindowMaxName(winURL+'fap0111?run_id='+this.run_id,toPage);
  }

  submitForm() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if (!this.dataHead.run_id) {
      confirmBox.setMessage('กรุณาค้นหาข้อมูลเลขดคี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {
        }
        subscription.unsubscribe();
      });
    } else if (!this.result.date_send) {
      confirmBox.setMessage('กรุณาระบุวันที่วันที่ส่งประเด็น');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {
        }
        subscription.unsubscribe();
      });
    } else {
      this.SpinnerService.show();
      this.result.run_id  = this.run_id;
      this.result.userToken  = this.userData.userToken;
      var student = JSON.stringify($.extend({}, this.result));
      this.http.post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco0200/saveData', student).subscribe(
        (response) => {
          let alertMessage: any = JSON.parse(JSON.stringify(response));
          if (alertMessage.result == 0) {
            this.SpinnerService.hide();
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) {
                this.SpinnerService.hide();
              }
              subscription.unsubscribe();
            });
          } else {
            this.SpinnerService.hide();
            confirmBox.setMessage('ข้อความแจ้งเตือน');
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) { }
              subscription.unsubscribe();
            });
            this.result.copy_running = alertMessage.copy_running;
            this.getData();
          }
        },
        (error) => { this.SpinnerService.hide(); }
      )
    }
  }

  ClearAll() {
    let winURL = window.location.href.split("/#/")[0] + "/#/";
    location.replace(winURL + this.toPage1)
    window.location.reload();
  }

  buttNew() {
    this.ngOnInit();
  }

  editData(index: any) {
    this.SpinnerService.show();

    this.result =  JSON.parse(JSON.stringify(this.posts[index]));
    this.result.scourt_name = this.posts[index].court_name;

    setTimeout(() => {
      this.SpinnerService.hide();
    }, 100);
  }

  deleteData(index: any) {
    this.modalType="deleteData";
    this.indexDelete = index;
    this.openbutton.nativeElement.click();
  }

  closeModal() {
    this.loadModalComponent = false; 
    this.loadComponent = false;
  }

  submitModalForm() {
    var chkForm = JSON.parse(this.child.ChildTestCmp());

    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if (!chkForm.password) {
      confirmBox.setMessage('กรุณาป้อนรหัสผ่าน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });

    } else if (!chkForm.log_remark) {
      confirmBox.setMessage('กรุณาป้อนเหตุผล');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    } else {
      var student = JSON.stringify({
        "user_running": this.userData.userRunning,
        "password": chkForm.password,
        "log_remark": chkForm.log_remark,
        "userToken": this.userData.userToken
      });
      // console.log("checkPassword student=> ", student);
      this.http.post('/'+this.userData.appName+'Api/API/checkPassword', student).subscribe(
        posts => {
          let productsJson: any = JSON.parse(JSON.stringify(posts));
          if (productsJson.result == 1) {
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
            confirmBox.setMessage('ยืนยันการลบข้อมูลที่เลือก');
            confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
            // Choose layout color type
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) {
                if (this.indexDelete >= 0 && this.posts[this.indexDelete]['copy_running'] != "") {
                  var dataDel = [], dataTmp = [];
                  var bar = new Promise((resolve, reject) => {
                    dataTmp.push(this.posts[this.indexDelete]);
                  });
                  if (bar) {
                    dataDel['userToken'] = this.userData.userToken;
                    dataDel['data'] = dataTmp;
                    var data = $.extend({}, dataDel);
                    this.http.post('/' + this.userData.appName + 'ApiCO/API/CORRESP/fco0200/deleteData', data).subscribe(
                      (response) => {
                        let alertMessage: any = JSON.parse(JSON.stringify(response));
                        if (alertMessage.result == 0) {
                          this.SpinnerService.hide();
                        } else {
                          this.closebutton.nativeElement.click();
                          this.ngOnInit();
                        }
                      },
                      (error) => { this.SpinnerService.hide(); }
                    )
                  }
                }
              }
              subscription.unsubscribe();
            });

          } else {
            confirmBox.setMessage(productsJson.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success == true) { }
              subscription.unsubscribe();
            });
          }
        }, (error) => { }
      );
    }
  }

  closeWin() {
    if (!window.opener) {
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('ไม่พบหน้าจอหลัก ไม่สามารถปิดหน้าจอได้');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    } else {
      window.close();
    }
  }
}