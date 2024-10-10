import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
@Component({
  selector: 'app-popup-receipt',
  templateUrl: './popup-receipt.component.html',
  styleUrls: ['./popup-receipt.component.css']
})
export class PopupReceiptComponent implements AfterViewInit,OnInit {
  @Input() items : any = [];
  @Input() run_id: number;//run_id
  @Output() onClickList = new EventEmitter<any>();
  
  sessData:any;
  userData:any;
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
        "userToken" : this.userData.userToken
      });
        console.log(student)
      this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/popupReceipt', student).subscribe(
        datalist => {
          let getDataOptions : any = JSON.parse(JSON.stringify(datalist));
          console.log("getDataOptions=>",getDataOptions)
          if(getDataOptions.data.length){
            this.items = getDataOptions.data;
            this.itemsTmp = JSON.stringify(getDataOptions.data);
            for (var x = 0; x < this.items.length; x++) {
              if(this.items[x]['sel']){
                this.items[x].index = true;
              }else{
                this.items[x].index = false;
              }
              if(this.items[x].rcv_amt != null)
                this.items[x].rcv_amt=this.curencyFormat(this.items[x].rcv_amt,2)
            }
            //this.items.forEach((x : any ) => x.index = false);
          }else{
            this.items = [];
          }
        },
        (error) => {}
      );
    }
  }

  curencyFormat(n:any,d:any) {
    return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  }

  onClickListData(index:any): void {
    this.onClickList.emit(this.items[index])
  }

}
