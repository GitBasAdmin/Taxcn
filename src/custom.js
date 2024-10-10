$(document).ready(function() {
	//setTimeout(function(){
		//$('.select2').select2(); //initialize 
		//console.log($(".sidebar-mini"))
		/*
		$('body').find('.modal-header').css("cursor","move");
		$('body').find('.modal-dialog').draggable({
			handle: ".modal-header",
			containment:[-700, -20, 600, 320]
		  });
		  */
		$('body').find('#exampleModal,#exampleModal-2,#exampleModal-3').modal({backdrop: 'static', keyboard: false});
		//$('body').find('.modal').on('hidden.bs.modal', function (e) {
			// do something...
		//})
		
		//$('body').find('.modal').on('show.bs.modal', function (event) {
			//$('.modal-dialog').draggable({
				//handle: ".modal-header",
				//containment: "window"
			//});
			  /*
			  if( $(this).draggable("instance") ){
				// If there is, destroy it
				$(this).draggable("destroy");
			  }*/
		//})
		
		$('i.iDep').on("click",function(){
			$("#table_name").val('pdepartment');
			$("#field_id").val('dep_code');
			$("#field_name").val('dep_name');
			//console.log(wWidth)
			$("#exampleModal").draggable({
				//handle: ".modal-header",containment:[-600, 100, 600, 700]
				handle: ".modal-header"
			});
			//$("body").find(".modal-content").css({"width":"600px","height":"300px"});
		})

		$('i.iPost').on("click",function(){
			$("#table_name").val('pposition');
			$("#field_id").val('post_id');
			$("#field_name").val('post_name');
			//console.log(wWidth)
			$("#exampleModal").draggable({
				//handle: ".modal-header",containment:[-600, 100, 600, 700]
				handle: ".modal-header"
			});
			//$("body").find(".modal-content").css({"width":"600px","height":"300px"});
		})
		
	//},500)

	$('#myTab a').on('click', function (e) {
		e.preventDefault()
		$(this).tab('show')
	})

});
/*
window.onbeforeunload = function() {
	localStorage.removeItem('sessData');
	return '';
  };
*/

document.addEventListener('click',function(e){
	// Hamburger menu
	if(e.target.classList.contains('hamburger-toggle')){
	  e.target.children[0].classList.toggle('active');
	}
  })

  

