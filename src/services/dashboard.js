import {

collection,
getDocs

} from "firebase/firestore";

import { db } from "../lib/firebase";

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

String(
item.status
).trim()

===

"PENDING"

).length;

const paid =

data.filter(

(item)=>

String(
item.status
).trim()

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

String(
item.status
).trim()

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

String(
item.status
).trim()

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
paid,
totalAmount,
pendingAmount,
paidAmount,
total:

data.length

};

};