// دالة لعرض رسالة جميلة داخل الصفحة
function showSignupMessage(text, isSuccess = false) {
    const box = document.getElementById('signupMessage');
    if (!box) return;

    box.textContent = text;
    box.className = isSuccess 
        ? 'alert alert-success d-block' 
        : 'alert alert-danger d-block';
}

// عند إرسال الفورم
document.getElementById("Signup-Form").addEventListener("submit", function(event) {
    event.preventDefault();

    const form = this;
    const data = {
        username: form.username.value.trim(),
        email: form.email.value.trim(),
        dateOfBirth: form.dateOfBirth.value.trim(),
        phone: form.phone.value.trim(),
        password: form.password.value.trim(),
        confirmPassword: form.confirmPassword.value.trim()
    };

    // التحقق من الحقول الفارغة
    if (!data.username || !data.email || !data.dateOfBirth || !data.phone || !data.password || !data.confirmPassword) {
        showSignupMessage("All fields are required.");
        return;
    }

    // تطابق الباسوورد
    if (data.password !== data.confirmPassword) {
        showSignupMessage("Passwords do not match.");
        return;
    }

    // اسم المستخدم لا يبدأ برقم
    if (/^[0-9]/.test(data.username)) {
        showSignupMessage("Username must not start with a number.");
        return;
    }

    // صيغة الإيميل
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(data.email)) {
        showSignupMessage("Invalid email format.");
        return;
    }

    // حساب العمر
    function calculateAge(dob) {
        const today = new Date();
        const birth = new Date(dob);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    }

    const age = calculateAge(data.dateOfBirth);
    if (age < 12) {
        showSignupMessage("You must be at least 12 years old to register.");
        return;
    }

    // التحقق من تكرار اسم المستخدم
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some(u => u.username === data.username)) {
        showSignupMessage("Username already exists!");
        return;
    }

    // تسجيل المستخدم
    delete data.confirmPassword;
    users.push(data);
    localStorage.setItem("users", JSON.stringify(users));

    // رسالة نجاح
    showSignupMessage("Registered successfully!", true);
    
    // الانتقال بعد 1.5 ثانية
    setTimeout(() => {
        window.location.href = "Login.html";
    }, 1500);
});