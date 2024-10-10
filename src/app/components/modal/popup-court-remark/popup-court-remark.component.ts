import { Component, OnInit,Input,Output,EventEmitter,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-popup-court-remark',
  templateUrl: './popup-court-remark.component.html',
  styleUrls: ['./popup-court-remark.component.css']
})
export class PopupCourtRemarkComponent implements OnInit {
  //@Input() items : any = [];
  @Input() value1: string;

  @Output() onClickList = new EventEmitter<any>();
  @ViewChild('modalForm',{static: true}) modalForm : ElementRef;
  
  formList: FormGroup;

  sessData:any;
  userData:any;
  getCourt:any;court_name:any;notice_amt_remark:any;


  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private SpinnerService: NgxSpinnerService
  ) { 
    this.formList = this.formBuilder.group({
      word_id: [''],
      word_desc: ['']
    })
  }

  ngOnInit(): void {

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    if(this.value1 != " "){
      var student = JSON.stringify({
        "table_name" : "pcourt",
        "field_id" : "court_id",
        "field_name" : "court_name",
        "field_name2" : "notice_amt_remark",
        "field_name3" : "court_running",
        "condition": " AND court_running ='"+this.value1+"' ",
        "userToken" : this.userData.userToken
      });
      // console.log("PopupCourtRemarkstudent=>", student);
      this.http.post('/crimApiUTIL/API/getData', student).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          this.getCourt = getDataOptions;
          // console.log("PopupCourtRemarkstudent=>", this.getCourt);
          this.modalForm.nativeElement["court_id"].value = this.getCourt[0].fieldIdValue;
          this.modalForm.nativeElement["court_name"].value = this.getCourt[0].fieldNameValue;
          this.modalForm.nativeElement["notice_amt_remark"].value = this.getCourt[0].fieldNameValue2;
          this.modalForm.nativeElement["court_running"].value = this.getCourt[0].fieldNameValue3;
        },
        (error) => {}
      )
    }
  }

  ChildTestCmp(){
    var student = JSON.stringify({
      "court_running" : this.modalForm.nativeElement["court_running"].value,
      "court_id" : this.modalForm.nativeElement["court_id"].value,
      "notice_amt_remark" : this.modalForm.nativeElement["notice_amt_remark"].value
    });
    return student;
  }
}
