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
import { ModalConfirmComponent } from '@app/components/modal/modal-confirm/modal-confirm.component';
import { PopupListTableComponent } from '@app/components/modal/popup-list-table/popup-list-table.component';
import { PopupListFieldsComponent } from '@app/components/modal/popup-list-fields/popup-list-fields.component';
import { DatalistReturnComponent } from '@app/components/modal/datalist-return/datalist-return.component';
import { PrintReportService } from 'src/app/services/print-report.service';
import {ExcelService} from '@app/services/excel.service.ts';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-fct0232,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fct0232.component.html',
  styleUrls: ['./fct0232.component.css']
})


export class Fct0232Component implements AfterViewInit, OnInit, OnDestroy {

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
    this.http.post('/'+this.userData.appName+'ApiCT/API/fct0232',student).subscribe(posts => {
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

  searchData() {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

      this.SpinnerService.show();
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      if(this.result.check_function==1)
        this.result.check_function = 'INSERT';
      else if(this.result.check_function==2)
        this.result.check_function = 'UPDATE';

      var student = JSON.stringify({
        "program_url" : this.result.program_url? this.result.program_url : '',
        "program_name" : this.result.program_name? this.result.program_name : '',
        "check_function" : this.result.check_function ? this.result.check_function : '',
        "table_name" : this.result.table_name? this.result.table_name : '',
        "userToken" : this.userData.userToken
      });
      // console.log(student)
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct0232/search',student).subscribe(posts => {
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
      "url_name" : "fct0232"
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
      this.checklist[i].running = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  isAllSelected() {
    this.masterSelected = this.checklist.every(function(item:any) {
        return item.running == true;
      })
    this.getCheckedItemList();
  }

  uncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].running = false;
    }
    this.masterSelected = false;
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

    if(!this.result.program_url){
      confirmBox.setMessage('กรุณาระบุรหัสหน้าจอ');
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

    }else if(!this.result.program_name){
      confirmBox.setMessage('กรุณาระบุชื่องาน');
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
      if(this.result.check_function==1)
        this.result.check_function = 'INSERT';
      else if(this.result.check_function==2)
        this.result.check_function = 'UPDATE';
      else
        this.result.check_function = null;
      var student = $.extend({},this.result);
      student['userToken'] = this.userData.userToken;
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct0232/saveJson', student ).subscribe(
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
                  this.result.edit_perform_running = getDataOptions.perform_running;
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


  editData(index:any){
    this.SpinnerService.show();
    window.scrollTo(0, 0);
    setTimeout(() => {
      this.result = this.posts[index];
      if(this.result.check_function.toLowerCase()=='insert')
        this.result.check_function = 1;
      else if(this.result.check_function.toLowerCase()=='update')
        this.result.check_function = 2;
      else
        this.result.check_function = null;
        console.log(this.result)
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
        const modalRef = this.ngbModal.open(ModalConfirmComponent,{ windowClass: 'fct0232-conf'})
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
                  this.http.post('/'+this.userData.appName+'ApiCT/API/fct0232/deleteSelect', data ).subscribe(
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
                            this.result = [];
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

  clickOpenMyModal(type:any){
    if(type==1){
      const modalRef = this.ngbModal.open(PopupListTableComponent)
            modalRef.result.then((item: any) => {
              if(item){
                this.result.table_name = item.table_name;
              }
            })
    }else if(type==2 || type==3 || type==4){
      if(this.result.table_name){
        const modalRef = this.ngbModal.open(PopupListFieldsComponent)
              modalRef.componentInstance.table = this.result.table_name;
              modalRef.result.then((item: any) => {
                if(item){
                  if(type==2)
                    this.result.date_stamp = item.column_name;
                  else if(type==3)
                    this.result.dep_field = item.column_name;
                  else if(type==4)
                    this.result.off_field = item.column_name;
                }
              })
      }
    }else if(type==5){
      var student = JSON.stringify({
        "table_name" : "pprogram",
        "field_id" : "url_name",
        "field_name" : "program_name",
        "field_name2" : "program_id",
        "search_id" : "",
        "search_desc" : "",
        "userToken" : this.userData.userToken});

      this.http.disableLoading().post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
        (response) =>{
          console.log(response)
            const modalRef = this.ngbModal.open(DatalistReturnComponent,{ size: 'lg', backdrop: 'static' })
            modalRef.componentInstance.items = response
            modalRef.componentInstance.value1 = "pprogram"
            modalRef.componentInstance.value2 = "url_name"
            modalRef.componentInstance.value3 = "program_name"
            modalRef.componentInstance.value8 = "program_id"
            modalRef.componentInstance.types = "1"
            modalRef.result.then((item: any) => {
              if(item){
                this.result.program_url=item.fieldIdValue;
                this.result.program_name=item.fieldNameValue;
                this.result.program_id=item.fieldNameValue2;
                
              }
            })
        },
        (error) => {}
      )
    }
  }

  

}







