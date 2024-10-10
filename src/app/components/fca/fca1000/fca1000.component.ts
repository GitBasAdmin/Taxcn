import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,AfterContentInit,OnDestroy,Injectable   } from '@angular/core';
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
import { PrintReportService } from 'src/app/services/print-report.service';

declare var myExtObject: any;
//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-fca1000,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fca1000.component.html',
  styleUrls: ['./fca1000.component.css']
})


export class Fca1000Component implements AfterViewInit, OnInit, OnDestroy {
  //form: FormGroup;
  title = 'datatables';

  getCaseType:any;selCaseType:any;
  getDateType:any;selDateType:any;
  getJudge:any;
  getCaseCate:any;
  getRedTitle:any;
  getTitle:any;
  posts:any;
  search:any;
  masterSelected:boolean;
  checklist:any;
  checkedList:any=[];
  delValue:any;
  sessData:any;
  userData:any;
  programName:any;
  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  numCase:any;
  numLit:any;
  retPage:any;
  myExtObject:any;
  toPage:any="fju0100";
  asyncObservable: Observable<string>;
  result:any = [];
  tmpResult:any = [];
  dataSearch:any = [];
  judge_id:any;
  judge_name:any;
  stype:any;
  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldNull:any;
  public listFieldType:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  masterSelect:boolean = false;
  //@ViewChild('fca0200',{static: true}) fca0200 : ElementRef;
  //@ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  // @ViewChild('fca1000',{static: true}) case_type : ElementRef;
  //@ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  public loadModalComponent: boolean = false;
  public loadModalJudgeComponent: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private excelService: ExcelService,
    private activatedRoute: ActivatedRoute,
    private printReportService: PrintReportService,
  ){ }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 30,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      destroy: true
    };

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.successHttp();

     //======================== pcase_type ======================================
     var student = JSON.stringify({
      "table_name" : "pcase_type",
      "field_id" : "case_type",
      "field_name" : "case_type_desc",
      "order_by": " case_type ASC",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseType = getDataOptions;
        this.selCaseType = $("body").find("ng-select#case_type span.ng-value-label").html();

      },
      (error) => {}
    )

  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fca1000"
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
          // this.defaultTitle = getDataAuthen.defaultTitle;
          // this.defaultRedTitle = getDataAuthen.defaultRedTitle;
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
    this.dtTrigger.next(null);
     }

  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }

    ngAfterContentInit() : void{
     myExtObject.callCalendar();
    }

    loadMyModalComponent(){
      this.loadComponent = false;
      this.loadModalComponent = true;
      $("#exampleModal").find(".modal-body").css("height","100px");
    }

    checkUncheckAll(obj:any,master:any,child:any) {
      for (var i = 0; i < obj.length; i++) {
        obj[i][child] = this[master];
      }
      // this.getCheckedItemList();
    }

    isAllSelected(obj:any,master:any,child:any) {
      this[master] = obj.every(function(item:any) {
        return item[child] == true;
      })
      // this.getCheckedItemList();
    }

    closeModal(){
      $('.modal')
      .find("input[type='text'],input[type='password'],textarea,select")
      .val('')
      .end()
      .find("input[type=checkbox], input[type=radio]")
      .prop("checked", "")
      .end();
    }

    loadTableComponent(val:any){
      this.loadModalComponent = false;
      this.loadComponent = false;
      this.loadModalJudgeComponent = true;
      $("#exampleModal").find(".modal-body").css("height","auto");
   }

   changeCaseType(val:any){
    //========================== ptitle ====================================
    var student = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": "AND title_flag='1' AND case_type='"+val+"'",
      "order_by": " order_id ASC",
      "userToken" : this.userData.userToken
    });

    var student2 = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title",
      "field_name": "title",
      "condition": "AND title_flag='2' AND case_type='"+val+"'",
      "order_by": " order_id ASC",
      "userToken" : this.userData.userToken
    });

    var student3 = JSON.stringify({
      "table_name": "pcase_cate",
      "field_id": "case_cate_id",
      "field_name": "case_cate_name",
      "condition": "AND case_type='"+val+"'",
      "order_by": " case_cate_id ASC",
      "userToken" : this.userData.userToken
    });

     let promise = new Promise((resolve, reject) => {
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          //console.log(getDataOptions)
          this.getTitle = getDataOptions;
          //this.selTitle = this.fca0200Service.defaultTitle;
        },
        (error) => {}
      )

      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student2 ).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          //console.log(getDataOptions)
          this.getRedTitle = getDataOptions;
        },
        (error) => {}
      )

       this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student3 ).subscribe(
        (response) =>{
         let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseCate = getDataOptions;
     },
         (error) => {}
       )

    this.result.case_cate_id = null;
    this.result.title = null;
    });
    return promise;
  }



    searchData(){
      console.log(this.result)
      if(!this.result.sdate &&
        !this.result.id1 &&
        !this.result.id2 &&
        !this.result.yy
       ){
          const confirmBox = new ConfirmBoxInitializer();
          confirmBox.setTitle('ข้อความแจ้งเตือน');
          confirmBox.setMessage('ป้อนเงื่อนไขเลขคดีหรือวันที่เพื่อค้นหา');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){this.SpinnerService.hide();}
            subscription.unsubscribe();
          });
      }else{
        this.SpinnerService.show();
        this.tmpResult = this.result;
        var jsonTmp = $.extend({}, this.tmpResult);
        jsonTmp['userToken'] = this.userData.userToken;

        var student = jsonTmp;
        console.log(student)

        this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/fca1000', student ).subscribe(
          (response) =>{
              let productsJson : any = JSON.parse(JSON.stringify(response));
              if(productsJson.result==1){
                this.checklist = this.posts;
                // if(productsJson.length){
                // this.posts.forEach((x : any ) => x.edit1000 = true);
                // this.rerender();
                // }
                  var bar = new Promise((resolve, reject) => {
                  productsJson.data.forEach((ele, index, array) => {
                    productsJson.data[index]['order_num'] = index + 1;
                    productsJson.data[index]['edit1000'] = true;
                    });
                });

                bar.then(() => {
                  //this.dataSearch = productsJson.data;
                  //console.log(this.dataSearch)
                });

                this.dataSearch = productsJson.data;
                this.masterSelect = true;
                // if(productsJson.length){
                // this.dataSearch.forEach((x : any ) => x.edit1000 = true);
                // this.rerender();
                // }
                // this.numCase = productsJson.num_case;
                // this.numLit = productsJson.num_lit;
                //this.dtTrigger.next(null);
                this.rerender();
                console.log(this.dataSearch)
              }else{
                this.dataSearch = [];
                this.rerender();
                // this.numCase = 0;
                // this.numLit = 0;
              }
              console.log(productsJson)
              this.SpinnerService.hide();
          },
          (error) => {}
        )

      }
    }

    printReport(val:any){

    this.ListData();
    if(this.checkedList.length < 1){
      return(false);
    }


      var rptName = 'rca_cover';

      // For no parameter : paramData ='{}'
      var paramData ='{}';
      var prun = [...new Set(this.checkedList)];

      // For set parameter to report
      var paramData = JSON.stringify({
        "prun_id" : prun.join(),
        "pcover" : val.toString(),
       });
      console.log(paramData);
      this.printReportService.printReport(rptName,paramData);
    }

    directiveDate(date:any,obj:any){
      this.result[obj] = date;
    }

    ListData(){
      // alert('xxxxx');
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      var print = 0;
      this.checkedList = [];
      var bar = new Promise((resolve, reject) => {
      this.dataSearch.forEach((ele, index, array) => {
        if(ele.edit1000 == true){
          print++;
          console.log(ele.run_id);
          this.checkedList.push(ele.run_id.toString());
          console.log(this.checkedList);
       }
      });
    });

      if(bar){
      if (!print) {
        confirmBox.setMessage('ระบุข้อมูลที่ต้องการพิมพ์');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING, // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe((resp) => {
          if (resp.success == true) {
            //  this.result.setFocus('barcode');
          }
          subscription.unsubscribe();
        });
      }
      }

    }

}







