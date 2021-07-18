import app from './app'

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log('🔥 Server started in port', port)
})
