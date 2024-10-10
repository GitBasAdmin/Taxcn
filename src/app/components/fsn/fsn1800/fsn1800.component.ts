import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap'; 
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgSelectComponent } from '@ng-select/ng-select';
// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';

import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-fsn1800,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fsn1800.component.html',
  styleUrls: ['./fsn1800.component.css']
})


export class Fsn1800Component implements AfterViewInit, OnInit, OnDestroy {
  getDayType:any;selDayType:any;
  getSendOfficer:any;
  getProv:any;selProv:any;
  getAmphur:any;selAmphur:any;
  getTambon:any;selTambon:any;postCode:any;
  getNoticeAmt:any;selNoticeAmt:any;
  sessData:any;
  userData:any;
  programName:any;
  defaultCaseType:any;
  defaultCaseTypeText:any;
  defaultTitle:any;
  defaultRedTitle:any;
  asyncObservable: Observable<string>;
 
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;
  
  //@ViewChild('fca0200',{static: true}) fca0200 : ElementRef;
  //@ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  //@ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  //@ViewChild('crudModal') crudModal: ElementRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 
  @ViewChild('sProv') sProv : NgSelectComponent;
  @ViewChild('sAmphur') sAmphur : NgSelectComponent;
  @ViewChild('sTambon') sTambon : NgSelectComponent;

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService
  ){ }
   
  ngOnInit(): void {

    
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    //======================== psentnotice_officer ======================================
    var student = JSON.stringify({
      "table_name" : "psentnotice_officer",
      "field_id" : "off_id",
      "field_name" : "off_name",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        getDataOptions.unshift({fieldIdValue:0,fieldNameValue: ''});
        this.getSendOfficer = getDataOptions;

      },
      (error) => {}
    )
    //======================== pprovince ======================================
    var student = JSON.stringify({
      "table_name" : "pprovince",
      "field_id" : "prov_id",
      "field_name" : "prov_name",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getProv = getDataOptions;
        //this.selProv = this.getProv.find((x:any) => parseInt(x.fieldIdValue) === parseInt(this.userData.courtProvId)).fieldNameValue
        this.changeProv(this.userData.courtProvId);
      },
      (error) => {}
    )

    this.getDayType = [{fieldIdValue:1,fieldNameValue: 'วันที่จ่ายหมาย'},{fieldIdValue:2,fieldNameValue: 'วันที่บันทึกผลหมาย'},{fieldIdValue:3,fieldNameValue: 'วันที่ส่งหมาย'}];
    this.selDayType = this.getDayType.find((x:any) => x.fieldIdValue === 1).fieldNameValue
    this.getNoticeAmt = [{fieldIdValue:0,fieldNameValue: 'ทั้งหมด'},{fieldIdValue:1,fieldNameValue: 'ที่ยังไม่มีค่านำหมาย'},{fieldIdValue:2,fieldNameValue: 'ที่มีค่านำหมายแล้ว'}];
    this.selNoticeAmt = this.getNoticeAmt.find((x:any) => x.fieldIdValue === 0).fieldNameValue
    //this.asyncObservable = this.makeObservable('Async Observable');
    this.successHttp();
    
  }

  /*makeObservable(value: string): Observable<string> {
    return of(value).pipe(delay(3000));
  }*/
  changeProv(province:any){
    this.sAmphur.clearModel();this.sTambon.clearModel();
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var student = JSON.stringify({
      "table_name" : "pamphur",
      "field_id" : "amphur_id",
      "field_name" : "amphur_name",
      "condition" : " AND prov_id='"+province+"'",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getAmphur = getDataOptions;
        this.selProv = province;
      },
      (error) => {}
    )
  }
  changeAmphur(Amphur:any){
    this.sTambon.clearModel();
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var student = JSON.stringify({
      "table_name" : "ptambon",
      "field_id" : "tambon_id",
      "field_name" : "tambon_name",
      "condition" : " AND amphur_id='"+Amphur+"' AND prov_id='"+this.selProv+"'",
      "userToken" : this.userData.userToken
    });
    //console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getTambon = getDataOptions;
      },
      (error) => {}
    )
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fca0200"
    });
    let promise = new Promise((resolve, reject) => {
      //let apiURL = `${this.apiRoot}?term=${term}&media=music&limit=20`;
      //this.http.get(apiURL)
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen , {headers:headers})
        .toPromise()
        .then(
          res => { // Success
          //this.results = res.json().results;
          let getDataAuthen : any = JSON.parse(JSON.stringify(res));
          console.log(getDataAuthen)
          this.programName = getDataAuthen.programName;
          this.defaultCaseType = getDataAuthen.defaultCaseType;
          this.defaultCaseTypeText = getDataAuthen.defaultCaseTypeText;
          this.defaultTitle = getDataAuthen.defaultTitle;
          this.defaultRedTitle = getDataAuthen.defaultRedTitle;
            resolve(res);
          },
          msg => { // Error
            reject(msg);
          }
        );
    });
    return promise;
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    // Destroy the table first
    dtInstance.destroy();
    // Call the dtTrigger to rerender again
    this.dtTrigger.next(null);
      });}
      
 ngAfterViewInit(): void {
    this.dtTrigger.next(null);
     }
    
  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }

 




}







