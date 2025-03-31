"use client";

import { useAppDispatch } from "@/util/store";
import { setUser } from "@/util/storeSlices/userSlice";
import { useEffect } from "react";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const dispatch = useAppDispatch();
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        if (user) {
            dispatch(setUser(user));
        }
    }, []);

    return <>{children}</>;
}
