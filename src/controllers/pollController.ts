import { Request, Response } from 'express';
import { Poll } from '../models/poll';
import { IUser } from '../models/user';

export const createPoll = async (req: Request, res: Response) => {
    try {

        const { title, options } = req.body;
        const userId = req.userId;

        // Validate input
        if (!title || !options || !Array.isArray(options) || options.length < 2) {
            return res.status(400).json({ message: 'Title and at least two options are required' });
        }

        // Create a new poll
        const poll = new Poll({
            title,
            options: options.map((option: string) => ({ option, votes: 0 })),
            createdBy: userId,
            voters: []
        });
        await poll.save();
        res.status(201).json({ message: 'Poll created successfully', poll });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getActivePolls = async (req: Request, res: Response) => {
    try {
        const polls = await Poll.find({ isActive: true });
        res.status(200).json({ message: 'Active polls retrieved successfully', polls });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const voteOnPoll = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const { pollId, optionId } = req.body;

        const poll = await Poll.findById(pollId);

        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        // check if user has already voted
        if (poll.voters.includes(userId)) {
            return res.status(400).json({ message: 'You have already voted' });
        }
        const selectedOption = poll.options.find(opt => opt._id.toString() === optionId);
        if (!selectedOption) {
            return res.status(404).json({ message: 'Option not found' });
        }

        // update the vote count for the selected option
        selectedOption.votes += 1;
        poll.voters.push(userId);
        await poll.save();

        // Broadcast

        res.status(200).json({ message: 'Vote submitted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};