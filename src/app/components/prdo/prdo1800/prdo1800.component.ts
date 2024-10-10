import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';

// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';
import { NgSelectComponent } from '@ng-select/ng-select';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
import { PrintReportService } from 'src/app/services/print-report.service';

//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
declare var myExtObject: any;

@Component({
  selector: 'app-prdo1800,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prdo1800.component.html',
  styleUrls: ['./prdo1800.component.css']
})


export class Prdo1800Component implements AfterViewInit, OnInit, OnDestroy {
  myExtObject :any;
  //form: FormGroup;
  title = 'datatables';

  
  posts:any;
  search:any;
  masterSelected:boolean;
  checklist:any;
  checkedList:any;
  delValue:any;
  sessData:any;
  userData:any;
  programName:any;
  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  asyncObservable: Observable<string>;
  selectedCasetype:any='แพ่ง';
  getCaseType:any;
  selCaseType:any;
  selCaseId:any;

  result:any = [];
  getAssetTitle:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  @ViewChild('prdo1800',{static: true}) prdo1800 : ElementRef;
  //@ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  //@ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  //@ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild('scasetypeid') scasetypeid : NgSelectComponent;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private printReportService: PrintReportService,
    private authService: AuthService
  ){  }

  ngOnInit(): void {


    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

      //this.asyncObservable = this.makeObservable('Async Observable');
      this.successHttp();

      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
       //======================== pcase_type ======================================
     var student = JSON.stringify({
      "table_name" : "pcase_type",
      "field_id" : "case_type",
      "field_name" : "case_type_desc",
      "order_by" : "case_type ASC",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseType = getDataOptions;
        this.selCaseType = this.userData.defaultCaseType;

        //console.log(this.getCaseType)
        //console.log(this.userData.defaultCaseType)
        //console.log(this.selCaseType)
      },
      (error) => {}
    )
    //----------------------end pcase_type -------------------

    //======================== getAssetTitle ======================================
    var Json = JSON.stringify({
      "table_name" : "pmaterial_title",
      "field_id" : "case_title",
      "field_name" : "case_title",
      "condition" : "",
      "userToken" : "451BVYfjkS9Pid_mctXsdzNPkvly3Wc-"
    });
      console.log(Json);
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', Json , {headers:headers}).subscribe(
      (response) =>{
        console.log('xxxxxxxxxxx'+response);
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        getDataOptions.unshift({fieldIdValue:0,fieldNameValue: 'ทั้งหมด'});
        this.getAssetTitle = getDataOptions;
      },
      (error) => {}
    )

    this.setDefPage();
  }

  setDefPage(){
    this.result = [];
    this.result.pcase_yy = myExtObject.curYear();
  }

  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "prdo1800"
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

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    // Destroy the table first
    dtInstance.destroy();
    // Call the dtTrigger to rerender again
    this.dtTrigger.next(null);
      });}

 ngAfterViewInit(): void {
    myExtObject.callCalendar();
    this.dtTrigger.next(null);
     }

  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }

    ClearAll(){
      window.location.reload();
    }

    submitForm() {
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
  
      if(!this.result.pcase_id_start && !this.result.pcase_id_end && !this.result.pcase_yy){
        confirmBox.setMessage('กรุณาระบุเลขที่คดีให้ครบ');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){
            //this.SpinnerService.hide();
            this.result.setFocus('pcase_id_start');
          }
          subscription.unsubscribe();
        });
  
  
      }else{
  
        var student = JSON.stringify({
        "title" : this.result.pcase_title,
        "s_id" : this.result.pcase_id_start,
        "e_id" : this.result.pcase_id_end,
        "yy" : this.result.pcase_yy,
        "userToken" : this.userData.userToken
        });
        console.log(student)
  
        this.SpinnerService.show();
  
          this.http.post('/'+this.userData.appName+'ApiDO/API/KEEPB/prdo1800', student ).subscribe(
            (response) =>{
              let alertMessage : any = JSON.parse(JSON.stringify(response));
              console.log(alertMessage)
              if(alertMessage.result==0){
                this.SpinnerService.hide();
                confirmBox.setMessage(alertMessage.error);
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
                // this.SpinnerService.hide();
                // confirmBox.setMessage('จัดเก็บข้อมูลเรียบร้อยแล้ว');
                // confirmBox.setButtonLabels('ตกลง');
                // confirmBox.setConfig({
                //     layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                // });
                // const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                //   if (resp.success==true){
                //     $("button[type='reset']")[0].click();
                //     //this.SpinnerService.hide();
                //   }
                //   subscription.unsubscribe();
                // });
                // this.ngOnInit();
                this.printReport();
                //this.form.reset();
                 // $("button[type='reset']")[0].click();
  
              }
            },
            (error) => {this.SpinnerService.hide();}
          )
        }
      }


    printReport(){

      var rptName = 'rdo1800';

      if(typeof(this.result.pcase_title)=='undefined'){
        this.result.pcase_title = '';
      }

      if(typeof(this.result.pcase_id_start)=='undefined'){
        this.result.pcase_id_start = '';
      }

      if(typeof(this.result.pcase_id_end)=='undefined'){
        this.result.pcase_id_end = '';
      }

      if(typeof(this.result.pcase_yy)=='undefined'){
        this.result.pcase_yy = '';
      }


      // For no parameter : paramData ='{}'
      var paramData ='{}';

      // For set parameter to report
       var paramData = JSON.stringify({
        "pcase_title" : this.result.pcase_title ? this.result.pcase_title.toString() : '',
        "pcase_id_start" : this.result.pcase_id_start ? this.result.pcase_id_start.toString() : '',
        "pcase_id_end" : this.result.pcase_id_end ? this.result.pcase_id_end.toString() : '',
        "pcase_yy" : this.result.pcase_yy ? this.result.pcase_yy.toString() : '',
       });
       console.log(paramData)
      // alert(paramData);return false;
      this.printReportService.printReport(rptName,paramData);
    }

    changeCaseType(caseType:any){
      this.selCaseType = caseType;
    }



}






