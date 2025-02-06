import cloudinary from "../config/multerConfig.js";
import Class from "../models/class.js";

export const sendMessage = async (req, res) => {
  try {
    const { id: classId, message, image } = req.body;
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    console.log("Request Body:", req.body);

    let imageUrl = "";
    
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "chat_images",
        allowed_formats: ["jpg", "jpeg", "png"],
        transformation: [{ width: 500, height: 500, crop: "limit" }],
      });
      imageUrl = uploadResponse.secure_url;
    }

    const classDoc = await Class.findById(classId);

    if (!classDoc) {
      return res.status(404).json({ success: false, message: "Class not found." });
    }

    // Ensure chat array exists
    if (!Array.isArray(classDoc.chat)) {
      classDoc.chat = [];
    }

    const newMessage = { sender: req.user, message: message?.trim() || "", image: imageUrl };
    
    console.log("New Message:", newMessage);
    
    classDoc.chat.push(newMessage);
    await classDoc.save();

    req.io.to(classId).emit("receiveMessage", {
      sender: req.user.username,
      message: newMessage.message,
      image: newMessage.image,
      timestamp: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      chat: newMessage,
    });
  } catch (error) {
    console.error("Error in sendMessage:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
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
