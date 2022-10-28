import nodeoutlook from 'nodejs-nodemailer-outlook'

export function myEmail(dest, subject, message) {
    console.log(process.env.senderEmail);
    console.log(process.env.senderEmailPassword);
    nodeoutlook.sendEmail({
        auth: {
            user: process.env.senderEmail,
            pass: process.env.senderEmailPassword
        },
        from: process.env.senderEmail,
        to: dest,
        subject,
        html: message,
        onError: (e) => {
            console.log(e);},
        onSuccess: (i) => console.log(i)
    });
}