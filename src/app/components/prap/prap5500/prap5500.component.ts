import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';

// import ในส่วนที่จะใช้งานกับ Observable
import {
  CanActivate, Router,ActivatedRoute,NavigationStart,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  NavigationError,Routes
} from '@angular/router';
import {Observable,of, Subject  } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
import { PrintReportService } from 'src/app/services/print-report.service';

declare var myExtObject: any;

@Component({
  selector: 'app-prap5500,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prap5500.component.html',
  styleUrls: ['./prap5500.component.css']
})


export class Prap5500Component implements AfterViewInit, OnInit, OnDestroy {
  myExtObject :any;
  //form: FormGroup;
  masterSelected:boolean;
  checklist:any;
  checkedList:any;
  sessData:any;
  userData:any;
  programName:any;
  modalType:any;

  result:any = [];
  getMonthTh:any;
  public loadModalJudgeComponent: boolean = false;
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
  public loadComponent: boolean = false;

  @ViewChild('prap5500',{static: true}) prap5500 : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private printReportService: PrintReportService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
  ){  }

  ngOnInit(): void {


    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.successHttp();
    this.activatedRoute.queryParams.subscribe(params => {
      this.result.pjudge_id = params['judge_id']?params['judge_id']:'';
      this.result.pjudge_name = params['judge_name']?params['judge_name']:'';
      this.result.pmonth = this.result.pmonth2 = params['month']?parseInt(params['month']):parseInt(myExtObject.curMonth());
      this.result.pyear = this.result.pyear2 = params['year']?params['year']:myExtObject.curYear();
      
    });
    this.getMonthTh = [{"fieldIdValue": 1, "fieldNameValue": "มกราคม"},{"fieldIdValue": 2, "fieldNameValue": "กุมภาพันธ์"},{"fieldIdValue": 3,"fieldNameValue": "มีนาคม"},{ "fieldIdValue": 4,"fieldNameValue": "เมษายน"},{"fieldIdValue": 5,"fieldNameValue": "พฤษภาคม"},{"fieldIdValue": 6,"fieldNameValue": "มิถุนายน"},{"fieldIdValue": 7,"fieldNameValue": "กรกฎาคม"},{"fieldIdValue": 8,"fieldNameValue": "สิงหาคม"},{"fieldIdValue": 9,"fieldNameValue": "กันยายน"},{"fieldIdValue": 10,"fieldNameValue": "ตุลาคม"},{"fieldIdValue": 11,"fieldNameValue": "พฤศจิกายน"},{"fieldIdValue": 12,"fieldNameValue": "ธันวาคม"}];
    
    //this.setDefPage();
  }

  setDefPage(){
    
  }

  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "prap5500"
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

    printReport(){

      var rptName = 'rap5500';

      // For no parameter : paramData ='{}'
      var paramData ='{}';

      // For set parameter to report
       var paramData = JSON.stringify({
         "url" : 'prap5500',
         "url_name" : 'prap5500',
         "prog_id" : this.userData.programId,
         "pmonth" : this.result.pmonth.toString(),
         "pyear" : this.result.pyear,
         "pmonth2" : this.result.pmonth2.toString(),
         "pyear2" : this.result.pyear2,
         "pjudge_id" : this.result.pjudge_id,
         "pjudge_name" : this.result.pjudge_name,
       });
       console.log(paramData);
      // alert(paramData);return false;
      this.printReportService.printReport(rptName,paramData);
    }

    receiveJudgeListData(event:any){
      this.result.pjudge_id=event.judge_id;
      this.result.pjudge_name=event.judge_name;
      this.closebutton.nativeElement.click();
    }

    clickOpenMyModalComponent(type:any){
      this.modalType = type;
      this.openbutton.nativeElement.click();      
    }

    loadMyModalComponent(){
      $(".modal-backdrop").remove();
      if(this.modalType==1){
        this.loadModalJudgeComponent = true;
        var student = JSON.stringify({
          "cond":2,
          "userToken" : this.userData.userToken});
        this.listTable='pjudge';
        this.listFieldId='judge_id';
        this.listFieldName='judge_name';
        this.listFieldNull='';
        this.listFieldType=JSON.stringify({"type":2});
          this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student).subscribe(
            (response) =>{
             let productsJson : any = JSON.parse(JSON.stringify(response));
             if(productsJson.data.length){
               this.list = productsJson.data;
             }else{
               this.list = [];
             }
            },
            (error) => {}
          )
      }
    }

    tabChangeInput(name:any,event:any){
      if(name=='pjudge_id'){
        var student = JSON.stringify({
          "table_name" : "pjudge",
          "field_id" : "judge_id",
          "field_name" : "judge_name",
          "condition" : " AND judge_id='"+event.target.value+"'",
          "userToken" : this.userData.userToken
        });    
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
          (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.result.pjudge_name = productsJson[0].fieldNameValue;
          }else{
            this.result.pjudge_id = '';
            this.result.pjudge_name = '';
          }
          },
          (error) => {}
        )
      }
    }

    closeModal(){
      this.loadModalJudgeComponent = false;
    }

 


}






