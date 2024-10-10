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
  selector: 'app-fct0412,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fct0412.component.html',
  styleUrls: ['./fct0412.component.css']
})


export class Fct0412Component implements AfterViewInit, OnInit, OnDestroy {

  title = 'datatables';

  posts:any;
  delList:any=[];
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
  getAbsent:any;
  judge_id:any;
  hid_judge_id:any;
  hid_absent_date:any;
  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
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
      this.http.get('/'+this.userData.appName+'ApiCT/API/fct0412?userToken='+this.userData.userToken+':angular').subscribe(posts => {
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

      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      var authen = JSON.stringify({
        "userToken" : this.userData.userToken,
        "url_name" : "fct0412"
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
    //======================== pabsent_type ======================================
    var student = JSON.stringify({
      "table_name" : "pabsent_type",
      "field_id" : "absent_type",
      "field_name" : "absent_desc",
      "field_name2" : "absent_flag",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getAbsent = getDataOptions;
        this.getAbsent.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
      },
      (error) => {}
    )
    this.all_day_flag = 1;
    this.setTime(1);
  }

  setTime(val:any){
    if(val==1){
    this.time_start = '08.30';
    this.time_end = '16.30';
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
       this.judge_id = event.judge_id;
       this.judge_name = event.judge_name;
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
      this.absent_type=event.fieldIdValue;
      this.absent_desc=event.fieldNameValue;
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

    if(!this.judge_id){
      confirmBox.setMessage('กรุณาระบุรหัสผู้พิพากษา');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          //this.SpinnerService.hide();
          this.setFocus('judge_id');
        }
        subscription.unsubscribe();
      });

    }else if(!this.judge_name){
      confirmBox.setMessage('กรุณาระบุชื่อผู้พิพากษา');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          //this.SpinnerService.hide();
          this.setFocus('judge_id');
        }
        subscription.unsubscribe();
      });
    }else{


      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      // if(this.judge_id.nativeElement["default_value"].checked==true){
      //   var inputChk = 1;
      // }else{
      //   var inputChk = 0;
      // }


     if(this.all_day_flag==true){
         var inputchk = 1;
     }else{
         var inputchk = 0;
     }

      var student = JSON.stringify({
      "edit_judge_id" : this.hid_judge_id,
      "edit_absent_date" : this.hid_absent_date,
      "judge_id" : this.judge_id,
      "sdate" : this.absentdate1,
      "edate" : this.absentdate2,
      "time_start" : this.time_start,
      "time_end" : this.time_end,
      "absent_type" : this.absent_type,
      "all_day_flag" : inputchk,
      "remark" : this.remark,
      "userToken" : this.userData.userToken
      });
      console.log(student)

      this.SpinnerService.show();
      if(this.hid_judge_id){
        this.http.post('/'+this.userData.appName+'ApiCT/API/fct0412/updateJson', student , {headers:headers}).subscribe(
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
        this.http.post('/'+this.userData.appName+'ApiCT/API/fct0412/saveJson', student , {headers:headers}).subscribe(
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
    console.log(this.posts[index]['judge_name']+'ooooooooooooo'+this.posts[index]['absent_type'])
    this.SpinnerService.show();
    //this.renderer.setProperty(this.judge_id.nativeElement['hid_judge_id'],'value', this.posts[index]['edit_judge_id']);
    // this.renderer.setProperty(this.judge_id.nativeElement['judge_id'],'value', this.posts[index]['judge_id']);
      this.hid_judge_id = this.posts[index]['edit_judge_id'];
      this.hid_absent_date = this.posts[index]['edit_absent_date'];
      this.judge_id = this.posts[index]['judge_id'];
      this.judge_name = this.posts[index]['judge_name'];
      //this.judge_name = this.getJudge.filter((x:any) => x.fieldIdValue === this.posts[index]['judge_id']).fieldNameValue;
      this.absentdate1 = this.posts[index]['absent_date'];
      this.absentdate2 = this.posts[index]['absent_date'];
      this.time_start = this.posts[index]['time_start'];
      this.time_end = this.posts[index]['time_end'];
      this.absent_type = this.posts[index]['absent_type'];
      this.absent_desc = this.posts[index]['absent_desc'];
      //this.absent_desc = this.getAbsent.filter((x:any) => x.fieldIdValue === this.posts[index]['absent_type']).fieldNameValue;
      this.remark = this.posts[index]['remark'];


     if(this.posts[index]['all_day_flag']){
      this.all_day_flag = true;
     }else{
      this.all_day_flag = false;
     }

    setTimeout(() => {
      this.SpinnerService.hide();
    }, 500);

  }

  searchData() {
    if(!this.judge_id && !this.absentdate1){
      const confirmBox = new ConfirmBoxInitializer();
          confirmBox.setTitle('ข้อความแจ้งเตือน');
          confirmBox.setMessage('ป้อนเงื่อนไขวันที่เพื่อค้นหา');
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
    confirmBox.setTitle('ข้อความแจ้งเตือน');

      this.SpinnerService.show();

      // if(this.judge_id.nativeElement["default_value"].checked==true){
      //   var inputChk = 1;
      // }else{
      //   var inputChk = 0;
      // }
      var student = JSON.stringify({
        "judge_id" : this.judge_id,
        "absent_type" : this.absent_type,
        "absent_sdate" : this.absentdate1,
        "absent_edate" : this.absentdate2,
        "time_start"   : this.time_start,
        "time_end" : this.time_end,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct0412/search', student ).subscribe(
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
                   this.http.post('/'+this.userData.appName+'ApiCT/API/fct0412/deleteSelect', data , {headers:headers}).subscribe(
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
    if(this.absentdate2){
      if(this.absentdate1 > this.absentdate2){
        alert('วันที่เริ่มต้นมากกว่าวันที่สิ้นสุด');
        return(false);
        }
    }

    var rptName = 'rct0412';

    // For no parameter : paramData ='{}'
    var paramData ='{}';

    // For set parameter to report
    var paramData = JSON.stringify({
      "pjudge_id" : this.judge_id ? this.judge_id.toString() : '',
      "pdate_start" : this.absentdate1 ? myExtObject.conDate(this.absentdate1) : '',
      "pdate_end" : this.absentdate2 ? myExtObject.conDate(this.absentdate2) : '',
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
      this.judge_name = val[0].fieldNameValue;
    }else{
      this.judge_id = null;
      this.judge_name = '';
    }
    setTimeout(() => {
      this.SpinnerService.hide();
    }, 200);

  }else{
    var val = this.getAbsent.filter((x:any) => x.fieldIdValue === obj.target.value) ;
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

  /*
  let headers = new HttpHeaders();
   headers = headers.set('Content-Type','application/json');
  var student = JSON.stringify({
    "table_name": this.listTable,
    "field_id": this.listFieldId,
    "field_name": this.listFieldName,
    "search_id":this.judge_id.nativeElement[this.listFieldId].value,
    "search_desc":'',
    "userToken" : this.userData.userToken
  });
  //console.log(student)
  this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student , {headers:headers}).subscribe(
    datalist => {

      let productsJson = JSON.parse(JSON.stringify(datalist));
      if(productsJson.length){
        this.judge_id.nativeElement[this.listFieldName].value=productsJson[0].fieldNameValue;
        this.SpinnerService.hide();
      }else{
        this.SpinnerService.hide();
        this.judge_id.nativeElement[this.listFieldId].value="";
        this.judge_id.nativeElement[this.listFieldName].value="";

        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('ไม่พบข้อมูล');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){
              this.setFocus(this.listFieldId);
            }
            subscription.unsubscribe();
          });

      }

    },
    (error) => {}
  );
    */
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
    var student = JSON.stringify({"table_name" : "pabsent_type", "field_id" : "absent_type","field_name" : "absent_desc","search_id" : "","search_desc" : "","userToken" : this.userData.userToken});
    this.listTable='pabsent_type';
    this.listFieldId='absent_type';
    this.listFieldName='absent_desc';
    this.listFieldNull='';

  this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student ).subscribe(
       (response) =>{
         this.list = response;
         this.loadModalComponent = false;
         this.loadModalJudgeComponent = false;
         this.loadComponent = true;
         $("#exampleModal").find(".modal-body").css("height","auto");
         console.log(response)
       },
       (error) => {}
     )
    }
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
      this.http.get('/'+this.userData.appName+'ApiCT/API/fct0412?userToken='+this.userData.userToken+':angular').subscribe(posts => {
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
    this[obj] = date;
    console.log(date)
  }

}







