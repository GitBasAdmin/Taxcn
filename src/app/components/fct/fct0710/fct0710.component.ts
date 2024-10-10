import { indexOf } from 'lodash';
import { DatalistReturnComponent } from './../../modal/datalist-return/datalist-return.component';
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
import { NgSelectComponent } from '@ng-select/ng-select';
import * as $ from 'jquery';
declare var myExtObject: any;
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { DatalistReturnMultipleSubtypeComponent } from '@app/components/modal/datalist-return-multiple-subtype/datalist-return-multiple-subtype.component';
import { PrintReportService } from 'src/app/services/print-report.service';
// import { viewClassName } from '@angular/compiler';
import * as e from 'cors';
import { ThisTypeNode } from 'typescript';

@Component({
  selector: 'app-fct0710,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fct0710.component.html',
  styleUrls: ['./fct0710.component.css']
})


export class Fct0710Component implements AfterViewInit, OnInit, OnDestroy {

  title:any;

  posts:any;
  caseCate:any=[];
  std_id:any;
  std_prov_name:any;
  delList:any=[];
  result:any=[];
  result2:any=[];
  tmpResult:any=[];
  dataSubtype:any=[];
  search:any;
  receipt_type_id:any;
  group_id:any;
  getReceiptGroup:any;
  getReceiptType:any;
  masterSelected:boolean;
  masterSelected2:boolean;
  checklist:any;
  checklist2:any;
  checkedList:any;
  delValue:any;
  delValue2:any;
  sessData:any;
  userData:any;
  myExtObject:any;
  programName:string;
  dep_code:any;
  dep_name:any;
  groupdesc:any;
  getCaseCate:any;
  getCaseStatus:any;
  getTableType:any;
  Datalist:any;
  defaultCaseType:any;

