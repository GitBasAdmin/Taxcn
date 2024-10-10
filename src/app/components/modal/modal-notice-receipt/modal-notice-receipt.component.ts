import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
@Component({
  selector: 'app-modal-notice-receipt',
  templateUrl: './modal-notice-receipt.component.html',
  styleUrls: ['./modal-notice-receipt.component.css']
})
export class ModalNoticeReceiptComponent implements AfterViewInit,OnInit {
  @Input() items : any = [];
  @Input() run_id: string;//run_id
  @Output() onClickList = new EventEmitter<any>();
  
  sessData:any;
  userData:any;
  getPersType:any;
  result:any = [];

  constructor(
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService
  ) { 

  }

  ngOnInit(): void {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.showDataList();
    console.log(this.run_id)
  }

  ngAfterViewInit(): void {
    //console.log(this.items)
  }

  showDataList(){
    if(this.run_id){
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      var student = JSON.stringify({
        "run_id" : this.run_id,
        "userToken" : this.userData.userToken
      });
        console.log(student)
      this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fsn1600/getSendNotice', student , {headers:headers}).subscribe(
        datalist => {
          let getDataOptions : any = JSON.parse(JSON.stringify(datalist));
          console.log(getDataOptions)
          if(getDataOptions.data.length){
            this.items = getDataOptions.data;
          }else{
            this.items = [];
          }
        },
        (error) => {}
      );
    }
  }

  searchDataList(){
    if(this.result.word_id){
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');

      this.SpinnerService.show();
      var student = JSON.stringify({
        "pers_type" : this.result.word_id,
        "pers_desc" : this.result.word_desc,
        "userToken" : this.userData.userToken
      });
        console.log(student)
      
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct0109/search', student , {headers:headers}).subscribe(
        datalist => {
          let getDataOptions : any = JSON.parse(JSON.stringify(datalist));
          console.log(getDataOptions)
          if(getDataOptions.data.length){
            this.items = getDataOptions.data;
            this.SpinnerService.hide();
          }else{
            this.items = [];
            this.SpinnerService.hide();
          }
        },
        (error) => {}
      );
    }
  }

  onClickListData(index:any): void {
    //this.onClickList.emit(this.items[index][this.value2]+':'+this.items[index][this.value3])
    this.onClickList.emit(this.items[index])
  }

  

}
