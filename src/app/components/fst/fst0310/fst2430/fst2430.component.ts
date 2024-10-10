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
import { PrintReportService } from 'src/app/services/print-report.service';
import { NgbModal, NgbModalRef   } from '@ng-bootstrap/ng-bootstrap';
import { PopupStatComponent } from '@app/components/modal/popup-stat/popup-stat.component';
import { ClipboardModule} from 'ngx-clipboard';
//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
declare var myExtObject: any;

@Component({
  selector: 'app-fst2430,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fst2430.component.html',
  styleUrls: ['./fst2430.component.css']
})


export class Fst2430Component implements AfterViewInit, OnInit, OnDestroy {
  myExtObject :any;
  //form: FormGroup;
  title = 'datatables';
  toPage1 = 'fst2430';
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
  NewData:boolean;
  mData:any =[];
  sData:any =[];
  nData:any=[];
  result:any = [];
  dataSearch:any = [];
  data:any=[];
  getPost:any;
  modalType:any;
  getCaseStat:any;
  cTotal:any;
  cTypeHead:any;
  cType:any
  sum_finish=[];
  sumClick:any = 0;
  judge_total:any=[];
  newIdx:any;
  chk_accuse:any=[];
  chk_req:any=[];
  owner_hold:any=[];
  owner_new:any=[];
  conference_qty:any=[];
  mouth_qty:any=[];
  page_qty:any=[];
  red_return:any=[];
  finish_order:any=[];
  finish_compromise:any=[];
  finish_cancel:any=[];
  finish_dispense:any=[];
  finish_dispense_other:any=[];
  finish_other:any=[];
  finish_total:any=[];
  nover6m:any=[];
  over6m_nover1y:any=[];
  over1y_nover2y:any=[];
  over2y_nover5y:any=[];
  morethan5y:any=[];
  hold_total:any=[];
  case_transfer:any=[];
  case_transfer_to:any=[];
  judge_id:any;
  judge_name:any;

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldType:any;
  public loadModalListComponent: boolean = false;
  public loadModalJudgeComponent: boolean = false;


  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  public loadModalComponent: boolean = false;
  public loadJudgeComponent: boolean = false;
  private globalFlag = -1;

  @ViewChild('formHtml',{static: true}) formHtml : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  //@ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private printReportService: PrintReportService,
    private ngbModal: NgbModal,
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
    console.log(this.userData);

