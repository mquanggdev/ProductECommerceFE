module.exports.validateRegister = async (req, res, next) => {
    try {
        const { username, email, password, re_password } = req.body;
        const errors = [];

        // Validate username
        if (!username || username.trim() === "") {
            errors.push("Username không được để trống.");
        } else if (username.length > 50) {
            errors.push("Username không được quá 50 ký tự.");
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || email.trim() === "") {
            errors.push("Email không được để trống.");
        } else if (!emailRegex.test(email)) {
            errors.push("Email không đúng định dạng.");
        } else if (email.length > 50) {
            errors.push("Email không được quá 50 ký tự.");
        }

        // Validate password
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{9,50}$/;
        if (!password) {
            errors.push("Mật khẩu không được để trống.");
        } else if (!passwordRegex.test(password)) {
            errors.push("Mật khẩu phải có ít nhất 9 ký tự, gồm chữ thường và chữ in hoa, và không quá 50 ký tự.");
        }

        // Validate re_password
        if (!re_password) {
            errors.push("Nhập lại mật khẩu không được để trống.");
        } else if (re_password !== password) {
            errors.push("Nhập lại mật khẩu không khớp.");
        }

        if (errors.length > 0) {
            return res.status(400).json({ success: false, errors });
        }
        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi kiểm tra dữ liệu đăng ký.",
        });
    }
};


module.exports.validateLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const errors = [];

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || email.trim() === "") {
            errors.push("Email không được để trống.");
        } else if (!emailRegex.test(email)) {
            errors.push("Email không đúng định dạng.");
        } else if (email.length > 50) {
            errors.push("Email không được quá 50 ký tự.");
        }

        // Validate password
        if (!password || password.trim() === "") {
            errors.push("Mật khẩu không được để trống.");
        }

        if (errors.length > 0) {
            return res.status(400).json({ success: false, errors });
        }
        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi kiểm tra dữ liệu đăng nhập.",
        });
    }
};
