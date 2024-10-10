import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay, ConfirmBoxInitializer, ConfirmBoxConfigModule } from '@costlydeveloper/ngx-awesome-popup';
import { NgSelectComponent } from '@ng-select/ng-select';
// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';

import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
declare var myExtObject: any;
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';


@Component({
  selector: 'app-fmg0102,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fmg0102.component.html',
  styleUrls: ['./fmg0102.component.css']
})


export class Fmg0102Component implements AfterViewInit, OnInit, OnDestroy {
  //form: FormGroup;
  myExtObject:any;
  title = 'datatables';
  toPage:any='fmg0200';
  result:any = [];
  getCaseType:any;
  getCaseCate:any;
  getCaseTypeStat:any;
  getTitle:any;
  dataSearch:any = [];
  tmpResult:any = [];
  getTitleStat:any;
  getRedTitle:any;
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
  getResult:any;
  result_id:any;
  asyncObservable: Observable<string>;
  modalType:any;
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
  public loadModalComponent: boolean = false;
  public loadModalJudgeComponent: boolean = false;
  public loadModalJudgeComponentArry : boolean = false;


  //@ViewChild('fca0200',{static: true}) fca0200 : ElementRef;
  //@ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  // @ViewChild('Barcode',{static: true}) BarCode : ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild('sResult') sResult : NgSelectComponent;


  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,

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

    // if(this.items)
    // this.items.forEach((x : any ) => x.index = false);
    // console.log(this.items)

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

      //this.asyncObservable = this.makeObservable('Async Observable');
      this.successHttp();

     var student = JSON.stringify({
        "cond":2,
        "userToken" : this.userData.userToken
      });
    this.listTable='pjudge';
    this.listFieldId='judge_id';
    this.listFieldName='judge_name';
    this.listFieldNull='';
    this.listFieldType=JSON.stringify({"type":2});

  //console.log(student)

