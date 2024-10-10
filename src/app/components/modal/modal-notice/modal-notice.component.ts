import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-modal-notice',
  templateUrl: './modal-notice.component.html',
  styleUrls: ['./modal-notice.component.css']
})
export class ModalNoticeComponent implements AfterViewInit,OnInit {
  @Input() items : any = [];
  @Input() types : number;//ประเภท Modal
  @Input() value1: string;//ชื่อตาราง
  @Input() value2: number;//รหัส
  @Input() value3: number;//รายละเอียด
  @Input() value4: number;//ค่าว่าง
  @Input() value5: number;//สแตนดาร์ด
  @Input() value6: number;//รายละเอียดเพิ่มเติม
  @Input() value7: number;//เงื่อนไข
  @Output() onClickList = new EventEmitter<any>();
  
  sessData:any;
  userData:any;
  getPersType:any;
  result:any = [];
  modal_name="modal-notice";

  constructor(
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    public activeModal:NgbActiveModal
  ) { 

  }

  ngOnInit(): void {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);    
  }

  ngAfterViewInit(): void {
    //console.log(this.items)
  }

  onClickListData(index:any): void {
    //this.onClickList.emit(this.items[index][this.value2]+':'+this.items[index][this.value3])
    if(this.types==1)
      this.activeModal.close(this.items[index])
    else
      this.onClickList.emit(this.items[index])
  }

  

}
