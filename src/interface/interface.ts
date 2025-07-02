export interface User {
    _id: string;
    pseudo: string;
    friends?: [];
    friendRequests?: [],
    friendRequestsSent?: [],
}
export interface Message {
    id: string;
    from: string;
    to: string;
    text: string;
    timeStamp: string;
}