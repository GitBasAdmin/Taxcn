import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,AfterContentInit,OnDestroy,Injectable   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { ExcelService } from 'src/app/services/excel.service.ts';
// import { ActivatedRoute } from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import { PrintReportService } from 'src/app/services/print-report.service';

// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';

import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';
declare var myExtObject: any;

@Component({
  selector: 'app-fno0910,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fno0910.component.html',
  styleUrls: ['./fno0910.component.css']
})

export class Fno0910Component implements AfterViewInit, OnInit, OnDestroy {
  //form: FormGroup;
  title = 'datatables';

  sessData:any;
  userData:any;
  programName:any;

  result:any = [];
  tmpResult:any = [];
  dataSearch:any = [];


  notice_running:any;
  notice_no:any;
  notice_type_name:any;
  notice_type_id:any;
  notice_form:any;
  noticeType:any=[];

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldNull:any;
  public listFieldType:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public masterSelect: boolean = false;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private excelService: ExcelService,
    private activatedRoute: ActivatedRoute,
    private printReportService: PrintReportService,
  ){ }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 30,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      destroy: true,
      lengthChange : false,
      info : false,
      paging : false,
      searching : false
    };

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    //======================== pcourt ======================================
    var student = JSON.stringify({
      "table_name" : "pnotice_type",
      "field_id" : "notice_type_id",
      "field_name" : "CONCAT(notice_type_name,NVL(notice_printleft,'')) AS fieldnamevalue",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        this.noticeType = getDataOptions;
        this.activatedRoute.queryParams.subscribe(params => {
          console.log(params);
          this.result = [];
          this.result.prun_id = params['run_id'];
          this.result.case_no = params['case_no'];
          this.result.red_no = params['red_no'];
          this.result.notice_form = params['form_xml'];
          this.notice_type_id = params['notice_type_id'];
          this.setDefPage();
        });
      },
      (error) => {}
    )
    this.successHttp();
    
  }

  setDefPage(){
    this.result.sdate = this.result.edate = myExtObject.curDate();
    var typeForm = this.noticeType.filter((x:any) => x.fieldIdValue === parseInt(this.notice_type_id));
    console.log(typeForm)
    if(typeForm.length){
      this.result.notice_type_id = typeForm[0].fieldIdValue;
      this.result.notice_type_name = typeForm[0].fieldNameValue;
    }

      if(this.result.prun_id){
        this.searchData();
      }
    this.masterSelect = false;
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fno0910"
    });
    let promise = new Promise((resolve, reject) => {
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen , {headers:headers})
        .toPromise()
        .then(
          res => { // Success
          let getDataAuthen : any = JSON.parse(JSON.stringify(res));
          console.log(getDataAuthen)
          this.programName = getDataAuthen.programName;
            resolve(res);
          },
          msg => { // Error
            reject(msg);
          }
        );
    });
    return promise;
  }

  checkUncheckAll(obj:any,master:any,child:any) {
    for (var i = 0; i < obj.length; i++) {
      obj[i][child] = this[master];
    }
  }

  isAllSelected(obj:any,master:any,child:any) {
    this[master] = obj.every(function(item:any) {
      return item[child] == true;
    })
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    // Destroy the table first
    dtInstance.destroy();
    // Call the dtTrigger to rerender again
    this.dtTrigger.next(null);
      });}

 ngAfterViewInit(): void {
    this.dtTrigger.next(null);
     }

  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }

    ngAfterContentInit() : void{
      myExtObject.callCalendar();
    }


    ClearAll(){
      window.location.reload();
    }


    CloseWindow(){
        window.close();
    }

    directiveDate(date:any,obj:any){
      this.result[obj] = date;
    }

    
  searchData(){
    if(!this.result.sdate || !this.result.edate){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาระบุวันที่บันทึกตั้งแต่');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          this.SpinnerService.hide();
        }
        subscription.unsubscribe();
      });
    }else{
        var student = JSON.stringify({
          "notice_type_id" : this.notice_type_id,
          "notice_sdate" : this.result.sdate,
          "notice_edate" : this.result.edate,
          "run_id" : this.result.prun_id,
          "userToken" : this.userData.userToken
        });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/getNoticeData', student).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if(productsJson.data.length){
            this.dataSearch = productsJson.data;
            var bar = new Promise((resolve, reject) => {
              this.dataSearch.forEach((x : any ) => x.nRunning = true);
            });
            if(bar){
              this.masterSelect = true;
              this.dtTrigger.next(null);
            }
            //this.result = productsJson.data[0];
            //this.SpinnerService.hide();
          }else{
            this.dataSearch = [];
            this.dtTrigger.next(null);
            /*
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage(productsJson.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                this.SpinnerService.hide();
              }
              subscription.unsubscribe();
            });
            */
          }
        },
        (error) => {}
      )
    }
  }

  
  printWord(type:any){
    
    var notice_running = [];
    var bar2 = new Promise((resolve, reject) => {
      this.dataSearch.forEach((ele, index, array) => {
            if(ele.nRunning == true){
              notice_running.push(this.dataSearch[index].notice_running);
            }
        });
    });
    if(bar2){
      if(type==1){
        var student = JSON.stringify({
          "run_id" : this.result.prun_id,
          "notice_running" : notice_running.toString(),
          "form_size" : '2',
          "pgroup": "3",
          "userToken" : this.userData.userToken
        });
      }else{
        var student = JSON.stringify({
          "run_id" : this.result.prun_id,
          "pgroup": "3",
          "userToken" : this.userData.userToken
        });
      }
      console.log(student)
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      let headers = new HttpHeaders();
       headers = headers.set('Content-Type','application/json');
      this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/openNotice', student , {headers:headers}).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if(productsJson.result==1){
            console.log(productsJson.file)
            myExtObject.OpenWindowMax(productsJson.file);
            //this.searchNotice(1);
          }else{
            confirmBox.setMessage(productsJson.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
              }
              subscription.unsubscribe();
            });
          }
        },
        (error) => {}
      )
    }
  }

}







