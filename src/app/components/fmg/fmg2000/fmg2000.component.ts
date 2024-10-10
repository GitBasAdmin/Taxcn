import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Renderer2   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { catchError, map , } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
declare var myExtObject: any;
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { PrintReportService } from 'src/app/services/print-report.service';

@Component({
  selector: 'app-fmg2000,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fmg2000.component.html',
  styleUrls: ['./fmg2000.component.css']
})


export class Fmg2000Component implements AfterViewInit, OnInit, OnDestroy {

  title = 'datatables';

  posts:any;
  delList:any=[];
  result:any=[];
  search:any;
  masterSelected:boolean;
  masterSelected2:boolean;
  checklist:any;
  checklist2:any;
  checkedList:any;
  delValue:any;
  delValue2:any;
  sessData:any;
  userData:any;
  absentdate1:any;
  absentdate2:any;
  myExtObject:any;
  programName:string;
  judge_name:any;
  time_start:any;
  time_end:any;
  all_day_flag:any;
  absent_type:any;
  absent_desc:any;
  remark:any;
  getJudge:any;
  getAssignType:any;
  getGroupRunning:any;
  getCaseCate:any;
  getMonthTh:any;
  judge_id:any;
  hid_judge_id:any;
  hid_assign_date:any;
  hid_assign_type:any;
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
  // @ViewChild('judge_id',{static: true}) judge_id : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  public loadModalComponent: boolean = false;
  public loadMutiComponent: boolean = false;
  public loadModalJudgeComponent: boolean = false;

  constructor(
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private printReportService: PrintReportService,
    private renderer: Renderer2
  ){
    this.masterSelected = false
    // this.masterSelected2 = false
  }

  ngOnInit(): void {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 30,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[[2,'asc']]
    };

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

