import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Renderer2   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgSelectComponent } from '@ng-select/ng-select';
import { catchError, map , } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { PrintReportService } from 'src/app/services/print-report.service';

@Component({
  selector: 'app-fct0213,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fct0213.component.html',
  styleUrls: ['./fct0213.component.css']
})


export class Fct0213Component implements AfterViewInit, OnInit, OnDestroy {

  title = 'datatables';
  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;
  posts:any;
  result:any=[];
  search:any;
  masterSelected:boolean;
  checklist:any;
  checkedList:any;
  delValue:any;
  sessData:any;
  userData:any;
  getCaseType:any;
  getCaseCate:any;
  programName:string;
  selectedData:number;
  getTitleFlag:any;
  getRedTitle:any;
  hid_title_id:any;
  getSpecialCase:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  @ViewChild('pers_title_no',{static: true}) pers_title_no : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild('myselect') myselect : NgSelectComponent;
  public loadModalComponent: boolean = false;

  constructor(
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private printReportService: PrintReportService,
    private renderer: Renderer2
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

      this.SpinnerService.show();
      this.http.get('/'+this.userData.appName+'ApiCT/API/fct0213?userToken='+this.userData.userToken+':angular').subscribe(posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          console.log("productsJson =>" , productsJson.data)
          this.posts = productsJson.data;
          if(productsJson.result==1){
            this.checklist = this.posts;
            if(productsJson.data.length)
              this.posts.forEach((x : any ) => x.editTitleId = false);
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
        "url_name" : "fct0213"
      });
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen , {headers:headers}).subscribe(
        (response) =>{
          let getDataAuthen : any = JSON.parse(JSON.stringify(response));
          this.programName = getDataAuthen.programName;
          console.log(getDataAuthen)
        },
        (error) => {}
      )

      var student = JSON.stringify({
        "table_name" : "std_ptitle",
        "field_id" : "std_id",
        "field_name" : "std_title_code",
        "field_name2" : "std_title_name",
        "search_id" : "","search_desc" : "",
        "userToken" : this.userData.userToken
      });
    this.listTable='std_ptitle';
    this.listFieldId='std_id';
    this.listFieldName='std_title_code';
    this.listFieldName2='std_title_name';
    this.listFieldNull='';
  //console.log(student)

