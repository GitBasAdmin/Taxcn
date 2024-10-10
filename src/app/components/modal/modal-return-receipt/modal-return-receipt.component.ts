import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
@Component({
  selector: 'app-modal-return-receipt',
  templateUrl: './modal-return-receipt.component.html',
  styleUrls: ['./modal-return-receipt.component.css']
})
export class ModalReturnReceiptComponent implements AfterViewInit,OnInit {
  @Input() items : any = [];
  @Input() run_id: number;//run_id
  @Input() pay_type: number;//run_id
  @Output() onClickList = new EventEmitter<any>();
  
  sessData:any;
  userData:any;
  getPersType:any;
  result:any = [];
  itemsTmp:any;

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
    //console.log(this.run_id+':'+this.notice_running+':'+this.send_item+':'+this.sent_amt)
  }

  ngAfterViewInit(): void {
    //console.log(this.items)
  }

  showDataList(){
    if(this.run_id){

      var student = JSON.stringify({
        "run_id" : this.run_id,
        "receipt_type_id" : this.pay_type,
        "userToken" : this.userData.userToken
      });
        console.log(student)
      this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/popupReturnReceipt', student ).subscribe(
        datalist => {
          let getDataOptions : any = JSON.parse(JSON.stringify(datalist));
          console.log(getDataOptions)
          if(getDataOptions.data.length){
            this.items = getDataOptions.data;
            this.itemsTmp = JSON.stringify(getDataOptions.data);
            /*
            for (var x = 0; x < this.items.length; x++) {
              if(this.items[x]['sel']){
                this.items[x].index = true;
              }else{
                this.items[x].index = false;
              }
            }*/
            //this.items.forEach((x : any ) => x.index = false);
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
    this.onClickList.emit(this.items[index])
  }

  


  

}
