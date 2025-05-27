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