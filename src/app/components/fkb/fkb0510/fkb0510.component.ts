import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,ViewChildren, QueryList   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';

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
  selector: 'app-fkb0510,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fkb0510.component.html',
  styleUrls: ['./fkb0510.component.css']
})


export class Fkb0510Component implements AfterViewInit, OnInit, OnDestroy {
  //form: FormGroup;
  title = 'datatables';

  getCaseType:any;selCaseType:any;
  getTitle:any;selTitle:any;
  getRedTitle:any;selRedTitle:any;

  sessData:any;
  userData:any;
  programName:any;
  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  asyncObservable: Observable<string>;
  modalType:any;
  result:any = [];
  myExtObject: any;
  dataSearch:any = [];
  delTypeApp:any;
  buttonSearch:any = 0;
  toPage:any='prkb0500';

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadModalComponent: boolean = false;
  public loadModalConfComponent: boolean = false;

  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService
  ){ }

  ngOnInit(): void {


    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    //======================== pcase_type ======================================
    var student = JSON.stringify({
      "table_name" : "pcase_type",
      "field_id" : "case_type",
      "field_name" : "case_type_desc",
      "order_by": " case_type ASC",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseType = getDataOptions;
        this.changeCaseType(this.userData.defaultCaseType);
      },
      (error) => {}
    )
      //this.asyncObservable = this.makeObservable('Async Observable');
      this.successHttp();
      this.setDefaultPage(0);
      this.loadDataCurrent();
  }

  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/
  changeCaseType(caseType:any){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var student = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "field_name2": "default_value",
      "condition": "AND title_flag='1' AND case_type='"+caseType+"'",
      "order_by": " order_id ASC",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        //console.log(getDataOptions)
        this.getTitle = getDataOptions;
        this.result.title = this.getTitle.find((x : any ) => x.fieldNameValue2 === 1).fieldIdValue;
      },
      (error) => {}
    )

    var student = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "field_name2": "default_value",
      "condition": "AND title_flag='2' AND case_type='"+caseType+"'",
      "order_by": " order_id ASC",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        //console.log(getDataOptions)
        this.getRedTitle = getDataOptions;
        this.result.red_title = this.getRedTitle.find((x : any ) => x.fieldNameValue2 === 1).fieldIdValue;
      },
      (error) => {}
    )
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fkb0510"
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

  setDefaultPage(type:any){
    this.result = [];
    this.result.case_type = this.userData.defaultCaseType;
    this.result.sdate = myExtObject.curDate();
    this.result.stime = this.pad(myExtObject.curHour(), 2,'')+":"+this.pad(myExtObject.curMinutes(), 2,'')+":"+this.pad(myExtObject.curSeconds(), 2,'');
    this.result.court_id = this.userData.courtId;
    this.result.court_name = this.userData.courtName;
    if(type==1)
      this.changeCaseType(this.userData.defaultCaseType);
  }
  pad(n:any, width:any, z:any) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
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



    clickOpenMyModalComponent(type:any){
      this.modalType = type;
      if(this.modalType==1){
        $("#exampleModal").find(".modal-content").css("width","650px");
        var student = JSON.stringify({
          "table_name" : "pdepartment",
          "field_id" : "dep_code",
          "field_name" : "dep_name",
          "search_id" : "",
          "search_desc" : "",
          "userToken" : this.userData.userToken});
        this.listTable='pdepartment';
        this.listFieldId='dep_code';
        this.listFieldName='dep_name';
        this.listFieldNull='';
      }else if(this.modalType==2){
        $("#exampleModal").find(".modal-content").css("width","650px");
        var student = JSON.stringify({
          "table_name" : "pofficer",
          "field_id" : "off_id",
          "field_name" : "off_name",
          "search_id" : "",
          "search_desc" : "",
          "userToken" : this.userData.userToken});
        this.listTable='pofficer';
        this.listFieldId='off_id';
        this.listFieldName='off_name';
        this.listFieldNull='';
      }else if(this.modalType==3){
        $("#exampleModal").find(".modal-content").css("width","650px");
        var student = JSON.stringify({
          "table_name" : "pcourt",
          "field_id" : "court_id",
          "field_name" : "court_name",
          "search_id" : "",
          "search_desc" : "",
          "userToken" : this.userData.userToken});
        this.listTable='pcourt';
        this.listFieldId='court_id';
        this.listFieldName='court_name';
        this.listFieldNull='';
      }

      if(this.modalType==1 || this.modalType==2 || this.modalType==3){
        let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student , {headers:headers}).subscribe(
        (response) =>{
          console.log(response)
          this.list = response;
          this.loadModalComponent = true;
          this.loadModalConfComponent = false;
        },
        (error) => {}
      )
      }
    }

    receiveFuncListData(event:any){
      console.log(event)
      if(this.modalType==1){
        this.result.dep_id = event.fieldIdValue;
        this.result.dep_name = event.fieldNameValue;
      }else if(this.modalType==2){
        this.result.off_id = event.fieldIdValue;
        this.result.off_name = event.fieldNameValue;
      }else if(this.modalType==3){
        this.result.court_id = event.fieldIdValue;
        this.result.court_name = event.fieldNameValue;
      }
      this.closebutton.nativeElement.click();
    }

    tabChangeInput(name:any,event:any){
      let headers = new HttpHeaders();
       headers = headers.set('Content-Type','application/json');
      if(name=='dep_id'){
        var student = JSON.stringify({
          "table_name" : "pdepartment",
          "field_id" : "dep_code",
          "field_name" : "dep_name",
          "condition" : " AND dep_code='"+event.target.value+"'",
          "userToken" : this.userData.userToken
        });
        console.log(student)
       this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
           (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));

            if(productsJson.length){
              this.result.dep_name = productsJson[0].fieldNameValue;
            }else{
              this.result.dep_id = null;
              this.result.dep_name = '';
            }
           },
           (error) => {}
         )
      }else if(name=='off_id'){

          var student = JSON.stringify({
            "table_name" : "pofficer",
            "field_id" : "off_id",
            "field_name" : "off_name",
            "condition" : " AND off_id='"+event.target.value+"'",
            "userToken" : this.userData.userToken
          });
          console.log(student)
         this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
             (response) =>{
              let productsJson : any = JSON.parse(JSON.stringify(response));

              if(productsJson.length){
                this.result.off_name = productsJson[0].fieldNameValue;
              }else{
                this.result.off_id = null;
                this.result.off_name = '';
              }
             },
             (error) => {}
           )

      }else if(name=='court_id'){

        var student = JSON.stringify({
          "table_name" : "pcourt",
          "field_id" : "court_id",
          "field_name" : "court_name",
          "condition" : " AND court_id='"+event.target.value+"'",
          "userToken" : this.userData.userToken
        });
        console.log(student)
       this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
           (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));

            if(productsJson.length){
              this.result.court_name = productsJson[0].fieldNameValue;
            }else{
              this.result.court_id = null;
              this.result.court_name = '';
            }
           },
           (error) => {}
         )

    }
    }



    searchCaseNo(type:any){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      var alert = 0;


      if(type==1){//เลขคดีดำ
        if(!this.result.title){
          confirmBox.setMessage('กรุณาระบุคำนำหน้าหมายเลขคดีดำ');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){}
            subscription.unsubscribe();
          });
          alert++;
        }else if(!this.result.id){
          confirmBox.setMessage('กรุณาระบุหมายเลขคดีดำ');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){}
            subscription.unsubscribe();
          });
          alert++;
        }else if(!this.result.yy){
          confirmBox.setMessage('กรุณาระบุปีเลขคดีดำ');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){}
            subscription.unsubscribe();
          });
          alert++;
        }else if(!this.result.court_id){
          confirmBox.setMessage('กรุณาระบุคดีของศาล');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){}
            subscription.unsubscribe();
          });
          alert++;
        }else{
          var student = JSON.stringify({
            "case_type": this.result.case_type,
            "search_type":"1",
            "title": this.result.title,
            "id": this.result.id,
            "yy": this.result.yy,
            "court_id": this.result.court_id,
            "userToken" : this.userData.userToken
          });
          var apiUrl = '/'+this.userData.appName+'ApiKB/API/KEEPB/fkb0510/searchCase';
          //console.log(student)
        }
      }else if(type==2){//เลขคดีแดง
        if(!this.result.red_title){
          confirmBox.setMessage('กรุณาระบุคำนำหน้าหมายเลขคดีแดง');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){}
            subscription.unsubscribe();
          });
          alert++;
        }else if(!this.result.red_id){
          confirmBox.setMessage('กรุณาระบุหมายเลขคดีแดง');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){}
            subscription.unsubscribe();
          });
          alert++;
        }else if(!this.result.red_yy){
          confirmBox.setMessage('กรุณาระบุปีเลขคดีแดง');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){}
            subscription.unsubscribe();
          });
          alert++;
        }else if(!this.result.court_id){
          confirmBox.setMessage('กรุณาระบุคดีของศาล');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){}
            subscription.unsubscribe();
          });
          alert++;
        }else{
          var student = JSON.stringify({
            "case_type": this.result.case_type,
            "search_type":"2",
            "title": this.result.red_title,
            "id": this.result.red_id,
            "yy": this.result.red_yy,
            "court_id": this.result.court_id,
            "userToken" : this.userData.userToken
          });
          var apiUrl = '/'+this.userData.appName+'ApiKB/API/KEEPB/fkb0510/searchCase';
          console.log(student)
        }
      }

      if(!alert){
        this.SpinnerService.show();
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
        let promise = new Promise((resolve, reject) => {
          this.http.post(apiUrl, student , {headers:headers}).subscribe(
            (response) =>{
              let getDataOptions : any = JSON.parse(JSON.stringify(response));
              console.log(getDataOptions)
              if(getDataOptions.result==1){
                this.dataSearch = getDataOptions.data;
                this.dataSearch.forEach((x : any ) => x.reqRunning = false);
                console.log(this.dataSearch)
                this.rerender();
                if(type==1 || type==2)
                  this.buttonSearch = 1;
                else
                  this.buttonSearch = 0;

                this.SpinnerService.hide();
              }else{
                //-----------------------------//
                  confirmBox.setMessage(getDataOptions.error);
                  confirmBox.setButtonLabels('ตกลง');
                  confirmBox.setConfig({
                      layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                  });
                  const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                    if (resp.success==true){
                      //this.dataSearch = [];
                      //this.rerender();
                    }
                    subscription.unsubscribe();
                  });
                //-----------------------------//
                this.SpinnerService.hide();
              }

            },
            (error) => {}
          )
        });
      }
      //console.log(this.FunntionService.searchBackNo('','',''))
    }

    saveData(){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');

          this.SpinnerService.show();

          let headers = new HttpHeaders();
          headers = headers.set('Content-Type','application/json');
          var data = $.extend({}, this.result)
          var formData = [];
          formData['event_date'] = data.sdate;
          formData['event_time'] = data.stime;
          formData['userToken'] = this.userData.userToken;
          var dataTmp=[];
          var bar = new Promise((resolve, reject) => {
            this.dataSearch.forEach((ele, index, array) => {
                  if(ele.reqRunning == true){
                    dataTmp.push(this.dataSearch[index]);
                  }
              });
          });

          if(bar){
            formData['data'] = dataTmp;
          }
          var student = $.extend({},formData);
          console.log(student)

          this.http.post('/'+this.userData.appName+'ApiKB/API/KEEPB/fkb0510/saveData', student , {headers:headers}).subscribe(
            (response) =>{
              let getDataOptions : any = JSON.parse(JSON.stringify(response));
              console.log(getDataOptions)
              if(getDataOptions.result==1){

                  //-----------------------------//
                  confirmBox.setMessage('จัดเก็บข้อมูลเรียบร้อยแล้ว');
                  confirmBox.setButtonLabels('ตกลง');
                  confirmBox.setConfig({
                      layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                  });
                  const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                    if (resp.success==true){
                      this.SpinnerService.hide();
                      this.loadDataCurrent();
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
                      this.SpinnerService.hide();
                    }
                    subscription.unsubscribe();
                  });
                //-----------------------------//
              }

            },
            (error) => {}
          )



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

    loadDataCurrent(){
      this.SpinnerService.show();
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      var student = JSON.stringify({
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiKB/API/KEEPB/fkb0510', student , {headers:headers}).subscribe(
        datalist => {
          let getDataOptions : any = JSON.parse(JSON.stringify(datalist));
          console.log(getDataOptions)
          if(getDataOptions.data.length){
            this.dataSearch = getDataOptions.data;
            this.dataSearch.forEach((x : any ) => x.reqRunning = false);
            console.log(this.dataSearch)
            this.rerender();
            this.buttonSearch = 0;
            this.SpinnerService.hide();
          }else{
            this.dataSearch = [];
            this.rerender();
            this.buttonSearch = 0;
            this.SpinnerService.hide();
          }
        },
        (error) => {this.SpinnerService.hide();}
      );
    }

    searchReq(){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      if(!this.result.req_no){
        confirmBox.setMessage('กรุณาระบุเลขที่อ้างอิง');
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
      }else if(!this.result.req_yy){
        confirmBox.setMessage('กรุณาระบุปีเลขอ้างอิง');
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
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
        var student = JSON.stringify({
          "req_no" : this.result.req_no,
          "req_yy" : this.result.req_yy,
          "userToken" : this.userData.userToken
        });
        //console.log(student)
        this.http.post('/'+this.userData.appName+'ApiKB/API/KEEPB/fkb0510/searchRequest', student , {headers:headers}).subscribe(
          (datalist) => {
            let getDataOptions : any = JSON.parse(JSON.stringify(datalist));
            console.log(getDataOptions)
            if(getDataOptions.result==1){
              this.loadDataCurrent();
              this.result.req_no = '';
              this.result.req_yy = '';
            }else{
              confirmBox.setMessage(getDataOptions.error);
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
            }
          },
          (error) => {this.SpinnerService.hide();}
        );
      }
    }

    cancelData(type:any){

      var del = 0;
      var bar = new Promise((resolve, reject) => {
        this.dataSearch.forEach((ele, index, array) => {
          if(ele.reqRunning == true){
            del++;
          }
        });
      });

      if(bar){
        if(del){
          this.delTypeApp = type;
          this.openbutton.nativeElement.click();

        }else{

          const confirmBox = new ConfirmBoxInitializer();
          confirmBox.setTitle('ข้อความแจ้งเตือน');
          confirmBox.setMessage('กรุณาคลิกเลือกข้อมูลที่ต้องการยกเลิก');
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

        }

      }


    }


    loadMyModalComponent(){
      //alert(55)
      //$(".modal-backdrop").remove();

      this.loadModalConfComponent = true;  //password confirm
      this.loadModalComponent = false;
      $("#exampleModal").find(".modal-body").css("height","110px");
      $("#exampleModal").css({"background":"rgba(51,32,0,.4)"});

    }

    closeModal(){
      this.loadModalComponent = false;
      this.loadModalConfComponent = false;
    }

    submitModalForm(){
      var chkForm = JSON.parse(this.child.ChildTestCmp());

      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');

      if(!chkForm.password){
        confirmBox.setMessage('กรุณาป้อนรหัสผ่าน');
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

      }else if(!chkForm.log_remark){
        confirmBox.setMessage('กรุณาป้อนเหตุผล');
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

          var student = JSON.stringify({
            "user_running" : this.userData.userRunning,
            "password" : chkForm.password,
            "log_remark" : chkForm.log_remark,
            "userToken" : this.userData.userToken
          });
          let headers = new HttpHeaders();
          headers = headers.set('Content-Type','application/json');
          this.http.post('/'+this.userData.appName+'Api/API/checkPassword', student , {headers:headers}).subscribe(
            posts => {
              let productsJson : any = JSON.parse(JSON.stringify(posts));
              console.log(productsJson)
            if(productsJson.result==1){
                const confirmBox = new ConfirmBoxInitializer();
              confirmBox.setTitle('ต้องการยกเลิกข้อมูลใช่หรือไม่?');
              confirmBox.setMessage('ยืนยันการยกเลิกข้อมูลที่เลือก');
              confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');

              // Choose layout color type
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){

                        this.SpinnerService.show();
                        let headers = new HttpHeaders();
                        headers = headers.set('Content-Type','application/json');
                        var dataDel = [],dataTmp=[];
                        dataDel['log_remark'] = chkForm.log_remark;
                        dataDel['userToken'] = this.userData.userToken;
                      if(this.delTypeApp=='cancelData'){

                          var bar = new Promise((resolve, reject) => {
                            this.dataSearch.forEach((ele, index, array) => {
                                  if(ele.reqRunning == true){
                                    dataTmp.push(this.dataSearch[index]);
                                  }
                              });
                          });

                          if(bar){
                            this.SpinnerService.show();
                            let headers = new HttpHeaders();
                            headers = headers.set('Content-Type','application/json');
                            dataDel['data'] = dataTmp;
                            var data = $.extend({}, dataDel);
                            console.log(data)
                            this.http.post('/'+this.userData.appName+'ApiKB/API/KEEPB/fkb0510/cancelSelect', data , {headers:headers}).subscribe(
                              (response) =>{
                                let alertMessage : any = JSON.parse(JSON.stringify(response));
                                console.log(alertMessage)
                                if(alertMessage.result==0){
                                  const confirmBox2 = new ConfirmBoxInitializer();
                                  confirmBox2.setMessage(alertMessage.error);
                                  confirmBox2.setButtonLabels('ตกลง');
                                  confirmBox2.setConfig({
                                      layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                                  });
                                  const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                                    if (resp.success==true){
                                      this.SpinnerService.hide();
                                    }
                                    subscription2.unsubscribe();
                                  });
                                }else{
                                  const confirmBox2 = new ConfirmBoxInitializer();
                                  confirmBox2.setMessage(alertMessage.error);
                                  confirmBox2.setButtonLabels('ตกลง');
                                  confirmBox2.setConfig({
                                      layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                                  });
                                  const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                                    if (resp.success==true){
                                      this.SpinnerService.hide();
                                      this.closebutton.nativeElement.click();
                                      this.loadDataCurrent();
                                    }
                                    subscription2.unsubscribe();
                                  });

                                }
                              },
                              (error) => {this.SpinnerService.hide();}
                            )
                          }

                      }

                  }
                  subscription.unsubscribe();
                });
              }else{
                confirmBox.setMessage(productsJson.error);
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
          );

      }
    }

    goToPage(event_type:any){
      let winURL = window.location.href;
      winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+this.toPage+'?event_type='+event_type;
      //alert(winURL);
      window.open(winURL,'_blank', "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=1200,height=400");
      //myExtObject.OpenWindowMax(winURL+'?run_id='+run_id);
    }

}







