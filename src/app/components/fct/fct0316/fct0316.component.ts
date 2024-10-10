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
import { PrintReportService } from 'src/app/services/print-report.service';

@Component({
  selector: 'app-fct0316,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fct0316.component.html',
  styleUrls: ['./fct0316.component.css']
})


export class Fct0316Component implements AfterViewInit, OnInit, OnDestroy {
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
  getCaseCate:any;
  getCaseCateGroup:any;
  case_type_stat:any;
  title_id:any;
  getTitle:any;
  con_flag:any;
  getConFlag:any;

  edit_case_type:any;
  edit_case_cate_group:any;
  edit_case_cate_id:any;


  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  @ViewChild('fct0316',{static: true}) fct0316 : ElementRef;
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
    private authService: AuthService,
    private printReportService: PrintReportService,
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
      this.http.get('/'+this.userData.appName+'ApiCT/API/fct0316?userToken='+this.userData.userToken+':angular').subscribe(posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          console.log("productsJson=>", productsJson.data);
          this.posts = productsJson.data;
          if(productsJson.result==1){
            this.checklist = this.posts;
            if(productsJson.data.length)
              this.posts.forEach((x : any ) => x.edit0316 = false);
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
        "url_name" : "fct0316"
      });
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen ).subscribe(
        (response) =>{
          let getDataAuthen : any = JSON.parse(JSON.stringify(response));
          this.programName = getDataAuthen.programName;
          // console.log(getDataAuthen)
        },
        (error) => {}
      )

      //======================== getCaseType ======================================
      var Json = JSON.stringify({
        "table_name" : "pcase_type",
        "field_id" : "case_type",
        "field_name" : "case_type_desc",
        "userToken" : this.userData.userToken
      });
        // console.log(Json);
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', Json ).subscribe(
        (response) =>{
          // console.log('getCaseType=>'+response);
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getCaseType = getDataOptions;
          this.result.case_type = this.userData.defaultCaseType;
          this.changeCaseType(this.userData.defaultCaseType,0);
         // this.result.case_cate_group = this.getCaseCateGroup[0].fieldIdValue.toString();
          // this.result.case_cate_group = 11;
          // this.result.case_cate_id = 2;
        },
        (error) => {}
      )
  }

  changeCaseType(caseType:number,type:any){
      var student = JSON.stringify({
      "table_name": "pcase_cate_group",
      "field_id": "case_cate_group",
      "field_name": "case_cate_group_name",
      "field_name2": "case_type_stat",
      "condition": " AND case_type="+caseType,
      "order_by":" case_cate_group ASC",
      "userToken" : this.userData.userToken
    });
    var student2 = JSON.stringify({
      "table_name": "pcase_cate",
      "field_id": "case_cate_id",
      "field_name": "case_cate_name",
      "field_name2": "case_type",
      "condition": " AND case_type="+caseType,
      "order_by":" case_cate_id ASC",
      "userToken" : this.userData.userToken
    });

    let promise = new Promise((resolve, reject) => {
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseCateGroup = getDataOptions;
        this.result.case_cate_group = getDataOptions.length >0 ? this.getCaseCateGroup[0].fieldIdValue : '';
        console.log(this.getCaseCateGroup);
        console.log(this.getCaseCateGroup[0].fieldIdValue);
    },
      (error) => {}
    )

    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student2).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseCate = getDataOptions;
        this.result.case_cate_id = getDataOptions.length >0 ? this.getCaseCate[0].fieldIdValue : '';

        console.log(this.getCaseCate);
     },
      (error) => {}
    )

    });
    return promise;
  }


  ngAfterContentInit() : void{
    // this.result.con_flag = this.getConFlag.find((x:any) => x.fieldIdValue === 1).fieldIdValue;
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
    const ele = this.fct0316.nativeElement[name];
    if (ele) {
      ele.focus();
    }
  }

  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit0316 = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  isAllSelected() {
    this.masterSelected = this.checklist.every(function(item:any) {
        return item.edit0316 == true;
      })
    this.getCheckedItemList();
  }

  uncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit0316 = this.masterSelected;
    }

    this.masterSelected = false;
    $("body").find("input[name='delValue']").val('');
  }

  getCheckedItemList(){
    this.delValue = "";
    for (var i = 0; i < this.checklist.length; i++) {
      if(this.checklist[i].edit0316){
        if(this.delValue!='')
          this.delValue+=','
        this.delValue+=this.checklist[i].edit0316;
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
        // if (resp.success==true){
        //   this.setFocus('prov_id');
        // }
        subscription.unsubscribe();
      });

    }else if(!this.result.case_cate_group){
      confirmBox.setMessage('กรุณาระบุประเภทคดีหลัก');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        // if (resp.success==true){
        //   this.setFocus('off_id');
        // }
        subscription.unsubscribe();
      });
    // }else if(!this.result.title_id){
    //   confirmBox.setMessage('กรุณาระบุอักษรคำนำหน้าคดีดำ');
    //   confirmBox.setButtonLabels('ตกลง');
    //   confirmBox.setConfig({
    //       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    //   });
    //   const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
    //     // if (resp.success==true){
    //     //   this.setFocus('off_id');
    //     // }
    //     subscription.unsubscribe();
    //   });
    }else{
      this.SpinnerService.show();

      var student = JSON.stringify({
        "edit_case_type" : this.edit_case_type,
        "edit_case_cate_group" : this.edit_case_cate_group,
        "edit_case_cate_id" : this.edit_case_cate_id,
        "case_type" : this.result.case_type,
        "case_cate_group" : this.result.case_cate_group,
        "case_cate_id" : this.result.case_cate_id,
        "userToken" : this.userData.userToken
        });
      console.log("student=>", student);
      //Update
      if(this.edit_case_type){
        // console.log("update=>");
        this.http.post('/'+this.userData.appName+'ApiCT/API/fct0316/updateJson', student ).subscribe(
          (response) =>{
            let alertMessage : any = JSON.parse(JSON.stringify(response));
            // console.log("alertMessage.result=>", alertMessage.result);
            // console.log("alertMessage.error=>", alertMessage.error);
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
                confirmBox.setMessage('แก้ไขข้อมูลเรียบร้อยแล้ว');
                // confirmBox.setMessage(alertMessage.error);
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
        this.http.post('/'+this.userData.appName+'ApiCT/API/fct0316/saveJson', student ).subscribe(
          (response) =>{
            let alertMessage : any = JSON.parse(JSON.stringify(response));
            // console.log("alertMessage.result=>", alertMessage.result);
            // console.log("alertMessage.error=>", alertMessage.error);
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
                confirmBox.setMessage('จัดเก็บข้อมูลเรียบร้อยแล้ว');
                // confirmBox.setMessage(alertMessage.error);
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
    this.SpinnerService.show();
    this.edit_case_type  = this.posts[index]['edit_case_type'];
    this.edit_case_cate_group  = this.posts[index]['edit_case_cate_group'];
    this.edit_case_cate_id  = this.posts[index]['edit_case_cate_id'];
    this.result.case_type  = this.posts[index]['case_type'];
    this.changeCaseType(this.edit_case_type, '');
    setTimeout(() => {
      this.SpinnerService.hide();
      this.result.case_cate_group  = this.posts[index]['case_cate_group'];
      this.result.case_cate_id = this.posts[index]['case_cate_id'];
    }, 500);
  }


  searchData() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

      this.SpinnerService.show();
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');

      var student = JSON.stringify({
        "case_type" : this.result.case_type,
        "case_cate_group" : this.result.case_cate_group,
        "case_cate_id" : this.result.case_cate_id,
        "userToken" : this.userData.userToken
      });
      // console.log(student)
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct0316/search', student , {headers:headers}).subscribe(
        posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          this.posts = productsJson.data;
          // console.log(productsJson)
          if(productsJson.result==1){
            this.checklist = this.posts;
              if(productsJson.length)
                this.posts.forEach((x : any ) => x.edit_edit0316 = false);
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
                    if(ele.edit0316 == true){
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
              // console.log("data=>", data);
              this.http.post('/'+this.userData.appName+'ApiCT/API/fct0316/deleteSelect', data ).subscribe((response) =>{
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
    }
  }

  printReport(){
    var rptName = 'rct0316';

    // For no parameter : paramData ='{}'
    var paramData ='{}';

    // For set parameter to report
    // var paramData = JSON.stringify({
    //   "pprov_id" : this.prov_id.nativeElement["prov_id"].value,
    //   "pendnotice_desc" : this.prov_id.nativeElement["endnotice_desc"].value
    // });

    this.printReportService.printReport(rptName,paramData);
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



}
