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
import { PrintReportService } from 'src/app/services/print-report.service';
declare var myExtObject: any;
//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


pdfMake.fonts = {
  'Roboto' : {
    normal: `Roboto-Regular.ttf`,
    bold: `Roboto-Medium.ttf`,
    italics: `Roboto-Italic.ttf`,
    bolditalics: `Roboto-MediumItalic.ttf`
  },
  'THSarabunNew' : {
    normal: 'THSarabunNew.ttf',
    bold: 'THSarabunNew Bold.ttf',
    italics: 'THSarabunNew Italic.ttf',
    bolditalics: 'THSarabunNew BoldItalic.ttf'
  }
}

@Component({
  selector: 'app-ffn0500,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './ffn0500.component.html',
  styleUrls: ['./ffn0500.component.css']
})


export class Ffn0500Component implements AfterViewInit, OnInit, OnDestroy {
  //form: FormGroup;
  title = 'datatables';
  textCheckPrint:any;
  posts:any;
  search:any;
  masterSelected:boolean;
  checklist:any;
  checkedList:any;
  delValue:any;
  sessData:any;
  userData:any;
  getCourt:any;
  getDep:any;
  getOff:any;
  getPgroupId:any;
  getRcvFlag:any;
  getDataType:any;
  getPType:any;
  modalType:any;
  total_fee:any;
  total_cheque:any;
  result:any = [];
  tmpResult:any = [];
  dataSearch:any = [];
  dataS:any = [];
  dataExcel:any = [];
  toPageR:any='fju0100';
  toPageB:any='fmg0100';
  toPageF:any='ffn0400';
  myExtObject:any;
  court_id:any;
  dep_id:any;
  off_id:any;
  rows:any;
  total:any;
  cPage:any;
  pCount:any;
  sum_transfer:any;
  sum_cash:any;
  sum_cheque:any;
  sum_fee:any;
  sum_credit:any;
  num_cancel:any;
  num_by_hand:any;
  num_cheque:any;
  sum_by_hand_cash:any;
  sum_by_hand_cheque:any;
  sum_by_hand_credit:any;
  sum_by_hand_fee:any;
  sum_by_hand_transfer:any;
  sum_cancel_cash:any;
  sum_cancel_cheque:any;
  sum_cancel_credit:any;
  sum_cancel_transfer:any;
  sum_cancel_fee:any;
  hid_court_type:any;
  pgrcv_running = [];
  programName:any;
  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  asyncObservable: Observable<string>;

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
  // @ViewChild('ffn0500',{static: true}) case_type : ElementRef;
  //@ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  public loadModalComponent: boolean = false;
  public loadModalJudgeComponent: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private excelService: ExcelService,
    private printReportService: PrintReportService,
    private authService: AuthService
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
    // this.activatedRoute.queryParams.subscribe(params => {
    //   if(params['program'])
    //     this.retPage = params['program'];
    // });

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.sum_cash = "0.00";
    this.sum_transfer = "0.00";
    this.sum_cheque = "0.00";
    this.sum_credit = "0.00";
    this.sum_fee = "0.00";
    this.sum_by_hand_cash = "0.00";
    this.sum_by_hand_transfer = "0.00";
    this.sum_by_hand_cheque = "0.00";
    this.sum_by_hand_credit = "0.00";
    this.sum_by_hand_fee = "0.00";
    this.sum_cancel_cash = "0.00";
    this.sum_cancel_cheque = "0.00";
    this.sum_cancel_cash = "0.00";
    this.sum_cancel_credit = "0.00";
    this.sum_cancel_transfer = "0.00";
    this.result.pcourt_type = "0";
    this.result.sdate = myExtObject.curDate();
    this.result.edate = myExtObject.curDate();
    this.successHttp();

    //   //======================== pcase_type ======================================
    // var student = JSON.stringify({
    //   "table_name" : "pcase_type",
    //   "field_id" : "case_type",
    //   "field_name" : "case_type_desc",
    //   "order_by": " case_type ASC",
    //   "userToken" : this.userData.userToken
    // });
    // //console.log(student)
    // this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
    //   (response) =>{
    //     let getDataOptions : any = JSON.parse(JSON.stringify(response));
    //     this.getCaseType = getDataOptions;
    //     this.selCaseType = $("body").find("ng-select#case_type span.ng-value-label").html();
    //   },
    //   (error) => {}
    // )
    // //======================== pcase_special ======================================
    // var student = JSON.stringify({
    //   "table_name" : "pcase_special",
    //   "field_id" : "special_id",
    //   "field_name" : "special_case",
    //   "order_by" : "order_no ASC, special_id ASC",
    //   "userToken" : this.userData.userToken
    // });
    // this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
    //   (response) =>{
    //     let getDataOptions : any = JSON.parse(JSON.stringify(response));
    //     this.getCaseSpecial = getDataOptions;
    //     //console.log(getDataOptions)
    //   },
    //   (error) => {}
    // )
    //======================== pcourt ======================================
    var student = JSON.stringify({
      "table_name" : "pcourt",
      "field_id" : "court_id",
      "field_name" : "court_name",
      "field_name2" : "court_running",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCourt = getDataOptions;
        console.log(this.getCourt)
        // var court = this.getCourt.filter((x:any) => x.fieldIdValue === this.userData.courtId) ;
        // if(court.length!=0){
        //   this.result.court_id = this.court_id = court[0].fieldIdValue;
        // }
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
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getDep = getDataOptions;
        this.getDep.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
        console.log(this.getDep)
        var Dep = this.getDep.filter((x:any) => x.fieldIdValue === this.userData.depCode.toString()) ;
        if(Dep.length!=0){
          this.result.dep_id = this.dep_id = Dep[0].fieldIdValue;
        }
      },
      (error) => {}
    )

