import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbAlertConfig, NgbPopover} from '@ng-bootstrap/ng-bootstrap';
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
//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
declare var myExtObject: any;

@Component({
  selector: 'app-fud9000,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fud9000.component.html',
  styleUrls: ['./fud9000.component.css']
})


export class Fud9000Component implements AfterViewInit, OnInit, OnDestroy {
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
  result:any = [];
  tmpResult:any = [];
  dataSearch:any = [];
  numCase:any;
  numLit:any;
  myExtObject:any;
  getToCourt:any;
  getAppType:any;
  getJudgeResult:any;
  getCaseType:any;
  getCaseCate:any;
  getTitle:any;
  toPage:any = 'fud0100';
  getRedTitle:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;


  //@ViewChild('fca0200',{static: true}) fca0200 : ElementRef;
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
    private excelService: ExcelService,
  ){ }

  ngOnInit(): void {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 30,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[]
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
        // this.selCaseType = $("body").find("ng-select#case_type span.ng-value-label").html();

      },
      (error) => {}
    )

    //======================== pappeal_send_to ======================================
    var student = JSON.stringify({
      "table_name" : "pappeal_send_to",
      "field_id" : "send_to_id",
      "field_name" : "send_to_name",
      "order_by" : "send_to_id ASC",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        getDataOptions.unshift({fieldIdValue:'0',fieldNameValue: 'ทั้งหมด'});
        this.getToCourt = getDataOptions;
        //console.log(getDataOptions)
      },
      (error) => {}
    )

     //======================== pappeal_type ======================================
     var student = JSON.stringify({
      "table_name" : "pappeal_type",
      "field_id" : "app_type_id",
      "field_name" : "app_type_name",
      "condition"  : "AND appeal_type =" + this.result.appeal_type,
      "order_by" : "app_type_id ASC",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        getDataOptions.unshift({fieldIdValue:'',fieldNameValue: 'ทั้งหมด'});
        this.getAppType = getDataOptions;
        //console.log(getDataOptions)
      },
      (error) => {}
    )

    this.getJudgeResult = [{id:'1',text:'ยืน'},{id:'2',text:'ยก'},{id:'3',text:'กลับ'},{id:'4',text:'แก้'},{id:'5',text:'ย้อน'},{id:'6',text:'ถอนฟ้อง'},{id:'7',text:'ตามยอม'},{id:'8',text:'จำหน่ายคดี'}];
    this.result.appeal_type = '0';
    this.result.app_type_id = '';
    this.result.to_court = '0';
    this.result.hold_send = '0';
    this.result.hold_rcv = '0';
    this.result.read_flag = '0';
    this.result.judge_flag = '0';
  }

  convDate(date:any){
    if(date){
      var dateArray = date.split('/');
      return dateArray[2]+dateArray[1]+dateArray[0];
    }else
      return '';
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
      this.result.case_cate_id = null;
      this.result.title = null;
    //console.log("fCaseTitle")

    let promise = new Promise((resolve, reject) => {
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
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

    });
    return promise;
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fud9000"
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

  AppealChange(val:any){
     //======================== pappeal_type ======================================
     var student = JSON.stringify({
      "table_name" : "pappeal_type",
      "field_id" : "app_type_id",
      "field_name" : "app_type_name",
      "condition"  : "AND appeal_type ='" + val +"'",
      "order_by" : "app_type_id ASC",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        getDataOptions.unshift({fieldIdValue:'',fieldNameValue: 'ทั้งหมด'});
        this.getAppType = getDataOptions;
        this.result.app_type_id = '';
        //console.log(getDataOptions)
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

    curencyFormat(n:any,d:any) {
      return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    }

    directiveDate(date:any,obj:any){
      this.result[obj] = date;
    }

    ngAfterContentInit() : void{
     myExtObject.callCalendar();
    }

    searchData(){
      console.log(this.result)
      if(!this.result.appeal_type &&
        !this.result.to_court &&
        !this.result.title && !this.result.hblack_no && !this.result.hred_no &&
        !this.result.case_type && !this.result.case_cate_id){
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
      }else if((!this.result.sdate && !this.result.edate) && (!this.result.hsend_date1 && !this.result.hsend_date2)
      && (!this.result.hrec_date1 && !this.result.hrec_date2) && (!this.result.read_date1 && !this.result.read_date2)
      && (!this.result.judge_date1 && !this.result.judge_date2)){
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('ป้อนวันที่อย่างน้อย 1 เงื่อนไข');
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
        console.log('xxxxxxxxxxxx'+JSON.stringify(student))
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');

        this.http.post('/'+this.userData.appName+'ApiUD/API/APPEAL/fud9000', student , {headers:headers}).subscribe(
          (response) =>{
              let productsJson : any = JSON.parse(JSON.stringify(response));
              if(productsJson.result==1){

                var bar = new Promise((resolve, reject) => {
                  productsJson.data.forEach((ele, index, array) => {
                        // if(ele.short_judgement != null){
                        //   if(ele.short_judgement.length > 47 )
                        //     productsJson.data[index]['short_judgement_short'] = ele.short_judgement.substring(0,47)+'...';
                        // }
                        if(ele.start_date != null){
                          productsJson.data[index]['Nstart_date'] = this.convDate(ele.start_date);
                        }
                        if(ele.case_send_date != null){
                          productsJson.data[index]['Ncase_send_date'] = this.convDate(ele.case_send_date);
                        }
                        if(ele.hsend_date != null){
                          productsJson.data[index]['Nhsend_date'] = this.convDate(ele.hsend_date);
                        }
                        if(ele.hrec_date != null){
                          productsJson.data[index]['Nhrec_date'] = this.convDate(ele.hrec_date);
                        }
                        if(ele.judgement_judge_date != null){
                          productsJson.data[index]['Njudgement_judge_date'] = this.convDate(ele.judgement_judge_date);
                        }
                        if(ele.read_date != null){
                          productsJson.data[index]['Nread_date'] = this.convDate(ele.read_date);
                        }
                        if(ele.judging_date != null){
                          productsJson.data[index]['Njudging_date'] = this.convDate(ele.judging_date);
                        }
                        if(ele.rcv_date != null){
                          productsJson.data[index]['Nrcv_date'] = this.convDate(ele.rcv_date);
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
                // this.deposit = this.curencyFormat(productsJson.deposit,2);
                // this.result.deposit
                this.numCase = productsJson.num_case;
                this.numLit = this.dataSearch.length;
                //this.dtTrigger.next(null);
                this.rerender();
                console.log(this.dataSearch)
              }else{
                this.dataSearch = [];
                this.rerender();
                this.numCase = 0;
                this.numLit = 0;
              }
              console.log(productsJson)
              this.SpinnerService.hide();
          },
          (error) => {}
        )

      }
    }

    goToPage(run_id:any,appeal_type:any,appeal_item:any,appeal_running:any){
      let winURL = window.location.href;
      winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+this.toPage+'?run_id='+run_id+'&appeal_type='+appeal_type+'&appeal_item='+appeal_item+'&appeal_running='+appeal_running;
      //alert(winURL);
      window.open(winURL,'_blank', "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=1200,height=400");
      //myExtObject.OpenWindowMax(winURL+'?run_id='+run_id);
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
            // if(excel[i]['old_red_no'])
            //   excel[i]['oldCaseNo'] = excel[i]['old_case_no']+" ("+excel[i]['old_red_no']+")";
            // else
            //   excel[i]['oldCaseNo'] = excel[i]['old_case_no'];

            for(var x=0;x<19;x++){
              if(x==0)
                data.push(excel[i]['red']);
              if(x==1)
                data.push(excel[i]['black']);
              if(x==2)
                data.push(excel[i]['appeal_type_name']);
              if(x==3)
                data.push(excel[i]['app_type_name']);
              if(x==4)
                data.push(excel[i]['appeal_item']);
              if(x==5)
                data.push(excel[i]['judge_order_name']);
              if(x==6)
                data.push(excel[i]['start_date']);
              if(x==7)
                data.push(excel[i]['case_send_date']);
              if(x==8)
                data.push(excel[i]['hsend_date']);
              if(x==9)
                data.push(excel[i]['hrec_date']);
              if(x==10)
                data.push(excel[i]['judgement_judge_date']);
              if(x==11)
                data.push(excel[i]['read_date']);
              if(x==12)
                data.push(excel[i]['judging_date']);
              if(x==13)
                data.push(excel[i]['rcv_date']);
              if(x==14)
                data.push(excel[i]['create_dep_name']);
              if(x==15)
                data.push(excel[i]['create_user']);
              if(x==16)
                data.push(excel[i]['create_date']);
              if(x==17)
                data.push(excel[i]['update_dep_name']);
              if(x==18)
                data.push(excel[i]['update_user']);
              if(x==19)
                data.push(excel[i]['update_date']);
            }

            extend[i] = $.extend([], data)
            data = [];
            //extend[i] = Object.values(data)
          }
        });
        if(bar){
          var objExcel = [];
          objExcel['numCase'] = this.numCase;
          objExcel['numLit'] = this.numLit;
          objExcel['data'] = extend;
          console.log(objExcel)
          this.excelService.exportAsExcelFile(objExcel,'fud9000' ,this.programName);
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

}







