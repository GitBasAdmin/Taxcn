import { Component, OnInit, Input, AfterViewInit, AfterContentInit, Output, EventEmitter, ViewChild, ElementRef,ViewEncapsulation } from '@angular/core';
import { DialogLayoutDisplay, ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { AuthService } from 'src/app/auth.service';
import { SharedRunIdService } from '@app/services/run-id.service.ts';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
declare var myExtObject: any;
import {
  CanActivateFn, Router, ActivatedRoute, NavigationStart,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChildFn,
  NavigationError
} from '@angular/router';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
	styles: [
		`
			.my-custom-class {
			}
		`,
	],
})
export class MenuComponent implements AfterViewInit, AfterContentInit, OnInit {
  sessData: any;
  userData: any;
  objMenu: any;
  objLink: any;
  jsonMenu: any;
  jsonLink: any;
  getMenu: any;
  getLink: any;
  curPage: any;
  getMail: any = [];
  myExtObject: any;
  @Input() items: any = [];
  fevorite: any;
  shareRunId: any;
  video: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private SharedRunIdService: SharedRunIdService
  ) { }

  ngOnInit() {
    this.sessData = localStorage.getItem(this.authService.sessJson);
    //console.log(this.sessData)
    this.userData = JSON.parse(this.sessData);
    //console.log(this.userData.offName);
    //console.log(localStorage.getItem(this.authService.userToken))
    //console.log(this.items)
    this.SharedRunIdService.shareRunId$
      .subscribe(shareRunId => this.shareRunId = shareRunId);
    this.curPage = window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1);
    //console.log(this.curPage)
    //this.objMenu = this.items.menu;
    console.log(this.items)
    if (this.router.url.indexOf('menu_center') > -1) {
      this.fevorite = 0;
    } else {
      this.fevorite = 1;
    }
    this.manualPage();
  }
  ngAfterViewInit(): void {
    //console.log(this.objMenu)
    /*
      this.jsonMenu = localStorage.getItem(this.authService.menuJson);
      this.getMenu=JSON.parse(this.jsonMenu);
      console.log(this.items.length)
      if(!this.items.length){
        this.objMenu = this.getMenu;
      }
    */
  }
  ngAfterContentInit() {
    //console.log(this.objMenu)
    this.jsonMenu = localStorage.getItem(this.authService.menuJson);
    this.getMenu = JSON.parse(this.jsonMenu);
    //if (!this.items.length) {
      this.objMenu = this.getMenu.menu;

      //ลิงค์ไปยังระบบอื่น 
      this.objLink = this.getMenu.other_system;
      this.objLink.forEach((ele, index, array) => {
        if(ele.system_short_name.length >11){
          ele.system_short_name = ele.system_short_name.substring(0, 10)+"..."; 
        }
      });
    //}
    //console.log(this.objMenu)

    // this.jsonLink = localStorage.getItem(this.authService.menuJson);
    // this.getLink = JSON.parse(this.jsonLink);
    // this.objLink = this.getLink;

    this.getMailBox();
  }

  redirectUrl(url: any, dep_code: any, path: any) {

    if (url == "logout") {

      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('ต้องการออกจากระบบใช่หรือไม่');
      confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        console.log(resp)
        if (resp.success == true) {
          localStorage.clear();
          //this.router.navigate(['/login']);
          var student = JSON.stringify({
            "userToken": this.userData.userToken
          });
          console.log(student)
          this.http.post('/' + this.userData.appName + 'Api/API/logout', student).subscribe(
            (response) => {
              let getDataOptions: any = JSON.parse(JSON.stringify(response));
              let winURLHref = window.location.href.split("/#/")[0] + "/#/login";
              window.location.href = winURLHref;
            },
            (error) => { }
          )

        }
        subscription.unsubscribe();
      });

      //}else if(url=="fct9908"){
      //this.router.navigate(['/officer']);
      //location.href=window.location.protocol + "//" + window.location.host+'/'+path+'/#/officer';
      //}else if(url=="fct9992"){
      //this.router.navigate(['/program']);
      //location.href=window.location.protocol + "//" + window.location.host+'/'+path+'/#/program';
      //}else if(url=="main"){
      //this.router.navigate(['/main']);
      //location.href=window.location.protocol + "//" + window.location.host+'/taxcF/#/main';
    } else {
      //console.log(window.location.protocol + "//" + window.location.host+'/'+path+'/#/'+url)
      //location.href=window.location.host+'/#/'+path+'/'+url;
      //location.href=window.location.protocol + "//" + window.location.host+'/'+path+'/#/'+url;
      //this.router.navigate(['/'+url]);
      let winURL = window.location.href;
      winURL = winURL.split("/").pop();
      if (url.indexOf('manual/') == -1) {
        if (winURL == url) {
          window.location.reload();
        } else {
          let winURLHref = window.location.href.split("/#/")[0] + "/#/";
          if (url == 'menu_center')
            window.location.href = winURLHref + url + '/' + dep_code;//this.router.navigate(['/'+url+'/'+dep_code])
          else
            window.location.href = winURLHref + url;//this.router.navigate(['/'+url])
          /*
          if(url=='menu_center')
            this.router.navigate(['/'+url+'/'+dep_code])
          else
          this.router.navigate(['/'+url])
          .then(data => {
            //console.log('Route exists, redirection is done');
          })
          .catch(e => {
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
              confirmBox.setMessage('ไม่พบหน้าจอ');
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  subscription.unsubscribe();
                }
              });
          });*/
        }
      } else {
        console.log(url)
        var name = url;
        myExtObject.OpenWindowMaxName(url, name)
      }
      //return false;
      /*
      const subscription = this.router.events.subscribe(event =>{
        console.log(event)
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');

        if (event instanceof NavigationError){
          confirmBox.setMessage('ไม่พบหน้าจอ');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){
              subscription.unsubscribe();
            }
          });
        }else{
          subscription.unsubscribe();
          this.router.navigate(['/'+url]);
        }
        
     })
     */

    }

  }

  getMailBox() {
    //======================== pcourt ======================================
    var student = JSON.stringify({
      "userToken": this.userData.userToken
    });
    //console.log(student)
    this.http.post('/' + this.userData.appName + 'ApiKN/API/KEEPN/mail/getMail', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        //console.log(getDataOptions)
        this.getMail = getDataOptions.data;
      },
      (error) => { }
    )
  }

  openMail() {
    let winURL = window.location.href.split("/#/")[0] + "/#/";
    myExtObject.OpenWindowMaxName(winURL + 'fkn0720', 'fkn0720');
  }

  saveFevorite() {
    var authen = JSON.stringify({
      "userToken": this.userData.userToken,
      "url_name": this.router.url.split("?")[0].substring(1)
    });
    console.log(authen)
    this.http.disableLoading().post('/' + this.userData.appName + 'Api/API/authen', authen).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        if (getDataOptions.programId) {
          this.saveFevoriteCommit(getDataOptions.programId);
        }
      },
      (error) => { }
    )
  }

  saveFevoriteCommit(id: any) {
    if (id) {
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('ต้องการบันทึกข้อมูลหน้าจอนี้เป็นรายการโปรด ใช่หรือไม่');
      confirmBox.setButtonLabels('ตกลง', 'ยกเลิก');
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        console.log(resp)
        if (resp.success == true) {
          var authen = JSON.stringify({
            "userToken": this.userData.userToken,
            "program_id": id
          });
          console.log(authen)
          this.http.post('/' + this.userData.appName + 'Api/API/saveProgramFevorite', authen).subscribe(
            (response) => {
              let getDataOptions: any = JSON.parse(JSON.stringify(response));
              console.log(getDataOptions)
              const confirmBox2 = new ConfirmBoxInitializer();
              confirmBox2.setTitle('ข้อความแจ้งเตือน');
              confirmBox2.setMessage(getDataOptions.error);
              confirmBox2.setButtonLabels('ตกลง');
              confirmBox2.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                if (resp.success == true) {
                  subscription2.unsubscribe();
                }
              });
            },
            (error) => { }
          )
        }
        subscription.unsubscribe();
      });


    }
  }

  fkb0700Page() {
    let winURL = window.location.href.split("/#/")[0] + "/#/";
    var name = 'fkb0700';
    if (this.shareRunId)
      myExtObject.OpenWindowMaxName(winURL + 'fkb0700?run_id=' + this.shareRunId, name);
    else
      myExtObject.OpenWindowMaxName(winURL + 'fkb0700', name);
  }

  manualPage() {
    let winURL = window.location.href.split("/#/")[1].split('?')[0];
    //console.log(winURL)
    var authen = JSON.stringify({
      "userToken": this.userData.userToken,
      "url_name": winURL
    });
    //console.log(authen)
    this.http.post('/' + this.userData.appName + 'ApiManual/API/getManual', authen).subscribe(
      //this.http.post('/'+this.userData.appName+'Api/API/getManual', authen).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        //console.log(getDataOptions)
        this.video = getDataOptions.video;
      },
      (error) => { }
    )
  }

  manualIndex() {
    let winURL = window.location.href.split("/#/")[0] + "/#/";
    var name = 'manual_index';
    if (this.shareRunId)
      myExtObject.OpenWindowMaxName(winURL + 'manual_index', name);
    else
      myExtObject.OpenWindowMaxName(winURL + 'manual_index', name);
  }

  openMedia() {
    var name = 1;
    myExtObject.OpenWindowMaxName(this.video, name);
  }
}