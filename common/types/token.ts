export interface IToken {
    exp: number,
    iat: number,
    data: {
        _id: string,
        coords: {
            latitude: number,
            longitude: number
        },
        username: string,
        email: string,
        garage: Array<unknown>,
        verified: boolean
    }
}