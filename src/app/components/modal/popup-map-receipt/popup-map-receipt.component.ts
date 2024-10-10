import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
@Component({
  selector: 'app-popup-map-receipt',
  templateUrl: './popup-map-receipt.component.html',
  styleUrls: ['./popup-map-receipt.component.css']
})
export class PopupMapReceiptComponent implements AfterViewInit,OnInit {
  @Input() items : any = [];
  @Input() run_id: number;
  @Input() guar_running: number;
  @Input() forfeit_seq: number;
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
  }

  ngAfterViewInit(): void {
  }

  showDataList(){
    console.log(this.run_id ,this.guar_running,this.forfeit_seq);
    if(this.run_id &&  this.guar_running &&  this.forfeit_seq){
      var student = JSON.stringify({
        "run_id" : this.run_id,
        "guar_running" : this.guar_running,
        "forfeit_seq" : this.forfeit_seq,
        "userToken" : this.userData.userToken
      });
        console.log(student)
      this.http.post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/fgu0100/popupMapReceipt ', student).subscribe(
        datalist => {
          let getDataOptions : any = JSON.parse(JSON.stringify(datalist));
          console.log("getDataOptions=>",getDataOptions)
          if(getDataOptions.data.length){
            this.items = getDataOptions.data;
          }else{
            this.items = [];
          }
        },
        (error) => {}
      );
    }else{
      this.items = [];
    }
  }

  curencyFormat(n:any,d:any) {
    return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  }

  onClickListData(index:any): void {
    this.onClickList.emit(this.items[index])
  }

}
