import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@app/auth.service';

@Component({
  selector: 'app-datalist-return-model',
  templateUrl: './datalist-return-model.component.html',
  styleUrls: ['./datalist-return-model.component.css']
})
export class DatalistReturnModelComponent implements OnInit {
  @Input() items : any = [];
  @Input() value1: string;//ชื่อตาราง
  @Input() value2: number;//รหัส
  @Input() value3: number;//รายละเอียด
  @Input() value4: number;//ค่าว่าง
  @Input() value5: number;//สแตนดาร์ด
  @Input() value6: number;//รายละเอียดเพิ่มเติม
  @Input() value7: number;//เงื่อนไข
  @Output() onClickList = new EventEmitter<any>();

  formList: FormGroup;
  sessData:any;
  userData:any
  
  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private activeModal:NgbActiveModal,
    private authService: AuthService,
  ) {
    this.formList = this.formBuilder.group({
      word_id: [''],
      word_desc: ['']
    })
   }

  ngOnInit(): void {
    this.searchDataList()
  }

  closeModal = () => {
    this.activeModal.close()
  }

  searchDataList(){
    if(!this.value5){
      var student = JSON.stringify({
        "table_name": this.value1,
        "field_id": this.value2,
        "field_name": this.value3,
        "search_id":this.formList.get("word_id")?.value,
        "search_desc":this.formList.get("word_desc")?.value,
        "condition":this.value7
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
        datalist => {
          this.items = datalist;
          console.log(datalist)
        },
        (error) => {}
      );
    }else{
      var student = JSON.stringify({
        "table_name": this.value1,
        "field_id": this.value2,
        "field_name": this.value3,
        "field_name2": this.value5,
        "search_id":this.formList.get("word_id")?.value,
        "search_desc":this.formList.get("word_desc")?.value
      });

      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupStd', student).subscribe(
        datalist => {
          this.items = datalist;
        },
        (error) => {}
      );
    }

  }

  showDataList(){
    if(!this.value5){
      var student = JSON.stringify({
        "table_name": this.value1,
        "field_id": this.value2,
        "field_name": this.value3,
        "search_id":'',
        "search_desc":'',
        "condition":this.value7
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student).subscribe(
        datalist => {
          this.items = datalist;
          console.log(datalist)
        },
        (error) => {}
      );
    }else{
      var student = JSON.stringify({
        "table_name": this.value1,
        "field_id": this.value2,
        "field_name": this.value3,
        "field_name2": this.value5,
        "search_id":'',
        "search_desc":''
      });
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupStd', student).subscribe(
        datalist => {
          this.items = datalist;
        },
        (error) => {}
      );
    }

  }

  onClickListData(index:any): void {
    // this.onClickList.emit(this.items[index])
    this.activeModal.close(this.items[index])
  }

}
