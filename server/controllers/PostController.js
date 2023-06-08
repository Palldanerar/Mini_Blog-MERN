import PostModel from "../models/Post.js";

export const createPost = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            user: req.userId
        })

        const post = await doc.save()

        res.json(post)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Ошибка при создание статьи"
        })
    }
}

export const getAll = async (req, res) => {
    try {
        const  posts = await PostModel.find().populate("user").exec()

        res.json(posts)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Ошибка при получение статей"
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id

        PostModel.findOneAndUpdate({
            _id: postId
        },{
            $inc: {viewsCount: 1}
        },{
            returnDocument: "after"
        }).then(doc => {
            res.json(doc)
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Ошибка при получение статьи"
        })
    }
}