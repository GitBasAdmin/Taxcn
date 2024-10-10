import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
import { AnyTxtRecord } from 'dns';
@Component({
  selector: 'app-modal-guarantor-ffn',
  templateUrl: './modal-guarantor-ffn.component.html',
  styleUrls: ['./modal-guarantor-ffn.component.css']
})
export class ModalGuarantorFfnComponent implements AfterViewInit,OnInit {
  @Input() run_id : any = [];
  @Output() onClickList = new EventEmitter<any>();
  sessData:any;
  userData:any;
  modalType:any;
  result:any = [];
  items:any =[];
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
    this.searchDataList();
  }

  ngAfterViewInit(): void {
    //console.log(this.items)
  }

  searchDataList(){

      var student = JSON.stringify({
        "run_id":this.run_id,
        "word_id":this.result.word_id?this.result.word_id:'',
        "word_desc":this.result.word_desc?this.result.word_desc:'',
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/popupGuarantor', student ).subscribe(
        datalist => {

          let productsJson : any = JSON.parse(JSON.stringify(datalist));
          if(productsJson.data.length){
            this.items = productsJson.data;
            console.log(this.items)
          }else{
            this.items = [];
          }
        },
        (error) => {}
      );
    
  }

  showDataList(){

      var student = JSON.stringify({
        "run_id":this.run_id,
        "word_id":'',
        "word_desc":'',
        "userToken" : this.userData.userToken
      });

      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiGU/API/GUARANTEE/popupGuarantor', student ).subscribe(
        datalist => {
          let productsJson : any = JSON.parse(JSON.stringify(datalist));
          if(productsJson.data.length){
            this.items = productsJson.data;
            console.log(this.items)
          }else{
            this.items = [];
          }
        },
        (error) => {}
      );
    
  }

  onClickListData(index:any): void {
    //this.onClickList.emit(this.items[index][this.value2]+':'+this.items[index][this.value3])
    this.onClickList.emit(this.items[index])
  }

}
