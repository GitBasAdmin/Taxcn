import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable   } from '@angular/core';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";

import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import {ActivatedRoute} from '@angular/router';
import {Subject} from 'rxjs';
import * as $ from 'jquery';
import { PrintReportService } from 'src/app/services/print-report.service';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';

//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
declare var myExtObject: any;

@Component({
  selector: 'app-prfn1200,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prfn1200.component.html',
  styleUrls: ['./prfn1200.component.css']
})


export class Prfn1200Component implements AfterViewInit, OnInit, OnDestroy {
  myExtObject :any;
  sessData:any;
  userData:any;
  programName:any;
  items:any = [];
  itemTmp:any = [];
  run_id:any;
  receipt_running:any;
  print_flag:any;

  public loadComponent: boolean = false;
  masterSelect:boolean = false;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;

  constructor(
    private http: HttpClient,
    private printReportService: PrintReportService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
  ){  }

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
      if(params['run_id']){
        this.run_id = params['run_id'];
        this.receipt_running = params['receipt_running'];
        this.print_flag = params['pprint_flag'];
        this.searchData();
      }else if(params['receipt_running']){
        this.run_id = 0;
        this.receipt_running = params['receipt_running'];
        this.print_flag = params['pprint_flag'];
        this.searchData();
      }
    });
    
    this.successHttp();
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "prfn1200"
    });
    let promise = new Promise((resolve, reject) => {
      //let apiURL = `${this.apiRoot}?term=${term}&media=music&limit=20`;
      //this.http.get(apiURL)
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen , {headers:headers})
        .toPromise()
        .then(
          res => { 
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

  searchData(){
    if(this.run_id || this.receipt_running){
      if(this.run_id){
        var student = JSON.stringify({
          "run_id" : this.run_id,
          "userToken" : this.userData.userToken
        });
      }else if(this.receipt_running){
        var student = JSON.stringify({
          "receipt_running" : this.receipt_running,
          "userToken" : this.userData.userToken
        });
      }
      console.log(student)
        this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/ffn0400/getReceiptData', student ).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          if(getDataOptions.result==1){
          
            this.items = getDataOptions.data;
            //this.items.forEach((x : any ) => x.rRunning = false);
            for (var x = 0; x < this.items.length; x++) {
              if(this.items[x]['receipt_running']==this.receipt_running){
                this.items[x].rRunning = true;
              }else{
                this.items[x].rRunning = false;
              }
            }
            //this.items[0].rRunning = true;
            this.itemTmp = JSON.parse(JSON.stringify(this.items));
            this.dtTrigger.next(null);
          }else{
            this.items = [];
            this.dtTrigger.next(null);
          }
        },
        (error) => {}
      )
    }else{
      this.items = [];
      this.dtTrigger.next(null);
    }
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
    //this.dtTrigger.next(null);
     }

  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }

    ClearAll(){
      window.location.reload();
    }


    printReport(){
      var del = [];
      var bar = new Promise((resolve, reject) => {
        this.items.forEach((ele, index, array) => {
          if(ele.rRunning == true){
            del.push(ele.receipt_running);
          }
        });
      });
      console.log(del)
      if(bar){
        if(!del.length){
          const confirmBox = new ConfirmBoxInitializer();
          confirmBox.setTitle('ข้อความแจ้งเตือน');
          confirmBox.setMessage('กรุณาคลิกเลือกข้อมูลที่ต้องการพิมพ์');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){
              //this.SpinnerService.hide();
            }
            subscription.unsubscribe();
          });
        }else{
          if(del.length==1){
            var rptName = 'rffn1200';
            var paramData = JSON.stringify({
              "preceipt_running" : del[0],
            });
          }else{
            var rptName = 'rffn1210';
            var paramData = JSON.stringify({
              "preceipt_running" : del.toString(),
            });
          }
          console.log(paramData)
          this.printReportService.printReport(rptName,paramData);
        }
      }

      
      
    }

    curencyFormat(n:any,d:any) {
      return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    }
    curencyFormatRemove(val: number): string {
      //console.log(val)
      if (val !== undefined && val !== null) {
        return val.toString().replace(/,/g, "");
      } else {
        return '';
      }
    }

    refreshPage(){
      window.location.reload();
    }


}