      this.SpinnerService.show();
      var student = JSON.stringify({
        "userToken" : this.userData.userToken,
        "year" : myExtObject.curYear().toString(),
        "month" : myExtObject.curMonth(),
        // "year" : '2560',
        // "month" : '08',
      });
      console.log(student);
      // this.http.get('/'+this.userData.appName+'ApiMG/API/MANAGEMENT/fmg2000/getData?userToken='+this.userData.userToken+':angular').subscribe(posts => {
      this.http.post('/'+this.userData.appName+'ApiMG/API/MANAGEMENT/fmg2000/getData', student ).subscribe(posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          console.log(productsJson)
          this.posts = productsJson.data;
          console.log(this.posts);
          if(productsJson.result==1){
            this.checklist = this.posts;
            // this.checklist2 = this.posts;
            if(productsJson.data.length)
              this.posts.forEach((x : any ) => x.editJudgeId = false);
            this.rerender();
          // }else{
          //   confirmBox.setMessage(productsJson.error);
          //   confirmBox.setButtonLabels('ตกลง');
          //   confirmBox.setConfig({
          //       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          //   });
          //   const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          //     if (resp.success==true){}
          //     subscription.unsubscribe();
          //   });
          }
          this.SpinnerService.hide();
      });

      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      var authen = JSON.stringify({
        "userToken" : this.userData.userToken,
        "url_name" : "fmg2000"
      });
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen , {headers:headers}).subscribe(
        (response) =>{
          let getDataAuthen : any = JSON.parse(JSON.stringify(response));
          this.programName = getDataAuthen.programName;
          console.log(getDataAuthen)
        },
        (error) => {}
      )

      //======================== pjudge ======================================
    var student = JSON.stringify({
      "table_name" : "pjudge",
      "field_id" : "judge_id",
      "field_name" : "judge_name",
      "field_name2" : "short_judge_name",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getJudge = getDataOptions;
        this.getJudge.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
        //console.log(this.getJudge)
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
    //======================== passign_type ======================================
    var student = JSON.stringify({
      "table_name" : "passign_type",
      "field_id" : "assign_type",
      "field_name" : "assign_desc",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getAssignType = getDataOptions;
        console.log.apply(this.getAssignType);
        //this.getAssignType.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
      },
      (error) => {}
    )

    //======================== pjudge_group ======================================
    var student = JSON.stringify({
      "table_name" : "pjudge_group",
      "field_id" : "group_running",
      "field_name" : "party_id",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getGroupRunning = getDataOptions;
        // console.log.apply(this.getGroupRunning);
        //this.getGroupRunning.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
      },
      (error) => {}
    )

    this.getMonthTh = [{"fieldIdValue": '1', "fieldNameValue": "มกราคม"},
    {"fieldIdValue": '2', "fieldNameValue": "กุมภาพันธ์"},
    {"fieldIdValue": '3',"fieldNameValue": "มีนาคม"},
    {"fieldIdValue": '4',"fieldNameValue": "เมษายน"},
    {"fieldIdValue": '5',"fieldNameValue": "พฤษภาคม"},
    {"fieldIdValue": '6',"fieldNameValue": "มิถุนายน"},
    {"fieldIdValue": '7',"fieldNameValue": "กรกฎาคม"},
    {"fieldIdValue": '8',"fieldNameValue": "สิงหาคม"},
    {"fieldIdValue": '9',"fieldNameValue": "กันยายน"},
    {"fieldIdValue": '10',"fieldNameValue": "ตุลาคม"},
    {"fieldIdValue": '11',"fieldNameValue": "พฤศจิกายน"},
    {"fieldIdValue": '12',"fieldNameValue": "ธันวาคม"}];

    // this.getGroupRunning = [{id:'1',text:'1'},{id:'2',text:'2'},{id:'3',text:'3'},{id:'4',text:'4'},{id:'5',text:'5'},{id:'6',text:'6'},{id:'7',text:'7'},{id:'8',text:'8'},{id:'9',text:'9'}];
    this.result.case_cate_id = 0;
    this.result.group_running = '1';
    this.result.chk = '1';
    this.result.type = '2';
    this.result.assign_type = 1;
    this.result.assign_date1 = myExtObject.curDate();
    //console.log(parseInt(myExtObject.curMonth()).toString());
    this.result.stat_mon =parseInt(myExtObject.curMonth()).toString();
    this.result.stat_year = myExtObject.curYear();

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
    myExtObject.callCalendar();
    }

  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }

  setFocus(name:any) {
    const ele = this.judge_id.nativeElement[name];
    if (ele) {
      ele.focus();
    }
  }

  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].editJudgeId = this.masterSelected;
      }

    // for (var i = 0; i < this.checklist2.length; i++) {
    //   this.checklist2[i].editNoticeId = this.masterSelected2;
    //     }
    //this.getCheckedItemList();

  }
  /*
  getlist(index:any){
    alert(index)
    this.delList[index]['edit_judge_id']  =  this.posts[index]['edit_judge_id']
    console.log(this.delList);
  }*/

  isAllSelected() {
    this.masterSelected = this.checklist.every(function(item:any) {
        return item.editJudgeId == true;
    })
  }

  uncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].editJudgeId = false;
    }
    // for (var i = 0; i < this.checklist2.length; i++) {
    //   this.checklist2[i].editNoticeId = false;
    // }
    this.masterSelected = false;
    // this.masterSelected2 = false;
    $("body").find("input[name='delValue']").val('');
    // $("body").find("input[name='delValue2']").val('');
  }

  ClearAll(){
    window.location.reload();
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
    }else if(name=='asgn_type'){
      var student = JSON.stringify({
        "table_name" : "passign_type",
        "field_id" : "assign_type",
        "field_name" : "assign_desc",
        "condition" : " AND assign_type='"+event.target.value+"'",
        "userToken" : this.userData.userToken
      });
      console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
          let productsJson : any = JSON.parse(JSON.stringify(response));

          if(productsJson.length){
            this.result.asgn_desc = productsJson[0].fieldNameValue;

          }else{

            this.result.asgn_type = '';
            this.result.asgn_desc = '';
          }
        },
        (error) => {}
      )
    }
  }


  getCheckedItemList(){
    var del = "";
    // var del2 = "";
    setTimeout(() => {
      $("body").find("table.myTable1 tbody input[type='checkbox']").each(function(e,i){
        if($(this).prop("checked")==true){
          if(del!='')
            del+=','
          del+=$(this).val();
          alert(del);
          // if(del2!='')
          //   del2+=','
          // del2+=$(this).closest("td").find("input[id^='hid_notice_id']").val();
        }
      }).promise().done(function () {
        $("body").find("input[name='delValue']").val(del);
        // $("body").find("input[name='delValue2']").val(del2);
       })
    }, 100);

  }

  receiveJudgeListData(event:any){
    // if(this.modalType==1){
       this.result.judge_id = event.judge_id;
       this.result.judge_name = event.judge_name;
    // }else if(this.modalType==2){
    //    this.result.case_judge_id = event.judge_id;
    //    this.result.case_judge_name = event.judge_name;
    // }else if(this.modalType==3){
    //   this.result.case_judge_gid = event.judge_id;
    //   this.result.case_judge_gname = event.judge_name;
    // }else if(this.modalType==4){
    //   this.result.case_judge_gid2 = event.judge_id;
    //   this.result.case_judge_gname2 = event.judge_name;
    // }

    this.closebutton.nativeElement.click();
    }

  receiveFuncListData(event:any){
    console.log(event)
    if(this.listTable=='pjudge'){
      this.judge_id=event.fieldIdValue;
      this.judge_name=event.fieldNameValue;
    }else{
      this.result.asgn_type=event.fieldIdValue;
      this.result.asgn_desc=event.fieldNameValue;
    }

    this.closebutton.nativeElement.click();
}

  loadMyModalComponent(){
    this.loadComponent = false;
    this.loadModalComponent = true;
    $("#exampleModal").find(".modal-body").css("height","100px");
  }
  /*uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      avatar: file
    });
    this.form.get('avatar').updateValueAndValidity()
  }*/

  submitForm() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!this.result.judge_id && this.result.type==1){
      confirmBox.setMessage('กรุณาระบุรหัสผู้พิพากษา');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          //this.SpinnerService.hide();
          $("input[name='judge_id']")[0].focus();
        }
        subscription.unsubscribe();
      });

    }else if(!this.result.judge_name && this.result.type==1){
      confirmBox.setMessage('กรุณาระบุชื่อผู้พิพากษา');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          //this.SpinnerService.hide();
          $("input[name='judge_name']")[0].focus();
        }
        subscription.unsubscribe();
      });
    }else{

    //  if(this.all_day_flag==true){
    //      var inputchk = 1;
    //  }else{
    //      var inputchk = 0;
    //  }

      var student = JSON.stringify({
      "edit_judge_id" : this.hid_judge_id,
      "edit_assign_date" : this.hid_assign_date,
      "edit_assign_type" : this.hid_assign_type,
      "chk" : this.result.chk,
      "type" : this.result.type,
      "judge_id" : this.result.judge_id,
      "judge_name" : this.result.judge_name,
      "assign_date" : this.result.chk == '1' ? this.result.assign_date1 : '',
      "assign_date1" : this.result.assign_date2 ? this.result.assign_date1 : '',
      "assign_date2" : this.result.assign_date2 ? this.result.assign_date2 : '',
      "assign_type" : this.result.assign_type,
      "case_cate_id" : this.result.case_cate_id,
      "group_running" : this.result.group_running,
      "remark" : this.remark,
      "userToken" : this.userData.userToken
      });
      console.log(student)

      this.SpinnerService.show();
      if(this.hid_judge_id){
        this.http.post('/'+this.userData.appName+'ApiMG/API/MANAGEMENT/fmg2000/saveData', student ).subscribe(
          (response) =>{
            let alertMessage : any = JSON.parse(JSON.stringify(response));
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
              this.SpinnerService.hide();
              confirmBox.setMessage('แก้ไขข้อมูลเรียบร้อยแล้ว');
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  $("button[type='reset']")[0].click();
                  //this.SpinnerService.hide();
                }
                subscription.unsubscribe();
              });
              this.ngOnInit();
              //this.form.reset();
               // $("button[type='reset']")[0].click();

            }
          },
          (error) => {this.SpinnerService.hide();}
        )
      }else{
          this.http.post('/'+this.userData.appName+'ApiMG/API/MANAGEMENT/fmg2000/saveData', student ).subscribe(
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
              this.SpinnerService.hide();
              confirmBox.setMessage('จัดเก็บข้อมูลเรียบร้อยแล้ว');
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  $("button[type='reset']")[0].click();
                  //this.SpinnerService.hide();
                }
                subscription.unsubscribe();
              });
              this.ngOnInit();
              //this.form.reset();
               // $("button[type='reset']")[0].click();

            }
          },
          (error) => {this.SpinnerService.hide();}
        )
      }
    }

  }


  editData(index:any){
    console.log(this.posts[index])
    this.SpinnerService.show();
    //this.renderer.setProperty(this.judge_id.nativeElement['hid_judge_id'],'value', this.posts[index]['edit_judge_id']);
    // this.renderer.setProperty(this.judge_id.nativeElement['judge_id'],'value', this.posts[index]['judge_id']);
      this.hid_judge_id = this.posts[index]['edit_judge_id'];
      this.hid_assign_date = this.posts[index]['edit_assign_date'];
      this.hid_assign_type = this.posts[index]['edit_assign_type'];
      this.result.chk = '1';
      this.result.type = '1';
      this.result.assign_type = this.posts[index]['assign_type'];
      this.result.judge_id = this.posts[index]['judge_id'];
      this.result.judge_name = this.posts[index]['judge_name'];
      //this.judge_name = this.getJudge.filter((x:any) => x.fieldIdValue === this.posts[index]['judge_id']).fieldNameValue;
      this.result.assign_date1 = this.posts[index]['assign_date'];
      this.remark = this.posts[index]['remark'];


    //  if(this.posts[index]['all_day_flag']){
    //   this.all_day_flag = true;
    //  }else{
    //   this.all_day_flag = false;
    //  }

    setTimeout(() => {
      this.SpinnerService.hide();
    }, 500);

  }

  searchData() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

      this.SpinnerService.show();
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      // if(this.judge_id.nativeElement["default_value"].checked==true){
      //   var inputChk = 1;
      // }else{
      //   var inputChk = 0;
      // }
      var statmon;
      if(this.result.stat_mon.length == 1 ){
        statmon = "0" + this.result.stat_mon.toString();
      }else{
        statmon =  this.result.stat_mon;
      }
      var student = JSON.stringify({
        "year" : this.result.stat_year,
        "month" : statmon,
        "asgn_type" : this.result.asgn_type ? this.result.asgn_type.toString() : '',
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiMG/API/MANAGEMENT/fmg2000/getData', student).subscribe(
        posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          this.posts = productsJson.data;
          console.log(productsJson)
          if(productsJson.result==1){
            this.checklist = this.posts;
            this.checklist2 = this.posts;
              if(productsJson.length)
                this.posts.forEach((x : any ) => x.editJudgeId = false);
              this.rerender();
          }else{
            confirmBox.setMessage(productsJson.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){}
              subscription.unsubscribe();
            });
          }
            this.SpinnerService.hide();

        },
        (error) => {this.SpinnerService.hide();}
      );

  }


  confirmBox() {
    //this.delValue = $("body").find("input[name='delValue']").val();
    // this.delValue2 = $("body").find("input[name='delValue2']").val();
    // alert(this.delValue2);
    var isChecked = this.posts.every(function(item:any) {
      return item.editJudgeId == false;
    })

    const confirmBox = new ConfirmBoxInitializer();
    if(isChecked==true){
      confirmBox.setTitle('ไม่พบเงื่อนไข?');
      confirmBox.setMessage('กรุณาเลือกข้อมูลที่ต้องการลบ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }else{
      this.openbutton.nativeElement.click();
    }
  }

  goToLink(url: string){
    window.open(url, "_blank");
  }


  // loadMyChildComponent(){
  //   this.loadComponent = true;
  // }

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
                          if(ele.editJudgeId == true){
                            dataTmp.push(this.posts[index]);
                          }
                      });
                  });
                  if(bar){
                      //console.log(dataTmp)
                    let headers = new HttpHeaders();
                    headers = headers.set('Content-Type','application/json');
                    dataDel['userToken'] = this.userData.userToken;
                    dataDel['data'] = dataTmp;
                    var data = $.extend({}, dataDel);
                   console.log(JSON.stringify(data));
                   this.http.post('/'+this.userData.appName+'ApiMG/API/MANAGEMENT/fmg2000/deleteSelect', data , {headers:headers}).subscribe(
                    (response) =>{
                      let alertMessage : any = JSON.parse(JSON.stringify(response));
                      if(alertMessage.result==0){
                        this.SpinnerService.hide();

                      }else{

                        this.closebutton.nativeElement.click();
                        $("button[type='reset']")[0].click();
                        this.getData();
                        // confirmBox.setMessage(alertMessage.error);
                        // confirmBox.setButtonLabels('ตกลง');
                        // confirmBox.setConfig({
                        //     layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                        // });
                        // const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                        //   if (resp.success==true){
                        //     this.closebutton.nativeElement.click();
                        //     this.getData();
                        //   }
                        //   subscription.unsubscribe();
                        // });

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

  printReport(){
    var rptName = 'rfmg2000';

    // For no parameter : paramData ='{}'
    var paramData ='{}';

    // For set parameter to report
    var paramData = JSON.stringify({
      "pmonth" : this.result.stat_mon.length ==1 ? ("0" + this.result.stat_mon) : this.result.stat_mon,
      "pyear" : this.result.stat_year ? (this.result.stat_year -543).toString() : '',
      "pasign_type" : this.result.asgn_type ? this.result.asgn_type.toString() : '',
    });
    console.log(paramData);
    this.printReportService.printReport(rptName,paramData);
  }

  loadTableComponent(val:any){
    this.loadModalComponent = false;
    this.loadComponent = true;

    $("#exampleModal").find(".modal-body").css("height","auto");
 }

//  tabChangeJudge(obj:any){
//    if(obj.target.value){
//      this.renderer.setProperty(this.judge_id.nativeElement['judge_name'],'value', this.list.find((x:any) => x.fieldIdValue === parseInt(obj.target.value)).fieldNameValue);
//    }else{
//      this.judge_id.nativeElement['judge_id'].value="";
//      this.judge_id.nativeElement['judge_name'].value="";
//    }
//  }
tabChange(obj:any,type:any){
  this.SpinnerService.show();
  if(type==1){
    var val = this.getJudge.filter((x:any) => x.fieldIdValue === obj.target.value) ;
    if(val.length!=0){
      this.result.judge_name = val[0].fieldNameValue;
    }else{
      this.result.judge_id = null;
      this.result.judge_name = '';
    }
    setTimeout(() => {
      this.SpinnerService.hide();
    }, 200);

  }else{
    var val = this.getAssignType.filter((x:any) => x.fieldIdValue === obj.target.value) ;
    if(val.length!=0){
      this.absent_desc = val[0].fieldNameValue;
    }else{
      this.absent_type = null;
      this.absent_desc = '';
    }
    setTimeout(() => {
      this.SpinnerService.hide();
    }, 200);
  }


}


loadMyChildComponent(val:any){

  if(val==1){
    // var student = JSON.stringify({"table_name" : "pjudge", "field_id" : "judge_id","field_name" : "judge_name","search_id" : "","search_desc" : "","userToken" : this.userData.userToken});
    // this.listTable='pjudge';
    // this.listFieldId='judge_id';
    // this.listFieldName='judge_name';
    // this.listFieldNull='';

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
         this.loadModalComponent = false;
         this.loadModalJudgeComponent = true;
         this.loadComponent = false;
         this.loadMutiComponent = false;
         $("#exampleModal").find(".modal-body").css("height","auto");
         console.log(this.list)
       }else{
          this.list = [];
       }
      //  this.list = response;
      // console.log('xxxxxxx',response)
     },
     (error) => {}
   )

  }else{
    var student = JSON.stringify({"table_name" : "passign_type", "field_id" : "assign_type","field_name" : "assign_desc","search_id" : "","search_desc" : "","userToken" : this.userData.userToken});
    this.listTable='pssign_type';
    this.listFieldId='assign_type';
    this.listFieldName='assign_desc';
    this.listFieldNull='';

  this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student ).subscribe(
       (response) =>{
         this.list = response;
         this.loadModalComponent = false;
         this.loadModalJudgeComponent = false;
         this.loadMutiComponent = true;
         $("#exampleModal").find(".modal-body").css("height","auto");
         console.log(response)
       },
       (error) => {}
     )
    }
}

