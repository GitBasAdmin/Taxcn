import { DatalistReturnComponent } from './../../modal/datalist-return/datalist-return.component';
import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Renderer2, Input, ViewChildren, QueryList   } from '@angular/core';
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
import { PrintReportService } from 'src/app/services/print-report.service';
// import { viewClassName } from '@angular/compiler';

@Component({
  selector: 'app-fct0423,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fct0423.component.html',
  styleUrls: ['./fct0423.component.css']
})


export class Fct0423Component implements AfterViewInit, OnInit, OnDestroy {

  title:any;

  posts:any;
  judge:any=[];
  std_id:any;
  std_prov_name:any;
  delList:any=[];
  search:any;
  masterSelected:boolean;
  checklist:any;
  checklist2:any;
  sessData:any;
  userData:any;
  myExtObject:any;
  programName:string;
  dep_code:any;
  dep_name:any;

  Datalist:any;
  defaultCaseType:any;
  //------
  result:any=[];
  fileToUpload1: File = null;//
  getCaseCate:any;
  getJudgeId:any;
   //------test
  dataHeadValue:any = [];
  dataSource:any;
  rawDep:any=[];
  judgeIndex:any;
  judgeType:any;


  // dataHead:any = [];
  // run_id:any;
  // reqRunning:any;
  items:any = [];
  
  // getReq:any;
  // req_id:any;
  // modalType:any;


  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldNull:any;
  public listFieldType:any;


  dtOptions: DataTables.Settings = {};;
  dtTrigger: Subject<any> = new Subject<any>();
  alleOptions: DataTables.Settings = {};
  dtTriggerJudge: Subject<any> = new Subject<any>();

  
  // @ViewChild('prov_id',{static: true}) prov_id : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('form_id',{static: true}) form_id : ElementRef;
  // @ViewChild('form_desc',{static: true}) form_desc : ElementRef;


  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  public loadModalComponent: boolean = false;
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
    this.dataHeadValue.depObj = [];
    this.judge="";
    this.judgeIndex="";

