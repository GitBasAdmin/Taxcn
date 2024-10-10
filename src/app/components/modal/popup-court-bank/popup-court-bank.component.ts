import { Component, OnInit,Input,Output,EventEmitter,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-popup-court-bank',
  templateUrl: './popup-court-bank.component.html',
  styleUrls: ['./popup-court-bank.component.css']
})
export class PopupCourtBankComponent implements OnInit {

  @Output() onClickList = new EventEmitter<any>();
  @ViewChild('modalForm',{static: true}) modalForm : ElementRef;
  
  sessData:any;
  userData:any;
  items:any = [];


  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private SpinnerService: NgxSpinnerService
  ) {}

  ngOnInit(): void {

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
      var student = JSON.stringify({
        "userToken" : this.userData.userToken
      });
      this.http.post('/'+this.userData.appName+'ApiFN/API/FINANCE/popupBookAccount', student).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions);
          this.items = getDataOptions.data;
        },
        (error) => {}
      )
    
  }

  onClickListData(index:any): void {
    this.onClickList.emit(this.items[index])
  }
}
