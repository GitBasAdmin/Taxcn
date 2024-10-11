import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,ViewEncapsulation   } from '@angular/core';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner"; 
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';

import {
  Router,ActivatedRoute,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { tap, map ,catchError} from 'rxjs/operators';
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
@Injectable()

export class LoginComponent implements OnInit {
  sessJson:any;
  courtData:any = [];
  
  @ViewChild('loginFrom',{static: true}) loginFrom : ElementRef;
  constructor(
    private authService: AuthService, 
    private router: Router,
    private route: ActivatedRoute,
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService
  ){
    
  }

  ngOnInit(): void {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer szdp79a2kz4wh4frjzuqu4sz6qeth8m3',
    });
    let apiURL = '/taxcApi/API/getCourt';
    this.http.post(apiURL,'',{headers:headers}).subscribe(
      (response) =>{
        let res : any = JSON.parse(JSON.stringify(response));
        console.log(res)
        this.courtData = res.court_data[0];
        console.log(this.courtData)
      },
      (error) => {}
    )
  }

  login(){
    /*
    this.authService.userToken="administator";
    this.router.navigate(['/menu']);
    return false;
    */
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
   if(!this.loginFrom.nativeElement["username"].value){
    confirmBox.setMessage('กรุณาป้อน username');
    confirmBox.setButtonLabels('ตกลง');
    confirmBox.setConfig({
      layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
  });
  const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
    if (resp.success==true){}
    subscription.unsubscribe();
  });
   }else if(!this.loginFrom.nativeElement["passwd"].value){
    confirmBox.setMessage('กรุณาป้อน password');
    confirmBox.setButtonLabels('ตกลง');
    confirmBox.setConfig({
      layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
  });
  const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
    if (resp.success==true){}
    subscription.unsubscribe();
  });
   }else{
    
    this.SpinnerService.show();
    //let headers = new HttpHeaders();
    //headers = headers.set('Content-Type','application/json');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer szdp79a2kz4wh4frjzuqu4sz6qeth8m3',
    });

    var student = JSON.stringify({
      "user_name" : this.loginFrom.nativeElement["username"].value,
      "password" : this.loginFrom.nativeElement["passwd"].value,
    });
    //console.log(student)
    this.http.post('/taxcApi/API/login', student , {headers:headers}).subscribe(
        (response) =>{
          //console.log(response)
          let res : any = JSON.parse(JSON.stringify(response));
          console.log(res)
          if(res.result=='1'){
            this.sessJson = JSON.stringify({
              "courtId": res.courtId,
              "courtName": res.courtName,
              "courtRunning":res.courtRunning,
              "courtTypeId":res.courtTypeId,
              "courtProvId": res.courtProvId,
              "courtProvName": res.courtProvName,
              "courtAmphurId": res.courtAmphurId,
              "courtAmphurName": res.courtAmphurName,
              "courtTambonId": res.courtTambonId,
              "courtTambonName": res.courtTambonName,
              "courtPostNo": res.courtPostNo,
              "depCode":res.depCode,
              "depName": res.depName,
              "lastActive":res.lastActive,
              "loginDate":res.loginDate,
              "offName":res.offName,
              "postId":res.postId,
              "postName":res.postName,
              "userCode":res.userCode,
              "userName":res.userName,
              "userRunning":res.userRunning,
              "userToken":res.userToken,
              "userLevel":res.userLevel,
              "isLoggedIn":true,
              "defaultCaseType": res.defaultCaseType,
              "defaultCaseTypeText": res.defaultCaseTypeText,
              "defaultRedTitle": res.defaultRedTitle,
              "defaultTitle": res.defaultTitle,
              "defaultCaseCate": res.defaultCaseCate,
              "defaultCaseCateText": res.defaultCaseCateText,
              "error": res.error,
              "qrCodeLink": res.qrCodeLink,
              "receiptFlag": res.receiptFlag,
              "shortCourtName": res.shortCourtName,
              "appName": res.appName,
              "postAmt": res.postAmt,
              "copyLimit": res.numGenCase,
              "directorId":res.directorId,
              "directorName":res.directorName,
              "directorPostName":res.directorPostName,
              "headJudgeId":res.headJudgeId,
              "headJudgeName":res.headJudgeName,
              "headJudgePost":res.headJudgePost,
              "AlertLogin":true,
              });
              localStorage.setItem(this.authService.sessJson, this.sessJson);
              //sessionStorage.setItem(this.authService.sessionStor,'isLoggedIn');
              this.authService.login();
              if(res.userLevel=='A')
                this.router.navigate(['/main']);
              else{
                 var student = JSON.stringify({
                  "userToken" : res.userToken,
                  "user_running": res.userRunning.toString(),
                  "dep_code": '0'
                  });
                
                console.log(student)
                this.http.post('/taxcApi/API/getMenu', student ).subscribe(
                  (response) =>{
                    let res : any = JSON.parse(JSON.stringify(response));
                    localStorage.setItem(this.authService.menuJson, JSON.stringify(res));
                    
                    //console.log(res.menu)
                  },
                  (error) => {
                    
                  },
                  () => this.router.navigate(['/menu_center',res.depCode])
                )
                
              }
                
          }else{
            confirmBox.setMessage(res.error);
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){
              this.router.navigate(['/login']);
            }
            subscription.unsubscribe();
          });
            
          }
 
          
          this.SpinnerService.hide();
        },
        (error) => {
          this.SpinnerService.hide();
          //this.authService.logout();
          this.router.navigate(['/login']);
        }
      )
      //this.authService.login()
    }
  }


}
