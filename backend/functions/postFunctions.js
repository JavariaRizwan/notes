const User=require("../schemas/userSchema");
const {hashFunction}= require("./utils");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const logger=require("../src/config/logger");
require('dotenv').config();
const Notes=require("../schemas/noteSchema")
const Category=require('../schemas/categorySchema')

const isProd = process.env.NODE_ENV === "production";

const saveUser=async(req, res)=>{
    try {
      const {username, email, password, emailUpdates}=req.body;

        if(!username || !password || !email || email.trim() === ""){
            logger.warn("Signup failed: Missing required fields");
            return res.status(400).json({
                success:false,
                message:"Please fill all the required fields for signup"
            })
        };
        const normalEmail=email.toLowerCase(); 
        const existingUser=await User.findOne({email:normalEmail});
        if(existingUser){
            logger.warn("SignUp failed! Email already exists");
            return res.status(409).json({success: false, 
        message: "User with this email already exists." 
      });

    }
      const hashedPassword= await hashFunction(password);
      if(!hashedPassword){
        throw new Error("Error occured while hashing Password");
      }
      const newUser= await User.create({
            username: username,
            email:normalEmail,
            password : hashedPassword,
            emailUpdates:emailUpdates
        })

        logger.info({userId: newUser._id},"SignUp successful. User saved!");
        return res.status(201).json({
            success: true,
        message: "User registered successfully",
        user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
     //   createdAt: newUser.createdAt,
      },
        })
        
    } catch (error) {
logger.warn({ error }, "Something unexpected happened during signup");
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    }
}


const login=async(req, res)=>{
try {
    const {usernameOrEmail, password} = req.body;
    if(!usernameOrEmail || !password){
        logger.warn("Email/Username and Password both are required.");
        return res.status(400).json({
        success: false,
        message: "Username/Email and password are required.",
      });
    }
    const identifier = usernameOrEmail.trim();
    const user=await User.findOne({
        $or:[
            {username:identifier},
            {email: identifier.toLowerCase()}
        ]
    });
    if(!user){
        logger.warn("No user found with these credentials");
        return res.status(401).json({
            message:"Invalid Credentials",
            success:false
        })
    }
    const isPassword=await bcrypt.compare(password, user.password);
    if(!isPassword){
       logger.warn("Password not matched");
        return res.status(401).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    const token=jwt.sign(
        {   userId:user._id,
            username:user.username,
        },
        process.env.JWT_SECRET,
        {expiresIn: '1h'}
    )


res.cookie("token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 60 * 60 * 1000, 
});

    return res.status(200).json({
        success:true,
        message:"Login successful",
        token,
        user:{
            userId:user._id,
            username:user.username,
        }
    });

} catch (error) {
    logger.warn({error}, "Something unexpected happened.");
    return res.status(500).json({
        message:"Something went wrong. Please try again.",
        success:false
    })
}
}


const logout=async(req, res)=>{
    try {
        res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
});
        return res.status(200).json({ 
    success: true, 
    message: 'Logged out successfully' 
  });
}
     catch (error) {
        logger.warn(error.message);
        return res.status(500).json({
            success:false,
            message:"Logout failed!"
        })
    }
}



const createNewNote=async(req, res)=>{
const userId = req.user?.userId;
 const {title, description, category}=req.body;
    try {

        if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized! Token is missing or invalid."
      });
    }
    if (!title?.trim() || !description?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required!"
      });
    }
    const newNote = await Notes.create({
        userId,
        title,
        description,
        category: category || null,
      });
    return res.status(201).json({
    message:"Note created successfully",
    success:true,
    note:{
        id:newNote._id,
        userId: newNote.userId,
        title: newNote.title,
        description: newNote.description,
        category: newNote.category,
    }
})
} catch (error) {
    logger.warn(error.message);
    return res.status(500).json({
        success:false,
        message:"Some error happened in the backend"
    })
}
}


const changePinStatus = async (req, res) => {
  try {
    const noteId = req.params.noteId;
    const currentUserId = req.user?.userId || req.user?._id || req.user?.id;

    const note = await Notes.findOne({ 
      _id: noteId, 
      userId: currentUserId,
      isDeleted: false 
    });

    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found or unauthorized" });
    }

    // note.isPinned = !note.isPinned;
    // await note.save();

    const updatedNote = await Notes.findOneAndUpdate(
    { _id: noteId, userId: currentUserId, isDeleted: false, isPinned: note.isPinned },
      { isPinned: !note.isPinned },
      { new: true, runValidators: false }
    );

    return res.status(200).json({
      success: true,  
      message: `Note ${updatedNote.isPinned ? "pinned" : "unpinned"} successfully`,
      response: updatedNote,
    });
  } catch (error) {
    console.error("FULL PIN ERROR:", error);
    logger.warn(error.message);
    return res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
  }
};



