import {
  Injectable
} from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
@Injectable({
   providedIn: 'root'
 })
export class ExcelService {
   public exportAsExcelFile(json: any[], excelFileName: string ,fullName: string){
      if(excelFileName=='fct0218'){
         console.log(json)
         const title = excelFileName;
         const header = ["รหัส", "ความ", "หน่วยงานที่บันทึก", "ผู้บันทึก", "วันที่บันทึก", "หน่วยงานที่แก้ไข", "แก้ไขล่าสุด", "วันที่แก้ไขล่าสุด"];
         const data = json;
         let workbook = new Workbook();
         let worksheet = workbook.addWorksheet(excelFileName);

         let headRow = worksheet.addRow([fullName]);
         headRow.getCell(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'd4f1d4' }
          };
          headRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
         worksheet.mergeCells('A1:H1');


         let headerRow = worksheet.addRow(header);
         // Cell Style : Fill and Border
         headerRow.eachCell((cell, number) => {
            cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'c9eceb' },
            bgColor: { argb: 'FFFFFF00' }
            }
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
         })

         data.forEach(d => {
            let row = worksheet.addRow(d);
            console.log(d)
            /*
            let qty = row.getCell(5);
            let color = 'FF99FF99';
            if (+qty.value < 500) {
              color = 'FF9999'
            }
            qty.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: color }
            }
            */
          }
          );
          worksheet.getColumn(1).width = 10;
          worksheet.getColumn(2).width = 10;
          worksheet.getColumn(3).width = 30;
          worksheet.getColumn(4).width = 30;
          worksheet.getColumn(5).width = 30;
          worksheet.getColumn(6).width = 30;
          worksheet.getColumn(7).width = 30;
          worksheet.getColumn(8).width = 30;

          worksheet.getColumn(1).alignment = { vertical: 'middle',horizontal: 'center', wrapText: true };
          worksheet.getColumn(2).alignment = { vertical: 'middle',horizontal: 'center', wrapText: true };
          worksheet.getColumn(3).alignment = { vertical: 'middle',horizontal: 'center', wrapText: true };
          worksheet.getColumn(4).alignment = { vertical: 'middle',horizontal: 'center', wrapText: true };
          worksheet.getColumn(5).alignment = { vertical: 'middle',horizontal: 'center', wrapText: true };
          worksheet.getColumn(6).alignment = { vertical: 'middle',horizontal: 'center', wrapText: true };
          worksheet.getColumn(7).alignment = { vertical: 'middle',horizontal: 'center', wrapText: true };
          worksheet.getColumn(8).alignment = { vertical: 'middle',horizontal: 'center', wrapText: true };

          //worksheet.addRow([]);
          //Footer Row
          /*
          let footerRow = worksheet.addRow(['This is system generated excel sheet.']);
          footerRow.getCell(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFCCFFE5' }
          };
          footerRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          */
          //Merge Cells
          //worksheet.mergeCells(`A${footerRow.number}:F${footerRow.number}`);
          //Generate Excel File with given name
          workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, excelFileName);
          })

      }else if(excelFileName=='fca0300'){
         console.log(json)
         const title = excelFileName;
         const header = ["ความ", "คดีหมายเลขดำที่", "วันที่รับฟ้อง", "คดีหมายเลขแดงที", "วันที่ออกแดง", "วันนัดถัดไป", "โจทก์", "จำเลย","ฐานความผิด","ใจความฟ้อง","เหตุเกิดที่","ทุนทรัพย์","ประเภท","ผู้สั่ง","เลขคดีศาลเดิม","รับสารภาพ/ปฏิเสธ","รับโอนคดีจากศาล"];
         const data = json['data'];
         let workbook = new Workbook();
         let worksheet = workbook.addWorksheet(excelFileName);

         let headRow = worksheet.addRow([fullName]);
         headRow.getCell(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'd4f1d4' }
          };
         headRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
         worksheet.mergeCells('A1:Q1');
         worksheet.addRow(['ทุนทรัพย์',json['deposit']]);

         let headerRow = worksheet.addRow(header);
         // Cell Style : Fill and Border
         headerRow.eachCell((cell, number) => {
            cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'c9eceb' },
            bgColor: { argb: 'FFFFFF00' }
            }
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
         })

         data.forEach(d => {let row = worksheet.addRow(d)});
          worksheet.getColumn(1).width = 10;
          worksheet.getColumn(2).width = 17;
          worksheet.getColumn(3).width = 17;
          worksheet.getColumn(4).width = 17;
          worksheet.getColumn(5).width = 17;
          worksheet.getColumn(6).width = 17;
          worksheet.getColumn(7).width = 40;
          worksheet.getColumn(8).width = 40;
          worksheet.getColumn(9).width = 30;
          worksheet.getColumn(10).width = 100;
          worksheet.getColumn(11).width = 30;
          worksheet.getColumn(12).width = 30;
          worksheet.getColumn(13).width = 30;
          worksheet.getColumn(14).width = 30;
          worksheet.getColumn(15).width = 18;
          worksheet.getColumn(16).width = 19;
          worksheet.getColumn(17).width = 25;

          for(var x=1;x<18;x++){
            worksheet.getColumn(x).alignment = { vertical: 'middle',horizontal: 'center', wrapText: true };
          }


          workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, excelFileName);
          })
      }else if(excelFileName=='fkn0500'){

         const title = excelFileName;
         const header = ["ความ","หมายเลขผัดฟ้อง","คดีหมายเลขดำ","คดีหมายเลขแดง","วันที่รับฟ้อง","ฐานความผิด","โจทก์/ผู้ร้อง","จำเลย/ผู้คัดค้าน","ประเภทคู่ความ","ลำดับที่","คำนำหน้า","ชื่อ/ชื่อสกุล","สถานะ","ประเภทบุคคล","ประเภทบัตร","เลขที่บัตร","อายุ","สัญชาติ","เชื้อชาติ","อาชีพ","หมายเลขโทรศัพท์","email","บ้านเลขที","หมู่ที่","ตรอก/ซอย","ถนน","ตำบล/แขวง","อำเภอ/เขต","จังหวัด"];
         const data = json['data'];
         let workbook = new Workbook();
         let worksheet = workbook.addWorksheet(excelFileName);
         let headRow = worksheet.addRow([fullName]);
         headRow.getCell(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'd4f1d4' }
          };
          headRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          headRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
         worksheet.mergeCells('A1:AC1');
         let caseRow = worksheet.addRow(['รวม',json['numCase'],'คดี',json['numLit'],'คน']);
         let headerRow = worksheet.addRow(header);
         // Cell Style : Fill and Border
         headerRow.eachCell((cell, number) => {
            cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'c9eceb' },
            bgColor: { argb: 'FFFFFF00' }
            }
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
         })
         data.forEach(d => {let row = worksheet.addRow(d)});
         worksheet.getColumn(1).width = 10;//A
          worksheet.getColumn(2).width = 17;//B
          worksheet.getColumn(3).width = 17;//C
          worksheet.getColumn(4).width = 17;//D
          worksheet.getColumn(5).width = 17;//E
          worksheet.getColumn(6).width = 17;//F
          worksheet.getColumn(7).width = 40;//G
          worksheet.getColumn(8).width = 40;//H
          worksheet.getColumn(9).width = 19;//I
          worksheet.getColumn(10).width = 10;//J
          worksheet.getColumn(11).width = 12;//K
          worksheet.getColumn(12).width = 30;//L
          worksheet.getColumn(13).width = 12;//M
          worksheet.getColumn(14).width = 18;//N
          worksheet.getColumn(15).width = 25;//O
          worksheet.getColumn(16).width = 15;//P
          worksheet.getColumn(17).width = 8;//Q
          worksheet.getColumn(18).width = 15;//R
          worksheet.getColumn(19).width = 15;//S
          worksheet.getColumn(20).width = 15;//T
          worksheet.getColumn(21).width = 18;//U
          worksheet.getColumn(22).width = 18;//V
          worksheet.getColumn(23).width = 13;//W
          worksheet.getColumn(24).width = 11;//X
          worksheet.getColumn(25).width = 18;//Y
          worksheet.getColumn(26).width = 18;//Z
          worksheet.getColumn(27).width = 18;//AA
          worksheet.getColumn(28).width = 18;//AB
          worksheet.getColumn(29).width = 18;//AC
         for(var x=1;x<30;x++){
            worksheet.getColumn(x).alignment = { vertical: 'middle',horizontal: 'center', wrapText: true };
         }
         workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, excelFileName);
         })


         }else if(excelFileName=='fkn0500'){

         const title = excelFileName;
         const header = ["ความ","หมายเลขผัดฟ้อง","คดีหมายเลขดำ","คดีหมายเลขแดง","วันที่รับฟ้อง","ฐานความผิด","โจทก์/ผู้ร้อง","จำเลย/ผู้คัดค้าน","ประเภทคู่ความ","ลำดับที่","คำนำหน้า","ชื่อ/ชื่อสกุล","สถานะ","ประเภทบุคคล","ประเภทบัตร","เลขที่บัตร","อายุ","สัญชาติ","เชื้อชาติ","อาชีพ","หมายเลขโทรศัพท์","email","บ้านเลขที","หมู่ที่","ตรอก/ซอย","ถนน","ตำบล/แขวง","อำเภอ/เขต","จังหวัด"];
         const data = json['data'];
         let workbook = new Workbook();
         let worksheet = workbook.addWorksheet(excelFileName);
         let headRow = worksheet.addRow([fullName]);
         headRow.getCell(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'd4f1d4' }
          };
          headRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          headRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
         worksheet.mergeCells('A1:AC1');
         let caseRow = worksheet.addRow(['รวม',json['numCase'],'คดี',json['numLit'],'คน']);
         let headerRow = worksheet.addRow(header);
         // Cell Style : Fill and Border
         headerRow.eachCell((cell, number) => {
            cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'c9eceb' },
            bgColor: { argb: 'FFFFFF00' }
            }
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
         })
         data.forEach(d => {let row = worksheet.addRow(d)});
         worksheet.getColumn(1).width = 10;//A
          worksheet.getColumn(2).width = 17;//B
          worksheet.getColumn(3).width = 17;//C
          worksheet.getColumn(4).width = 17;//D
          worksheet.getColumn(5).width = 17;//E
          worksheet.getColumn(6).width = 17;//F
          worksheet.getColumn(7).width = 40;//G
          worksheet.getColumn(8).width = 40;//H
          worksheet.getColumn(9).width = 19;//I
          worksheet.getColumn(10).width = 10;//J
          worksheet.getColumn(11).width = 12;//K
          worksheet.getColumn(12).width = 30;//L
          worksheet.getColumn(13).width = 12;//M
          worksheet.getColumn(14).width = 18;//N
          worksheet.getColumn(15).width = 25;//O
          worksheet.getColumn(16).width = 15;//P
          worksheet.getColumn(17).width = 8;//Q
          worksheet.getColumn(18).width = 15;//R
          worksheet.getColumn(19).width = 15;//S
          worksheet.getColumn(20).width = 15;//T
          worksheet.getColumn(21).width = 18;//U
          worksheet.getColumn(22).width = 18;//V
          worksheet.getColumn(23).width = 13;//W
          worksheet.getColumn(24).width = 11;//X
          worksheet.getColumn(25).width = 18;//Y
          worksheet.getColumn(26).width = 18;//Z
          worksheet.getColumn(27).width = 18;//AA
          worksheet.getColumn(28).width = 18;//AB
          worksheet.getColumn(29).width = 18;//AC
         for(var x=1;x<30;x++){
            worksheet.getColumn(x).alignment = { vertical: 'middle',horizontal: 'center', wrapText: true };
         }
         workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, excelFileName);
         })

      //----fkb0400-----
    }else if(excelFileName=='fkb0400'){

      const title = excelFileName;
      const header = ["คดีของศาล",
      "หมายเลขคดีดำ",
      "หมายเลขคดีแดง",
      "รหัสหมาย",
      "วันที่จ่ายหมาย",
      "ครั้งจ่ายหมาย",
      "ประเภทหมาย",
      "ส่งถึง",
      "หมายเหตุ",
      "เขตการส่ง",
      "ส่งโดย",
      "คำสั่งหมาย",
      "หมายเลข EMS/ลงทะเบียน",
      "ผู้รับหมาย",
      "ผู้เดินหมาย"
      ];
      const data = json['data'];
      let workbook = new Workbook();
      let worksheet = workbook.addWorksheet(excelFileName);
      let headRow = worksheet.addRow([fullName]);
      headRow.getCell(1).fill = {
         type: 'pattern',
         pattern: 'solid',
         fgColor: { argb: 'd4f1d4' }
       };
       headRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
       headRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
      worksheet.mergeCells('A1:O1');
      let headerRow = worksheet.addRow(header);
      // Cell Style : Fill and Border
      headerRow.eachCell((cell, number) => {
         cell.fill = {
         type: 'pattern',
         pattern: 'solid',
         fgColor: { argb: 'c9eceb' },
         bgColor: { argb: 'FFFFFF00' }
         }
         cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      })
      data.forEach(d => {let row = worksheet.addRow(d)});
       worksheet.getColumn(1).width = 20;//A
       worksheet.getColumn(2).width = 15;//B
       worksheet.getColumn(3).width = 15;//C
       worksheet.getColumn(4).width = 20;//D
       worksheet.getColumn(5).width = 15;//E
       worksheet.getColumn(6).width = 15;//F
       worksheet.getColumn(7).width = 25;//G
       worksheet.getColumn(8).width = 35;//H
       worksheet.getColumn(9).width = 20;//I
       worksheet.getColumn(10).width = 15;//J
       worksheet.getColumn(11).width = 15;//K
       worksheet.getColumn(12).width = 25;//L
       worksheet.getColumn(13).width = 15;//M
       worksheet.getColumn(14).width = 15;//N
       worksheet.getColumn(15).width = 15;//O

     for(var x=1;x<16;x++){
         worksheet.getColumn(x).alignment = { vertical: 'middle',horizontal: 'center', wrapText: true };
      }

      for(var x=1;x<(data.length+3);x++){
          worksheet.getRow(x).height = 28;
      };

      workbook.xlsx.writeBuffer().then((data) => {
         let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
         fs.saveAs(blob, excelFileName);
      })

      //----fkb0800-----
    }else if(excelFileName=='fkb0800'){

      const title = excelFileName;
      const header = ["หมายเลขคดีดำ",
      "หมายเลขคดีแดง",
      "ลำดับที่",
      "เตือนวันที่",
      "หัวข้อการเตือน",
      "เงือนไขการเตือน",
      "ผู้บันทึก",
      "หน่วยงานที่บันทึก",
      "วันที่เวลาบันทึก",
      "ผู้แก้ไขล่าสุด",
      "หน่วยงานที่แก้ไขล่าสุด",
      "วันที่เวลาแก้ไขล่าสุด"
      ];
      const data = json['data'];
      let workbook = new Workbook();
      let worksheet = workbook.addWorksheet(excelFileName);
      let headRow = worksheet.addRow([fullName]);
      headRow.getCell(1).fill = {
         type: 'pattern',
         pattern: 'solid',
         fgColor: { argb: 'd4f1d4' }
       };
       headRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
       headRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
      worksheet.mergeCells('A1:L1');
      let headerRow = worksheet.addRow(header);
      // Cell Style : Fill and Border
      headerRow.eachCell((cell, number) => {
         cell.fill = {
         type: 'pattern',
         pattern: 'solid',
         fgColor: { argb: 'c9eceb' },
         bgColor: { argb: 'FFFFFF00' }
         }
         cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      })
      data.forEach(d => {let row = worksheet.addRow(d)});
       worksheet.getColumn(1).width = 15;//A
       worksheet.getColumn(2).width = 15;//B
       worksheet.getColumn(3).width = 10;//C
       worksheet.getColumn(4).width = 20;//D
       worksheet.getColumn(5).width = 40;//E
       worksheet.getColumn(6).width = 40;//F
       worksheet.getColumn(7).width = 25;//G
       worksheet.getColumn(8).width = 25;//H
       worksheet.getColumn(9).width = 20;//I
       worksheet.getColumn(10).width = 25;//J
       worksheet.getColumn(11).width = 25;//K
       worksheet.getColumn(12).width = 20;//L

     for(var x=1;x<14;x++){
         worksheet.getColumn(x).alignment = { vertical: 'middle',horizontal: 'center', wrapText: true };
      }
      workbook.xlsx.writeBuffer().then((data) => {
         let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
         fs.saveAs(blob, excelFileName);
      })

      }else if(excelFileName=='fap0700'){

         const title = excelFileName;
         const header = ["คดีหมายเลขดำ",
         "คดีหมายเลขแดง",
         "ประเภทนัด",
         "นัดที่",
         "วันนัด",
         "เวลา",
         "ห้องพิจารณาคดี",
         "นัดเพื่อ",
         "สาเหตุที่เลื่อนนัด",
         "วันนัดถัดไป"];
         const data = json['data'];
         let workbook = new Workbook();
         let worksheet = workbook.addWorksheet(excelFileName);
         let headRow = worksheet.addRow([fullName]);
         headRow.getCell(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'd4f1d4' }
          };
          headRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          headRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
         worksheet.mergeCells('A1:J1');
         let headerRow = worksheet.addRow(header);
         // Cell Style : Fill and Border
         headerRow.eachCell((cell, number) => {
            cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'c9eceb' },
            bgColor: { argb: 'FFFFFF00' }
            }
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
         })
         data.forEach(d => {let row = worksheet.addRow(d)});
         worksheet.getColumn(1).width = 18;//A
          worksheet.getColumn(2).width = 17;//B
          worksheet.getColumn(3).width = 30;//C
          worksheet.getColumn(4).width = 17;//D
          worksheet.getColumn(5).width = 17;//E
          worksheet.getColumn(6).width = 17;//F
          worksheet.getColumn(7).width = 20;//G
          worksheet.getColumn(8).width = 30;//H
          worksheet.getColumn(9).width = 40;//I
          worksheet.getColumn(10).width = 16;//J

         for(var x=1;x<11;x++){
            worksheet.getColumn(x).alignment = { vertical: 'middle',horizontal: 'center', wrapText: true };
         }
         workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, excelFileName);
         })

        }else if(excelFileName=='fju0500'){

          const title = excelFileName;
          const header = ["คดีหมายเลขแดง",
          "คดีหมายเลขดำ",
          "วันที่รับฟ้อง",
          "วันที่ออกแดง",
          "ผลคำพิพากษา",
          "ผู้พิพากษาที่ตัดสิน",
          "จบโดย",
          ];
          const data = json['data'];
          let workbook = new Workbook();
          let worksheet = workbook.addWorksheet(excelFileName);
          let headRow = worksheet.addRow([fullName]);
          headRow.getCell(1).fill = {
             type: 'pattern',
             pattern: 'solid',
             fgColor: { argb: 'd4f1d4' }
           };
           headRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
           headRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
          worksheet.mergeCells('A1:G1');
          let headerRow = worksheet.addRow(header);
          // Cell Style : Fill and Border
          headerRow.eachCell((cell, number) => {
             cell.fill = {
             type: 'pattern',
             pattern: 'solid',
             fgColor: { argb: 'c9eceb' },
             bgColor: { argb: 'FFFFFF00' }
             }
             cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          })
          data.forEach(d => {let row = worksheet.addRow(d)});
           worksheet.getColumn(1).width = 18;//A
           worksheet.getColumn(2).width = 17;//B
           worksheet.getColumn(3).width = 30;//C
           worksheet.getColumn(4).width = 17;//D
           worksheet.getColumn(5).width = 17;//E
           worksheet.getColumn(6).width = 17;//F
           worksheet.getColumn(7).width = 20;//G

         for(var x=1;x<8;x++){
             worksheet.getColumn(x).alignment = { vertical: 'middle',horizontal: 'center', wrapText: true };
          }
          workbook.xlsx.writeBuffer().then((data) => {
             let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
             fs.saveAs(blob, excelFileName);
          })

        }else if(excelFileName=='fju0200'){

          const title = excelFileName;
          const header = ["คดีหมายเลขแดง",
          "วันที่ออกแดง",
          "คดีหมายเลขดำ",
          "โจทก์",
          "จำเลย",
          "วันที่รับฟ้อง",
          "เจ้าของสำนวน",
          "คำสั่ง/คำพิพากษาศาล",
          "ผู้พิพากษาที่ตัดสิน",
          "องค์คณะที่ตัดสิน",
          "ผลคำพิพากษา",
          "สถิติไกล่เกลี่ย",
          "คดีแดงที่นำมาพิจารณาใหม่",
          "คำพิพากษาย่อ",
          "วันที่เก็บสำเนา",
          "ทุนทรัพย์",
          "หมายเลขคดีดำศาลสูง",
          "หมายเลขคดีแดงศาลสูง",
          "ไม่เก็บสถิติคดีเสร็จ",
          "ฐานความผิดขึ้นปก",
          "ชั้นพิจารณา",
          "ระยะเวลาจากรับฟ้องถึงคดีเสร็จ(วัน)"
          ];
          const data = json['data'];
          let workbook = new Workbook();
          let worksheet = workbook.addWorksheet(excelFileName);
          let headRow = worksheet.addRow([fullName]);
          headRow.getCell(1).fill = {
             type: 'pattern',
             pattern: 'solid',
             fgColor: { argb: 'd4f1d4' }
           };
           headRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
           headRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
          worksheet.mergeCells('A1:V1');
          let headerRow = worksheet.addRow(header);
          // Cell Style : Fill and Border
          headerRow.eachCell((cell, number) => {
             cell.fill = {
             type: 'pattern',
             pattern: 'solid',
             fgColor: { argb: 'c9eceb' },
             bgColor: { argb: 'FFFFFF00' }
             }
             cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          })
          data.forEach(d => {let row = worksheet.addRow(d)});
           worksheet.getColumn(1).width = 15;//A
           worksheet.getColumn(2).width = 15;//B
           worksheet.getColumn(3).width = 15;//C
           worksheet.getColumn(4).width = 20;//D
           worksheet.getColumn(5).width = 20;//E
           worksheet.getColumn(6).width = 15;//F
           worksheet.getColumn(7).width = 15;//G
           worksheet.getColumn(8).width = 15;//H
           worksheet.getColumn(9).width = 20;//I
           worksheet.getColumn(10).width = 20;//J
           worksheet.getColumn(11).width = 20;//K
           worksheet.getColumn(12).width = 10;//L
           worksheet.getColumn(13).width = 10;//M
           worksheet.getColumn(14).width = 60;//N
           worksheet.getColumn(15).width = 15;//O
           worksheet.getColumn(16).width = 15;//P
           worksheet.getColumn(17).width = 15;//Q
           worksheet.getColumn(18).width = 15;//R
           worksheet.getColumn(19).width = 15;//S
           worksheet.getColumn(20).width = 30;//T
           worksheet.getColumn(21).width = 15;//U
           worksheet.getColumn(22).width = 15;//V

         for(var x=1;x<25;x++){
             worksheet.getColumn(x).alignment = { vertical: 'middle',horizontal: 'center', wrapText: true };
          }
          workbook.xlsx.writeBuffer().then((data) => {
             let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
             fs.saveAs(blob, excelFileName);
          })

        }else if(excelFileName=='fco0800'){

          const title = excelFileName;
          const header = ["ประเภททะเบียน",
          "เลขที่ร่างหนังสือ)",
          "เลขที่หนังสือ",
          "วันที่ส่ง",
          "เรื่อง",
          "เรียน",
          "ถึงศาล",
          "คดีหมายเลขดำ",
          "คดีดำศาลเดิม",
          "คดีแดงศาลเดิม",
          "หน่วยงานที่บันทึก",
          "ผู้บันทึก",
          "วัน/เวลาที่บันทึก",
          "หน่วยงานที่แก้ไข",
          "ผู้แก้ไข",
          "วัน/เวลาที่แก้ไข"
          ];
          const data = json['data'];
          let workbook = new Workbook();
          let worksheet = workbook.addWorksheet(excelFileName);
          let headRow = worksheet.addRow([fullName]);
          headRow.getCell(1).fill = {
             type: 'pattern',
             pattern: 'solid',
             fgColor: { argb: 'd4f1d4' }
           };
           headRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
           headRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
          worksheet.mergeCells('A1:P1');
          // worksheet.addRow(['จำนวนทั้งหมด',json['total_fee'],'รายการ','จำนวนใบเสร็จที่ยกเลิก',json['num_cancel'],'รายการ','โอน',json['sum_transfer'],'บาท','เงินสด',json['sum_cash'],'บาท','เช็ค',json['sum_cheque'],'บาท','บัตรเครดิต',json['sum_credit'],'บาท','รวมเงินทั้งหมด',json['sum_fee'],'บาท'])
          let headerRow = worksheet.addRow(header);
          // Cell Style : Fill and Border
          headerRow.eachCell((cell, number) => {
             cell.fill = {
             type: 'pattern',
             pattern: 'solid',
             fgColor: { argb: 'c9eceb' },
             bgColor: { argb: 'FFFFFF00' }
             }
             cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          })
          data.forEach(d => {let row = worksheet.addRow(d)});
           worksheet.getColumn(1).width = 15;//A
           worksheet.getColumn(2).width = 15;//B
           worksheet.getColumn(3).width = 15;//C
           worksheet.getColumn(4).width = 15;//D
           worksheet.getColumn(5).width = 25;//E
           worksheet.getColumn(6).width = 25;//F
           worksheet.getColumn(7).width = 20;//G
           worksheet.getColumn(8).width = 15;//H
           worksheet.getColumn(9).width = 15;//I
           worksheet.getColumn(10).width = 15;//J
           worksheet.getColumn(11).width = 15;//K
           worksheet.getColumn(12).width = 15;//L
           worksheet.getColumn(13).width = 15;//M
           worksheet.getColumn(14).width = 15;//N
           worksheet.getColumn(15).width = 15;//O
           worksheet.getColumn(16).width = 15;//P
          //  worksheet.getColumn(17).width = 15;//Q
          //  worksheet.getColumn(18).width = 15;//R
          //  worksheet.getColumn(19).width = 15;//S
          //  worksheet.getColumn(20).width = 15;//T


         for(var x=1;x<17;x++){
             worksheet.getColumn(x).alignment = { vertical: 'middle',horizontal: 'center', wrapText: true };
          }
          workbook.xlsx.writeBuffer().then((data) => {
             let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
             fs.saveAs(blob, excelFileName);
          })

        }else if(excelFileName=='fco0700'){

          const title = excelFileName;
          const header = ["ประเภททะเบียน",
          "เลขที่หนังสือ)",
          "วันที่รับ",
          "เรื่อง",
          "เลขที่หนังสือต้นสังกัด",
          "ต้นสังกัด",
          "จาก",
          "ถึง",
          "คดีหมายเลขดำ",
          "คดีหมายเลขแดง",
          "เลขที่ซอง",
          "สิ่งที่ส่งมาด้วย",
          "ต้องตอบกลับ",
          "ภายในวันที่",
          "เลขที่ตอบกลับ",
          "หน่วยงานที่บันทึก",
          "ผู้บันทึก",
          "วัน/เวลาที่บันทึก",
          "หน่วยงานที่แก้ไข",
          "ผู้แก้ไข",
          "วัน/เวลาที่แก้ไข"
          ];
          const data = json['data'];
          let workbook = new Workbook();
          let worksheet = workbook.addWorksheet(excelFileName);
          let headRow = worksheet.addRow([fullName]);
          headRow.getCell(1).fill = {
             type: 'pattern',
             pattern: 'solid',
             fgColor: { argb: 'd4f1d4' }
           };
           headRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
           headRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
          worksheet.mergeCells('A1:U1');
          // worksheet.addRow(['จำนวนทั้งหมด',json['total_fee'],'รายการ','จำนวนใบเสร็จที่ยกเลิก',json['num_cancel'],'รายการ','โอน',json['sum_transfer'],'บาท','เงินสด',json['sum_cash'],'บาท','เช็ค',json['sum_cheque'],'บาท','บัตรเครดิต',json['sum_credit'],'บาท','รวมเงินทั้งหมด',json['sum_fee'],'บาท'])
          let headerRow = worksheet.addRow(header);
          // Cell Style : Fill and Border
          headerRow.eachCell((cell, number) => {
             cell.fill = {
             type: 'pattern',
             pattern: 'solid',
             fgColor: { argb: 'c9eceb' },
             bgColor: { argb: 'FFFFFF00' }
             }
             cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          })
          data.forEach(d => {let row = worksheet.addRow(d)});
           worksheet.getColumn(1).width = 15;//A
           worksheet.getColumn(2).width = 15;//B
           worksheet.getColumn(3).width = 15;//C
           worksheet.getColumn(4).width = 25;//D
           worksheet.getColumn(5).width = 20;//E
           worksheet.getColumn(6).width = 20;//F
           worksheet.getColumn(7).width = 15;//G
           worksheet.getColumn(8).width = 20;//H
           worksheet.getColumn(9).width = 15;//I
           worksheet.getColumn(10).width = 15;//J
           worksheet.getColumn(11).width = 20;//K
           worksheet.getColumn(12).width = 15;//L
           worksheet.getColumn(13).width = 15;//M
           worksheet.getColumn(14).width = 15;//N
           worksheet.getColumn(15).width = 15;//O
           worksheet.getColumn(16).width = 15;//P
           worksheet.getColumn(17).width = 15;//Q
           worksheet.getColumn(18).width = 15;//R
           worksheet.getColumn(19).width = 15;//S
           worksheet.getColumn(20).width = 15;//T
           worksheet.getColumn(21).width = 15;//U


         for(var x=1;x<22;x++){
             worksheet.getColumn(x).alignment = { vertical: 'middle',horizontal: 'center', wrapText: true };
          }
          workbook.xlsx.writeBuffer().then((data) => {
             let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
             fs.saveAs(blob, excelFileName);
          })

        }else if(excelFileName=='ffn0500'){

          const title = excelFileName;
          const header = ["คดีหมายเลขดำ",
          "คดีหมายเลขแดง)",
          "หมายเลขดำศาลเดิม",
          "หมายเลขแดงศาลเดิม",
          "โจทก์",
          "จำเลย",
          "วันที่รับเงิน",
          "ประเภทใบเสร็จ",
          "เล่มที่",
          "เลขที่",
          "ผู้ชำระเงิน",
          "เงินโอน",
          "เงินสด",
          "เช็ค",
          "เลขที่เช็ค",
          "บัตรเครดิต",
          "เลขที่บัตรเครดิต",
          "รวมเงิน",
          "ยกเลิก",
          "หน่วยงานที่บันทึก",
          "ผู้บันทึก",
          "วัน/เวลาที่บันทึก",
          "หน่วยงานที่แก้ไข",
          "ผู้แก้ไข",
          "วัน/เวลาที่แก้ไข"
          ];
          const data = json['data'];
          let workbook = new Workbook();
          let worksheet = workbook.addWorksheet(excelFileName);
          let headRow = worksheet.addRow([fullName]);
          headRow.getCell(1).fill = {
             type: 'pattern',
             pattern: 'solid',
             fgColor: { argb: 'd4f1d4' }
           };
           headRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
           headRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
          worksheet.mergeCells('A1:Y1');
          worksheet.addRow(['จำนวนทั้งหมด',json['total_fee'],'รายการ','จำนวนใบเสร็จที่ยกเลิก',json['num_cancel'],'รายการ','โอน',json['sum_transfer'],'บาท','เงินสด',json['sum_cash'],'บาท','เช็ค',json['sum_cheque'],'บาท','บัตรเครดิต',json['sum_credit'],'บาท','รวมเงินทั้งหมด',json['sum_fee'],'บาท'])
          let headerRow = worksheet.addRow(header);
          // Cell Style : Fill and Border
          headerRow.eachCell((cell, number) => {
             cell.fill = {
             type: 'pattern',
             pattern: 'solid',
             fgColor: { argb: 'c9eceb' },
             bgColor: { argb: 'FFFFFF00' }
             }
             cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          })
          data.forEach(d => {let row = worksheet.addRow(d)});
           worksheet.getColumn(1).width = 15;//A
           worksheet.getColumn(2).width = 15;//B
           worksheet.getColumn(3).width = 15;//C
           worksheet.getColumn(4).width = 15;//D
           worksheet.getColumn(5).width = 20;//E
           worksheet.getColumn(6).width = 20;//F
           worksheet.getColumn(7).width = 15;//G
           worksheet.getColumn(8).width = 20;//H
           worksheet.getColumn(9).width = 10;//I
           worksheet.getColumn(10).width = 10;//J
           worksheet.getColumn(11).width = 20;//K
           worksheet.getColumn(12).width = 10;//L
           worksheet.getColumn(13).width = 10;//M
           worksheet.getColumn(14).width = 10;//N
           worksheet.getColumn(15).width = 15;//O
           worksheet.getColumn(16).width = 10;//P
           worksheet.getColumn(17).width = 10;//Q
           worksheet.getColumn(18).width = 10;//R
           worksheet.getColumn(19).width = 15;//S
           worksheet.getColumn(20).width = 15;//T
           worksheet.getColumn(21).width = 15;//U
           worksheet.getColumn(22).width = 15;//V
           worksheet.getColumn(23).width = 15;//W
           worksheet.getColumn(24).width = 15;//X
           worksheet.getColumn(25).width = 15;//Y

         for(var x=1;x<26;x++){
             worksheet.getColumn(x).alignment = { vertical: 'middle',horizontal: 'center', wrapText: true };
          }
          workbook.xlsx.writeBuffer().then((data) => {
             let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
             fs.saveAs(blob, excelFileName);
          })

        }else if(excelFileName=='ffn0700'){

          const title = excelFileName;
          const header = ["หมายเลขฝากขัง",
          "คดีหมายเลขดำ(เลขแดง)",
          "ประเภทเงิน",
          "รายละเอียด",
          "เลขที่ใบเสร็จ",
          "วันที่รับ",
          "เลขที่อ้างอิง",
          "เลขที่เอกสาร บค.",
          "ประเภทการจ่ายเงิน",
          "เลขที่เช็ค",
          "วันที่เบิก",
          "จ่ายให้แก่",
          "รวมเงิน",
          "จำนวนเงินสด",
          "จำนวนเงินเช็ค",
          "วันที่จ่าย/โอน/รับเช็ค",
          "วันที่ธนาคารจ่าย",
          "ยกเลิก",
          "หน่วยงานที่บันทึก",
          "ผู้บันทึก",
          "วัน/เวลาที่บันทึก",
          "หน่วยงานที่แก้ไข",
          "ผู้แก้ไข",
          "วัน/เวลาที่แก้ไข"
          ];
          const data = json['data'];
          let workbook = new Workbook();
          let worksheet = workbook.addWorksheet(excelFileName);
          let headRow = worksheet.addRow([fullName]);
          headRow.getCell(1).fill = {
             type: 'pattern',
             pattern: 'solid',
             fgColor: { argb: 'd4f1d4' }
           };
           headRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
           headRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
          worksheet.mergeCells('A1:X1');
          worksheet.addRow(['รวมเงินสด',json['sum_cash'],'บาท','เช็ค',json['sum_check'],'บาท'])
          let headerRow = worksheet.addRow(header);
          // Cell Style : Fill and Border
          headerRow.eachCell((cell, number) => {
             cell.fill = {
             type: 'pattern',
             pattern: 'solid',
             fgColor: { argb: 'c9eceb' },
             bgColor: { argb: 'FFFFFF00' }
             }
             cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          })
          data.forEach(d => {let row = worksheet.addRow(d)});
           worksheet.getColumn(1).width = 15;//A
           worksheet.getColumn(2).width = 25;//B
           worksheet.getColumn(3).width = 15;//C
           worksheet.getColumn(4).width = 15;//D
           worksheet.getColumn(5).width = 15;//E
           worksheet.getColumn(6).width = 15;//F
           worksheet.getColumn(7).width = 15;//G
           worksheet.getColumn(8).width = 15;//H
           worksheet.getColumn(9).width = 15;//I
           worksheet.getColumn(10).width = 15;//J
           worksheet.getColumn(11).width = 15;//K
           worksheet.getColumn(12).width = 15;//L
           worksheet.getColumn(13).width = 15;//M
           worksheet.getColumn(14).width = 15;//N
           worksheet.getColumn(15).width = 15;//O
           worksheet.getColumn(16).width = 15;//P
           worksheet.getColumn(17).width = 15;//Q
           worksheet.getColumn(18).width = 15;//R
           worksheet.getColumn(19).width = 15;//S
           worksheet.getColumn(20).width = 15;//T
           worksheet.getColumn(21).width = 15;//U
           worksheet.getColumn(22).width = 15;//V
           worksheet.getColumn(23).width = 15;//W
           worksheet.getColumn(24).width = 15;//X

         for(var x=1;x<25;x++){
             worksheet.getColumn(x).alignment = { vertical: 'middle',horizontal: 'center', wrapText: true };
          }
          workbook.xlsx.writeBuffer().then((data) => {
             let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
             fs.saveAs(blob, excelFileName);
          })

        }else if(excelFileName=='ffn0900'){

          const title = excelFileName;
          const header = ["ลำดับ",
          "วันที่รับคำร้อง)",
          "วันที่ศาลสั่งจ่าย",
          "คดีหมายเลขดำที่",
          "คดีหมายเลขแดงที่",
          "จำเลย",
          "ชื่อทนายขอแรง",
          "ประเภทคดี",
          "จำนวนเงิน",
          "เลขที่เช็ค",
          "สั่งจ่ายเช็ค/จ่ายเงิน/โอนเงิน",
          "วันที่รับเช็ค",
          "ธนาคาร",
          "เลขที่บัญชี",
          "สาขา",
        ];
          const data = json['data'];
          let workbook = new Workbook();
          let worksheet = workbook.addWorksheet(excelFileName);
          let headRow = worksheet.addRow([fullName]);
          headRow.getCell(1).fill = {
             type: 'pattern',
             pattern: 'solid',
             fgColor: { argb: 'd4f1d4' }
           };
           headRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
           headRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
          worksheet.mergeCells('A1:O1');
          // worksheet.addRow(['จำนวนทั้งหมด',json['total_fee'],'รายการ','จำนวนใบเสร็จที่ยกเลิก',json['num_cancel'],'รายการ','โอน',json['sum_transfer'],'บาท','เงินสด',json['sum_cash'],'บาท','เช็ค',json['sum_cheque'],'บาท','บัตรเครดิต',json['sum_credit'],'บาท','รวมเงินทั้งหมด',json['sum_fee'],'บาท'])
          let headerRow = worksheet.addRow(header);
          // Cell Style : Fill and Border
          headerRow.eachCell((cell, number) => {
             cell.fill = {
             type: 'pattern',
             pattern: 'solid',
             fgColor: { argb: 'c9eceb' },
             bgColor: { argb: 'FFFFFF00' }
             }
             cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          })
          data.forEach(d => {let row = worksheet.addRow(d)});
           worksheet.getColumn(1).width = 15;//A
           worksheet.getColumn(2).width = 15;//B
           worksheet.getColumn(3).width = 15;//C
           worksheet.getColumn(4).width = 15;//D
           worksheet.getColumn(5).width = 15;//E
           worksheet.getColumn(6).width = 25;//F
           worksheet.getColumn(7).width = 25;//G
           worksheet.getColumn(8).width = 20;//H
           worksheet.getColumn(9).width = 15;//I
           worksheet.getColumn(10).width = 15;//J
           worksheet.getColumn(11).width = 15;//K
           worksheet.getColumn(12).width = 15;//L
           worksheet.getColumn(13).width = 15;//M
           worksheet.getColumn(14).width = 15;//N
           worksheet.getColumn(15).width = 15;//O
          //  worksheet.getColumn(16).width = 10;//P
          //  worksheet.getColumn(17).width = 10;//Q
          //  worksheet.getColumn(18).width = 10;//R
          //  worksheet.getColumn(19).width = 15;//S
          //  worksheet.getColumn(20).width = 15;//T
          //  worksheet.getColumn(21).width = 15;//U
          //  worksheet.getColumn(22).width = 15;//V
          //  worksheet.getColumn(23).width = 15;//W
          //  worksheet.getColumn(24).width = 15;//X

         for(var x=1;x<16;x++){
             worksheet.getColumn(x).alignment = { vertical: 'middle',horizontal: 'center', wrapText: true };
          }
          workbook.xlsx.writeBuffer().then((data) => {
             let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
             fs.saveAs(blob, excelFileName);
          })

        }else if(excelFileName=='fno9000'){

          const title = excelFileName;
          const header = ["คดีของศาล",
          "คดีหมายเลขดำ)",
          "รหัสหมาย",
          "ประเภทหมาย",
          "หมายถึง",
          "สถานะ",
          "วันที่พิมพ์",
          "หมายนำ/หมายศาล",
          "วันที่ปลดหมาย",
          "วันที่จ่ายหมาย",
          "วันที่รายงานผล",
          "ผลการส่งหมาย",
          "ผู้รายงานผลหมาย",
          "หน่วยงานที่บันทึก",
          "ผู้บันทึก",
          "วัน/เวลาที่บันทึก",
          "หน่วยงานที่แก้ไข",
          "ผู้แก้ไข",
          "วัน/เวลาที่แก้ไข"
          ];
          const data = json['data'];
          let workbook = new Workbook();
          let worksheet = workbook.addWorksheet(excelFileName);
          let headRow = worksheet.addRow([fullName]);
          headRow.getCell(1).fill = {
             type: 'pattern',
             pattern: 'solid',
             fgColor: { argb: 'd4f1d4' }
           };
           headRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
           headRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
          worksheet.mergeCells('A1:S1');
          worksheet.addRow(['รวม',json['numCase'],'คดี','และ',json['numNotice'],'หมาย'])
          let headerRow = worksheet.addRow(header);
          // Cell Style : Fill and Border
          headerRow.eachCell((cell, number) => {
             cell.fill = {
             type: 'pattern',
             pattern: 'solid',
             fgColor: { argb: 'c9eceb' },
             bgColor: { argb: 'FFFFFF00' }
             }
             cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          })
          data.forEach(d => {let row = worksheet.addRow(d)});
           worksheet.getColumn(1).width = 15;//A
           worksheet.getColumn(2).width = 15;//B
           worksheet.getColumn(3).width = 10;//C
           worksheet.getColumn(4).width = 20;//D
           worksheet.getColumn(5).width = 25;//E
           worksheet.getColumn(6).width = 15;//F
           worksheet.getColumn(7).width = 15;//G
           worksheet.getColumn(8).width = 15;//H
           worksheet.getColumn(9).width = 15;//I
           worksheet.getColumn(10).width = 15;//J
           worksheet.getColumn(11).width = 15;//K
           worksheet.getColumn(12).width = 15;//L
           worksheet.getColumn(13).width = 15;//M
           worksheet.getColumn(14).width = 15;//N
           worksheet.getColumn(15).width = 15;//O
           worksheet.getColumn(16).width = 15;//P
           worksheet.getColumn(17).width = 15;//Q
           worksheet.getColumn(18).width = 15;//R
           worksheet.getColumn(19).width = 15;//S
          //  worksheet.getColumn(20).width = 15;//T
          //  worksheet.getColumn(21).width = 15;//U
          //  worksheet.getColumn(22).width = 15;//V
          //  worksheet.getColumn(23).width = 15;//W
          //  worksheet.getColumn(24).width = 15;//X

         for(var x=1;x<26;x++){
             worksheet.getColumn(x).alignment = { vertical: 'middle',horizontal: 'center', wrapText: true };
          }
          workbook.xlsx.writeBuffer().then((data) => {
             let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
             fs.saveAs(blob, excelFileName);
          })

        }else if(excelFileName=='fud9000'){

          const title = excelFileName;
          const header = ["คดีหมายเลขแดง",
          "คดีหมายเลขดำ)",
          "รายการ",
          "ประเภท",
          "ครั้งที่",
          "คำสั่งศาล",
          "วันที่เริ่มต้น",
          "วันที่ศาลสั่งให้ส่ง",
          "วันที่ส่งไป",
          "วันที่รับคืน",
          "วันที่อ่านคำพิพากษา",
          "วันที่แจ้งคำสั่ง/คำพิพากษา",
          "วันที่ตัดสิน",
          "วันที่รับซอง",
          "หน่วยงานที่บันทึก",
          "ผู้บันทึก",
          "วัน/เวลาที่บันทึก",
          "หน่วยงานที่แก้ไข",
          "ผู้แก้ไข",
          "วัน/เวลาที่แก้ไข"
          ];
          const data = json['data'];
          let workbook = new Workbook();
          let worksheet = workbook.addWorksheet(excelFileName);
          let headRow = worksheet.addRow([fullName]);
          headRow.getCell(1).fill = {
             type: 'pattern',
             pattern: 'solid',
             fgColor: { argb: 'd4f1d4' }
           };
           headRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
           headRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
          worksheet.mergeCells('A1:T1');
          worksheet.addRow(['รวม',json['numCase'],'คดี','และ',json['numLit'],'ฉบับ'])
          let headerRow = worksheet.addRow(header);
          // Cell Style : Fill and Border
          headerRow.eachCell((cell, number) => {
             cell.fill = {
             type: 'pattern',
             pattern: 'solid',
             fgColor: { argb: 'c9eceb' },
             bgColor: { argb: 'FFFFFF00' }
             }
             cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          })
          data.forEach(d => {let row = worksheet.addRow(d)});
           worksheet.getColumn(1).width = 15;//A
           worksheet.getColumn(2).width = 15;//B
           worksheet.getColumn(3).width = 15;//C
           worksheet.getColumn(4).width = 15;//D
           worksheet.getColumn(5).width = 15;//E
           worksheet.getColumn(6).width = 15;//F
           worksheet.getColumn(7).width = 15;//G
           worksheet.getColumn(8).width = 15;//H
           worksheet.getColumn(9).width = 15;//I
           worksheet.getColumn(10).width = 15;//J
           worksheet.getColumn(11).width = 15;//K
           worksheet.getColumn(12).width = 15;//L
           worksheet.getColumn(13).width = 15;//M
           worksheet.getColumn(14).width = 15;//N
           worksheet.getColumn(15).width = 15;//O
           worksheet.getColumn(16).width = 15;//P
           worksheet.getColumn(17).width = 15;//Q
           worksheet.getColumn(18).width = 15;//R
           worksheet.getColumn(19).width = 15;//S
           worksheet.getColumn(20).width = 15;//T
          //  worksheet.getColumn(21).width = 15;//U
          //  worksheet.getColumn(22).width = 15;//V
          //  worksheet.getColumn(23).width = 15;//W
          //  worksheet.getColumn(24).width = 15;//X

         for(var x=1;x<21;x++){
             worksheet.getColumn(x).alignment = { vertical: 'middle',horizontal: 'center', wrapText: true };
          }
          workbook.xlsx.writeBuffer().then((data) => {
             let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
             fs.saveAs(blob, excelFileName);
          })

        }else if(excelFileName=='fmg2301'){

          const title = excelFileName;
          const header = ["เลขที่/ครั้งที่",
          "เลขที่รับแจ้ง)",
          "หน่วยงานที่แจ้ง",
          "แจ้งถึงหน่วยงาน",
          "วัน/เวลาที่แจ้ง",
          "ประเภทของปัญหา",
          "รายละเอียดปัญหา",
          "ผู้แจ้ง",
          "ผู้รับผิดชอบ",
          "วัน/เวลาที่สั่งแก้",
          "เพิ่มเติม",
          "วัน/เวลาที่บริษัทรับแจ้ง",
          "วัน/เวลาที่แก้เสร็จ",
          "รายละเอียดการแก้ไข",
          "ผลการทดสอบ",
          ];
          const data = json['data'];
          let workbook = new Workbook();
          let worksheet = workbook.addWorksheet(excelFileName);
          let headRow = worksheet.addRow([fullName]);
          headRow.getCell(1).fill = {
             type: 'pattern',
             pattern: 'solid',
             fgColor: { argb: 'd4f1d4' }
           };
           headRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
           headRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
          worksheet.mergeCells('A1:O1');
          // worksheet.addRow(['รวม',json['numCase'],'คดี','และ',json['numLit'],'ฉบับ'])
          let headerRow = worksheet.addRow(header);
          // Cell Style : Fill and Border
          headerRow.eachCell((cell, number) => {
             cell.fill = {
             type: 'pattern',
             pattern: 'solid',
             fgColor: { argb: 'c9eceb' },
             bgColor: { argb: 'FFFFFF00' }
             }
             cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          })
          data.forEach(d => {let row = worksheet.addRow(d)});
           worksheet.getColumn(1).width = 15;//A
           worksheet.getColumn(2).width = 15;//B
           worksheet.getColumn(3).width = 15;//C
           worksheet.getColumn(4).width = 15;//D
           worksheet.getColumn(5).width = 15;//E
           worksheet.getColumn(6).width = 15;//F
           worksheet.getColumn(7).width = 15;//G
           worksheet.getColumn(8).width = 15;//H
           worksheet.getColumn(9).width = 15;//I
           worksheet.getColumn(10).width = 15;//J
           worksheet.getColumn(11).width = 15;//K
           worksheet.getColumn(12).width = 15;//L
           worksheet.getColumn(13).width = 15;//M
           worksheet.getColumn(14).width = 15;//N
           worksheet.getColumn(15).width = 15;//O
          //  worksheet.getColumn(16).width = 15;//P
          //  worksheet.getColumn(17).width = 15;//Q
          //  worksheet.getColumn(18).width = 15;//R
          //  worksheet.getColumn(19).width = 15;//S
          //  worksheet.getColumn(20).width = 15;//T
          //  worksheet.getColumn(21).width = 15;//U
          //  worksheet.getColumn(22).width = 15;//V
          //  worksheet.getColumn(23).width = 15;//W
          //  worksheet.getColumn(24).width = 15;//X

         for(var x=1;x<16;x++){
             worksheet.getColumn(x).alignment = { vertical: 'middle',horizontal: 'center', wrapText: true };
          }
          workbook.xlsx.writeBuffer().then((data) => {
             let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
             fs.saveAs(blob, excelFileName);
          })

        }  else if(excelFileName=='fju6000') {
          const title = excelFileName;
          const header = ["ลำดับที่ซอง",
             "วันที่รับซอง",
             "หมายเลขคดีดำ",
             "หมายเลขคดีแดง",
             "โจทก์กับพวก",
             "จำเลยกับพวก",
             "เลขซองศาลสูง",
             "วันนัด",
             "ห้อง",
             "เหตุที่นัด",
             "ไม่รับส่งคืนศาลสูง",
             "อ่าน",
             "ยกเลิก/เลื่อน",
             "วันนัดถัดไป",
             "เลขที่หนังสือแจ้งการอ่าน",
             "วันที่แจ้งการอ่าน",
             "ซองอยู่ที่งาน"
          ];
          const data = json['data'];
          let workbook = new Workbook();
          let worksheet = workbook.addWorksheet(excelFileName);
          let headRow = worksheet.addRow([fullName]);
          headRow.getCell(1).fill = {
             type: 'pattern',
             pattern: 'solid',
             fgColor: { argb: 'd4f1d4' }
          };
          headRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          headRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
          worksheet.mergeCells('A1:Q1');
          let headerRow = worksheet.addRow(header);
          // Cell Style : Fill and Border
          headerRow.eachCell((cell, number) => {
             cell.fill = {
             type: 'pattern',
             pattern: 'solid',
             fgColor: { argb: 'c9eceb' },
             bgColor: { argb: 'FFFFFF00' }
             }
             cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          })
          data.forEach(d => {let row = worksheet.addRow(d)});
          worksheet.getColumn(1).width = 14;//A
          worksheet.getColumn(2).width = 14;//B
          worksheet.getColumn(3).width = 14;//C
          worksheet.getColumn(4).width = 14;//D
          worksheet.getColumn(5).width = 30;//E
          worksheet.getColumn(6).width = 30;//F
          worksheet.getColumn(7).width = 14;//G
          worksheet.getColumn(8).width = 14;//H
          worksheet.getColumn(9).width = 14;//I
          worksheet.getColumn(10).width = 14;//J
          worksheet.getColumn(11).width = 14;//K
          worksheet.getColumn(12).width = 14;//L
          worksheet.getColumn(13).width = 14;//M
          worksheet.getColumn(14).width = 14;//N
          worksheet.getColumn(15).width = 14;//O
          worksheet.getColumn(16).width = 14;//P
          worksheet.getColumn(17).width = 40;//Q
          for(var x=1;x<18;x++){
             worksheet.getColumn(x).alignment = { vertical: 'middle',horizontal: 'center', wrapText: true };
          }
          workbook.xlsx.writeBuffer().then((data) => {
             let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
             fs.saveAs(blob, excelFileName);
          })

      }else if(excelFileName=='fap0200'){

         const title = excelFileName;
         const header = ["คดีหมายเลขดำ",
         "คดีหมายเลขแดง",
         "วันที่รับฟ้อง",
         "โจทก์/ผู้ร้อง",
         "จำเลย/ผู้คัดค้าน",
         "ประเภทนัด",
         "นัดที",
         "วันนัด",
         "เวลา",
         "ห้องพิจารณาคดี",
         "ผู้พิพากษาที่ขึ้นบัลลังก์",
         "นัดเพื่อ",
         "เหตุที่เลื่อนนัด",
         "ผลการพิจารณคดี",
         "ผลคำพิพากษา",
         "ฐานความผิดขึ้นปก",
         "ระยะเวลา รับฟ้อง-ออกแดง(วัน)",
         "ระยะเวลา รับฟ้อง-วันนัด(วัน)",
         "วันนัดถัดไป",
         "เวลานัดถัดไป"
      ];

         const data = json['data'];
         let workbook = new Workbook();
         let worksheet = workbook.addWorksheet(excelFileName);
         let headRow = worksheet.addRow([fullName]);
         headRow.getCell(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'd4f1d4' }
          };
          headRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          headRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
         worksheet.mergeCells('A1:T1');

         let caseRow = worksheet.addRow(['จำนวนคดีทั้งหมด : ',json['num_case'],
         '   จำนวนนัดทั้งหมด :',json['num_app'],
         'ครั้ง    จำนวนคดีที่มีนัด ช่วงวันที่ :',json['start_date'],
         ' ถึง ',json['end_date'],
         '   จำนวน :',json['num_case_appoint'],
         '   คดีที่ไม่มีนัด :',json['num_case_no_appoint'],
         ' คดี']);

         let headerRow = worksheet.addRow(header);
         // Cell Style : Fill and Border
         headerRow.eachCell((cell, number) => {
            cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'c9eceb' },
            bgColor: { argb: 'FFFFFF00' }
            }
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
         })
         data.forEach(d => {let row = worksheet.addRow(d)});
         worksheet.getColumn(1).width = 18;//A
          worksheet.getColumn(2).width = 17;//B
          worksheet.getColumn(3).width = 20;//C
          worksheet.getColumn(4).width = 30;//D
          worksheet.getColumn(5).width = 30;//E
          worksheet.getColumn(6).width = 30;//F
          worksheet.getColumn(7).width = 8;//G
          worksheet.getColumn(8).width = 12;//H
          worksheet.getColumn(9).width = 14;//I
          worksheet.getColumn(10).width = 20;//J
          worksheet.getColumn(11).width = 25;//K
          worksheet.getColumn(12).width = 18;//L
          worksheet.getColumn(13).width = 20;//M
          worksheet.getColumn(14).width = 20;//N
          worksheet.getColumn(15).width = 20;//O
          worksheet.getColumn(16).width = 45;//P
          worksheet.getColumn(17).width = 18;//Q
          worksheet.getColumn(18).width = 18;//R
          worksheet.getColumn(19).width = 18;//S
          worksheet.getColumn(20).width = 18;//T

         for(var x=1;x<20;x++){
            worksheet.getColumn(x).alignment = { vertical: 'middle',horizontal: 'center', wrapText: true };
         }
         workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, excelFileName);
         })

      }else if(excelFileName=='fsc0500'){

         const title = excelFileName;
         const header = ["เลขที่คำร้อง",
         "หมายค้นเลขที่",
         "เขต",
         "หน่วยงานขอหมายค้น",
         "ผู้ร้อง",
         "ผู้พิพากษา",
         "วันที่ยื่น/อนุมัติ",
         "วันที่ค้น",
         "ผลการค้น",
         "คำสั่งศาล",
         "หน่วยงานที่บันทึก",
         "ผู้บันทึก",
         "วัน/เวลาที่บันทึก",
         "หน่วยงานที่แก้ไข",
         "ผู้แก้ไข",
         "วัน/เวลาที่แก้ไข"
         ];

         const data = json['data'];
         let workbook = new Workbook();
         let worksheet = workbook.addWorksheet(excelFileName);
         let headRow = worksheet.addRow([fullName]);
         headRow.getCell(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'd4f1d4' }
          };
          headRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          headRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
         worksheet.mergeCells('A1:P1');

         let headerRow = worksheet.addRow(header);
         // Cell Style : Fill and Border
         headerRow.eachCell((cell, number) => {
            cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'c9eceb' },
            bgColor: { argb: 'FFFFFF00' }
            }
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
            
         })
         data.forEach(d => {
            let row = worksheet.addRow(d);
            row.eachCell({ includeEmpty: true }, function(cell, rowNumber) {
               cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
            });
            row.getCell(row.number).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
         });
         worksheet.getColumn(1).width = 18;//A
          worksheet.getColumn(2).width = 17;//B
          worksheet.getColumn(3).width = 20;//C
          worksheet.getColumn(4).width = 30;//D
          worksheet.getColumn(5).width = 30;//E
          worksheet.getColumn(6).width = 30;//F
          worksheet.getColumn(7).width = 15;//G
          worksheet.getColumn(8).width = 15;//H
          worksheet.getColumn(9).width = 14;//I
          worksheet.getColumn(10).width = 20;//J
          worksheet.getColumn(11).width = 25;//K
          worksheet.getColumn(12).width = 18;//L
          worksheet.getColumn(13).width = 20;//M
          worksheet.getColumn(14).width = 20;//N
          worksheet.getColumn(15).width = 20;//O
          worksheet.getColumn(16).width = 45;//P


         for(var x=1;x<17;x++){
            worksheet.getColumn(x).alignment = { vertical: 'middle',horizontal: 'center', wrapText: true };
            
         }
         workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, excelFileName);
         })

      }else if(excelFileName=='fsc0600'){

         const title = excelFileName;
         const header = ["เลขที่คำร้อง",
         "หมายจับเลขที่",
         "เขต",
         "สถานีตำรวจ",
         "ผู้ร้อง",
         "ผู้พิพากษา",
         "วันที่ยื่น/อนุมัติ",
         "วันที่หมดอายุความ",
         "วันที่จับ",
         "ผลการจับ",
         "คำสั่งศาล",
         "หน่วยงานที่บันทึก",
         "ผู้บันทึก",
         "วัน/เวลาที่บันทึก",
         "หน่วยงานที่แก้ไข",
         "ผู้แก้ไข",
         "วัน/เวลาที่แก้ไข"
         ];

         const data = json['data'];
         let workbook = new Workbook();
         let worksheet = workbook.addWorksheet(excelFileName);
         let headRow = worksheet.addRow([fullName]);
         headRow.getCell(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'd4f1d4' }
          };
          headRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          headRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
         worksheet.mergeCells('A1:Q1');

         let headerRow = worksheet.addRow(header);
         // Cell Style : Fill and Border
         headerRow.eachCell((cell, number) => {
            cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'c9eceb' },
            bgColor: { argb: 'FFFFFF00' }
            }
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
            
         })
         data.forEach(d => {
            let row = worksheet.addRow(d);
            row.eachCell({ includeEmpty: true }, function(cell, rowNumber) {
               cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
            });
            row.getCell(row.number).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
         });
         worksheet.getColumn(1).width = 18;//A
          worksheet.getColumn(2).width = 17;//B
          worksheet.getColumn(3).width = 20;//C
          worksheet.getColumn(4).width = 30;//D
          worksheet.getColumn(5).width = 30;//E
          worksheet.getColumn(6).width = 30;//F
          worksheet.getColumn(7).width = 15;//G
          worksheet.getColumn(8).width = 15;//H
          worksheet.getColumn(9).width = 14;//I
          worksheet.getColumn(10).width = 20;//J
          worksheet.getColumn(11).width = 25;//K
          worksheet.getColumn(12).width = 18;//L
          worksheet.getColumn(13).width = 20;//M
          worksheet.getColumn(14).width = 20;//N
          worksheet.getColumn(15).width = 20;//O
          worksheet.getColumn(16).width = 45;//P
          worksheet.getColumn(17).width = 45;//Q


         for(var x=1;x<17;x++){
            worksheet.getColumn(x).alignment = { vertical: 'middle',horizontal: 'center', wrapText: true };
            
         }
         workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, excelFileName);
         })

      }
   }
}
/*
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ExcelService {

  constructor() {}

  public exportAsExcelFile(json: any[], excelFileName: string): void {

     const myworksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
     const myworkbook: XLSX.WorkBook = {
        Sheets: {
           'data': myworksheet
        },
        SheetNames: ['data']
     };
     const excelBuffer: any = XLSX.write(myworkbook, {
        bookType: 'xlsx',
        type: 'array'
     });
     this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
     const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
     });
     FileSaver.saveAs(data, fileName + '_exported' + EXCEL_EXTENSION);
  }

}
*/
