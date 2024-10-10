import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Injectable, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { DialogLayoutDisplay, ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { ModalConfirmComponent } from '../../modal/modal-confirm/modal-confirm.component';
import { AuthService } from 'src/app/auth.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
declare var myExtObject: any;

@Component({
  selector: 'app-fca0200-tab3',
  templateUrl: './fca0200-tab3.component.html',
  styleUrls: ['./fca0200-tab3.component.css']
})
export class Fca0200Tab3Component implements OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dataHeadValue: any;
  myExtObject: any;
  modalIndex: any;
  sessData: any;
  userData: any;
  public loadModalConfComponent: boolean = false;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance: DataTables.Api;
  @ViewChild(ModalConfirmComponent) child: ModalConfirmComponent;
  @ViewChild('openbutton', { static: true }) openbutton: ElementRef;
  @ViewChild('closebutton', { static: true }) closebutton: ElementRef;
  @Input() set dataHead(dataHead: any) {
    if (dataHead) {
      this.dataHeadValue = [];
      this.dataHeadValue = JSON.parse(JSON.stringify(dataHead));
      console.log(this.dataHeadValue)
    }
  }
  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private ngbModal: NgbModal,
  ) { }

  ngOnInit(): void {
    this.sessData = localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.dtOptions = {
      columnDefs: [{ "targets": 'no-sort', "orderable": false }],
      order: [[2, 'asc']],
      lengthChange: false,
      info: false,
      paging: false,
      searching: false,
      destroy: true,
    };
    //this.rerender();
    this.dataHeadValue = [];
    this.dataHeadValue.noticeObj= [];
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next('');
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next('');
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  openLink() {
    let winURL = window.location.href.split("/#/")[0] + "/#/";
    console.log(winURL)
    if (this.dataHeadValue.run_id)
      myExtObject.OpenWindowMaxName(winURL + 'fno0900?run_id=' + this.dataHeadValue.run_id, 'fap0110');
    else
      myExtObject.OpenWindowMaxName(winURL + 'fno0900', 'fno0900');
  }
  openNotice(index: any) {
    let winURL = window.location.href.split("/#/")[0] + "/#/";
    myExtObject.OpenWindowMaxName(winURL + 'fno0900?run_id=' + this.dataHeadValue.run_id + '&notice_running=' + this.dataHeadValue.noticeObj[index].notice_running, 'fap0110');
  }
  delNotice(index: any) {
    this.modalIndex = index;
    this.openbutton.nativeElement.click();
  }
  loadMyModalComponent() {
    $(".modal-backdrop").remove();
    this.loadModalConfComponent = true;
  }
  closeModal() {
    this.loadModalConfComponent = false;
  }

  submitModalForm(log_remark:any) {

    const confirmBox2 = new ConfirmBoxInitializer();
    confirmBox2.setTitle('ยืนยันการลบข้อมูล');
    confirmBox2.setMessage('ต้องการลบข้อมูลหมายที่เลือก');
    confirmBox2.setButtonLabels('ตกลง', 'ยกเลิก');

    confirmBox2.setConfig({
     layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
    });
    const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
      if (resp.success == true) {
        var dataDel = [];
        dataDel['log_remark'] = log_remark;
        dataDel['userToken'] = this.userData.userToken;
        dataDel['data'] = [this.dataHeadValue.noticeObj[this.modalIndex]];
        var data = $.extend({}, dataDel);
        console.log(data)
        this.http.post('/' + this.userData.appName + 'ApiNO/API/NOTICE/deleteNotice', data).subscribe({
          complete: () => { }, // completeHandler
          error: (e) => { console.error(e) },    // errorHandler 
          next: (v) => {
            let alertMessage: any = JSON.parse(JSON.stringify(v));
            console.log(alertMessage)
            if (alertMessage.result == 0) {
              const confirmBox = new ConfirmBoxInitializer();
              confirmBox.setMessage(alertMessage.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
               layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success == true) {
                  // this.closebutton.nativeElement.click();
                }
                subscription.unsubscribe();
              });
            } else {
              const confirmBox = new ConfirmBoxInitializer();
              confirmBox.setMessage(alertMessage.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
               layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success == true) {
                  // this.closebutton.nativeElement.click();
                  this.getNoticeData();
                }
                subscription.unsubscribe();
              });
            }
          },     // nextHandler
        });
      }
      subscription2.unsubscribe();
    });
  }

  /*submitModalForm(){
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
        if(resp.success==true){
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
        if(resp.success==true){
          //this.SpinnerService.hide();
        }
        subscription.unsubscribe();
      });
    }else{
      
        var student = JSON.stringify({
          "password" : chkForm.password,
          "log_remark" : chkForm.log_remark,
          "userToken" : this.userData.userToken
        });

        this.http.post('/'+this.userData.appName+'Api/API/checkReceiptPassword', student ).subscribe({
          complete: () => { }, // completeHandler
          error: (e) => { console.error(e) },    // errorHandler 
          next: (v) => {
            let productsJson : any = JSON.parse(JSON.stringify(v));
            console.log(productsJson)
            if(productsJson.result==1){

                const confirmBox2 = new ConfirmBoxInitializer();
                confirmBox2.setTitle('ยืนยันการลบข้อมูล');
                confirmBox2.setMessage('ต้องการลบข้อมูลหมายที่เลือก');
                confirmBox2.setButtonLabels('ตกลง', 'ยกเลิก');
                 
                  confirmBox2.setConfig({
                     layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
                  });
                  const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                      if(resp.success==true){
                        var dataDel = [];
                        dataDel['log_remark'] = chkForm.log_remark;
                        dataDel['userToken'] = this.userData.userToken;
                        dataDel['data'] = [this.dataHeadValue.noticeObj[this.modalIndex]];
                        var data = $.extend({},dataDel);
                        console.log(data)
                        this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/deleteNotice', data ).subscribe({
                          complete: () => { }, // completeHandler
                          error: (e) => { console.error(e) },    // errorHandler 
                          next: (v) => {
                            let alertMessage : any = JSON.parse(JSON.stringify(v));
                            console.log(alertMessage)
                            if(alertMessage.result==0){
                              confirmBox.setMessage(alertMessage.error);
                              confirmBox.setButtonLabels('ตกลง');
                              confirmBox.setConfig({
                                 layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                              });
                              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                                if(resp.success==true){
                                  this.closebutton.nativeElement.click();
                                }
                                subscription.unsubscribe();
                              });
                            }else{
                              confirmBox.setMessage(alertMessage.error);
                              confirmBox.setButtonLabels('ตกลง');
                              confirmBox.setConfig({
                                 layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                              });
                              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                                if(resp.success==true){
                                  this.closebutton.nativeElement.click();
                                  this.getNoticeData();
                                }
                                subscription.unsubscribe();
                              });
                            }
                          },     // nextHandler
                        });
                      }
                      subscription2.unsubscribe();
                  });   
              
              this.closebutton.nativeElement.click();
            }else{
              confirmBox.setMessage(productsJson.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                 layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if(resp.success==true){}
                subscription.unsubscribe();
              });
            }
          },     // nextHandler
        });
    }
  }*/

  getNoticeData() {
    if (this.dataHeadValue.run_id) {
      var student = JSON.stringify({
        "run_id": this.dataHeadValue.run_id,
        "userToken": this.userData.userToken
      });
      console.log(student)
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json');
      //this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/getNoticeData', student , {headers:headers}).subscribe(
      this.http.post('/' + this.userData.appName + 'ApiNO/API/NOTICE/getNoticeData', student, { headers: headers }).subscribe({
        complete: () => { }, // completeHandler
        error: (e) => { console.error(e) },    // errorHandler 
        next: (v) => {
          let productsJson: any = JSON.parse(JSON.stringify(v));
          console.log(productsJson)
          if (productsJson.data.length) {
            this.dataHeadValue.noticeObj = productsJson.data;
            //this.dtTrigger.next('');
            this.rerender();
          } else {
            this.dataHeadValue.noticeObj = [];
            //this.dtTrigger.next('');
            this.rerender();
          }
        },     // nextHandler
      });
    }
  }

  onOpenConfirm = (type: any) => {
    const modalRef: NgbModalRef = this.ngbModal.open(ModalConfirmComponent)
    modalRef.componentInstance.types = type
    modalRef.closed.subscribe((item) => {
      if (item) {
        this.submitModalForm(item);
      }
    })
  }

}