     //======================== pofficer ======================================
     var student = JSON.stringify({
      "table_name" : "pofficer",
      "field_id" : "off_id",
      "field_name" : "off_name",
      "field_name2" : "dep_code",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getOff = getDataOptions;
        console.log(this.getOff)
        var Off = this.getOff.filter((x:any) => x.fieldIdValue === this.userData.userCode) ;
        if(Off.length!=0){
          this.result.off_id = this.off_id = Off[0].fieldIdValue;
        }
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
    this.getRcvFlag = getDataOptions;
    //this.result.rcv_flag = $("body").find("ng-select#rcv_flag span.ng-value-label").html();
    this.result.rcv_flag = 0;
    this.result.pgroup_id = 0;
    this.result.pdata_type = '0';
    this.result.ptype = '0';
  },
  (error) => {}
)

    this.getDataType = [{id:'0',text:'ทั้งหมด'},{id:'1',text:'เฉพาะ E-Filing'},{id:'2',text:'ไม่รวม E-Filing'}];
    this.getPType = [{id:'0',text:'ทั้งหมด'},{id:'1',text:'เงินสด'},{id:'2',text:'เช็ค'},{id:'3',text:'บัตรเครดิต'},{id:'4',text:'เงินโอน'},{id:'99',text:'เงินสดและเช็ค'}];
  }

  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "ffn0500"
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

     ngAfterContentInit() : void{
      this.result.cFlag = 1;
      myExtObject.callCalendar();
    }

  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }

    loadMyModalComponent(){
      this.loadComponent = false;
      this.loadModalComponent = true;
      $("#exampleModal").find(".modal-body").css("height","100px");
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
          //  alert(val.length);
          this.result[objName] = val[0].fieldIdValue;
          this[objName] = val[0].fieldIdValue;
          // if(objName=='zone_id'){
          //   this.changeAmphur(val[0].fieldIdValue,1);
        }else{
          this.result[objName] = null;
          this[objName] = null;
        }
        }else{
          // alert(val);
          this.result[objName] = null;
          this[objName] = null;
        }
      }

      changeRcvFlag(val:any){
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

        curencyFormat(n:any,d:any) {
          return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        }//100000 เป็น 100,000.00


        curencyFormatRevmove(val: number): string {
          if (val !== undefined && val !== null) {
            return val.toString().replace(/,/g, "").slice(.00, -3); ;
          } else {
            return "";
          }
        } // 100,000.00 เป็น  100000.

        directiveDate(date:any,obj:any){
          this.result[obj] = date;
        }


        exportAsXLSX(): void {
          if(this.dataExcel.length != 0){
            var excel =  JSON.parse(JSON.stringify(this.dataExcel));
            console.log(excel)
            var data = [];var extend = [];
            var bar = new Promise((resolve, reject) => {

              for(var i = 0; i < excel.length; i++){
                   if(excel[i]['sum_transfer'])
                      excel[i]['sum_transfer'] = Number(this.curencyFormatRevmove(excel[i]['sum_transfer'] )) ;
                   else
                      excel[i]['sum_transfer'] = 0;
                   if(excel[i]['cash_amt'])
                      excel[i]['cash_amt'] =  Number(this.curencyFormatRevmove(excel[i]['cash_amt']));
                   else
                      excel[i]['cash_amt'] = 0;
                   if(excel[i]['cheque_amt'])
                      excel[i]['cheque_amt'] = Number(this.curencyFormatRevmove(excel[i]['cheque_amt']));
                   else
                      excel[i]['cheque_amt'] = 0;
                   if(excel[i]['credit_amt'])
                      excel[i]['credit_amt'] = Number(this.curencyFormatRevmove(excel[i]['credit_amt']));
                   else
                      excel[i]['sum_fee'] = 0;
                      if(excel[i]['sum_fee'])
                      excel[i]['sum_fee'] = Number(this.curencyFormatRevmove(excel[i]['sum_fee']));
                   else
                      excel[i]['sum_fee'] = 0;
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
                // if(excel[i]['old_red_no'])
                //   excel[i]['oldCaseNo'] = excel[i]['old_case_no']+" ("+excel[i]['old_red_no']+")";
                // else
                //   excel[i]['oldCaseNo'] = excel[i]['old_case_no'];

                for(var x=0;x<24;x++){
                  if(x==0)
                    data.push(excel[i]['case_no']);
                  if(x==1)
                    data.push(excel[i]['red_no']);
                  if(x==2)
                    data.push(excel[i]['old_case_no']);
                  if(x==3)
                    data.push(excel[i]['old_red_no']);
                  if(x==4)
                    data.push(excel[i]['pros_desc']);
                  if(x==5)
                    data.push(excel[i]['accu_desc']);
                  if(x==6)
                    data.push(excel[i]['rcv_date']);
                  if(x==7)
                    data.push(excel[i]['receipt_type_desc']);
                  if(x==8)
                    data.push(excel[i]['book_no']);
                  if(x==9)
                    data.push(excel[i]['receipt_no']);
                  if(x==10)
                    data.push(excel[i]['def_name']);
                  if(x==11)
                    data.push(excel[i]['transfer_amt']);
                  if(x==12)
                    data.push(excel[i]['cash_amt']);
                  if(x==13)
                    data.push(excel[i]['cheque_amt']);
                  if(x==14)
                    data.push(excel[i]['cheque_no']);
                  if(x==15)
                    data.push(excel[i]['credit_amt']);
                  if(x==16)
                    data.push(excel[i]['sum_fee']);
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
              objExcel['total_fee'] = this.total_fee;
              objExcel['num_cancel'] = this.num_cancel;
              objExcel['sum_transfer'] = this.sum_transfer;
              objExcel['sum_cash'] = this.sum_cash;
              objExcel['sum_cheque'] = this.sum_cheque;
              objExcel['sum_credit'] = this.sum_credit;
              objExcel['sum_fee'] = this.sum_fee;
              objExcel['data'] = extend;
              console.log(objExcel)
              this.excelService.exportAsExcelFile(objExcel,'ffn0500' ,this.programName);
            }

          }else{
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage('ค้นหาข้อมูลก่อนพิมพ์');
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

        getMessage(){
          const confirmBox = new ConfirmBoxInitializer();
          confirmBox.setTitle('ข้อความแจ้งเตือน');
          confirmBox.setMessage('ค้นหาข้อมูลก่อนพิมพ์');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){}
            subscription.unsubscribe();
          });
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
          this.hid_court_type = this.result.pcourt_type;
          this.pgrcv_running = [];
          if(!this.result.court_id &&
            !this.result.pay_type &&
            !this.result.pbook_no && !this.result.prcv_sno && !this.result.prcv_eno &&
            !this.result.pcourt_type && !this.result.dep_id && !this.result.off_id &&
            !this.result.rcv_flag && !this.result.pgroup_id && !this.result.pdata_type &&
            !this.result.sdate && !this.result.edate &&
            !this.result.cheque_book_no && !this.result.cheque_no &&
            !this.result.ptype && !this.result.cancel_receipt){
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

            this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/ffn0500', student , {headers:headers}).subscribe(
              (response) =>{
                  let productsJson : any = JSON.parse(JSON.stringify(response));
                  if(productsJson.result==1){
                   this.dataExcel = productsJson.data;
                    var bar = new Promise((resolve, reject) => {
                      productsJson.data.forEach((ele, index, array) => {
                            //  if(ele.short_judgement != null){
                            //    if(ele.short_judgement.length > 47 )
                            //      productsJson.data[index]['short_judgement_short'] = ele.short_judgement.substring(0,47)+'...';
                            //  }
                            // this.total_fee = productsJson.data.length;
                            // this.sum_fee = productsJson.sum_fee;
                            // if(ele.sum_cash != null){
                            //   productsJson.data[index]['deposit_comma'] = this.curencyFormat(ele.sum_cash,2);
                            // }
                            // // alert("xxxx");

                            if(ele.transfer_amt != null){
                              productsJson.data[index]['transfer_amt'] = this.curencyFormat(ele.transfer_amt,2);
                            }
                            if(ele.cash_amt != null){
                              productsJson.data[index]['cash_amt'] = this.curencyFormat(ele.cash_amt,2);
                            }
                            if(ele.cheque_amt != null){
                              productsJson.data[index]['cheque_amt'] = this.curencyFormat(ele.cheque_amt,2);
                            }
                            if(ele.credit_amt != null){
                              productsJson.data[index]['credit_amt'] = this.curencyFormat(ele.credit_amt,2);
                            }
                            if(ele.sum_fee != null){
                              productsJson.data[index]['sum_fee'] = this.curencyFormat(ele.sum_fee,2);
                            }
                            if(ele.sum_total != null){
                              productsJson.data[index]['sum_total'] = this.curencyFormat(ele.sum_total,2);
                            }
                            if(ele.run_id != null){
                              this.pgrcv_running.push(ele.run_id);
                            }
                        });
                    });

                    bar.then(() => {

                      // this.dataSearch = productsJson.data;
                      //console.log(this.dataSearch)
                    });

                    if(bar){
                      this.dataSearch = productsJson.data;
                      this.dataS = productsJson;
                      // this.deposit = this.curencyFormat(productsJson.deposit,2);
                      this.rerender();
                      //this.dtTrigger.next(null);
                      console.log(this.dataSearch)
                    }

                    // this.dataSearch = productsJson.data;
                    // this.deposit = this.curencyFormat(productsJson.deposit,2);
                    // this.result.deposit
                    this.total_fee = productsJson.data.length;
                    this.num_cheque = productsJson.num_cheque;
                    this.num_cancel = productsJson.num_cancel;
                    this.num_by_hand = productsJson.num_by_hand;
                    this.sum_transfer = this.curencyFormat(productsJson.sum_transfer,2);
                    this.sum_cheque = this.curencyFormat(productsJson.sum_cheque,2);
                    this.sum_cash = this.curencyFormat(productsJson.sum_cash,2);
                    this.sum_credit = this.curencyFormat(productsJson.sum_credit,2);
                    this.sum_fee = this.curencyFormat(productsJson.sum_fee,2);
                    this.sum_by_hand_transfer = this.curencyFormat(productsJson.sum_by_hand_transfer,2);
                    this.sum_by_hand_cheque = this.curencyFormat(productsJson.sum_by_hand_cheque,2);
                    this.sum_by_hand_cash = this.curencyFormat(productsJson.sum_by_hand_cash,2);
                    this.sum_by_hand_credit = this.curencyFormat(productsJson.sum_by_hand_credit,2);
                    this.sum_by_hand_fee = this.curencyFormat(productsJson.sum_by_hand_fee,2);
                    this.sum_cancel_transfer = this.curencyFormat(productsJson.sum_cancel_transfer,2);
                    this.sum_cancel_cheque = this.curencyFormat(productsJson.sum_cancel_cheque,2);
                    this.sum_cancel_cash = this.curencyFormat(productsJson.sum_cancel_cash,2);
                    this.sum_cancel_credit = this.curencyFormat(productsJson.sum_cancel_credit,2);
                    this.sum_cancel_fee = this.curencyFormat(productsJson.sum_cancel_fee,2);
                    //this.dtTrigger.next(null);
                    this.rerender();

                    // console.log("oooooooooooo"+this.dataSearch.data[0]['sum_total']);
                  }else{
                    this.dataSearch = [];
                    this.rerender();
                    // this.data.cash_amt = 0;
                    this.sum_transfer = 0;
                  }
                  console.log(productsJson)
                  this.SpinnerService.hide();
              },
              (error) => {}
            )

          }
        }

        goToPage(run_id:any,receipt_running:any,type:any){

          let winURL = window.location.href;
          if(type===1){
            winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+this.toPageB+'?run_id='+run_id;
          }else if(type===2){
            winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+this.toPageR+'?run_id='+run_id;
          }else if(type===3){
            winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+this.toPageF+'?run_id='+run_id+'&receipt_running='+receipt_running;
          }

          //alert(winURL);
          // window.open(winURL,'_blank', "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=1200,height=400");
          myExtObject.OpenWindowMax(winURL);
        }

        printReport(type:any){

          var rptName = 'rffn0500';
          // if(type==1){
          //   rptName='rffn0500';
          // }
          if(type==3){
            rptName= 'rffn0540';
          }else if(type==4){
            rptName= 'rfn0500';
          }


          // For no parameter : paramData ='{}'
          var paramData ='{}';

          // For set parameter to report
           var paramData = JSON.stringify({
            // //  "pcase_type" : this.selCaseType,
            //  "pcase_cate_id" : this.pcase_cate_id,
            //  "pcase_status_id" : this.pcase_status_id,
            //  "ptable_id" : this.table_id,
             "pdate_start" : myExtObject.conDate($("#sdate").val()),
             "pdate_end" : myExtObject.conDate($("#edate").val()),
             "pflag" : type,
             "pbook_no" : this.result.book_no ? this.result.book_no : '',
             "pgroup_id" : this.result.pgroup_id != '0' ? this.result.pgroup_id : '',
             "prcv_sno" : this.result.prcv_sno ? this.result.prcv_sno : '',
             "prcv_eno" : this.result.prcv_eno ? this.result.prcv_eno : '',
             "pcourt_type" : this.result.pcourt_type != '0' ? this.result.pcourt_type : '',
             "pcourt_id" : this.result.court_id ? this.result.court_id : '',
             "pdep_code" : this.result.dep_id ? this.result.dep_id : '',
             "poff_id" : this.result.off_id ? this.result.off_id : '',
             "prcv_flag" : this.result.rcv_flag != '0' ? this.result.rcv_flag : '',
             "pcheck_book_no" : this.result.cheque_book_no ? this.result.cheque_book_no : '',
             "pcheck_no" : this.result.cheque_no ? this.result.cheque_no : '',
             "ptype" : this.result.ptype != '0' ? this.result.ptype : '',
             "pefile" : this.result.pdata_type != '0' ? this.result.pdata_type : '',
             "pgrcv_running" : this.pgrcv_running.toString(),
           });
          // alert(paramData);return false;
          console.log(paramData);
          if(this.dataSearch?.length != 0){
            this.printReportService.printReport(rptName,paramData);
          }else{
            // alert('ค้นหาข้อมูลเพื่อพิมพ์');
            this.getMessage();
          }
        }

        onPrint = (type:any) => {
          if(this.dataSearch.length < 0) {
            return
          }
          this.checkPrint();
          var datatime =  this.pad(myExtObject.curHour(), 2,'')+":"+this.pad(myExtObject.curMinutes(), 2,'')+":"+this.pad(myExtObject.curSeconds(), 2,'');
          var datauser =  JSON.parse(JSON.stringify(this.userData));
          let dataReduce = this.dataSearch.reduce((previousValue, currentValue) => {
            console.log(previousValue)
            const position = previousValue.findIndex(val => {
             
               return val.app_date == currentValue.app_date
                //  return val.create_dep_name == currentValue.create_dep_name
            });

            if (position == -1) {
              const obj = {
                case_no: currentValue.case_no,
                red_no : currentValue.red_no,
                rcv_date: currentValue.rcv_date,
                receipt_type_desc : currentValue.receipt_type_desc,
                book_no : currentValue.book_no,
                receipt_no : currentValue.receipt_no,
                transfer_amt : currentValue.transfer_amt,
                cash_amt : currentValue.cash_amt,
                cheque_amt : currentValue.cheque_amt,
                credit_amt : currentValue.credit_amt,
                pros_desc : currentValue.pros_desc,
                accu_desc : currentValue.accu_desc,
                def_name : currentValue.def_name,
                sum_fee : currentValue.sum_fee,
                remark : currentValue.remark,
                create_user : currentValue.create_user,
                cancel_flag : currentValue.cancel_flag,
                cheque_no : currentValue.cheque_no,
                rcv_amt_type : currentValue.rcv_amt_type,
                create_dep_name : currentValue.create_dep_name,
                details: [{
                  case_no: currentValue.case_no,
                  red_no : currentValue.red_no,
                  rcv_date: currentValue.rcv_date,
                  receipt_type_desc : currentValue.receipt_type_desc,
                  book_no : currentValue.book_no,
                  pros_desc : currentValue.pros_desc,
                  accu_desc : currentValue.accu_desc,
                  def_name : currentValue.def_name,
                  receipt_no : currentValue.receipt_no,
                  transfer_amt : currentValue.transfer_amt,
                  cash_amt : currentValue.cash_amt,
                  cheque_amt : currentValue.cheque_amt,
                  credit_amt : currentValue.credit_amt,
                  card_no : currentValue.card_no,
                  sum_fee : currentValue.sum_fee,
                  remark : currentValue.remark,
                  create_user : currentValue.create_user,
                  cancel_flag : currentValue.cancel_flag,
                  cheque_no : currentValue.cheque_no,
                  rcv_amt_type : currentValue.rcv_amt_type,
                  create_dep_name : currentValue.create_dep_name,
                }]
              }
              previousValue.push(obj)
            } else {
              const obj = {
                case_no: currentValue.case_no,
                red_no : currentValue.red_no,
                rcv_date: currentValue.rcv_date,
                receipt_type_desc : currentValue.receipt_type_desc,
                book_no : currentValue.book_no,
                receipt_no : currentValue.receipt_no,
                pros_desc : currentValue.pros_desc,
                accu_desc : currentValue.accu_desc,
                def_name : currentValue.def_name,
                transfer_amt : currentValue.transfer_amt,
                cash_amt : currentValue.cash_amt,
                cheque_amt : currentValue.cheque_amt,
                credit_amt : currentValue.credit_amt,
                card_no : currentValue.card_no,
                sum_fee : currentValue.sum_fee,
                remark : currentValue.remark,
                create_user : currentValue.create_user,
                cancel_flag : currentValue.cancel_flag,
                cheque_no : currentValue.cheque_no,
                rcv_amt_type : currentValue.rcv_amt_type,
                create_dep_name : currentValue.create_dep_name,
              }
              previousValue[position].details.push(obj)
            }
            return previousValue

          }, [])

          dataReduce.forEach((dataSearch, index) => {
            let data = [];
            dataSearch.details.forEach((item, i) => {
              if(type == 1){
              data.push([
                {
                  text: i+1 , alignment: 'center', decoration: item.cancel_flag == 1 ? 'lineThrough' : '', decorationColor: item.cancel_flag == 1 ? 'red' : ''
                }, {
                  text: item.red_no ? item.case_no + '\n' + item.red_no : item.case_no, alignment: 'center', decoration: item.cancel_flag == 1 ? 'lineThrough' : '', decorationColor: item.cancel_flag == 1 ? 'red' : '' || ""
                }, {
                  text: 'โจทก์: ' +item.pros_desc + '\n' + 'จำเลย: ' + item.accu_desc ,fontSize : 12, decoration: item.cancel_flag == 1 ? 'lineThrough' : '', decorationColor: item.cancel_flag == 1 ? 'red' : '' || ""
                }, {
                  text: item.receipt_type_desc , fontSize : 13, decoration: item.cancel_flag == 1 ? 'lineThrough' : '', decorationColor: item.cancel_flag == 1 ? 'red' : '' || ""
                }, {
                  text: item.book_no, bold : true , alignment: 'center', decoration: item.cancel_flag == 1 ? 'lineThrough' : '', decorationColor: item.cancel_flag == 1 ? 'red' : '' || ""
                }, {
                  text: item.receipt_no , bold : true , alignment: 'center', decoration: item.cancel_flag == 1 ? 'lineThrough' : '', decorationColor: item.cancel_flag == 1 ? 'red' : '' || ""
                }, {
                  text: item.transfer_amt , alignment: 'right', fontSize : 14, decoration: item.cancel_flag == 1 ? 'lineThrough' : '', decorationColor: item.cancel_flag == 1 ? 'red' : '' || ""
                }, {
                  text: item.cash_amt , alignment: 'right', fontSize : 14, decoration: item.cancel_flag == 1 ? 'lineThrough' : '', decorationColor: item.cancel_flag == 1 ? 'red' : '' || ""
                }, {
                  text: item.cheque_amt != 0.00 ? item.cheque_amt + '\n(' + item.cheque_no + ')' : item.cheque_amt , alignment: 'right', fontSize : 14, decoration: item.cancel_flag == 1 ? 'lineThrough' : '', decorationColor: item.cancel_flag == 1 ? 'red' : '' || ""
                }, {
                  text: item.credit_amt != 0.00 ? item.credit_amt + '\n(' + item.card_no + ')' : item.credit_amt, alignment: 'right', fontSize : 14, decoration: item.cancel_flag == 1 ? 'lineThrough' : '', decorationColor: item.cancel_flag == 1 ? 'red' : '' || ""
                }, {
                  text: item.sum_fee , alignment: 'right',fontSize : 14,  decoration: item.cancel_flag == 1 ? 'lineThrough' : '', decorationColor: item.cancel_flag == 1 ? 'red' : '' || ""
                }, {
                  text: item.cancel_flag == 1 ? (item.remark == null ? '' : item.remark) + '\n' + 'ยกเลิก' : item.remark ,fontSize : 12 || ""
                }, {
                  text: item.def_name , fontSize : 12, decoration: item.cancel_flag == 1 ? 'lineThrough' : '', decorationColor: item.cancel_flag == 1 ? 'red' : '' || ""
                }
              ])
              }else{
                data.push([
                  {
                    text: i+1 , alignment: 'center', fillColor : item.cancel_flag == 1 ? '#F9A3A3;' : null
                  }, {
                    text: item.red_no ? item.case_no + '\n' + item.red_no : item.case_no, alignment: 'center', fillColor : item.cancel_flag == 1 ? '#F9A3A3;' : null || ""
                  }, {
                    text: item.rcv_date, fillColor : item.cancel_flag == 1 ? '#F9A3A3;' : null || ""
                  }, {
                    text: item.receipt_type_desc , fontSize : 14, fillColor : item.cancel_flag == 1 ? '#F9A3A3;' : null || ""
                  }, {
                    text: item.book_no, bold : true , alignment: 'center', fillColor : item.cancel_flag == 1 ? '#F9A3A3;' : null || ""
                  }, {
                    text: item.receipt_no , bold : true , alignment: 'center', fillColor : item.cancel_flag == 1 ? '#F9A3A3;' : null || ""
                  }, {
                    text: item.rcv_amt_type , alignment: 'right', fontSize : 14, fillColor : item.cancel_flag == 1 ? '#F9A3A3;' : null || ""
                  }, {
                    text: item.cheque_amt != 0.00 ? item.cheque_amt + '\n(' + item.cheque_no + ')' : item.cheque_amt, alignment: 'right', fontSize : 14, fillColor : item.cancel_flag == 1 ? '#F9A3A3;' : null || ""
                  }, {
                    text: item.sum_fee , alignment: 'right',fontSize : 14,  fillColor : item.cancel_flag == 1 ? '#F9A3A3;' : null || ""
                  }
                ])
              }
            })

            if(type==1){

              let docDefinition = {
              defaultStyle: {font: 'THSarabunNew', fontSize: '16'},
               pageMargins: [20,100,5,5],
              // pageSize:  {
              //   width: 297,
              //   height: 210,
              // },
              pageSize: 'A4',
              pageOrientation: type == 1 ? 'landscape' : 'portrait',

              header: function(currentPage, pageCount, pageMargin) {
                 return [
                  {
                    margin: [32, 15],
                    layout: 'noBorders',
                    pageMargin: currentPage === pageCount ? [20,100,0,125] : [20,100,5,5],
                    table: {
                      headerRows: 1,
                      widths: [ 'auto', 'auto', '*', 100 ],
                      body: [
                        [
                          {
                            text: `${datauser.shortCourtName}`,
                            style: 'tableHeader', colSpan: 4,
                          },
                          {},
                          {},
                          {}
                        ],
                        [
                          'ผู้พิมพ์',
                          `${datauser.offName}`,
                          { text: 'รายงานสรุปใบเสร็จรับเงิน', fontSize: 18, alignment: 'center' },
                          { text: type == 1 ? '(RFFN0500)' : '(RFFN0530)', alignment: 'right' }
                        ],
                        [
                          'วันที่พิมพ์',
                          `${myExtObject.curDate()} ${datatime}`,
                          ``,
                          { text: `หน้า ${currentPage}/${pageCount}`, alignment: 'right' }
                        ],
                      ]
                    }
                  },
                ]
              },
              content: [
                {
                  table: {
                    headerRows: 3,
                    pageBreak: 'before',
                    widths: [ 22, 'auto' ,100, 70, 'auto', 'auto', 50, 50 ,55, 50, 55, 65 ,50],
                    // widths: [ 20, 50 , 70, 65, 65, 'auto', 60, 85 ,'auto', 'auto', 90, 80 ],
                    body: [
                      [
                      { text: `${this.textCheckPrint}`, alignment: 'center', colSpan: 13, },{},{},{},{},{},{},{},{},{},{},{},{}
                      ],
                      [
                      { text: 'ลำดับที่', alignment: 'center', style: 'header', bold : true},
                      { text: 'คดีหมายเลขดำ'+'\n'+'คดีหมายเลขแดง', alignment: 'center', style: 'header' , bold : true},
                      { text: 'คู่ความ', alignment: 'center', style: 'header', bold : true},
                      { text: 'ประเภทใบเสร็จ', alignment: 'center', style: 'header', bold : true},
                      { text: 'เล่มที่', alignment: 'center', style: 'header', bold : true},
                      { text: 'เลขที่', alignment: 'center', style: 'header', bold : true},
                      { text: 'เงินโอน', alignment: 'center', style: 'header', bold : true},
                      { text: 'เงินสด', alignment: 'center', style: 'header', bold : true},
                      { text: 'เช็ค', alignment: 'center', style: 'header', bold : true},
                      { text: 'บัตรเครดิต', alignment: 'center', style: 'header', bold : true},
                      { text: 'รวมเงิน', alignment: 'center', style: 'header', bold : true},
                      { text: 'หมายเหตุ', alignment: 'center', style: 'header', bold : true},
                      { text: 'ผู้วางเงิน', alignment: 'center', style: 'header', bold : true},
                       ],
                       [
                       { text: `วันที่รับเงิน : ${dataSearch.rcv_date}  หน่วยงานผู้สร้างรายการ : ${dataSearch.create_dep_name}`,  colSpan: 13, },{},{},{},{},{},{},{},{},{},{},{}
                        ],
                      ...data,
                      [
                      { text: `เช็ครวม  ${this.num_cheque}  ฉบับ     รวมใบเสร็จใช้จริง  ${this.total_fee}  ฉบับ     รวม ตามหน่วยงาน` , alignment : 'right', colSpan : 6 },
                      { },
                      { },
                      { },
                      { },
                      { },
                      { text: `${this.sum_transfer}`, fontSize : 14, alignment: 'right'},
                      { text: `${this.sum_cash}`, fontSize : 14, alignment: 'right'},
                      { text: `${this.sum_cheque}`, fontSize : 14, alignment: 'right'},
                      { text: `${this.sum_credit}`, fontSize : 14, alignment: 'right'},
                      { text: `${this.sum_fee}`, fontSize : 14, alignment: 'right'},
                      { text: `บาท`, alignment: 'center'},
                      { },
                      ],
                      [
                        { text: `รวม ยกเลิก  ${this.num_cancel}  รายการ เป็นเงินที่ยกเลิก ทั้งสิ้น ` , alignment : 'right', colSpan : 6 },
                        { },
                        { },
                        { },
                        { },
                        { },
                        { text: `${this.sum_cancel_transfer}`, fontSize : 14, alignment: 'right'},
                        { text: `${this.sum_cancel_cash}`, fontSize : 14, alignment: 'right'},
                        { text: `${this.sum_cancel_cheque}`, fontSize : 14, alignment: 'right'},
                        { text: `${this.sum_cancel_credit}`, fontSize : 14, alignment: 'right'},
                        { text: `${this.sum_cancel_fee}`, fontSize : 14, alignment: 'right'},
                        { text: `บาท`, alignment: 'center'},
                        { },
                        ],
                        [
                          { text: `รวม เขียนมือ  ${this.num_by_hand}  รายการ เป็นเงินที่เขียนมือ ทั้งสิ้น ` , alignment : 'right', colSpan : 6 },
                          { },
                          { },
                          { },
                          { },
                          { },
                          { text: `${this.sum_by_hand_transfer}`, fontSize : 14, alignment: 'right'},
                          { text: `${this.sum_by_hand_cash}`, fontSize : 14,alignment: 'right'},
                          { text: `${this.sum_by_hand_cheque}`, fontSize : 14, alignment: 'right'},
                          { text: `${this.sum_by_hand_credit}`, fontSize : 14, alignment: 'right'},
                          { text: `${this.sum_by_hand_fee}`, fontSize : 14, alignment: 'right'},
                          { text: `บาท`, alignment: 'center'},
                          { },
                        ],
                    ]
                  }
                }
              ],
              // showfoot
            //   footer: {
            //     columns: [
            //         'Report generated on 8/30/2021 6:02:31PM',
            //         'Developed by XYZ Fitness Software',
            //         {
            //             alignment: 'right',
            //             text: 'Page 1 of 2'
            //         },
            //         {
            //           alignment: 'right',
            //           text: 'www.xyz.com'
            //       },
            //     ],
            //     margin: [60, 10, 60, 10 ]
            // },
            footer: function(currentPage, pageCount, pageMargin) {
              if (currentPage == pageCount)
              return [
                 {
                  pageMargin: [20,100,0,125] ,
                  margin: [16, 8],
                  layout: 'noBorders',
                  table: {
                    headerRows: 1,
                    widths: [ 'auto', 'auto', '*', 400 ],
                    body: [
                      [
                        {},
                        {},
                        {},
                        { text: 'ลงชื่อ.....................................................................................หัวหน้างาน/หัวหน้าส่วน', alignment: 'left' }
                      ],
                      [
                        {},
                        {},
                        {},
                        { text: 'ลงชื่อ.....................................................................................ผู้ส่งเงิน', alignment: 'left' }
                      ],
                      [
                        {},
                        {},
                        {},
                        { text: 'ลงชื่อ.....................................................................................ผู้รับเงิน', alignment: 'left' }
                      ],
                      [
                        {},
                        {},
                        {},
                        { text: 'ลงชื่อ.....................................................................................พนักงานบัญชี', alignment: 'left' }
                      ],
                    ]
                  },
                },
              ]
            },
            // pageMargin: function(currentPage, pageCount, pageSize) {
            // if (currentPage === pageCount){
            //     return {pageMargins : [20,100,0,125]};
            //      console.log('11111');
            //   }else{
            //     return {pageMargins : [20,100,5,5]};
            //      console.log('2222222');
            //   }
            // },
            // footer : function(page, pages) {
            //   return {
            //     margin: [5, 0, 10, 0],
            //     height: 30,
            //     columns: [{
            //       alignment: "left",
            //       text: 'This is your left footer column',
            //     }, {
            //       alignment: "right",
            //       text: [
            //         { text: page.toString(), italics: true },
            //           " of ",
            //         { text: pages.toString(), italics: true }
            //       ]
            //     }]
            //   }
            // },
              //pageMargins: currentNode.currentPage == currentNode.pageCount ? [20,100,0,125] : [20,100,5,5],
              // pageMargins:  [20,100,0,125] ,
              // sign: [{
              //   text: 'getOfferClosingParagraph()',
              //   id: 'closingParagraph'
              // }, {
              //   text: 'getSignature()',
              //   id: 'signature'
              // }],
              // pageMargins: [20,100,5,5],
              pageBreakBefore: function(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
                //check if signature part is completely on the last page, add pagebreak if not
                if (currentNode.id === 'signature' && (currentNode.pageNumbers.length != 1 || currentNode.pageNumbers[0] != currentNode.pages)) {
                  return true;
                }
                //check if last paragraph is entirely on a single page, add pagebreak if not
                else if (currentNode.id === 'closingParagraph' && currentNode.pageNumbers.length != 1) {
                return true;
                }
                return false;
              }
            };
            pdfMake.createPdf(docDefinition).open()
          }else{
            let docDefinition = {
              defaultStyle: {font: 'THSarabunNew', fontSize: '16'},
              pageMargins: [20,100,5,5],
              // pageSize:  {
              //   width: 297,
              //   height: 210,
              // },
              pageSize: 'A4',
              pageOrientation: type == 1 ? 'landscape' : 'portrait',

              header: function(currentPage, pageCount, pageMargin) {
                return [
                  {
                    margin: [32, 15],
                    layout: 'noBorders',
                    pageMargin: currentPage === pageCount ? [20,100,0,125] : [20,100,5,5],
                    table: {
                      headerRows: 1,
                      widths: [ 'auto', 'auto', '*', 100 ],
                      body: [
                        [
                          {
                            text: `${datauser.shortCourtName}`,
                            style: 'tableHeader', colSpan: 4,
                          },
                          {},
                          {},
                          {}
                        ],
                        [
                          'ผู้พิมพ์',
                          `${datauser.userName}`,
                          { text: 'รายงานสรุปใบเสร็จรับเงิน', fontSize: 23, alignment: 'center' },
                          { text: type == 1 ? '(RFFN0500)' : '(RFFN0530)', alignment: 'right' }
                        ],
                        [
                          'วันที่พิมพ์',
                          `${myExtObject.curDate()} ${datatime}`,
                          ``,
                          { text: `หน้า ${currentPage}/${pageCount}`, alignment: 'right' }
                        ],
                      ]
                    }
                  },
                ]
              },
              content: [
                {
                  table: {
                    headerRows: 3,
                    pageBreak: 'before',
                    widths: [ 22, 'auto' , 'auto', 100, 37, 35, 45, 55 ,60 ],
                    // widths: [ 20, 50 , 70, 65, 65, 'auto', 60, 85 ,'auto', 'auto', 90, 80 ],
                    body: [
                      [
                      { text: `${this.textCheckPrint}`, alignment: 'center', colSpan: 9, },{},{},{},{},{},{},{},{}
                      ],
                      [
                      { text: 'ลำดับที่', alignment: 'center', style: 'header', bold : true},
                      { text: 'คดีหมายเลขดำ'+'\n'+'คดีหมายเลขแดง', alignment: 'center', style: 'header' , bold : true},
                      { text: 'วันที่รับเงิน', alignment: 'center', style: 'header', bold : true},
                      { text: 'ประเภทใบเสร็จ', alignment: 'center', style: 'header', bold : true},
                      { text: 'เล่มที่', alignment: 'center', style: 'header', bold : true},
                      { text: 'เลขที่', alignment: 'center', style: 'header', bold : true},
                      { text: 'รับ', alignment: 'center', style: 'header', bold : true},
                      { text: 'เลขที่เช็ค', alignment: 'center', style: 'header', bold : true},
                      { text: 'รวมเงิน', alignment: 'center', style: 'header', bold : true},
                      ],
                       [
                        { text: `หน่วยงานผู้สร้างรายการ : ${datauser.depName}`,  colSpan: 9, },{},{},{},{},{},{},{},{}
                        ],
                      ...data,
                      [
                      { text: `รวมใบเสร็จใช้จริง  ${this.total_fee}  ฉบับ     รวม ตามหน่วยงาน` , alignment : 'right', colSpan : 8 },
                      { },
                      { },
                      { },
                      { },
                      { },
                      { },
                      { },
                      { text: `${this.sum_fee}`, fontSize : 14, alignment: 'right'},
                      ],
                      [
                        { text: `รวม ยกเลิก  ${this.num_cancel}  รายการ เป็นเงินที่ยกเลิก ทั้งสิ้น ` , alignment : 'right', colSpan : 8 },
                        { },
                        { },
                        { },
                        { },
                        { },
                        { },
                        { },
                        { text: `${this.sum_cancel_fee}`, fontSize : 14, alignment: 'right'},
                      ],
                        [
                          { text: `รวม เขียนมือ  ${this.num_by_hand}  รายการ เป็นเงินที่เขียนมือ ทั้งสิ้น ` , alignment : 'right', colSpan : 8 },
                          { },
                          { },
                          { },
                          { },
                          { },
                          { },
                          { },
                          { text: `${this.sum_by_hand_fee}`, fontSize : 14, alignment: 'right'},
                        ],
                    ]
                  }
                }
              ],
              // showfoot
            //   footer: {
            //     columns: [
            //         'Report generated on 8/30/2021 6:02:31PM',
            //         'Developed by XYZ Fitness Software',
            //         {
            //             alignment: 'right',
            //             text: 'Page 1 of 2'
            //         },
            //         {
            //           alignment: 'right',
            //           text: 'www.xyz.com'
            //       },
            //     ],
            //     margin: [60, 10, 60, 10 ]
            // },
            footer: function(currentPage, pageCount, pageMargin) {
              if (currentPage == pageCount)
              return [
               {
                pageMargin: [20,100,0,125] ,
                  margin: [16, 8],
                  // margin: [5, 0, 10, 0],
                  layout: 'noBorders',
                  table: {
                    headerRows: 1,
                    widths: [ 'auto', 'auto', '*', 400 ],
                    body: [
                      [
                        {},
                        {},
                        {},
                        { text: 'ลงชื่อ.....................................................................................หัวหน้างาน/หัวหน้าส่วน', alignment: 'left' }
                      ],
                      [
                        {},
                        {},
                        {},
                        { text: 'ลงชื่อ.....................................................................................ผู้ส่งเงิน', alignment: 'left' }
                      ],
                      [
                        {},
                        {},
                        {},
                        { text: 'ลงชื่อ.....................................................................................ผู้รับเงิน', alignment: 'left' }
                      ],
                      [
                        {},
                        {},
                        {},
                        { text: 'ลงชื่อ.....................................................................................พนักงานบัญชี', alignment: 'left' }
                      ],
                    ]
                  }
                },
              ]
            },
            // pageMargin: function(currentPage, pageCount, pageSize) {
            // if (currentPage === pageCount){
            //     return {pageMargins : [20,100,0,125]};
            //      console.log('11111');
            //   }else{
            //     return {pageMargins : [20,100,5,5]};
            //      console.log('2222222');
            //   }
            // },
            // footer : function(page, pages) {
            //   return {
            //     margin: [5, 0, 10, 0],
            //     height: 30,
            //     columns: [{
            //       alignment: "left",
            //       text: 'This is your left footer column',
            //     }, {
            //       alignment: "right",
            //       text: [
            //         { text: page.toString(), italics: true },
            //           " of ",
            //         { text: pages.toString(), italics: true }
            //       ]
            //     }]
            //   }
            // },
              //pageMargins: currentNode.currentPage == currentNode.pageCount ? [20,100,0,125] : [20,100,5,5],
              // pageMargins:  [20,100,0,125] ,
              //  pageMargins: [20,100,5,5],
              pageBreakBefore: function(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
                //check if signature part is completely on the last page, add pagebreak if not
                if (currentNode.id === 'signature' && (currentNode.pageNumbers.length != 1 || currentNode.pageNumbers[0] != currentNode.pages)) {
                  return true;
                }
                //check if last paragraph is entirely on a single page, add pagebreak if not
                else if (currentNode.id === 'closingParagraph' && currentNode.pageNumbers.length != 1) {
                  return true;
                }
                return false;
              }
            };
            pdfMake.createPdf(docDefinition).open()
          }
          })


        }

        pad(n:any, width:any, z:any) {
          z = z || '0';
          n = n + '';
          return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
        }

        checkPrint(){
          if(this.result.sdate && this.result.edate){
            this.textCheckPrint = 'รับเงินตั้งแต่ ' + this.result.sdate + ' ถึงวันที่ ' + this.result.edate + '; ';
          }

        }

    }













