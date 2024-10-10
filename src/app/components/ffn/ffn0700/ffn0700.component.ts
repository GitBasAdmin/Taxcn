import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,AfterContentInit,OnDestroy,Injectable   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { ExcelService } from 'src/app/services/excel.service.ts';

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
  selector: 'app-ffn0700,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './ffn0700.component.html',
  styleUrls: ['./ffn0700.component.css']
})


export class Ffn0700Component implements AfterViewInit, OnInit, OnDestroy {
  //form: FormGroup;
  title = 'datatables';

  getCaseType:any;selCaseType:any;
  getDateType:any;selDateType:any;
  getPayType:any;
  getPgroupId:any;
  getJudge:any;
  posts:any;
  search:any;
  Mycond2:any;
  Mycond:any;
  deposit:any;
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
  numCase:any;
  numLit:any;
  sum_cash:any;
  sum_check:any;
  asyncObservable: Observable<string>;
  result:any = [];
  tmpResult:any = [];
  dataSearch:any = [];
  myExtObject:any;
  judge_id:any;
  toPageR:any='fju0100';
  toPageB:any='ffn0620';
  judge_name:any;
  date_type:any;
  getCaseCate:any;
  getCaseStatus:any;
  getConResult:any;
  getTitle:any;
  getRedTitle:any;
  getJudgeFileType:any;
  getJudgeFileDss:any;
  getEfile:any;
  modalType:any;
  MapGroup:any;
  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldType:any;
  public listFieldCond:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  //@ViewChild('fca0200',{static: true}) fca0200 : ElementRef;
  //@ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  // @ViewChild('ffn0700',{static: true}) case_type : ElementRef;
  //@ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  public loadModalComponent: boolean = false;
  public loadModalJudgeComponent: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private excelService: ExcelService,
    private authService: AuthService
  ){ }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 30,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      destroy: true,
      // lengthChange : false,
      // info : false,
      // paging : false,
      // searching : false
    };

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    // this.dataSearch.deposit = "0.00";
    this.sum_cash = "0.00";
    this.sum_check = "0.00";
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
        this.selCaseType = $("body").find("ng-select#case_type span.ng-value-label").html();

      },
      (error) => {}
    )

//======================== preceipt_type ======================================
var student = JSON.stringify({
  "table_name" : "preceipt_type",
  "field_id" : "receipt_type_id",
  "field_name" : "receipt_type_desc",
  "order_by": " receipt_type_id ASC",
  "userToken" : this.userData.userToken
});
//console.log(student)
this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
  (response) =>{

    let getDataOptions : any = JSON.parse(JSON.stringify(response));
    this.getPayType = getDataOptions;
    //this.result.pay_type = $("body").find("ng-select#pay_type span.ng-value-label").html();
    this.result.pay_type = 0;
    this.result.pgroup_id = 0;
  },
  (error) => {}
)




// //console.log(student)

