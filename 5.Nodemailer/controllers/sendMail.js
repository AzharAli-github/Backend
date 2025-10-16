const nodemailer = require("nodemailer");

const sendMail = async(req, res) => {
    res.send('Email sent successfully!');
    // Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'marshall.powlowski98@ethereal.email',
        pass: 'Z8fbscy6hs6qC8uP9s'
    }
});

(async () => {
  const info = await transporter.sendMail({
    from: '"Maddison Foo Koch" <test@gmail.com>',
    to: "azharborithic11@gmail.com, baz@example.com",
    subject: "Hello ✔",
    text: "Hello world?", // plain‑text body
    html: "<b>Hello world?</b>", // HTML body
  });

  console.log("Message sent:", info.from);
})();
}
module.exports = sendMail;