
 export function compareTimeStamp(d1: string, d2: string) {
    let firstDate = Number.MAX_VALUE;
    let secondDate  = Number.MAX_VALUE;
    if (d1) {
      firstDate = new Date(d1).getTime();
    }
    if (d2) {
      secondDate = new Date(d2).getTime();
    }
    return secondDate - firstDate;
  }

