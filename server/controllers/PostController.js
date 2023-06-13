import PostModel from "../models/Post.js";

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags.split(','),
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

        await PostModel.findOneAndUpdate({
            _id: postId
        },{
            $inc: {viewsCount: 1}
        },{
            returnDocument: "after"
        }).then(doc => {
            if (!doc) {
                return res.json({
                    message: "Статья не найдена"
                })
            }
            res.json(doc)
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Ошибка при получение статьи"
        })
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id

        await PostModel.findOneAndDelete({
            _id: postId
        }).then(data => {
            if (!data) {
                return res.json({
                    message: "Ошибка при удаление статьи"
                })
            }

            return res.json({
                message: "Статья успешно удалена"
            })
        })


    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Ошибка при получение статьи"
        })
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id

        await PostModel.updateOne({
            _id: postId
        },{
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            user: req.body.userId,
            imageUrl: req.body.imageUrl
        })

        res.json({
            message: "Статья успешно обновлена"
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Ошибка при обновление статьи"
        })
    }
}

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();

        const tags = posts
            .map((obj) => obj.tags)
            .flat()
            .slice(0, 5);

        res.json(tags);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить тэги',
        });
    }
};