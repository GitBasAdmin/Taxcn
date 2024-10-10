import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, NgForm } from "@angular/forms";
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from 'src/app/auth.service';
import { transform, isEqual, isObject, differenceBy } from 'lodash';
import { DialogLayoutDisplay, ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { ModalConfirmComponent } from '../../fdo/modal/modal-confirm/modal-confirm.component';
import { NgbModal, NgbModalRef, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from "lodash"
declare var myExtObject: any;
@Component({
  selector: 'app-alertl-web-import',
  templateUrl: './alertl-web-import.component.html',
  styleUrls: ['./alertl-web-import.component.css']
})
export class ModalAlertlWebImportComponent implements AfterViewInit, OnInit {
  @Input() obj: any = [];
  @Input() type: number;
  @Input() run_id: number;

  @Output() onClickList = new EventEmitter<any>();
  @ViewChild('openbutton', { static: true }) openbutton: ElementRef;
  @ViewChild('closebutton', { static: true }) closebutton: ElementRef;
  @ViewChild(ModalConfirmComponent) child: ModalConfirmComponent;
  myExtObject: any;
  formList: FormGroup;
  sessData: any;
  userData: any;
  items: any = [];

  public loadModalConfComponent2: boolean = false;
  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private ngbModal: NgbModal,
    public activeModal: NgbActiveModal,
  ) {

  }

  ngOnInit(): void {
    this.sessData = localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    //this.items = this.obj;
    if(this.type)
      this.getAlertlWebImpor();//จาก menu
    else
      this.items = this.obj;//alert ตอน login มาครั้งแรก
  }

  getAlertlWebImpor() {
    var student = JSON.stringify({
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fno0900/checkNoticePetition', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        this.items = getDataOptions.data;
      },
      (error) => {}
    )
  }

  loadMyModalComponent() {
    $("#exampleModal3").find(".modal-content").css("width", "650px");
    this.loadModalConfComponent2 = true;
  }


  ngAfterViewInit(): void {
    //console.log(this.items)
    $('body').find(".tblForm").closest(".modal-content").css("width", "800px");
  }


  onClickData(index: any): void {
    let winURL = window.location.href.split("/#/")[0] + "/#/";
    myExtObject.OpenWindowMax(winURL + 'fno0900?run_id=' + this.items[index].run_id);
  }


  checkUncheckAll(val: any, event: any) {

    if (val == 1 && event == true) {
      $('.dataTableImport').find('tbody').find('tr input[type="checkbox"]').prop("checked", true)
    } else if (val == 1 && event == false) {
      $('.dataTableImport').find('tbody').find('tr input[type="checkbox"]').prop("checked", false)
    }

  }

  isAllSelected(val: any) {
    if (val == 1) {
      if (this.items.length != 0) {
        setTimeout(() => {
          if ($('.dataTableImport').find('tbody').find('tr input[type="checkbox"]').filter(':checked').length == this.items.length) {
            $('.dataTableImport').find('thead').find('tr input[type="checkbox"]').prop("checked", true)
          } else {
            $('.dataTableImport').find('thead').find('tr input[type="checkbox"]').prop("checked", false)
          }
        }, 500);
      } else {
        $('.dataTableImport').find('thead').find('tr input[type="checkbox"]').prop("checked", false)
      }
    }


  }

  cancelData() {
    const chkEl = document.querySelectorAll("input.delM");
    console.log(chkEl)
    var del = [];
    var bar = new Promise((resolve, reject) => {
      if (chkEl.length) {
        chkEl.forEach((ele, index, array) => {
          if ($(ele).prop("checked") == true) {
            del.push(this.items[index]);
            //console.log(index)
          }
          if (index === chkEl.length - 1) resolve(null);
        });
      } else { resolve(null) }
    });
    //return;
    bar.then(() => {
      if (!del.length) {
        this.alertMessage('กรุณาเลือกข้อมูลที่ต้องการยกเลิกการแจ้งเตือน')
      } else {


        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ต้องการยกเลิกการแจ้งเตือนข้อมูลที่เลือก ใช่หรือไม่?');
        confirmBox.setMessage('ยืนยันการยกเลิกการแจ้งเตือนข้อมูลที่เลือก');
        confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
        confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.DANGER
        })
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success == true) {
            var dataDel = [], dataTmp = [];
            dataDel['userToken'] = this.userData.userToken;
            var bar = new Promise((resolve, reject) => {
              /* var expD = lists;
              del.forEach((ele, index, array) => {
                dataTmp.push(expD.filter((x:any) => x.import_running === ele)[0]);
              });   */
            });

            if (bar) {
              dataDel['data'] = del;
              var data = $.extend({}, dataDel);
              console.log(data);//return;
              this.http.post('/' + this.userData.appName + 'ApiNO/API/NOTICE/fno0900/cancelNoticePetition', data).subscribe({
                complete: () => { }, // completeHandler
                error: (e) => { console.error(e) },    // errorHandler 
                next: (v) => {
                  let alertMessage: any = JSON.parse(JSON.stringify(v));
                  console.log(alertMessage)
                  if (alertMessage.result == 1) {
                    const confirmBox2 = new ConfirmBoxInitializer();
                    confirmBox2.setTitle('ข้อความแจ้งเตือน');
                    confirmBox2.setMessage('ยกเลิกการแจ้งเตือนข้อมูลที่เลือกแล้ว');
                    confirmBox2.setButtonLabels('ตกลง');
                    confirmBox2.setConfig({
                      layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
                    });
                    const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                      if (resp.success == true) {
                        this.getAlertlWebImpor();
                        //this.onClickSearchData(0);    
                        //this.activeModal.close(1)
                      }
                      subscription2.unsubscribe();
                    });
                  } else {
                    this.activeModal.close(0)
                  }
                }
              });
            }
          }
          subscription.unsubscribe();
        })
      }
    });
  }

  alertMessage(message: string) {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    confirmBox.setMessage(message);
    confirmBox.setButtonLabels('ตกลง');
    confirmBox.setConfig({
      layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    });
    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      if (resp.success == true) {

      }
      subscription.unsubscribe();
    });
  }

  pClose(pop: any) {
    pop.close()
  }
  pOpen(pop: any) {
    pop.open()
  }

  closeModal() {

  }
  submitModalForm() {

  }


}
