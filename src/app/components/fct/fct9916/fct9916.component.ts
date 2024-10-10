import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Renderer2,ViewEncapsulation   } from '@angular/core';
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
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { PrintReportService } from 'src/app/services/print-report.service';
import {ExcelService} from '../../../services/excel.service.ts';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-fct9916,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fct9916.component.html',
  styleUrls: ['./fct9916.component.css']
})


export class Fct9916Component implements AfterViewInit, OnInit, OnDestroy {

  title = 'datatables';

  posts:any=[];
  search:any;
  masterSelected:boolean;
  checklist:any;
  checkedList:any;
  delValue:any;
  sessData:any;
  userData:any;
  programName:string;
  result:any = [];
  getProv:any;selProv:any;
  getAmphur:any;selAmphur:any;
  getTambon:any;selTambon:any;
  getPostCode:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  @ViewChild('sProv') sProv : NgSelectComponent;
  @ViewChild('sAmphur') sAmphur : NgSelectComponent;
  @ViewChild('sTambon') sTambon : NgSelectComponent;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;

  constructor(
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private printReportService: PrintReportService,
    private renderer: Renderer2,
    private excelService: ExcelService,
    private ngbModal: NgbModal,
  ){
    this.masterSelected = false
  }

  ngOnInit(): void {

    /* this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 30,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[[2,'asc']],
      dom:'Bfrtip'
    }; */
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 30,
      processing: true,
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[]
    };


    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.successHttp();
    this.loadData();
    //======================== pprovince ======================================
    var student = JSON.stringify({
      "table_name" : "pprovince",
      "field_id" : "prov_id",
      "field_name" : "prov_name",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        //console.log(getDataOptions)
        this.getProv = getDataOptions;
      },
      (error) => {}
    )
  }

  loadData(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    var student = JSON.stringify({
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiCT/API/fct9916',student).subscribe(posts => {
      let productsJson : any = JSON.parse(JSON.stringify(posts));
      console.log(productsJson)
      this.posts = productsJson.data;
      if(productsJson.result==1){
        this.checklist = this.posts;
        if(productsJson.data.length)
          this.posts.forEach((x : any ) => x.running = false);
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

  successHttp() {
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fct9916"
    });
    let promise = new Promise((resolve, reject) => {
      //let apiURL = `${this.apiRoot}?term=${term}&media=music&limit=20`;
      //this.http.get(apiURL)
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen )
        .toPromise()
        .then(
          res => { // Success
          //this.results = res.json().results;
          let getDataAuthen : any = JSON.parse(JSON.stringify(res));
          console.log(getDataAuthen)
          this.programName = getDataAuthen.programName;
            resolve(res);
          },
          msg => { // Error
            reject(msg);
          }
        );
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

  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].editCaseType = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  isAllSelected() {
    this.masterSelected = this.checklist.every(function(item:any) {
        return item.editCaseType == true;
      })
    this.getCheckedItemList();
  }

  uncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].editCaseType = false;
    }
    this.masterSelected = false;
    $("body").find("input[name='delValue']").val('');
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



  submitForm() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    if(!this.result.org_id){
      confirmBox.setMessage('กรุณาระบุรหัสหน่วยงานภายนอก');
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

    }else if(!this.result.org_name){
      confirmBox.setMessage('กรุณาระบุชื่อหน่วยงานภายนอก');
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
      var student = $.extend({},this.result);
      if(this.result.prov_id)
        student.province = this.result.prov_id;
      else
        student.province = '';
      if(this.result.amphur_id)
        student.ampheur = this.result.amphur_id;
      else
        student.ampheur = '';
      if(this.result.tambon_id)
        student.tambon = this.result.tambon_id;
      else
        student.tambon = '';
      student['userToken'] = this.userData.userToken;
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct9916/saveJson', student ).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          if(getDataOptions.result==1){
              //-----------------------------//
              confirmBox.setMessage(getDataOptions.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  //this.result.notice_running = getDataOptions.notice_running;
                  this.result.edit_org_id = this.result.org_id;
                  this.loadData();
                }
                subscription.unsubscribe();
              });
              //-----------------------------//

          }else{
            //-----------------------------//
              confirmBox.setMessage(getDataOptions.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){

                }
                subscription.unsubscribe();
              });
            //-----------------------------//
          }

        },
        (error) => {}
      )
      
    }

  }

  goToLink(url: string){
    window.open(url, "_blank");
  }

  receiveFuncListData(event:any){
    console.log(event)
  }

  loadMyChildComponent(){
    this.loadComponent = true;
  }

  


  printReport(){
    var rptName = 'rct0218';

    // For no parameter : paramData ='{}'
    var paramData ='{}';

    // For set parameter to report
    // var paramData = JSON.stringify({
    //   "pcase_type" : this.case_type.nativeElement["case_type"].value,
    //   "pcase_type_desc" : this.case_type.nativeElement["case_type_desc"].value
    // });

    this.printReportService.printReport(rptName,paramData);
  }



  exportAsXLSX(): void {
    if(this.posts){
      var excel =  JSON.parse(JSON.stringify(this.posts));
      console.log(excel)
      var bar = new Promise((resolve, reject) => {
        for(var i = 0; i < excel.length; i++){
          excel[i]['รหัส'] = excel[i]['case_type'];
          excel[i]['ความ'] = excel[i]['case_type_desc'];
          excel[i]['หน่วยงานที่บันทึก'] = excel[i]['create_dep_name'];
          excel[i]['ผู้บันทึก'] = excel[i]['create_user'];
          excel[i]['วันที่บันทึก'] = excel[i]['create_date'];
          excel[i]['หน่วยงานที่แก้ไข'] = excel[i]['update_dep_name'];
          excel[i]['แก้ไขล่าสุด'] = excel[i]['update_user'];
          excel[i]['วันที่แก้ไขล่าสุด'] = excel[i]['update_date'];
          delete excel[i]['create_date'];
          delete excel[i]['create_dep_code'];
          delete excel[i]['create_dep_name'];
          delete excel[i]['create_user'];
          delete excel[i]['create_user_id'];
          delete excel[i]['default_value'];
          delete excel[i]['disable_flag'];
          delete excel[i]['editCaseType'];
          delete excel[i]['edit_case_type'];
          delete excel[i]['update_date'];
          delete excel[i]['update_dep_code'];
          delete excel[i]['update_dep_name'];
          delete excel[i]['update_user'];
          delete excel[i]['update_user_id'];
          delete excel[i]['case_type'];
          delete excel[i]['case_type_desc'];
          delete excel[i]['court_running'];
          excel[i] = $.extend([], excel[i])
          excel[i] = Object.values(excel[i])
        }
      });
      if(bar)
        this.excelService.exportAsExcelFile(Object.values(excel),'fct0218' ,this.programName);
    }else{
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('กรุณาค้นหาข้อมูล');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
    }
  }

  changeProv(province:any,type:any){

    var student = JSON.stringify({
      "table_name" : "pamphur",
      "field_id" : "amphur_id",
      "field_name" : "amphur_name",
      "condition" : " AND prov_id='"+province+"'",
      "userToken" : this.userData.userToken
    });
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getAmphur = getDataOptions;
        setTimeout(() => {
          if(this.result.amphur_id)
            this.changeAmphur(this.result.amphur_id,type);
        }, 100);
        
      },
      (error) => {}
    )
    if(typeof province=='undefined' || type==1){
      this.sAmphur.clearModel();
      this.sTambon.clearModel();
      this.result.post_no = '';
    }
  }

  changeAmphur(Amphur:any,type:any){

    var student = JSON.stringify({
      "table_name" : "ptambon",
      "field_id" : "tambon_id",
      "field_name" : "tambon_name",
      "condition" : " AND amphur_id='"+Amphur+"' AND prov_id='"+this.result.prov_id+"'",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getTambon = getDataOptions;       
      },
      (error) => {}
    )
    if(typeof Amphur=='undefined' || type==1){
      this.sTambon.clearModel();
      this.result.post_no = '';
    }
  }

  changeTambon(Tambon:any,type:any){

    var student = JSON.stringify({
      "table_name" : "ptambon",
      "field_id" : "tambon_id",
      "field_name" : "post_code",
      "condition" : " AND prov_id='"+this.result.prov_id+"' AND amphur_id='"+this.result.amphur_id+"' AND tambon_id='"+Tambon+"'",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/getData', student ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getPostCode = getDataOptions;
        console.log(this.getPostCode)
        if(this.getPostCode.length){
          this.result.post_no = this.getPostCode[0].fieldNameValue;
        }
      },
      (error) => {}
    )
  }

  editData(index:any){
    this.SpinnerService.show();
    window.scrollTo(0, 0);
    setTimeout(() => {
      this.result = this.posts[index];
      this.result.prov_id = this.result.province;
      this.result.amphur_id = this.result.ampheur;
      this.result.tambon_id = this.result.tambon;
      if(this.result.prov_id)
        this.changeProv(this.result.prov_id,'');
      this.SpinnerService.hide();
    }, 500);
  }

  delData(){
    var del = 0;
    var bar = new Promise((resolve, reject) => {
      this.posts.forEach((ele, index, array) => {
        if(ele.running == true){
          del++;
        }
      });
    });
    if(bar){
      if(del){
        const modalRef = this.ngbModal.open(ModalConfirmComponent,{ windowClass: 'fct9916-conf'})
        modalRef.componentInstance.types = "1"
        modalRef.closed.subscribe((data) => {
          if(data) {
            var log_remark = data;
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
            confirmBox.setMessage('ยืนยันการลบข้อมูลที่เลือก');
            confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.DANGER
            })
            confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                var dataDel = [],dataTmp=[];
                        dataDel['log_remark'] = log_remark;
                        dataDel['userToken'] = this.userData.userToken;
                        var bar = new Promise((resolve, reject) => {
                          this.posts.forEach((ele, index, array) => {
                                if(ele.running == true){
                                  dataTmp.push(this.posts[index]);
                                }
                            });
                        });
                
                if(bar){
                  dataDel['data'] = dataTmp;
                  var data = $.extend({}, dataDel);
                  console.log(data)
                  this.http.post('/'+this.userData.appName+'ApiCT/API/fct9916/deleteSelect', data ).subscribe(
                    (response) =>{
                      let alertMessage : any = JSON.parse(JSON.stringify(response));
                      console.log(alertMessage)
                      const confirmBox2 = new ConfirmBoxInitializer();
                      confirmBox2.setTitle('ข้อความแจ้งเตือน');
                      if(alertMessage.result==0){
                        confirmBox2.setMessage(alertMessage.error);
                        confirmBox2.setButtonLabels('ตกลง');
                        confirmBox2.setConfig({
                            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                        });
                        const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                          if (resp.success==true){}
                          subscription2.unsubscribe();
                        });
                      }else{
                        confirmBox2.setMessage(alertMessage.error);
                        confirmBox2.setButtonLabels('ตกลง');
                        confirmBox2.setConfig({
                            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                        });
                        const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                          if (resp.success==true){
                            this.loadData();            
                          }
                          subscription2.unsubscribe();
                        });
                        
                      }
                    },
                    (error) => {}
                  )
                }
              }
            })
          }
        })
      }else{
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('กรุณาคลิกเลือกข้อมูลที่ต้องการลบ');
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
      }
    }
  }

  searchData() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

      this.SpinnerService.show();
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      // if(this.result_id.nativeElement["default_value"].checked==true){
      //   var inputChk = 1;
      // }else{
      //   var inputChk = 0;
      // }
      var student = JSON.stringify({
        // "result_id" : this.result_id.nativeElement["result_id"].value,
        "org_id" : this.result.org_id ? this.result.org_id : 0,
        "org_name" : this.result.org_name,
        "province" : this.result.prov_id,
        "ampheur" : this.result.amphur_id,
        "tambon" : this.result.tambon_id,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct9916/search', student , {headers:headers}).subscribe(
        posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          this.posts = productsJson.data;
          console.log(productsJson)
          if(productsJson.result==1){
            this.checklist = this.posts;
              if(productsJson.length)
                this.posts.forEach((x : any ) => x.editResultId = false);
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







