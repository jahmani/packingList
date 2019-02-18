
import { } from "firebase/firestore";
import { identifierModuleUrl } from "@angular/compiler";

export function compareTimeStamp(d1: firebase.firestore.Timestamp, d2: firebase.firestore.Timestamp) {
  if (!d1 || !d2) {
  return 0;
  }
  const res = d2.seconds - d1.seconds;
  if (res === 0) {
    return d2.nanoseconds - d1.nanoseconds;
  } else {
    return res;
  }
}
export function compareTimeString(d1: string, d2: string) {
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



