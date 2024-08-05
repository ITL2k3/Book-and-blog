import app from "./src/app.js";

const PORT = process.env.PORT || 3056

const server = app.listen(PORT, () => {
    console.log('Book_blog start on port, ',PORT)
})

process.on('SIGINT', () => {
    server.close(() => {
        console.log('Exit server')
    })
})


