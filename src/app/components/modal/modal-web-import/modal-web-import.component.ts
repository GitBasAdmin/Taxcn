import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
import { transform, isEqual, isObject ,differenceBy  } from 'lodash';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { ModalConfirmComponent } from '../../fdo/modal/modal-confirm/modal-confirm.component';
import { NgbModal, NgbModalRef ,NgbActiveModal  } from '@ng-bootstrap/ng-bootstrap';
import * as _ from "lodash"
@Component({
  selector: 'app-modal-web-import',
  templateUrl: './modal-web-import.component.html',
  styleUrls: ['./modal-web-import.component.css']
})
export class ModalWebImportComponent implements AfterViewInit,OnInit {
  @Input() obj : any = [];
  @Input() type: number;
  @Input() run_id: number;

  @Output() onClickList = new EventEmitter<any>();
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;

  formList: FormGroup;
  sessData:any;
  userData:any;
  items:any = [];

  public loadModalConfComponent2:boolean = false;
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
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    //console.log(this.obj)
    this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fno0900/getNoticePetitionJson', this.obj ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        this.items = getDataOptions.data;
      },
      (error) => {}
    )

  }

  

  loadMyModalComponent(){
    $("#exampleModal3").find(".modal-content").css("width","650px");
      this.loadModalConfComponent2 = true;
  }


  ngAfterViewInit(): void {
    //console.log(this.items)
    $('body').find(".tblForm").closest(".modal-content").css("width","800px");
  }

  
  checkUncheckAll(val:any,event:any) {
  
    if(val==1 && event==true){
      $('.dataTableImport').find('tbody').find('tr input[type="checkbox"]').prop("checked",true)
    }else if(val==1 && event==false){
      $('.dataTableImport').find('tbody').find('tr input[type="checkbox"]').prop("checked",false)
    }

  }

  isAllSelected(val:any) {
    if(val==1){
        if(this.items.length != 0){
          setTimeout(() => {
            if($('.dataTableImport').find('tbody').find('tr input[type="checkbox"]').filter(':checked').length == this.items.length ){
              $('.dataTableImport').find('thead').find('tr input[type="checkbox"]').prop("checked",true)
            }else{
              $('.dataTableImport').find('thead').find('tr input[type="checkbox"]').prop("checked",false)
            }
          }, 500);
        }else{
          $('.dataTableImport').find('thead').find('tr input[type="checkbox"]').prop("checked",false)
        }
    }

    
  }

  importData(){
    
      const chkEl = document.querySelectorAll("input.delM");
      console.log(chkEl)
      var del = [];
      var bar = new Promise((resolve, reject) => {
        if(chkEl.length){
          chkEl.forEach((ele, index, array) => {
            if($(ele).prop("checked")==true){
              del.push(this.items[index]);
              //console.log(index)
            }
            if (index === chkEl.length -1) resolve(null);
          });
        }else{resolve(null)}
      });
      //return;
      bar.then(() => {
        if(!del.length){
          this.alertMessage('กรุณาเลือกข้อมูลที่ต้องการนำเข้า')
        }else{
          
            
              const confirmBox = new ConfirmBoxInitializer();
              confirmBox.setTitle('ต้องการนำเข้าข้อมูลที่เลือก ใช่หรือไม่?');
              confirmBox.setMessage('ยืนยันการนำเข้าข้อมูลที่เลือก');
              confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
              confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.DANGER
              })
              const subscription =  confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  var dataDel = [],dataTmp=[];
                  dataDel['userToken'] = this.userData.userToken;
                  dataDel['run_id'] = this.run_id;
                  var bar = new Promise((resolve, reject) => {
                    /* var expD = lists;
                    del.forEach((ele, index, array) => {
                      dataTmp.push(expD.filter((x:any) => x.import_running === ele)[0]);
                    });   */        
                  });
    
                  if(bar){
                    dataDel['data'] = del;
                    var data = $.extend({}, dataDel);
                    console.log(data);//return;
                    this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fno0900/genNoticePetition', data ).subscribe({
                      complete: () => { }, // completeHandler
                      error: (e) => { console.error(e) },    // errorHandler 
                      next: (v) => {
                        let alertMessage : any = JSON.parse(JSON.stringify(v));
                        console.log(alertMessage)
                        if(alertMessage.result==1){
                          const confirmBox2 = new ConfirmBoxInitializer();
                          confirmBox2.setTitle('ข้อความแจ้งเตือน');
                          confirmBox2.setMessage(alertMessage.error);
                          confirmBox2.setButtonLabels('ตกลง');
                          confirmBox2.setConfig({
                              layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
                          });
                          const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                            if (resp.success==true){
                              //this.onClickSearchData(0);    
                              this.activeModal.close(1)      
                            }
                            subscription2.unsubscribe();
                          });
                        }else{
                          const confirmBox3 = new ConfirmBoxInitializer();
                          confirmBox3.setTitle('ข้อความแจ้งเตือน');
                          confirmBox3.setMessage(alertMessage.error);
                          confirmBox3.setButtonLabels('ตกลง');
                          confirmBox3.setConfig({
                              layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
                          });
                          const subscription3 = confirmBox3.openConfirmBox$().subscribe(resp => {
                            if (resp.success==true){
                              this.activeModal.close(0)  
                            }
                            subscription3.unsubscribe();
                          });
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

  alertMessage(message:string){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    confirmBox.setMessage(message);
    confirmBox.setButtonLabels('ตกลง');
    confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
    });
    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      if (resp.success==true){
        
      }
      subscription.unsubscribe();
    });
  }

  pClose(pop:any){
    pop.close()
  }
  pOpen(pop:any){
    pop.open()
  }
  
  closeModal(){

  }
  submitModalForm(){

  }


}