//  this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student , {headers:headers}).subscribe(
//      (response) =>{
//        let productsJson :any = JSON.parse(JSON.stringify(response));
//        if(productsJson.data.length){
//          this.list=productsJson.data;
//          console.log(this.list)
//        }else{
//           this.list = [];
//        }
//       //  this.list = response;
//       // console.log('xxxxxxx',response)
//      },
//      (error) => {}
//    )

    //  //======================== pcase_cate ======================================
    //  var student = JSON.stringify({
    //   "table_name" : "pcase_cate",
    //   "field_id" : "case_cate_id",
    //   "field_name" : "case_cate_name",
    //   "condition": "AND case_type="+this.result.case_type,
    //   "order_by" : "case_cate_id ASC",
    //   "userToken" : this.userData.userToken
    // });

    // this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
    //   (response) =>{
    //     let getDataOptions : any = JSON.parse(JSON.stringify(response));
    //     this.getCaseCate = getDataOptions;
    //   },
    //   (error) => {}
    // )

    // //======================== pcase_status ======================================
    // var student = JSON.stringify({
    //   "table_name" : "pcase_status",
    //   "field_id" : "case_status_id",
    //   "field_name" : "case_status",
    //   "order_by" : "order_no ASC, case_status_id ASC",
    //   "userToken" : this.userData.userToken
    // });
    // this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
    //   (response) =>{
    //     let getDataOptions : any = JSON.parse(JSON.stringify(response));
    //     this.getCaseStatus = getDataOptions;
    //     //console.log(getDataOptions)
    //   },
    //   (error) => {}
    // )

    //  //======================== pjudge ======================================
    //  var student = JSON.stringify({
    //   "table_name" : "pjudge",
    //   "field_id" : "judge_id",
    //   "field_name" : "judge_name",
    //   "userToken" : this.userData.userToken
    // });
    // this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
    //   (response) =>{
    //     let getDataOptions : any = JSON.parse(JSON.stringify(response));
    //     this.getJudge = getDataOptions;
    //     this.getJudge.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
    //   },
    //   (error) => {}
    // )
    //    this.getConResult = [{id:'',text:''},{id: '1',text: 'จำหน่ายคดี'},{id: '2',text: 'สำเร็จ'},{id: '3',text: 'ไม่สำเร็จ'}];
      //  this.getDateType = [{id:'1',text:'วันที่ออกแดงตั้งแต่'},{id:'2',text:'วันที่แจ้งการอ่านตั้งแต่'}];
      //  this.result.date_type = '1';
      //  this.getConResult = [{id:'',text:''},{id:'1',text:'จำหน่ายคดี'},{id:'2',text:'สำเร็จ'},{id:3,text:'ไม่สำเร็จ'}];
      //  this.getJudgeFileType = [{id:'1',text:'ทั้งหมด'},{id:'2',text:'พิมพ์คำพิพากษาแล้ว'},{id:'3',text:'ยังไม่ได้พิมพ์คำพิพากษา'}];
      //  this.result.judge_file_type = '1';
      //  this.getJudgeFileDss = [{id:'1',text:'ทั้งหมด'},{id:'2',text:'Upload ไฟล์คำพิพากษาแล้ว'},{id:'3',text:'ยังไม่ได้ Upload ไฟล์คำพิพากษา'}];
      //  this.result.judge_file_dss = '1';
      //  this.getEfile = [{id:'',text:'คดีทั้งหมด(รวมคดีที่ยื่นฟ้อง e-filing)'},{id:'1',text:'เฉพาะคดีที่ยื่นฟ้อง e-filing'},{id:'2',text:'ไม่รวมคดีที่ยื่นฟ้อง e-filing'}];
      //  this.result.efile = '';
       this.result.rcv_chk = '0';
       this.result.rcv_type = '0';
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
      "url_name" : "ffn0700"
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
    this.dtTrigger.next(null);
     }

  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }

    ngAfterContentInit() : void{
      this.result.cFlag = 1;
      myExtObject.callCalendar();
    }

    loadMyModalComponent(){
      this.loadComponent = false;
      this.loadModalComponent = true;
      $("#exampleModal").find(".modal-body").css("height","100px");
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

      //console.log("fCaseTitle")
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      let promise = new Promise((resolve, reject) => {
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            //console.log(getDataOptions)
            this.getTitle = getDataOptions;
            //this.selTitle = this.fca0200Service.defaultTitle;
          },
          (error) => {}
        )

        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student2 , {headers:headers}).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            //console.log(getDataOptions)
            this.getRedTitle = getDataOptions;
          },
          (error) => {}
        )

         this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student3 , {headers:headers}).subscribe(
          (response) =>{
           let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getCaseCate = getDataOptions;
       },
           (error) => {}
         )

      });
      return promise;
    }

    changePayType(val:any){
      // alert(val);
      //========================== preceipt_map_group ====================================
      var student = JSON.stringify({
        "receipt_type_id": val,
        "userToken" : this.userData.userToken
      });

      console.log(student)
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      let promise = new Promise((resolve, reject) => {
        this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/getReceiptGroup', student , {headers:headers}).subscribe(
          (response) =>{
            //console.log(response);
            //console.log(JSON.stringify(response));
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            console.log(getDataOptions.data)
            for(var i=0;i<getDataOptions.data.length;i++){
              getDataOptions.data[i]['fieldIdValue'] = getDataOptions.data[i]['group_id'];
              delete getDataOptions.data[i]['group_id'];
              getDataOptions.data[i]['fieldNameValue'] = getDataOptions.data[i]['group_desc'];
              delete getDataOptions.data[i]['group_desc'];
             }
            this.getPgroupId = getDataOptions.data;
            if(val>=1){
              this.result.pgroup_id = this.getPgroupId[0].fieldIdValue;
            }else{
              this.result.pgroup_id = 0;
            }

            //this.MapGroup = (1,5,7);
            //alert(this.MapGroup);
            //this.selTitle = this.fca0200Service.defaultTitle;
          },
          (error) => {}
        )
      });
      return promise;
      }


    closeModal(){
      $('.modal')
      .find("input[type='text'],input[type='password'],textarea,select")
      .val('')
      .end()
      .find("input[type=checkbox], input[type=radio]")
      .prop("checked", "")
      .end();
      this.loadModalComponent = false;
      this.loadModalComponent = false;
      this.loadModalJudgeComponent = false;
    }

    receiveFuncListData(event:any){
      this.result.result_id = event.fieldIdValue;
      this.result.result_desc = event.fieldNameValue;
      this.closebutton.nativeElement.click();
      console.log(event)
    }

    clickOpenMyModalComponent(val:any){
      this.modalType = val;
      if(this.modalType==1 || this.modalType==2 || this.modalType==3){
        this.loadModalJudgeComponent = true;
        this.loadModalComponent = false;
        this.loadComponent = false;
        var student = JSON.stringify({
          "cond":2,
          "userToken" : this.userData.userToken
        });
        this.listTable='pjudge';
        this.listFieldId='judge_id';
        this.listFieldName='judge_name';
        this.listFieldNull='';
        this.listFieldType=JSON.stringify({"type":2});

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
      }else if(this.modalType==4){//ผลคำพิพากษา
        $("#exampleModal").find(".modal-content").css("width","700px");
        var student = JSON.stringify({
          "table_name" : "pjudge_result",
          "field_id" : "result_id",
          "field_name" : "result_desc",
          "search_id" : "",
          "search_desc" : "",
          "condition" : " AND case_type='"+this.result.case_type+"'",
          "userToken" : this.userData.userToken});
        this.listTable='pjudge_result';
        this.listFieldId='result_id';
        this.listFieldName='result_desc';
        this.listFieldNull='';
        this.listFieldCond=" AND case_type='"+this.result.case_type+"'";
      }

      //ส่วนนี้จะใช้กับ popup return ธรรมดา
      if(this.modalType==4){
        this.loadModalComponent = false;
        this.loadComponent = true;
        this.loadModalJudgeComponent = false;
        console.log(student)
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student , {headers:headers}).subscribe(
          (response) =>{
            console.log(response)
            this.list = response;
          },
          (error) => {}
        )
      }
    }

    loadTableComponent(val:any){
      this.loadModalComponent = false;
      this.loadComponent = true;
      this.loadModalJudgeComponent = false;
      // this.loadModalJudgeComponent = true;
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
        }
      }else{
        this.result[objName] = null;
        this[objName] = null;
      }
    }

    tabChangeInput(name:any,event:any){
      let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');
        if(name=='judge_id1' || name=='judge_id2' || name=='case_judge_id'){
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
            let productsJson : any = JSON.parse(JSON.stringify(response));

            if(productsJson.length){
              if(name=='judge_id1'){
                this.result.judge_name1 = productsJson[0].fieldNameValue;
              }else if(name=='judge_id2'){
                this.result.judge_name2 = productsJson[0].fieldNameValue;
              }else if(name=='case_judge_id'){
                this.result.case_judge_name = productsJson[0].fieldNameValue;
              }

            }else{
              if(name=='judge_id1'){
                this.result.judge_id1 = null;
                this.result.judge_name1 = '';
              }else if(name=='judge_id2'){
                this.result.judge_id2 = null;
                this.result.judge_name2 = '';
              }else if(name=='case_judge_id'){
                this.result.case_judge_id = null;
                this.result.case_judge_name = '';
              }
            }
          },
          (error) => {}
        )
      }else if(name=='result_id'){
        var student = JSON.stringify({
          "table_name" : "pjudge_result",
          "field_id" : "result_id",
          "field_name" : "result_desc",
          "condition" : " AND result_id='"+event.target.value+"' AND case_type='"+this.result.case_type+"'",
          "userToken" : this.userData.userToken
        });
        console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
          (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));

            if(productsJson.length){
              this.result.result_desc = productsJson[0].fieldNameValue;

            }else{

              this.result.result_id = '';
              this.result.result_desc = '';
            }
          },
          (error) => {}
        )
      }
    }

    receiveJudgeListData(event:any){
      if(this.modalType==1){
         this.result.case_judge_id = event.judge_id;
         this.result.case_judge_name = event.judge_name;
      }else if(this.modalType==2){
         this.result.judge_id1 = event.judge_id;
         this.result.judge_name1 = event.judge_name;
      }else if(this.modalType==3){
        this.result.judge_id2 = event.judge_id;
        this.result.judge_name2 = event.judge_name;
      }
      this.closebutton.nativeElement.click();
    }

    searchData(){
      console.log(this.result)
      if(!this.result.case_type &&
        !this.result.pay_type &&
        !this.result.pgroup_id &&
        !this.result.title && !this.result.id && !this.result.yy &&
        !this.result.red_title && !this.result.red_id && !this.result.red_yy &&
        !this.result.sdate && !this.result.edate &&
        !this.result.sdate2 && !this.result.edate2 &&
        !this.result.book_no && !this.result.cheque_no &&
        !this.result.rcv_chk && !this.result.rcv_type){
          const confirmBox = new ConfirmBoxInitializer();
          confirmBox.setTitle('ข้อความแจ้งเตือน');
          confirmBox.setMessage('ป้อนเงื่อนไขเพื่อค้นหา');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){this.SpinnerService.hide();}
            subscription.unsubscribe();
          });
      // }else if((!this.result.case_sdate && !this.result.case_edate) && (!this.result.judging_sdate && !this.result.judging_edate) ){
      //   const confirmBox = new ConfirmBoxInitializer();
      //   confirmBox.setTitle('ข้อความแจ้งเตือน');
      //   confirmBox.setMessage('เลือกวันที่รับฟ้อง และ/หรือ วันที่ออกแดง');
      //   confirmBox.setButtonLabels('ตกลง');
      //   confirmBox.setConfig({
      //       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      //   });
      //   const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      //     if (resp.success==true){this.SpinnerService.hide();}
      //     subscription.unsubscribe();
      //   });
      }else{
        this.SpinnerService.show();
        this.tmpResult = this.result;
        var jsonTmp = $.extend({}, this.tmpResult);
        jsonTmp['userToken'] = this.userData.userToken;
        /*
        if(jsonTmp.admit_flag== 0) delete jsonTmp.admit_flag;
        if(jsonTmp.case_level== 0) delete jsonTmp.case_level;
        if(jsonTmp.case_yes_no== 0) delete jsonTmp.case_yes_no;
        if(jsonTmp.customer_flag== 0) delete jsonTmp.customer_flag;
        if(jsonTmp.guar_pros== 0) delete jsonTmp.guar_pros;
        if(jsonTmp.prosType== 0) delete jsonTmp.prosType;
        jsonTmp['userToken'] = this.userData.userToken;
        */
        //console.log(jsonTmp)
        // if(jsonTmp.card_type==1){
        //   jsonTmp.id_card = this.idCard0+this.idCard1+this.idCard2+this.idCard3+this.idCard4;
        // }
        // if(jsonTmp.card_type1==1){
        //   jsonTmp.id_card1 = this.idCard0_0+this.idCard1_1+this.idCard2_2+this.idCard3_3+this.idCard4_4;
        // }

        var student = jsonTmp;
        console.log('xxxxxxxxxxxx'+JSON.stringify(student))
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');

        this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/ffn0700', student , {headers:headers}).subscribe(
          (response) =>{
              let productsJson : any = JSON.parse(JSON.stringify(response));
              if(productsJson.result==1){

                var bar = new Promise((resolve, reject) => {
                  productsJson.data.forEach((ele, index, array) => {
                        // if(ele.short_judgement != null){
                        //   if(ele.short_judgement.length > 47 )
                        //     productsJson.data[index]['short_judgement_short'] = ele.short_judgement.substring(0,47)+'...';
                        // }
                        if(ele.case_no != null){
                          productsJson.data[index]['case_no'] = ele.case_no.split(',').join("<br>");
                        }
                        if(ele.case_no2 != null){
                          productsJson.data[index]['case_no2'] = ele.case_no2.split(',').join("\n");
                        }
                        if(ele.rcv_no != null){
                          productsJson.data[index]['rcv_no'] = ele.rcv_no.split(',').join("\n");
                        }
                        if(ele.pay_amt != null){
                          productsJson.data[index]['pay_amt'] = this.curencyFormat(ele.pay_amt,2);
                        }
                        if(ele.sum_cash != null){
                          productsJson.data[index]['sum_cash'] = this.curencyFormat(ele.sum_cash,2);
                        }
                         if(ele.sum_check != null){
                          productsJson.data[index]['sum_check'] = this.curencyFormat(ele.sum_check,2);
                        }
                    });
                });

                bar.then(() => {

                  //this.dataSearch = productsJson.data;
                  //console.log(this.dataSearch)
                });

                // if(bar){
                //   this.dataSearch = productsJson.data;
                //   this.deposit = this.curencyFormat(productsJson.deposit,2);
                //   this.rerender();
                //   //this.dtTrigger.next(null);
                //   console.log(this.dataSearch)
                // }

                this.dataSearch = productsJson.data;
                this.sum_cash = this.curencyFormat(productsJson.sum_cash,2);
                this.sum_check = this.curencyFormat(productsJson.sum_check,2);
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

    curencyFormat(n:any,d:any) {
      return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    }

    directiveDate(date:any,obj:any){
      this.result[obj] = date;
    }


    exportAsXLSX(): void {
      if(this.dataSearch){
        var excel =  JSON.parse(JSON.stringify(this.dataSearch));
        console.log(excel)
        var data = [];var extend = [];
        var bar = new Promise((resolve, reject) => {

          for(var i = 0; i < excel.length; i++){
            // if(excel[i]['title'] && excel[i]['id'] && excel[i]['yy'])
            //   excel[i]['case_no'] = excel[i]['title']+excel[i]['id']+'/'+excel[i]['yy'];
            // else
            //   excel[i]['case_no'] = "";
            // if(excel[i]['red_title'] && excel[i]['red_title'] && excel[i]['red_title'])
            //   excel[i]['red_no']  = excel[i]['red_title']+excel[i]['red_id']+'/'+excel[i]['red_yy'];
            // else
            //   excel[i]['red_no'] = "";
            // if(excel[i]['date_appoint'])
            //   excel[i]['dateAppoint'] = excel[i]['date_appoint']+"  "+excel[i]['time_appoint'];
            // else
            //   excel[i]['dateAppoint'] = "";
            // if(excel[i]['case_no'])
            //   excel[i]['case_no'] = (excel[i]['case_no'].innerHtml);


            for(var x=0;x<25;x++){
              if(x==0)
                data.push(excel[i]['post_no']);
              if(x==1)
                data.push(excel[i]['case_no2']);
              if(x==2)
                data.push(excel[i]['pay_type_desc']);
              if(x==3)
                data.push(excel[i]['sub_type_name']);
              if(x==4)
                data.push(excel[i]['rcv_no']);
              if(x==5)
                data.push(excel[i]['rcv_date2']);
              if(x==6)
                data.push(excel[i]['ref_no']);
              if(x==7)
                data.push(excel[i]['ctfin_no']);
              if(x==8)
                data.push(excel[i]['rcv_type_desc']);
              if(x==9)
                data.push(excel[i]['cheque_all']);
              if(x==10)
                data.push(excel[i]['pay_date']);
              if(x==11)
                data.push(excel[i]['pay_name']);
              if(x==12)
                data.push(excel[i]['pay_amt']);
              if(x==13)
                data.push(excel[i]['sum_cash']);
              if(x==14)
                data.push(excel[i]['sum_check']);
              if(x==15)
                data.push(excel[i]['rcv_date']);
              if(x==16)
                data.push(excel[i]['bank_pay_date']);
              if(x==17)
                data.push(excel[i]['cancel_flag']);
              if(x==18)
                data.push(excel[i]['create_dep_name']);
              if(x==19)
                data.push(excel[i]['create_user']);
              if(x==20)
                data.push(excel[i]['create_date']);
              if(x==21)
                data.push(excel[i]['update_dep_name']);
              if(x==22)
                data.push(excel[i]['update_user']);
              if(x==23)
                data.push(excel[i]['update_date']);
            }

            extend[i] = $.extend([], data)
            data = [];
            //extend[i] = Object.values(data)
          }
        });
        if(bar){
          var objExcel = [];
          objExcel['sum_cash'] = this.sum_cash;
          objExcel['sum_check'] = this.sum_check;
          objExcel['data'] = extend;
          console.log(objExcel)
          this.excelService.exportAsExcelFile(objExcel,'ffn0700' ,this.programName);
        }

      }else{
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('กรุณาค้นหาข้อมูล');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
      }
    }

    goToPage(payback_running:any,type:any){

      let winURL = window.location.href;
      if(type===1){
        winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+this.toPageB+'?payback_running='+payback_running;
      }else{
        winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+this.toPageR+'?payback_running='+payback_running;
      }

      //alert(winURL);
      window.open(winURL,'_blank', "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=1200,height=400");
      //myExtObject.OpenWindowMax(winURL+'?run_id='+run_id);
    }

}







