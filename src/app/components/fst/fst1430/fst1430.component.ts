import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap'; 
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';

// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject,Subscription   } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';

import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-fst1430,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fst1430.component.html',
  styleUrls: ['./fst1430.component.css']
})


export class Fst1430Component implements AfterViewInit, OnInit, OnDestroy {
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
  asyncObservable: Observable<string>;
  caseType:any;
  defaultCaseType:any;
  selectedData:any;
  selData:any;
  selMonth:any;
  mGroup:any;
  sGroup:any;

 
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  private globalFlag = -1;
  
  @ViewChild('formHtml',{static: true}) formHtml : ElementRef;
  //@ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  //@ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 
  //@ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ; 

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
  ){ }
   
  ngOnInit(): void {
    this.dtOptions = {
      destroy : true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      lengthChange : false,
      info : false,
      paging : false,
      searching : false
    };
    
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
   
      //this.asyncObservable = this.makeObservable('Async Observable');
      this.successHttp();
      this.selData = [
        {id: '1',text: 'มกราคม'},
        {id: '2',text: 'กุมภาพันธ์'},
        {id: '3',text: 'มีนาคม'},
        {id: '4',text: 'เมษายน'},
        {id: '5',text: 'พฤษภาคม'},
        {id: '6',text: 'มิถุนายน'},
        {id: '7',text: 'กรกฎาคม'},
        {id: '8',text: 'สิงหาคม'},
        {id: '9',text: 'กันยายน'},
        {id: '10',text: 'ตุลาคม'},
        {id: '11',text: 'พฤศจิกายน'},
        {id: '12',text: 'ธันวาคม'}
      ];
  }

  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  async successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fst1430"
    });


    let promise = await new Promise((resolve, reject) => {
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen , {headers:headers})
        .toPromise()
        .then(
          res => { // Success
          let getDataAuthen : any = JSON.parse(JSON.stringify(res));
          //console.log(getDataAuthen)
          this.programName = getDataAuthen.programName;
          this.defaultCaseType = getDataAuthen.defaultCaseType;
          this.getCaseType();
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
      });
  }
      
 ngAfterViewInit(): void {
    this.dtTrigger.next(null);
  }
    
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe(); 
  }

  async getCaseType(){
    var student = JSON.stringify({
      "table_name" : "pcase_type_stat",
      "field_id" : "case_type_stat",
      "field_name" : "case_type_stat_desc",
      "condition" : "AND case_type='1'",
      "order_by" : " case_type_stat ASC ",
      "userToken" : this.userData.userToken
    });
    //console.log("fCaseType")
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    let promise = await new Promise((resolve, reject) => {
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          //console.log(getDataOptions)
          this.caseType = getDataOptions;
          this.selectedData = 1;
          //console.log(this.defaultCaseType)
          this.changeData()
        },
        (error) => {}
      )
    });
    return promise;
  }
  changeMonth(val:any){
    this.selMonth = val;
  }

  async changeData () {
    //console.log(this.formHtml)
    
    var student = JSON.stringify({
      "case_type" : 2,
      "case_type_stat" : this.selectedData,
      "month" : '',
      "year" : '',
      //"month" : this.selMonth,
      //"year" : this.formHtml.nativeElement['year'].value,
      "userToken" : this.userData.userToken
    });
    console.log(student)
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    /*
    this.subscription = this.http.post('/'+this.userData.appName+'ApiST/API/fst1430/getStatData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        this.mGroup = getDataOptions.data;
        this.ngOnDestroy();
      },
      (error) => {}
    );*/

    let promise = await new Promise((resolve, reject) => {
        this.http.post('/'+this.userData.appName+'ApiST/API/fst1430/getStatData', student , {headers:headers}).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            console.log(getDataOptions)
            this.mGroup = getDataOptions.data;
          },
          (error) => {}
        )
      
    });

    //return promise;
    
  }



  ev(flag:any){
    if(flag != this.globalFlag){
      //console.log("TRIGGER!")
      this.dtTrigger.next(null);
      this.globalFlag = flag;
    }
  }

 




}







