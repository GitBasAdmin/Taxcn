import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,AfterContentInit,OnDestroy,Injectable, Input   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { ExcelService } from 'src/app/services/excel.service.ts';
import { ActivatedRoute } from '@angular/router';

// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';

import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
declare var myExtObject: any;

@Component({
  selector: 'app-fju0600-history,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fju0600-history.component.html',
  styleUrls: ['./fju0600-history.component.css']
})


export class Fju0600HistoryComponent implements AfterViewInit, OnInit, OnDestroy {
   items:any = [];
  ptype:any;
  pTitle:any;
  dColumn:any;
  sDate:any;
  edate:any;
  
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

  retPage:any;
  myExtObject:any;
  asyncObservable: Observable<string>;
  result:any = [];
  dataSearch:any = [];
  case_running:any;


  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private excelService: ExcelService,
    private activatedRoute: ActivatedRoute,
    private route: ActivatedRoute
  ){ }

  ngOnInit(): void {
    this.dtOptions = {
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      lengthChange : false,
      info : false,
      paging : false,
      searching : false,
      destroy: true
    };

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.successHttp();

    this.activatedRoute.queryParams.subscribe(params => {
      this.case_running = params['case_running'];
      if(this.case_running)
        this.searchData();
  });
  }

  successHttp() {
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fju0600"
    });
    let promise = new Promise((resolve, reject) => {
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen )
        .toPromise()
        .then(
          res => { // Success
          let getDataAuthen : any = JSON.parse(JSON.stringify(res));
          this.programName = getDataAuthen.programName;
          this.defaultCaseType = getDataAuthen.defaultCaseType;
          this.defaultCaseTypeText = getDataAuthen.defaultCaseTypeText;
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
    var student = JSON.stringify({
      "case_running" : this.case_running,
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiJU/API/JUDGEMENT/fju0600/getCaseHistorical', student ).subscribe(
      (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.result==1){
            this.dataSearch = productsJson.data;             
            this.rerender();
          }else{
            this.dataSearch = [];
            this.rerender();
          }
          this.SpinnerService.hide();
      },
      (error) => {}
    )
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

  ngAfterContentInit() : void{
    myExtObject.callCalendar();
  }
}