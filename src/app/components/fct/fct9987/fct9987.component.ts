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
  selector: 'app-fct9987,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fct9987.component.html',
  styleUrls: ['./fct9987.component.css']
})


export class Fct9987Component implements AfterViewInit, OnInit, OnDestroy {
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
  getECaseType:any;
  getECaseCate:any;
  getESubCaseCate:any;
  case_type:any;
  getCaseTypeStat:any;
  getCaseCate:any;
  getCaseCateGroup:any;
  getTableId:any;
  case_type_stat:any;
  title_id:any;
  getTitle:any;
  con_flag:any;
  getConFlag:any;

  edit_web_type_id:any;


  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  @ViewChild('fct9987',{static: true}) fct9987 : ElementRef;
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
      this.http.get('/'+this.userData.appName+'ApiCT/API/fct9987?userToken='+this.userData.userToken+':angular').subscribe(posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          console.log("productsJson=>", productsJson.data);
          this.posts = productsJson.data;
          if(productsJson.result==1){
            this.checklist = this.posts;
            if(productsJson.data.length)
              this.posts.forEach((x : any ) => x.edit9987 = false);
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
        "url_name" : "fct9987"
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
          // this.result.case_type = this.userData.defaultCaseType;
          // this.changeCaseType(this.userData.defaultCaseType,0);
         // this.result.case_cate_group = this.getCaseCateGroup[0].fieldIdValue.toString();

        },
        (error) => {}
      )


