import Class from "../models/class.js";
import path from "path";

export const sendMessage = async (req, res) => {
  try {
    const { classId, message } = req.body;
    const sender = req.user._id;
    let imageUrl = null;

    if (!classId || (!message && !req.file)) {
      return res.status(400).json({ success: false, message: "Class ID, message, and/or image are required." });
    }

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const classDoc = await Class.findById(classId)
      .populate("chat.sender", "username")
      .select("chat");

    if (!classDoc) {
      return res.status(404).json({ success: false, message: "Class not found." });
    }

    const newMessage = { sender, message, image: imageUrl };

    classDoc.chat.push(newMessage);

    await classDoc.save();

    req.io.to(classId).emit("receiveMessage", {
      sender: req.user.username,
      message,
      imageUrl,
      timestamp: new Date(),
    });

    return res.status(201).json({ success: true, message: "Message sent successfully", chat: newMessage });
  } catch (error) {
    console.log("Error in sendMessage:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get messages function remains the same
export const getMessages = async (req, res) => {
  try {
    const { classId } = req.params;

    const classDoc = await Class.findById(classId)
      .populate("chat.sender", "username")
      .select("chat");

    if (!classDoc) {
      return res.status(404).json({ success: false, message: "Class not found." });
    }

    return res.status(200).json({ success: true, messages: classDoc.chat });
  } catch (error) {
    console.log("Error in getMessages:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
