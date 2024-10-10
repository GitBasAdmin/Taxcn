import { Component, OnInit,ViewChild , ElementRef, } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import {
  CanActivateFn, Router,ActivatedRoute,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChildFn
} from '@angular/router';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  sessData:any;
  userData:any;
  modalType:any;
  items:any = [];
  mail:any = [];
  public loadModalAlertComponent: boolean = false;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    console.log(this.sessData)
    this.userData = JSON.parse(this.sessData);
    //console.log(this.userData.userLevel)
    if(this.userData.AlertLogin)
      this.alertSearch();//เช็ค alert
  }
  alertSearch(){
    var student = JSON.stringify({
      "event" : "login",
      "userToken" : this.userData.userToken
    });
      console.log(student)
      this.http.disableLoading().post('/'+this.userData.appName+'Api/API/alert', student ).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          //console.log(getDataOptions)
          this.items = getDataOptions.data;
          var student = JSON.stringify({
            "userToken" : this.userData.userToken
          });
          //console.log(student)
          this.http.post('/'+this.userData.appName+'ApiKN/API/KEEPN/mail/getMail', student).subscribe(
            (response) =>{
              let getDataMail : any = JSON.parse(JSON.stringify(response));
              this.mail = getDataMail.data;
              //======================================
                if(this.items.length || this.mail.length){
                  let item =JSON.parse(localStorage.getItem(this.authService.sessJson));
                  var bar = new Promise((resolve, reject) => {
                    item['AlertLogin']=false;
                    localStorage.setItem(this.authService.sessJson, JSON.stringify(item));
                    this.sessData=localStorage.getItem(this.authService.sessJson);
                    //console.log(this.authService.sessJson)
                  })
                  if(bar){
                    //console.log(this.sessData)
                    this.clickOpenMyModalComponent(1);
                  }
                }
              //======================================
            },
            (error) => {}
          )
          /*
          if(getDataOptions.data.length){
            
            console.log(this.items)
            let item =JSON.parse(localStorage.getItem(this.authService.sessJson));
            var bar = new Promise((resolve, reject) => {
              item['AlertLogin']=false;
              localStorage.setItem(this.authService.sessJson, JSON.stringify(item));
              this.sessData=localStorage.getItem(this.authService.sessJson);
            })
            if(bar){
              console.log(this.sessData)
              this.clickOpenMyModalComponent(1);
            }
          }
          */
        },
        (error) => {}
      );
  }

  //let prevData = JSON.parse(sessionStorage.getItem('queryData'));
    

  clickOpenMyModalComponent(type:any){
    this.modalType = type;
    this.openbutton.nativeElement.click();
  }

  loadMyModalComponent(){
    if(this.modalType==1){
        $("#exampleModal").find(".modal-content").css("width","650px");
        this.loadModalAlertComponent = true;
    }
  }

  closeModal(){
    this.loadModalAlertComponent = false;
  }
  redirectUrl(depCode:number){
    var student = JSON.stringify({
      "userToken" : this.userData.userToken,
      "user_running": '0',
      "dep_code": depCode.toString()
    });
    console.log(student)
    this.http.disableLoading().post('/'+this.userData.appName+'Api/API/getMenu', student ).subscribe(
      (response) =>{
        let res : any = JSON.parse(JSON.stringify(response));
        localStorage.setItem(this.authService.menuJson, JSON.stringify(res));
      },
      (error) => {
        
      },
      () => this.router.navigate(['/menu_center',depCode])
    )
    //this.router.navigate(['/menu_center',depCode]);
  }

  logout(){
    
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('ต้องการออกจากระบบใช่หรือไม่');
      confirmBox.setButtonLabels('ตกลง','ยกเลิก');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        console.log(resp)
        if (resp.success==true){
          localStorage.clear();
          this.router.navigate(['/login']);
        }
        subscription.unsubscribe();
      });
    }
  

}
