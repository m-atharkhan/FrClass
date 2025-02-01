import Class from "../models/class.js";

export const createClass = async (req, res) => {
    try {
        const {name, description} = req.body;

        if (!name || !description) {
            return res.status(400).json({success:false, message:"All fields are required."});
        }

        const existingClass = await Class.findOne({name});
        if(existingClass) {
            return res.status(400).json({success:false, message:"Class with this name already exists."});
        }

        const newClass = new Class({ name, description, createdBy:req.user._id});
        await newClass.save();

        return res.status(201).json({success:true, message:"Class created successfully.", newClass});

    } catch (error) {
        console.log(`Error in createClass controller: ${error}`);
        return res.status(500).json({success:false, message:"Internal Server Error."});
    }
}

export const getClass = async (req, res) => {
    try {
        const classId = req.params.id;
        const existClass = await Class.findById(classId);

        if (!existClass) {
            return res.status(404).json({ success: false, message: "Class not found." });
        }

        return res.status(200).json({ success: true, class: existClass });

    } catch (error) {
        console.log(`Error in getClass controller: ${error}`);
        return res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};

export const updateClass = async (req, res) => {
    try {
        const classId = req.params.id;
        const { name, description } = req.body;

        if (!classId) {
            return res.status(400).json({ success: false, message: "Class ID is required." });
        }

        const updatedClass = await Class.findByIdAndUpdate(
            classId,
            { name, description },
            { new: true, runValidators: true }
        );

        if (!updatedClass) {
            return res.status(404).json({ success: false, message: "Class not found." });
        }

        res.status(200).json({ success: true, class: updatedClass });
    } catch (error) {
        console.log(`Error in updateClass controller: ${error}`);
        return res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};

export const getAllClasses = async (req, res) => {
    try {
        const allClasses = await Class.find();

        if (!allClasses) {
            return res.status(404).json({ success: false, message: "No class found." });
        }

        return res.status(200).json({ success: true, class: allClasses });

    } catch (error) {
        console.log(`Error in getAllClass controller: ${error}`);
        return res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};
