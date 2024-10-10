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
  selector: 'app-prco0300,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './prco0300.component.html',
  styleUrls: ['./prco0300.component.css']
})


export class Prco0300Component implements AfterViewInit, OnInit, OnDestroy {
  //form: FormGroup;
  title = 'datatables';

  getCaseType:any;selCaseType:any;
  getDateType:any;selDateType:any;
  getJudge:any;
  getRunDocTitle:any;
  getDep:any;
  getPosition:any;
  getCaseCate:any;
  getRedTitle:any;
  getTitle:any;
  posts:any;
  search:any;
  getPrintType:any;
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
  dep_id:any;
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
  // @ViewChild('prco0300',{static: true}) case_type : ElementRef;
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
    //this.successHttp();

     //======================== pdoc_title ======================================
     var student = JSON.stringify({
      "table_name" : "pdoc_title",
      "field_id": "LISTAGG(doc_title_id, '')",
      "field_name" : "doc_title",
      "condition" : "AND in_out = 1 GROUP BY doc_title",
      "order_by": "doc_title ASC",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        // getDataOptions.unshift({fieldIdValue:'',fieldNameValue: 'ทั้งหมด'});
        this.getRunDocTitle = getDataOptions;
        //console.log(getDataOptions)
      },
      (error) => {}
    )

     //======================== pdepartment ======================================
    var student = JSON.stringify({
      "table_name" : "pdepartment",
      "field_id" : "dep_code",
      "field_name" : "dep_name",
      "field_name2" : "print_dep_name",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getDep = getDataOptions;
        this.getDep.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
        console.log(this.getDep)
        // var Dep = this.getDep.filter((x:any) => x.fieldIdValue === this.userData.depCode.toString()) ;
        // if(Dep.length!=0){
        //   this.result.dep_id = this.dep_id = Dep[0].fieldIdValue;
        // }
      },
      (error) => {}
    )
    this.getPrintType = [{id: '1',text: 'เฉพาะที่บันทึกเอง'},{id: '2',text: 'ทั้งแผนก'}];
    this.getPosition = [{id: '1',text: 'ระดับที่1'},{id: '2',text: 'ระดับที่2'},{id: '3',text: 'ระดับที่3'},{id: '4',text: 'ระดับที่4'}];
    this.result.ptype = '3';
    this.result.pposition = '1';
    this.result.pprint_type = '1';
    this.result.ssend_date = myExtObject.curDate();
    this.result.esend_date = myExtObject.curDate();
    this.result.prun_doc_yy = myExtObject.curYear();
    this.result.prun_doc_title = 'ท';
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "prco0300"
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

   tabChangeSelect(objName:any,objData:any,event:any,type:any){
    if(typeof objData!='undefined'){
      if(type==1){
        var val = objData.filter((x:any) => x.fieldIdValue === event.target.value) ;
      }else{
          var val = objData.filter((x:any) => x.fieldIdValue === event);
      }
      console.log(objData)
      //console.log(event.target.value)
      //console.log(val)
      if(val.length!=0){
        this.result[objName] = val[0].fieldIdValue;
        this[objName] = val[0].fieldIdValue;
      }else{
        this.result[objName] = null;
        this[objName] = null;
      }
    }else{
      this.result[objName] = null;
      this[objName] = null;
    }
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
      if(!this.result.ssend_date && !this.result.esend_date &&
        !this.result.start_doc_id &&
        !this.result.end_doc_id &&
        !this.result.run_doc_yy
       ){
          const confirmBox = new ConfirmBoxInitializer();
          confirmBox.setTitle('ข้อความแจ้งเตือน');
          confirmBox.setMessage('ป้อนเงื่อนไขเลขที่หนังสือรับหรือวันที่เพื่อค้นหา');
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
        this.result.pend_dep = this.result.dep_id;
        this.result.user_code = this.userData.userCode;
        this.tmpResult = this.result;
        var jsonTmp = $.extend({}, this.tmpResult);
        jsonTmp['userToken'] = this.userData.userToken;


        var student = jsonTmp;
       console.log(JSON.stringify(student));

        this.http.post('/'+this.userData.appName+'ApiCO/API/CORRESP/prco0300', student ).subscribe(
          (response) =>{
              let productsJson : any = JSON.parse(JSON.stringify(response));
              if(productsJson.result==1){
                this.checklist = this.posts;
                // if(productsJson.length){
                // this.posts.forEach((x : any ) => x.edit0300 = true);
                // this.rerender();
                // }
                  var bar = new Promise((resolve, reject) => {
                  productsJson.data.forEach((ele, index, array) => {
                    productsJson.data[index]['order_num'] = index + 1;
                    productsJson.data[index]['edit0300'] = true;
                    });
                });

                bar.then(() => {
                  //this.dataSearch = productsJson.data;
                  //console.log(this.dataSearch)
                });

                this.dataSearch = productsJson.data;
                this.masterSelect = true;
                // if(productsJson.length){
                // this.dataSearch.forEach((x : any ) => x.edit0300 = true);
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


      var rptName = 'rco0300';

      // For no parameter : paramData ='{}'
      var paramData ='{}';
      var phistory_running = [...new Set(this.checkedList)];

      // For set parameter to report
      var paramData = JSON.stringify({
        "prun_doc_title" : this.result.prun_doc_title,
        "phistory_running" : phistory_running.join(),
        "pdep_id" : this.result.dep_id ? this.result.dep_id : '',
        "pdate_start" : myExtObject.conDate(this.result.ssend_date),
        "pdate_end" : myExtObject.conDate(this.result.esend_date) ,
        "ptype" : this.result.pprint_type,
        "pposition" : this.result.pposition,
        "pdep_code" : this.userData.depCode,
        "puser_id" : this.userData.userCode,
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
        if(ele.edit0300 == true){
          print++;
          console.log(ele.history_running);
          this.checkedList.push(ele.history_running.toString());
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







