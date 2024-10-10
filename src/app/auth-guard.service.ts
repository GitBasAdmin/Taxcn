import { Injectable,Component,ViewEncapsulation,OnInit } from '@angular/core';
import { ConfirmBoxInitializer, DialogLayoutDisplay } from '@costlydeveloper/ngx-awesome-popup';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgbModal, NgbModalRef   } from '@ng-bootstrap/ng-bootstrap';
//import { ModalManualComponent } from '@app/modal/modal-manual/modal-manual.component';
//import { ToolbarComponent } from '@app/navigation/toolbar/toolbar.component';
// import ส่วนที่จะใช้งาน guard เช่น CanActivateFn, CanActivateChildFn เป็นต้นมาใช้งาน
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
// import service ที่เช็คสถานะการล็อกอินมาใช้งาน
import { AuthService } from './auth.service';
import { tap, map ,catchError} from 'rxjs/operators';
import {Observable,of, Subject,takeUntil  } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { delay } from 'rxjs/operators';


@Injectable()
export class AuthGuardService implements  OnInit {
  sessData:any;
  userData:any;
  authenUser:any;

  // inject AuthService และ Router 
  constructor(
    private authService: AuthService, 
    private router: Router,
    private http: HttpClient,
    private ngbModal: NgbModal,
    //private toolbarComponent: ToolbarComponent,
    ) {
      
    }
   
