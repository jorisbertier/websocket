import { User } from "@/interface/interface";

export const fetchallLastMessages = async(userId: string, conversations: User[]) => {
        const newMap: { [key: string]: any } = {};
        for (const convUser of conversations) {
            try {
                const res = await fetch(`http://localhost:3001/api/messages/${userId}/${convUser._id}`);
                const data = await res.json();
                const sorted = [...data].sort((a, b) => new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime());
                if (sorted.length > 0) {
                newMap[convUser._id] = sorted[0];
                }
            } catch (error) {
                console.error(`Erreur messages pour ${convUser._id}`, error);
            }
        }

        return newMap
}