  hid_receipt_type_id:any;
  hid_group_id:any;
  app_flag:any;
  chk:any;
  modalType:any;
  depIndex:any;

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldCond:any;
  public listFieldSelect:any;
  public listSubtype:any = [];


  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  public loadMultiComponent: boolean = false;
  public loadModalConfComponent: boolean = false;
  // @ViewChild('prov_id',{static: true}) prov_id : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild( DatalistReturnMultipleSubtypeComponent ) child2: DatalistReturnMultipleSubtypeComponent ;


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
      order:[]
    };

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    var student = JSON.stringify({
      "userToken" : this.userData.userToken,
    });

      // this.SpinnerService.show();
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct0710',student).subscribe(response => {
          let productsJson : any = JSON.parse(JSON.stringify(response));
          console.log(productsJson)

          var bar = new Promise((resolve, reject) => {
            productsJson.data.forEach((ele, index, array) => {
                  // if(ele.indict_desc != null){
                  //   if(ele.indict_desc.length > 47 )
                  //     productsJson.data[index]['indict_desc_short'] = ele.indict_desc.substring(0,47)+'...';
                  // }
                  // if(ele.deposit != null){
                  //   productsJson.data[index]['deposit_comma'] = this.curencyFormat(ele.deposit,2);
                  // }
                });
           });

           this.posts = productsJson.data;
           console.log(this.posts);
          if(productsJson.result==1){
            this.checklist = this.posts;
            // this.checklist2 = this.posts;
            if(productsJson.data.length)
              this.posts.forEach((x : any ) => x.edit0710 = false);
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

      var authen = JSON.stringify({
        "userToken" : this.userData.userToken,
        "url_name" : "fct0710"
      });
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen ).subscribe(
        (response) =>{
          let getDataAuthen : any = JSON.parse(JSON.stringify(response));
          this.programName = getDataAuthen.programName;
          console.log(getDataAuthen)
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
        this.setDefPage();
      },
      (error) => {}
    )

      // //======================== pDep ======================================
      // var student = JSON.stringify({
      //   "table_id" :  this.hid_receipt_type_id,
      //   "userToken" : this.userData.userToken
      // });
      // console.log(student)
      // this.http.post('/'+this.userData.appName+'ApiCT/API/fct0710/getCaseCateMapTable', student ).subscribe(
      //   (response) =>{
      //     let getDataOptions : any = JSON.parse(JSON.stringify(response));
      //     // getDataOptions.unshift({fieldIdValue:0,fieldNameValue: 'ทั้งหมด'});
      //     this.getCaseCate = getDataOptions;
      //     console.log(this.getCaseCate);
      //     // this.selCaseType = $("body").find("ng-select#case_type span.ng-value-label").html();
      //     this.setDefPage();
      //   },
      //   (error) => {}
      // )


    //======================== preceipt_group ======================================
    var student = JSON.stringify({
      "table_name" : "preceipt_group",
      "field_id" : "group_id",
      "field_name" : "group_desc",
      "order_by" : "group_id ASC",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        // getDataOptions.unshift({fieldIdValue:0,fieldNameValue: 'ทั้งหมด'});
        this.getReceiptGroup = getDataOptions;
        //console.log(getDataOptions)
      },
      (error) => {}
    )
    //======================== preceipt_type ======================================
    var student = JSON.stringify({
      "table_name" : "preceipt_type",
      "field_id" : "receipt_type_id",
      "field_name" : "receipt_type_desc",
      "order_by" : "receipt_type_id ASC",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        // getDataOptions.unshift({fieldIdValue:0,fieldNameValue: 'ทั้งหมด'});
        this.getReceiptType = getDataOptions;
        //console.log(getDataOptions)
      },
      (error) => {}
    )

    // this.getTableType = [{id:1,text:'นัดต่อเนื่อง'},{id:2,text:'ปฏิทิน'}];
    // this.result.table_type = 2;
    // this.result.case_cate_id = 0;
    // this.result.case_status = 0;

  }

  setDefPage(){
    this.result2 = [{'case_cate_id':0,'remark':''}];
  }
  addCaseCate(i:any){
    if((i+1)==this.result2.length)
    this.result2.push({'case_cate_id':0,'remark':''});
  }

  editCaseCate(i:any){
    this.result2 = [];
    this.caseCate.push(this.posts[i].case_cate_data);
    console.log(this.caseCate);
    console.log(this.caseCate[0].length)
    this.caseCate[0].forEach((ele,index,array) => {
      // console.log(ele[index].case_cate_id)
      console.log(index)
      this.result2.push({'case_cate_id':ele.case_cate_id,'remark':ele.remark});
    });
    this.result2.push({'case_cate_id':0,'remark':''});
    console.log(this.result2);
  }

  clickOpenMyModalComponent(type:any,receipttypeid:any,groupid:any,subtypeid:any,groupdesc:any){
    console.log(subtypeid);
    this.modalType = type;
    this.listSubtype = subtypeid;
    this.hid_receipt_type_id = receipttypeid;
    this.hid_group_id = groupid;
    this.groupdesc = groupdesc;
    this.openbutton.nativeElement.click();
  }


  tabChangeSelect(objName:any,objData:any,event:any,type:any){
    if(typeof objData!='undefined'){
      if(type==1){
       var val = objData.filter((x:any) => x.fieldIdValue.toString() === event.target.value) ;
   }else{
       var val = objData.filter((x:any) => x.fieldIdValue === event);
   }
   console.log(objData)
  //  console.log(event.target.value)
  //  console.log(event)
   console.log(val)
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

  // loadMyModalComponent(){
  //   if(this.modalType==1){
  //     this.loadComponent = false;
  //     this.loadMultiComponent = true;
  //     this.loadModalConfComponent = false;
  //     $("#exampleModal").find(".modal-content").css("width","700px");
  //     var student = JSON.stringify({
  //       "table_name" : "pdepartment",
  //       "field_id" : "dep_code",
  //       "field_name" : "dep_name",
  //       "search_id" : "",
  //       "search_desc" : "",
  //       "condition" : "",
  //       "userToken" : this.userData.userToken});
  //     this.listTable='pdepartment';
  //     this.listFieldId='dep_code';
  //     this.listFieldName='dep_name';
  //     this.listFieldNull='';
  //     this.listFieldCond='';


  //     console.log(student)
  //     this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
  //       (response) =>{
  //         console.log(response)
  //         this.list = response;
  //      },
  //       (error) => {}
  //     )
  //    }
  //   }

    loadMyModalComponent(){
      if(this.modalType==1){
        this.loadComponent = false;
        this.loadMultiComponent = true;
        this.loadModalConfComponent = false;
        $("#exampleModal").find(".modal-content").css("width","700px");
        var student = JSON.stringify({
            "receipt_type_id" :  this.hid_receipt_type_id,
            "group_id" :  this.hid_group_id,
            "userToken" : this.userData.userToken
        });
        this.listTable='preceipt_sub_type';
        this.listFieldId='sub_type_id';
        this.listFieldName='sub_type_name';
        this.listFieldNull='';
        this.listFieldCond='';
        this.listFieldSelect=this.posts.sub_type_id;


        console.log(student)
           this.http.post('/'+this.userData.appName+'ApiCT/API/fct0710/getSubType', student ).subscribe(
          (response) =>{
            console.log(response)
            let productsJson : any = JSON.parse(JSON.stringify(response));
           // this.list = response;
           this.list = productsJson;
         },
          (error) => {}
        )
       }else{
        this.loadComponent = false;
        this.loadMultiComponent = false;
        this.loadModalConfComponent = true;
        $("#exampleModal").find(".modal-content").css("width","700px");
       }
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
    const ele = name;
    if (ele) {
      ele.focus();
    }
  }

  convDate(date:any){
    if(date){
      var dateArray = date.split('/');
      return dateArray[2]+dateArray[1]+dateArray[0];
    }else
      return '';
  }

  setDateNum(name:any){
    // alert(name);
    var date = new Date();
    date = name.split('/');
    var dd = date[0];
    var mm = date[1];
    var yyyy = date[2];
    return dd+'/'+mm+"/"+yyyy;
  }

  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit0710 = this.masterSelected;
      }

    // for (var i = 0; i < this.checklist2.length; i++) {
    //   this.checklist2[i].editNoticeId = this.masterSelected2;
    //     }
    //this.getCheckedItemList();

  }
  /*
  getlist(index:any){
    alert(index)
    this.delList[index]['edit_prov_id']  =  this.posts[index]['edit_prov_id']
    console.log(this.delList);
  }*/

  isAllSelected() {
    this.masterSelected = this.checklist.every(function(item:any) {
        return item.edit0710 == true;
    })
  }

  uncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit0710 = false;
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

  // receiveFuncListData(event:any){
  //   this.result.hid_edit_dep_id = event.fieldIdValue;
  //   this.result.hid_edit_dep_name = event.fieldNameValue;
  //   this.closebutton.nativeElement.click();
  //   console.log(event)
  //   this.subtypeData();
  // }

  receiveFuncListData(event:any){
    this.dataSubtype = event;
    this.closebutton.nativeElement.click();
    console.log(this.dataSubtype);
    this.subtypeData();
  }
