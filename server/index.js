import express from "express"

const app = express()

app.get("/", (req, res) => {
    res.send("Work!")
})

app.listen(5600, (err) => {
    if (err) {
        console.log("Сервер не запустился!")
    } else {
        console.log("OK!")
    }
})