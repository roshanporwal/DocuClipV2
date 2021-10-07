import React, { useEffect } from 'react'

import { isLoggedIn } from '../components/login/TokenProvider'

const CategoryRedirect = () => {
    useEffect(() => {
        if (!!isLoggedIn()) {
            window.location.replace('/category')
        }
        window.location.replace('/')
    }, [])

    return (
        <React.Fragment>

        </React.Fragment>
    )
}

export default CategoryRedirect