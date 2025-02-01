import Class from "../models/class.js";

export const sendMessage = async (req, res) => {
  try {
    const { classId, message } = req.body;
    const sender = req.user._id;

    if (!classId || !message) {
      return res.status(400).json({ success: false, message: "Class ID and message are required." });
    }

    const classDoc = await Class.findById(classId);

    if (!classDoc) {
      return res.status(404).json({ success: false, message: "Class not found." });
    }

    const newMessage = { sender, message };
    classDoc.chat.push(newMessage);

    await classDoc.save();

    return res.status(201).json({ success: true, message: "Message sent successfully", chat: newMessage });
  } catch (error) {
    console.log("Error in sendMessage:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

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