var myExtObject = (function() {
	const SpeechRecognize=window.SpeechRecognition || window.webkitSpeechRecognition;
	const recognize=new SpeechRecognize();
	//const btn=document.querySelector('.control');
	const btn = document.querySelector('.voice-control');
	return {
			callCalendar: function() {
				$.datetimepicker.setLocale('th'); // ต้องกำหนดเสมอถ้าใช้ภาษาไทย และ เป็นปี พ.ศ.
				var thaiYear = function (ct) {
					var leap=0;  
					var dayWeek=["อา.", "จ.", "อ.", "พ.","พฤ.", "ศ.", "ส."];  
					if(ct){}
					this.setOptions({  
						i18n:{ th:{dayOfWeek:dayWeek}},dayOfWeekStart:leap,  
					})                
				};
				var getThaiYear = function(ct,$i){
					var selDate = $i.val().split("/");
					var yearThai = new Date(ct).getFullYear()+543;
					$i.val(selDate[0]+"/"+selDate[1]+"/"+yearThai);
					$i.trigger("click");
					//console.log($i)
				}
				$(".jcalendar").datetimepicker({
					timepicker:false,
					format:'d/m/Y',  // กำหนดรูปแบบวันที่ ที่ใช้ เป็น 00-00-0000            
					lang:'th',  // แสดงภาษาไทย
					onChangeMonth:thaiYear,          
					onShow:thaiYear,
					onSelectDate:getThaiYear
				});   

				$(".jcalendar").on("change",function(e){
					
					//-----------------------------------------------------
					if($(this).val()!=""){
						//console.log($(this))
						var dateInput = $(this).val();  
						var dob = dateInput.split('/');  
						var dd = dob[0];  
						var mm = dob[1];  
						var yy = dob[2]-543;  
						if (dd == '' || mm == '' || yy == '' || isNaN(dd) || isNaN(mm) || isNaN(yy) || dd == 0 || mm == 0 || yy == 0 || dd.length!=2 || mm.length!=2) {  
							alert("รูปแบบวันที่ไม่ถูกต้อง");  
							$(this).val('');
							$(this).focus();
							return false;  
							return 1;
						} else {  
							if (dob.length != 3) {  
								alert("รูปแบบวันที่ไม่ถูกต้อง");  
								$(this).val('');  
								$(this).focus();
								return false;  
								return 1;
							} else {  
								if ((mm == 4 || mm == 6 || mm == 9 || mm == 11) && dd > 30) {  
									alert("รูปแบบวันที่ไม่ถูกต้อง");  
									$(this).val('');  
									$(this).focus();
									return false;  
									return 1;
								}  
								if ((mm == 1 || mm == 3 || mm == 5 || mm == 7 || mm == 8 || mm == 10 || mm == 12) && dd > 31) {  
									alert("รูปแบบวันที่ไม่ถูกต้อง");  
									$(this).val('');
									$(this).focus();
									return false;  
									return 1;
								}  
								if (parseInt(mm) == 2) {  
									var lyear = false;  
									if ((!(yy % 4) && yy % 100) || !(yy % 400)) {  
										lyear = true;  
									}  
									//console.log(lyear)
									if ((lyear == false) && (dd >= 29)) {  
										alert("รูปแบบวันที่ไม่ถูกต้อง");  
										$(this).val('');  
										$(this).focus();
										return false;  
										return 1;
									}  
									if ((lyear == true) && (dd > 29)) {  
										alert("รูปแบบวันที่ไม่ถูกต้อง");  
										$(this).val('');
										$(this).focus();
										return false;  
										return 1;
									}  
								}  
								if (parseFloat(dob[1]) > 12) {  
									alert("รูปแบบวันที่ไม่ถูกต้อง");  
									$(this).val('');  
									$(this).focus();
									return false;  
									return 1;
								}  
								if (dob[2].length != 4) {  
									alert("รูปแบบวันที่ไม่ถูกต้อง");  
									$(this).val('');  
									$(this).focus();
									return false;  
									return 1;
								}  
								
							}
						}
						
					}
				
					//console.log(parseInt(yy))

				//-----------------------------------------------------
				})
			},
			callCalendarSet: function(obj) {
				$.datetimepicker.setLocale('th'); // ต้องกำหนดเสมอถ้าใช้ภาษาไทย และ เป็นปี พ.ศ.
				var thaiYear = function (ct) {
					var leap=0;  
					var dayWeek=["อา.", "จ.", "อ.", "พ.","พฤ.", "ศ.", "ส."];  
					if(ct){}
					this.setOptions({  
						i18n:{ th:{dayOfWeek:dayWeek}},dayOfWeekStart:leap,  
					})                
				};
				var getThaiYear = function(ct,$i){
					var selDate = $i.val().split("/");
					var yearThai = new Date(ct).getFullYear()+543;
					$i.val(selDate[0]+"/"+selDate[1]+"/"+yearThai);
					$i.trigger("click");
					//console.log($i)
				}
				$('body').find("."+obj).datetimepicker({
					timepicker:false,
					format:'d/m/Y',  // กำหนดรูปแบบวันที่ ที่ใช้ เป็น 00-00-0000            
					lang:'th',  // แสดงภาษาไทย
					onChangeMonth:thaiYear,          
					onShow:thaiYear,
					onSelectDate:getThaiYear
				});   

				$('body').find("."+obj).on("change",function(e){
					//-----------------------------------------------------
				
					if($(this).val()!=""){
						var dateInput = $(this).val();  
						var dob = dateInput.split('/');  
						var dd = dob[0];  
						var mm = dob[1];  
						var yy = dob[2]-543;  
						if (dd == '' || mm == '' || yy == '' || isNaN(dd) || isNaN(mm) || isNaN(yy) || dd == 0 || mm == 0 || yy == 0 || dd.length!=2 || mm.length!=2) {  
							alert("รูปแบบวันที่ไม่ถูกต้อง");  
							$(this).val('');
							$(this).focus();
							return false;  
							return 1;
						} else {  
							if (dob.length != 3) {  
								alert("รูปแบบวันที่ไม่ถูกต้อง");  
								$(this).val('');  
								$(this).focus();
								return false;  
								return 1;
							}  
							else {  
								if ((mm == 4 || mm == 6 || mm == 9 || mm == 11) && dd > 30) {  
									alert("รูปแบบวันที่ไม่ถูกต้อง");  
									$(this).val('');  
									$(this).focus();
									return false;  
									return 1;
								}  
								if ((mm == 1 || mm == 3 || mm == 5 || mm == 7 || mm == 8 || mm == 10 || mm == 12) && dd > 31) {  
									alert("รูปแบบวันที่ไม่ถูกต้อง");  
									$(this).val('');
									$(this).focus();
									return false;  
									return 1;
								}  
								if (parseInt(mm) == 2) {  
									var lyear = false;  
									if ((!(yy % 4) && yy % 100) || !(yy % 400)) {  
										lyear = true;  
									}  
									//console.log(lyear)
									if ((lyear == false) && (dd >= 29)) {  
										alert("รูปแบบวันที่ไม่ถูกต้อง");  
										$(this).val('');  
										$(this).focus();
										return false;  
										return 1;
									}  
									if ((lyear == true) && (dd > 29)) {  
										alert("รูปแบบวันที่ไม่ถูกต้อง");  
										$(this).val('');
										$(this).focus();
										return false;  
										return 1;
									}  
								}  
								if (parseFloat(dob[1]) > 12) {  
									alert("รูปแบบวันที่ไม่ถูกต้อง");  
									$(this).val('');  
									$(this).focus();
									return false;  
									return 1;
								}  
								if (dob[2].length != 4) {  
									alert("รูปแบบวันที่ไม่ถูกต้อง");  
									$(this).val('');  
									$(this).focus();
									return false;  
									return 1;
								}  
							}  
						}
					}
					//console.log(parseInt(yy))
				//-----------------------------------------------------
				})
			},
		  	conDate(val){
				if(val!=''){
					var date=new String();
					date=val;
					var find=date.search('/');
					var tmp=new Array();
					if(parseInt(find)>0){
						tmp=date.split('/');
						if(parseInt(tmp[2])>2500){
							return (parseInt(tmp[2])-543)+'-'+tmp[1]+'-'+tmp[0]; 
						}else{
							return tmp[2]+'-'+tmp[1]+'-'+tmp[0]; 
						}
					}else{
						var find=date.search('-');
						if(parseInt(find)>0){
							tmp=date.split('-');
							if(parseInt(tmp[0])>2500){
								return tmp[2]+'/'+tmp[1]+'/'+tmp[0]; 
							}else{
								return tmp[2]+'/'+tmp[1]+'/'+(parseInt(tmp[0])+543); 
							}
						}else{
							//alert('Invalid date format!');
							return '';
						}	
					}
				}else 
					return '';
			},
			curDate(){
				var today = new Date();
				var dd = String(today.getDate()).padStart(2, '0');
				var mm = String(Number(today.getMonth() + 1)).padStart(2, '0');
				var yyyy = today.getFullYear()+543;
				return dd+'/'+mm+"/"+yyyy;
			},curYear(){
				var today = new Date();
				var yyyy = today.getFullYear()+543;
				return yyyy;
			},curMonth(){
				var today = new Date();
				var mm = String(Number(today.getMonth() + 1)).padStart(2, '0');
				return mm;
			},
			curHour(){
				var date = new Date();
				var hour = date.getHours();
				return hour;
			},
			curMinutes(){
				var date = new Date();
				var minutes = date.getMinutes();
				return minutes;
			},
			curSeconds (){
				var date = new Date();
				var seconds = date.getSeconds();
				return seconds;
			},
			OpenWindowMaxName(url, name){
				var w = window.open (url, name, "height="+(screen.height-125)+",width="+(screen.width-100)+",toolbar=no,location=no,directories=no,status=yes,menubar=no,scrollbars=yes,resizable=yes,copyhistory=yes,left=0, top=0,screenX=0,screenY=0");
				w.focus();
			},
			OpenWindowMax(url){
				var name='';
				if(name=='')
					name='win_'+Math.ceil(Math.random()*1000);
				var w = window.open (url, name, "height="+(screen.height-125)+",width="+(screen.width-100)+",toolbar=no,location=no,directories=no,status=yes,menubar=no,scrollbars=yes,resizable=yes,copyhistory=yes,left=0, top=0,screenX=0,screenY=0");
				w.focus();
			},
			OpenWindowMaxDimension(url,height,width){
				var name='';
				if(name=='')
					name='swin_'+Math.ceil(Math.random()*1000);
				var w = window.open (url, name, "height="+height+",width="+width+",resizable,scrollbars,status");
				w.focus();
			},
			OpenWindowMaxDimensionName(url,height,width,name){
				var w = window.open (url, name, "height="+height+",width="+width+",resizable,scrollbars,status");
				w.focus();
			},
			openerReloadRunId(run_id){
				let winURL = window.location.href;
    			var rootUrl = winURL.substring(0,winURL.indexOf("#")+1);//================= root url
				var parent = winURL.substring(winURL.indexOf("#")+2,winURL.length);

				if(parent.indexOf('?') === -1 ){
					// if(parent.indexOf('/') === -1 ){
				var parentUrl = parent;
				}else{
				var parentUrl = parent.substring(0,parent.indexOf("?"));//================= parent url
				// var parentUrl = parent.substring(0,parent.indexOf("/"));//================= parent url
				}
				if(run_id>0){
					window.location.replace(rootUrl+'/'+parentUrl+'?run_id='+run_id);
					//console.log(rootUrl+'/'+parentUrl+'?run_id='+run_id)
					location.reload();
				}else{
					window.location.replace(rootUrl+'/'+parentUrl);
					//console.log(rootUrl+'/'+parentUrl)
					location.reload();
				}
			},
			openerReloadName(name,value){
				let winURL = window.location.href;
    			var rootUrl = winURL.substring(0,winURL.indexOf("#")+1);//================= root url
				var parent = winURL.substring(winURL.indexOf("#")+2,winURL.length);

				if(parent.indexOf('/') === -1 ){
				var parentUrl = parent;
				}else{
				var parentUrl = parent.substring(0,parent.indexOf("/"));//================= parent url
				}
				if(value){
					window.location.replace(rootUrl+'/'+parentUrl+'?'+name+'='+value);
					location.reload();
				}else{
					window.location.replace(rootUrl+'/'+parentUrl);
					location.reload();
				}
			},
			openerReloadUrl(url){
				let winURL = window.location.href.split("/#/")[0]+"/#/";
				/*
				if(typeof array ==='object'){
					var obj = [JSON.parse(array)];
					for(var i=0;i<obj.length;i++){
						if(i==0)
							winURL = winURL+"?"+Object.keys(obj)[i]+'='+Object.values(obj)[i];
						else
							winURL = winURL+"&"+Object.keys(obj)[i]+'='+Object.values(obj)[i];
					}
					
				}
				*/
				window.location.replace(winURL+url);
				location.reload();
				//console.log(winURL)
				
			},
			openerReload(url){
				location.reload();			
			},
			openerReloadOutSide(func){
				window.angularFunc[func]();
			},
			openModalDraggable(obj){
				console.log(obj)
				$('body').find('.modal-header,.modal-footer').css("cursor","move");
				$('body').find('.modal-dialog').draggable({
					handle: ".modal-header,.modal-footer",
					containment:"content"
					//containment:obj
					//containment:[-700, -20, 600, 320]
					//scroll: false,   
					/*       
					start: function (e) {
						const draggable = $(this)[0];
						const contentResizable = draggable;

						const paddingHeight = 30;
						const scrollTop = $(window).scrollTop();
						const scrollLeft = $(window).scrollLeft()-710;

						const top = scrollTop - paddingHeight;
						const right = ($(window).width() - contentResizable.offsetWidth)-500;
						const bottom = (scrollTop + $(window).height()- paddingHeight - contentResizable.offsetHeight);
						console.log(top+":"+right+":"+bottom+":"+scrollLeft)
						$(this).draggable({
							containment: [scrollLeft, top, scrollLeft + right, bottom]
						})
					}
					*/
				});
			},
			recordVoice(){
				const isRecord=document.querySelector('.voice-control').classList.contains('record');
				if(isRecord){
					recognize.start();
					document.querySelector('.voice-control').classList.remove('record');
					document.querySelector('.voice-control').classList.add('pause');
					document.querySelector('.voice-control').innerText="Pause";
				}else{
					recognize.stop();
					document.querySelector('.voice-control').classList.remove('pause');
					document.querySelector('.voice-control').classList.add('record');
					document.querySelector('.voice-control').innerText="Record";
				}
			},
			setVoicetoText(e){
				let message=document.querySelector('.message');
				//message.innerText+=e.results[0][0].transcript;
				message.value+=e.results[0][0].transcript;
			},
			continueRecord(){
				const isPause=document.querySelector('.voice-control').classList.contains('pause');
				
				if(isPause){
					recognize.start();
				}
			},
			setUpVoice(){
				recognize.lang="th-TH";
				//console.log(document.querySelector('.voice-control'))
				document.querySelector('.voice-control').addEventListener('click',this.recordVoice);
				recognize.addEventListener('result',this.setVoicetoText);
				recognize.addEventListener('end',this.continueRecord);
			},
			dayAdd(inputDate,addDay){  
				//alert (addDay);return false;
				var d = new Date(inputDate);  
				d.setDate(d.getDate()+addDay);  
				mkMonth=d.getMonth()+1;  
				mkMonth=new String(mkMonth);  
				if(mkMonth.length==1){  
					mkMonth="0"+mkMonth;  
				}  
				mkDay=d.getDate();  
				mkDay=new String(mkDay);  
				if(mkDay.length==1){  
					mkDay="0"+mkDay;  
				}     
				mkYear=d.getFullYear();  
			//  return mkYear+"-"+newMonth+"-"+newDay; // แสดงผลลัพธ์ในรูปแบบ ปี-เดือน-วัน  
				//return mkMonth+"/"+mkDay+"/"+mkYear; // แสดงผลลัพธ์ในรูปแบบ เดือน/วัน/ปี      
				//alert(mkMonth+"/"+mkDay+"/"+mkYear);return false;
				return mkDay+"/"+mkMonth+"/"+(mkYear+543);
			} 
	}
})(myExtObject||{})


