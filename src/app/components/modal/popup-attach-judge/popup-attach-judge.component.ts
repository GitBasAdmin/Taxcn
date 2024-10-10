import { Component, OnInit,Input,Output,EventEmitter,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';

@Component({
  selector: 'app-popup-attach-judge',
  templateUrl: './popup-attach-judge.component.html',
  styleUrls: ['./popup-attach-judge.component.css']
})
export class PopupAttachJudgeComponent implements OnInit {
  @Input() items : any = [];
  @Input() run_id: number;//run_id
  @Input() add: number;//add==1 แบบพิมพ์คำให้การ

  @Output() onClickList = new EventEmitter<any>();
  @ViewChild('modalForm',{static: true}) modalForm : ElementRef;
  
  formList: FormGroup;

  sessData:any;
  userData:any;
  fileToUpload1: File = null;


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
    console.log(this.userData)
  }

  onFileChange(e:any,type:any) {
    if(e.target.files.length){
      this.fileToUpload1 = e.target.files[0];
      var fileName = e.target.files[0].name;
      $(e.target).parent('div').find('label').html(fileName);
    }else{
      this.fileToUpload1 =  null;
      $(e.target).parent('div').find('label').html('');
    }
  }

  onClickListData(): void {
    // var student = JSON.stringify({
    //   "add" : this.add,
    //   "file" : this.fileToUpload1,
    // });
    if(this.fileToUpload1){
      this.onClickList.emit(this.fileToUpload1)
    }else{
      const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
      confirmBox.setMessage('ไม่พบไฟล์แนบ');
      confirmBox.setButtonLabels('ตกลง');
      confirmBox.setConfig({
          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
      });
      const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
        if (resp.success==true){
        }
        subscription.unsubscribe();
      });
    }
  }
}
