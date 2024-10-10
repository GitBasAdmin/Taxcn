import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-datalist-last-notice',
  templateUrl: './datalist-last-notice.component.html',
  styleUrls: ['./datalist-last-notice.component.css']
})
export class DatalistLastNoticeComponent implements AfterViewInit,OnInit {
  @Input() run_id : number;
  @Input() lit_type : number;
  @Input() seq : number;
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

      var student = JSON.stringify({
        "run_id" : this.run_id,
        "lit_type" : this.lit_type,​
        "seq" : this.seq,​
        "userToken" : this.userData.userToken
      });

    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupListNotice', student ).subscribe(
      (response) =>{
        let productsJson : any = JSON.parse(JSON.stringify(response));
        console.log(productsJson)

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
            this.dataSearch = productsJson;
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