   this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupStd', student , {headers:headers}).subscribe(
       (response) =>{
         this.list = response;
         console.log(response,'xxxxxxxxxxxx')
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
        this.changeCaseCate(this.userData.defaultCaseType,0);
        setTimeout(() =>{
          if(this.getCaseCate.length > 0)
          this.result.case_cate_id = this.getCaseCate[0].fieldIdValue;
        },500);
      },
      (error) => {}
    )

      this.getTitleFlag = [{id:1,text: 'เลขคดีดำ'},{id:2,text: 'เลขคดีแดง'}];
      this.getSpecialCase = [{id:'0',text: ''},{id:'1',text: 'ผัดฟ้อง'},{id:'2',text: 'ฝากขัง'},{id:'3',text: 'หมายค้น'},{id:'4',text: 'หมายจับ'},{id:'5',text: 'คำร้องก่อนคดี'},{id:'6',text: 'ฟื้นฟู'}];
      this.result.title_flag = 1;
      this.result.case_yes_no = '1';
      // this.result.case_cate_id = 16;
  }

  changeCaseCate(caseType:number,type:any){
   this.result.case_cate_id = null;
   this.result.red_title = null;
   var student = JSON.stringify({
     "table_name": "pcase_cate",
     "field_id": "case_cate_id",
     "field_name": "case_cate_name",
     "field_name2": "no_edit_flag",
     "condition": " AND case_type="+caseType,
     "order_by":" case_cate_id ASC",
     "userToken" : this.userData.userToken
   });
   var student2 = JSON.stringify({
    "table_name": "ptitle",
    "field_id": "title_id",
    "field_name": "title",
    "condition": "AND title_flag='2' AND case_type='"+caseType+"'",
    "order_by": " order_id ASC",
    "userToken" : this.userData.userToken
  });

   //console.log("fCaseTypeStat :"+student)
   let promise = new Promise((resolve, reject) => {
   this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
     (response) =>{
       let getDataOptions : any = JSON.parse(JSON.stringify(response));
       this.getCaseCate = getDataOptions;

       if(type>0)
         this.result.case_cate_id = type;
       //this.fDefCaseStat(caseType,title);
     },
     (error) => {}
   )
     console.log(student2)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student2 ).subscribe(
      (response) =>{
       let getDataOptions : any = JSON.parse(JSON.stringify(response));
       this.getRedTitle = getDataOptions;
       console.log(this.getRedTitle)
      },
       (error) => {}
   )
   });
   return promise;
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
    const ele = this.pers_title_no.nativeElement[name];
    if (ele) {
      ele.focus();
    }
  }

  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].editTitleId = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  isAllSelected() {
    this.masterSelected = this.checklist.every(function(item:any) {
        return item.editTitleId == true;
      })
    this.getCheckedItemList();
  }

  uncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].editTitleId = false;
    }
    this.masterSelected = false;
    $("body").find("input[name='delValue']").val('');
    this.myselect.clearModel();
  }

  ClearAll(){
    window.location.reload();
  }

  getCheckedItemList(){
    var del = "";
    setTimeout(() => {
      $("body").find("table.myTable1 tbody input[type='checkbox']").each(function(e,i){
        if($(this).prop("checked")==true){
          if(del!='')
            del+=','
          del+=$(this).val();
        }
      }).promise().done(function () {
        $("body").find("input[name='delValue']").val(del);
      })
    }, 100);
  }



  loadMyModalComponent(){
    this.loadComponent = false;
    this.loadModalComponent = true;
    $("#exampleModal").find(".modal-body").css("height","100px");
  }


  submitForm() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!this.result.title_id){
      confirmBox.setMessage('กรุณาระบุรหัส');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          //this.SpinnerService.hide();
          $("input[name='title_id']")[0].focus();
        }
        subscription.unsubscribe();
      });

    }else if(!this.result.title){
      confirmBox.setMessage('กรุณาระบุคำนำหน้าเลขคดี');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          //this.SpinnerService.hide();
          $("input[name='title']")[0].focus();
        }
        subscription.unsubscribe();
      });
    }else{


      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      // if(this.pers_title_no.nativeElement["default_value"].checked==true){
      //   var inputChk = 1;
      // }else{
      //   var inputChk = 0;
      // }
      var val = this.getRedTitle.filter((x:any) => x.fieldNameValue === this.result.red_title) ;
      if(this.result.red_title){
        if(val.length)
          this.result.red_title_id = val[0].fieldIdValue;
        //this.result.red_title_id = this.getRedTitle.find((x:any) => x.fieldNameValue === this.result.red_title).fieldIdValue;
      }else{
        this.result.red_title_id = null;
      }
      var student = JSON.stringify({
        "edit_title_id" : this.hid_title_id,
        "title_flag" : this.result.title_flag,
        "order_id" : this.result.order_id,
        "case_type" : this.result.case_type,
        "case_cate_id" : this.result.case_cate_id,
        "title_id" : this.result.title_id,
        "title" : this.result.title,
        "title_eng" : this.result.title_eng,
        "std_id" : this.result.std_id,
        "std_name" : this.result.std_name,
        "red_title" : this.result.red_title,
        "title_barcode" : this.result.title_barcode,
        "imprison_days" : this.result.imprison_days,
        "max_imprison_days" : this.result.max_imprison_days,
        "title_desc" : this.result.title_desc,
        "print_flag" : this.result.print_flag,
        "gen_notice" : this.result.gen_notice,
        "print_guar_flag" : this.result.print_guar_flag,
        "default_value" : this.result.default_value,
        "lit_check_flag" : this.result.lit_check_flag,
        "case_yes_no" : this.result.case_yes_no,
        "special_case" : this.result.special_case,
        "title_group" : this.result.title_group,
        "red_title_id" : this.result.red_title_id,
        "userToken" : this.userData.userToken
      });
      console.log(student)

      this.SpinnerService.show();
      if(this.hid_title_id){
        this.http.post('/'+this.userData.appName+'ApiCT/API/fct0213/updateJson', student , {headers:headers}).subscribe(
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
        this.http.post('/'+this.userData.appName+'ApiCT/API/fct0213/saveJson', student , {headers:headers}).subscribe(
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


  editData(index:any) {
    // this.SpinnerService.show();
    this.hid_title_id  = this.posts[index]['edit_title_id'];
    this.result.title_flag  = this.posts[index]['title_flag'];
    this.result.order_id = this.posts[index]['order_id'];
    this.result.case_type  = this.posts[index]['case_type'];
    this.result.case_cate_id = this.posts[index]['case_cate_id'];
    this.result.title_id = this.posts[index]['title_id'];
    this.result.title = this.posts[index]['title'];
    this.result.title_eng = this.posts[index]['title_eng'];
    this.result.std_id  = this.posts[index]['std_id'];
    this.result.std_name  = this.posts[index]['std_name'];
    this.result.title_barcode  = this.posts[index]['title_barcode'];
    this.result.imprison_days  = this.posts[index]['imprison_days'];
    this.result.max_imprison_days  = this.posts[index]['max_imprison_days'];
    this.result.title_desc  = this.posts[index]['title_desc'];
    this.result.print_flag  = this.posts[index]['print_flag'];
    this.result.print_guar_flag  = this.posts[index]['print_guar_flag'];
    this.result.gen_notice  = this.posts[index]['gen_notice'];
    this.result.max_imprison_days  = this.posts[index]['max_imprison_days'];
    this.result.default_value  = this.posts[index]['default_value'];
    this.result.lit_check_flag  = this.posts[index]['lit_check_flag'];
    this.result.case_yes_no  = this.posts[index]['case_yes_no'].toString();
    this.result.special_case  = this.posts[index]['special_case'];
    this.result.title_group  = this.posts[index]['title_group'];
    if(this.result.std_id){
      this.result.std_full_name = this.list.find((x:any) => x.fieldIdValue === this.posts[index]['std_id']).fieldNameValue2;
    }else{
      this.result.std_id = '';
      this.result.std_full_name = '';
    }
    this.changeCaseCate(this.result.case_type,0);
    setTimeout(() => {
      // this.SpinnerService.hide();
      this.result.title_id  = this.posts[index]['title_id'];
      this.result.case_cate_id = this.posts[index]['case_cate_id'];
      this.result.red_title = this.posts[index]['red_title'];
      //this.result.red_title_id = this.getRedTitle.find((x:any) => x.fieldNameValue === this.result.red_title).fieldIdValue;
      this.result.red_title_id = this.posts[index].red_title_id;
      // $("ng-select[name='red_title']").css('color','red');
    }, 500);
    console.log(this.result)
  }


  searchData() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

      this.SpinnerService.show();
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      var student = JSON.stringify({       
        "title_flag" : this.result.title_flag ? this.result.title_flag : 0,
        "order_id" : this.result.order_id ? this.result.order_id : 0,
        "case_type" : this.result.case_type ? this.result.case_type : 0,
        "case_cate_id" : this.result.case_cate_id ? this.result.case_cate_id : 0,
        "title_id" : this.result.title_id ? this.result.title_id : 0,
        "title" : this.result.title,
        "title_eng" : this.result.title_eng,
        "std_id" : this.result.std_id ? this.result.std_id : 0,
        "title_barcode" : this.result.title_barcode,
        // "imprison_days" : this.result.imprison_days,
        // "max_imprison_days" : this.result.max_imprison_days,
        "title_desc" : this.result.title_desc,
        // "print_flag" : this.result.print_flag,
        // "gen_notice" : this.result.gen_notice,
        // "print_guar_flag" : this.result.print_guar_flag,
        // "default_value" : this.result.default_value,
        // "case_yes_no" : this.result.case_yes_no,
        // "special_case" : this.result.special_case,
        // "title_group" : this.result.title_group,
        "red_title_id" : this.result.red_title_id,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct0213/search', student , {headers:headers}).subscribe(
        posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          this.posts = productsJson.data;
          console.log(productsJson)
          if(productsJson.result==1){
            this.checklist = this.posts;
              if(productsJson.length)
                this.posts.forEach((x : any ) => x.editTitleId = false);
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
    this.delValue = $("body").find("input[name='delValue']").val();
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
    console.log(event)
        this.result.std_id = event.fieldIdValue;
        this.result.std_full_name = event.fieldNameValue2;
        this.closebutton.nativeElement.click();
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
                    if(ele.edit0213 == true){
                      dataTmp.push(this.posts[index]);
                    }
                });
            });
            if(bar){
              console.log(dataTmp)
              let headers = new HttpHeaders();
              headers = headers.set('Content-Type','application/json');
              dataDel['log_remark'] = chkForm.log_remark;
              dataDel['userToken'] = this.userData.userToken;
              dataDel['data'] = dataTmp;
              var data = $.extend({}, dataDel);
              // console.log("data=>", data);
              this.http.post('/'+this.userData.appName+'ApiCT/API/fct0213/deleteSelect', data ).subscribe((response) =>{
                let alertMessage : any = JSON.parse(JSON.stringify(response));
                // console.log("alertMessage=>", alertMessage.result)
                if(alertMessage.result==0){
                  this.SpinnerService.hide();
                }else{
                  this.closebutton.nativeElement.click();
                  $("button[type='reset']")[0].click();
                  // this.ngOnInit();
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
    var rptName = 'rct0213';

    // For no parameter : paramData ='{}'
    var paramData ='{}';

    // For set parameter to report
    // var paramData = JSON.stringify({
    //   "ppers_title_no" : this.pers_title_no.nativeElement["pers_title_no"].value,
    //   "ppers_title" : this.pers_title_no.nativeElement["pers_title"].value
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
    this.renderer.setProperty(this.pers_title_no.nativeElement['std_full_name'],'value', this.list.find((x:any) => x.fieldIdValue === parseInt(obj.target.value)).fieldNameValue2);
  }else{
    this.pers_title_no.nativeElement['std_id'].value="";
    this.pers_title_no.nativeElement['std_full_name'].value="";
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

}







