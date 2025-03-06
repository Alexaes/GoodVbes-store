// submit-order.js
const nodemailer = require('nodemailer');

exports.handler = async function(event, context) {
  const { name, email, address, products } = JSON.parse(event.body);

  // إعداد المرسل
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'youremail@gmail.com', // البريد الإلكتروني الذي سترسل منه
      pass: 'yourpassword'          // كلمة المرور الخاصة بالبريد الإلكتروني
    }
  });

  const mailOptions = {
    from: 'youremail@gmail.com',
    to: 'your-email@example.com', // البريد الإلكتروني الذي سيتلقى الرسالة
    subject: 'طلب جديد من العميل',
    text: `اسم العميل: ${name}\nالبريد الإلكتروني: ${email}\nالعنوان: ${address}\nالمنتجات: ${products}`
  };

  try {
    await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'تم إرسال الطلب بنجاح!' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'حدث خطأ أثناء إرسال الطلب' })
    };
  }
};