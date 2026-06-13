import {

collection,
getDocs

} from "firebase/firestore";

import { db } from "../lib/firebase";

function getPaymentStatusValue(item) {
 const rawStatus =
 item.paymentStatus ??
 item.payment_status ??
 item.payment?.status ??
 item.paymentDetails?.status ??
 item.status;

 const normalized =
 String(rawStatus ?? "").trim().toUpperCase();

 if (
 normalized === "SUCCESS" ||
 normalized === "SUCCESSFUL"
 ) {
  return "PAID";
 }

 return normalized;
}

function getSyncStatusValue(item) {
 return String(item.status ?? "").trim().toUpperCase();
}

export const getDashboardStats =
async ()=>{

const snap =
await getDocs(
collection(
db,
"PAYMENT_REQUESTS"
)
);

const data =
snap.docs.map(

(doc)=>doc.data()

);

const pending =

data.filter(

(item)=>

getSyncStatusValue(item)
===
"PENDING"

).length;

const completedSync =

data.filter(

(item)=>{

const syncStatus =
getSyncStatusValue(item);

return (
 syncStatus !== "PENDING"
);
}

).length;

const paid =

data.filter(

(item)=>

getPaymentStatusValue(item)
===
"PAID"

).length;

const totalAmount =

data.reduce(

(sum,item)=>

sum +

(item.totalAmount || 0),

0

);

const pendingAmount =

data.filter(

(item)=>

getPaymentStatusValue(item)
===
"PENDING"

).reduce(

(sum,item)=>

sum +

(item.totalAmount || 0),

0

);

const paidAmount =

data.filter(

(item)=>

getPaymentStatusValue(item)
===
"PAID"

).reduce(

(sum,item)=>

sum +

(item.totalAmount || 0),

0

);

return {

pending,
completedSync,
paid,
totalAmount,
pendingAmount,
paidAmount,
total:

data.length

};

};