assignDate(type:any){
  if(type==2){
    this.result.assign_date1 = null;
    this.result.assign_date2 = null;
    setTimeout(() => {

          // myExtObject.callCalendarSet('assign_date1');
          // myExtObject.callCalendarSet('assign_date2');
        }, 200);
  }
  if(type==1){
    this.result.assign_date1 = myExtObject.curDate();
  }
  // if(type==3){
  //   this.result.assign_date1 = date;
  // }
  // if(type==4){
  //   this.result.assign_date2 = date;
  // }
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

  getData(){
    this.posts = [];
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

      this.SpinnerService.show();
      var student = JSON.stringify({
        "year" : this.result.stat_year,
        "month" : this.result.stat_mon,
        "assign_type" : this.result.asgn_type,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiMG/API/MANAGEMENT/fmg2000/getData', student ).subscribe(posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          console.log(productsJson)
          this.posts = productsJson.data;
          console.log(this.posts);
          if(productsJson.result==1){
            this.checklist = this.posts;
            // this.checklist2 = this.posts;
            if(productsJson.data.length)
              this.posts.forEach((x : any ) => x.editJudgeId = false);
            this.rerender();
          }else{
            confirmBox.setMessage(productsJson.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){}
              subscription.unsubscribe();
            });
          }
          this.SpinnerService.hide();
      });
  }

  directiveDate(date:any,obj:any){
    this.result[obj] = date;
    console.log(date)
  }

}







