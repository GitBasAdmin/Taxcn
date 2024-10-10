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
import { transform, isEqual, isObject ,differenceBy  } from 'lodash';
import * as _ from "lodash"
declare var myExtObject: any;

@Component({
  selector: 'app-fkb9000,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fkb9000.component.html',
  styleUrls: ['./fkb9000.component.css']
})


export class Fkb9000Component implements AfterViewInit, OnInit, OnDestroy {
  //form: FormGroup;
  title = 'datatables';

  posts:any;
  search:any;
  masterSelected:boolean;
  sessData:any;
  userData:any;
  programName:any;
  sdep_id:any;
  myExtObject: any;
  result:any= [];
  items:any= [];
  dataSource:any= [];
  getDep:any;

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
    //======================== pdepartment ======================================
    var student = JSON.stringify({
      "table_name" : "pdepartment",
      "field_id" : "dep_code",
      "field_name" : "dep_name",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getDep = getDataOptions;
      },
      (error) => {}
    )

    this.result.cond1 = 1;
    this.result.cond2 = 1;
    this.result.cond3 = 1;
      //this.asyncObservable = this.makeObservable('Async Observable');
      this.successHttp();
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fkb0200"
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

    searchData(){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');

      if(((!this.result.sdate ) && (!this.result.sorder_date) && (!this.result.ssubmit_date))){
        confirmBox.setMessage('เลือกวันที่ที่ต้องการค้นหา');
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
      }else if(((!this.result.edate ) && (!this.result.eorder_date) && (!this.result.esubmit_date))){
        confirmBox.setMessage('เลือกวันที่ที่ต้องการค้นหา');
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
        dataTmp['userToken'] = this.userData.userToken;
        var data = $.extend({}, dataTmp);
        console.log(data)
        let headers = new HttpHeaders();
          headers = headers.set('Content-Type','application/json');
        this.http.post('/'+this.userData.appName+'ApiKB/API/KEEPB/fkb9000', data , {headers:headers}).subscribe(
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
                if (resp.success==true){
                  this.items = [];
                  this.rerender();
                  this.SpinnerService.hide();
                }
                subscription.unsubscribe();
              });
            }else{
              this.items = alertMessage.data;
              this.dataSource = JSON.parse(JSON.stringify(alertMessage.data));
              //this.items.forEach((x : any ) => x.reqRunning = false);
              this.rerender();
              this.SpinnerService.hide();
            }
          },
          (error) => {this.SpinnerService.hide();}
        )
      }
    }

    saveData(){
      var student = this.difference(this.items,this.dataSource);
      var saveArray = $.grep(student,function(n:any){ return n == 0 || n });
      console.log(saveArray)
      if(!saveArray.length){
        const confirmBox = new ConfirmBoxInitializer();
          confirmBox.setTitle('ข้อความแจ้งเตือน');
          confirmBox.setMessage('กรุณาคลิกเลือกข้อมูลที่ต้องจัดเก็บ');
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
          var dataSave = [],dataTmp=[];
          dataSave['userToken'] = this.userData.userToken;
          var bar = new Promise((resolve, reject) => {
            for(var i=0;i<saveArray.length;i++){
              dataTmp.push(this.items[saveArray[i]]);
            }
          });
          
          if(bar){
            //console.log(dataTmp)

            this.SpinnerService.show();
            let headers = new HttpHeaders();
            headers = headers.set('Content-Type','application/json');
            dataSave['data'] = dataTmp;
            var data = $.extend({}, dataSave);
            console.log(data)
            this.http.post('/'+this.userData.appName+'ApiKB/API/KEEPB/fkb9000/saveData', data , {headers:headers}).subscribe(
              (response) =>{
                let alertMessage : any = JSON.parse(JSON.stringify(response));
                if(alertMessage.result==0){
                  const confirmBox = new ConfirmBoxInitializer();
                  confirmBox.setTitle('ข้อความแจ้งเตือน');
                  confirmBox.setMessage(alertMessage.error);
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
                  const confirmBox = new ConfirmBoxInitializer();
                  confirmBox.setTitle('ข้อความแจ้งเตือน');
                  confirmBox.setMessage(alertMessage.error);
                  confirmBox.setButtonLabels('ตกลง');
                  confirmBox.setConfig({
                      layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                  });
                  const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                    if (resp.success==true){
                      this.searchData();
                      //this.SpinnerService.hide();
                    }
                    subscription.unsubscribe();
                  });
                  
                }
              },
              (error) => {this.SpinnerService.hide();}
            )
            
          }
      }
      /*
      var bar = new Promise((resolve, reject) => {
        this.items.forEach((ele, index, array) => {
          if(ele.reqRunning == true){
            del++;
          }
        });
      });
      
      if(bar){
        if(!del){
          const confirmBox = new ConfirmBoxInitializer();
          confirmBox.setTitle('ข้อความแจ้งเตือน');
          confirmBox.setMessage('กรุณาคลิกเลือกข้อมูลที่ต้องจัดเก็บ');
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
          var dataSave = [],dataTmp=[];
          dataSave['userToken'] = this.userData.userToken;
          
          
          var bar = new Promise((resolve, reject) => {
            
            this.items.forEach((ele, index, array) => {
                  if(ele.reqRunning == true){
                    dataTmp.push(this.items[index]);
                  }
              });
            
          });
          
          if(bar){
            this.SpinnerService.show();
            let headers = new HttpHeaders();
            headers = headers.set('Content-Type','application/json');
            dataSave['data'] = dataTmp;
            var data = $.extend({}, dataSave);
            console.log(data)
            this.http.post('/'+this.userData.appName+'ApiKB/API/KEEPB/fkb9000/saveData', data , {headers:headers}).subscribe(
              (response) =>{
                let alertMessage : any = JSON.parse(JSON.stringify(response));
                if(alertMessage.result==0){
                  const confirmBox = new ConfirmBoxInitializer();
                  confirmBox.setTitle('ข้อความแจ้งเตือน');
                  confirmBox.setMessage(alertMessage.error);
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
                  const confirmBox = new ConfirmBoxInitializer();
                  confirmBox.setTitle('ข้อความแจ้งเตือน');
                  confirmBox.setMessage(alertMessage.error);
                  confirmBox.setButtonLabels('ตกลง');
                  confirmBox.setConfig({
                      layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                  });
                  const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                    if (resp.success==true){
                      //this.getObjAppData();
                      this.SpinnerService.hide();
                    }
                    subscription.unsubscribe();
                  });
                  
                }
              },
              (error) => {this.SpinnerService.hide();}
            )
          }
          
        }
      }
      */
    }

    tabChangeSelect(objName:any,objData:any,event:any,type:any){
      if(typeof objData!='undefined'){
        if(type==1){
          var val = objData.filter((x:any) => x.fieldIdValue === event.target.value) ;
        }else{
            var val = objData.filter((x:any) => x.fieldIdValue === event);
        }
        if(val.length!=0){
          this.result[objName] = val[0].fieldIdValue;
          this[objName] = val[0].fieldIdValue;
        }
      }else{
        this.result[objName] = null;
        this[objName] = null;
      }
    }

    difference(object:any, base:any) {
      return transform(object, (result:any, value, key) => {
        if (!isEqual(value, base[key])) {
          //result[key] = isObject(value) && isObject(base[key]) ? this.difference(value, base[key]) : value;
          result[key] = isObject(value) && isObject(base[key]) ? key : null;
          //result[key] = key;
        }
      });
    }

    gotoFkb0100(run_id:any,req_running:any){
      let winURL = this.authService._baseUrl;
      winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+"fkb0100";
      myExtObject.OpenWindowMax(winURL+'?run_id='+run_id+'&req_running='+req_running);
    }

}