  // กำนหนด guard ในส่วนของการใช้งานกับ  canActivate
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    //console.log('canActivate run');
    let url: string = state.url; // เก็บ url ที่พยายามจะเข้าใช้งาน
    // จะผ่านเข้าใช้งานได้เมื่อ คืนค่าเป็น true โดยเข้าไปเช็คค่าจากคำสั่ง checkLogin()
    return this.checkLogin(url); // คืนค่าการตรวจสอบสถานะการล็อกอิน

  }
 
  // กำนหนด guard ในส่วนของการใช้งานกับ  CanActivateChildFn ส่วนนี้จะใช้กับ path ของ route ย่อย
  // ถ้าเข้าผ่าน route path ย่อย guard จะเข้ามาเช็คในส่วนนี้ก่อน กลับไปเช็คในส่วนของ canActivate()
  CanActivateChildFn(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    //console.log('CanActivateChildFn run');
    // จะเข้าใช้งานได้เมื่อ คืนค่าเป็น true โดยจะใช้ค่าจากการเรียกใช้คำสั่ง canActivate()
    //return this.canActivate(route, state);
    return
  }
 
  // ฟังก์ชั่นเช็คสถานะการล็อกอิน รับค่า url ที่ผู้ใช้พยายามจะเข้าใช้งาน
  async checkLogin(url: string): Promise<boolean> {
    // ถ้าตรวจสอบค่าสถานะการล็อกอินแล้วเป็น true ก็ให้คืนค่า true กลับอกไป
    //console.log(this.checkLoginAuth(url)['__zone_symbol__value']);
    //this.checkLoginAuth(url);
    this.sessData=localStorage.getItem(this.authService.sessJson);
    //console.log(this.sessData)
    this.userData = JSON.parse(this.sessData);

    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    //console.log(this.userData)
    if(typeof this.userData =='undefined' || !this.userData){
      confirmBox.setMessage('กรุณา Login เพื่อเข้าสู่ระบบ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.DANGER // success | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
      return false;
    }
    
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : url.substring(1).split('?')[0]
    });
    //console.log(authen)

    await this.http.post('/'+this.userData.appName+'Api/API/authen', authen)
    .pipe(delay(1000))
    .toPromise()
    .then(t => {
      this.authenUser = JSON.parse(JSON.stringify(t))
    });
    /* await this.http.post('/lawyerApiAU/API/authen', authen)
    .pipe(delay(1000))
    .toPromise()
    .then(t => {
      this.authenUser = JSON.parse(JSON.stringify(t))
    }); */
    //console.log(this.authenUser)
    //console.log(this.authService.isLoggedIn +":"+this.userData.isLoggedIn)
    if ((this.authService.isLoggedIn || this.userData.isLoggedIn) && this.authenUser.result) { 
      
      //console.log(this.userData)
      let localStorageJsonData = JSON.parse(JSON.stringify(this.userData));
      //localStorageJsonData.programName = this.authenUser.programName+'('+this.authenUser.urlName+')';
      localStorageJsonData.programName = this.authenUser.programName;
      localStorageJsonData.urlName = this.authenUser.urlName;
      localStorage.setItem(this.authService.sessJson, JSON.stringify(localStorageJsonData));

     /*  var sessData2=localStorage.getItem(this.authService.sessJson);
      var userData2 = JSON.parse(sessData2);
      console.log(userData2) */
      //this.toolbarComponent.getManualData(JSON.stringify(localStorageJsonData));
      return true; 
    }
    //var ret = 0;
    if(!this.authenUser.result && this.authenUser.result!='99'){
      confirmBox.setMessage(this.authenUser.error);
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.DANGER // success | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){}
        subscription.unsubscribe();
      });
      /* confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.DANGER // success | INFO | NONE | DANGER | WARNING
        //animationIn: AppearanceAnimation.BOUNCE_IN, // BOUNCE_IN | SWING | ZOOM_IN | ZOOM_IN_ROTATE | ELASTIC | JELLO | FADE_IN | SLIDE_IN_UP | SLIDE_IN_DOWN | SLIDE_IN_LEFT | SLIDE_IN_RIGHT | NONE
        //animationOut: DisappearanceAnimation.BOUNCE_OUT, // BOUNCE_OUT | ZOOM_OUT | ZOOM_OUT_WIND | ZOOM_OUT_ROTATE | FLIP_OUT | SLIDE_OUT_UP | SLIDE_OUT_DOWN | SLIDE_OUT_LEFT | SLIDE_OUT_RIGHT | NONE
        //buttonPosition: 'right', // optional 
        });
        const subscription = confirmBox.openConfirmBox$()
        .pipe(
          tap(value => {
            if (value.success) {
              //"Deleted successfully";
            }
          }),
          catchError(error => {
            console.log("error in dialog box");
            return of(null);
          }),
          takeUntil(this.destroy$)
          
        ).subscribe().unsubscribe(); */
        
    }else if(!this.authService.isLoggedIn && !this.userData.isLoggedIn){
      confirmBox.setMessage('กรุณา Login เพื่อเข้าสู่ระบบ');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.DANGER // success | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){}
            subscription.unsubscribe();
          });
    }else if(this.authenUser.result=='99'){
      confirmBox.setMessage(this.authenUser.error);
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.DANGER // success | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){}
            subscription.unsubscribe();
          });
    }
  /*if(ret){
      this.authService.redirectUrl = url; // redirectUrl เป็นตัวแปรที่อยู่ใน authService
      this.router.navigate(['/login']);// ลิ้งค์ไปยังหน้าล็อกอิน เพื่อล็อกอินเข้าใช้งานก่อน
      alert(99)
      return false; // คืนค่า false กรณียังไม่ได้ล็อกอิน
    } */
    /*
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : url.substring(1)
    });
    //console.log(authen)
    return this.http.post('/'+this.userData.appName+'Api/API/authen', authen).pipe(
      tap(val => {console.log('success message. ', val)}
      )
    )*/
    /*
    this.http.post('/'+this.userData.appName+'Api/API/authen', authen ).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        if(!getDataOptions.result){
          confirmBox.setMessage(getDataOptions.error);
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.DANGER // success | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){
              return false;
            }
            subscription.unsubscribe();
          });
          
        }else{
          if (this.authService.isLoggedIn) { 
            return true; 
          }
          confirmBox.setMessage('กรุณา Login เพื่อเข้าสู่ระบบ');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.DANGER // success | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){
              //this.SpinnerService.hide();
            }
            subscription.unsubscribe();
          });
          // แต่ถ้ายังไม่ได้ล็อกอิน ให้เก็บ url ที่พยายามจะเข้าใช้งาน สำหรับไว้ลิ้งค์เปลี่ยนหน้า
          this.authService.redirectUrl = url; // redirectUrl เป็นตัวแปรที่อยู่ใน authService
          // ลิ้งค์ไปยังหน้าล็อกอิน เพื่อล็อกอินเข้าใช้งานก่อน
          this.router.navigate(['/login']);
          return false; // คืนค่า false กรณียังไม่ได้ล็อกอิน
        }
      },
      (error) => {}
    )
    */
  }    

  start(url:any) {
    return this.checkLoginAuth(url);
  }

  async checkLoginAuth(url:any) {
    console.log('xxx')
    /*
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : url.substring(1)
    });

    var xxx = await this.http.post('/'+this.userData.appName+'Api/API/authen', authen)
      .pipe(delay(1000))
      .toPromise();
    if(xxx){
      this.authenUser = JSON.parse(JSON.stringify(xxx));
      console.log(this.authenUser)
    }
    */
      //return JSON.parse(JSON.stringify(xxx))
      
   /*
      await this.http.post('/'+this.userData.appName+'Api/API/authen', authen).toPromise().then(WeatherData => {
        return WeatherData;
    });
    */
   /*
    await this.http.post('/'+this.userData.appName+'Api/API/authen', authen)
    .pipe(delay(1000))
    .toPromise().then(WeatherData => {
      return WeatherData;
  });
  */
  }

  async checkLoginAuth2(url:any) {
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : url.substring(1)
    });
 
    let promise = new Promise((resolve, reject) => {
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen)
        .toPromise()
        .then(
          res => { // success
            this.authenUser = JSON.parse(JSON.stringify(res));
          }
        );
    });
    return promise;

  }

  ngOnInit() {
    
 }






  
 
}