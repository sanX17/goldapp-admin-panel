import { NextResponse } from "next/server";

import { getAdminDb } from "../../../../lib/firebase-admin";
import {
  createSessionToken,
  getSessionCookieOptions,
  SESSION_COOKIE_NAME,
} from "../../../../lib/session";

export async function POST(request) {
  try {
    const body = await request.json();
    const companyCode = String(body?.companyCode ?? "").trim();
    const companyId = String(body?.companyId ?? "").trim();

    if (!companyCode || !companyId) {
      return NextResponse.json(
        { message: "Company code and ID are required." },
        { status: 400 }
      );
    }

    const snapshot = await getAdminDb()
      .collection("JWL_COMPANY")
      .where("Company_Code", "==", companyCode)
      .get();

    if (snapshot.empty) {
      return NextResponse.json(
        { message: "Invalid company code or ID. Please try again." },
        { status: 401 }
      );
    }

    const matchedDoc = snapshot.docs.find((doc) => {
      const data = doc.data();
      return String(data.Company_Id ?? "").trim() === companyId;
    });

    if (!matchedDoc) {
      return NextResponse.json(
        { message: "Invalid company code or ID. Please try again." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ ok: true });
    const sessionToken = createSessionToken({
      companyCode,
      companyId,
      docId: matchedDoc.id,
    });

    response.cookies.set(
      SESSION_COOKIE_NAME,
      sessionToken,
      getSessionCookieOptions()
    );

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: error?.message || "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
