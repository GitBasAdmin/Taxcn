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
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { PrintReportService } from 'src/app/services/print-report.service';

@Component({
  selector: 'app-fct4002,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fct4002.component.html',
  styleUrls: ['./fct4002.component.css']
})


export class Fct4002Component implements AfterViewInit, OnInit, OnDestroy {

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
  result:any=[];

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  @ViewChild('guar_period_id',{static: true}) guar_period_id : ElementRef;
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
      var student = JSON.stringify({
        "userToken" : this.userData.userToken
     });
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct4002',student).subscribe(posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          console.log(productsJson)
          this.posts = productsJson.data;
          if(productsJson.result==1){
            this.checklist = this.posts;
            if(productsJson.data.length)
              this.posts.forEach((x : any ) => x.editDocTypeId = false);
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
        "url_name" : "fct4002"
      });
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen , {headers:headers}).subscribe(
        (response) =>{
          let getDataAuthen : any = JSON.parse(JSON.stringify(response));
          this.programName = getDataAuthen.programName;
          console.log(getDataAuthen)
        },
        (error) => {}
      )
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
    const ele = this.guar_period_id.nativeElement[name];
    if (ele) {
      ele.focus();
    }
  }

  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].editDocTypeId = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  ClearAll(){
    window.location.reload();
  }

  isAllSelected() {
    this.masterSelected = this.checklist.every(function(item:any) {
        return item.editDocTypeId == true;
      })
    this.getCheckedItemList();
  }

  uncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].editDocTypeId = false;
    }
    this.masterSelected = false;
    $("body").find("input[name='delValue']").val('');
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

    if(!this.result.guar_period_id){
      confirmBox.setMessage('กรุณาระบุรหัส');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          //this.SpinnerService.hide();
          this.setFocus('guar_period_id');
        }
        subscription.unsubscribe();
      });

    }else if(!this.result.guar_period_name){
      confirmBox.setMessage('กรุณาระบุประกันระหว่าง');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
          //this.SpinnerService.hide();
          this.setFocus('guar_period_name');
        }
        subscription.unsubscribe();
      });
    }else{


      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      // if(this.guar_period_id.nativeElement["default_value"].checked==true){
      //   var inputChk = 1;
      // }else{
      //   var inputChk = 0;
      // }
      var student = JSON.stringify({
        "guar_period_id" : this.result.guar_period_id,
        "edit_guar_period_id" : this.result.edit_guar_period_id ? this.result.edit_guar_period_id : 0,
        "guar_period_name" : this.result.guar_period_name,
        "userToken" : this.userData.userToken
      });
      console.log(student)

      this.SpinnerService.show();

      this.http.post('/'+this.userData.appName+'ApiCT/API/fct4002/saveJson', student , {headers:headers}).subscribe(
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
  
  editData(index :any) {
    this.SpinnerService.show();
    this.result.edit_guar_period_id  = this.posts[index]['edit_guar_period_id'];
    this.result.guar_period_id  = this.posts[index]['guar_period_id'];
    this.result.guar_period_name  = this.posts[index]['guar_period_name'];

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
        "guar_period_id" : this.result.guar_period_id,
        "guar_period_name" : this.result.guar_period_name,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct4002/search', student , {headers:headers}).subscribe(
        posts => {
          let productsJson : any = JSON.parse(JSON.stringify(posts));
          this.posts = productsJson.data;
          console.log(productsJson)
          if(productsJson.result==1){
            this.checklist = this.posts;
              if(productsJson.length)
                this.posts.forEach((x : any ) => x.editDocTypeId = false);
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
              if(ele.editDocTypeId == true){
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
            this.http.post('/'+this.userData.appName+'ApiCT/API/fct4002/deleteSelect', data , {headers:headers}).subscribe(
              (response) =>{
                let alertMessage : any = JSON.parse(JSON.stringify(response));
                if(alertMessage.result==0){
                  this.SpinnerService.hide();
                }else{
                  this.closebutton.nativeElement.click();
                  $("button[type='reset']")[0].click();
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
    var rptName = 'rct4002';
    // For no parameter : paramData ='{}'
    var paramData ='{}';
    // For set parameter to report
    // var paramData = JSON.stringify({
    // "pguar_period_id" : this.guar_period_id.nativeElement["guar_period_id"].value,
    // "pguar_period_name" : this.guar_period_id.nativeElement["guar_period_name"].value
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