//   receiveFuncListData(event:any){
//     console.log(event)
//     if(this.listTable=='pjudge'){
//       this.prov_id=event.fieldIdValue;
//       this.judge_name=event.fieldNameValue;
//     }else{
//       this.absent_type=event.fieldIdValue;
//       this.absent_desc=event.fieldNameValue;
//     }

//     this.closebutton.nativeElement.click();
// }

/*
  loadMyModalComponent(){
    this.loadComponent = false;
    this.loadMultiComponent = true;
    $("#exampleModal").find(".modal-body").css("height","100px");
  }
  */
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

    if(!this.result.group_id){
      confirmBox.setMessage('กรุณาระบุกลุ่มการพิมพ์เงิน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          //this.SpinnerService.hide();
          $("input[name='group_id']")[0].focus();
        }
        subscription.unsubscribe();
      });

    }else if(!this.result.receipt_type_id){
      confirmBox.setMessage('กรุณาระบุประเภทเงิน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          //this.SpinnerService.hide();
          $("input[name='receipt_type_id']")[0].focus();
        }
        subscription.unsubscribe();
      });
    }else{


      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      // if(this.prov_id.nativeElement["default_value"].checked==true){
      //   var inputChk = 1;
      // }else{
      //   var inputChk = 0;
      // }
      // if(this.result2.length > 1){
      //   var case_cate = [],dataSave = [];
      // // console.log(this.result2.length);
      // this.result2.forEach((ele,index,array) => {
      //   console.log(this.result2[index]);
      //   case_cate.push( this.result2[index]);
      //   // case_cate = case_cate.concat(ele.case_cate_id.toString());
      //   console.log(case_cate);
      //  });
      //   case_cate.pop();
      //   dataSave['case_cate_data'] = case_cate;
      //   console.log(case_cate);
      // }

      //  if(this.all_day_flag==true){
    //      var inputchk = 1;
    //  }else{
    //      var inputchk = 0;
    //  }

      var student = JSON.stringify({
      "edit_receipt_type_id" : this.hid_receipt_type_id,
      "edit_group_id" : this.hid_group_id,
      "group_id" : this.result.group_id,
      "receipt_type_id" : this.result.receipt_type_id,
      "group_desc" : this.result.group_desc,
      "receipt_type_desc" : this.result.receipt_type_desc,
      "sub_type_id" : this.result.sub_type_id,
      "sub_type_name" : this.result.sub_type_name,
      "userToken" : this.userData.userToken
      });

      console.log(student)

      this.SpinnerService.show();
      //console.log("test hid_day_date => ", this.hid_day_date)
      if(this.hid_receipt_type_id){
        this.http.post('/'+this.userData.appName+'ApiCT/API/fct0710/saveJson', student ).subscribe(
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
      }else{
        this.http.post('/'+this.userData.appName+'ApiCT/API/fct0710/saveJson', student ).subscribe(
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
    //this.judge_name = this.getJudge.filter((x:any) => x.fieldIdValue === this.posts[index]['prov_id']).fieldNameValue;

      this.hid_receipt_type_id  = this.posts[index]['edit_table_id'];
      this.result.table_id  = this.posts[index]['table_id'];
      this.result.table_name = this.posts[index]['table_name'];
      // this.result2.case_cate_id = this.posts[index]['case_cate_id'] ? this.posts[index]['case_cate_id'] : 0;
      this.result.remark = this.posts[index]['remark'];
      this.result.case_status = this.posts[index]['case_status'] ? this.posts[index]['case_status'] : 0 ;
      this.result.branch_case = this.posts[index]['branch_case'];
      this.result.table_type = this.posts[index]['table_type'];
      this.result.con_app_after_case = this.posts[index]['con_app_after_case'];
      this.result.table_order = this.posts[index]['table_order'];
      this.result.mon = this.posts[index]['mon'];
      this.result.tue = this.posts[index]['tue'];
      this.result.wed = this.posts[index]['wed'];
      this.result.thu = this.posts[index]['thu'];
      this.result.fri = this.posts[index]['fri'];
      this.result.sat = this.posts[index]['sat'];
      this.result.sun = this.posts[index]['sun'];
      if(this.posts[index].case_cate_data.length){
        this.editCaseCate(index);
      }
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
      // if(this.prov_id.nativeElement["default_value"].checked==true){
      //   var inputChk = 1;
      // }else{
      //   var inputChk = 0;
      // }
      var student = JSON.stringify({
        "table_id" : this.result.table_id,
        "table_name" : this.result.table_name,
        "case_cate_id" : this.result.case_cate_id,
        "remark" : this.result.remark,
        "case_status" : this.result.case_status,
        "branch_case" : this.result.branch_case,
        "table_type" : this.result.table_type,
        "con_app_after_case" : this.result.con_app_after_case,
        "table_order" : this.result.table_order,
        "mon" : this.result.mon,
        "tue" : this.result.tue,
        "wed" : this.result.wed,
        "thu" : this.result.thu,
        "fri" : this.result.fri,
        "sat" : this.result.sat,
        "sun" : this.result.sun,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct0710', student , {headers:headers}).subscribe(
        posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          this.posts = productsJson.data;
          console.log(productsJson)
          if(productsJson.result==1){
            this.checklist = this.posts;
            this.checklist2 = this.posts;
              if(productsJson.length)
                this.posts.forEach((x : any ) => x.edit0710 = false);
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
      return item.edit0710 == false;
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
      this.modalType = 2;
      this.openbutton.nativeElement.click();
    }
  }

  goToLink(url: string){
    window.open(url, "_blank");
  }


  loadMyChildComponent(){
    this.loadMultiComponent = true;
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
                          if(ele.edit0710 == true){
                            dataTmp.push(this.posts[index]);
                            console.log(dataTmp)
                          }
                      });
                  });
                  if(bar){
                            //console.log(dataTmp)
                    dataDel['userToken'] = this.userData.userToken;
                    dataDel['data'] = dataTmp;
                   var data = $.extend({}, dataDel);
                    console.log(JSON.stringify(data))
                   this.http.post('/'+this.userData.appName+'ApiCT/API/fct0710/deleteDataSelect', data ).subscribe(
                    (response) =>{
                      let alertMessage : any = JSON.parse(JSON.stringify(response));
                      console.log(alertMessage);
                      if(alertMessage.result==0){
                        this.SpinnerService.hide();
                      }else{

                        this.closebutton.nativeElement.click();
                        $("button[type='reset']")[0].click();
                        // this.getData();


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

  subtypeData(){
    this.SpinnerService.show();
    var subtypeselect = [];
    // this.tmpResult = this.result.hid_edit_dep_id.split(',');
    // console.log(this.tmpResult);
      // for(let i =0; i < this.dataSubtype.length; i++){
      //   console.log(this.dataSubtype[i]);
      // }
        // if(ele.getcheck != null)


    console.log(subtypeselect);
    var jsonTmp = [],depTmp = [];
    this.dataSubtype = $.extend([],this.dataSubtype);
    console.log(this.dataSubtype);
    depTmp = this.dataSubtype;
    // jsonTmp = Object.values(depTmp[0]);
    // console.log('jsonTmp==>',jsonTmp);

    depTmp.forEach((element,index,Array) =>{
      if(element.index==true){
        subtypeselect.push(element.sub_type_id);
      //  subtypeselect.push({'dep_id':element})
      }
    }
    );
    // subtypeTmp =
    // Object.values(subtypeselect)
    console.log(Object.values(subtypeselect));
    console.log('subtypeselect==>',subtypeselect);
    console.log('subtypeselectTOSRTING==>',subtypeselect.toString());
    jsonTmp['edit_group_id'] = this.hid_group_id;
    jsonTmp['group_id'] = this.hid_group_id;
    jsonTmp['receipt_type_id'] = this.hid_receipt_type_id;
    // jsonTmp['sub_type_id'] = $.extend([],depTmp);
    jsonTmp['sub_type_id'] = subtypeselect.toString();
    jsonTmp['userToken'] = this.userData.userToken;

    var student = $.extend({},jsonTmp);

    console.log(JSON.stringify(student))
    // return false;
    this.http.post('/'+this.userData.appName+'ApiCT/API/fct0710/saveMapGroup', student ).subscribe(
      (response) =>{
          let alertMessage : any = JSON.parse(JSON.stringify(response));
          console.log(alertMessage)
          // if(alertMessage.result==0){
          //   this.SpinnerService.hide();
          //   confirmBox.setMessage(alertMessage.error);
          //   confirmBox.setButtonLabels('ตกลง');
          //   confirmBox.setConfig({
          //       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          //   });
          //   const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          //     if (resp.success==true){
          //       //this.SpinnerService.hide();
          //     }
          //     subscription.unsubscribe();
          //   });
          // }else{
          //   this.SpinnerService.hide();
          //   confirmBox.setMessage('จัดเก็บข้อมูลเรียบร้อยแล้ว');
          //   confirmBox.setButtonLabels('ตกลง');
          //   confirmBox.setConfig({
          //       layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
          //   });
          //   const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          //     if (resp.success==true){
          //       $("button[type='reset']")[0].click();
          //       //this.SpinnerService.hide();
          //     }
          //     subscription.unsubscribe();
          //   });
          //   this.ngOnInit();
          //   //this.form.reset();
          //    // $("button[type='reset']")[0].click();
          // }
          this.ngOnInit();
        },
        (error) => {this.SpinnerService.hide();}
      )
  }

  printReport(){
    var rptName = 'rct0710';

    // For no parameter : paramData ='{}'
    var paramData ='{}';

    // For set parameter to report
    // var paramData = JSON.stringify({
    //   "pprov_id" : this.prov_id.nativeElement["prov_id"].value,
    //   "pendnotice_desc" : this.prov_id.nativeElement["endnotice_desc"].value
    // });

    this.printReportService.printReport(rptName,paramData);
  }

  /*loadTableComponent(val:any){
    this.loadModalComponent = false;
    this.loadMultiComponent = true;
    $("#exampleModal").find(".modal-body").css("height","auto");
 }*/

 tabChange(obj:any){
   if(obj.target.value){
     this.std_prov_name = this.list.find((x:any) => x.fieldIdValue === parseInt(obj.target.value)).fieldNameValue2;
   }else{
     this.std_id="";
     this.std_prov_name="";
   }
 }
  closeModal(){
    this.loadComponent = false;
    this.loadMultiComponent = false;
    this.loadModalConfComponent= false;
  }

  getData(){
    this.posts = [];
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

      this.SpinnerService.show();
      this.http.get('/'+this.userData.appName+'ApiCT/API/fct0710?userToken='+this.userData.userToken+':angular').subscribe(posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          console.log(productsJson)
          this.posts = productsJson.data;
          console.log(this.posts);
          if(productsJson.result==1){
            this.checklist = this.posts;
            // this.checklist2 = this.posts;
            if(productsJson.data.length)
              this.posts.forEach((x : any ) => x.edit0710 = false);
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
    this[obj] = date;
    console.log(date)
  }

}
