const Users = require("../models/users.model");
const ForgotPassword = require("../models/forgot-password.model")
const md5 = require("md5") ;
const generate = require("../helpers/generate.helper") ;
const sendEmailHelper = require("../helpers/sendEmail.helper")

// POST users/register
module.exports.register = async (req, res) => {
    try {

        const existUser = await Users.findOne({
              email: req.body.email,
              deleted: false
            });
        
            if(existUser) {
              res.status(400).json({
                success: "false" ,
                message: "Email đã tồn tại!"
              });
              return;
        }
        
        const username = req.body.username ;
        const email = req.body.email ;
        const password = md5(req.body.password) ;
        const token = generate.generateRandomString(30) ;

        const dataUser = {
            username: username,
            email:email,
            password: password,
            token: token,
          };


        const user = new Users(dataUser) ;
        await user.save() ;

        res.status(200).json({
            success : true ,
            message : "Đăng kí thành công.",
            token : token
        })
    } catch (error) {
        res.status(500).json({
            success : false,
            message : "Đăng kí thất bại.",
        })
    }
}

// POST users/login
module.exports.login = async (req, res) => {
    try {

        const email = req.body.email 
        const password = md5(req.body.password)

        const existUser = await Users.findOne({
            email : email ,
            deleted : false 
        })

        if (!existUser) {
            res.status(404).json({
                success : false,
                message : "Email chưa tồn tại.",
            })
        }
        if (password != existUser.password) {
            res.status(400).json({
                success : false,
                message : "Nhập sai mật khẩu.",
            })
        }
        
        res.status(200).json({
            success : true ,
            message : "Đăng nhập thành công.",
            token: existUser.token
        })


    } catch (error) {
        res.status(500).json({
            success : false,
            message : "Đăng nhập thất bại.",
        })
    }
}


// [POST] /users/password/forgot
module.exports.forgotPassword = async (req, res) => {
  const email = req.body.email;
  
  const user = await Users.findOne({
    email: email
  });

  if(!user) {
    res.status(400).json({
      message: "Email không tồn tại trong hệ thống!"
    });
    return;
  }

  const otp = generate.generateRandomNumber(6);

  // Việc 1: Lưu email, OTP vào database
  const forgotPasswordData = {
    email: email,
    otp: otp,
    expireAt: Date.now() + 3*60*1000
  };

  const forgotPassword = new ForgotPassword(forgotPasswordData);
  await forgotPassword.save();

  // Việc 2: Gửi mã OTP qua email của user
  const subject = "Mã OTP lấy lại mật khẩu.";
  const htmlSendMail = `Mã OTP xác thực của bạn là <b style="color: green;">${otp}</b>. Mã OTP có hiệu lực trong 3 phút. Vui lòng không cung cấp mã OTP cho người khác.`;
  sendEmailHelper.sendEmail(email, subject, htmlSendMail);

  res.status(200).json({
    message: "Đã gửi mã OTP qua email!"
  });
}

// [POST] /users/password/otp
module.exports.otpPassword = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp
  });

  if(!result) {
    req.status(400).json({
      message : "OTP không hợp lệ!"
    })
    return;
  }

  const user = await Users.findOne({
    email: email
  });

    // res.cookie("token", user.token, {
    // httpOnly: true, 
    // maxAge: 86400 * 1000,  
    // sameSite: 'Strict' 
    // });

  res.status(200).json({
    message : "Xác thực thành công!",
    token: user.token
  }
  );
};
// [PATCH] /users/password/reset
module.exports.resetPassword = async (req, res) => {
  const token = req.body.token;
  const password = req.body.password;

  await Users.updateOne({
    token: token,
    deleted: false
  }, {
    password: md5(password)
  });
  res.status(200).json({
    message: "Đổi mật khẩu thành công!"
  });
}

// [GET] /users/profile
module.exports.profile = async (req, res) => {
  const user = await Users.findOne({
    token: req.tokenVerify,
    deleted: false
  }).select("-password -token");

  res.status(200).json({
    message: "Thành công!",
    user: user
  });
}