export class Utilities {
  public static _to2digit(n: number) {
    return ('00' + n).slice(-2);
  }

  public static ConvertDateToDDMMYYYY(date: Date) {
    if(!date) {
      return ""
    }
    let dd:number = date.getDate()
    let mm:number = date.getMonth() + 1
    let yy:number = date.getFullYear()+543

    return `${Utilities._to2digit(dd)}-${Utilities._to2digit(mm)}-${yy}`
  }

  public static ConvertDateToHHMMSS(date: Date) {
    if(!date) {
      return ""
    }

    let hh:number = date.getHours()
    let mm:number = date.getMinutes()
    let ss:number = date.getSeconds()

    return `${Utilities._to2digit(hh)}:${Utilities._to2digit(mm)}:${Utilities._to2digit(ss)}`
  }
}
