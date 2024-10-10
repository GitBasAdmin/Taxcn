import {Injectable} from '@angular/core';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { AuthService } from 'src/app/auth.service';
import { NgxSpinnerService } from "ngx-spinner"; 
import { promises } from 'dns';

export type Case = {
  result: string,
  error: string,
  data: []
}
@Injectable({
   providedIn: 'root'
 })
 
export class CaseService {
    private dataCase: Case[] = [];
   constructor(
      private http: HttpClient,
      private authService: AuthService,
      private SpinnerService: NgxSpinnerService,
    ){ 
      //this.config.bindValue = 'value';
    }

    async searchCaseNo(parem:any[]):Promise<Case[]> {
     //type:any,alldata:any,run_id:any,case_type:any,court_id:any,title:any,id:any,yy:any
    var sessData =localStorage.getItem(this.authService.sessJson);
    var userData = JSON.parse(sessData);
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    var alert = 0;
   
    if(parem['type']==1){//เลขคดีดำ
      if(!parem['case_type']){
        confirmBox.setMessage('กรุณาระบุประเภทความ');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
        alert++;
      }else if(!parem['title']){
        confirmBox.setMessage('กรุณาระบุคำนำหน้าหมายเลขคดีดำ');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
        alert++;
      }else if(!parem['id']){
        confirmBox.setMessage('กรุณาระบุหมายเลขคดีดำ');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
        alert++;
      }else if(!parem['yy']){
        confirmBox.setMessage('กรุณาระบุปีเลขคดีดำ');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
        alert++;
      }else{
        var student = JSON.stringify({
          "case_type": parem['case_type'],
          "title": parem['title'],
          "id": parem['id'],
          "yy": parem['yy'],
          "allData" : parem['all_data'],
          "getJudgement" : parem['getJudgement'],
          "userToken" : userData.userToken
        });
        var apiUrl = '/crimApiCA/API/CASE/dataFromTitle';
        console.log(student)
      }
    }else if(parem['type']==2){//เลขคดีแดง
      if(!parem['case_type']){
        confirmBox.setMessage('กรุณาระบุประเภทความ');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
        alert++;
      }else if(!parem['title']){
        confirmBox.setMessage('กรุณาระบุคำนำหน้าหมายเลขคดีแดง');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
        alert++;
      }else if(!parem['id']){
        confirmBox.setMessage('กรุณาระบุหมายเลขคดีแดง');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
        alert++;
      }else if(!parem['yy']){
        confirmBox.setMessage('กรุณาระบุปีเลขคดีแดง');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
        alert++;
      }else{
        var student = JSON.stringify({
          "case_type": parem['case_type'],
          "red_title": parem['title'],
          "red_id": parem['id'],
          "red_yy": parem['yy'],
          "allData" : parem['all_data'],
          "getJudgement" : parem['getJudgement'],
          "userToken" : userData.userToken
        });
        var apiUrl = '/crimApiCA/API/CASE/dataFromRedTitle';
        console.log(student)
      }
    }else if(parem['type']==3){
      var student = JSON.stringify({
        "run_id": parem['run_id'],
        "allData" : parem['all_data'],
        "getJudgement" : parem['getJudgement'],
        "userToken" : userData.userToken
      });
      var apiUrl = '/crimApiCA/API/CASE/dataFromRunId';
      console.log(student)
    }else if(parem['type']==4){
      var student = JSON.stringify({
        "case_type": parem['case_type'],
        "title": parem['ptitle'],
        "id": parem['pid'],
        "yy": parem['pyy'],
        "special_case" : 1,
        "onlyCase" : 1,
        "allData" : parem['all_data'],
        "getJudgement" : parem['getJudgement'],
        "userToken" : userData.userToken
      });
      var apiUrl = '/crimApiCA/API/CASE/dataFromTitle';
      console.log(student)
    }

    if(!alert){
      this.SpinnerService.show();
      this.dataCase = await this.http.post<Case[]>(apiUrl, student).toPromise();
      this.SpinnerService.hide();
      return this.dataCase;
    }
    
  }
}

