import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PrintReportService {

  constructor(
    private authService: AuthService,
  ) { }

  printReport(rptName: any, paramData: any) {
    //var jObj = JSON.parse(localStorage["sessData"]);
    //var jObj = JSON.parse(localStorage.getItem(this.authService.sessJson));
    var sObj =localStorage.getItem(this.authService.sessJson);
    var jObj = JSON.parse(sObj);
    console.log(jObj)
    var winHost = `${window.location.protocol}//${window.location.host}`;
    var winName='MyWindow';
    if (winHost == 'http://localhost:4200') {
        var winURL= 'http://bizascorp.thddns.net:8848/'+jObj.appName+'RPT/' + rptName+'.jsp';
    }else{
      var winURL= `${winHost}/rpt/${rptName}.jsp`;
        //var winURL= `${winHost}/${jObj.appName}RPT/${rptName}.jsp`;
    }
 
    // var windowoption='resizable=yes,height=600,width=800,location=0,menubar=0,scrollbars=1';

    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", winURL);
    form.setAttribute("target",winName);

    // get global data from local storage
   
    // console.log(jObj);
    // console.log(jObj.courtName);

    // Global parameters
    var input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'pcourt_running';
        // check for can not get courtRunning on localstorage
        if(jObj.courtRunning=='undefined'){
          input.value = '6';
        }else{
          input.value = jObj.courtRunning;
        }       
        form.appendChild(input);
    var input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'puser_name';
        input.value = jObj.offName;
        form.appendChild(input);
    var input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'puser_post';
        input.value = jObj.postName;
        form.appendChild(input);
    var input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'pcourt_name';
        input.value = jObj.courtName;
        form.appendChild(input);
    var input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'pshort_court_name';
        input.value = jObj.shortCourtName;
        form.appendChild(input);

    
    // Report Parameter
    // var params = {"pcase_type":"2","pcase_type_desc":"แพ่ง"};
    // console.log(paramData);
    if(paramData != '{}'){
      var params = JSON.parse(paramData);
      // console.log(params);
      for (var i in params) {
        if (params.hasOwnProperty(i)) {
          var input = document.createElement('input');
          input.type = 'hidden';
          input.name = i;
          input.value = params[i];
          form.appendChild(input);        
        }  
      }  
    }  

    document.body.appendChild(form);
    // window.open('', winName,windowoption);
    window.open('',winName);
    // form.target = winName;
    form.submit();
    document.body.removeChild(form);

  }  


}
