import { Router, Request, Response } from "express";
import { contentModel } from "../models";
import { userMiddleware } from "../middlewares";
import {Types} from 'mongoose'



const contentRouter = Router();

interface User  {
    _id: Types.ObjectId;
    email: string;
    password: string;
}

interface CustomRequest extends Request {
    user?: User;
}

contentRouter.get('/all', userMiddleware, async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({
                message: "User not authenticated"
            });
            return;
        }
        
        const content = await contentModel.find({ userId }).populate("userId", "email");
        res.status(200).json({ content });
        
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({
            message: "Fetching contents failed",
            error: errorMessage
        });
    }
});

contentRouter.post('/post', userMiddleware, async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const { title, description, link, tags } = req.body;
        const userId = req.user?._id;

        if (!userId) {
            res.status(401).json({
                message: "User not authenticated"
            });
            return;
        }

        await contentModel.create({
            link,
            title,
            description,
            tags: tags || [],
            userId
        });
        
        res.status(201).json({
            message: "Content created successfully"
        });
        
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({
            message: "Content creation failed",
            error: errorMessage
        });
    }
});

contentRouter.delete('/delete', userMiddleware, async (req: CustomRequest, res: Response) => {
    try {
        const contentId = req.body.contentId;

    await contentModel.deleteMany({
        contentId,
        userId: req.user
    });
    
    res.status(200).json({
            msg: "Content deleted successfully"
    })
    } catch (error) {
        res.status(500).json({
            msg: "Content failed to delete",
            error: error
    })
    }
})

export default contentRouter;