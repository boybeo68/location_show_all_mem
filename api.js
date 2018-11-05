export const fetchLocationId = async () => {
    try {
        const response = await fetch(
            `http://5b8febb1eb676700148a4dc6.mockapi.io/api/user`,
        );
        return await response.json()
    } catch (e) {
        console.log(e)
    }
};