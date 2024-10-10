import { Component, OnInit,Input,Output,EventEmitter,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
import { DialogLayoutDisplay, ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
declare var myExtObject: any;

@Component({
  selector: 'app-modal-attach-file',
  templateUrl: './modal-attach-file.component.html',
  styleUrls: ['./modal-attach-file.component.css']
})
export class ModalAttachFileComponent implements OnInit {
  @Input() run_id: number;//run_id

  @Output() onClickList = new EventEmitter<any>();
  @ViewChild('modalForm',{static: true}) modalForm : ElementRef;
  
  formList: FormGroup;

  sessData:any;
  userData:any;
 
  myExtObject: any;
  dataFileSearch1: any = [];
  dataFileSearch2: any = [];
  getAttachSubType: any;
  getAttachSubTypeOriginal: any;

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

    this.searchFileData(this.run_id);
  }

  //ไฟล์แนบสำนวน
  searchFileData(runId: any) {
    var student = JSON.stringify({
      "run_id": runId,
      "userToken": this.userData.userToken
    });

    console.log(student)
    this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/fca0230/getAttachData', student).subscribe(
      (response) => {
        let productsJson: any = JSON.parse(JSON.stringify(response));
        console.log(productsJson)
        if (productsJson.result == 1 && productsJson.data.length) {
          this.dataFileSearch1 = productsJson.data;
          console.log(this.dataFileSearch1)
          // this.rerender();
          this.searchFileData2(runId);
        } else {
          this.dataFileSearch1 = [];
          // this.rerender();
          this.searchFileData2(runId);
        }
      },
      (error) => { }
    )
  }

  searchFileData2(runId: any) {
    var student = JSON.stringify({
      "run_id": runId,
      "userToken": this.userData.userToken
    });
    this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/fca0230/getDittoData', student).subscribe(
      (response) => {
        let productsJson: any = JSON.parse(JSON.stringify(response));
        console.log(productsJson)
        if (productsJson.result == 1 && productsJson.data[0].file_list.length) {
          var bar = new Promise((resolve, reject) => {
          });
          if (bar) {
            this.dataFileSearch2 = productsJson.data[0].file_list;
            // this.rerender();
            this.SpinnerService.hide();
          }
        } else {
          this.dataFileSearch2 = [];
          // this.rerender();
          this.SpinnerService.hide();
        }
      },
      (error) => { }
    )
  }

  clickOpenFile(index: any, type: any) {
    var last = this.dataFileSearch1[index].file_name.split('.').pop().toLowerCase();
    let winURL = window.location.host;
    if (last != 'pdf') {
      var api = '/' + this.userData.appName + "ApiCA/API/CASE/fca0230/openAttach";
      console.log("http://" + winURL + api + '?run_id=' + this.dataFileSearch1[index].run_id + '&file_name=' + this.dataFileSearch1[index].file_name)
      myExtObject.OpenWindowMax("http://" + winURL + api + '?run_id=' + this.dataFileSearch1[index].run_id + '&file_name=' + this.dataFileSearch1[index].file_name);
    } else {
      var api = '/' + this.userData.appName + "ApiCA/API/CASE/fca0230/openPdf";
      console.log("http://" + winURL + api + '?run_id=' + this.dataFileSearch1[index].run_id + '&file_name=' + this.dataFileSearch1[index].file_name)
      myExtObject.OpenWindowMax("http://" + winURL + api + '?run_id=' + this.dataFileSearch1[index].run_id + '&file_name=' + this.dataFileSearch1[index].file_name);
    }
  }

  clickOpenFile2(index: any) {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    var student = JSON.stringify({
      "ref_no": this.dataFileSearch2[index].ref_no
    });
    this.http.post('/' + this.userData.appName + 'ApiCA/API/CASE/fca0230/openDittoAttach', student).subscribe(
      (response) => {
        let getDataOptions: any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        if (getDataOptions.result == 1) {
          myExtObject.OpenWindowMax(getDataOptions.file);
        } else {
          confirmBox.setMessage(getDataOptions.error);
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
           layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success == true) {
              this.SpinnerService.hide();
            }
            subscription.unsubscribe();
          });
        }
      },
      (error) => { }
    )
  }
}
