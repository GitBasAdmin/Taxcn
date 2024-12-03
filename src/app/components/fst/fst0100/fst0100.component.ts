import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable   } from '@angular/core';
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
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-fst0100,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fst0100.component.html',
  styleUrls: ['./fst0100.component.css']
})


export class Fst0100Component implements AfterViewInit, OnInit, OnDestroy {
  form: FormGroup;
  title = 'datatables';

  posts:any;
  search:any;
  masterSelected:boolean;
  checklist:any;
  checkedList:any;
  delValue:any;
  sessData:any;
  userData:any;
  programName:string;
  selCaseType:any='แพ่ง';
  selCaseTypeStat:any='แพ่ง';
  selTitleStat:any='ภษ';
  //-----------------
  result:any = [];
  getCaseType:any;
  case_type:any;
  getCaseTypeStat:any;
  case_type_stat:any;
  case_title:any;
  getTitle:any;
  con_flag:any;
  getConFlag:any;
 
  edit_case_type:any;
  edit_case_type_stat:any;
  edit_case_title:any;
  edit_title_type:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  @ViewChild('fst0100',{static: true}) fst0100 : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild('sCaseCate') sCaseCate : NgSelectComponent;
  @ViewChild('sTitle') sTitle : NgSelectComponent;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService
  ){
    this.masterSelected = false
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

      //this.SpinnerService.show();
      this.http.get('/'+this.userData.appName+'ApiST/API/STAT/fst0100?userToken='+this.userData.userToken+':angular').subscribe(posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          // console.log("productsJson=>", productsJson.data);
          this.posts = productsJson.data;
          if(productsJson.result==1){
            this.checklist = this.posts;
            if(productsJson.data.length)
              this.posts.forEach((x : any ) => x.edit0100 = false);
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
        "url_name" : "fst0100"
      });
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen , {headers:headers}).subscribe(
        (response) =>{
          let getDataAuthen : any = JSON.parse(JSON.stringify(response));
          this.programName = getDataAuthen.programName;
          // console.log(getDataAuthen)
        },
        (error) => {}
      )

      //======================== getCaseCateId ======================================
      var Json = JSON.stringify({
        "table_name" : "pcase_type",
        "field_id" : "case_type",
        "field_name" : "case_type_desc",
        "userToken" : this.userData.userToken
      });
        // console.log(Json);
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', Json , {headers:headers}).subscribe(
        (response) =>{
          // console.log('getCaseType=>',response);
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getCaseType = getDataOptions;

          this.result.case_type = this.getCaseType.find((x:any) => x.fieldIdValue === parseInt(this.userData.defaultCaseType)).fieldIdValue;
          this.changeCaseType(this.result.case_type, 2);
        },
        (error) => {}
      )
      
      //ประเภท con_flag
      this.getConFlag = [{fieldIdValue:'',fieldNameValue: ''}, 
                          {fieldIdValue:1,fieldNameValue: 'คดีไกล่เกลี่ย'}, 
                          {fieldIdValue:2,fieldNameValue: 'คดีประเด็น'},
                          {fieldIdValue:3,fieldNameValue: 'คดีชันสูตร'},
                          {fieldIdValue:4,fieldNameValue: 'คดีละเมิดศาล'}];
      }

  ngAfterContentInit() : void{
    
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

  setFocus(name:any) {
    const ele = this.fst0100.nativeElement[name];
    if (ele) {
      ele.focus();
    }
  }

  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit0100 = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  isAllSelected() {
    this.masterSelected = this.checklist.every(function(item:any) {
        return item.edit0100 == true;
      })
    this.getCheckedItemList();
  }

  uncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit0100 = this.masterSelected;
    }

    this.masterSelected = false;
    $("body").find("input[name='delValue']").val('');
  }

  getCheckedItemList(){
    this.delValue = "";
    for (var i = 0; i < this.checklist.length; i++) {
      if(this.checklist[i].edit0100){
        if(this.delValue!='')
          this.delValue+=','
        this.delValue+=this.checklist[i].edit0100;
      }
    }
  }

  ClearAll(){
    window.location.reload();
  }

  //save update
  submitForm() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!this.result.case_type){
      confirmBox.setMessage('กรุณาระบุประเภทความ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          // this.setFocus('prov_id');
        }
        subscription.unsubscribe();
      });

    }else if(!this.result.case_type_stat){
      confirmBox.setMessage('กรุณาระบุประเภทความ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          // this.setFocus('off_id');
        }
        subscription.unsubscribe();
      });
    }else if(!this.result.case_title){
      confirmBox.setMessage('กรุณาระบุอักษรคำนำหน้าคดีดำ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          // this.setFocus('off_id');
        }
        subscription.unsubscribe();
      });
    }else{
      this.SpinnerService.show();

      if(this.result.con_flag == null || this.result.con_flag == ""){
        this.result.con_flag = 0;
      }

      var student = JSON.stringify({
        "edit_case_type" : this.edit_case_type,
        "edit_case_type_stat" : this.edit_case_type_stat,
        "edit_case_title" : this.edit_case_title,
        "edit_title_type" : this.edit_title_type,

        "case_type" : this.result.case_type,
        "case_type_stat" : this.result.case_type_stat,
        "case_title" : this.result.case_title,
        "con_flag" : this.result.con_flag,
        "title_type" : "B",
        "userToken" : this.userData.userToken
        });
      // console.log("student=>", student);
      //Update
      if(this.edit_case_type && this.edit_case_type_stat && this.edit_case_title&&this.edit_title_type){
        // console.log("update=>");
        this.http.post('/'+this.userData.appName+'ApiST/API/STAT/fst0100/updateJson', student ).subscribe(
          (response) =>{
            let alertMessage : any = JSON.parse(JSON.stringify(response));
            // console.log("alertMessage.result=>", alertMessage.result);
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
                  }
                  subscription.unsubscribe();
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
                    $("button[type='reset']")[0].click();
                  }
                  subscription.unsubscribe();
                });
                this.ngOnInit();
              }
          },
          (error) => {this.SpinnerService.hide();}
        )

      }else{
        //Insert
        // console.log("save=>");
        this.http.post('/'+this.userData.appName+'ApiST/API/STAT/fst0100/saveJson', student ).subscribe(
          (response) =>{
            let alertMessage : any = JSON.parse(JSON.stringify(response));
            // console.log("alertMessage.result=>", alertMessage.result);
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
                  }
                  subscription.unsubscribe();
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
  }

  editData(index:any) {

    // console.log("this.posts[index]['case_type_stat']=>",this.posts[index]['case_type_stat']);
    this.SpinnerService.show();
    this.edit_case_type  = this.posts[index]['edit_case_type'];
    this.edit_case_type_stat  = this.posts[index]['edit_case_type_stat'];
    this.edit_case_title  = this.posts[index]['edit_case_title'];
    this.edit_title_type  = this.posts[index]['edit_title_type'];
    
    this.result.case_type  = this.posts[index]['case_type'];
    this.result.case_type_stat  = this.posts[index]['case_type_stat'];
    this.result.case_title = this.posts[index]['case_title'];
    this.result.con_flag = this.posts[index]['con_flag'];

    if((this.posts[index]['con_flag']) == 0 || (this.posts[index]['con_flag'] == null)){
      this.result.con_flag = '';
    }else{
      this.result.con_flag = this.posts[index]['con_flag'];
    }

    this.changeCaseType(this.result.case_type, "");

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
        "case_type" : this.fst0100.nativeElement["case_type"].value,
        "case_type_stat" : this.fst0100.nativeElement["case_type_stat"].value,
        "case_title" : this.fst0100.nativeElement["case_title"].value,
        "userToken" : this.userData.userToken
      });
      // console.log(student)
      this.http.post('/'+this.userData.appName+'ApiST/API/STAT/fst0100/search', student , {headers:headers}).subscribe(
        posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          this.posts = productsJson.data;
          // console.log(productsJson)
          if(productsJson.result==1){
            this.checklist = this.posts;
              if(productsJson.length)
                this.posts.forEach((x : any ) => x.edit_edit0100 = false);
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
    const confirmBox = new ConfirmBoxInitializer();
    if(!this.delValue){
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

  receiveFuncListData(event:any){
    // console.log(event)
  }

  loadMyChildComponent(){
    this.loadComponent = true;
  }

  //Delete
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
      this.http.post('/'+this.userData.appName+'Api/API/checkPassword', student).subscribe(
      posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          // console.log(productsJson)
          if(productsJson.result==1){
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
                          if(ele.edit0100 == true){
                            dataTmp.push(this.posts[index]);
                          }
                      });
                  });
                  if(bar){
                    let headers = new HttpHeaders();
                    headers = headers.set('Content-Type','application/json');
                    dataDel['userToken'] = this.userData.userToken;
                    dataDel['data'] = dataTmp;
                    var data = $.extend({}, dataDel);
                    // console.log("data=>", data);
                    this.http.post('/'+this.userData.appName+'ApiST/API/STAT/fst0100/deleteSelect', data ).subscribe((response) =>{
                      let alertMessage : any = JSON.parse(JSON.stringify(response));
                      // console.log("alertMessage=>", alertMessage.result)
                      if(alertMessage.result==0){
                        this.SpinnerService.hide();
                      }else{
                        this.closebutton.nativeElement.click();
                        $("button[type='reset']")[0].click();
                        this.ngOnInit();
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

  printReport () {

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


  changeCaseType(case_type:any,type:any){

    if(typeof case_type!='undefined' ){
      //ประเภทความสถิติ
      var student = JSON.stringify({
        "table_name" : "pcase_type_stat",
        "field_id" : "case_type_stat",
        "field_name" : "case_type_stat_desc",
        "condition": " AND case_type = "+case_type+" ",
        "userToken" : this.userData.userToken
      });
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getCaseTypeStat = getDataOptions;
          setTimeout(() => {
            if(this.edit_case_type_stat &&! this.result.case_type_stat && type==""){              
              this.result.case_type_stat = this.edit_case_type_stat;
            }else if(type == 2){
              // this.result.case_type_stat = this.userData.defaultCaseType;
              if(this.getCaseTypeStat.length)
                this.result.case_type_stat = this.getCaseTypeStat[0].fieldIdValue;
            }
          }, 100);
        },
        (error) => {}
      )

      //อักษรนำหน้าคดีดำ
      var student = JSON.stringify({
        "table_name": "ptitle",
        "field_id": "title",
        "field_name": "title",
        "condition": "AND title_flag='1' AND case_type='"+case_type+"'",
        "order_by": " order_id ASC",
        "userToken" : this.userData.userToken
      });

      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getTitle = getDataOptions;
          setTimeout(() => {
            if(this.edit_case_title &&! this.result.case_title && type==""){
              this.result.case_title = this.edit_case_title;
            }else if(type == 2){
              this.result.case_title = this.userData.defaultTitle;
            }
          }, 100);
        },
        (error) => {}
      )
    }

    if(typeof case_type =='undefined' || type==1){
      this.sCaseCate.clearModel();
      this.sTitle.clearModel();
    }
  }

}