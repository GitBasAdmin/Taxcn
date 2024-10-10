import { Component, OnInit,Input,Output,EventEmitter,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@app/auth.service';
import { ConfirmBoxInitializer, DialogLayoutDisplay } from '@costlydeveloper/ngx-awesome-popup';
@Component({
  selector: 'app-modal-confirm-fdo',
  templateUrl: './modal-confirm-fdo.component.html',
  styleUrls: ['./modal-confirm-fdo.component.css']
})
export class ModalConfirmFdoComponent implements OnInit {
  @Input() type : any;
  @Input() return_addition : any;
  @Output() onClickList = new EventEmitter<any>();
  @ViewChild('modalForm',{static: true}) modalForm : ElementRef;
  typePwd:boolean=false
  formList: FormGroup;
  constructor(
    public activeModal: NgbActiveModal,
    private authService: AuthService,
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService
  ) { 
    this.formList = this.formBuilder.group({
      word_id: [''],
      word_desc: ['']
    })
  }

  ngOnInit(): void {
    if(this.return_addition)
      this.modalForm.nativeElement["log_remark"].value=this.return_addition;
  }

  showInput(objName:any){
    this[objName] = !this[objName];
  }

  onCreateForm = () => {
    this.formList = new FormGroup({
      password: new FormControl("", Validators.compose([Validators.required])),
      log_remark: new FormControl("", Validators.compose([Validators.required])),
    })
  }

  private getDataUser = () => {
    const sessData: string = localStorage.getItem(this.authService.sessJson);
    let userData: any
    if(sessData) {
      userData = JSON.parse(sessData)
    }

    return userData
  }

  onSubmit = () => {
    if(this.formList.valid) {
      let dataUser = this.getDataUser()
      console.log(dataUser);
      this.http.post('/'+dataUser.appName+'Api/API/checkLogin', {
        user_name : this.modalForm.nativeElement["user_name"].value,
        password : this.modalForm.nativeElement["password"].value,
        log_remark : this.modalForm.nativeElement["log_remark"].value,
        userToken: dataUser.userToken
        }).subscribe(
        (response: any) => {
          if(response.error==""){
            this.activeModal.close(response)
            response["remark"]=this.modalForm.nativeElement["log_remark"].value;
            this.activeModal.close(response)
            // this.activeModal.close(this.modalForm.nativeElement["log_remark"].value)
          } else {
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage(response.error);
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
        })
    }
  }
}