import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Input   } from '@angular/core';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";

import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { indexOf } from 'lodash';
import { param } from 'jquery';
declare var myExtObject: any;

@Component({
  selector: 'app-case-header',
  templateUrl: './case-header.component.html',
  styleUrls: ['./case-header.component.css']
})
@Injectable()
export class CaseHeaderComponent implements OnInit {
  sessData:any;
  userData:any;
  programName:any;
  defaultCaseType:any;
  fromPage:any;
  myExtObject: any;
  run_id:any;
  receipt_running:any;
  notice_running:any;
  appeal_running:any;
  urlName:any;
  hidden:any;

  @Input()  formGroup: FormGroup;
  headerFormGroup :FormGroup;
  @Input() set runId(runId: any) {
    if(typeof runId === 'object'){
      this.run_id = runId['run_id'];
      this.receipt_running = runId['rRunning'];;
    }else{
      this.run_id = runId;
    }
    
    console.log(runId)
  }
  @Input() set appealRunning(appealRunning: any) {
    console.log(appealRunning)
    if(typeof appealRunning != 'undefined')
      this.appeal_running = appealRunning;
    else
      this.appeal_running='';
  }
  @Input() set noticeRunning(noticeRunning: any) {
    console.log(noticeRunning)
    if(typeof noticeRunning != 'undefined')
      this.notice_running = noticeRunning;
    else
      this.notice_running='';
  } 

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ){
    this.headerFormGroup = this.formBuilder.group({
      sample: [''],
    })
   }

  ngOnInit(): void {
    //console.log(this.router.url.substring(1))
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.urlName=this.router.url.substring(1);
    console.log(this.router.url.substring(1))
    let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      var authen = JSON.stringify({
        "userToken" : this.userData.userToken,
        "url_name" : this.router.url.substring(1)
      });
      //console.log(authen)
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen , {headers:headers}).subscribe(
        (response) =>{
          let getDataAuthen : any = JSON.parse(JSON.stringify(response));
          this.programName = getDataAuthen.programName;
          if(this.programName.includes('prdo0200') || this.programName.includes('prdo0500') || 
             this.programName.includes('prdo0800') || this.programName.includes('prdo1200') ||
             this.programName.includes('prdo1300') || this.programName.includes('prdo1500') ||
             this.programName.includes('prdo1600') || this.programName.includes('prdo1800') ||
             this.programName.includes('prdo2600') || 
             
             this.programName.includes('prkr0100') || this.programName.includes('prkr0500') ||
             this.programName.includes('prkr0700') || this.programName.includes('prkr0800') ||
             this.programName.includes('prkr0900') || this.programName.includes('prkr1000') ||
             this.programName.includes('prst5500') || this.programName.includes('prst6400') || 
             
             this.programName.includes('prci0500') || this.programName.includes('prci0600') ||
             this.programName.includes('prci0700') || this.programName.includes('prci1200') ||
             this.programName.includes('prci1300') || this.programName.includes('prci1400') ||
             this.programName.includes('prci1500') || this.programName.includes('prci1800') ||
             this.programName.includes('prci1900') || this.programName.includes('prci2100') ||
             this.programName.includes('prci2200') || this.programName.includes('prci2600') ||
             this.programName.includes('prci2700') || this.programName.includes('prci2900') ||
             this.programName.includes('prci4000') ||

             this.programName.includes('prpo0300') || this.programName.includes('prpo0500') ||
             this.programName.includes('prpo0900') || this.programName.includes('prpo1400') ||
             this.programName.includes('prpo1500') || this.programName.includes('prpo1700') ||
             this.programName.includes('prpo1900') ||

             this.programName.includes('prkb0500') || this.programName.includes('prkb0800') ||
             this.programName.includes('prkb1000') || this.programName.includes('prkb1100') || 
             this.programName.includes('prkb1300') ||

             this.programName.includes('prmg0100') || this.programName.includes('prmg0200') ||
             this.programName.includes('prmg0300') || this.programName.includes('prmg0400') || 
             this.programName.includes('prmg0700') || this.programName.includes('prmg0500') ||
             this.programName.includes('prmg2800') ||

             this.programName.includes('prsc0100') || this.programName.includes('prsc0200') ||
             this.programName.includes('prsc0201') || this.programName.includes('prsc0400') || 
             this.programName.includes('prsc0700') || this.programName.includes('prsc0800') ||
             this.programName.includes('prsc0900') ||

             this.programName.includes('prca0500') || this.programName.includes('prca0800') ||
             this.programName.includes('prca1800') || this.programName.includes('prca1910') || 
             this.programName.includes('prca2100') || this.programName.includes('prca3000') ||

             this.programName.includes('prud0200') || this.programName.includes('prud0300') ||
             this.programName.includes('prud0410') || this.programName.includes('prud0420') ||
             this.programName.includes('prud0500') || this.programName.includes('prud0600') ||
             this.programName.includes('prud0900') || this.programName.includes('prud1100') ||
             this.programName.includes('prud2000') || this.programName.includes('prud2100') ||
             this.programName.includes('prud2600') ||

             this.programName.includes('prst5500') || this.programName.includes('prst6400') ||

             this.programName.includes('prsn0100') || this.programName.includes('prsn1100') ||
             this.programName.includes('prsn1200') || this.programName.includes('prsn1900') ||
             this.programName.includes('prsn2100') || this.programName.includes('prsn3400') ||

             this.programName.includes('prsc0100') || this.programName.includes('prsc0200') ||
             this.programName.includes('prsc0201') || this.programName.includes('prsc0400') ||
             this.programName.includes('prsc0700') || this.programName.includes('prsc0800') ||
             this.programName.includes('prsc0900') ||

             this.programName.includes('prpo0300') || this.programName.includes('prpo0500') ||
             this.programName.includes('prpo0900') || this.programName.includes('prpo1400') ||
             this.programName.includes('prpo1500') || this.programName.includes('prpo1700') ||
             this.programName.includes('prpo1900') ||

             this.programName.includes('prno3000') || this.programName.includes('prno3700') ||
             this.programName.includes('prno3800') || this.programName.includes('prno4000') ||
             this.programName.includes('prno5000') ||
             
             this.programName.includes('prmg0100') || this.programName.includes('prmg0200') ||
             this.programName.includes('prmg0300') || this.programName.includes('prmg0400') ||
             this.programName.includes('prmg0700') || this.programName.includes('prmg0500') ||
             this.programName.includes('prmg2800') ||
                          
             this.programName.includes('prkr0100') || this.programName.includes('prkr0500') ||
             this.programName.includes('prkr0700') || this.programName.includes('prkr0800') ||
             this.programName.includes('prkr0900') || this.programName.includes('prkr1000') ||
                          
             this.programName.includes('prkn0100') ||
                                       
             this.programName.includes('prkb0500') || this.programName.includes('prkb0800') ||
             this.programName.includes('prkb1000') || this.programName.includes('prkb1100') ||
             this.programName.includes('prkb1300') ||
             
             this.programName.includes('prju0200') || this.programName.includes('prju0300') ||
             this.programName.includes('prju0700') || this.programName.includes('prju0800') ||
             this.programName.includes('prju1100') || this.programName.includes('prju1200') ||
             this.programName.includes('prju2000') || this.programName.includes('prju2400') ||
             
             this.programName.includes('prgu0300') || this.programName.includes('prgu0400') ||
             this.programName.includes('prgu0410') || this.programName.includes('prgu2400') ||
             this.programName.includes('prgu2500') || this.programName.includes('prgu2600') ||
             this.programName.includes('prgu2900') || this.programName.includes('prgu3100') ||
             
             this.programName.includes('prfn1200') || this.programName.includes('prfn6000') ||
             this.programName.includes('prfn6100') || this.programName.includes('prfn6200') ||
             this.programName.includes('prfn6400') || this.programName.includes('prfn6500') ||
             this.programName.includes('prfn7200') || this.programName.includes('prfn7300') ||
             this.programName.includes('prfn7410') || this.programName.includes('prfn7420') ||
             this.programName.includes('prfn7430') || this.programName.includes('prfn7440') ||
             this.programName.includes('prfn7450') || this.programName.includes('prfn7460') ||
             this.programName.includes('prfn7470') ||
       
             this.programName.includes('prdo0200') || this.programName.includes('prdo0500') ||
             this.programName.includes('prdo0800') || this.programName.includes('prdo1200') ||
             this.programName.includes('prdo1300') || this.programName.includes('prdo1500') ||
             this.programName.includes('prdo1600') || this.programName.includes('prdo1800') ||
             this.programName.includes('prdo2600') ||
                    
             this.programName.includes('prco0200') || this.programName.includes('prco0300') ||
             this.programName.includes('prco1100') ||
             
             this.programName.includes('prci0500') || this.programName.includes('prci0600') ||
             this.programName.includes('prci0700') || this.programName.includes('prci1200') ||
             this.programName.includes('prci1300') || this.programName.includes('prci1400') ||
             this.programName.includes('prci1500') || this.programName.includes('prci1800') ||
             this.programName.includes('prci1900') || this.programName.includes('prci2100') ||
             this.programName.includes('prci2200') || this.programName.includes('prci2600') ||
             this.programName.includes('prci2700') || this.programName.includes('prci2900') ||
             this.programName.includes('prci4000') ||
  
             this.programName.includes('prca0500') || this.programName.includes('prca0800') ||
             this.programName.includes('prca1800') || this.programName.includes('prca1910') ||
             this.programName.includes('prca2100') || this.programName.includes('prca3000') ||
               
             this.programName.includes('pras0100') ||
             
             this.programName.includes('prap0700') || this.programName.includes('prap0800') ||
             this.programName.includes('prap0900') || this.programName.includes('prap1500') ||
             this.programName.includes('prap3000') || this.programName.includes('prap3040') ||
             this.programName.includes('prap4200') || this.programName.includes('prap4300') ||
             this.programName.includes('prap4600') || this.programName.includes('prap4800') ||
             this.programName.includes('prap4900') || this.programName.includes('prap5500') ||
             this.programName.includes('prap6600')

             ){
            this.hidden = 1;
          }
          //console.log(getDataAuthen)
        },
        (error) => {}
      )
    
  }

  ngAfterViewInit(): void {
    //console.log(this.headerFormGroup)
  }
    
  ngOnDestroy(): void {

  }


  openNewTab(url:any){
    //console.log(window.location.href)
    //let winURL = this.authService._baseUrl;
    let winURL = window.location.href;

    //console.log(window.location.hash)
    //winURL = 'http://localhost:4200/#/fca0130/150733/0/253959#xvdsfds#dfafdsa';
    console.log(winURL)
  
    var rootUrl = winURL.substring(0,winURL.indexOf("#")+1)+"/";//================= root url
    var parent = winURL.substring(winURL.indexOf("#")+2,winURL.length);

    if(parent.indexOf('?') === -1 ){
      var parentUrl = parent;
    }else{
      var parentUrl = parent.substring(0,parent.indexOf("?"));//================= parent url
    }
    console.log('parentUrl:'+parentUrl)
    console.log('run_id:'+this.run_id)
    if(parentUrl=='fca0200' || parentUrl=='fap0100' || parentUrl=='ffn0400' || parentUrl=='fpo0100'){
      if(this.run_id){
        if(parentUrl=='ffn0400')
          myExtObject.OpenWindowMax(rootUrl+url+'?program='+parentUrl+'&run_id='+this.run_id+'&receipt_running='+this.receipt_running);
        else
          myExtObject.OpenWindowMax(rootUrl+url+'?program='+parentUrl+'&run_id='+this.run_id);
      }else{
        if(parentUrl=='ffn0400')
          myExtObject.OpenWindowMax(rootUrl+url+'?program='+parentUrl+'&receipt_running='+this.receipt_running);
        else
          myExtObject.OpenWindowMax(rootUrl+url+'?program='+parentUrl);
      }
    }else{
      if(url=='fca0130' || parentUrl=='fca0150' || parentUrl=='fkn0200' || parentUrl=='fkn0100' || parentUrl=='fkn0300' || parentUrl=='fkn0800' || parentUrl=='fca0220' || parentUrl=='fca0230' || parentUrl=='fno0900' || parentUrl=='fud0100' || parentUrl=='fsn1600'){
        if(this.run_id){
          if(parentUrl=='fno0900'){
            var param='?program='+parentUrl+'&run_id='+this.run_id;
            if(this.notice_running)
              param +='&notice_running='+this.notice_running;
            if(this.appeal_running)
              param +='&appeal_running='+this.appeal_running;

            myExtObject.OpenWindowMax(rootUrl+url+param);
          }else if(parentUrl=='fud0100'){
            myExtObject.OpenWindowMax(rootUrl+url+'?program='+parentUrl+'&run_id='+this.run_id+'&appeal_running='+this.appeal_running);
          }else{
            myExtObject.OpenWindowMax(rootUrl+url+'?run_id='+this.run_id);
          }
        }else{
          if(parentUrl=='fno0900'){
            myExtObject.OpenWindowMax(rootUrl+url+'?program='+parentUrl+'&notice_running='+this.notice_running+'&appeal_running='+this.appeal_running);
          }else if(parentUrl=='fud0100'){
            myExtObject.OpenWindowMax(rootUrl+url+'?program='+parentUrl+'&appeal_running='+this.appeal_running);
          }else
          {
            myExtObject.OpenWindowMax(rootUrl+url);
          }
        }
      }else{
        if(this.run_id && (url!='fca0300' && url!='fkn0500' && url!='fap0200'))
          myExtObject.OpenWindowMax(rootUrl+url+'?run_id='+this.run_id);
        else
          myExtObject.OpenWindowMax(rootUrl+url);
      }
      
    }
    
  }
  



}
