import { DatalistReturnComponent } from './../../modal/datalist-return/datalist-return.component';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Injectable, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, NgForm } from "@angular/forms";
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay, ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { catchError, map, } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import * as $ from 'jquery';
declare var myExtObject: any;
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { PrintReportService } from 'src/app/services/print-report.service';
// import { ThrowStmt, viewClassName } from '@angular/compiler';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-fmg2300,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fmg2300.component.html',
  styleUrls: ['./fmg2300.component.css']
})


export class Fmg2300Component implements AfterViewInit, OnInit, OnDestroy {

  title: any;

  posts: any;
  std_id: any;
  file_upload: any;
  std_prov_name: any;
  delList: any = [];
  dataSearch: any = [];
  search: any = 0;
  send_dep: any = 0;
  import_file: any;
  masterSelected: boolean;
  checklist: any;
  checklist2: any;
  sessData: any;
  userData: any;
  myExtObject: any;
  programName: string;
  dep_code: any;
  dep_name: any;
  getDep: any;
  getOff: any;
  getReqUser: any;
  getProblem: any;
  req_dep_code: any;
  req_user_id: any;
  assign_user_id: any;
  send_dep_code: any;

  Datalist: any;
  defaultCaseType: any;
  //------
  result: any = [];
  fileToUpload1: File = null;
  // dataHead:any = [];
  // run_id:any;
  // reqRunning:any;
  items: any = [];
  // getReq:any;
  // req_id:any;
  // modalType:any;


  public list: any;
  public listTable: any;
  public listFieldId: any;
  public listFieldName: any;
  public listFieldName2: any;
  public listFieldNull: any;


  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  // @ViewChild('prov_id',{static: true}) prov_id : ElementRef;
  @ViewChild('openbutton', { static: true }) openbutton: ElementRef;
  @ViewChild('closebutton', { static: true }) closebutton: ElementRef;
  @ViewChild('form_id', { static: true }) form_id: ElementRef;
  @ViewChild('form_desc', { static: true }) form_desc: ElementRef;


  @ViewChild('crudModal') crudModal: ElementRef;
  //@ViewChild('file1',{static: true}) file1: ElementRef;
  @ViewChild('inputFile') myInputVariable: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;
  @ViewChild(ModalConfirmComponent) child: ModalConfirmComponent;
  public loadModalComponent: boolean = false;

  constructor(
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private printReportService: PrintReportService,
    private renderer: Renderer2,
    private activatedRoute: ActivatedRoute,
  ) {
    this.masterSelected = false
    // this.masterSelected2 = false
  }

  ngOnInit(): void {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 30,
      processing: true,
      columnDefs: [{ "targets": 'no-sort', "orderable": false }],
      order: [[2, 'asc']]
    };

    this.sessData = localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.activatedRoute.queryParams.subscribe(params => {
      this.result.req_no = params['req_no'];
      this.result.req_no_item = params['req_no_item'];
    });
    if (this.result.req_no) {
      this.getData();
    } else {
      this.runReqNo();
    }

    // const confirmBox = new ConfirmBoxInitializer();
    // confirmBox.setTitle('ข้อความแจ้งเตือน');

    // var student = JSON.stringify({
    //   "userToken" : this.userData.userToken
    // });


    //   this.http.post('/'+this.userData.appName+'ApiMG/API/MANAGEMENT/fmg2300/runReqNo', student).subscribe(posts => {
    //   let productsJson : any = JSON.parse(JSON.stringify(posts));
    //   this.posts = productsJson.data;
    //   // this.items = productsJson.data;
    //   // console.log("items", this.items);
    //   // this.result.req_no = productsJson.req_no;
    //   alert('xxxxxxxx')
    //   console.log("productsJson=>", posts);

    //   if(productsJson.result==1){
    //     this.checklist = this.posts;
    //     // this.checklist2 = this.posts;
    //     if(productsJson.data.length)
    //       this.posts.forEach((x : any ) => x.edit2300 = false);
    //     this.rerender();
    //   }else{
    //     confirmBox.setMessage(productsJson.error);
    //     confirmBox.setButtonLabels('ตกลง');
    //     confirmBox.setConfig({
    //         layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    //     });
    //     const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
    //       if (resp.success==true){}
    //       subscription.unsubscribe();
    //     });
    //   }
    //     this.SpinnerService.hide();
    // });

