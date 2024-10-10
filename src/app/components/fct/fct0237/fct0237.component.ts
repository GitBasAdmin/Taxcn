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
import { PrintReportService } from 'src/app/services/print-report.service';
// import { viewClassName } from '@angular/compiler';

@Component({
  selector: 'app-fct0237,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fct0237.component.html',
  styleUrls: ['./fct0237.component.css']
})


export class Fct0237Component implements AfterViewInit, OnInit, OnDestroy {

  title:any;

  posts:any;
  std_id:any;
  std_prov_name:any;
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
  myExtObject:any;
  programName:string;
  dep_code:any;
  dep_name:any;
  hid_attach_type_id:any;
  hid_sub_type_id:any;
  getAttachType:any;
  judge_case_type_id:any;
  judge_case_type:any;
  judge_case_name:any;
  case_cate_id:any;
  judge_case_group_id:any;
  judge_case_title:any;
  Datalist:any;
  defaultCaseType:any;

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;


  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  // @ViewChild('prov_id',{static: true}) prov_id : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  public loadModalComponent: boolean = false;

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

      // this.SpinnerService.show();
      this.http.get('/'+this.userData.appName+'ApiCT/API/fct0237?userToken='+this.userData.userToken+':angular').subscribe(posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          console.log(productsJson)
          this.posts = productsJson.data;
          console.log(this.posts);
          if(productsJson.result==1){
            this.checklist = this.posts;
            // this.checklist2 = this.posts;
            if(productsJson.data.length)
              this.posts.forEach((x : any ) => x.edit0237 = false);
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
        "url_name" : "fct0237"
      });
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen , {headers:headers}).subscribe(
        (response) =>{
          let getDataAuthen : any = JSON.parse(JSON.stringify(response));
          this.programName = getDataAuthen.programName;
          console.log(getDataAuthen)
        },
        (error) => {}
      )

    //======================== pattach_type ======================================
    var Json = JSON.stringify({
      "table_name" : "pattach_type",
      "field_id" : "attach_type_id",
      "field_name" : "attach_type_name",
      "userToken" : this.userData.userToken
    });
      console.log(Json);
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', Json , {headers:headers}).subscribe(
      (response) =>{
        console.log('xxxxxxxxxxx'+response);
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getAttachType = getDataOptions;
        // this.getCaseCate.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
      },
      (error) => {}
    )

    this.result.attach_type_id = 1;

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

  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit0237 = this.masterSelected;
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
        return item.edit0237 == true;
    })
  }

  uncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit0237 = false;
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

  // changeTitle(caseType:number,type:any){
  //   this.title = '';
  //   var student = JSON.stringify({
  //     "table_name": "ptitle",
  //     "field_id": "title_id",
  //     "field_name": "title",
  //     "field_name2": "title_eng",
  //     "condition": " AND case_type="+caseType,
  //     "order_by":" title_id ASC",
  //     "userToken" : this.userData.userToken
  //   });
  //   console.log("fTitle :"+student)
  //   let headers = new HttpHeaders();
  //   headers = headers.set('Content-Type','application/json');
  //   let promise = new Promise((resolve, reject) => {
  //   this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
  //     (response) =>{
  //       let getDataOptions : any = JSON.parse(JSON.stringify(response));
  //       this.getTitle = getDataOptions;
  //       if(type>0)
  //         this.title = type;
  //       //this.fDefCaseStat(caseType,title);
  //     },
  //     (error) => {}
  //   )
  //   });
  //   return promise;
  // }


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

  receiveFuncListData(event:any){
    this.dep_code = event.fieldIdValue;
    this.dep_name = event.fieldNameValue;
    this.closebutton.nativeElement.click();
    console.log(event)
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

    if(!this.result.sub_type_id){
      confirmBox.setMessage('กรุณาระบุรหัสประเภทเอกสารย่อย');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          //this.SpinnerService.hide();
          $("input[name='sub_type_id']")[0].focus();
        }
        subscription.unsubscribe();
      });

    }else if(!this.result.sub_type_name){
      confirmBox.setMessage('กรุณาระบุชื่อประเภทเอกสารย่อย');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          //this.SpinnerService.hide();
          $("input[name='sub_type_name']")[0].focus();
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


    //  if(this.all_day_flag==true){
    //      var inputchk = 1;
    //  }else{
    //      var inputchk = 0;
    //  }

      var student = JSON.stringify({
      "edit_attach_type_id" : this.hid_attach_type_id,
      "edit_sub_type_id" : this.hid_sub_type_id,
      "attach_type_id" : this.result.attach_type_id,
      "sub_type_id" : this.result.sub_type_id,
      "sub_type_name" : this.result.sub_type_name,
      "inquest_flag" : this.result.inquest_flag,
      "userToken" : this.userData.userToken
      });
      console.log(student)

      this.SpinnerService.show();
      if(this.hid_attach_type_id){
        this.http.post('/'+this.userData.appName+'ApiCT/API/fct0237/updateJson', student , {headers:headers}).subscribe(
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
              // this.ngOnInit();
              //this.form.reset();
               // $("button[type='reset']")[0].click();

            }
          },
          (error) => {this.SpinnerService.hide();}
        )
      }else{
        this.http.post('/'+this.userData.appName+'ApiCT/API/fct0237/saveJson', student , {headers:headers}).subscribe(
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
              // this.ngOnInit();
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
      this.hid_attach_type_id  = this.posts[index]['edit_attach_type_id'];
      this.hid_sub_type_id  = this.posts[index]['edit_sub_type_id'];
      this.result.attach_type_id  = this.posts[index]['attach_type_id'];
      this.result.sub_type_id = this.posts[index]['sub_type_id'];
      this.result.sub_type_name = this.posts[index]['sub_type_name'];
      this.result.inquest_flag  = this.posts[index]['inquest_flag'];
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
      // if(this.prov_id.nativeElement["default_value"].checked==true){
      //   var inputChk = 1;
      // }else{
      //   var inputChk = 0;
      // }
      var student = JSON.stringify({
        "judge_case_type_id" : this.judge_case_type_id,
        "judge_case_type" : this.judge_case_type,
        "judge_case_name" : this.judge_case_name,
        "case_cate_id" : this.case_cate_id,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct0237/search', student , {headers:headers}).subscribe(
        posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          this.posts = productsJson.data;
          console.log(productsJson)
          if(productsJson.result==1){
            this.checklist = this.posts;
            this.checklist2 = this.posts;
              if(productsJson.length)
                this.posts.forEach((x : any ) => x.edit0237 = false);
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
      return item.edit0237 == false;
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


  loadMyChildComponent(){
    this.loadComponent = true;
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
                          if(ele.edit0237 == true){
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
                   console.log(data)
                   this.http.post('/'+this.userData.appName+'ApiCT/API/fct0237/deleteSelect', data , {headers:headers}).subscribe(
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
    var rptName = 'rct0237';

    // For no parameter : paramData ='{}'
    var paramData ='{}';

    // For set parameter to report
    // var paramData = JSON.stringify({
    //   "pprov_id" : this.prov_id.nativeElement["prov_id"].value,
    //   "pendnotice_desc" : this.prov_id.nativeElement["endnotice_desc"].value
    // });

    this.printReportService.printReport(rptName,paramData);
  }

  loadTableComponent(val:any){
    this.loadModalComponent = false;
    this.loadComponent = true;
    $("#exampleModal").find(".modal-body").css("height","auto");
 }

 tabChange(obj:any){
   if(obj.target.value){
     this.std_prov_name = this.list.find((x:any) => x.fieldIdValue === parseInt(obj.target.value)).fieldNameValue2;
   }else{
     this.std_id="";
     this.std_prov_name="";
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
      this.http.get('/'+this.userData.appName+'ApiCT/API/fct0237?userToken='+this.userData.userToken+':angular').subscribe(posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          console.log(productsJson)
          this.posts = productsJson.data;
          console.log(this.posts);
          if(productsJson.result==1){
            this.checklist = this.posts;
            // this.checklist2 = this.posts;
            if(productsJson.data.length)
              this.posts.forEach((x : any ) => x.edit0237 = false);
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







