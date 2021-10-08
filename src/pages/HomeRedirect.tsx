import React, { useEffect } from 'react'

import { isLoggedIn } from '../components/login/TokenProvider'

const HomeRedirect = () => {
    useEffect(() => {
        if (!!isLoggedIn()) {
            window.location.replace('/home')
        }
        window.location.replace('/')
    }, [])

    return (
        <React.Fragment>

        </React.Fragment>
    )
}

export default HomeRedirect