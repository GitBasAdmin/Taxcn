import { Component, OnInit,Input,AfterViewInit,Output,EventEmitter,ViewChild,ElementRef,ViewEncapsulation } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import {
  CanActivateFn, Router,ActivatedRoute,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChildFn
} from '@angular/router';
declare var myExtObject: any;

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-menu-center',
  templateUrl: './menu-center.component.html',
  styleUrls: ['./menu-center.component.css']
})
export class MenuCenterComponent implements AfterViewInit,OnInit {
  sessData:any;
  userData:any;
  list:any;
  items:any = [];
  mail:any = [];
  modalType:any;
  FevoriteData:any = [];
  myExtObject: any;
  public loadModalAlertComponent: boolean = false;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  public menu:any;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    console.log(this.sessData)
    this.userData = JSON.parse(this.sessData);

    /* let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer szdp79a2kz4wh4frjzuqu4sz6qeth8m3',
    });

    if(this.userData.userLevel=='A'){
      this.SpinnerService.show(); 
      //alert(this.route.snapshot.paramMap.get('dep_code'));
      var student = JSON.stringify({
        "userToken" : this.userData.userToken,
        "user_running": '0',
        "dep_code": this.route.snapshot.paramMap.get('dep_code')
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'Api/API/getMenu', student , {headers:headers}).subscribe(
        (response) =>{
          this.SpinnerService.hide(); 
          let res : any = JSON.parse(JSON.stringify(response));
          this.list = res.result;
          //console.log(this.list)
          console.log(res.length)
          if(res.result==1){
            // this.menu = res.menu;
            this.menu = res;//แก้ไขส่ง system_short_name ได้ด้วย
            //console.log(this.menu)
            localStorage.setItem(this.authService.menuJson, JSON.stringify(this.menu));
            //console.log(res.menu)
          }
        },
        (error) => {
          
        }
      )
    }else{
      this.SpinnerService.show(); 
      var student = JSON.stringify({
        "userToken" : this.userData.userToken,
        "user_running": this.userData.userRunning,
        "dep_code": "0"
      });
      this.http.post('/'+this.userData.appName+'Api/API/getMenu', student , {headers:headers}).subscribe(
        (response) =>{
          this.SpinnerService.hide(); 
          let res : any = JSON.parse(JSON.stringify(response));
          this.list = res.result;
          console.log(this.list)
          //console.log(res.length)
          if(res.result==1){
            // this.menu = res.menu;
            this.menu = res;
            console.log(this.menu)
            localStorage.setItem(this.authService.menuJson, JSON.stringify(this.menu));
            //console.log(res.menu)
            if(this.userData.AlertLogin)
              this.alertSearch();//เช็ค alert
          }
        },
        (error) => {
          
        }
      )
    } */

    this.loadFevorite();
  }

  ngAfterViewInit(): void {
    
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
          console.log(getDataOptions)
          //if(getDataOptions.data.length){
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
          //}
        },
        (error) => {}
      );
  }

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

  loadFevorite(){
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
    });
    console.log(authen)
    this.http.disableLoading().post('/'+this.userData.appName+'Api/API/getProgramFevorite', authen).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        if(getDataOptions.result==1 && getDataOptions.data.length){
          this.FevoriteData = getDataOptions.data;
        }else{
          this.FevoriteData = [];
        }
      },
      (error) => {}
    )
  }

  delFevorite(id:any,name:any){
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('ต้องการลบหน้าจอออกจากรายการโปรด ใช่หรือไม่');
      confirmBox.setButtonLabels('ตกลง','ยกเลิก');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        console.log(resp)
        if (resp.success==true){
          var authen = JSON.stringify({
            "userToken" : this.userData.userToken,
            "program_id" : id,
            "program_name" : name
          });
          console.log(authen)
          this.http.post('/'+this.userData.appName+'Api/API/delProgramFevorite', authen).subscribe(
            (response) =>{
              let getDataOptions : any = JSON.parse(JSON.stringify(response));
              console.log(getDataOptions)
                const confirmBox2 = new ConfirmBoxInitializer();
                confirmBox2.setTitle('ข้อความแจ้งเตือน');
                confirmBox2.setMessage(getDataOptions.error);
                confirmBox2.setButtonLabels('ตกลง');
                confirmBox2.setConfig({
                  layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){
                    location.reload();
                  }
                  subscription2.unsubscribe();
                });
            },
            (error) => {}
          )
        }
        subscription.unsubscribe();
      });
  }

  openFevorite(url:any){
    let winURL = window.location.href.split("/#/")[0]+"/#/";
    myExtObject.OpenWindowMaxName(winURL+url,url);
  }

}

