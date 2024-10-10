import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,AfterContentInit,OnDestroy,Injectable   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { DatalistReturnComponent } from '@app/components/modal/datalist-return/datalist-return.component';
import { ModalJudgeComponent } from '@app/components/modal/modal-judge/modal-judge.component';
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
  selector: 'app-fsc0500,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fsc0500.component.html',
  styleUrls: ['./fsc0500.component.css']
})


export class Fsc0500Component implements AfterViewInit, OnInit, OnDestroy {

  getRank:any;
  sessData:any;
  userData:any;
  result:any = [];
  tmpResult:any = [];
  dataSearch:any = [];

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
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;


  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private excelService: ExcelService,
    private authService: AuthService,
    private ngbModal: NgbModal,
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
    //======================== prankpolice ======================================
    var student = JSON.stringify({
      "table_name" : "prankpolice",
      "field_id" : "rank_id",
      "field_name" : "rank_name",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getRank = getDataOptions;
        console.log(this.getRank)
        //var court = this.getRank.filter((x:any) => x.fieldIdValue === this.userData.courtId) ;
        //if(court.length!=0){
          //this.result.court_id = this.court_id = court[0].fieldIdValue;
        //}
      },
      (error) => {}
    )

    this.setDefPage(0);

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


    setDefPage(type:number){
      this.result = [];
      if(type==1){
        this.dataSearch = [];
        this.rerender();
      }
    }


    clickOpenMyModalComponent(val:any){

      if(val==1 || val==2 ){
        const modalRef = this.ngbModal.open(DatalistReturnComponent)
        modalRef.componentInstance.value1 = "ppolice"
        modalRef.componentInstance.value2 = "police_id"
        modalRef.componentInstance.value3 = "police_name"
        modalRef.componentInstance.types = 1
        modalRef.componentInstance.value9 = 1
        if(val==2)
          modalRef.componentInstance.value7 = " AND police_flag=2";
        modalRef.result.then((item: any) => {
          if(item){
            this.result.police_id = item.fieldIdValue
            this.result.police_name = item.fieldNameValue
          }
        }).catch((error: any) => {
          console.log(error)
        })
      }else if(val==3){
        var student = JSON.stringify({
          "cond": 2,
          "userToken": this.userData.userToken
        });
        this.listTable = 'pjudge';
        this.listFieldId = 'judge_id';
        this.listFieldName = 'judge_name';
        this.listFieldNull = '';
        this.listFieldType = JSON.stringify({ "type": 2 });
      
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/popupJudge', student).subscribe({
        complete: () => { }, // completeHandler
        error: (e) => { console.error(e) },    // errorHandler 
        next: (v) => {
          let productsJson: any = JSON.parse(JSON.stringify(v));
          if (productsJson.data.length) {
            this.list = productsJson.data;
            console.log(this.list)
          } else {
            this.list = [];
          }
  
          const modalRef: NgbModalRef = this.ngbModal.open(ModalJudgeComponent)
          modalRef.componentInstance.value1 = this.listTable
          modalRef.componentInstance.value2 = this.listFieldId
          modalRef.componentInstance.value3 = this.listFieldName
          modalRef.componentInstance.value4 = this.listFieldNull
          modalRef.componentInstance.value5 = this.listFieldType
          modalRef.componentInstance.items = this.list
          modalRef.componentInstance.types = 1
          modalRef.result.then((item: any) => {
            if (item) {
              console.log(item)
              this.result.judge_id = item.judge_id;
              this.result.judge_name = item.judge_name;
            }
          }).catch((error: any) => {
            console.log(error)
          })

        }
      });
      }
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
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
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
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
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


    searchData(){

      if(!this.result.send_sdate || !this.result.send_edate){
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

      }else{
        this.SpinnerService.show();
        
        this.tmpResult = $.extend({},this.result);
        this.tmpResult.result_flag = this.tmpResult.result_flag?this.tmpResult.result_flag.toString():'';
        this.tmpResult.s_no_cancel = this.tmpResult.s_no_cancel?this.tmpResult.s_no_cancel.toString():'';
        this.tmpResult.police_id = this.tmpResult.police_id?this.tmpResult.police_id.toString():'';
        this.tmpResult.req_title = this.tmpResult.req_title?this.tmpResult.req_title.toString():'';
        this.tmpResult.judge_id = this.tmpResult.judge_id?this.tmpResult.judge_id.toString():'';
        var jsonTmp = $.extend({}, this.tmpResult);
        jsonTmp['userToken'] = this.userData.userToken;

        var student = jsonTmp;
        console.log(student)
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type','application/json');

        this.http.post('/'+this.userData.appName+'ApiSC/API/NOTICESC/fsc0500', student ).subscribe(
          (response) =>{
              let productsJson : any = JSON.parse(JSON.stringify(response));
              console.log(productsJson)
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
            // if(excel[i]['old_red_no'])
            //   excel[i]['oldCaseNo'] = excel[i]['old_case_no']+" ("+excel[i]['old_red_no']+")";
            // else
            //   excel[i]['oldCaseNo'] = excel[i]['old_case_no'];



            for(var x=0;x<16;x++){
              if(x==0)
                data.push(excel[i]['title']+excel[i]['id']+'/'+excel[i]['yy']);
              if(x==1)
                data.push(excel[i]['s_no']+'/'+excel[i]['yy']);
              if(x==2)
                data.push(excel[i]['in_out']);
              if(x==3)
                data.push(excel[i]['police_name']);
              if(x==4)
                data.push(excel[i]['r_title']+excel[i]['r_name']);
              if(x==5)
                data.push(excel[i]['judge_name']);
              if(x==6)
                data.push(excel[i]['send_date']);
              if(x==7)
                data.push(excel[i]['seek_date']);
              if(x==8)
                data.push(excel[i]['result_flag']);
              if(x==9)
                data.push(excel[i]['s_no_cancel']);
              if(x==10)
                data.push(excel[i]['create_dep_name']);
              if(x==11)
                data.push(excel[i]['create_user']);
              if(x==12)
                data.push(excel[i]['create_date']);
              if(x==13)
                data.push(excel[i]['update_dep_name']);
              if(x==14)
                data.push(excel[i]['update_user']);
              if(x==15)
                data.push(excel[i]['update_date']);
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
          this.excelService.exportAsExcelFile(objExcel,'fsc0500' ,this.userData.programName);
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







