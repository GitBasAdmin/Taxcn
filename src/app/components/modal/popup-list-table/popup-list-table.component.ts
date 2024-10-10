import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-popup-list-table',
  templateUrl: './popup-list-table.component.html',
  styleUrls: ['./popup-list-table.component.css']
})
export class PopupListTableComponent implements AfterViewInit,OnInit {
  @Output() onClickList = new EventEmitter<any>();
  
  items:any = [];
  sessData:any;
  userData:any;
  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    public activeModal:NgbActiveModal
  ){ 
  
  }

  ngOnInit(): void {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.showDataList();
  }

  ngAfterViewInit(): void {
    //console.log(this.items)
  }

  showDataList(){
    var student = JSON.stringify({
      "userToken" : this.userData.userToken
    });
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/popuplistTable', student ).subscribe(
      datalist => {
        this.items = datalist;
        console.log(datalist)
      },
      (error) => {}
    );
  }

  onClickListData(index:any): void {
    this.activeModal.close(this.items[index])
  }

  

}
