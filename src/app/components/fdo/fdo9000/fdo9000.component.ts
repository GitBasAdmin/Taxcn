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
  selector: 'app-fdo9000,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fdo9000.component.html',
  styleUrls: ['./fdo9000.component.css']
})


export class Fdo9000Component implements AfterViewInit, OnInit, OnDestroy {
  //form: FormGroup;
  title = 'datatables';

  getCaseType:any;selCaseType:any;
  getDateType:any;selDateType:any;
  getJudge:any;
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
  numCase:any;
  numLit:any;
  retPage:any;
  myExtObject:any;
  textCheckPrint:any;
  toPage:any="fdo0100";
  asyncObservable: Observable<string>;
  result:any = [];
  tmpResult:any = [];
  dataSearch:any = [];
  judge_id:any;
  judge_name:any;
  stype:any;
  public list:any;
  public listFieldName1:any;
  public listFieldName2:any;
  public listFieldName3:any;
  public listFieldName4:any;
  public listFieldName5:any;
  public listFieldName6:any;
  public listFieldName7:any;
  public listFieldName8:any;


  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  //@ViewChild('fca0200',{static: true}) fca0200 : ElementRef;
  //@ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  // @ViewChild('fdo9000',{static: true}) case_type : ElementRef;
  //@ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  public loadModalComponent: boolean = false;
  public loadModalJudgeComponent: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private excelService: ExcelService,
    private activatedRoute: ActivatedRoute
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
    this.activatedRoute.queryParams.subscribe(params => {
      if(params['program'])
        this.retPage = params['program'];
    });

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

     //======================== pcase_type ======================================
    //  var student = JSON.stringify({
    //   "table_name" : "pcase_type",
    //   "field_id" : "case_type",
    //   "field_name" : "case_type_desc",
    //   "order_by": " case_type ASC",
    //   "userToken" : this.userData.userToken
    // });
    // //console.log(student)
    // this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
    //   (response) =>{
    //     let getDataOptions : any = JSON.parse(JSON.stringify(response));
    //     this.getCaseType = getDataOptions;
    //     this.selCaseType = $("body").find("ng-select#case_type span.ng-value-label").html();

    //   },
    //   (error) => {}
    // )

    // this.getConResult = [{id:'',text:''},{id: '1',text: 'จำหน่ายคดี'},{id: '2',text: 'สำเร็จ'},{id: '3',text: 'ไม่สำเร็จ'}];
      this.result.chkType = '0';
      this.result.chkType2 = '0';