    // console.log("dataHeadValue=>" , this.dataHeadValue.depObj);
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 30,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[[3,'asc']]
    };

    this.alleOptions = {
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      lengthChange : false,
      info : false,
      paging : false,
      searching : false,
      destroy: true
    };

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);

    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    
    var student = JSON.stringify({
      "userToken" : this.userData.userToken
    });

      this.http.post('/'+this.userData.appName+'ApiCT/API/fct0423', student).subscribe(posts => {
      let productsJson : any = JSON.parse(JSON.stringify(posts));
      this.posts = productsJson.data;
      // this.items = productsJson.data;
      // console.log("items", this.items);
      // console.log("productsJson=>", posts);

      if(productsJson.result==1){
        this.checklist = this.posts;
        // this.checklist2 = this.posts;
        if(productsJson.data.length)
          this.posts.forEach((x : any ) => x.edit0423 = false);
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
      "url_name" : "fct0423"
    });
    this.http.post('/'+this.userData.appName+'Api/API/authen', authen ).subscribe(
      (response) =>{
        let getDataAuthen : any = JSON.parse(JSON.stringify(response));
        this.programName = getDataAuthen.programName;
        // console.log(getDataAuthen)
      },
      (error) => {}
    )

    //======================== pcase_cate ======================================
    var student = JSON.stringify({
      "table_name" : "pcase_cate",
      "field_id" : "case_cate_id",
      "field_name" : "case_cate_name",
      "order_by" : "case_cate_id ASC",
      "userToken" : this.userData.userToken
    });

    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseCate = getDataOptions;
      },
      (error) => {}
    )

      // pop up pperformance_manual_setup
      // var student = JSON.stringify({
      //   "table_name" : "pjudge",
      //   "field_id" : "judge_id",
      //   "field_name" : "judge_name",
      //   "userToken" : this.userData.userToken
      // });
    
      // this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
      //   (response) =>{
      //     this.list = response;
      //       // console.log('xxxxxxx',response)
      //   },
      //   (error) => {}
      // )
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
       },
       (error) => {}
     )
  }

  // curencyFormat(n:any,d:any) {
	// 	return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
	// }
  // curencyFormatRevmove(val: number): string {
  //   if (val !== undefined && val !== null) {
  //     return val.toString().replace(/,/g, "").slice(.00, -3); ;
  //   } else {
  //     return "";
  //   }
  // }


  rerender(): void {
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      if(dtElement.dtInstance)
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();        
      });
    });
    //this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    // Destroy the table first
    //dtInstance.destroy();
    // Call the dtTrigger to rerender again
    this.dtTrigger.next(null);
    this.dtTriggerJudge.next(null);
  }

 ngAfterViewInit(): void {
    this.dtTrigger.next(null);
    // this.dtTriggerJudge.next(null);
    myExtObject.callCalendar();
    }

  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
      // this.dtTriggerJudge.unsubscribe();
    }

  setFocus(name:any) {
    const ele = this.form_id.nativeElement[name];
    // console.log("name=>", name);
    // console.log("ele=>", ele);
    if (ele) {
      ele.focus();
    }
  }

  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit0423 = this.masterSelected;
      }

      //console.log("checkUncheckAll=>", this.checklist[i].edit0423);
  }

  isAllSelected() {
    this.masterSelected = this.checklist.every(function(item:any) {
        return item.edit0423 == true;
    })
  }

  uncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit0423 = false;
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

  //startDate , endDate
  directiveDate(date:any,obj:any){
    this.result[obj] = date;
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
       })
    }, 100);

  }


  loadMyModalComponent(){
    this.loadModalComponent = true;
    this.loadModalJudgeComponent = false;
    $("#exampleModal").find(".modal-body").css("height","100px");
  }
  

  // save update Judge Group group_running
  submitForm() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!this.result.party_id){
      confirmBox.setMessage('กรุณาระบุคณะที่');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          this.setFocus('partyId');
        }
        subscription.unsubscribe();
      });

    }else if(!this.result.judge_group_id){
      confirmBox.setMessage('กรุณาระบุองค์คณะที่');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          this.setFocus('judgeGroupId');
        }
        subscription.unsubscribe();
      });
    }else if(!this.result.start_date){
      confirmBox.setMessage('กรุณาระบุวันที่เริ่มต้น');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          this.setFocus('startDate');
        }
        subscription.unsubscribe();
      });
    }else{
      var student = JSON.stringify({
        "group_running": this.result.group_running,
        "case_cate_id": this.result.case_cate_id,
        "party_id": this.result.party_id,
        "judge_group_id": this.result.judge_group_id,
        "start_date": this.result.start_date,
        "end_date": this.result.end_date,
        "skip_assign_auto": this.result.skip_assign_auto ? 1 : 0,
        "userToken" : this.userData.userToken
      });
      // console.log("SAVE student=>", student);
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct0423/saveJudgeGroup', student ).subscribe(
        (response) =>{
          let alertMessage : any = JSON.parse(JSON.stringify(response));
          // console.log("Add response data=>", alertMessage);
            if(alertMessage.result==0){
              this.SpinnerService.hide();
              confirmBox.setMessage(alertMessage.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  // this.SpinnerService.hide();
                  //get judge id
                  //this.getObjJudgeData();
                }
                //subscription.unsubscribe();
              });
            }else{
              this.SpinnerService.hide();
              confirmBox.setMessage('ข้อความแจ้งเตือน');
              confirmBox.setMessage(alertMessage.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  this.result.group_running = alertMessage.group_running;
                  this.result.edit_group_running = alertMessage.group_running;
                  this.getObjJudgeData();
                  this.getData();
                }
                //subscription.unsubscribe();
              });
            }
        },
        (error) => {}
      )
    }
  }

  //Edit Judge Group
  editData(index:any){
    //console.log("editData index=>", index)
    this.SpinnerService.show();

    this.result.edit_group_running  = this.posts[index]['group_running'];
    this.result.group_running  = this.posts[index]['group_running'];
    if(this.posts[index]['case_cate_id']==0)
      this.posts[index]['case_cate_id'] = null;
    this.result.case_cate_id  = this.posts[index]['case_cate_id'];
    this.result.party_id  = this.posts[index]['party_id'];
    this.result.judge_group_id = this.posts[index]['judge_group_id'];
    this.result.start_date = this.posts[index]['start_date'];
    this.result.end_date = this.posts[index]['end_date'];
    this.result.skip_assign_auto = this.posts[index]['skip_assign_auto'];

    //get judge id
    this.getObjJudgeData();

    setTimeout(() => {
      this.SpinnerService.hide();
    }, 500);

  }

  searchData() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

      this.SpinnerService.show();
      
      var student = JSON.stringify({
        "judge_id": parseInt(this.rawDep.judge_id),
        "judge_name": this.rawDep.judge_name,
        "userToken" : this.userData.userToken
      });
      //console.log(student)
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct0423/search', student ).subscribe(
        posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          this.posts = productsJson.data;
          
          if(productsJson.result==1){
            this.checklist = this.posts;
            this.checklist2 = this.posts;
              if(productsJson.length)
                this.posts.forEach((x : any ) => x.edit0423 = false);
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
    var isChecked = this.posts.every(function(item:any) {
      return item.edit0423 == false;
    })

    // console.log("isChecked", isChecked);
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


  loadMyChildComponent(){
    // this.loadComponent = true;
  }


  //delete Judge Group
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
      var student = JSON.stringify({
        "user_running" : this.userData.userRunning,
        "password" : chkForm.password,
        "log_remark" : chkForm.log_remark,
        "userToken" : this.userData.userToken
      });
      this.http.disableLoading().post('/'+this.userData.appName+'Api/API/checkPassword', student).subscribe(
        posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          if(productsJson.result==1){
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
            confirmBox.setMessage('ยืนยันการลบข้อมูลที่เลือก');
            confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                var dataDel = [],dataTmp=[];
                var bar = new Promise((resolve, reject) => {
                  this.posts.forEach((ele, index, array) => {
                        if(ele.edit0423 == true){
                          dataTmp.push(this.posts[index]);
                        }
                    });
                });
                if(bar){
                  // console.log("dataTmp=>", dataTmp);
                  dataDel['userToken'] = this.userData.userToken;
                  dataDel['data'] = dataTmp;
                  var data = $.extend({}, dataDel);
                  // // console.log("delete=>",data)
                  this.http.post('/'+this.userData.appName+'ApiCT/API/fct0423/deleteSelectJudgeGroup', data ).subscribe(
                  (response) =>{
                    let alertMessage : any = JSON.parse(JSON.stringify(response));
                    // console.log("response=>",alertMessage)
                    if(alertMessage.result==0){
                      this.SpinnerService.hide();
                    }else{
                      this.closebutton.nativeElement.click();
                      $("button[type='reset']")[0].click();
                      this.getData();
                    }
                  },
                  (error) => {this.SpinnerService.hide();}
                )
                }   
              }
              subscription.unsubscribe();
            });
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
        },
        (error) => {}
      );

    }
  }

  printReport(){
    var rptName = 'rct0423';

    // For no parameter : paramData ='{}'
    var paramData ='{}';

    // For set parameter to report
    // var paramData = JSON.stringify({
    //   "pprov_id" : this.prov_id.nativeElement["prov_id"].value,
    //   "pendnotice_desc" : this.prov_id.nativeElement["endnotice_desc"].value
    // });
    this.printReportService.printReport(rptName,paramData);
  }

  // receiveFuncListData(event:any){
  //   // console.log("this.judgeIndex", this.judgeIndex)
  //   // console.log("this.judgeType", this.judgeType)
  //   if(this.judgeType==1){
  //     this.dataHeadValue.depObj[this.judgeIndex].judge_id = event.fieldIdValue;
  //     this.dataHeadValue.depObj[this.judgeIndex].judge_name = event.fieldNameValue;
  //   }else{
  //     this.rawDep.judge_id=event.fieldIdValue;
  //     this.rawDep.judge_name=event.fieldNameValue;
  //   }
  //   this.saveJudge(this.judgeIndex, event.fieldIdValue, this.judgeType);
  //   this.closebutton.nativeElement.click();
  // }

  receiveJudgeListData(event:any){

    if(this.judgeType==1){
      this.dataHeadValue.depObj[this.judgeIndex].judge_id = event.judge_id;
      this.dataHeadValue.depObj[this.judgeIndex].judge_name = event.judge_name;
    }else{
      this.rawDep.judge_id = event.judge_id;
      this.rawDep.judge_name = event.judge_name;
    }
    this.saveJudge(this.judgeIndex,event.judge_id, this.judgeType);
    this.closebutton.nativeElement.click();


    // this.result.judge_id = event.judge_id;
    // this.result.judge_name = event.judge_name;
    // this.closebutton.nativeElement.click();
  }

  loadTableComponent(index:any, type:any){
    this.judgeIndex=index;
    this.judgeType=type;

    this.loadModalComponent = false;
    this.loadModalJudgeComponent = true;

    $("#exampleModal").find(".modal-body").css("height","auto");
 }


 changeDep(index:any, obj:any, type:any){
  if(type==1){
    var lit_type_desc =  this.list.filter((x:any) => x.fieldIdValue === parseInt(obj.target.value)) ;
    // console.log("lit_type_desc=>", lit_type_desc.length);
    if(lit_type_desc.length!=0){
      this.dataHeadValue.depObj[index].judge_name = this.list.find((x:any) => x.fieldIdValue === parseInt(obj.target.value)).fieldNameValue;
      this.saveJudge(index, obj, type);
    }else{
      this.dataHeadValue.depObj[index].judge_id = " ";
      this.dataHeadValue.depObj[index].judge_name = " ";
    }
  }else{
    var lit_type_desc =  this.list.filter((x:any) => x.fieldIdValue === parseInt(obj.target.value)) ;
    // console.log("lit_type_desc=>", lit_type_desc.length);
    if(lit_type_desc.length!=0){
      this.rawDep.judge_name = this.list.find((x:any) => x.fieldIdValue === parseInt(obj.target.value)).fieldNameValue;
      this.saveJudge(index, obj, type);
    }else{
      this.rawDep.judge_id="";
      this.rawDep.judge_name="";
    }
  }
 }

 //Add Update Judge
 saveJudge(index:any, obj:any, type:any){
  const confirmBox = new ConfirmBoxInitializer();
  confirmBox.setTitle('ข้อความแจ้งเตือน');
  if(type==1){//Edit
    if(this.dataHeadValue.depObj[index].edit_judge_id && this.dataHeadValue.depObj[index].judge_name){  
      var student = JSON.stringify({
        "group_running": this.result.group_running,
        "edit_judge_id": this.dataHeadValue.depObj[index].edit_judge_id,
        "judge_id": parseInt(this.dataHeadValue.depObj[index].judge_id),
        "judge_name": this.dataHeadValue.depObj[index].judge_name,
        "userToken" : this.userData.userToken
      });
      // console.log("student=>", student);
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct0423/saveJudgeDetail', student).subscribe(
        posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          // console.log("Edit productsJson.result=>", productsJson.result);
          if(productsJson.result==0){
            this.SpinnerService.hide();
            confirmBox.setMessage(productsJson.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                this.SpinnerService.hide();
              }
              subscription.unsubscribe();
            });
          }else{
            //save success
            this.getObjJudgeData();
            this.getData();
          }
        },
        (error) => {this.SpinnerService.hide();}
      );
    }
  }else{//Add
      if(this.rawDep.judge_id && this.rawDep.judge_name){

          var student = JSON.stringify({
            "group_running": this.result.group_running,
            "judge_id": parseInt(this.rawDep.judge_id),
            "judge_name": this.rawDep.judge_name,
            "userToken" : this.userData.userToken
          });
          // console.log("student=>", student);
          this.http.post('/'+this.userData.appName+'ApiCT/API/fct0423/saveJudgeDetail', student).subscribe(
            posts => {
              let productsJson : any = JSON.parse(JSON.stringify(posts));
              // console.log("Add productsJson.result=>", productsJson.result);
              
              //---
              if(productsJson.result==0){
                this.SpinnerService.hide();
                confirmBox.setMessage(productsJson.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                    this.SpinnerService.hide();
                  }
                  subscription.unsubscribe();
                });
              }else{
                //save success
                this.getObjJudgeData();
                this.getData();
              }
              //---
            },
            (error) => {this.SpinnerService.hide();}
          );
      }
  }
 }


  getData(){
    this.posts = [];
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

      this.SpinnerService.show();

      var student = JSON.stringify({
        "userToken" : this.userData.userToken
      });
      
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct0423', student).subscribe(posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          // console.log("getData=>", productsJson);
          this.posts = productsJson.data;
          //console.log(this.posts);
          if(productsJson.result==1){
            this.checklist = this.posts;
            // this.checklist2 = this.posts;
            if(productsJson.data.length)
              this.posts.forEach((x : any ) => x.edit0423 = false);
            this.rerender();
          }else{
            confirmBox.setMessage(productsJson.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                //
              }
              subscription.unsubscribe();
            });
          }
          this.SpinnerService.hide();
      });
  }

  //get Judge
  getObjJudgeData(){
    this.rawDep = {judge_id:'',judge_name:''};
    var student = JSON.stringify({
      "group_running" : this.result.group_running,
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiCT/API/fct0423/getJudgeDetail', student).subscribe(
      datalist => {
        this.items = datalist;
        // console.log("this.items=>", this.items);

        if(this.items.data.length){
          this.dataHeadValue.depObj = this.items.data;
          // console.log("dataHeadValue.depObj=>", this.dataHeadValue.depObj.length);
          this.rerender();
          this.SpinnerService.hide();
        }else{
          this.dataHeadValue.depObj = [];
          //this.getDataDep$ = of();
          this.rerender();
          this.SpinnerService.hide();
        }
      },
      (error) => {this.SpinnerService.hide();}
    );
  }

  //Delete Judge
  delJudge(index:any, type:any){

    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
    confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      if (resp.success==true){
        var student = JSON.stringify({
          "group_running": this.result.group_running,
          "judge_id": parseInt(this.dataHeadValue.depObj[index].judge_id),
          "userToken" : this.userData.userToken
        });
        // console.log("delJudge student=>", student);
        this.http.post('/'+this.userData.appName+'ApiCT/API/fct0423/deleteJudgeGroupDetail', student).subscribe(
          posts => {
            let productsJson : any = JSON.parse(JSON.stringify(posts));
            // console.log("productsJson delete=>", productsJson)
            if(productsJson.result==1){
              this.getObjJudgeData();
              this.getData();
            }
          },
          (error) => {this.SpinnerService.hide();}
        )
      }
    });
      
  }

  clearData(objName:any, type:any){
    if(type== 1 || type== 4){
      this.result[objName] = "";
      this[objName] = "";
    }else{
      this.result[objName] = null;
      this[objName] = null;
    }
  }

  closeModal(){
    this.loadModalComponent = false;
    this.loadModalJudgeComponent = false;
    $('.modal')
    .find("input[type='text'],input[type='password'],textarea,select")
    .val('')
    .end()
    .find("input[type=checkbox], input[type=radio]")
    .prop("checked", "")
    .end();
  }
}
