import nodemailer from "nodemailer"

export const sendMail = async (receiversEmail, orderNumber, orderAddress) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });

    const mailOptions = {
        from: "KEA Foot Shop", // sender address
        to: receiversEmail, // list of receivers seperated by comma
        subject: `Your order ${orderNumber}`, // Subject line
        html: generateTemplate(orderNumber, orderAddress), // html body
    }

    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        }
        // else {
        //     console.log('Email sent: ' + info.response);
        // }
    });

}

const generateTemplate = (orderNumber, orderAddress) => {
    return `
    <h2>Thank you for your order</h2>
    <p>
        Your order ${orderNumber} is now being processed. You will receive email, when order will
        be on the way to you to ${orderAddress}. 
    </p>
    `
}
