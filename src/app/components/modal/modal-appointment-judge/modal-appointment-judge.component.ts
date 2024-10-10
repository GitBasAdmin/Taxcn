import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef,ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
import { NgbModal, NgbModalRef ,NgbActiveModal  } from '@ng-bootstrap/ng-bootstrap';
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-modal-appointment-judge',
  templateUrl: './modal-appointment-judge.component.html',
  styleUrls: ['./modal-appointment-judge.component.css']
})
export class ModalAppointmentJudgeComponent implements AfterViewInit,OnInit {
  @Input() judge_id : number ;
  @Input() date_appoint: string;
 
  sessData:any;
  userData:any;
  getPersType:any;
  items:any = [];
  modal_name="modal-appointment-judge";

  constructor(
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private ngbModal: NgbModal,
    public activeModal: NgbActiveModal,
  ) { 

  }

  ngOnInit(): void {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.showDataList();
  }

  ngAfterViewInit(): void {
    //console.log(this.items)
  }

  curencyFormat(n: any, d: any) {
    return parseFloat(n).toFixed(d).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  }

  showDataList(){
    if(this.judge_id && this.date_appoint){

        var student = JSON.stringify({
          "judge_id" : this.judge_id,
          "date_appoint" : this.date_appoint,
          "userToken" : this.userData.userToken
        });

        console.log(student)
      this.http.post('/'+this.userData.appName+'ApiMG/API/MANAGEMENT/fmg0101/getAppointData', student ).subscribe(
        datalist => {
          let getDataOptions : any = JSON.parse(JSON.stringify(datalist));
          console.log(getDataOptions)
          if(getDataOptions.data.length){
            this.items = getDataOptions.data;
            if(getDataOptions.data.length)
              this.items.forEach((x : any ) => x.deposit = this.curencyFormat(x.deposit,2));
          }else{
            this.items = [];
          }
        },
        (error) => {}
      );
    }
  }
}
