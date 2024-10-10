import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { DialogLayoutDisplay, ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
declare var myExtObject: any;
@Component({
  selector: 'app-popup-list-document',
  templateUrl: './popup-list-document.component.html',
  styleUrls: ['./popup-list-document.component.css']
})
export class PopupListDocumentComponent implements AfterViewInit,OnInit {
  @Input() courtId: number;

  @Output() onClickList = new EventEmitter<any>();
  sessData:any;
  userData:any;
  modalType:any;
  myExtObject: any;
  items:any = [];
  result:any = [];
  getCaseCate:any;
  value6Array:any;
  getCourtId:any;
  getDepCode:any;

  masterSelect:boolean = false;
  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
  ) { 
    
  }

  ngOnInit(): void {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.result.dep_code = this.userData.depCode;

    this.searchDataList();
    var student = JSON.stringify({
      "table_name" : "pcourt", 
      "field_id" : "court_id",
      "field_name" : "court_name",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        this.getCourtId = getDataOptions;
      },
      (error) => {}
    )

    var student = JSON.stringify({
      "table_name" : "pdepartment", 
      "field_id" : "dep_code",
      "field_name" : "dep_name",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        this.getDepCode = getDataOptions;
      },
      (error) => {}
    )

    if(this.courtId)
      this.result.court_id = this.courtId;
    this.result.sdate = myExtObject.curDate();
    this.result.edate = myExtObject.curDate();
  }

  ngAfterViewInit(): void {
    myExtObject.callCalendar();
  }

  directiveDate(date:any, obj:any){
    this.result[obj] = date;
  }

  checkUncheckAll(obj:any,master:any,child:any) {
    for (var i = 0; i < obj.length; i++) {
      obj[i][child] = this[master];
    }
  }

  isAllSelected(obj:any,master:any,child:any) {
    this[master] = obj.every(function(item:any) {
      return item[child] == true;
    })
  }

  searchDataList(){
    var student = JSON.stringify({
      "sdate" : this.result.sdate  ? this.result.sdate : myExtObject.curDate(),
      "edate" : this.result.edate  ? this.result.edate : myExtObject.curDate(),
      "court_id" : parseInt(this.result.court_id),
      "dep_code" : this.result.dep_code ? this.result.dep_code : this.userData.depCode,
      "userToken" : this.userData.userToken});
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiCO/API/CORRESP/fco0400/popupListDocument', student).subscribe(
      datalist => {
        let getDataOptions : any = JSON.parse(JSON.stringify(datalist));
        if(getDataOptions.length){
          this.items = getDataOptions;
          this.items.forEach((x : any ) => x.index = false);
        }else{
          this.items = [];
        }
      },
      (error) => {}
    );
  }

  useDataList(){
    var dataSelect = [],dataTmpId=[];
    var bar = new Promise((resolve, reject) => {
      this.items.forEach((ele, index, array) => {
            if(ele.index == true){
              dataTmpId.push(ele.real_doc_no);
            }
        });
    });
    if(bar){
      dataSelect['real_doc_no'] = dataTmpId.toString();
      console.log($.extend({},dataSelect))
      this.onClickList.emit($.extend({},dataSelect))
    }
  }

}