    var authen = JSON.stringify({
      "userToken": this.userData.userToken,
      "url_name": "fmg2300"
    });
    this.http.post('/' + this.userData.appName + 'Api/API/authen', authen).subscribe(
      (response) => {
        let getDataAuthen: any = JSON.parse(JSON.stringify(response));
        this.programName = getDataAuthen.programName;
        console.log(getDataAuthen)
      },
      (error) => { }
    )

    //======================== pdepartment ======================================
    var student = JSON.stringify({
      "table_name": "pdepartment",
      "field_id": "dep_code",
      "field_name": "dep_name",
      "field_name2": "print_dep_name",
      "userToken": this.userData.userToken
    });
    this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        this.getDep = getDataOptions;
        this.getDep.forEach((x: any) => x.fieldIdValue = x.fieldIdValue.toString())
        console.log(this.getDep)
        // var Dep = this.getDep.filter((x:any) => x.fieldIdValue === this.userData.depCode.toString()) ;
        // if(Dep.length!=0){
        //   this.result.req_dep_code =  Dep[0].fieldIdValue;
        //   this.result.req_dep_name =  Dep[0].fieldNameValue;
        // }
      },
      (error) => { }
    )

    //======================== pofficer ======================================
     var student = JSON.stringify({
      "table_name" : "pofficer",
      "field_id" : "off_id",
      "field_name" : "off_name",
      "field_name2" : "dep_code",
      "condition": " AND (move_flag is null OR move_flag=0) ",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getOff = getDataOptions;
        console.log(this.getOff)
        // var Off = this.getOff.filter((x:any) => x.fieldIdValue === this.userData.userCode) ;
        // if(Off.length!=0){
        //   this.result.req_user_id =  Off[0].fieldIdValue;
        //   this.result.req_user = Off[0].fieldNameValue;
        // }
      },
      (error) => {}
    )
    this.getProblem = [{ id: '0', text: 'ไม่ระบุ' }, { id: '1', text: 'ข้อผิดพลาดของโปรแกรม' }, { id: '2', text: 'ความต้องการเพิ่มเติม' }, { id: '3', text: 'เปลี่ยนแปลงความต้องการ' }, { id: '4', text: 'สอบถาม' }, { id: '9', text: 'อื่นๆ' }];
    this.result.req_date = myExtObject.curDate();
    this.result.req_time = this.getTime();
    console.log(this.search);
    this.result.problem_type = '0';
    this.setDefault();
  }

  setDefault() {
    this.result.req_dep_code = this.userData.depCode;
    this.result.req_dep_name = this.userData.depName;

    this.getOfficer(this.userData.depCode, 'req_dep_code');

    this.result.req_user_id = this.userData.userCode;
    this.result.req_user = this.userData.offName;

    this.result.edit_req_no="";
  }

  getTime() {
    var time = new Date();
    var cursecond = time.getSeconds();
    var scursecond = cursecond.toString();
    var minutes = time.getMinutes();
    var sminutes = minutes.toString();
    var hours = time.getHours();
    var shours = hours.toString();
    console.log(typeof (cursecond))
    return ((shours.length == 1 ? "0" + shours : shours) + ":" + (sminutes.length == 1 ? "0" + sminutes : sminutes) + ":" + (scursecond.length == 1 ? "0" + scursecond : scursecond));
  }


  getProveData() {
    this.result.prove_date = myExtObject.curDate();
    this.result.prove_time = this.getTime();
  }

  getAssignData() {
    this.result.assign_date = myExtObject.curDate();
    this.result.assign_time = this.getTime();

    this.result.response_date = myExtObject.curDate();
    this.result.response_time = this.getTime();

    if (this.result.assign_user_id == '88888' || this.result.assign_user_id == '99999') {
      this.result.comp_date = myExtObject.curDate();
      this.result.comp_time = this.getTime();

      var student = JSON.stringify({
        "userToken": this.userData.userToken
      });
      console.log(student);
      this.http.post('/' + this.userData.appName + 'ApiMG/API/MANAGEMENT/fmg2300/runResponse', student).subscribe(response => {
        let productsJson: any = JSON.parse(JSON.stringify(response));
        console.log(productsJson);
        if (productsJson.result == 1) {
          this.result.response_no = productsJson.response_no;
        }
      },
        (error) => { });
    }
  }

  getResponseData() {
    this.result.response_date = myExtObject.curDate();
    this.result.response_time = this.getTime();
  }

  getCompData() {
    // this.result.comp_date = myExtObject.curDate();
    this.result.comp_time = this.getTime();
  }

  tabChangeSelect(objName: any, objData: any, event: any, type: any) {
    if (typeof objData != 'undefined') {
      if (type == 1) {
        var val = objData.filter((x: any) => x.fieldIdValue === event.target.value);
      } else {
        var val = objData.filter((x: any) => x.fieldIdValue === event);
      }
      console.log(objData)
      if (val.length != 0) {
        this.result[objName] = val[0].fieldIdValue;
        this[objName] = val[0].fieldIdValue;

        if(objName=='send_dep_name' && event.target.value==19)
          this.send_dep=1;
        else
          this.send_dep=0;

        this.getOfficer(val[0].fieldIdValue, objName);
      } else {
        this.result[objName] = null;
        this[objName] = null;
      }
    } else {
      this.result[objName] = null;
      this[objName] = null;
    }
  }

  getOfficer(id: any, objName: any) {
    console.log(id, objName)
    if (objName == 'req_dep_code') {
      var student = JSON.stringify({
        "table_name": "pofficer",
        "field_id": "off_id",
        "field_name": "off_name",
        "field_name2": "dep_code",
        "condition": " AND (move_flag is null OR move_flag=0) AND dep_code='" + id + "' ",
        "userToken": this.userData.userToken
      });
      this.http.post('/' + this.userData.appName + 'ApiUTIL/API/getData', student).subscribe(
        (response) => {
          let getDataOptions: any = JSON.parse(JSON.stringify(response));
          this.getReqUser = getDataOptions;
          console.log(this.getReqUser)
        },
        (error) => { }
      )
    }
  }

  // rerender(): void {
  //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //   // Destroy the table first
  //   dtInstance.destroy();
  //   // Call the dtTrigger to rerender again
  //   this.dtTrigger.next(null);
  //     });}

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
    myExtObject.callCalendar();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  setFocus(name: any) {
    const ele = this.form_id.nativeElement[name];
    // console.log("name=>", name);
    // console.log("ele=>", ele);
    if (ele) {
      ele.focus();
    }
  }

  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit2300 = this.masterSelected;
    }

    //console.log("checkUncheckAll=>", this.checklist[i].edit2300);
  }

  isAllSelected() {
    this.masterSelected = this.checklist.every(function (item: any) {
      return item.edit2300 == true;
    })
  }

  uncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit2300 = false;
    }
    // for (var i = 0; i < this.checklist2.length; i++) {
    //   this.checklist2[i].editNoticeId = false;
    // }
    this.masterSelected = false;
    // this.masterSelected2 = false;
    $("body").find("input[name='delValue']").val('');
    // $("body").find("input[name='delValue2']").val('');
  }

  ClearAll() {
    let winURL = window.location.href.split("/#/")[0]+"/#/";
    location.replace(winURL+'fmg2300')
    window.location.reload();
  }


  getCheckedItemList() {
    var del = "";
    // var del2 = "";
    setTimeout(() => {
      $("body").find("table.myTable1 tbody input[type='checkbox']").each(function (e, i) {
        if ($(this).prop("checked") == true) {
          if (del != '')
            del += ','
          del += $(this).val();
          alert(del);
          // if(del2!='')
          //   del2+=','
          // del2+=$(this).closest("td").find("input[id^='hid_notice_id']").val();
        }
      }).promise().done(function () {
        $("body").find("input[name='delValue']").val(del);
      })
    }, 100);

  }

  receiveFuncListData(event: any) {
    this.dep_code = event.fieldIdValue;
    this.dep_name = event.fieldNameValue;
    this.closebutton.nativeElement.click();
    console.log(event)
  }

  loadMyModalComponent() {
    this.loadComponent = false;
    this.loadModalComponent = true;
    $("#exampleModal").find(".modal-body").css("height", "100px");
  }

  getMessage(message: any) {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    confirmBox.setMessage(message);
    confirmBox.setButtonLabels('ตกลง');
    confirmBox.setConfig({
      layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    });
    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      if (resp.success == true) { }
      subscription.unsubscribe();
    });
  }


  // save update Data
  submitForm() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if (!this.result.req_no) {
      confirmBox.setMessage('กรุณาระบุรหัส');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {
          this.setFocus('req_no');
        }
        subscription.unsubscribe();
      });

    } else if (!this.result.req_no_item) {
      confirmBox.setMessage('กรุณาระบุครั้งที่');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {
          this.setFocus('req_no_item');
        }
        subscription.unsubscribe();
      });
      // }else if(!this.result.form_desc){
      //   confirmBox.setMessage('กรุณาระบุแบบหมาย');
      //   confirmBox.setButtonLabels('ตกลง');
      //   confirmBox.setConfig({
      //       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      //   });
      //   const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      //     if (resp.success==true){
      //       this.setFocus('formDesc');
      //     }
      //     subscription.unsubscribe();
      //   });
    } else {
      this.SpinnerService.show();

      //ลบไฟล์
      // if(this.result.del_word_A4){
      //   this.fileToUpload1=null;
      // }
      var formData = new FormData();
      // this.attachFile.forEach((r,index,array)  =>  {
      //   //console.log(r)
      //   if(r.nativeElement.files.length){
      //     formData.append('attach_'+index, r.nativeElement.files[0]);
      //   }else{
      //     formData.append('attach_'+index, null);
      //   }
      // })

      //21/2/2566 แก้ไขชื่อผู้แจ้งบันทึกไม่ถูกต้อง
      var val = this.getReqUser.filter((x: any) => x.fieldIdValue === this.result.req_user_id);
      console.log(val)
      if (val.length != 0)
        this.result.req_user=val[0].fieldNameValue;
      else
        this.result.req_user=null; 
      //---------21/2/2566-------------
      formData.append('file_attach', this.fileToUpload1);
      formData.append('data', JSON.stringify($.extend({}, this.result)));
      formData.append('userToken', this.userData.userToken);

      /*
      var dataObj:any = [];
      var bar = new Promise((resolve, reject) => {
          if(this.search==1){
            for(var i=0;i<this.dataSearch.length;i++){

          if(i==0)
            dataStringify = JSON.stringify(this.dataSearch[i]);
          else
            dataStringify = dataStringify+','+JSON.stringify(this.dataSearch[i]);

            dataObj.push($.extend({}, this.dataSearch[i]))
        }
          }
      });


      if(bar){
        //console.log(JSON.stringify(dataObj))
        formData.append('data', JSON.stringify(dataObj));
        formData.append('userToken', this.userData.userToken);
      }
      */
      for (var pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
      }
      //console.log(formData)
      // var student = $.extend({},formData);
      // console.log(JSON.stringify(student));

      if (this.result.edit_req_no) {
        console.log('แก้ไข');
        this.http.disableHeader().post('/' + this.userData.appName + 'ApiMG/API/MANAGEMENT/fmg2300/saveData', formData).subscribe(
          (response) => {
            let alertMessage: any = JSON.parse(JSON.stringify(response));
            console.log(alertMessage);
            if (alertMessage.result == 0) {
              this.SpinnerService.hide();
              confirmBox.setMessage(alertMessage.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
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
                layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success == true) {
                  this.result.req_no_item = alertMessage.req_no_item;
                  if (alertMessage.req_no_item > 1) {
                    this.getMessage('ระบบได้ทำการบันทึกข้อมูลรายการแจ้งปัญหาใหม่เป็นรายการเลขที่ ' + this.result.req_no + '/' + this.result.req_no_item);
                  }
                  this.getData();
                  this.fileToUpload1 = null;
                  //$("#importFiles").val(null);
                  $('body').find(".custom-file-label").html('');
                  // $("button[type='reset']")[0].click();
                  //this.SpinnerService.hide();
                }
                subscription.unsubscribe();
              });
              // this.ngOnInit();
              //this.form.reset();
              // $("button[type='reset']")[0].click();

            }
          },
          (error) => { this.SpinnerService.hide(); }
        )
      } else {
        console.log('จัดเก็บ');
        this.http.disableHeader().post('/' + this.userData.appName + 'ApiMG/API/MANAGEMENT/fmg2300/saveData', formData).subscribe(
          (response) => {
            let alertMessage: any = JSON.parse(JSON.stringify(response));
            console.log(alertMessage)
            if (alertMessage.result == 0) {
              this.SpinnerService.hide();
              confirmBox.setMessage(alertMessage.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
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
                layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success == true) {
                  this.result.req_no_item = alertMessage.req_no_item;
                  this.getData();
                  this.fileToUpload1 = null;
                  // $("#importFiles").val(null);
                  $('body').find(".custom-file-label").html('');
                  // $("#importFiles").find('label').html('');
                  // $("button[type='reset']")[0].click();
                  //this.SpinnerService.hide();
                }
                subscription.unsubscribe();
              });
              // this.ngOnInit();
              //this.form.reset();
              // $("button[type='reset']")[0].click();

            }
          },
          (error) => { this.SpinnerService.hide(); }
        )
      }

      // var formData = new FormData();
      // this.result['userToken'] = this.userData.userToken;
      // formData.append('file', this.fileToUpload1);
      // formData.append('data', JSON.stringify($.extend({}, this.result)));
      // // console.log("formData=>", formData);
      // this.http.disableHeader().post('/'+this.userData.appName+'ApiMG/API/MANAGEMENT/fmg2300/saveData', formData ).subscribe(
      //   (response) =>{
      //     let alertMessage : any = JSON.parse(JSON.stringify(response));
      //       if(alertMessage.result==0){
      //         this.SpinnerService.hide();
      //         confirmBox.setMessage(alertMessage.error);
      //         confirmBox.setButtonLabels('ตกลง');
      //         confirmBox.setConfig({
      //             layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      //         });
      //         const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      //           if (resp.success==true){
      //             // this.SpinnerService.hide();
      //           }
      //           subscription.unsubscribe();
      //         });
      //       }else{
      //         this.SpinnerService.hide();
      //         confirmBox.setMessage('ข้อความแจ้งเตือน');
      //         confirmBox.setMessage(alertMessage.error);
      //         confirmBox.setButtonLabels('ตกลง');
      //         confirmBox.setConfig({
      //             layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
      //         });
      //         const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      //           if (resp.success==true){
      //             $("button[type='reset']")[0].click();
      //           }
      //           subscription.unsubscribe();
      //         });
      //         // this.ngOnInit();
      //       }
      //   },
      //   (error) => {this.SpinnerService.hide();}
      // )
    }
  }


  editData(index: any) {
    //console.log("editData index=>", index)
    this.SpinnerService.show();
    this.result.edit_req_no = this.posts[index]['req_no'];
    this.result.edit_req_no_item = this.posts[index]['req_no_item'];
    this.result.req_no = this.posts[index]['req_no'];
    this.result.req_no_item = this.posts[index]['req_no_item'];
    this.result.req_date = this.posts[index]['req_date'];
    this.result.req_time = this.posts[index]['req_time'];
    this.result.req_dep_code = this.posts[index]['req_dep_code'];
    this.result.req_dep_name = this.posts[index]['req_dep_name'];
    this.result.req_user_id = this.posts[index]['req_user_id'];
    this.result.req_user = this.posts[index]['req_user'];
    this.result.req_desc = this.posts[index]['req_desc'];
    this.result.send_dep_code = this.posts[index]['send_dep_code'] ? this.posts[index]['send_dep_code'] : '';
    //แจ้งถึงหน่วยงาน=19 แสดง ประเภทของปัญหา	
    if(this.result.send_dep_code==19)
      this.send_dep=1;
    else
      this.send_dep=0;

    this.result.send_dep_name = this.posts[index]['send_dep_name'];
    this.result.problem_type = this.posts[index]['problem_type'] ? this.posts[index]['problem_type'].toString() : '0';
    this.result.cancel_flag = this.posts[index]['cancel_flag'];
    this.result.cancel_remark = this.posts[index]['cancel_remark'];
    this.result.assign_user_id = this.posts[index]['assign_user_id'];
    this.result.assign_user_name = this.posts[index]['assign_user'];
    this.result.assign_date = this.posts[index]['assign_date'];
    this.result.assign_time = this.posts[index]['assign_time'];
    this.result.remark = this.posts[index]['remark'];
    this.result.comp_date = this.posts[index]['comp_date'];
    this.result.comp_time = this.posts[index]['comp_time'];
    this.result.response_no = this.posts[index]['response_no'] ? this.posts[index]['response_no'] : '';
    this.result.response_date = this.posts[index]['response_date'];
    this.result.response_time = this.posts[index]['response_time'];
    this.result.response_desc = this.posts[index]['response_desc'];
    this.result.prove_result = this.posts[index]['prove_result'] ? this.posts[index]['prove_result'].toString() : '';
    this.result.prove_date = this.posts[index]['prove_date'];
    this.result.prove_time = this.posts[index]['prove_time'];
    this.result.old_result = this.posts[index]['old_result'];
    this.result.file_attach = this.posts[index]['file_attach'];

    this.getOfficer(this.posts[index]['req_dep_code'], 'req_dep_code');

    //set display image file word
    // if(this.posts[index]['file_exists'])
    //   $("body").find("i[id='imgWord']").css("display", "");
    // else
    //   $("body").find("i[id='imgWord']").css("display", "none");

    // setTimeout(() => {
    //   this.SpinnerService.hide();
    // }, 500);

  }

  // searchData() {
  //   const confirmBox = new ConfirmBoxInitializer();
  //   confirmBox.setTitle('ข้อความแจ้งเตือน');

  //     this.SpinnerService.show();

  //     var student = JSON.stringify({
  //     "form_id" : this.result.form_id,
  //     "form_desc" : this.result.form_desc,
  //     "rpt_name" : this.result.rpt_name,
  //     "rpt_bname" : this.result.rpt_bname,
  //     "print_notice_name" : this.result.print_notice_name,
  //     "userToken" : this.userData.userToken
  //     });
  //     //console.log(student)
  //     this.http.post('/'+this.userData.appName+'ApiMG/API/MANAGEMENT/fmg2300/search', student ).subscribe(
  //       posts => {
  //         let productsJson : any = JSON.parse(JSON.stringify(posts));
  //         this.posts = productsJson.data;

  //         if(productsJson.result==1){
  //           this.checklist = this.posts;
  //           this.checklist2 = this.posts;
  //             if(productsJson.length)
  //               this.posts.forEach((x : any ) => x.edit2300 = false);
  //             // this.rerender();
  //         }else{
  //           confirmBox.setMessage(productsJson.error);
  //           confirmBox.setButtonLabels('ตกลง');
  //           confirmBox.setConfig({
  //               layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
  //           });
  //           const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
  //             if (resp.success==true){}
  //             subscription.unsubscribe();
  //           });
  //         }
  //           this.SpinnerService.hide();

  //       },
  //       (error) => {this.SpinnerService.hide();}
  //     );
  // }


  confirmBox() {
    var isChecked = this.posts.every(function (item: any) {
      return item.edit2300 == false;
    })

    // console.log("isChecked", isChecked);
    const confirmBox = new ConfirmBoxInitializer();
    if (isChecked == true) {
      confirmBox.setTitle('ไม่พบเงื่อนไข?');
      confirmBox.setMessage('กรุณาเลือกข้อมูลที่ต้องการลบ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) { }
        subscription.unsubscribe();
      });
    } else {
      this.openbutton.nativeElement.click();
    }
  }

  goToLink(url: string) {
    window.open(url, "_blank");
  }

  directiveDate(date: any, obj: any) {
    this.result[obj] = date;
  }

  directiveDateArry(date: any, obj: any, index: any) {
    console.log(date.target.value)
    this.dataSearch[index][obj] = date.target.value;
  }

  loadMyChildComponent() {
    this.loadComponent = true;
  }


  submitModalForm() {
    var chkForm = JSON.parse(this.child.ChildTestCmp());

    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if (!chkForm.password) {
      confirmBox.setMessage('กรุณาป้อนรหัสผ่าน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {
          //this.SpinnerService.hide();
        }
        subscription.unsubscribe();
      });

    } else if (!chkForm.log_remark) {
      confirmBox.setMessage('กรุณาป้อนเหตุผล');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {
          //this.SpinnerService.hide();
        }
        subscription.unsubscribe();
      });
    } else {
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
      confirmBox.setMessage('ยืนยันการลบข้อมูลที่เลือก');
      confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');

      // Choose layout color type
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success == true) {
          var dataDel = [], dataTmp = [];
          var bar = new Promise((resolve, reject) => {
            this.posts.forEach((ele, index, array) => {
              if (ele.edit2300 == true) {
                dataTmp.push(this.posts[index]);
              }
            });
          });
          if (bar) {
            // console.log("dataTmp=>", dataTmp);
            dataDel['userToken'] = this.userData.userToken;
            dataDel['data'] = dataTmp;
            var data = $.extend({}, dataDel);
            // console.log("delete=>",data)
            this.http.post('/' + this.userData.appName + 'ApiMG/API/MANAGEMENT/fmg2300/deleteSelect', data).subscribe(
              (response) => {
                let alertMessage: any = JSON.parse(JSON.stringify(response));
                if (alertMessage.result == 0) {
                  this.SpinnerService.hide();
                } else {

                  this.closebutton.nativeElement.click();
                  $("button[type='reset']")[0].click();
                  this.getData();
                }
              },
              (error) => { this.SpinnerService.hide(); }
            )
          }
        }
        subscription.unsubscribe();
      });

    }
  }

  printReport(type: any) {
    var rptName = 'rmg2300';

    // For no parameter : paramData ='{}'
    var paramData = '{}';

    // For set parameter to report
    var paramData = JSON.stringify({
      "preq_no": this.result.req_no ? this.result.req_no.toString() : '',
      "preq_no_item": this.result.req_no_item ? this.result.req_no_item.toString() : '',
      "pflag": type ? type.toString() : '',
    });
    console.log(paramData);
    this.printReportService.printReport(rptName, paramData);
  }

  loadTableComponent(val: any) {
    this.loadModalComponent = false;
    this.loadComponent = true;
    $("#exampleModal").find(".modal-body").css("height", "auto");
  }

  closeModal() {
    $('.modal')
      .find("input[type='text'],input[type='password'],textarea,select")
      .val('')
      .end()
      .find("input[type=checkbox], input[type=radio]")
      .prop("checked", "")
      .end();
  }

  // displayImgWord(){

  // }

  getData() {
    if (!this.result.req_no) {
      this.getMessage('กรุณาระบุข้อมูล เลขที่แจ้ง');
      return (false);
    }
    this.posts = [];
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    this.SpinnerService.show();

    var student = JSON.stringify({
      "req_no": this.result.req_no,
      "req_no_item": this.result.req_no_item,
      "userToken": this.userData.userToken
    });
    console.log(student);
    this.http.post('/' + this.userData.appName + 'ApiMG/API/MANAGEMENT/fmg2300/getData', student).subscribe(posts => {
      let productsJson: any = JSON.parse(JSON.stringify(posts));
      console.log(productsJson)
      this.posts = productsJson.data;
      //console.log(this.posts);
      if (productsJson.result == 1) {
        this.checklist = this.posts;
        this.dataSearch = productsJson.data;
        // this.checklist2 = this.posts;
        if (productsJson.data.length)
          this.posts.forEach((x: any) => x.edit2300 = false);
        this.search = 1;
        this.editData(0);
        // this.rerender();
      } else {
        confirmBox.setMessage(productsJson.error);
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success == true) { }
          subscription.unsubscribe();
        });
      }
      this.SpinnerService.hide();
    });
  }

  onFileChange(e: any) {
    if (e.target.files.length) {
      this.fileToUpload1 = e.target.files[0];
      var fileName = e.target.files[0].name;

      // console.log("fileToUpload1=>", this.fileToUpload1);
      // console.log("fileName=>", fileName);
      $(e.target).parent('div').find('label').html(fileName);
    } else {
      this.fileToUpload1 = null;
      $(e.target).parent('div').find('label').html('');
    }
  }

  clickOpenFile(index: any) {
    let winURL = window.location.host;
    // console.log("index=>", index);
    // console.log("posts index=>", this.posts[index]);
    //console.log("index form_id=>", this.posts[index].form_id);

    winURL = winURL + '/' + this.userData.appName + "ApiMG/API/MANAGEMENT/fmg2300/openAdminFormAttach";
    myExtObject.OpenWindowMax("http://" + winURL + '?file_name=' + this.posts[index].file_attach);
  }

  runReqNo() {
    // alert('xxxx')
    var student = JSON.stringify({
      "userToken": this.userData.userToken
    });
    console.log(student);

    this.http.post('/' + this.userData.appName + 'ApiMG/API/MANAGEMENT/fmg2300/runReqNo', student).subscribe(response => {

      let productsJson: any = JSON.parse(JSON.stringify(response));
      //this.posts = productsJson.data;
      console.log(productsJson);
      // console.log("productsJson.result=>", productsJson.result);
      // console.log("productsJson.result=>", productsJson.req_no);
      if (productsJson.result == 1) {
        console.log('xxxxx');
        this.result.req_no = productsJson.run_no;
        this.result.req_no_item = productsJson.run_no_item;
        this.dataSearch = productsJson.data;
      } else {
        this.dataSearch = [];
        console.log(productsJson.error);
      }
    },
      (error) => { });
  }
}