import Blog from "../models/blog.model.js"
import cloudinary from "../config/cloudinary.js"
import {handleError} from "../helpers/handleError.js"
import {encode} from "entities"
import Category from "../models/category.model.js";


export const addBlog = async (req, res, next) => {
    try {
        const data = JSON.parse(req.body.data)
        let featuredImage = ''
        if (req.file) {
            // Upload an image
            const uploadResult = await cloudinary.uploader
                .upload(
                    req.file.path,
                    { folder: 'goswami-blog', resource_type: 'auto' }
                )
                .catch((error) => {
                    next(handleError(500, error.message))
                });

            featuredImage = uploadResult.secure_url
        }
        
        const blog = new Blog({
            author: data.author,
            category: data.category,
            title: data.title,
            slug: `${data.slug}-${Math.round(Math.random() * 100000)}`,
            featuredImage: featuredImage,
            emailBlog: data.emailBlog,
            pswBlog: data.pswBlog,
            blogContent: encode(data.blogContent),
        })

        await blog.save()

        res.status(200).json({
            success: true,
            message: 'Blog added successfully.'
        })

    } catch (error) {
        next(handleError(500, error.message))
    }
}

export const editBlog = async (req, res, next) => {
    try {
        const {blogid} = req.params
        const blog = await Blog.findById(blogid).populate('category', 'name')
        if(!blog) {
            next(handleError(404, "Blog not found"))
        }
        res.status(200).json({
            blog
        })
    } catch (error) {
        next(handleError(500, error.message));
    }
}

export const updateBlog = async (req, res, next) => {
    try {
        const { blogid } = req.params
        const data = JSON.parse(req.body.data)

        const blog = await Blog.findById(blogid)

        blog.category = data.category
        blog.title = data.title
        blog.slug = data.slug
        blog.blogContent = data.blogContent
        blog.emailBlog = data.emailBlog
        blog.pswBlog = data.pswBlog

        // ----------- Featured Image -----------
        let featuredImage = blog.featuredImage
        if (req.file) {
            // Upload an image
            const uploadResult = await cloudinary.uploader
                .upload(
                    req.file.path,
                    { folder: 'goswami-blog', resource_type: 'auto' }
                )
                .catch((error) => {
                    next(handleError(500, error.message))
                });

            featuredImage = uploadResult.secure_url
        }

        blog.featuredImage = featuredImage

        await blog.save()

        res.status(200).json({
            success: true,
            message: 'Blog updated successfully!'
        })

    } catch (error) {
        next(handleError(500, error.message))
    }
}
export const deleteBlog = async (req, res, next) => {
    try {
        const { blogid } = req.params
        await Blog.findByIdAndDelete(blogid)
        res.status(200).json({
            success: true,
            message: 'Blog Deleted successfully.',
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}
export const showAllBlog = async (req, res, next) => {
    try {
        const user = req.user
        
        let blog;
        if (user.role === 'admin') {
            blog = await Blog.find()
            .populate('author', 'name avatar role')
            .populate('category', 'name slug').sort({ createdAt: -1 }).lean().exec()
        } else {
            blog = await Blog.find({ author: user._id }) // Solo i blog dell'utente
            .populate('author', 'name avatar role')
            .populate('category', 'name slug').sort({ createdAt: -1 }).lean().exec()
        }
        res.status(200).json({
            blog
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}

export const getBlog = async (req, res, next) => {
    try {
        const { slug } = req.params
        const blog = await Blog.findOne({slug}).populate('author', 'name avatar role')
        .populate('category', 'name slug').lean().exec()
        res.status(200).json({
            blog
        })
    } catch (error) {
        next(handleError(500, error.message))
    } 
}

export const getRelatedBlog = async (req, res, next) => {
    try {
        const { category, blog} = req.params
        
        const categoryData = await Category.findOne({slug: category})
        if(!categoryData) {
            return next(handleError(404, "Category not found"))
        }
        const categoryId = categoryData._id
        const relatedBlog = await Blog.find({category: categoryId, slug:{ $ne: blog } }).lean().exec()
            res.status(200).json({
                relatedBlog
            })
    } catch (error) {
        next(handleError(500, error.message))
    }
}

export const getBlogByCategory = async (req, res, next) => {
    try {
        const { category } = req.params

        const categoryData = await Category.findOne({ slug: category })
        if (!categoryData) {
            return next(404, 'Category data not found.')
        }
        const categoryId = categoryData._id
        const blog = await Blog.find({ category: categoryId }).
            populate('author', 'name avatar role').populate('category', 'name slug').lean().exec()
        res.status(200).json({
            blog,
            categoryData
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}

export const search = async (req, res, next) => {
    //Questa funzione permette di cercare i blog nel database filtrando per titolo.
    try {
        //Legge il parametro di ricerca (q) dall'URL.
        //Richiesta GET: /api/blogs/search?q=react
        const { q } = req.query
        //Cerca nel database i blog il cui titolo contiene il testo fornito (q).
        const blog = await Blog.find({ title: { $regex: q, $options: 'i' } })
            //$regex: q → cerca q all'interno del titolo del blog.
            //$options: 'i' → rende la ricerca case-insensitive (non distingue maiuscole/minuscole)
        .populate('author', 'name avatar role')
        .populate('category', 'name slug').lean().exec()
        res.status(200).json({
            blog,
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}

export const getAllBlogs = async (req, res, next) => {
    try {
        // const user = req.user
        const blog = await Blog.find()  // ottiene tutti i documenti presenti nella collezione Blog
        // Con populate, invece di restituire solo l'id dell'autore, recuperiamo anche i suoi campi 
        // specifici: name, avatar, role e quindi li aggiungiamo all'oggetto blog
        .populate('author', 'name avatar role')
        .populate('category', 'name slug').sort({ createdAt: -1 })
        .lean() //restituisce oggetti JavaScript normali invece di istanze Mongoose.
        // Questo migliora le prestazioni perché elimina funzionalità extra come i metodi di Mongoose.
        .exec() //esegue la query in modo esplicito.
        res.status(200).json({ // Invia il risultato/risposta della query al client.
            blog    //Restituisce un oggetto JSON con la lista di tutti i blog.
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}
