import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Renderer2   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap'; 
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { ActivatedRoute } from '@angular/router';
import { MatTabGroup } from '@angular/material/tabs';
import {Observable,of, Subject  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
import { PrintReportService } from 'src/app/services/print-report.service';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
declare var myExtObject: any;

@Component({
  selector: 'app-fkn0720-tab1,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fkn0720-tab1.component.html',
  styleUrls: ['./fkn0720-tab1.component.css']
})


export class Fkn0720Tab1Component implements AfterViewInit, OnInit, OnDestroy {
  title = 'datatables';
  posts:any;
  std_id:any;
  std_prov_name:any;
  delList:any=[];
  search:any;
  masterSelected:boolean;
  checklist:any;
  checklist2:any;
  sessData:any;
  userData:any;
  programName:string;
  Datalist:any;
  result:any=[];
  toPage1:any="fkn0710";//
  toPage2:any="fkn0730";//


  public list:any;
  public listTable:any;
  public listFieldId:any;
  public listFieldName:any;
  public listFieldName2:any;
  public listFieldNull:any;


  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  
  @ViewChild('openbutton3',{static: true}) openbutton3 : ElementRef;
  @ViewChild('closebutton3',{static: true}) closebutton3 : ElementRef;
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

    this.getData();
    //======================== authen ======================================
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fkn0720"
    });
    this.http.post('/'+this.userData.appName+'Api/API/authen', authen ).subscribe(
      (response) =>{
        let getDataAuthen : any = JSON.parse(JSON.stringify(response));
        this.programName = getDataAuthen.programName;
      },
      (error) => {}
    )
  }

  getData(){
    this.SpinnerService.show();
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    
    var student = JSON.stringify({
      "court_running": this.userData.courtRunning,
      "userRunning" : this.userData.userRunning,
      "userToken" : this.userData.userToken
    });

    this.http.disableLoading().post('/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0720/getDataTab1', student).subscribe(posts => {
      let productsJson : any = JSON.parse(JSON.stringify(posts));
      // console.log("productsJson=>", productsJson.data);
      if(productsJson.result==1){
        productsJson.data.forEach((ele, index, array) => {
          productsJson.data[index]['mail_from'] = parseInt(ele.mail_from);
       });

       this.posts = productsJson.data;
        this.checklist = this.posts;
        if(productsJson.data.length)
          this.posts.forEach((x : any ) => x.edit0721 = false);
        this.rerender();
      }else{
        // confirmBox.setMessage(productsJson.error);
        // confirmBox.setButtonLabels('ตกลง');
        // confirmBox.setConfig({
        //     layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        // });
        // const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        //   if (resp.success==true){}
        //   subscription.unsubscribe();
        // });
        this.posts=[];
      }
      this.SpinnerService.hide();
    });
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
  }

  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit0721 = this.masterSelected;
    }
  }

  isAllSelected() {
    this.masterSelected = this.checklist.every(function(item:any) {
        return item.edit0721 == true;
    })
  }

  uncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].edit0721 = false;
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
          alert(del);
        }
      }).promise().done(function () {
        $("body").find("input[name='delValue']").val(del);
       })
    }, 100);

  }

  loadMyModalComponent(){
    $(".modal-backdrop").remove();
    //$(".modal-backdrop").css('opacity','0');
    this.loadModalComponent = true;
    // $("#exampleModal").find(".modal-body").css("height","100px");
    $("#exampleModal-3").find(".modal-content").css("width","650px");
    $("#exampleModal-3").find(".modal-body").css("height","auto");
    $("#exampleModal-3").css({"background":"rgba(51,32,0,.4)"});
  }

  confirmBox() {
    var isChecked = this.posts.every(function(item:any) {
      return item.edit0721 == false;
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
      this.openbutton3.nativeElement.click();
    }
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
              const confirmBox2 = new ConfirmBoxInitializer();
              confirmBox2.setTitle('ต้องการลบข้อมูลใช่หรือไม่?');
              confirmBox2.setMessage('ยืนยันการลบข้อมูลที่เลือก');
              confirmBox2.setButtonLabels('ตกลง', 'ยกเลิก');
              // Choose layout color type
              confirmBox2.setConfig({
                  layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                var dataDel = [],dataTmp=[];
                var bar = new Promise((resolve, reject) => {
                  this.posts.forEach((ele, index, array) => {
                        if(ele.edit0721 == true){
                          dataTmp.push(this.posts[index]);
                        }
                    });
                });
                if(bar){
                  dataDel['userToken'] = this.userData.userToken;
                  dataDel['data'] = dataTmp;
                  var data = $.extend({}, dataDel);
                  // console.log("data=>", data)
                  this.http.post('/'+this.userData.appName+'ApiKN/API/KEEPN/fkn0720/deleteDataSelectTab1', data ).subscribe(
                  (response) =>{
                    let alertMessage : any = JSON.parse(JSON.stringify(response));
                  // console.log("alertMessage=>", alertMessage)
                    if(alertMessage.result==0){
                      this.SpinnerService.hide();
                    }else{
                      this.closebutton3.nativeElement.click();
                      confirmBox.setMessage(alertMessage.error);
                      confirmBox.setButtonLabels('ตกลง');
                      confirmBox.setConfig({
                          layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                      });
                      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                        if (resp.success==true){}
                        subscription.unsubscribe();
                        this.getData();
                      });
                    }
                  },
                  (error) => {}
                  )
                }
              }
              subscription2.unsubscribe();
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

  closeModal(){
    this.loadModalComponent = false;
  }

  buttonNew(){//fkn0710
    let winURL = window.location.href.split("/#/")[0]+"/#/";
    winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+this.toPage1;
    window.location.href =winURL;
  }

  goToPage(index:any, column:any){//fkn0730
    let winURL = window.location.href.split("/#/")[0]+"/#/";
    winURL = winURL.substring(0,winURL.lastIndexOf("/")+1)+this.toPage2+"?mail_id="+this.posts[index].mail_no;
    window.location.href =winURL;
  }

}
