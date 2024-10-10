import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,AfterContentInit,Injectable,ViewChildren, QueryList   } from '@angular/core';
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
  selector: 'app-fap0300,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fap0300.component.html',
  styleUrls: ['./fap0300.component.css']
})


export class Fap0300Component implements AfterViewInit, OnInit, OnDestroy ,AfterContentInit{
  //form: FormGroup;
  title = 'datatables';

  posts:any;
  search:any;
  masterSelected:boolean;
  sessData:any;
  userData:any;
  myExtObject: any;
  programName:any;
  result:any= [];
  items:any= [];
  modalType:any;

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadModalComponent: boolean = false;
  public loadModalJudgeComponent: boolean = false;
  masterSelect:boolean = false;
  loadComponent:boolean = false;

  //@ViewChild('fca0200',{static: true}) fca0200 : ElementRef;
  //@ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  //@ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
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
      destroy:true
    };

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

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
      "url_name" : "fap0300"
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

    loadMyModalJudgeComponent(type:any,index:any){
      this.modalType = index;
      //$(".modal-backdrop").remove();
      this.loadModalComponent = true; //password confirm
      //$("#exampleModal").find(".modal-body").css("height","auto");
      //$("#exampleModal").css({"background":"rgba(51,32,0,.4)"});
      if(type==2){
        var student = JSON.stringify({
          "cond":2,
          "userToken" : this.userData.userToken});
        this.listTable='pjudge';
        this.listFieldId='judge_id';
        this.listFieldName='judge_name';
        this.listFieldNull='';
        this.listFieldType=JSON.stringify({"type":2});
      }
      console.log(student)
      let headers = new HttpHeaders();
       headers = headers.set('Content-Type','application/json');
       
       this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student , {headers:headers}).subscribe(
           (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            if(productsJson.data.length){
              this.list = productsJson.data;
              console.log(this.list)
            }else{
              this.list = [];
            }
           },
           (error) => {}
         )
    }

    directiveDate(date:any,obj:any){
      this.result[obj] = date;
    }

    orderJudgeTab(event:any,type:any){
      this.SpinnerService.show();
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
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
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          if(getDataOptions.length>0){
            if(type==1){
              this.result.judge_name = getDataOptions[0].fieldNameValue;
            }else{
              this.result.judge_name2 = getDataOptions[0].fieldNameValue;
            }
              
          }else{
            
            if(type==1){
              this.result.judge_id = '';
              this.result.judge_name = '';
            }else{
              this.result.judge_id2 = '';
              this.result.judge_name2 = '';
            }
          }
          this.SpinnerService.hide();
        },
        (error) => {}
      )
    }

    receiveJudgeListData(event:any){
      console.log(event)
      if(this.modalType==1){
        this.result.judge_id = event.judge_id;
        this.result.judge_name = event.judge_name;
      }else{
        this.result.judge_id2 = event.judge_id;
        this.result.judge_name2 = event.judge_name;
      }
      
      this.closebutton.nativeElement.click();
    }
  
    closeModal(){
      this.loadModalComponent = false;
      this.loadComponent = false;
    }
    submitModalForm(){

    }

    loadMyModalComponent(){

    }

    searchData(){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
  
      if(this.result.judge_id  && this.result.judge_id2){
        confirmBox.setMessage('คุณสามารถกรอกข้อมูลได้เพียง 1 ช่องเท่านั้น');
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
      }else if(!this.result.judge_id  && !this.result.judge_id2){
        confirmBox.setMessage('คุณยังไม่กรอกข้อมูลที่ต้องการค้นหาน');
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
        this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/fap0300', data , {headers:headers}).subscribe(
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
              this.rerender();
              this.SpinnerService.hide();
            }
          },
          (error) => {this.SpinnerService.hide();}
        )
      }
    }



}







