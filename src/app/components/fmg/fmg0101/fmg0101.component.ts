import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,ViewEncapsulation   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap'; 
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';

// import ในส่วนที่จะใช้งานกับ Observable
import { of, Observable, Subscription,Subject, Subscriber } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';

import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import { NgbModal, NgbModalRef   } from '@ng-bootstrap/ng-bootstrap';
import { ModalAppointmentJudgeComponent } from '@app/components/modal/modal-appointment-judge/modal-appointment-judge.component';
import * as $ from 'jquery';
declare var myExtObject: any;

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-fmg0101,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fmg0101.component.html',
  styleUrls: ['./fmg0101.component.css']
})


export class Fmg0101Component implements AfterViewInit, OnInit, OnDestroy {
  //form: FormGroup;
  title = 'datatables';
  myExtObject: any;
  posts:any;
  search:any;
  masterSelected:boolean;
  checklist:any;
  checkedList:any;
  delValue:any;
  sessData:any;
  userData:any;
  programName:any;
  result:any;
  getAppTable:any;
  getMonthTh:any;
  tableApiData:any;

  dtOptions: DataTables.Settings = {};
  dtOptions2: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 
  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private ngbModal: NgbModal,
  ){                 

  }


   
  ngOnInit(): void {
    this.dtOptions2 = {
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[[2,'asc']],
      lengthChange : false,
      info : false,
      paging : false,
      searching : false
    };

    
    
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.getMonthTh = [{"fieldIdValue": '01', "fieldNameValue": "มกราคม"},{"fieldIdValue": '02', "fieldNameValue": "กุมภาพันธ์"},{"fieldIdValue": '03',"fieldNameValue": "มีนาคม"},{ "fieldIdValue": '04',"fieldNameValue": "เมษายน"},{"fieldIdValue": '05',"fieldNameValue": "พฤษภาคม"},{"fieldIdValue": '06',"fieldNameValue": "มิถุนายน"},{"fieldIdValue": '07',"fieldNameValue": "กรกฎาคม"},{"fieldIdValue": '08',"fieldNameValue": "สิงหาคม"},{"fieldIdValue": '09',"fieldNameValue": "กันยายน"},{"fieldIdValue": '10',"fieldNameValue": "ตุลาคม"},{"fieldIdValue": '11',"fieldNameValue": "พฤศจิกายน"},{"fieldIdValue": '12',"fieldNameValue": "ธันวาคม"}];
      
      this.successHttp();
      this.setDefPage();
  }

  setDefPage(){
    this.result = [];
    this.result.assign_type = 0;
    this.result.month = myExtObject.curMonth();
    this.result.year = myExtObject.curYear();
    this.getAppointTable();
  }
  getAppointTable(){
    var student = JSON.stringify({
      "table_name" : "pappoint_table",
      "field_id" : "table_id",
      "field_name" : "table_name",
      "condition" : " AND table_type='1'",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        getDataOptions.unshift({fieldIdValue:0,fieldNameValue: 'ทั้งหมด'});
        this.getAppTable = getDataOptions;
        this.result.day_flag = getDataOptions[0].fieldIdValue;
      },
      (error) => {}
    )
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fmg0101"
    });
    let promise = new Promise((resolve, reject) => {
      //let apiURL = `${this.apiRoot}?term=${term}&media=music&limit=20`;
      //this.http.get(apiURL)
      this.http.disableLoading().post('/'+this.userData.appName+'Api/API/authen', authen , {headers:headers})
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

    assignFlag(event:any){
      //console.log(event)
    }

    searchData(){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      if(!this.result.month){
        confirmBox.setMessage('กรุณาเดือนสำหรับการค้นหา');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
      }else if(!this.result.year){
        confirmBox.setMessage('กรุณาปีสำหรับการค้นหา');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
      }else{
        var student = JSON.stringify({
          "month" : this.result.month,
          "year" : this.result.year,
          "assign_type" : this.result.assign_type,
          "day_flag" : this.result.day_flag,
          "userToken" : this.userData.userToken
        });
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiMG/API/MANAGEMENT/fmg0101/getData', student ).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            console.log(getDataOptions)
            if(getDataOptions.result==1){
              this.tableApiData = getDataOptions.data;
              let winURL = window.location.href.split("/#/")[0]+"/#/";
              /*
                    setTimeout(() => {
                      $("body").find("table.appTable").find("tr td span.modalApp").each(function(){
                        $(this).css({'color':'blue','cursor':'pointer'});
                        //$(this).attr("onclick","window.open('"+winURL+"fmg0200?run_id="+$(this).attr("class").split(' ')[1]+"',1,'height="+(screen.height-125)+",width="+(screen.width-100)+",resizable,scrollbars,status')")
                      })
                    }, 1000);
              */
                    setTimeout(() => {
                      const spanEl = document.querySelectorAll<HTMLSpanElement>(".modalApp");
                      //console.log(spanEl)
                      var modal = this.ngbModal;
                      for (let i = 0; i < spanEl.length; i++) {
                        spanEl[i].style.color = 'blue';
                        spanEl[i].style.cursor = 'pointer';
                        spanEl[i].addEventListener("click", event =>  {
                          const modalRef: NgbModalRef = modal.open(ModalAppointmentJudgeComponent,{ windowClass: 'my-class'})
                          modalRef.componentInstance.judge_id = event.target['classList'][1]
                          modalRef.componentInstance.date_appoint = this.pad(event.target['classList'][2], 2,'')+'/'+this.result.month+'/'+this.result.year
                        });
                      }
                    }, 1000);
            }else{
                confirmBox.setMessage(getDataOptions.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){}
                  subscription.unsubscribe();
                });
            }
  
          },
          (error) => {}
        )
      }
    }

    
    pad(n:any, width:any, z:any) {
      z = z || '0';
      n = n + '';
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    fmg0101Print(htmlData:any){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      if(!this.result.month){
        confirmBox.setMessage('กรุณาเดือนสำหรับการค้นหา');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
      }else if(!this.result.year){
        confirmBox.setMessage('กรุณาปีสำหรับการค้นหา');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
      }else{
        var student = JSON.stringify({
          "month" : this.result.month,
          "year" : this.result.year,
          "assign_type" : this.result.assign_type,
          "day_flag" : this.result.day_flag
        });
        console.log(student)
        let winURL = window.location.href.split("/#/")[0]+"/#/";
        var name = 'fmg0101_print';
        myExtObject.OpenWindowMaxName(winURL+'fmg0101_print?month='+this.result.month+'&year='+this.result.year+'&assign_type='+this.result.assign_type+'&day_flag='+this.result.day_flag,name);
      }
      
    }
  
}








