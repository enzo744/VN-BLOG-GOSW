import cloudinary from "../config/cloudinary.js";
import { handleError } from "../helpers/handleError.js";
import Blog from "../models/blog.model.js";
import BlogLike from "../models/bloglike.model.js";
import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const getUser = async (req, res, next) => {
  try {
    const {userid} = req.params;
    const user = await User.findOne({_id: userid}).lean().exec()
    if (!user) {
        next(handleError(404, "User not found"));
    }

    res.status(200).json({
        success: true,
        message: "User data found",
        user
    })
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const data = JSON.parse(req.body.data);
    const {userid} = req.params;

    const user = await User.findById(userid);
    user.name = data.name;
    user.email = data.email;
    user.bio = data.bio;

    if(data.password && data.password.length >= 3) {
      const hashedPassword = bcryptjs.hashSync(data.password);
      user.password = hashedPassword;
    }

    if(req.file) {
        // Upload an image
      const uploadResult = await cloudinary.uploader
      .upload(
          req.file.path, 
          {folder: "goswami-blog", resource_type: "auto"}
      )
      .catch((error) => {
          next(handleError(500, error.message));
      });

      user.avatar = uploadResult.secure_url;
    }

    await user.save();

    const newUser = user.toObject({getters: true});
    delete newUser.password;
    res.status(200).json({
      success: true,
      message: "Dati aggiornati!",
      user: newUser
  })
  } catch (error) {
    next(handleError(500, error.message));
  }
}

export const getAllUser = async (req, res, next) => {
  try {
    const user = await User.find().sort({ createdAt: -1 }).lean().exec()
    res.status(200).json({
      success: true,
      user
    })
  } catch (error) {
    next(handleError(500, error.message));
  }
}

// export const deleteUser = async (req, res, next) => {
//   try {
//       const { id } = req.params
//       // const user = await User.findByIdAndDelete(id)
//       await User.findByIdAndDelete(id)
//       res.status(200).json({
//           success: true,
//           message: 'Data deleted.'
//       })
//   } catch (error) {
//       next(handleError(500, error.message))
//   }
// }

export const deleteUser = async (req, res, next) => {
  try {
      const { id } = req.params;

      // Prima eliminiamo tutti i blog scritti dall'utente
      await Blog.deleteMany({ author: id });

      // Eliminare tutti i commenti scritti dall'utente
      await Comment.deleteMany({ user: id });

      // Eliminare tutti i like scritti dall'utente
      await BlogLike.deleteMany({ user: id });

      // Poi eliminiamo l'utente
      await User.findByIdAndDelete(id);

      res.status(200).json({
          success: true,
          message: 'Eliminazione Utente e tutti i Blog e commenti ad esso associati.'
      });
  } catch (error) {
      next(handleError(500, error.message));
  }
};