      //this.asyncObservable = this.makeObservable('Async Observable');
      this.successHttp();
      this.setDefForm();
      this.selData = [
        {id: '0',text: '----ประจำเดือน----'},
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

  setDefForm(){
    this.result=[];this.posts=[];this.sum_finish=[];
    this.result.stat_mon = '0';
    this.sumClick = 0;
    // this.result.stat_date = myExtObject.curDate();
    this.result.off_id = this.userData.userCode;
    this.result.off_name = this.userData.offName;
    this.result.off_post = this.userData.postName;
    this.result.sign_id = this.userData.directorId;
    this.result.sign_name = this.userData.directorName;
    this.result.sign_post = this.userData.directorPostName;
    // this.result.report_judge_id = this.userData.headJudgeId;
    // this.result.report_judge_name = this.userData.headJudgeName;
    // this.result.report_judge_post = this.userData.headJudgePost;
    this.result.pstat_year = myExtObject.curYear();
    this.result.post_id = this.userData.userCode;
    console.log('posts=>' + this.posts.length);
    this.NewData = false;
  }

  showCaseAll(item:any){
    if(item){
      const modalRef: NgbModalRef = this.ngbModal.open(PopupStatComponent,{ windowClass: 'my-class'})
      modalRef.componentInstance.items = item
    }
  }


  async successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fst2430"
    });


    let promise = await new Promise((resolve, reject) => {
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen , {headers:headers})
        .toPromise()
        .then(
          res => { // Success
          let getDataAuthen : any = JSON.parse(JSON.stringify(res));
          console.log(getDataAuthen)
          this.programName = getDataAuthen.programName;
          this.defaultCaseType = getDataAuthen.defaultCaseType;
          this.getCaseType();
          this.result.pstat_month = '0';
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
    myExtObject.callCalendar();
    this.dtTrigger.next(null);
     }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  async getCaseType(){
    var student = JSON.stringify({
      "table_name" : "pcase_type",
      "field_id" : "case_type",
      "field_name" : "case_type_desc",
      "condition" : "AND case_type =2",
      "order_by" : " case_type ASC ",
      "userToken" : this.userData.userToken
    });
    //console.log("fCaseType")
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    let promise = await new Promise((resolve, reject) => {
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          // console.log(getDataOptions)
          this.caseType = getDataOptions;
          this.result.pcase_type = 2;
          // this.result.pcase_type = this.defaultCaseType;
          // console.log(this.defaultCaseType);
          // console.log(this.result.pcase_type);
          this.changeCaseType(this.result.pcase_type);
          // this.caseTypeStat();
        },
        (error) => {}
      )
    });
    return promise;
  }
  changeMonth(val:any){
    this.selMonth = val;
  }

  async searchData () {
    //console.log(this.formHtml)

    var student = JSON.stringify({
      "case_type" : this.result.pcase_type,
      "stat_mon" : this.result.pstat_month,
      "stat_year" : this.result.pstat_year,
      "userToken" : this.userData.userToken
    });
    console.log(student)
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    /*
    this.subscription = this.http.post('/'+this.userData.appName+'ApiST/API/fst2430/getStatData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        this.mGroup = getDataOptions.data;
        this.ngOnDestroy();
      },
      (error) => {}
    );*/

    let promise = await new Promise((resolve, reject) => {
        this.http.post('/'+this.userData.appName+'ApiST/API/STAT/fst2430', student , {headers:headers}).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            console.log(getDataOptions);
            if(getDataOptions.result > 0){
              let getData : any = getDataOptions.data;
            // let sumData : any = getDataOptions.sum_data;
            let getStatData : any;

            for (let i = 0; i < getData.length; i++) {
                console.log(getData[i]);

                getData[i]['item_no'] = i + 1;
                getStatData = getData[i].stat_data;
              for (let j = 0; j < getStatData.length; j++) {
                   getStatData[j]['finish_total'] = (getStatData[j].finish_order + getStatData[j].finish_compromise + getStatData[j].finish_cancel + getStatData[j].finish_dispense + getStatData[j].finish_dispense_other + getStatData[j].finish_other);
                   getStatData[j]['hold_total'] = (getStatData[j].nover6m + getStatData[j].over6m_nover1y + getStatData[j].over1y_nover2y + getStatData[j].over2y_nover5y + getStatData[j].morethan5y);
              }
            }
            var bar = new Promise((resolve, reject) => {
                  getDataOptions.data.forEach((ele, index, array) => {
                    // if(ele.indict_desc != null){
                    //   if(ele.indict_desc.length > 47 )
                    //     productsJson.data[index]['indict_desc_short'] = ele.indict_desc.substring(0,47)+'...';
                    // }
                    // if(ele.deposit != null){
                    //   productsJson.data[index]['deposit_comma'] = this.curencyFormat(ele.deposit,2);
                    // }
                    if(ele.judge_id != null){
                      getDataOptions.data[index]['edit2430'] = false;
                    }
                });
            });

            bar.then(() => {
              //this.dataSearch = productsJson.data;
              //console.log(this.dataSearch)
            });

                this.posts = getDataOptions;
                console.log('posts=>');
                console.log(this.posts);
                // this.mData = getDataOptions.sum_data;
                // console.log('mData=>');
                // console.log(this.mData);
                // this.sData = this.mData[0];
                // console.log('statData=>');
                // console.log(this.sData);
                this.dataSearch = getDataOptions.data;
            }else{
                this.getMessage(getDataOptions.error);

            }

          },
          (error) => {}
        )

    });
    //return promise;
  }

  // caseTypeStat(){
  //   var student = JSON.stringify({
  //     "table_name" : "pcase_type_stat",
  //     "field_id" : "case_type_stat",
  //     "field_name" : "case_type_stat_desc",
  //     "condition" : "AND case_type='"+this.result.pcase_type+"'",
  //     "order_by": " case_type_stat ASC",
  //     "userToken" : this.userData.userToken
  //   });
  //   this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
  //     (response) =>{
  //       let getDataOptions : any = JSON.parse(JSON.stringify(response));
  //       this.cType = getDataOptions;
  //       console.log(this.cType);
  //     },
  //     (error) => {}
  //   )
  // }

  saveData(){
    // alert('xxxxx');
    var data;
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    var del = 0;
    var bar = new Promise((resolve, reject) => {
    this.dataSearch.forEach((ele, index, array) => {
      if(ele.edit2430 == true){
        del++;
      }
    });
  });

    if(bar){
    if (!del) {
      data = this.posts;
      console.log(data);
      // return(false);
     } else {
      // alert('ooooo');
      var dataTmp = [],dataSave = [];
      var bar = new Promise((resolve, reject) => {
        this.dataSearch.forEach((ele, index, array) => {
              if(ele.edit2430 == false){
                dataTmp.push(this.dataSearch[index]);
                // console.log(this.dataSearch[index]);
                // return(false);
              }
          });
      });


      if(bar){

        // console.log(dataTmp);
        data = this.posts;
        console.log(data.data);
        data.data = dataTmp;
        console.log(data.data);
        // var data2 = data.data;
        // data.data = dataTmp;
        // dataSave['data'] = dataTmp;

        // data = $.extend({}, dataSave);
        // console.log(JSON.stringify(data));
        console.log(data);
     // this.SpinnerService.show();
      }
    }

    if(this.NewData == true){
      console.log('เพิ่มข้อมูลใหม่');
      var tmp=[];

      for (let i = 0; i < this.getCaseStat.length; i++) {
        tmp[i]={
          "case_type_stat" : this.getCaseStat[i].fieldIdValue,
          "case_type_stat_desc" : this.getCaseStat[i].fieldNameValue,
          "chk_accuse" : this.chk_accuse[i] ? this.chk_accuse[i] : null,
          "chk_req" : this.chk_req[i] ? this.chk_req[i] : null,
          "owner_hold" : this.owner_hold[i] ? this.owner_hold[i] : null,
          "owner_new" : this.owner_new[i] ? this.owner_new[i] : null,
          "conference_qty" : this.conference_qty[i] ? this.conference_qty[i] : null,
          "mouth_qty" : this.mouth_qty[i] ? this.mouth_qty[i] : null,
          "page_qty" : this.page_qty[i] ? this.page_qty[i] : null,
          "red_return" : this.red_return[i] ? this.red_return[i] : null,
          "finish_order" : this.finish_order[i] ? this.finish_order[i] : null,
          "finish_compromise" : this.finish_compromise[i] ? this.finish_compromise[i] : null,
          "finish_cancel" : this.finish_cancel[i] ? this.finish_cancel[i] : null,
          "finish_dispense" : this.finish_dispense[i] ? this.finish_dispense[i] : null,
          "finish_dispense_other" : this.finish_dispense_other[i] ? this.finish_dispense_other[i] : null,
          "finish_other" : this.finish_other[i] ? this.finish_other[i] : null,
          "finish_total" : this.finish_total[i] ? this.finish_total[i] : null,
          "nover6m" : this.nover6m[i] ? this.nover6m[i] : null,
          "over6m_nover1y" : this.over6m_nover1y[i] ? this.over6m_nover1y[i] : null,
          "over1y_nover2y" : this.over1y_nover2y[i] ? this.over1y_nover2y[i] : null,
          "over2y_nover5y" : this.over2y_nover5y[i] ? this.over2y_nover5y[i] : null,
          "morethan5y" : this.morethan5y[i] ? this.morethan5y[i] : null,
          "hold_total" : this.hold_total[i] ? this.hold_total[i] : null,
          "case_transfer" : this.case_transfer[i] ? this.case_transfer[i] : null,
          "case_transfer_to" : this.case_transfer_to[i] ? this.case_transfer_to[i] : null,

        };
      }

      var student = {
        "edit2430" : false,
        "gen_no" : '',
        "judge_id" : this.judge_id,
        "judge_name" : this.judge_name,
        "item_no" : this.newIdx,
        "stat_data" : tmp,
      };
      console.log(student);

    }

     data['userToken'] = this.userData.userToken;
     console.log(data);
     console.log(JSON.stringify(data));
      this.SpinnerService.hide();
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('ต้องการจัดเก็บข้อมูลใช่หรือไม่');
      confirmBox.setButtonLabels('ตกลง','ยกเลิก');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });

      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          data.data.push(student);
          this.NewData = false;
          this.http.post('/'+this.userData.appName+'ApiST/API/STAT/fst2430/saveData', data ).subscribe(response => {
            let alertMessage : any = JSON.parse(JSON.stringify(response));
            console.log(alertMessage);
            confirmBox.setMessage(alertMessage.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
          });

            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){

                this.SpinnerService.hide();}
              subscription.unsubscribe();
            });
            // alert('วิ่งไปเรียก ปลดหมาย และแสดงข้อมูล');
            //  $("button[type='reset']")[0].click();
           //this.ngOnInit();
           this.searchData();
           this.sumClick = '';
          });
        // }else{
        //   alert('ไม่ปลดหมาย แค่แสดงข้อมูล');
        }
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

  buttNew(){
    if(this.posts.length != 0){
      this.newIdx = this.posts.data.length + 1;
      console.log(this.newIdx);
    }
    this.NewData = true;
  }

  tabChangeSelect(objId:any,objName:any,objPost:any, event:any){
    if(objId == "off_id" || objId == "sign_id"){
      var student = JSON.stringify({
        "table_name" : "pofficer",
        "field_id" : "off_id",
        "field_name" : "off_name",
        "field_name2" : "post_id",
        "condition" : " AND off_id='"+event.target.value+"' ",
        "userToken" : this.userData.userToken
      });
    }else if(objId == "report_judge_id" || objId == "judge_id"){
      var student = JSON.stringify({
        "table_name" : "pjudge",
        "field_id" : "judge_id",
        "field_name" : "judge_name",
        "field_name2" : "post_id",
        "condition" : " AND judge_id='"+event.target.value+"' ",
        "userToken" : this.userData.userToken
      });
    }
    // console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        // console.log(getDataOptions)
        if(getDataOptions.length){
          this[objId] = getDataOptions[0].fieldIdValue;
          this[objName] = getDataOptions[0].fieldNameValue;

          if(objId == "off_id")
            this.getPost(getDataOptions[0].fieldNameValue2,1);
          else if(objId == "sign_id")
            this.getPost(getDataOptions[0].fieldNameValue2,2);
          else if(objId == "report_judge_id")
            this.getPost(getDataOptions[0].fieldNameValue2,3);
        }else{
          this[objId] = "";
          this[objName] = "";
        }
      },
      (error) => {}
    )
  }
  // addNew(){
  //   if(this.posts.length != 0){
  //   var i  = this.posts.data.length + 1;
  //   console.log(i);
  //   this.posts.data.push({'item_no':i,'judge_id':'','judge_name':'','stat_data':''});
  //   this.posts.data.stat_data.push({'chk_accuse':'','chk_req':'','owner_hold':'','owner_new':'','conference_qty':''});

  //   }
  // }

  buttProcess(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(!this.result.pstat_month){
      confirmBox.setMessage('กรุณาเลือกเดือนที่ต้องการประมวล');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else{
      this.SpinnerService.show();

      var student = JSON.stringify({
        "case_type" : this.result.pcase_type,
        "stat_mon" : this.result.pstat_month,
        "stat_year" : this.result.pstat_year,
        "userToken" : this.userData.userToken
        });

      this.http.post('/'+this.userData.appName+'ApiST/API/STAT/fst2430/getStatData', student ).subscribe(
        (response) =>{
          let alertMessage : any = JSON.parse(JSON.stringify(response));
            if(alertMessage.result==1){
              // this.assingData(alertMessage);
              // this.SpinnerService.hide() ปิดที่ assingData
              this.searchData();
            }else{
              this.SpinnerService.hide();
              confirmBox.setMessage(alertMessage.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  //this.SpinnerService.hide();
                }
                subscription.unsubscribe();
              });
            }
        },
        (error) => {this.SpinnerService.hide();}
      )
    }
  }

  assingData(productsJson :any){
    this.posts = productsJson;
    this.data = productsJson.data;

    this.judge_total =[];
    for (let i = 0; i < this.data.length; i++) {
      for (let j = 0; j < this.data[i].stat_data.length; j++) {
        this.posts.data[i].stat_data[j].judge_total = this.assignValue(this.data[i].stat_data[j].judge_order) + this.assignValue(this.data[i].stat_data[j].finish_agree) +
        this.assignValue(this.data[i].stat_data[j].judge_cancel) + this.assignValue(this.data[i].stat_data[j].judge_dispense) +
        this.assignValue(this.data[i].stat_data[j].judge_other)+ this.assignValue(this.data[i].stat_data[j].judge_dispense_other);
      }
    }


    if(productsJson.data.length)
        this.posts.data.forEach((x : any ) => x.edit2320 = false);
    console.log(this.posts);
    this.checklist = this.posts.data;

    setTimeout(() => {
      this.SpinnerService.hide();
    }, 500);
  }

  receiveFuncJudgeListData(event: any) {
    this.judge_id = event.judge_id;
    this.judge_name = event.judge_name;
    this.closebutton.nativeElement.click();
  }
  // changeDataNew(i:any){

  //   this.judge_total[i] = this.assignValue(this.judge_order[i]) + this.assignValue(this.finish_agree[i]) +
  //   this.assignValue(this.judge_cancel[i]) + this.assignValue(this.judge_dispense[i]) +
  //   this.assignValue(this.judge_other[i])+this.assignValue(this.judge_dispense_other[i]);
  // }


  isAllSelected(obj:any,master:any,child:any) {
    this[master] = obj.every(function(item:any) {
      return item[child] == true;
    })
    this.getCheckedItemList();
  }

  getCheckedItemList(){
    var del = 0;
    var bar = new Promise((resolve, reject) => {
      this.dataSearch.forEach((ele, index, array) => {
        if(ele.edit2430 == true){
          del++;
        }
      });
    });
    if(bar){
      if(del)
        this.sumClick = del+" รายการ";
      else
        this.sumClick = '';
    }
  }

  assignValue(num:any){
    if((num == undefined) || (num == "") || (num == null))
      return 0;
    else
      return parseInt(num);
  }

  changeData(event:any,i:any,j:any){
    // console.log(i, j);
    // this.finish_total[j] = 0;
    for (let index = 0; index < this.posts.data.length; index++) {
      // this.finish_total[j] +=  this.assignValue(this.posts.data[index].stat_data[j].case_new2);
    }
  }

  curencyFormat(n:any,d:any) {
    return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  }//100000 เป็น 100,000.00

  tabChangeInput(name:any,event:any){
    if(name=='pdep_code'){
      var student = JSON.stringify({
        "table_name" : "pdepartment",
        "field_id" : "dep_code",
        "field_name" : "dep_name",
        "condition" : " AND dep_code='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
          (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)
          if(productsJson.length){
            this.result.dep_name = productsJson[0].fieldNameValue;
          }else{
            this.result.pdep_code = '';
            this.result.dep_name = '';
          }
          },
          (error) => {}
        )
    }else if(name=='off_id'){
      var student = JSON.stringify({
        "table_name" : "pofficer",
        "field_id" : "off_id",
        "field_name" : "off_name",
        "field_name2" : "post_id",
        "condition" : " AND off_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
          (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.result.off_name = productsJson[0].fieldNameValue;
            this.getPosts(productsJson[0].fieldNameValue2,2);
          }else{
            this.result.off_id = '';
            this.result.off_name = '';
          }
          },
          (error) => {}
        )
    }else if(name=='sign_id'){
      var student = JSON.stringify({
        "table_name" : "pofficer",
        "field_id" : "off_id",
        "field_name" : "off_name",
        "field_name2" : "post_id",
        "condition" : " AND off_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
          (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.result.sign_name = productsJson[0].fieldNameValue;
            this.getPosts(productsJson[0].fieldNameValue2,3);
          }else{
            this.result.sign_id = '';
            this.result.sign_name = '';
          }
          },
          (error) => {}
        )
    }else if(name=='preport_judge_id'){
      var student = JSON.stringify({
        "table_name" : "pjudge",
        "field_id" : "judge_id",
        "field_name" : "judge_name",
        "field_name2" : "post_id",
        "condition" : " AND judge_id='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });
        console.log(student)
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
          (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));
          if(productsJson.length){
            this.result.preport_judge_name = productsJson[0].fieldNameValue;
            this.getPost(productsJson[0].fieldNameValue2,4);
          }else{
            this.result.preport_judge_id = '';
            this.result.preport_judge_name = '';
          }
          },
          (error) => {}
        )
    }
  }

  clickOpenMyModalComponent(type:any){
    this.modalType = type;
    this.openbutton.nativeElement.click();
 }

 loadMyModalComponent(){
  console.log("loadMyModalComponent", this.modalType);
  if(this.modalType == 1 || this.modalType == 2 || this.modalType == 3){
    if(this.modalType == 1 || this.modalType == 2){
    var student = JSON.stringify({
      "table_name" : "pofficer",
      "field_id" : "off_id",
      "field_name" : "off_name",
      "field_name2" : "post_id",
      "userToken" : this.userData.userToken
    });
    this.listTable='pofficer';
    this.listFieldId='off_id';
    this.listFieldName='off_name';
    this.listFieldName2='';
    this.listFieldCond="";
    }else if(this.modalType == 3){
      var student = JSON.stringify({
        "table_name" : "pjudge",
        "field_id" : "judge_id",
        "field_name" : "judge_name",
        "field_name2" : "post_id",
        "userToken" : this.userData.userToken
      });
      this.listTable='pjudge';
      this.listFieldId='judge_id';
      this.listFieldName='judge_name';
      this.listFieldName2='';
      this.listFieldCond="";
    }
    console.log(this.modalType, student);
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
      (response) =>{
        this.list = response;

        this.loadComponent = true;
        this.loadModalComponent = false;
        this.loadJudgeComponent = false;
      },
      (error) => {}
    )

  } if(this.modalType == 4){
     var student = JSON.stringify({
      "cond": 2,
      "userToken": this.userData.userToken
    });
    this.listTable = 'pjudge';
    this.listFieldId = 'judge_id';
    this.listFieldName = 'judge_name';
    this.listFieldName2 = "position";
    this.listFieldType = JSON.stringify({ "type": 2 });

    this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student).subscribe(
      (response) => {
        let productsJson: any = JSON.parse(JSON.stringify(response));
        if (productsJson.data.length) {
          this.list = productsJson.data;
        } else {
          this.list = [];
        }
        this.loadComponent = false;
        this.loadModalComponent = false;
        this.loadJudgeComponent = true;
      },
      (error) => { }
    )
  }else{
    this.loadComponent = false;
    this.loadModalComponent = true;
    this.loadJudgeComponent = false;
  }
}

