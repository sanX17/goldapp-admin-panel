import {

collection,
query,
where,
onSnapshot,
updateDoc,
doc

} from "firebase/firestore";

import { db } from "../lib/firebase";

export const listenTransactions=

(status,callback)=>{

 let q;

 if(status==="ALL"){

 q=query(

 collection(
 db,
 "PAYMENT_REQUESTS"
 )

 );

 }

 else{

 q=query(

 collection(
 db,
 "PAYMENT_REQUESTS"
 ),

 where(
 "status",
 "==",
 status
 )

 );

 }

 return onSnapshot(

 q,

(snapshot)=>{

callback(

snapshot.docs.map(

(doc)=>({

id:doc.id,

...doc.data()

})

)

);

}

);

};

export const markPaid=
async(id)=>{

 await updateDoc(

 doc(
 db,
 "PAYMENT_REQUESTS",
 id
 ),

 {

 status:"PAID",

 paidAt:Date.now()

 }

 );

};

export const markPending=
async(id)=>{

 await updateDoc(

 doc(
 db,
 "PAYMENT_REQUESTS",
 id
 ),

 {

 status:"PENDING",

 paidAt:null

 }

 );

};