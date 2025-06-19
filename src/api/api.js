export async function get(url) {
    try {
        const res = await     fetch(url, {
            method: 'GET',
            credentials: 'include'
        })

        if(!res.ok) {
            throw new Error('Unauthorized')
        }

        const data = await res.json()
        return data;

    } catch(e) {
        throw new Error('Get user error: ', e);
    }
}

export const sendFriendRequest = async (fromUserId, toUserIdPseudo) => {
    try {
        const response = await fetch('http://localhost:3001/api/friendRequest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fromUserId,
                toUserIdPseudo,
            }),
            credentials: 'include',
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, data };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
};


export const respondToFriendRequest = async (requestId, toUserId, action) => {
    try {
    const response = await fetch(`http://localhost:3001/api/friendRequest/${action}`, {
        method: 'POST',
        headers: {
        'Content-type' : 'application/json',
        },
        body : JSON.stringify({
        fromUserId: requestId,
        toUserId: toUserId,
        }),
        credentials: 'include'
    });
    const data = await response.json();

    if (response.ok) {
        return { success: true, action, data };
    } else {
        return { success: false, message: data.message };
    }

    }catch(e) {
        console.log('Error while sending friend request: ', e)
    }
};