receiveFuncListData(event:any){
  console.log(event)
  if(this.modalType==1){
    this.result.pdep_code=event.fieldIdValue;
    this.result.dep_name=event.fieldNameValue;
  }else if(this.modalType==2){
    this.result.off_id=event.fieldIdValue;
    this.result.off_name=event.fieldNameValue;
    this.getPosts(event.fieldNameValue2,this.modalType);
  }else if(this.modalType==3){
    this.result.sign_id=event.fieldIdValue;
    this.result.sign_name=event.fieldNameValue;
    this.getPosts(event.fieldNameValue2,this.modalType);
  }else if(this.modalType==4){
    this.result.preport_judge_id=event.fieldIdValue;
    this.result.preport_judge_name=event.fieldNameValue;
    this.getPosts(event.fieldNameValue2,this.modalType);
  }

  this.closebutton.nativeElement.click();
}

getPosts(post_id:any,modalType:any){
  if(post_id){
    var student = JSON.stringify({
      "table_name" : "pposition",
      "field_id" : "post_id",
      "field_name" : "post_name",
      "condition" : " AND post_id='"+post_id+"'",
      "userToken" : this.userData.userToken
    });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        if(productsJson.length){
          if(modalType==2)
            this.result.off_post = productsJson[0].fieldNameValue;
          else if (modalType==3)
            this.result.sign_post = productsJson[0].fieldNameValue;
          else if (modalType==4)
            this.result.preport_judge_post = productsJson[0].fieldNameValue;
        }else{
          if(modalType==2)
            this.result.off_post = '';
          else if (modalType==3)
            this.result.sign_post = '';
          else if (modalType==4)
            this.result.preport_judge_post = '';
        }
        },
        (error) => {}
      )
  }
}


  ev(flag:any){
    if(flag != this.globalFlag){
      //console.log("TRIGGER!")
      this.dtTrigger.next(null);
      this.globalFlag = flag;
    }
  }

  closeModal(){
    this.loadModalListComponent = false;
    this.loadModalJudgeComponent = false;
  }

  printReport(type:any){
    var rptName = 'rst2430';
    // For no parameter : paramData ='{}'
    var paramData ='{}';
    // For set parameter to report
    var paramData = JSON.stringify({
      "ptype" : type.toString(),
      "pcourt_running" : this.userData.courtRunning.toString(),
      "pcase_type" : this.result.pcase_type.toString(),
      "pstat_mon" : this.result.pstat_month,
      "pstat_year" : this.result.pstat_year,
      "pcase_type_stat" : this.result.pcase_type_stat,
      "puser_name" : this.result.user_name,
      "poff_name" : this.result.off_name,
      "poff_post" : this.result.off_post,
      "psign_name" : this.result.sign_name,
      "psign_post" : this.result.sign_post

    });
    console.log("paramData->",paramData);
    this.printReportService.printReport(rptName,paramData);
  }

  ClearAll(){
    let winURL = window.location.href.split("/#/")[0]+"/#/";
    location.replace(winURL+this.toPage1)
    window.location.reload();
  }

  changeCaseType(caseType:any){
    // this.form.case_type_stat = null;
    //======================== pcase_type_stat ======================================
    var student = JSON.stringify({
      "table_name" : "pcase_type_stat",
      "field_id" : "case_type_stat",
      "field_name" : "case_type_stat_desc",
      "condition" : " AND case_type='"+caseType+"'",
      "userToken" : this.userData.userToken
    });

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseStat = getDataOptions;
        console.log(this.getCaseStat);
        if(getDataOptions.length > 0){
          this.result.pcase_type_stat = getDataOptions[0].fieldIdValue;
        }else{
          this.result.pcase_type_stat = '';
        }
      //   if(type==2){
      //     this.result = [];
      //  }
      },
      (error) => {}
    )
  }

}







