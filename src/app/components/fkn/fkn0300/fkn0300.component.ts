import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,AfterContentInit,ViewChildren, QueryList,Output,EventEmitter   } from '@angular/core';
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
import { ActivatedRoute } from '@angular/router';
//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-fkn0300,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fkn0300.component.html',
  styleUrls: ['./fkn0300.component.css']
})


export class Fkn0300Component implements AfterViewInit, OnInit, OnDestroy,AfterContentInit {
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
  dataHead:any = [];
  getHistoricalData:any = [];
  getAdditionalData:any = [];
  getMaterialHistoricalData:any = [];
  getNoticeHistoricalData:any = [];
  runId:any;

  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  asyncObservable: Observable<string>;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;


  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
  ){ }

  ngOnInit(): void {


    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.activatedRoute.queryParams.subscribe(params => {
      this.runId = params['run_id'];
    });


      //this.asyncObservable = this.makeObservable('Async Observable');
      this.successHttp();
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 99999,
        processing: true,
        columnDefs: [{"targets": 'no-sort',"orderable": false}],
        order:[],
        lengthChange : false,
        info : false,
        paging : false,
        searching : false
      };
  }

  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fkn0300"
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

  }
    loadData(){
      this.getHistorical();
      this.getAdditional();
        //this.getMaterialHistorical();
      this.getNoticeHistorical();
    }

    fnDataHead(event:any){
      console.log(event)
      this.dataHead = event;
      if(this.dataHead.run_id){
       var bar = new Promise((resolve, reject) => {
        this.runId = {'run_id' : event.run_id,'counter' : Math.ceil(Math.random()*10000),'notSearch':1}
        this.getHistorical();
        this.getAdditional();
        //this.getMaterialHistorical();
        this.getNoticeHistorical();
      });
      if(bar){this.rerender();}
      }
    }


    getHistorical(){
      if(this.dataHead.run_id){
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
        var student = JSON.stringify({
          "run_id" : this.dataHead.run_id,
          "userToken" : this.userData.userToken
        });
        console.log(student)

        this.http.post('/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0300/getHistoricalData', student , {headers:headers}).subscribe(
          (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            console.log(productsJson)
            if(productsJson.result==1){
              //===================================================================
              this.getHistoricalData = productsJson.data;
              this.rerender();
              //===================================================================
            }else{
              this.getHistoricalData = [];
              this.rerender();
            }
          },
          (error) => {}
        )
      }
    }
    getAdditional(){
      if(this.dataHead.run_id){
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
        var student = JSON.stringify({
          "run_id" : this.dataHead.run_id,
          "userToken" : this.userData.userToken
        });
        console.log(student)

        this.http.post('/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0300/getAdditionalData', student , {headers:headers}).subscribe(
          (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            console.log(productsJson)
            if(productsJson.result==1){
              //===================================================================
              this.getAdditionalData = productsJson.data;
              this.rerender();
              //===================================================================
            }else{
              this.getAdditionalData = [];
              this.rerender();
            }
          },
          (error) => {}
        )
      }
    }
    /*
    getMaterialHistorical(){
      if(this.dataHead.run_id){
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
        var student = JSON.stringify({
          "run_id" : this.dataHead.run_id,
          "userToken" : this.userData.userToken
        });
        console.log(student)

        this.http.post('/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0300/getMaterialHistoricalData', student , {headers:headers}).subscribe(
          (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            console.log(productsJson)
            if(productsJson.result==1){
              //===================================================================
              this.getMaterialHistoricalData = productsJson.data;
              this.rerender();
              //===================================================================
            }else{
              this.getMaterialHistoricalData = [];
              this.rerender();
            }
          },
          (error) => {}
        )
      }
    }
    */
    getNoticeHistorical(){
      if(this.dataHead.run_id){
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
        var student = JSON.stringify({
          "run_id" : this.dataHead.run_id,
          "userToken" : this.userData.userToken
        });
        console.log(student)

        this.http.post('/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0300/getNoticeHistoricalData', student , {headers:headers}).subscribe(
          (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            console.log(productsJson)
            if(productsJson.result==1){
              //===================================================================
              this.getNoticeHistoricalData = productsJson.data;
              this.rerender();
              //===================================================================
            }else{
              this.getNoticeHistoricalData = [];
              this.rerender();
            }
          },
          (error) => {}
        )
      }
    }




}







