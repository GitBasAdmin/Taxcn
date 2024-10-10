import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@app/auth.service';
import { ConfirmBoxInitializer, DialogLayoutDisplay } from '@costlydeveloper/ngx-awesome-popup';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.css']
})
export class ModalConfirmComponent implements OnInit {
  public formList: FormGroup;
  typePwd:boolean=false
  constructor(
    public activeModal: NgbActiveModal,
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.onCreateForm()
  }

  ngOnInit(): void {
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

  showInput(objName:any){
    this[objName] = !this[objName];
  }

  onSubmit = () => {
    if(this.formList.valid) {
      let dataUser = this.getDataUser()
      this.http.post('/'+dataUser.appName+'Api/API/checkPassword', {
        user_running : dataUser.userRunning,
        password : this.formList.controls['password'].value,
        log_remark : this.formList.controls['log_remark'].value,
        userToken: dataUser.userToken
        }).subscribe(
        (response: any) => {
          if(response.result==1){
            this.activeModal.close(this.formList.controls['log_remark'].value)
          } else {
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setMessage(response.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){}
              subscription.unsubscribe();
            });
          }
        })
    }
  }

}
