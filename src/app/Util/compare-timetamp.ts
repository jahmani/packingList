
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

