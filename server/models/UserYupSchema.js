const yup = require("yup");

const UserYupSchema = yup.object().shape({
  username: yup
    .string("نام کاربری را چک کنید")
    .required("نام کاربری الزامیست")
    .min(3, "نام کاربری نمی تواند کمتر از ۳ کاراکتر باشد")
    .max(100, "نام کاربری نمی تواند بیش از ۱۰۰ کاراکتر باشد"),
  password: yup
    .string("پسورو را چک کنید")
    .required("پسورد الزامیست")
    .min(8, "پسورو نمی تواند کمتر از ۸ کاراکتر باشذ")
    .max(50, "پسورد نمی تواند بیش از ۵۰ کاراکتر باشد"),
});

module.exports = UserYupSchema;