      //======================== getECaseType ======================================
      var Json = JSON.stringify({
        "table_name" : "pefiling_case_type",
        "field_id" : "case_type",
        "field_name" : "case_type_desc",
        "userToken" : this.userData.userToken
      });
        // console.log(Json);
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', Json ).subscribe(
        (response) =>{
          // console.log('getCaseType=>'+response);
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getECaseType = getDataOptions;
          // this.result.case_type = this.userData.defaultCaseType;
          // this.changeCaseType(this.userData.defaultCaseType,0);
         // this.result.case_cate_group = this.getCaseCateGroup[0].fieldIdValue.toString();

        },
        (error) => {}
      )

      //======================== pappoint_table ======================================
    var Json = JSON.stringify({
      "table_name" : "pappoint_table",
      "field_id" : "table_id",
      "field_name" : "table_name",
      "condition"  : "AND table_type = 2",
      "userToken" : this.userData.userToken
    });
      console.log(Json);
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', Json ).subscribe(
      (response) =>{
        // console.log('xxxxxxxxxxx'+response);
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getTableId = getDataOptions;
        // this.getTableId.forEach((x : any ) => x.fieldIdValue = x.fieldIdValue.toString())
      },
      (error) => {}
    )
    this.changeECaseType(1);
  }

  changeCaseType(val:any){
    //========================== ptitle ====================================
    var student = JSON.stringify({
      "table_name": "ptitle",
      "field_id": "title_id",
      "field_name": "title",
      "condition": "AND title_flag='1' AND case_type='"+val+"'",
      "order_by": " order_id ASC",
      "userToken" : this.userData.userToken
    });

    // var student2 = JSON.stringify({
    //   "table_name": "ptitle",
    //   "field_id": "title",
    //   "field_name": "title",
    //   "condition": "AND title_flag='2' AND case_type='"+val+"'",
    //   "order_by": " order_id ASC",
    //   "userToken" : this.userData.userToken
    // });

    var student3 = JSON.stringify({
      "table_name": "pcase_cate",
      "field_id": "case_cate_id",
      "field_name": "case_cate_name",
      "condition": "AND case_type='"+val+"'",
      "order_by": " case_cate_id ASC",
      "userToken" : this.userData.userToken
    });

    //console.log("fCaseTitle")
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    let promise = new Promise((resolve, reject) => {
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          //console.log(getDataOptions)
          this.getTitle = getDataOptions;
          //this.selTitle = this.fca0200Service.defaultTitle;
        },
        (error) => {}
      )

      // this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student2 , {headers:headers}).subscribe(
      //   (response) =>{
      //     let getDataOptions : any = JSON.parse(JSON.stringify(response));
      //     //console.log(getDataOptions)
      //     this.getRedTitle = getDataOptions;
      //   },
      //   (error) => {}
      // )

       this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student3 , {headers:headers}).subscribe(
        (response) =>{
         let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getCaseCate = getDataOptions;
     },
         (error) => {}
       )

     this.result.case_cate_id  = null;
     this.result.title_id = null;

    });
    return promise;
  }

  changeECaseType(val:any){
    //========================== pEfiling_case_type ====================================
    var student = JSON.stringify({
      "table_name": "pefiling_case_cate",
      "field_id": "case_cate_id",
      "field_name": "case_cate_desc",
      "condition": "",
      "order_by": " case_cate_id ASC",
      "userToken" : this.userData.userToken
    });
    var student2 = JSON.stringify({
      "table_name": "pefiling_sub_case_cate",
      "field_id": "sub_case_cate_id",
      "field_name": "CONCAT(sub_case_cate_id || ' ' || sub_case_cate_desc, '') AS fieldNameValue",
      "condition": "",
      "order_by": " sub_case_cate_id ASC",
      "userToken" : this.userData.userToken
    });

    //console.log("fCaseTitle")
    let promise = new Promise((resolve, reject) => {

      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
        (response) =>{
         let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getECaseCate = getDataOptions;
     },
         (error) => {}
       )

      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student2).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          //console.log(getDataOptions)
          this.getESubCaseCate = getDataOptions;
          //this.selTitle = this.fca0200Service.defaultTitle;
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
    const ele = this.fct9987.nativeElement[name];
    if (ele) {
      ele.focus();
    }
  }

  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit9987 = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  isAllSelected() {
    this.masterSelected = this.checklist.every(function(item:any) {
        return item.edit9987 == true;
      })
    this.getCheckedItemList();
  }

  uncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit9987 = this.masterSelected;
    }

    this.masterSelected = false;
    $("body").find("input[name='delValue']").val('');
  }

  getCheckedItemList(){
    this.delValue = "";
    for (var i = 0; i < this.checklist.length; i++) {
      if(this.checklist[i].edit9987){
        if(this.delValue!='')
          this.delValue+=','
        this.delValue+=this.checklist[i].edit9987;
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

    if(!this.result.web_type_id){
      confirmBox.setMessage('กรุณาระบุหัวข้อ(E-filing)');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          $("input[name='web_type_id']")[0].focus();
        }
        subscription.unsubscribe();
      });

    }else if(!this.result.web_type_desc){
      confirmBox.setMessage('กรุณาระบุประเภทหัวข้อ(E-filing)');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          $("input[name='web_type_desc']")[0].focus();
        }
        subscription.unsubscribe();
      });
    }else if(!this.result.title_id || !this.result.case_type || !this.result.case_cate_id || !this.result.table_id
           || !this.result.e_case_type || !this.result.e_case_cate || !this.result.e_sub_case_cate){
      confirmBox.setMessage('กรุณาระบุข้อมูลให้ครบทุกช่อง');
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
    }else{
      this.SpinnerService.show();

      var student = JSON.stringify({
        "edit_web_type_id" : this.edit_web_type_id,
        "web_type_id" : this.result.web_type_id,
        "web_type_desc" : this.result.web_type_desc,
        "e_case_type" : this.result.e_case_type,
        "e_case_cate" : this.result.e_case_cate,
        "e_sub_case_cate" : this.result.e_sub_case_cate,
        "case_type" : this.result.case_type,
        "title_id" : this.result.title_id,
        "case_cate_id" : this.result.case_cate_id,
        "table_id" : this.result.table_id,
        "userToken" : this.userData.userToken
        });
      console.log("student=>", student);
      //Update
      if(this.edit_web_type_id){
        // alert('xxxx')
        // console.log("update=>");
        this.http.post('/'+this.userData.appName+'ApiCT/API/fct9987/updateJson', student ).subscribe(
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
        this.http.post('/'+this.userData.appName+'ApiCT/API/fct9987/saveJson', student ).subscribe(
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

    // this.SpinnerService.show();
    this.edit_web_type_id  = this.posts[index]['edit_web_type_id'];
    this.result.web_type_id  = this.posts[index]['web_type_id'];
    this.result.web_type_desc  = this.posts[index]['web_type_desc'];
    this.result.e_case_type = this.posts[index]['e_case_type'];
    this.result.e_case_cate = this.posts[index]['e_case_cate'];
    this.result.e_sub_case_cate = this.posts[index]['e_sub_case_cate'];
    this.result.case_type  = this.posts[index]['case_type'];
    this.result.table_id  = this.posts[index]['table_id'];
    this.changeCaseType(this.result.case_type);
    setTimeout(() => {
      // this.SpinnerService.hide();
      this.result.title_id  = this.posts[index]['title_id'];
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
        "case_type" : this.fct9987.nativeElement["case_type"].value,
        "case_cate_group" : this.fct9987.nativeElement["case_cate_group"].value,
        "case_cate_id" : this.fct9987.nativeElement["case_cate_id"].value,
        "userToken" : this.userData.userToken
      });
      // console.log(student)
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct9987/search', student , {headers:headers}).subscribe(
        posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          this.posts = productsJson.data;
          // console.log(productsJson)
          if(productsJson.result==1){
            this.checklist = this.posts;
              if(productsJson.length)
                this.posts.forEach((x : any ) => x.edit_edit9987 = false);
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
                    if(ele.edit9987 == true){
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
              this.http.post('/'+this.userData.appName+'ApiCT/API/fct9987/deleteSelect', data ).subscribe((response) =>{
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
    var rptName = 'rct9987';

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
