import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterContentInit, OnDestroy, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, NgForm } from "@angular/forms";
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay, ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgSelectComponent } from '@ng-select/ng-select';
import { PrintReportService } from 'src/app/services/print-report.service';
// import ในส่วนที่จะใช้งานกับ Observable
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map, catchError } from 'rxjs/operators';
import { ExcelService } from '../../../services/excel.service.ts';
import { ActivatedRoute } from '@angular/router';

import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
declare var myExtObject: any;
//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-fmg5000,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fmg5000.component.html',
  styleUrls: ['./fmg5000.component.css']
})


export class Fmg5000Component implements AfterViewInit, AfterContentInit, OnInit, OnDestroy {
  //form: FormGroup;
  title = 'datatables';
  sessData: any;
  userData: any;
  programName: any;
  deposit: any;
  defaultCaseType: any;
  defaultCaseTypeText: any;
  defaultTitle: any;
  defaultRedTitle: any;
  asyncObservable: Observable<string>;
  result: any = [];
  dataSearch: any = [];
  dataSearch2: any = [];
  myExtObject: any;
  tmpResult: any = [];
  getMonth: any;
  getAllegation: any;
  retPage:any = 'fmg0200';
  chartOptions: any = [];
  dataPoints:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  dtOptions2: DataTables.Settings = {};
  dtTrigger2: Subject<any> = new Subject<any>();

  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private printReportService: PrintReportService,
    private excelService: ExcelService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 30,
      processing: true,
      columnDefs: [{ "targets": 'no-sort', "orderable": false }],
      order: [],
      destroy: true
    };

    this.dtOptions2 = {
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      lengthChange : false,
      info : false,
      paging : false,
      searching : false
    };

    this.sessData = localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

    this.successHttp();

    var student = JSON.stringify({
      "table_name" : "pallegation",
      "field_id" : "alle_running",
      "field_name" : "alle_name",
      "userToken" : this.userData.userToken
    });

    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getAllegation = getDataOptions;
      },
      (error) => {}
    )

    this.getMonth = [{fieldIdValue: 1, fieldNameValue: "มกราคม"},{fieldIdValue: 2, fieldNameValue: "กุมภาพันธ์"},{fieldIdValue: 3,fieldNameValue: "มีนาคม"},
    {fieldIdValue: 4,fieldNameValue: "เมษายน"},{fieldIdValue: 5,fieldNameValue: "พฤษภาคม"},
    {fieldIdValue: 6,fieldNameValue: "มิถุนายน"},{fieldIdValue: 7,fieldNameValue: "กรกฎาคม"},
    {fieldIdValue: 8,fieldNameValue: "สิงหาคม"},{fieldIdValue: 9,fieldNameValue: "กันยายน"},
    {fieldIdValue: 10,fieldNameValue: "ตุลาคม"},{fieldIdValue: 11,fieldNameValue: "พฤศจิกายน"},
    {fieldIdValue: 12,fieldNameValue: "ธันวาคม"}];

    this.setDefaultPage();
  }

  setDefaultPage(){
    this.result.ptype=1;
    this.result.type=1;
  }

  clickSearch(){
    this.result['scase_date'] = myExtObject.curDate();
    this.result['ecase_date'] = myExtObject.curDate();
  }

  // clickSearchGraph(){
  //   this.result['month'] = parseInt(myExtObject.curMonth());
  //   this.result['year'] = parseInt(myExtObject.curYear());
  // }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    var authen = JSON.stringify({
      "userToken": this.userData.userToken,
      "url_name" : "fmg5000"
    });
    let promise = new Promise((resolve, reject) => {
      this.http.post('/' + this.userData.appName + 'Api/API/authen', authen, { headers: headers })
        .toPromise()
        .then(
          res => { // Success
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
      this.dtTrigger2.next(null);
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
    this.dtTrigger2.next(null);
  }

  ngAfterContentInit(): void {
    myExtObject.callCalendar();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.dtTrigger2.unsubscribe();
  }

  searchData(type:any) {
    if (type==3 && !this.result.scase_date && !this.result.ecase_date) {
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('ป้อนเงื่อนไขเพื่อค้นหา');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { this.SpinnerService.hide(); }
        subscription.unsubscribe();
      });
    } else {
      if(type==1){
        var student = JSON.stringify({
          "search_type" : type,
          "userToken" : this.userData.userToken
        });   

      }else if(type==2){
        var student = JSON.stringify({
          "search_type" : type,
          "userToken" : this.userData.userToken
        }); 

      }else if(type==3){
        var student = JSON.stringify({
          "search_type" : this.result.search_type,
          "scase_date" : this.result.scase_date,
          "ecase_date" : this.result.ecase_date,
          "userToken" : this.userData.userToken
        }); 
      }
        this.result.type = 1;
        this.SpinnerService.show();
        console.log(type,student);
        this.http.post('/' + this.userData.appName + 'ApiMG/API/MANAGEMENT/fmg5000', student).subscribe(
          (response) => {
          let productsJson: any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          
          if (productsJson.result == 1) {
            this.dataSearch = [];
            
            var bar = new Promise((resolve, reject) => {
              productsJson.data.forEach((ele, index, array) => {
                if (ele.deposit != null) {
                  productsJson.data[index]['deposit_comma'] = this.curencyFormat(ele.deposit, 2);
                }
              });
            });
            if (bar) {
              this.dataSearch = productsJson.data;
              this.deposit = this.curencyFormat(productsJson.deposit, 2);
              // this.rerender();
              this.SpinnerService.hide();
            }
          } else {
            this.dataSearch = [];
            this.deposit = 0;
            // this.rerender();
            this.SpinnerService.hide();
          }          
        },
        (error) => { }
      )
    }    
  }

  curencyFormat(n: any, d: any) {
    return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  }

  addComma(n: any, d: any) {
    return n.replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  }

  directiveDate(date: any, obj: any) {
    this.result[obj] = date;
  }

  //โจทก์  จำเลย ทั้งหมด
  printReport(type:any,run_id:any) {
    var rptName = 'rca3000';
    var paramData ='{}';

    var paramData = JSON.stringify({
      "prun_id" : run_id.toString(),
      "plit_type" : type,
    });
    console.log(paramData);
    this.printReportService.printReport(rptName,paramData);
  }

  printGraph(type:any) {
    if(type==4 && (!this.result.start_date || !this.result.end_date)){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาระบุวันที่ที่ต้องการค้นหา');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    } else {
      this.result.type='';
      this.chartOptions=[];
      this.dataSearch2=[];

      var type_desc:any="";
      if(type==1){
        type_desc="วันที่ "+myExtObject.curDate();

      }else if(type==2){
        type_desc="ประจำเดือน"+this.getMonth.find((x: any) => x.fieldIdValue === parseInt(myExtObject.curMonth())).fieldNameValue;

      }else if(type==3){
        type_desc="ประจำปี "+myExtObject.curYear();

      }else if(type==4){
        type_desc="ตั้งแต่วันที่ "+this.result.start_date+" ถึงวันที่ "+this.result.end_date;
      }

      var student = JSON.stringify({
        "search_type" : type,
        "start_date" : this.result.start_date ? this.result.start_date : '',
        "end_date" : this.result.end_date ? this.result.end_date : '',
        "userToken" : this.userData.userToken
      });  
      this.http.post('/' + this.userData.appName + 'ApiMG/API/MANAGEMENT/fmg5000/getGraphData', student).subscribe(
        (response) => {
        let productsJson: any = JSON.parse(JSON.stringify(response));
        console.log(productsJson)
        if (productsJson.result == 1) {
          this.result.type=2;          
          this.chartOptions = {
            title: {
              text: "ข้อมูลตามข้อหา "+type_desc
            },
            animationEnabled: true,
            // exportEnabled: true,
            axisY: {
              includeZero: true
            },
            data: [{
              type: "column", 
              indexLabel: "{y}", 
              indexLabelFontColor: "#5A5757",
              dataPoints: productsJson.data
            }]
          };
          //$('#chartId').find('.canvasjs-chart-credit').css('display','none');
          //ตาราง
          this.dataSearch2 = productsJson.data;
          this.dataSearch2.forEach((ele, index, array) => {
            ele.tmp = this.curencyFormat(ele.y,2);
            ele.tmp = ele.tmp.split(".");
            ele.case_data = ele.tmp[0];
          });
        }
      },
      (error) => { } )
    }
  }

  retToPage(run_id:any){
    let winURL = this.authService._baseUrl.substring(0,this.authService._baseUrl.indexOf("#")+1)+'/'+this.retPage;
    myExtObject.OpenWindowMax(winURL+'?run_id='+run_id);
  }
}