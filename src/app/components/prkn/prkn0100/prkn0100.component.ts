import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,AfterContentInit,OnDestroy,Injectable,ViewChildren, QueryList,Output,EventEmitter   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { ExcelService } from 'src/app/services/excel.service.ts';
import { PrintReportService } from 'src/app/services/print-report.service';
// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';
import {
  CanActivate, Router,ActivatedRoute,NavigationStart,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  NavigationError,Routes
} from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';

declare var myExtObject: any;
//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-prkn0100,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prkn0100.component.html',
  styleUrls: ['./prkn0100.component.css']
})


export class Prkn0100Component implements AfterViewInit, OnInit, OnDestroy {
  //form: FormGroup;
  title = 'datatables';
  sessData:any;
  userData:any;
  programName:any;
  programId:any;
  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;

  result:any = [];
  tmpResult:any = [];
  dataSearch:any = [];
  dataSearchTmp:any = [];
  myExtObject:any;

  getDep:any;
  pdep_code:any;
  ptype:any;
  masterTmp:any;
  

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  //@ViewChild('fca0200',{static: true}) fca0200 : ElementRef;
  //@ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  public loadModalComponent: boolean = false;
  public loadModalJudgeComponent: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private excelService: ExcelService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private printReportService: PrintReportService
  ){ }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 30,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      destroy: true,
    };

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.dataSearch.deposit = "0.00";
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');

    this.activatedRoute.queryParams.subscribe(params => {
      if(typeof params['ptype'] =='undefined'){
        this.result.ptype = 1;
      }else{
        this.result.ptype = params['ptype'];
      }
    });
     //======================== pcase_type ======================================
     var student = JSON.stringify({
      "table_name" : "pdepartment",
      "field_id" : "dep_code",
      "field_name" : "dep_name",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getDep = getDataOptions;
        this.getDep.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
      },
      (error) => {}
    )




      this.successHttp();
      this.setDefPage();
  }

  setDefPage(){
    this.result.event_date = myExtObject.curDate();
    this.result.porder = '1';
    this.result.pposition = 1;
    this.result.run_yy = myExtObject.curYear();
    this.searchData();
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "prkn0100"
    });

    let promise = new Promise((resolve, reject) => {
      //let apiURL = `${this.apiRoot}?term=${term}&media=music&limit=20`;
      //this.http.get(apiURL)
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen , {headers:headers})
        .toPromise()
        .then(
          res => { // Success
          //this.results = res.json().results;
          let getDataAuthen : any = JSON.parse(JSON.stringify(res));
          console.log(getDataAuthen)
          this.programName = getDataAuthen.programName;
          this.programId = getDataAuthen.programId;
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
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      if(dtElement.dtInstance)
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();          
      });
    });
    this.dtTrigger.next(null);
  }

 ngAfterViewInit(): void {
    this.dtTrigger.next(null);
     }

  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }

    ngAfterContentInit() : void{
      this.result.cFlag = 1;
      myExtObject.callCalendar();
    }

    loadMyModalComponent(){
      this.loadComponent = false;
      this.loadModalComponent = true;
      $("#exampleModal").find(".modal-body").css("height","100px");
    }

    loadTableComponent(val:any){
      this.loadModalComponent = false;
      this.loadComponent = true;
      this.loadModalJudgeComponent = false;
      // this.loadModalJudgeComponent = true;
      $("#exampleModal").find(".modal-body").css("height","auto");
    }

    tabChangeSelect(objName:any,objData:any,event:any,type:any){
      if(typeof objData!='undefined'){
        if(type==1){
          var val = objData.filter((x:any) => x.fieldIdValue === event.target.value) ;
        }else{
          var val = objData.filter((x:any) => x.fieldIdValue === event);
        }
        console.log(objData)
        //console.log(event.target.value)
        //console.log(val)
        if(val.length!=0){
          this.result[objName] = val[0].fieldIdValue;
          this[objName] = val[0].fieldIdValue;
        }else{
          this.result[objName] = null;
          this[objName] = null;
        }
      }
    }

    tabChangeInput(name:any,event:any){
      let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
        if(name=='judge_id1' || name=='judge_id2' || name=='case_judge_id'){
        var student = JSON.stringify({
          "table_name" : "pjudge",
          "field_id" : "judge_id",
          "field_name" : "judge_name",
          "condition" : " AND judge_id='"+event.target.value+"'",
          "userToken" : this.userData.userToken
        });
        console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
          (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));

            if(productsJson.length){
              if(name=='judge_id1'){
                this.result.judge_name1 = productsJson[0].fieldNameValue;
              }else if(name=='judge_id2'){
                this.result.judge_name2 = productsJson[0].fieldNameValue;
              }else if(name=='case_judge_id'){
                this.result.case_judge_name = productsJson[0].fieldNameValue;
              }

            }else{
              if(name=='judge_id1'){
                this.result.judge_id1 = null;
                this.result.judge_name1 = '';
              }else if(name=='judge_id2'){
                this.result.judge_id2 = null;
                this.result.judge_name2 = '';
              }else if(name=='case_judge_id'){
                this.result.case_judge_id = null;
                this.result.case_judge_name = '';
              }
            }
          },
          (error) => {}
        )
      }else if(name=='result_id'){
        var student = JSON.stringify({
          "table_name" : "pjudge_result",
          "field_id" : "result_id",
          "field_name" : "result_desc",
          "condition" : " AND result_id='"+event.target.value+"' AND case_type='"+this.result.case_type+"'",
          "userToken" : this.userData.userToken
        });
        console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
          (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));

            if(productsJson.length){
              this.result.result_desc = productsJson[0].fieldNameValue;

            }else{

              this.result.result_id = '';
              this.result.result_desc = '';
            }
          },
          (error) => {}
        )
      }
    }

    filterData(){
      console.log(this.dataSearchTmp)
      if(this.dataSearchTmp.length){
        var dataFilter = $.extend([],this.dataSearchTmp);
        this.dataSearch = dataFilter.filter((x:any) => x.event_type === parseInt(this.result.ptype));
        console.log(this.dataSearch)
        this.rerender();
      }
    }

    searchData(){      
      var jsonTmp = {};
      if(this.result.run_no && this.result.run_yy){
        jsonTmp['run_no'] = this.result.run_no;
        jsonTmp['run_yy'] = this.result.run_yy;
      }
      if(this.result.ptype)
        jsonTmp['ptype'] = this.result.ptype;
      if(this.result.porder)
        jsonTmp['porder'] = this.result.porder;
      //jsonTmp['pdep_code'] = this.result.pdep_code;
      jsonTmp['userToken'] = this.userData.userToken;
      this.searchDataApi(jsonTmp,0);
      console.log(jsonTmp)
      /*  
        if(type==1){
            var jsonTmp = {};
            if(this.result.ptype)
              jsonTmp['ptype'] = this.result.ptype;
            if(this.result.porder)
              jsonTmp['porder'] = this.result.porder;
            if(this.result.pdep_code)
              jsonTmp['pdep_code'] = this.result.pdep_code;
            jsonTmp['userToken'] = this.userData.userToken;
            this.searchDataApi(jsonTmp,0);
            console.log(jsonTmp)
        }else{
          if(!this.result.run_no || !this.result.run_yy){
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage('กรุณาระบุเลขที่อ้างอิงให้ครบถ้วน');
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){}
              subscription.unsubscribe();
            });
          }else{
            var jsonTmp = {};
            jsonTmp['run_no'] = this.result.run_no;
            jsonTmp['run_yy'] = this.result.run_yy;
            if(this.result.ptype)
              jsonTmp['ptype'] = this.result.ptype;
            if(this.result.porder)
              jsonTmp['porder'] = this.result.porder;
            jsonTmp['pdep_code'] = this.result.pdep_code;
            jsonTmp['userToken'] = this.userData.userToken;
            this.searchDataApi(jsonTmp,1);
            console.log(jsonTmp)
          }
        }
        */
    }

    getRecData(index:any){
      //
      var jsonTmp = {};
      var runNo = this.dataSearch[index].master_run_no.split("/");
      jsonTmp['run_no'] = runNo[0];
      jsonTmp['run_yy'] = runNo[1];
      if(this.dataSearch[index].event_type){
        jsonTmp['ptype'] = this.dataSearch[index].event_type;
      }
      if(this.result.porder)
        jsonTmp['porder'] = this.result.porder;
      jsonTmp['userToken'] = this.userData.userToken;
      this.searchDataApi(jsonTmp,1);
      console.log(jsonTmp)
    }

    searchDataApi(json:any,type:any){
      if(this.result.ptype){
        this.SpinnerService.show();
        var student = json;
        console.log(student)
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
        this.http.post('/'+this.userData.appName+'ApiKN/API/KEEPN/prkn0100/getHistoricalData', student , {headers:headers}).subscribe(
          (response) =>{
              let productsJson : any = JSON.parse(JSON.stringify(response));
              console.log(productsJson);
              if(productsJson.data.length){
                this.dataSearch = productsJson.data;
                this.dataSearchTmp = productsJson.data;
                this.masterTmp = $.extend({},productsJson.data[0]);
                
                if(type==1){
                  var runNo = this.dataSearch[0].master_run_no.split("/");
                  this.result.run_no = runNo[0];
                  this.result.run_yy  = runNo[1];
                  this.result.master_running = this.dataSearch[0].master_running;
                  if(this.dataSearch[0].event_type){
                    this.result.ptype = this.dataSearch[0].event_type;
                  }
                }else{
                  if(student.run_no && student.run_yy)
                    this.result.master_running = this.dataSearch[0].master_running;
                }
                this.rerender();
              }else{
                this.dataSearch = [];
                this.result.master_running = '';
                this.rerender();
              }
              this.SpinnerService.hide();
          },
          (error) => {}
        )
      }
    }

    curencyFormat(n:any,d:any) {
      return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    }

    directiveDate(date:any,obj:any){
      this.result[obj] = date;
    }


    closeWin(){
      window.close();
    }

    printReport(type:any){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      console.log(this.masterTmp)
      var rptName = 'rkn0100';
      var paramData ='{}';
      var run_no = '';
      var run_yy  = '';
      if(this.result.run_no && this.result.run_yy){
          run_no = this.result.run_no;
          run_yy  = this.result.run_yy;
      }
      if(!this.result.master_running){
        var dep_code = (this.result.pdep_code) ? this.result.pdep_code : '';
        
        if(type==1){
          var paramData = JSON.stringify({
            "url_name" : "prkn0100",
            "url" : "prkn0100",
            "sesCourtId" : this.userData.courtId,
            "event_date" : myExtObject.conDate(myExtObject.curDate()),
            "run_no" : run_no,
            "run_yy" : run_yy,
            "master_running" : '',
            "prog_id" : this.programId,
            "ptype" : this.result.ptype,
            "pno_from" : '',
            "pno_to" : '',
            "prun_id" : '',
            "pjudge_id" : '',
            "porder" : this.result.porder,
            "pdep_code" : '',
            "dep_name" : this.userData.depName,
            "pdep_name" : '',
            "puser_id" : this.userData.userCode,
            "pdep_id" : this.userData.depCode,
            "pposition" : this.result.pposition,
            "psize" : 1,
            "pevent_date" : myExtObject.conDate(myExtObject.curDate()),
            "pmaster_running" : '',
            "pflag" : 0
          });
        }else{
          var paramData = JSON.stringify({
            "url_name" : "prkn0100",
            "url" : "prkn0100",
            "sesCourtId" : this.userData.courtId,
            "event_date" : myExtObject.conDate(myExtObject.curDate()),
            "run_no" : run_no,
            "run_yy" : run_yy,
            "master_running" : '',
            "prog_id" : this.programId,
            "ptype" : this.result.ptype,
            "pno_from" : '',
            "pno_to" : '',
            "prun_id" : '',
            "pjudge_id" : '',
            "porder" : this.result.porder,
            "pdep_code" : '',
            "dep_name" : this.userData.depName,
            "pdep_name" : '',
            "puser_id" : this.userData.userCode,
            "pdep_id" : this.userData.depCode,
            "pposition" : this.result.pposition,
            "psize" : 2,
            "pevent_date" : myExtObject.conDate(myExtObject.curDate()),
            "pmaster_running" : '',
            "pflag" : 0
          });
        }
      }else{

        // For set parameter to report
        var dep_code = (this.result.pdep_code) ? this.result.pdep_code : '';
        if(type==1){
          var paramData = JSON.stringify({
            "url_name" : "prkn0100",
            "url" : "prkn0100",
            "sesCourtId" : this.userData.courtId,
            "event_date" : myExtObject.conDate(this.masterTmp.event_date),
            "run_no" : run_no,
            "run_yy" : run_yy,
            "master_running" : this.result.master_running,
            "prog_id" : this.programId,
            "ptype" : this.result.ptype,
            "pno_from" : '',
            "pno_to" : '',
            "prun_id" : '',
            "pjudge_id" : '',
            "porder" : this.result.porder,
            "pdep_code" : '',
            "dep_name" : this.userData.depName,
            "pdep_name" : '',
            "puser_id" : this.userData.userCode,
            "pdep_id" : this.userData.depCode,
            "pposition" : this.result.pposition,
            "psize" : 1,
            "pevent_date" : myExtObject.conDate(this.masterTmp.event_date),
            "pmaster_running" : this.result.master_running,
            "pflag" : 0
          });
        }else{
          var paramData = JSON.stringify({
            "url_name" : "prkn0100",
            "url" : "prkn0100",
            "sesCourtId" : this.userData.courtId,
            "event_date" : myExtObject.conDate(this.masterTmp.event_date),
            "run_no" : run_no,
            "run_yy" : run_yy,
            "master_running" : this.result.master_running,
            "prog_id" : this.programId,
            "ptype" : this.result.ptype,
            "pno_from" : '',
            "pno_to" : '',
            "prun_id" : '',
            "pjudge_id" : '',
            "porder" : this.result.porder,
            "pdep_code" : '',
            "dep_name" : this.userData.depName,
            "pdep_name" : '',
            "puser_id" : this.userData.userCode,
            "pdep_id" : this.userData.depCode,
            "pposition" : this.result.pposition,
            "psize" : 2,
            "pevent_date" : myExtObject.conDate(this.masterTmp.event_date),
            "pmaster_running" : this.result.master_running,
            "pflag" : 0
          });
        }
      }
        console.log(paramData)
        // alert(paramData);return false;
        this.printReportService.printReport(rptName,paramData);
    }
}