       //this.asyncObservable = this.makeObservable('Async Observable');
      this.successHttp();
  }

  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  successHttp() {
   var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fdo9000"
    });
    let promise = new Promise((resolve, reject) => {
      //let apiURL = `${this.apiRoot}?term=${term}&media=music&limit=20`;
      //this.http.get(apiURL)
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen)
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
      // this.result.cFlag = 1;
      myExtObject.callCalendar();
    }

    loadMyModalComponent(){
      this.loadComponent = false;
      this.loadModalComponent = true;
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
      $("#exampleModal").find(".modal-content").css("width","1000px");
      $("#exampleModal").find(".modal-body").css("height","auto");
      this.loadModalComponent = false;
      this.loadComponent = true;
      this.loadModalJudgeComponent = false;
      $("#exampleModal").find(".modal-content").css("margin" , "100px 100px 100px -100px !important;");
   }

  //  tabChange(obj:any){
  //    if(obj.target.value){
  //      this.renderer.setProperty(this.req_title_id.nativeElement['dep_name'],'value', this.list.find((x:any) => x.fieldIdValue === parseInt(obj.target.value)).fieldNameValue);
  //    }else{
  //      this.req_title_id.nativeElement['dep_use'].value="";
  //      this.req_title_id.nativeElement['dep_name'].value="";
  //    }
  //  }

    // tabChangeSelect(objName:any,objData:any,event:any,type:any){
    //   if(typeof objData!='undefined'){
    //     if(type==1){
    //       var val = objData.filter((x:any) => x.fieldIdValue === event.target.value) ;
    //     }else{
    //         var val = objData.filter((x:any) => x.fieldIdValue === event);
    //     }
    //     console.log(objData)
    //     //console.log(event.target.value)
    //     //console.log(val)
    //     if(val.length!=0){
    //       this.result[objName] = val[0].fieldIdValue;
    //       this[objName] = val[0].fieldIdValue;
    //     }
    //   }else{
    //     this.result[objName] = null;
    //     this[objName] = null;
    //   }
    // }

    // tabChangeInput(name:any,event:any){
    //   let headers = new HttpHeaders();
    //     headers = headers.set('Content-Type','application/json');
    //   if(name=='judge_id'){
    //     var student = JSON.stringify({
    //       "table_name" : "pjudge",
    //       "field_id" : "judge_id",
    //       "field_name" : "judge_name",
    //       "condition" : " AND judge_id='"+event.target.value+"'",
    //       "userToken" : this.userData.userToken
    //     });
    //     console.log(student)
    //   this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
    //       (response) =>{
    //         let productsJson : any = JSON.parse(JSON.stringify(response));

    //         if(productsJson.length){
    //           this.result.judge_name = productsJson[0].fieldNameValue;
    //         }else{
    //           this.result.judge_id = null;
    //           this.result.judge_name = '';
    //         }
    //       },
    //       (error) => {}
    //     )
    //   }
    // }

    receiveFuncListData(event:any){
      console.log(event)
      this.result.lawyer_name = event.lawyer_name;
      this.closebutton.nativeElement.click();
    }

    // receiveJudgeListData(event:any){
    //   this.result.judge_id = event.judge_id;
    //   this.result.judge_name = event.judge_name;
    //   this.closebutton.nativeElement.click();
    // }

    searchData(){
      console.log(this.result)
      if(
        !this.result.sdate &&
        !this.result.edate &&
        !this.result.sdate2 &&
        !this.result.edate2 &&
        !this.result.sdate3 &&
        !this.result.edate3 &&
        !this.result.chkType &&
        !this.result.chkType2
        ){
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
      }else if((!this.result.sdate || !this.result.edate) && (!this.result.sdate2 || !this.result.edate2) && (!this.result.sdate3 || !this.result.edate3)  ){
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('ป้อนข้อมูลวันที่ต้องการค้น');
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
      //  if(this.result.cond2==true){
      //      jsonTmp['cond'] = '2';
      //   }else{
      //      jsonTmp['cond'] = type;
      //   }
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
        // console.log(student)
        console.log(JSON.stringify(student));
        this.http.post('/'+this.userData.appName+'ApiDO/API/KEEPB/fdo9000', student).subscribe(
          (response) =>{
              let productsJson : any = JSON.parse(JSON.stringify(response));
              if(productsJson.result==1){

                var bar = new Promise((resolve, reject) => {
                  productsJson.data.forEach((ele, index, array) => {
                        // if(ele.indict_desc != null){
                        //   if(ele.indict_desc.length > 47 )
                        //     productsJson.data[index]['indict_desc_short'] = ele.indict_desc.substring(0,47)+'...';
                        // }
                        // if(ele.pay_amt != null){
                        //   productsJson.data[index]['pay_amt'] = this.curencyFormat(ele.pay_amt,2);
                        // }
                        // productsJson.data[index]['num'] = index + 1;
                    });
                });

                bar.then(() => {
                  //this.dataSearch = productsJson.data;
                  //console.log(this.dataSearch)
                });

                this.dataSearch = productsJson.data;
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

    curencyFormatRevmove(val: number): string {
      if (val !== undefined && val !== null) {
        return val.toString().replace(/,/g, "").slice(.00, -3); ;
      } else {
        return "";
      }
    } // 100

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
            if(excel[i]['pay_amt'])
            excel[i]['pay_amt'] = Number(this.curencyFormatRevmove(excel[i]['pay_amt'] )) ;
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

            for(var x=0;x<15;x++){
              if(x==0)
                data.push(excel[i]['num']);
              if(x==1)
                data.push(excel[i]['req_date']);
              if(x==2)
                data.push(excel[i]['order_date']);
              if(x==3)
                data.push(excel[i]['case_no']);
              if(x==4)
                data.push(excel[i]['red_no']);
              if(x==5)
                data.push(excel[i]['rpt_accu_desc']);
              if(x==6)
                data.push(excel[i]['lawyer_name']);
              if(x==7)
                data.push(excel[i]['type_name']);
              if(x==8)
                data.push(excel[i]['pay_amt']);
              if(x==9)
                data.push(excel[i]['check_no']);
              if(x==10)
                data.push(excel[i]['pay_date']);
              if(x==12)
                data.push(excel[i]['checkrcv_date']);
              if(x==12)
                data.push(excel[i]['bank_name_rcv']);
              if(x==13)
                data.push(excel[i]['book_account_rcv']);
              if(x==14)
                data.push(excel[i]['bankbranch_rcv']);
              // if(x==15)
              //   data.push(excel[i]['admit_desc']);
              // if(x==17)
              //   data.push(excel[i]['transfer_court_name']);
            }

            extend[i] = $.extend([], data)
            data = [];
            //extend[i] = Object.values(data)
          }
        });
        if(bar){
          var objExcel = [];
          // objExcel['deposit'] = this.deposit;
          objExcel['data'] = extend;
          console.log(objExcel)
          this.excelService.exportAsExcelFile(objExcel,'fdo9000' ,this.programName);
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

    getMessage(message:any){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage(message);
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }

//     checkParam(){
//       if((!this.result.sdate || !this.result.edate) && (!this.result.sdate2 || !this.result.edate2) && (!this.result.sdate3 || !this.result.edate3 )){
//         // $("input[name='pdate_start']")[0].focus();
//         this.getMessage('กรุณาระบุข้อมูล ตั้งแต่วันที่ ถึงวันที่');

//      }else{
//          this.searchData();
//         // setTimeout(() =>{
//         //       this.checkWithdraw(type);
//         // },100);
//     }
//  }

 toPrint(){
     if(this.dataSearch.length > 0){
    this.onPrint();
         console.log('printreport');
    }else{
          this.getMessage('ค้นหาข้อมูล ก่อนพิมพ์');
          console.log('notprint');
    }
 }

    goToPage(run_id:any){
      let winURL = window.location.href;
      winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+this.toPage+'?run_id='+run_id;
      //alert(winURL);
      window.open(winURL,'_blank', "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=1200,height=400");
      //myExtObject.OpenWindowMax(winURL+'?run_id='+run_id);
    }


  //   retToPage(run_id:any){
  //    let winURL = this.authService._baseUrl;
  //   // winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+this.retPage;
  //   //let winURL = this.authService._baseUrl.substring(0,this.authService._baseUrl.indexOf("#")+1)+'/'+this.retPage;
  //   myExtObject.OpenWindowMax(winURL+'?run_id='+run_id);
  // }
  pad(n:any, width:any, z:any) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  checkPrint(){
    if(this.result.sdate && this.result.edate){
      this.textCheckPrint = 'วันที่เก็บเอกสารตั้งแต่ ' + this.result.sdate + ' ถึงวันที่ ' + this.result.edate + '; ';
    }
    if(this.result.sdate2 && this.result.edate2){
      this.textCheckPrint = 'วันที่เบิกเอกสารตั้งแต่ ' + this.result.sdate2 + ' ถึงวันที่ ' + this.result.edate2 + ';';
    }
    if(this.result.sdate3 && this.result.edate3){
      this.textCheckPrint = 'วันที่คืนเอกสารตั้งแต่ ' + this.result.sdate3 + ' ถึงวันที่ ' + this.result.edate3 + ';';
    }
  }


  onPrint = () => {
    if(this.dataSearch.length < 0) {
      return
    }
    this.checkPrint();
    var datatime =  this.pad(myExtObject.curHour(), 2,'')+":"+this.pad(myExtObject.curMinutes(), 2,'')+":"+this.pad(myExtObject.curSeconds(), 2,'');
    var datauser =  JSON.parse(JSON.stringify(this.userData));
    let dataReduce = this.dataSearch.reduce((previousValue, currentValue) => {
      const position = previousValue.findIndex(val => {
        return val.app_date1 == currentValue.app_date1
      });

      if (position == -1) {
        const obj = {
          black: currentValue.black,
          case_no: currentValue.case_no,
          lit_type_desc : currentValue.lit_type_desc,
          due_return: currentValue.due_return,
          doc_no : currentValue.doc_no,
          page_no : currentValue.page_no,
          doc_desc : currentValue.doc_desc,
          details: [{
            black: currentValue.black,
            case_no: currentValue.case_no,
            lit_type_desc : currentValue.lit_type_desc,
            due_return: currentValue.due_return,
            doc_no : currentValue.doc_no,
            page_no : currentValue.page_no,
            doc_desc : currentValue.doc_desc,
          }]
        }
        previousValue.push(obj)
      } else {
        const obj = {
          black: currentValue.black,
          case_no: currentValue.case_no,
          lit_type_desc : currentValue.lit_type_desc,
          due_return: currentValue.due_return,
          doc_no : currentValue.doc_no,
          page_no : currentValue.page_no,
          doc_desc : currentValue.doc_desc,
        }
        previousValue[position].details.push(obj)
      }
      return previousValue

    }, [])

    dataReduce.forEach((items, index) => {
      let data = [];
      items.details.forEach((item, i) => {
        data.push([
          {
            text: i+1 , alignment: 'center'
          }, {
            text: item.black , alignment: 'center'|| ""
          }, {
            text: item.case_no , alignment: 'center' || ""
          }, {
            text: item.lit_type_desc , alignment: 'center' || ""
          }, {
            // image: item.due_return == 1 ? '' : ''  , fit: [20, 20], alignment: 'center' || ""
            text: item.due_return == 1 ? 'คืน' : '' , alignment: 'center' || ""
          }, {
            text: item.doc_no , alignment: 'center'|| ""
          }, {
            text: item.page_no , alignment: 'center' || ""
          }, {
            text: item.doc_desc || ""
          }]
        )
      })

      let docDefinition = {
        defaultStyle: {font: 'THSarabunNew', fontSize: '16'},
        // pageSize:  {
        //   width: 297,
        //   height: 210,
        // },
        pageSize: 'A4',
        pageOrientation: 'landscape',

        header: function(currentPage, pageCount, pageSize) {
          return [
            {
              margin: [32, 15],
              layout: 'noBorders',
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
                    { text: 'ตรวจสอบการบันทึกข้อมูลเอกสารแยกเก็บ', fontSize: 23, alignment: 'center' },
                    { text: '(RFDO9000)', alignment: 'right' }
                  ],
                  [
                    'วันที่พิมพ์',
                    `${myExtObject.curDate()} ${datatime}`,
                    // { text:`${myExtObject.curDate()} ${myExtObject.curTime()}`},
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
              headerRows: 2,
              pageBreak: 'before',
              widths: [ 'auto', 'auto' , 70, 70, 60, 'auto', 30, 350 ],
              body: [
                [
                  { text: `เงื่อนไข : ${this.textCheckPrint}`, colSpan: 8, fillColor: '#dee2e6', },{},{},{},{},{},{},{}
                ],
                [
                { text: 'ลำดับ', alignment: 'center', style: 'header'},
                { text: 'คดีหมายเลขดำ', alignment: 'center', style: 'header'},
                { text: 'แยกเก็บที่', alignment: 'center', style: 'header'},
                { text: 'เจ้าของ', alignment: 'center', style: 'header'},
                { text: 'ต้องคืนคู่ความ', alignment: 'center', style: 'header'},
                { text: 'เลขที่หมาย', alignment: 'center', style: 'header'},
                { text: 'แผ่น', alignment: 'center', style: 'header'},
                { text: 'รายละเอียด', alignment: 'center', style: 'header'},
                ],
                ...data,
                [
                  { text: `รวม     ${this.dataSearch.length}     รายการ` , colSpan: 8}
                ]
              ]
            }
          }
        ],
        // showfoot
        // footer: {
        //   columns: [
        //     'Left part',
        //     { text: 'Right part', alignment: 'right' }
        //   ]
        // },
        pageMargins: [25,100,25,10],
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
    })
  }

}







