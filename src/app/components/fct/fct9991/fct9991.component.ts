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
  selector: 'app-fct9991,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fct9991.component.html',
  styleUrls: ['./fct9991.component.css']
})


export class Fct9991Component implements AfterViewInit, OnInit, OnDestroy {

  title:any;

  posts:any;
  std_id:any;
  std_prov_name:any;
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
  myExtObject:any;
  programName:string;
  dep_code:any;
  dep_name:any;

  Datalist:any;
  defaultCaseType:any;


  result:any = [];
  getUserFlag:any;
  getUserId:any;
  getValidFlag:any;
  getUserLevel:any;
  //---

  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  public listFieldType:any;


  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  public loadModalComponent: boolean = false;
  public loadModalJudgeComponent: boolean = false;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  //set focus
  @ViewChild('user_login',{static: true}) user_login : ElementRef;
  @ViewChild('user_id',{static: true}) user_id : ElementRef;
  

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
    this.setDefForm();
    this.result.user_running=0;

    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    var student = JSON.stringify({
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiCT/API/fct9991', student).subscribe(
      posts => {
        let productsJson : any = JSON.parse(JSON.stringify(posts));
        this.posts = productsJson.data;
        // console.log("productsJson=>", posts);
        if(productsJson.result==1){
          this.checklist = this.posts;
          if(productsJson.data.length)
            this.posts.forEach((x : any ) => x.edit9991 = false);
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

  //======================== authen ======================================
  var authen = JSON.stringify({
    "userToken" : this.userData.userToken,
    "url_name" : "fct9991"
  });
  this.http.post('/'+this.userData.appName+'Api/API/authen', authen ).subscribe(
    (response) =>{
      let getDataAuthen : any = JSON.parse(JSON.stringify(response));
      this.programName = getDataAuthen.programName;
    },
    (error) => {}
  )

  //ผู้ใช้งานระบบ
  this.getUserFlag = [{fieldIdValue:'o',fieldNameValue: 'พนักงาน'}, 
                      {fieldIdValue:'j',fieldNameValue: 'ผู้พิพากษา'}];
  //ใช้งาน
  this.getValidFlag= [{fieldIdValue:'Y',fieldNameValue: 'ใช้ได้'}, 
                      {fieldIdValue:'N',fieldNameValue: 'ใช้ไม่ได้'}];
  //ระดับการใช้งาน
  this.getUserLevel= [{fieldIdValue:'',fieldNameValue: ''}, 
                      {fieldIdValue:'MD',fieldNameValue: 'ผู้บริหารระดับสูง'}, 
                      {fieldIdValue:'M',fieldNameValue: 'ผู้บริหาร'},
                      {fieldIdValue:'S',fieldNameValue: 'หัวหน้าหน่วยงาน'},
                      {fieldIdValue:'U',fieldNameValue: 'เจ้าหน้าที่'},
                      {fieldIdValue:'SU',fieldNameValue: 'เจ้าหน้าที่พิเศษ'},
                      {fieldIdValue:'A',fieldNameValue: 'ผู้ดูแลระบบ'}];   
  }

  setDefForm(){
    this.result.user_flag = 'o'; //ใช้งาน
    this.result.valid_flag = 'Y'; //ใช้งาน
    this.result.user_level = 'U';//set default เจ้าหน้าที่
    this.result.receipt_flag = 0;
    this.result.sc_flag = 0;
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
    //console.log('ele : ' , ele);
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
      this.checklist[i].edit9991 = this.masterSelected;
      }
  }

  isAllSelected() {
    this.masterSelected = this.checklist.every(function(item:any) {
        return item.edit9991 == true;
    })
  }

  uncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit9991 = false;
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
        }
      }).promise().done(function () {
        $("body").find("input[name='delValue']").val(del);
       })
    }, 100);

  }

  receiveFuncListData(event:any){
    //console.log(event)
    this.result.user_id=event.fieldIdValue;
    this.result.off_name=event.fieldNameValue;
    this.closebutton.nativeElement.click();
  }

  receiveJudgeListData(event:any){
    this.result.user_id=event.judge_id;
    this.result.off_name=event.judge_name;
    this.closebutton.nativeElement.click();
  }

  loadMyModalComponent(){
    this.loadComponent = false;
    this.loadModalComponent = true;
    this.loadModalJudgeComponent = false;
    $("#exampleModal").find(".modal-body").css("height","100px");
  }

  submitForm() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!this.result.user_flag){
      confirmBox.setMessage('กรุณาระบุประเภทผู้ใช้งาน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          // this.setFocus('startDate');
        }
        subscription.unsubscribe();
      });

    }else if(!this.result.user_id){
      confirmBox.setMessage('กรุณาระบุผู้ใช้งานระบบ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          this.user_id.nativeElement.focus();
        }
        subscription.unsubscribe();
      });
    }else if(!this.result.user_login){
      confirmBox.setMessage('กรุณาระบุชื่อเข้าใช้งาน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          this.user_login.nativeElement.focus();
        }
        subscription.unsubscribe();
      });
    }else if(typeof this.result.valid_flag =='undefined'){
      // console.log("this.result.valid_flag=>", this.result.valid_flag);
      confirmBox.setMessage('กรุณาระบุใช้งาน');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          // this.setFocus('startDate');
        }
        subscription.unsubscribe();
      });
    }else if(typeof this.result.receipt_flag =='undefined'){
      confirmBox.setMessage('กรุณาระบุสิทธิ์ในการลบใบเสร็จ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          // this.setFocus('startDate');
        }
        subscription.unsubscribe();
      });
    }else if(typeof this.result.sc_flag =='undefined'){
      confirmBox.setMessage('กรุณาระบุสิทธิ์ในการบันทึกผลหมายค้น/หมายจับ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          // this.setFocus('startDate');
        }
        subscription.unsubscribe();
      });
    }else{

      var student = JSON.stringify({
        "user_running": this.result.user_running,
        "user_flag": this.result.user_flag,
        "user_id": this.result.user_id,
        "user_login": this.result.user_login,
        "reset_pwd": this.result.reset_pwd,
        "valid_flag": this.result.valid_flag,
        "user_level": this.result.user_level,
        "receipt_flag": this.result.receipt_flag,
        "sc_flag": this.result.sc_flag,
        "ed_flag": this.result.ed_flag,
        "no_edit_flag": this.result.no_edit_flag,
        "userToken" : this.userData.userToken
      });
      // console.log("SAVE student=>", student);
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct9991/saveData', student ).subscribe(
          (response) =>{
            let alertMessage : any = JSON.parse(JSON.stringify(response));
            //console.log("alertMessage save", alertMessage);
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
                }
                subscription.unsubscribe();
              });
              this.ngOnInit();

            }
          },
          (error) => {this.SpinnerService.hide();}
        )
    }
  }


  editData(index:any){
    // console.log("editData", this.posts[index])
    this.result.user_running  = this.posts[index]['user_running'];
    this.result.user_flag  = this.posts[index]['user_flag'];
    this.result.user_id  = this.posts[index]['user_id'];
    this.result.off_name  = this.posts[index]['off_name'];
    this.result.user_login  = this.posts[index]['user_login'];
    this.result.reset_pwd = this.posts[index]['reset_pwd'];
    this.result.valid_flag = this.posts[index]['valid_flag'];
    this.result.user_level = this.posts[index]['user_level'];
    this.result.receipt_flag = this.posts[index]['receipt_flag'];
    this.result.sc_flag = this.posts[index]['sc_flag'];
    this.result.ed_flag = this.posts[index]['ed_flag'];
    this.result.no_edit_flag = this.posts[index]['no_edit_flag'];

    $("body").find(".user_id").attr("readonly","readonly");
    $("body").find(".off_name").attr("readonly","readonly");
    $("body").find(".iDep").css("display","none");
  

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

      var student = JSON.stringify({
        "user_flag": this.result.user_flag,
        "user_id": this.result.user_id,
        "user_login": this.result.user_login,
        "valid_flag": this.result.valid_flag,
        "user_level": this.result.user_level,
        "receipt_flag": this.result.receipt_flag ? this.result.receipt_flag : 0,
        "sc_flag": this.result.sc_flag ? this.result.sc_flag : 0,
        "ed_flag": this.result.ed_flag ? 1 : 0,
        "no_edit_flag": this.result.no_edit_flag ? 1 : 0,
        "userToken" : this.userData.userToken
      });
      //console.log(student)
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct9991/search', student ).subscribe(
        posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          this.posts = productsJson.data;
          //console.log(productsJson)
          if(productsJson.result==1){
            this.checklist = this.posts;
            this.checklist2 = this.posts;
              if(productsJson.length)
                this.posts.forEach((x : any ) => x.edit9991 = false);
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
      return item.edit9991 == false;
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
                    if(ele.edit9991 == true){
                      dataTmp.push(this.posts[index]);
                    }
                });
            });
            if(bar){
              dataDel['userToken'] = this.userData.userToken;
              dataDel['data'] = dataTmp;
              var data = $.extend({}, dataDel);
              //console.log(data)
              this.http.post('/'+this.userData.appName+'ApiCT/API/fct9991/deleteSelect', data ).subscribe(
              (response) =>{
                let alertMessage : any = JSON.parse(JSON.stringify(response));
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
    }
  }


  printReport(){
    var rptName = 'rct9991';

    // For no parameter : paramData ='{}'
    var paramData ='{}';

    // For set parameter to report
    var paramData = JSON.stringify({
      "puser_flag" : this.result.user_flag
      // "pendnotice_desc" : this.prov_id.nativeElement["endnotice_desc"].value
    });
    // console.log(paramData);
    this.printReportService.printReport(rptName,paramData);
  }

  loadTableComponent(val:any){
      
      if(this.result.user_flag=='o'){
        this.loadComponent = true;
        this.loadModalComponent = false;
        this.loadModalJudgeComponent = false;
        var student = JSON.stringify({
          "table_name" : "pofficer",
          "field_id" : "off_id",
          "field_name" : "off_name",
          "userToken" : this.userData.userToken
        });
        this.listTable='pofficer';
        this.listFieldId='off_id';
        this.listFieldName='off_name';

        this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student ).subscribe(
        (response) =>{
          this.list = response;
        },
        (error) => {})
      }else{
        this.loadComponent = false;
        this.loadModalComponent = false;
        this.loadModalJudgeComponent = true;
        var student = JSON.stringify({
          "cond":2,
          "userToken" : this.userData.userToken});
        this.listTable='pjudge';
        this.listFieldId='judge_id';
        this.listFieldName='judge_name';
        this.listFieldNull='';
        this.listFieldType=JSON.stringify({"type":2});
      
      console.log(student)
      let headers = new HttpHeaders();
       headers = headers.set('Content-Type','application/json');
       
       this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupJudge', student , {headers:headers}).subscribe(
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
      }
      $("#exampleModal").find(".modal-body").css("height","auto");
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
        "userToken" : this.userData.userToken
      });
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct9991', student).subscribe(
        posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          //console.log(productsJson)
          this.posts = productsJson.data;
          //console.log(this.posts);
          if(productsJson.result==1){
            this.checklist = this.posts;
            // this.checklist2 = this.posts;
            if(productsJson.data.length)
              this.posts.forEach((x : any ) => x.edit9991 = false);
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
  }


  checkLevel(event:any){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    confirmBox.setMessage("คุณเลือกระดับการใช้งานนอกเหนือจากเจ้าหน้าที่");
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

  tabChangeSelect(event:any){
    var student = JSON.stringify({
      "table_name" : "pofficer",
      "field_id" : "off_id",
      "field_name" : "off_name",
      "condition": "AND off_id='"+event.target.value+"'",
      "userToken" : this.userData.userToken
    });

    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        //this.getUserId = getDataOptions;
        if(getDataOptions.length){
          this.result.user_id = getDataOptions[0].fieldIdValue;
          this.result.off_name = getDataOptions[0].fieldNameValue;
        }else{
          this.result.user_id = "";
          this.result.off_name = "";
        } 
      },
      (error) => {}
    )
  }


}
