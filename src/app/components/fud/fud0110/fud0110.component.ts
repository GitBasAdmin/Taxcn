import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,AfterContentInit,OnDestroy,Injectable,ViewChildren, QueryList,Output,EventEmitter   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { ExcelService } from 'src/app/services/excel.service.ts';
import { PrintReportService } from 'src/app/services/print-report.service';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
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
  selector: 'app-fud0110',
  templateUrl: './fud0110.component.html',
  styleUrls: ['./fud0110.component.css']
})


export class Fud0110Component implements AfterViewInit, OnInit, OnDestroy {
  //form: FormGroup;
  title = 'datatables';
  sessData:any;
  userData:any;
  programName:any;
  programId:any;

  result:any = [];
  tmpResult:any = [];
  appealData:any = [];
  myExtObject:any;
  modalType:any;
  delIndex:any;

  getDep:any;
  pdep_code:any;
  ptype:any;
  masterTmp:any;
  getAssign:any;
  run_id:any;
  send_item:any;
  appeal_running:any;
  getLitType:any;
  viewInit:any;

  getPostHead:any;
  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;
  public loadModalJudgeComponent : boolean = false;
  public loadModalLitComponent : boolean = false;
  public loadModalConfComponent : boolean = false;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

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
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      lengthChange : false,
      info : false,
      paging : false,
      searching : false,
      destroy : true,
    };

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

    this.activatedRoute.queryParams.subscribe(params => {
      this.run_id = params['run_id'];
      this.appeal_running = params['appeal_running'];
    });

      this.successHttp();
      this.setDefPage();
  }

  setDefPage(){
    this.result=[];
    this.getData();
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fud0110"
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
            resolve(res);
          },
          msg => { // Error
            reject(msg);
          }
        );
    });
    return promise;
  }


  getData(){
    var student = JSON.stringify({
      "run_id" : this.run_id,
      "appeal_running" : this.appeal_running,
      "in_out" : "1",
      "userToken" : this.userData.userToken
    });
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUD/API/APPEAL/fud0110/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        if(getDataOptions.result==1){
            //-----------------------------//
            if(getDataOptions.data.length){
              this.appealData = getDataOptions.data;
              this.appealData.forEach((x : any ) => x.aRunning = false);
              console.log(88)
              if(this.viewInit)
                this.dtTrigger.next(null);
            }else{
              this.appealData = [];
              if(this.viewInit)
                this.dtTrigger.next(null);
            }
            //-----------------------------//
        }else{
          //-----------------------------//
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage(getDataOptions.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){}
              subscription.unsubscribe();
            });
          //-----------------------------//
        }

      },
      (error) => {}
    )
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
    this.viewInit = 1;
    console.log(99);
     }

  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }

    ngAfterContentInit() : void{
      this.result.cFlag = 1;
      myExtObject.callCalendar();
    }


    closeWin(){
      let winURL = window.location.href.split("/#/")[0]+"/#/";
      if(this.run_id && this.appeal_running){
        var url = 'fud0100?run_id='+this.run_id+'&appeal_running='+this.appeal_running;
        window.opener.myExtObject.openerReloadUrl(url);
      }else
        window.opener.myExtObject.openerReloadUrl('fud0100');
      window.close();
    }

    cancelPage(){

    }


    printReport(type:any){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
          if(type==1){
              var rptName = 'rap2100';
              // For no parameter : paramData ='{}'
              var paramData ='{}';
              // rap2100.jsp?pcourt_running=107&prun_id=150662&papp_seq=
                var paramData = JSON.stringify({
                  "pcourt_running" : this.userData.courtRunning,
                  "prun_id" : this.run_id,
                });
                console.log(paramData)
                // alert(paramData);return false;
                this.printReportService.printReport(rptName,paramData);

          }

    }

    saveData(){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      var dataSave = [],dataTmp=[];
      dataSave['appeal_running'] = this.appeal_running;
      dataSave['userToken'] = this.userData.userToken;
      var bar = new Promise((resolve, reject) => {
        this.appealData.forEach((ele, index, array) => {
            if(ele.aRunning == true){
              dataTmp.push(this.appealData[index]);
            }
        });
      });
      
      if(bar){
        if(!dataTmp.length){
          confirmBox.setMessage('กรุณาคลิกเลือกรายการที่ต้องการจัดเก็บ');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){}
            subscription.unsubscribe();
          });
        }else{
          dataSave['data'] = dataTmp;
          var data = $.extend({}, dataSave);
          console.log(data)
          this.http.post('/'+this.userData.appName+'ApiUD/API/APPEAL/fud0110/saveData', data ).subscribe(
            (response) =>{
              let getDataOptions : any = JSON.parse(JSON.stringify(response));
              console.log(getDataOptions)
              if(getDataOptions.result==1){
                  //-----------------------------//
                  confirmBox.setMessage(getDataOptions.error);
                  confirmBox.setButtonLabels('ตกลง');
                  confirmBox.setConfig({
                      layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                  });
                  const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                    if (resp.success==true){
                      this.closeWin();
                    }
                    subscription.unsubscribe();
                  });
                  //-----------------------------//
              }else{
                //-----------------------------//
                  confirmBox.setMessage(getDataOptions.error);
                  confirmBox.setButtonLabels('ตกลง');
                  confirmBox.setConfig({
                      layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                  });
                  const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                    if (resp.success==true){
                    }
                    subscription.unsubscribe();
                  });
                  
                //-----------------------------//
              }
    
            },
            (error) => {}
          )
        }
        
      }
      
      
      
    }



}







