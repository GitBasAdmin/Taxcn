import { Component, OnInit,Input,Output,EventEmitter,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from '@app/auth.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmBoxInitializer, DialogLayoutDisplay } from '@costlydeveloper/ngx-awesome-popup';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.css']
})
export class ModalConfirmComponent implements OnInit {
  @Input() types : number;//ประเภท Modal
  result:any = [];
  //@Input() items : any = [];
  //@Input() value1: number;
  //@Input() value2: number;
  //@Input() value3: number;
  //@Input() value4: number;
  @Output() onClickList = new EventEmitter<any>();
  @ViewChild('modalForm',{static: true}) modalForm : ElementRef;
  typePwd:boolean=false
  formList: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    public activeModal:NgbActiveModal,
    private authService: AuthService,
  ) { 

      this.formList = this.formBuilder.group({
        word_id: [''],
        word_desc: ['']
      })
    
  }



  ngOnInit(): void {
    
  }

  showInput(objName:any){
    this[objName] = !this[objName];
  }

  private getDataUser = () => {
    const sessData: string = localStorage.getItem(this.authService.sessJson);
    let userData: any
    if(sessData) {
      userData = JSON.parse(sessData)
    }

    return userData
  }

  ChildTestCmp(){
    if(this.types==1){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
  
      if(!this.result.password){
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
        
      }else if(!this.result.log_remark){
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
        let dataUser = this.getDataUser()
      this.http.post('/taxcApi/API/checkPassword', {
        user_running : dataUser.userRunning,
        password : this.result.password,
        log_remark : this.result.log_remark,
        userToken: dataUser.userToken
        }).subscribe(
        (response: any) => {
          if(response.result==1){
            this.activeModal.close(this.result.log_remark)
          } else {
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setMessage(response.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
               layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if(resp.success==true){}
              subscription.unsubscribe();
            });
          }
        })
      }
    }else{
      var student = JSON.stringify({
        "password" : this.result.password,//this.modalForm.nativeElement["password"].value,
        "log_remark" : this.result.log_remark//this.modalForm.nativeElement["log_remark"].value
      });
      return student;
    }
  }
}
