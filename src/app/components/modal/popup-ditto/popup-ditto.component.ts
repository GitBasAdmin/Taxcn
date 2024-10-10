import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-popup-ditto',
  templateUrl: './popup-ditto.component.html',
  styleUrls: ['./popup-ditto.component.css']
})
export class PopupDittoComponent implements AfterViewInit,OnInit {
  @Input() run_id : number;
  @Input() doc_type_id : number;
  @Output() onClickList = new EventEmitter<any>();
  
  formList: FormGroup;
  sessData:any;
  userData:any;
  dataSearch:any = [];
  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    public activeModal:NgbActiveModal
  ) { 
    this.formList = this.formBuilder.group({
      word_id: [''],
      word_desc: ['']
    })
  }

  ngOnInit(): void {
    //alert(99)
    //console.log(this.items)
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    if(typeof this.doc_type_id !='undefined' || this.doc_type_id){
      var student = JSON.stringify({
        "run_id" : this.run_id,
        "doc_type_id" : this.doc_type_id,​
        "userToken" : this.userData.userToken
      });
    }else{
      var student = JSON.stringify({
        "run_id" : this.run_id,
        "userToken" : this.userData.userToken
      });
    }
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiCA/API/CASE/fca0230/getDittoData', student ).subscribe(
      (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        console.log(productsJson)
        if(productsJson.result == 1 && productsJson.data[0].file_list.length){
          //console.log(this.getAttachSubTypeOriginal)
          var bar = new Promise((resolve, reject) => {
            /*
            productsJson.data.forEach((ele, index, array) => {
              var valObj = this.getAttachSubTypeOriginal.filter((x:any) => x.fieldNameValue2 === ele.attach_type_id);
              //console.log(ele.sub_type_id)
              if(valObj.length)
                this.getAttachSubType[index] = valObj;
              else
                this.getAttachSubType[index] = [];

            });
            */
          });
          if(bar){
            this.dataSearch = productsJson.data[0].file_list;
          }
        }else{
          this.dataSearch = [];
        }
      },
      (error) => {}
    )
    
  }

  ngAfterViewInit(): void {
    //console.log(this.items)
  }

  

  onClickListData(index:any): void {
    this.activeModal.close(this.dataSearch[index])
  }

  

}