   this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student).subscribe(
       (response) =>{
         let productsJson :any = JSON.parse(JSON.stringify(response));
         if(productsJson.data.length){
           this.list=productsJson.data;
           console.log(this.list)
         }else{
            this.list = [];
         }
        //  this.list = response;
        // console.log('xxxxxxx',response)
       },
       (error) => {}
     )


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

    //======================== pcase_cate ======================================
    var student = JSON.stringify({
      "table_name" : "pcase_cate",
      "field_id" : "case_cate_id",
      "field_name" : "case_cate_name",
      "order_by": " case_cate_id ASC",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        getDataOptions.unshift({fieldIdValue:0,fieldNameValue: 'ทั้งหมด'});
        this.getCaseCate = getDataOptions;
        // this.selCaseType = $("body").find("ng-select#case_type span.ng-value-label").html();

      },
      (error) => {}
    )
    this.result.case_type = this.userData.defaultCaseType;
    this.changeCaseType(this.result.case_type);
    setTimeout(() => {
          this.result.title = this.userData.defaultTitle;
    }, 200);
    this.result.start_date = myExtObject.curDate();
    this.result.assign_date = myExtObject.curDate();
    this.searchData(3);
  }

  clickOpenMyModalComponent(val:any){
    this.modalType = val;
    this.openbutton.nativeElement.click();
  }
  loadMyModalComponent(){
    if(this.modalType==1 || this.modalType==2 || this.modalType==3 || this.modalType==4){
      this.loadModalJudgeComponent = true;
      this.loadModalJudgeComponentArry = false;
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

     this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student ).subscribe(
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
    }else if(this.modalType==5){//ผลคำพิพากษา
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
    }else if(this.modalType==6){
      // alert(this.modalType)
      $("#exampleModal").find(".modal-content").css("width","650px");
      this.loadModalJudgeComponent = false;
      this.loadModalJudgeComponentArry = false;
      this.loadModalComponent = true;
      this.loadComponent = false;
    }

    //ส่วนนี้จะใช้กับ popup return ธรรมดา
    if(this.modalType==5){
      this.loadModalComponent = false;
      this.loadComponent = true;
      this.loadModalJudgeComponent = false;
      this.loadModalJudgeComponentArry = false;
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



  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/

  successHttp() {
      var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fmg0102"
    });
    let promise = new Promise((resolve, reject) => {
      //let apiURL = `${this.apiRoot}?term=${term}&media=music&limit=20`;
      //this.http.get(apiURL)
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen )
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
    myExtObject.callCalendar();
    this.dtTrigger.next(null);
 }



  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
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
        // "condition": "AND case_type='"+val+"'",
        "order_by": " case_cate_id ASC",
        "userToken" : this.userData.userToken
      });

      var student4 = JSON.stringify({
        "table_name": "pcase_type_stat",
        "field_id": "case_type_stat",
        "field_name": "case_type_stat_desc",
        "condition": "AND case_type='"+val+"'",
        "order_by": " case_type_stat ASC",
        "userToken" : this.userData.userToken
      });




      //console.log("fCaseTitle")

      let promise = new Promise((resolve, reject) => {
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            //console.log(getDataOptions)
            this.getTitle = getDataOptions;
            this.result.title = '';
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

         this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student3).subscribe(
          (response) =>{
           let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getCaseCate = getDataOptions;
       },
           (error) => {}
         )

         this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student4).subscribe(
          (response) =>{
           let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.result.case_type_stat = '';
          this.result.title_stat = '';
          this.getCaseTypeStat = getDataOptions;
       },
           (error) => {}
         )


     });
      return promise;
    }

    changeTitle(val:any){
      var student5 = JSON.stringify({
        "table_name": "pstat_case_title",
        "field_id": "case_type_stat",
        "field_name": "case_title",
        "condition": "AND title_type = 'B' AND con_flag is null AND case_type ='"+this.result.case_type +"' AND case_type_stat='"+val+"'",
        "order_by": " case_type_stat ASC",
        "userToken" : this.userData.userToken
      });

      let promise = new Promise((resolve, reject) => {
        this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student5).subscribe(
          (response) =>{
           let getDataOptions : any = JSON.parse(JSON.stringify(response));
           this.result.title_stat = '';
           this.getTitleStat = getDataOptions;
           this.getTitleStat = this.getTitleStat.forEach((x : any) => this.result.title_stat = this.result.title_stat.length == 0?this.result.title_stat.concat('',x.fieldNameValue):this.result.title_stat.concat(',',x.fieldNameValue));
       },
           (error) => {}
         )
      });
      return promise;
    }

    checkUncheckAll() {
      for (var i = 0; i < this.checklist.length; i++) {
        this.checklist[i].edit0102 = this.masterSelected;
        }
      }

    isAllSelected() {
      this.masterSelected = this.checklist.every(function(item:any) {
          return item.edit0102 == true;
      })
    }

    toId(event:any){
      if(this.result.id)
      this.result.id2 = event.target.value;
    }


    assignJudgeArry(){
        for (var i = 0; i < this.dataSearch.length; i++){

        if(this.dataSearch[i].edit0102 == true){
          if(this.result.case_judge_id){
           this.dataSearch[i].case_judge_id = this.result.case_judge_id;
          this.dataSearch[i].case_judge_name = this.result.case_judge_name;
          }
          if(this.result.case_judge_gid){
            this.dataSearch[i].case_judge_gid = this.result.case_judge_gid;
          this.dataSearch[i].case_judge_gname = this.result.case_judge_gname;
          }
          if(this.result.case_judge_gid2){
            this.dataSearch[i].case_judge_gid2 = this.result.case_judge_gid2;
          this.dataSearch[i].case_judge_gname2 = this.result.case_judge_gname2;
          }
          if(this.result.start_date){
            this.dataSearch[i].case_judge_date = this.result.start_date;
          }
          if(this.result.assign_date){
            this.dataSearch[i].assign_date = this.result.assign_date;
          }
          if(this.result.own_new_flag){
            this.dataSearch[i].own_new_flag = this.result.own_new_flag;
          }
        }
      }
    }

    uncheckAll() {
      for (var i = 0; i < this.checklist.length; i++) {
        this.checklist[i].edit0102 = false;
      }

         // for (var i = 0; i < this.checklist2.length; i++) {
      //   this.checklist2[i].editNoticeId = false;
      // }
      this.masterSelected = false;
      // this.masterSelected2 = false;
      $("body").find("input[name='delValue']").val('');
      // $("body").find("input[name='delValue2']").val('');
    }
    // isAllSelected(obj:any,master:any,child:any) {
    //   this[master] = obj.every(function(item:any) {
    //     return item[child] == true;
    //   })
    // }


    // checkUncheckAll(obj:any,master:any,child:any) {
    //   for (var i = 0; i < obj.length; i++) {
    //     obj[i][child] = this[master];
    //   }
    //   // this.getCheckedItemList();
    // }

    // checkUncheckAll() {
    //   for (var i = 0; i < this.checklist.length; i++) {
    //     this.checklist[i].edit0102 = this.masterSelected;
    //     }
    //   }
    BarcodeSubmit(event:any){
      if(event.keyCode==13)
      if(!this.result.case_judge_id){
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('ป้อนผู้พิพากษาเจ้าของสำนวนก่อนยิง Barcode');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){this.SpinnerService.hide();}
          subscription.unsubscribe();
        });
    }else{
         const confirmBox = new ConfirmBoxInitializer();
      if(this.result.assign_judge_id==null){
        this.result.assign_judge_id = null;
      }
      var student = JSON.stringify({
          "barcode" : this.result.barcode,
          "start_date" : this.result.start_date,
          "assign_date" : this.result.assign_date,
          "own_new_flag" : this.result.own_new_flag,
          "case_judge_id" : this.result.case_judge_id,
          "case_judge_name" : this.result.case_judge_name,
          "case_judge_gid" : this.result.case_judge_gid,
          "case_judge_gname" : this.result.case_judge_gname,
          "case_judge_gid2" : this.result.case_judge_gid2,
          "case_judge_gname2" : this.result.case_judge_gname2,
          "assign_judge_id" : this.result.assign_judge_id,
          "assign_judge_name" : this.result.assign_judge_name,
          "userToken" : this.userData.userToken
      });
      console.log(student);

      this.http.post('/'+this.userData.appName+'ApiMG/API/MANAGEMENT/fmg0102/assignByBarcode', student).subscribe(
        (response) =>{
          let alertMessage : any = JSON.parse(JSON.stringify(response));
          console.log(alertMessage)
          if(alertMessage.result==0){
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
          }else{
            // this.SpinnerService.hide();
            // confirmBox.setMessage('จัดเก็บข้อมูลเรียบร้อยแล้ว');
            // confirmBox.setButtonLabels('ตกลง');
            // confirmBox.setConfig({
            //     layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
            // });
            // const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            //   if (resp.success==true){
            //      this.searchData(3);
            //      this.result.barcode = '';
            //     //  this.BarCode.nativeElement.focus();
            //      $("input[name='barcode']")[0].focus();
            //     //  window.setTimeout(function() { $('#dialog').dialog('close'); }, 4000);
            //     //  this.closebutton.nativeElement.click();
            //     //$("button[type='reset']")[0].click();
            //     //this.SpinnerService.hide();
            //   }
            //   subscription.unsubscribe();
            // });
            this.searchData(3);
            this.result.barcode = '';
            $("input[name='barcode']")[0].focus();
            //this.ngOnInit();
            //this.form.reset();
             // $("button[type='reset']")[0].click();

          }
        },
        (error) => {this.SpinnerService.hide();}
      )
    }

  }

  delData(run_id:any){
    //alert(index);
    this.result.del_id = run_id;
      this.clickOpenMyModalComponent(6);
  }

  submitModalForm(){

    var chkForm = JSON.parse(this.child.ChildTestCmp());

    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!chkForm.password){
      confirmBox.setMessage('กรุณาป้อนรหัสผ่าน');
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

    }else if(!chkForm.log_remark){
      confirmBox.setMessage('กรุณาป้อนเหตุผล');
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
    }else{
      const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
            confirmBox.setMessage('ยืนยันการลบข้อมูลที่เลือก');
            confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');

            // Choose layout color type
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  var dataDel = [],dataTmp=[];
                  var bar = new Promise((resolve, reject) => {
                    this.posts.forEach((ele, index, array) => {
                          // if(ele.edit0102 == true){
                          if(ele.run_id == this.result.del_id){
                            dataTmp.push(this.posts[index]);
                          }
                      });
                  });
                  if(bar){
                      //console.log(dataTmp)
                    dataDel['run_id'] = this.result.del_id;
                    dataDel['userToken'] = this.userData.userToken;
                    dataDel['log_remark'] = chkForm.log_remark;
                   // dataDel['data'] = dataTmp;
                    var data = $.extend({}, dataDel);
                  //  console.log(data);
                   console.log('pppppppppppppp');
                   console.log(JSON.stringify(data));
                   this.http.post('/'+this.userData.appName+'ApiMG/API/MANAGEMENT/fmg0102/delAssignData', data ).subscribe(
                    (response) =>{
                      let alertMessage : any = JSON.parse(JSON.stringify(response));
                      if(alertMessage.result==0){
                        this.SpinnerService.hide();

                      }else{

                        // this.closebutton.nativeElement.click();
                        //$("button[type='reset']")[0].click();
                        confirmBox.setMessage(alertMessage.error);
                        confirmBox.setButtonLabels('ตกลง');
                        confirmBox.setConfig({
                            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                        });
                        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                          if (resp.success==true){
                            this.closebutton.nativeElement.click();
                            this.searchData(2);
                          }
                          subscription.unsubscribe();
                        });

                      }
                    },
                    (error) => {this.SpinnerService.hide();}
                  )
                  }
                }
                subscription.unsubscribe();

              });
              }
           }


    submitForm(){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      var del = 0;
    var bar = new Promise((resolve, reject) => {
      this.dataSearch.forEach((ele, index, array) => {
        if(ele.edit0102 == true){
          del++;
        }
      });
    });
        //  alert(del);
      if(bar){

      if (!del) {
        confirmBox.setMessage('ไม่มีรายการที่เลือก');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING, // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe((resp) => {
          if (resp.success == true) {
            //this.SpinnerService.hide();

          }
          subscription.unsubscribe();
        });

      } else {

        var dataTmp = [],dataSave = [];
        var bar = new Promise((resolve, reject) => {
          this.dataSearch.forEach((ele, index, array) => {
                if(ele.edit0102 == true){
                  this.dataSearch[index]['start_date'] = this.result.start_date;
                  dataTmp.push(this.dataSearch[index]);
                }
            });
        });
        if(bar){
          dataSave['data'] = dataTmp;
          if(this.result.assign_judge_id==null){
            dataSave['assign_judge_id'] = null;
          }else{
            dataSave['assign_judge_id'] = this.result.assign_judge_id;
          }
          dataSave['userToken'] = this.userData.userToken;
          var data = $.extend({}, dataSave);
          console.log(JSON.stringify(data));
        this.SpinnerService.show();

          this.http
            .post('/'+this.userData.appName+'ApiMG/API/MANAGEMENT/fmg0102/saveData', data, {

            })
            .subscribe(
              (response) => {
                let alertMessage: any = JSON.parse(JSON.stringify(response));
                console.log(alertMessage);
                if (alertMessage.result == 0) {
                  this.SpinnerService.hide();
                  confirmBox.setMessage(alertMessage.error);
                  confirmBox.setButtonLabels('ตกลง');
                  confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.WARNING, // SUCCESS | INFO | NONE | DANGER | WARNING
                  });
                  const subscription = confirmBox
                    .openConfirmBox$()
                    .subscribe((resp) => {
                      if (resp.success == true) {
                        //this.SpinnerService.hide();
                      }
                      subscription.unsubscribe();
                    });
                } else {
                  this.SpinnerService.hide();
                  confirmBox.setMessage('จัดเก็บข้อมูลเรียบร้อยแล้ว');
                  confirmBox.setButtonLabels('ตกลง');
                  confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.SUCCESS, // SUCCESS | INFO | NONE | DANGER | WARNING
                  });
                  const subscription = confirmBox
                    .openConfirmBox$()
                    .subscribe((resp) => {

                      if (resp.success == true) {
                        //  $("input[type=text]").val('');
                        this.result.id = null;
                        this.result.id2 = null;
                        this.result.yy = null;
                        this.searchData(3);
                        $("input[name='id']")[0].focus();
                       // $("button[type='reset']")[0].click();
                        //this.SpinnerService.hide();
                      }
                      subscription.unsubscribe();
                    });
                  //  this.ngOnInit();
                  //this.form.reset();
                  // $("button[type='reset']")[0].click();
                }
              },
              (error) => {
                this.SpinnerService.hide();
              }
            );
        // }
        }
      }
      }
    }



    searchData(type:any){
      if(type==2){
        if(this.result.id && this.result.id2 && this.result.yy && this.result.case_judge_id){
          this.result.edit = 1;
        }else{
          this.result.edit = 0;
        }

      }else{
        this.result.edit = 0;
      }
      if(type==3){
       this.result.assign = 1;
       this.result.edit = 1;
      }else{
        this.result.assign = 0;
      }
      // alert(this.result.edit + ' ' + this.result.assign);
      // return false;
      if(this.result.assign != 1){
          console.log(this.result)
          if(!this.result.case_cate_id &&
            !this.result.assign_judge_id &&
            !this.result.case_judge_id &&
            !this.result.case_judge_gid &&
            !this.result.case_judge_gid2 &&
            !this.result.start_date &&
            !this.result.assign_date
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
          }else if(!this.result.id || !this.result.id2 || !this.result.yy ){
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            if(type==1){
              confirmBox.setMessage('ป้อนข้อมูลคดีที่ต้องการจ่ายสำนวน');
            }else{
              confirmBox.setMessage('ป้อนข้อมูลคดีที่ต้องการแก้ไข');
            }

            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){this.SpinnerService.hide();}
              subscription.unsubscribe();
            });
          }else if(!this.result.case_judge_id){
                const confirmBox = new ConfirmBoxInitializer();
                confirmBox.setTitle('ข้อความแจ้งเตือน');
                confirmBox.setMessage('ป้อนผู้พิพากษาเจ้าของสำนวน');
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){this.SpinnerService.hide();}
                  subscription.unsubscribe();
                });
          }else{
            this.loadData();
          }
      }else{
          this.loadData();
      }
    }

    loadData(){
      this.SpinnerService.show();
      this.tmpResult = this.result;
      var jsonTmp = $.extend({}, this.tmpResult);
      jsonTmp['assign'] = this.result.assign;
      jsonTmp['edit'] = this.result.edit;
      jsonTmp['userToken'] = this.userData.userToken;


      var student = jsonTmp;
      console.log(JSON.stringify(student))
      this.http.post('/'+this.userData.appName+'ApiMG/API/MANAGEMENT/fmg0102/searchData', student ).subscribe(
        (response) =>{
            let productsJson : any = JSON.parse(JSON.stringify(response));
            this.posts = productsJson.data;
            if(productsJson.result==1){
              //this.loadResult();
            this.checklist = this.posts;
            // this.checklist2 = this.posts;
            if(productsJson.data.length){
              if(this.result.assign==1){
                this.posts.forEach((x : any ) => x.edit0102 = false);
              }else{
                this.posts.forEach((x : any ) => x.edit0102 = true);
              }

            }

            // this.rerender();
            setTimeout(() => {
              myExtObject.callCalendar();
            }, 500);

              // var bar = new Promise((resolve, reject) => {
              //   productsJson.data.forEach((ele, index, array) => {
              //         // if(ele.indict_desc != null){
              //         //   if(ele.indict_desc.length > 47 )
              //         //     productsJson.data[index]['indict_desc_short'] = ele.indict_desc.substring(0,47)+'...';
              //         // }
              //         if(ele.deposit != null){
              //           productsJson.data[index]['deposit'] = this.curencyFormat(ele.deposit,2);
              //         }
              //     });
              // });

              // bar.then(() => {
              //   //this.dataSearch = productsJson.data;
              //   //console.log(this.dataSearch)
              // });

              this.dataSearch = productsJson.data;
              // this.numCase = productsJson.num_case;
              // this.numLit = productsJson.num_lit;
              //this.dtTrigger.next(null);
              this.assignJudgeArry();
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

    directiveDateArry(date:any,obj:any,index:any){
      console.log(date.target.value)
      this.dataSearch[index][obj] = date.target.value;
    }

    curencyFormat(n:any,d:any) {
      return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    }//100000 เป็น 100,000.00

    TranferJudge(){
      // alert('xxxxx');
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      var del = 0;
      var bar = new Promise((resolve, reject) => {
      this.dataSearch.forEach((ele, index, array) => {
        if(ele.edit0102 == true){
          del++;
        }
      });
    });

      if(bar){
      if (!del) {
        confirmBox.setMessage('กรุณาเลือกข้อมูลที่ต้องการจ่ายสำนวนคดี');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING, // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe((resp) => {
          if (resp.success == true) {
             // this.result.setFocus('barcode');
          }
          subscription.unsubscribe();
        });

      } else {
        // alert('ooooo');
        var dataTmp = [],dataSave = [];
        var bar = new Promise((resolve, reject) => {
          this.dataSearch.forEach((ele, index, array) => {
                if(ele.edit0102 == true){
                  dataTmp.push(this.dataSearch[index]);
                }
            });
        });
        if(bar){
          dataSave['data'] = dataTmp;
          dataSave['userToken'] = this.userData.userToken;
          var data = $.extend({}, dataSave);
          console.log(JSON.stringify(data));
        // this.SpinnerService.show();

        this.SpinnerService.hide();
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('ต้องการจ่ายสำนวนคดีใช่ไหม');
        confirmBox.setButtonLabels('ตกลง','ยกเลิก');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });

        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){
               this.assignJudgeArry();
          //   this.http.post('/'+this.userData.appName+'ApiMG/API/MANAGEMENT/fmg0102/assignCaseJudge', data ).subscribe(response => {
          //     let alertMessage : any = JSON.parse(JSON.stringify(response));
          //     confirmBox.setMessage(alertMessage.error);
          //     confirmBox.setButtonLabels('ตกลง');
          //     confirmBox.setConfig({
          //       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          //   });

          //     const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          //       if (resp.success==true){this.SpinnerService.hide();}
          //       subscription.unsubscribe();
          //     });
          //     // alert('วิ่งไปเรียก ปลดหมาย และแสดงข้อมูล');
          //     //  $("button[type='reset']")[0].click();
          //    //this.ngOnInit();
          //    this.searchData();
          //  });
          // }else{
          //   alert('ไม่ปลดหมาย แค่แสดงข้อมูล');
          }
          subscription.unsubscribe();
        });
        }
      }
      }
    }

    // submitCheck(){
    //   var jsonTmp = $.extend({}, this.tmpResult);
    //   jsonTmp['incomplete'] = '1';
    //   jsonTmp['userToken'] = this.userData.userToken;
    //   var student = jsonTmp;
    //   console.log(JSON.stringify(student))
    //   this.http.post('/'+this.userData.appName+'ApiST/API/STAT/fmg0102', student ).subscribe(
    //     (response) =>{
    //         let productsJson : any = JSON.parse(JSON.stringify(response));
    //         if(productsJson.result==1){
    //           //this.loadResult();
    //           this.dataSearch = productsJson.data;
    //           // this.numCase = productsJson.num_case;
    //           // this.numLit = productsJson.num_lit;
    //           //this.dtTrigger.next(null);
    //           this.rerender();
    //           console.log(this.dataSearch)
    //         }else{
    //           this.dataSearch = [];
    //           this.rerender();
    //        }
    //         console.log(productsJson)
    //         this.SpinnerService.hide();
    //     },
    //     (error) => {}
    //   )
    // }

  //   loadResult(){
  //     // alert('xxxxx');
  //      //======================== pjudge_result ======================================
  //    var student = JSON.stringify({
  //     "table_name" : "pjudge_result",
  //     "field_id" : "result_id",
  //     "field_name" : "result_desc",
  //     //"condition" : " AND case_type='"+this.result.case_type+"'",
  //     "condition" : " AND case_type=1",
  //     "userToken" : this.userData.userToken
  //   });
  //   let promise = new Promise((resolve, reject) => {
  //   this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
  //     (response) =>{
  //       let getDataOptions : any = JSON.parse(JSON.stringify(response));
  //       this.getResult = getDataOptions;
  //       console.log(this.getResult)

  //       // var Res = this.getResult.filter((x:any) => x.fieldIdValue === this.userData.userCode) ;
  //       // if(Res.length!=0){
  //       //   this.result.result_id = this.result_id = Res[0].fieldIdValue;
  //       // }
  //     },
  //     (error) => {}
  //   )
  //     });
  //     return promise;
  // }

    goToPage(run_id:any){
      let winURL = window.location.href;
      winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+this.toPage+'?run_id='+run_id;
      //alert(winURL);
      window.open(winURL,'_blank', "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=1200,height=400");
      //myExtObject.OpenWindowMax(winURL+'?run_id='+run_id);
    }

    goToPage2(topage:any,type:any){
      let winURL = window.location.href;
      if(type==1){
         winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+topage+'?hidTabPage=2';
      }else{
         winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+topage;
      }

      //alert(winURL);
      window.open(winURL,'_blank', "toolbar=no,menubar=1,location=no,directories=no,status=no,titlebar=no,fullscreen=no,scrollbars=1,resizable=no,width=1200,height=400");
      //myExtObject.OpenWindowMax(winURL+'?run_id='+run_id);
    }

    loadTableComponent(val:any){
      this.loadModalComponent = false;
      this.loadComponent = false;
      this.loadModalJudgeComponent = true;
      this.loadModalJudgeComponentArry = false;
      $("#exampleModal").find(".modal-body").css("height","auto");
   }

   loadTableComponentArry(val:any,index:any){
    this.modalType = val;
    this.loadModalComponent = false;
    this.loadComponent = false;
    this.loadModalJudgeComponent = false;
    this.loadModalJudgeComponentArry = true;
    this.result.index = index;
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

  tabChangeSelectArry(index:any,objName:any,objData:any,event:any,type:any){

    if(typeof objData!='undefined'){
      if(type==1){
        var val = objData.filter((x:any) => x.fieldIdValue === parseInt(event.target.value)) ;
      }else{
          var val = objData.filter((x:any) => x.fieldIdValue === event);
      }
      console.log(objData)
      //console.log(event.target.value)
      console.log(val)
      if(objName=='result_id'){

          if(val.length!=0){
              this.dataSearch[index]['edit0102'] = true;
            if(type==1)
              this.dataSearch[index]['result_desc'] = val[0].fieldNameValue;
            else
              this.dataSearch[index]['result_id'] = val[0].fieldIdValue;
          }else{
            this.dataSearch[index]['result_id'] = null;
            this.dataSearch[index]['result_desc'] = null;
          }


      }else if(objName==''){//ตัวอื่นๆ

      }

    }
  }

   closeModal(){
    this.loadComponent = false;
    this.loadModalComponent = false;
    this.loadModalJudgeComponent = false;
    this.loadModalJudgeComponentArry = false;
  }


  tabChangeInput(name:any,event:any){

      if(name=='assign_judge_id' || name=='case_judge_id' || name=='case_judge_gid' || name=='case_judge_gid2'){
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
            if(name=='assign_judge_id'){
              this.result.assign_judge_name = productsJson[0].fieldNameValue;
            }else if(name=='case_judge_id'){
              this.result.case_judge_name = productsJson[0].fieldNameValue;
            }else if(name=='case_judge_gid'){
              this.result.case_judge_gname = productsJson[0].fieldNameValue;
            }else if(name=='case_judge_gid2'){
              this.result.case_judge_gname2 = productsJson[0].fieldNameValue;
            }

          }else{
            if(name=='assign_judge_id'){
              this.result.assign_judge_id = null;
              this.result.assign_judge_name = '';
            }else if(name=='case_judge_id'){
              this.result.case_judge_id = null;
              this.result.case_judge_name = '';
            }else if(name=='case_judge_gid'){
              this.result.case_judge_gid = null;
              this.result.case_judge_gname = '';
            }else if(name=='case_judge_gid2'){
              this.result.case_judge_gid2 = null;
              this.result.case_judge_gname2 = '';
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
  //  tabChangeInput(name:any,event:any){
  //    if(name=='judge_id'){
  //     var student = JSON.stringify({
  //       "table_name" : "pjudge",
  //       "field_id" : "judge_id",
  //       "field_name" : "judge_name",
  //       "condition" : " AND judge_id='"+event.target.value+"'",
  //       "userToken" : this.userData.userToken
  //     });
  //     console.log(student)
  //   this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
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

  tabChangeInputArry(index:any,name:any,event:any,type:any){
    this.modalType = type;
     if(name=='judge_id'){
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
            this.dataSearch[index]['edit0102'] = true;
            if(this.modalType==2){
              this.dataSearch[index]['case_judge_name'] = productsJson[0].fieldNameValue;
               }else if(this.modalType==3){
                this.dataSearch[index]['case_judge_gname'] = productsJson[0].fieldNameValue;
               }else if(this.modalType==4){
                this.dataSearch[index]['case_judge_gname2'] = productsJson[0].fieldNameValue;
               }
          }else{
            if(this.modalType==2){
               this.dataSearch[index]['case_judge_id'] = null;
               this.dataSearch[index]['case_judge_name'] = '';
            }else if(this.modalType==3){
               this.dataSearch[index]['case_judge_gid'] = null;
               this.dataSearch[index]['case_judge_gname'] = '';
            }else if(this.modalType==4){
               this.dataSearch[index]['case_judge_gid2'] = null;
               this.dataSearch[index]['case_judge_gname2'] = '';
            }
          }
        },
        (error) => {}
      )
    }
  }

  // receiveJudgeListData(event:any){
  //   this.result.judge_id = event.judge_id;
  //   this.result.judge_name = event.judge_name;
  //   this.closebutton.nativeElement.click();
  // }

  receiveJudgeListDataArry(event:any){
    var index = this.result.index;
    this.dataSearch[index]['edit0102'] = true;
    if(this.modalType==2){
      this.dataSearch[index]['case_judge_id'] = event.judge_id;
      this.dataSearch[index]['case_judge_name'] = event.judge_name;
    }else if(this.modalType==3){
      this.dataSearch[index]['case_judge_gid'] = event.judge_id;
      this.dataSearch[index]['case_judge_gname'] = event.judge_name;
    }else if(this.modalType==4){
      this.dataSearch[index]['case_judge_gid2'] = event.judge_id;
      this.dataSearch[index]['case_judge_gname2'] = event.judge_name;
    }

    this.closebutton.nativeElement.click();
  }

  receiveJudgeListData(event:any){
    if(this.modalType==1){
       this.result.assign_judge_id = event.judge_id;
       this.result.assign_judge_name = event.judge_name;
    }else if(this.modalType==2){
       this.result.case_judge_id = event.judge_id;
       this.result.case_judge_name = event.judge_name;
    }else if(this.modalType==3){
      this.result.case_judge_gid = event.judge_id;
      this.result.case_judge_gname = event.judge_name;
    }else if(this.modalType==4){
      this.result.case_judge_gid2 = event.judge_id;
      this.result.case_judge_gname2 = event.judge_name;
    }

    this.closebutton.nativeElement.click();
  }

    directiveDate(date:any,obj:any){
     this.result[obj] = date;
    }
}