const changeDeleteStatus = async (req, res) => {
  try {
    const { noteId } = req.params;
    const currentUserId = req.user?.userId || req.user?._id || req.user?.id;

    const existingNote = await Notes.findOne({ _id: noteId, userId: currentUserId });

    if (!existingNote) {
      return res.status(404).json({
        success: false,
        message: "Note not found or unauthorized",
      });
    }

    let updateFields;
    let successMessage;
    if (!existingNote.isDeleted) {
      updateFields = {
        isDeleted: true,
        isPinned: false,
        isArchived: false,
      };
      successMessage = "Note moved to trash successfully";
    } else {
      updateFields = {
        isDeleted: false,
      };
      successMessage = "Note restored successfully";
    }

    const updatedNote = await Notes.findOneAndUpdate(
      { _id: noteId, userId: currentUserId },
      { $set: updateFields },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: successMessage,
      response: updatedNote, 
    });

  } catch (error) {
    logger.warn(error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};


const handlPermanentDelete=async(req, res)=>{
  const noteId=req.params.noteId;
  const userId=req.user?.userId;
  try {
    
    const note=await Notes.findOneAndDelete({_id: noteId, userId:userId, isDeleted: true});
    if(!note){
      return res.status(404).json({
        success:false,
        message:"Note not found or user is unauthorized"
      });
    }

    return res.status(200).json({
      success:true,
      message:"Note deleted successfully"
    })
  } catch (error) {
    logger.warn(error.message);
    return res.status(500).json({
      success:false,
      message:"Something went wrong, Please try later"
    })
  }
}



const editNote=async(req, res)=>{
 const {noteId}=req.params;
 const userId=req.user?.userId;
 let {title, description, category}=req.body;

 title=title?.trim();
 description=description?.trim();

 if(!title || !description){
  return res.status(400).json({
    success:false,
    message:"Title and description are required!"
  })
 }
  try {
    
    const response=await Notes.findOneAndUpdate({_id:noteId, userId: userId, isDeleted: false}, {
      title: title,
      description:description,
      category:category || null,
    },
  {new:true, runValidators:true}
).populate('category');

if(!response){
  return res.status(404).json({
    success:false,
    message:"Note not found or unauthorized"
  })
}
  return res.status(200).json({
    success:true,
    message:"Note updated successfully",
    note:response
  })
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:error.message
    })
  }
}


const changeArchivedStatus=async(req, res)=>{
const noteId=req.params.noteId;
const currentUserId = req.user?.userId || req.user?._id || req.user?.id;

try{
  if(!currentUserId){
    return res.status(404).json({
      success:false,
      message:"User not found"
    })
  }

const existingNote = await Notes.findOne({ _id: noteId, userId: currentUserId, isDeleted: false });

    if (!existingNote) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }
     const willArchive = !existingNote.isArchived;

    const note = await Notes.findOneAndUpdate(
      { _id: noteId, userId: currentUserId, isDeleted: false, isArchived: existingNote.isArchived  },
      { $set: { 
          isArchived: willArchive, 
          isPinned: willArchive ? false : existingNote.isPinned
        } 
      },
      { new: true }
    );
if(!note){
  return res.status(404).json({success:false, message:"Note not found"})
}


return res.status(200).json({
  success:true,
  message:`Note ${willArchive ? "archived" : "unarchived"} successfully`,
  note:note

})
}
catch(error){
  logger.warn(error.message);
    return res.status(500).json({
      success:false,
      message:"Something went wrong, Try again later"
    })
}

}


const createNewCategory=async(req, res)=>{
  const {c_name}=req.body;
  const userId = req.userId || req.user?.userId;
  try {
    const response= await Category.create({
      c_name:c_name,
      userId: userId
    })
    if(response){
      return res.status(200).json({
        success:true,
        message:"Category saved successfully"
      })
    }
  } catch (error) {
    logger.warn("Error occured while saving category", error.message);
    console.error("Error", error.message)
    return res.status(500).json({
      success:false,
      message:error.message
    })
  }
}





module.exports={saveUser, login, logout, createNewNote, changePinStatus, changeDeleteStatus, editNote, changeArchivedStatus, handlPermanentDelete, createNewCategory};