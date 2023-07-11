// code from https://www.codementor.io/@obabichev/react-token-auth-12os8txqo1

const TokenProvider = () => {
    const tempVar = localStorage.getItem('REACT_TOKEN_AUTH') || '""'
    let _token = JSON.parse(tempVar) === "" ? null : JSON.parse(tempVar);

    /**
     * Saves the JSON token to local storage
     * @param token
     */
    const setToken = (token: typeof _token) => {
        if (token) {
            localStorage.setItem('REACT_TOKEN_AUTH', JSON.stringify(token));
        } else {
            localStorage.removeItem('REACT_TOKEN_AUTH');
        }
        _token = token;
    };

    /**
     * Deletes the token from local storage,
     * essentially logging the user out
     */
    const destroyToken = () => {
        localStorage.removeItem('REACT_TOKEN_AUTH');
        _token = null
    }

    /**
     * Retrieves the token, and the information related to it
     * from local storage
     */
    const getToken = () => {
        const token = {
            userId: _token.userId,
            userEmail: _token.userEmail,
            userName: _token.userName,
            fullname: _token.fullname,
           // businessname: _token.businessname,
            nickname: _token.nickname
        }

        return token
    }

    /**
     * Checks if a token is present or not and determines if a
     * user is logged in
     */
    const isLoggedIn = () => {
        return _token === null ? false : true
    };

    return {
        isLoggedIn,
        setToken,
        getToken,
        destroyToken
    };
};

export const { isLoggedIn, setToken, getToken, destroyToken } = TokenProvider();