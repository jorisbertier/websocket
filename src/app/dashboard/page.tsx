"use client";

import AuthGuard from "@/auth/authGuard";
import Chat from "@/component/chat";
import { useUser } from "@/hooks/useUser";

export default function Dashboard() {
    const { user } = useUser();

    return (
    );
}
