const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user.model');
const registerUser = async(req,res) => {
   const {username, email, password} = req.body;

   try {
        if(!username || !email || !password){
            return res
            .status(400)
            .json(
                {
                   success: false,
                   message: "Please Enter All the Required Fields!"
                }
            );
        }

        const user = await User.findOne({email});
        if(user){
            return res
            .status(400)
            .json(
                {
                   success: false,
                   message: "User Already Exists. Please Login!"
                }
            );
        }

        const anotherUser = await User.findOne({username});
        if(anotherUser){
            return res
            .status(400)
            .json(
                {
                   success: false,
                   message: "Try Different Username!"
                }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        return res
        .status(200)
        .json(
            {
               success: true,
               message: "User Registered Successfully! Please Log In!"
            }
        );


   } catch (error) {
       console.error(error);
       return res
       .status(500)
       .json(
         {
            success: false,
            message: "Internal server error"
         }
       )
   }
}


const loginUser = async(req,res) => {
   const {email, password} = req.body;

   try {
        if(!email || !password){
            return res
            .status(400)
            .json(
                {
                   success: false,
                   message: "Please Enter All the Required Fields!"
                }
            );
        }

        const user = await User.findOne({email});

        if(!user){
            return res
            .status(400)
            .json(
                {
                   success: false,
                   message: "User Not Found. Please Register!"
                }
            );
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect){
           return res
           .status(400)
           .json(
               {
                  success: false,
                  message: "Invalid Credentials!"
               }
           );
        }
        
        const token = jwt.sign({
            id: user._id,
            role: user.role,
            email: user.email,
            username: user.username
        }, process.env.JWT_SECRET, {expiresIn: '60m'});

        const role = (user.role === 'admin' ? 'Admin' : 'User');

        // res
        // .cookie('token',token,{httpOnly:true, secure: true})
        // .status(200)
        // .json(
        //     {
        //        success: true,
        //        message: `${role} Logged In Successfully!`,
        //        user : {
        //           email: user.email,
        //           id: user._id,
        //           role: user.role,
        //           username: user.username
        //        }
        //     }
        // );

        res
        .status(200)
        .json({
            success: true,
            message: `${role} Logged In Successfully!`,
            token,
            user : {
                email: user.email,
                id: user._id,
                role: user.role,
                username: user.username
            }  
        })

    } catch (error) {
       console.error(error);
       return res
       .status(500)
       .json(
         {
            success: false,
            message: "Internal server error"
         }
       )
   }
}


const logoutUser = async(req,res) => {
   try {
     res
     .clearCookie('token')
     .status(200)
     .json(
         {
            success: true,
            message: "Logged Out Successfully!"
         }
     )
   } catch (error) {
        console.error(error);
        return res
        .status(500)
        .json(
        {
            success: false,
            message: "Internal server error"
        }
        )
   }
}


// const authMiddleware = async(req,res,next) => {
//    const token = req.cookies.token; 
   
   
//    if(!token) return res
//    .status(401)
//    .json(
//        {
//           success: false,
//           message: "Unauthorized User!"
//        }
//    )

//    try {
//        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
//        req.user = decodedToken;
//        next();
//    } catch (error) {
//        console.error(error);
//        return res
//        .status(500)
//        .json(
//          {
//             success: false,
//             message: "Internal Server Error!"
//          }
//        )
//    }
// }

const authMiddleware = async(req,res,next) => {
   const authHeader = req.headers[authorization]; 
   const token = authHeader && authHeader.split(' ')[1];

   
   if(!token) return res
   .status(401)
   .json(
       {
          success: false,
          message: "Unauthorized User!"
       }
   )

   try {
       const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
       req.user = decodedToken;
       next();
   } catch (error) {
       console.error(error);
       return res
       .status(500)
       .json(
         {
            success: false,
            message: "Internal Server Error!"
         }
       )
   }
}


module.exports = {registerUser, loginUser, logoutUser, authMiddleware}