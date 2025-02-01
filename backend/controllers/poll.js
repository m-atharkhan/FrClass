import Poll from "../models/poll.js";

export const createPoll = async (req, res) => {
    try {
        const { question, options, classId } = req.body;

        if (!question || !options || options.length < 2) {
            return res.status(400).json({ success: false, message: "Question and at least two options are required." });
        }

        const newPoll = new Poll({
            question,
            options: options.map(option => ({ text: option, votes: 0 })),
            createdBy: req.user._id,
            classId,
        });

        await newPoll.save();
        return res.status(201).json({ success: true, message: "Poll created successfully!", poll: newPoll });

    } catch (error) {
        console.log(`Error in createPoll controller: ${error}`);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getPoll = async (req, res) => {
    try {
        const { id } = req.params;

        const poll = await Poll.findById(id);
        if (!poll) {
            return res.status(404).json({ success: false, message: "Poll not found." });
        }

        return res.status(200).json({ success: true, poll });

    } catch (error) {
        console.log(`Error in getPoll controller: ${error}`);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const deletePoll = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const poll = await Poll.findById(id);

        if (!poll) {
            return res.status(404).json({ success: false, message: "Poll not found." });
        }

        if (poll.createdBy.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "You are not authorized to delete this poll." });
        }

        await Poll.findByIdAndDelete(id);

        return res.status(200).json({ success: true, message: "Poll deleted successfully." });

    } catch (error) {
        console.log(`Error in deletePoll controller: ${error}`);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getAllPolls = async (req, res) => {
    try {
        const { classId } = req.params;

        if (!classId) {
            return res.status(400).json({ success: false, message: "Class ID is required." });
        }

        const polls = await Poll.find({ classId });

        if (!polls || polls.length === 0) {
            return res.status(404).json({ success: false, message: "No polls found for this class." });
        }

        return res.status(200).json({ success: true, polls });

    } catch (error) {
        console.log(`Error in getAllPolls controller: ${error}`);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const votePoll = async (req, res) => {
    try {
        const { id } = req.params;
        const { optionIndex } = req.body;
        const userId = req.user._id;

        const poll = await Poll.findById(id);
        if (!poll) {
            return res.status(404).json({ success: false, message: "Poll not found." });
        }

        const existingVote = poll.votes.find(vote => vote.userId.toString() === userId.toString());
        if (existingVote) {
            return res.status(400).json({ success: false, message: "You have already voted on this poll." });
        }

        if (optionIndex < 0 || optionIndex >= poll.options.length) {
            return res.status(400).json({ success: false, message: "Invalid option selected." });
        }

        poll.votes.push({ userId, optionIndex });
        poll.options[optionIndex].votes += 1;

        await poll.save();

        return res.status(200).json({ success: true, message: "Vote recorded successfully!", poll });

    } catch (error) {
        console.log(`Error in votePoll controller: ${error}`);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getPollResults = async (req, res) => {
    try {
        const { id } = req.params;

        const poll = await Poll.findById(id);
        if (!poll) {
            return res.status(404).json({ success: false, message: "Poll not found." });
        }

        const results = poll.options.map((option, index) => ({
            text: option.text,
            votes: option.votes,
            percentage: poll.votes.length > 0 ? ((option.votes / poll.votes.length) * 100).toFixed(2) + "%" : "0%",
        }));

        return res.status(200).json({
            success: true,
            pollId: poll._id,
            question: poll.question,
            totalVotes: poll.votes.length,
            results,
        });

    } catch (error) {
        console.log(`Error in getPollResults controller: ${error}`);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

