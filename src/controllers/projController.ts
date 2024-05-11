import {Request, Response} from 'express';
import project, {IProj} from '../models/projects'
import cloudinary from '../services/cloudinary';

class projController{
    //post new project
    async postProj(req:Request,res:Response): Promise<void> {
        try{
            if (!req.file) {
                res.status(400).json({ message: 'Project Image file is required' });
                return;
            }

            const { pTitle, pTechnologies, pShortDesc, pLongDesc } = req.body;
            const result = await cloudinary.uploader.upload(req.file.path);

            const newProject = new project({
                pImage: result.secure_url,
                pTitle,
                pTechnologies,
                pShortDesc,
                pLongDesc
            })
            await newProject.save();
            res.status(201).json({message: 'Created project Successfully', newProject});
        }
        catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    //Get all projects
        async getAllProjects(req: Request, res: Response): Promise<void> {
        try {
            const Projects: IProj[] = await project.find();
            res.status(200).json(Projects);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get a specific Project
        async getProjById(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            const proj= await project.findById(id);
            if (!proj) {
                res.status(404).json({ message: 'Project not found' });
                return;
            }
            res.status(200).json(proj);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateProjById(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            const {
                pImage,
                pTitle,
                pTechnologies,
                pShortDesc,
                pLongDesc
            } = req.body;

            const updatedProj = await project.findByIdAndUpdate(id, {
                pImage,
                pTitle,
                pTechnologies,
                pShortDesc,
                pLongDesc
            }, { new: true });

            if (!updatedProj) {
                res.status(404).json({ message: 'Project not found' });
                return;
            }
            res.status(200).json(updatedProj);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }


    // Delete a Project by ID
    async deleteProjById(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            const deletedProject = await project.findByIdAndDelete(id);
            if (!deletedProject) {
                res.status(404).json({ message: 'Project not found' });
                return;
            }
            res.status(200).json({ message: 'Project deleted successfully' });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default new projController();
