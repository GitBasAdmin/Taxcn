import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,AfterContentInit,ViewChildren, QueryList   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';

// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';

import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
declare var myExtObject: any;
//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-fsn0900,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fsn0900.component.html',
  styleUrls: ['./fsn0900.component.css']
})


export class Fsn0900Component implements AfterViewInit, OnInit, OnDestroy,AfterContentInit {
  getInOut:any;selInOut:any;
  getSendBy:any;selSendBy:any;

  sessData:any;
  userData:any;
  programName:any;

  myExtObject: any;
  result:any= [];
  items:any= [];
  getReceive:any;
  getSent:any;
  receive_off_id:any;
  off_id:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService
  ){ }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 30,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
    };

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    //======================== psentnotice_officer ======================================
    var student = JSON.stringify({
      "table_name" : "psentnotice_officer",
      "field_id" : "off_id",
      "field_name" : "off_name",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        this.getSent = getDataOptions;
        
      },
      (error) => {}
    )
    //======================== psentnotice_officer ======================================
    var student = JSON.stringify({
      "table_name" : "pofficer",
      "field_id" : "off_id",
      "field_name" : "off_name",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getReceive = getDataOptions;
        
      },
      (error) => {}
    )
    //======================== pnotice_send_by ======================================
    var student = JSON.stringify({
      "table_name" : "pnotice_send_by",
      "field_id" : "send_by",
      "field_name" : "send_by_desc",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getSendBy = getDataOptions;
        //this.selSendBy = 2;
      },
      (error) => {}
    )

    this.getInOut = [{fieldIdValue:0,fieldNameValue: ''},{fieldIdValue:1,fieldNameValue: 'ในเขต'},{fieldIdValue:2,fieldNameValue: 'ข้ามเขต'}];
    this.selInOut = this.getInOut.find((x:any) => x.fieldIdValue === 0).fieldNameValue

    //this.getSendBy = [{fieldIdValue:0,fieldNameValue: ''},{fieldIdValue:1,fieldNameValue: '1.ไปรษณีย์'},{fieldIdValue:2,fieldNameValue: '2.เจ้าหน้าที่'},{fieldIdValue:3,fieldNameValue: '3.คู่ความส่งเอง'},{fieldIdValue:4,fieldNameValue: '4.หนังสือนำส่ง'}];
    //this.selSendBy = this.getSendBy.find((x:any) => x.fieldIdValue === 2).fieldNameValue
    
      //this.asyncObservable = this.makeObservable('Async Observable');
      this.successHttp();
  }

  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fsn0900"
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
    myExtObject.callCalendar();
  }

  directiveDate(date:any,obj:any){
    this.result[obj] = date;
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
      }
    }else{
      this.result[objName] = null;
      this[objName] = null;
    }
  }

  searchData(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!this.result.sdate || !this.result.edate){
      confirmBox.setMessage('กรุณาป้อนวันที่วันที่จ่ายหมายเพื่อค้นหา');
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
      this.SpinnerService.show();
      var dataTmp= this.result;
      if(dataTmp['time_flag']==0)
        delete dataTmp['time_flag'];
      dataTmp['userToken'] = this.userData.userToken;
      var data = $.extend({}, dataTmp);
      console.log(data)
      let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
      this.http.post('/'+this.userData.appName+'ApiSN/API/SENDNOTICE/fsn0900', data , {headers:headers}).subscribe(
        (response) =>{
          console.log(response)
          let alertMessage : any = JSON.parse(JSON.stringify(response));
          if(alertMessage.result==0){
            this.SpinnerService.hide();
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){}
              subscription.unsubscribe();
            });
          }else{
            this.items = alertMessage.data;
            for(var i=0;i<this.items.length;i++){
              if(this.items[i].send_amt)
                this.items[i].send_amt = this.curencyFormat(this.items[i].send_amt,2);
            }
            this.rerender();
            this.SpinnerService.hide();
          }
        },
        (error) => {this.SpinnerService.hide();}
      )
    }
  }

  retToPage(notice_running:any){
    let winURL = this.authService._baseUrl.substring(0,this.authService._baseUrl.indexOf("#")+1)+'/fsn1600';
    myExtObject.OpenWindowMax(winURL+'?notice_running='+notice_running);
  }

  curencyFormat(n:any,d:any) {
		return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
	}

}







