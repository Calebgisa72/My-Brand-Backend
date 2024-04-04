import { Request, Response } from 'express';
import Blog, { IBlog } from '../models/Blog';
import cloudinary from '../services/cloudinary';
import upload from '../middlewares/multer';
import Comment, { IComment } from '../models/comment';

class BlogController {
    //Creation of a new blog post
    async createBlog (req: Request, res: Response): Promise<void> {
        try {
        if (!req.file) {
            res.status(400).json({ message: 'Image file is required' });
            return;
        }

        const { bTitle, bShortDesc, bLongDesc } = req.body;
        const result = await cloudinary.uploader.upload(req.file.path); // Upload image to Cloudinary

        const newBlog = new Blog({
            bImage: result.secure_url,
            bTitle,
            bShortDesc,
            bLongDesc
        });

        await newBlog.save();
        res.status(201).json({message: 'Created blog Successfully', newBlog});
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
    };

    //Get all blog posts
    async getAllBlogs(req: Request, res: Response): Promise<void> {
        try {
            const blogs: IBlog[] = await Blog.find();
            res.status(200).json(blogs);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get a specific blog post by ID
    async getBlogById(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            const blog: IBlog | null = await Blog.findById(id);
            if (!blog) {
                res.status(404).json({ message: 'Blog not found' });
                return;
            }
            res.status(200).json(blog);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    // Update a blog post by ID
    async updateBlogById(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            const {
                bImage,
                bTitle,
                bShortDesc,
                bLongDesc,
                bDate,
                bNumOfLike,
                bComments
            } = req.body;

            const updatedBlog: IBlog | null = await Blog.findByIdAndUpdate(id, {
                bImage,
                bTitle,
                bShortDesc,
                bLongDesc,
                bDate,
                bNumOfLike,
                bComments
            }, { new: true });

            if (!updatedBlog) {
                res.status(404).json({ message: 'Blog not found' });
                return;
            }
            res.status(200).json(updatedBlog);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    // Delete a blog post by ID
    async deleteBlogById(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            const deletedBlog: IBlog | null = await Blog.findByIdAndDelete(id);
            if (!deletedBlog) {
                res.status(404).json({ message: 'Blog not found' });
                return;
            }
            res.status(200).json({ message: 'Blog deleted successfully' });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async addComment(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { sender, comment } = req.body;
    
            const blog: IBlog | null = await Blog.findById(id);
            if (!blog) {
                res.status(404).json({ message: 'Blog not found' });
                return;
            }
            const newComment: IComment = new Comment({
                sender,
                comment
            });
            await newComment.save();

            if (!blog.bComments) {
                blog.bComments = [];
            }
            blog.bComments.push(newComment);
            await blog.save();
    
            res.status(201).json({ message: 'Comment added successfully', blog });
        } catch (error: any) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getComments(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;
    
            const blog: IBlog | null = await Blog.findById(id);
            if (!blog) {
                res.status(404).json({ message: 'Blog not found' });
                return;
            }
    
            res.status(200).json(blog.bComments);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    // Delete a comment from a blog post
    async deleteComment(req: Request, res: Response): Promise<void> {
        try {
            const blogId = req.params.blogId;
            const commentIndexStr = req.params.commentIndex;
            const commentIndex = parseInt(commentIndexStr, 10);

            const blog: IBlog | null = await Blog.findById(blogId);
            if (!blog) {
                res.status(404).json({ message: 'Blog not found' });
                return;
            }

            if (isNaN(commentIndex) || commentIndex < 0 || commentIndex >= blog.bComments.length) {
                res.status(400).json({ message: 'Invalid comment index' });
                return;
            }

            blog.bComments.splice(commentIndex, 1);
            await blog.save();

            res.status(200).json({ message: 'Comment deleted successfully' });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async likeBlog(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
    
            const blog: IBlog | null = await Blog.findById(id);
            if (!blog) {
                res.status(404).json({ message: 'Blog not found' });
                return;
            }
    
            blog.bNumOfLike += 1;
            await blog.save();
    
            res.status(200).json({ blog, message: 'Blog liked successfully' });
        } catch (error: any) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async disLikeBlog(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
    
            const blog: IBlog | null = await Blog.findById(id);
            if (!blog) {
                res.status(404).json({ message: 'Blog not found' });
                return;
            }
    
            blog.bNumOfLike -= 1;
            await blog.save();
    
            res.status(200).json({ blog, message: 'Blog disliked successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}




export default new BlogController();
