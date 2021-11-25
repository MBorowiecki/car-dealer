import { NextResponse } from 'next/server';

export const middleware = async (req) => {
    const { pathname } = req.nextUrl;

    if (pathname !== "/login" && pathname !== "/choose-starting-car") {
        const { token, firstLogin } = req.cookies;

        if (!token) {
            return NextResponse.redirect("/login");
        }

        if (firstLogin === "true") {
            return NextResponse.redirect('/choose-starting-car');
        }

        return NextResponse.next();
    }

    if (pathname === "/choose-starting-car") {
        const { token, firstLogin } = req.cookies;

        if (!firstLogin || firstLogin !== "true") {
            if (token) {
                return NextResponse.redirect('/');
            } else {
                return NextResponse.redirect('/login');
            }
        }

        return NextResponse.next();
    }
}