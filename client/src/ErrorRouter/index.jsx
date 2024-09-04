import {useRouteError} from "react-router-dom"

const ErrorBoundary = () => {
    const err = useRouteError()

    return (
        <section>
            <h1>404 Not Found</h1>
            <small>{err?.message}</small>
        </section>
    )
}

export default ErrorBoundary