import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

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
  selector: 'app-prca1800,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prca1800.component.html',
  styleUrls: ['./prca1800.component.css']
})


export class Prca1800Component implements AfterViewInit, OnInit, OnDestroy {
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
  hid_branch_type:any;
  hid_case_type_stat:any;
  hid_title:any;
  case_type:any;
  case_type_stat:any;
  getCaseTypeStat:any;
  getTitle:any;
  s_id:any;
  e_id:any;
  yy:any;
  result:any = [];

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  @ViewChild('prca1800',{static: true}) prca1800 : ElementRef;
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
    private ngbModal: NgbModal,
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
      "case_type" : this.case_type,
      "case_type_stat" : this.case_type_stat,
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

  }



  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "prca1800"
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


  submitForm(type:any) {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!this.result.s_id && !this.result.e_id && !this.result.yy){
      confirmBox.setMessage('กรุณาระบุเลขที่คดีให้ครบ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          //this.SpinnerService.hide();
          this.result.setFocus('s_id');
        }
        subscription.unsubscribe();
      });

    // }else if(!this.conciliate_name){
    //   confirmBox.setMessage('กรุณาระบุชื่อผู้ประนอม');
    //   confirmBox.setButtonLabels('ตกลง');
    //   confirmBox.setConfig({
    //       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    //   });
    //   const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
    //     if (resp.success==true){
    //       //this.SpinnerService.hide();
    //       this.setFocus('conciliate_id');
    //     }
    //     subscription.unsubscribe();
    //   });
    }else{


      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      // if(this.conciliate_id.nativeElement["default_value"].checked==true){
      //   var inputChk = 1;
      // }else{
      //   var inputChk = 0;
      // }


    //  if(this.all_day_flag==true){
    //      var inputchk = 1;
    //  }else{
    //      var inputchk = 0;
    //  }

      var student = JSON.stringify({
      "case_type" : this.result.case_type,
      "title" : this.result.title,
      "s_id" : this.result.s_id,
      "e_id" : this.result.e_id,
      "yy" : this.result.yy,
      "userToken" : this.userData.userToken
      });
      console.log(student)

      this.SpinnerService.show();

        this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/prca1800', student , {headers:headers}).subscribe(
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
              this.printReport(type);
              //this.form.reset();
               // $("button[type='reset']")[0].click();

            }
          },
          (error) => {this.SpinnerService.hide();}
        )

    }

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


    changeCaseType(caseType:any){
      this.selCaseType = caseType;
    }

    changeCaseTypeStat(caseType:number,type:any){
      this.case_type_stat = '';
     var student = JSON.stringify({
       "table_name": "pcase_type_stat",
       "field_id": "case_type_stat",
       "field_name": "case_type_stat_desc",
       "field_name2": "display_column",
       "condition": " AND case_type="+caseType,
       "order_by":" order_id ASC",
       "userToken" : this.userData.userToken
     });
     console.log("fCaseTypeStat :"+student)
     let headers = new HttpHeaders();
     headers = headers.set('Content-Type','application/json');
     let promise = new Promise((resolve, reject) => {
     this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
       (response) =>{
         let getDataOptions : any = JSON.parse(JSON.stringify(response));
         this.getCaseTypeStat = getDataOptions;
         if(type>0)
           this.case_type_stat = type;
         //this.fDefCaseStat(caseType,title);
       },
       (error) => {}
     )
     });
     return promise;
   }

    changeTitle(caseType:number,type:any){
      this.title = '';
      var student = JSON.stringify({
        "table_name": "ptitle",
        "field_id": "title_id",
        "field_name": "title",
        "field_name2": "title_eng",
        "condition": " AND case_type="+caseType+ " And title_flag=1",
        "order_by":" title_id ASC",
        "userToken" : this.userData.userToken
      });
      console.log("fTitle :"+student)
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      let promise = new Promise((resolve, reject) => {
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getTitle = getDataOptions;
          if(type>0)
            this.title = type;
          //this.fDefCaseStat(caseType,title);
        },
        (error) => {}
      )
      });
      return promise;
    }

    printReport(type:any){

      var rptName = 'rca1800';
      if(typeof(this.result.title)=='undefined'){
        this.result.title = '';
      }

      if(typeof(this.result.s_id)=='undefined'){
        this.result.s_id = '';
      }

      if(typeof(this.result.e_id)=='undefined'){
        this.result.e_id = '';
      }

      if(typeof(this.result.yy)=='undefined'){
        this.result.yy = '';
      }

      // For no parameter : paramData ='{}'
      var paramData ='{}';

      // For set parameter to report
       var paramData = JSON.stringify({
        "pcase_type" : this.result.case_type ? this.result.case_type.toString() : '',
        "ptitle" : this.result.title ? this.result.title : '',
        "prpt_type" : type ? type.toString() : '',
        "pid_start" : this.result.s_id ? this.result.s_id : '',
        "pid_end" : this.result.e_id ? this.result.e_id : '',
        "pyear" : this.result.yy ? this.result.yy : '',
        "pflag" : '',
       });
       console.log(paramData);
      // alert(paramData);return false;
      this.printReportService.printReport(rptName,paramData);
    }

}






