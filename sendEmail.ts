import * as nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const Email = process.env.EMAIL || ''; // Your email Adresse.
const Password = process.env.PASSWORD || ''; // Your email password or app password (for Gmail, you need to create an app password), You need 2FA enabled for this to work. 
const Host = process.env.HOST || ''; // HOST should be set to smtp.gmail.com for Gmail, smtp.mailgun.org for Mailgun, etc... (Look at your email provider's documentation)
const userName = process.env.USERNAME || ''; 

// use getInput function to get user input from the console
async function getInput(prompt = '> '): Promise<string> {
  return new Promise((resolve) => {
      const buffer: string[] = [];

      process.stdout.write(prompt);
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.setEncoding('utf-8');7
      // since we're using rawmode to true, we need to handle the input manually, 
      //ctrl+c to exit.
      //enter key to activate going back to lane
      //backspace to delete the last character.
      // if you want to add more keys, you can do it here.
      // but be careful, because this is a low level input handling. use HEX codes to handle special characters.
      // for example, ctrl+c is \x03, enter is \r or \n, backspace is \x08.

      const onData = (chunk: string) => {
          const char = chunk;

          if (char === '\x03') {
              // ctrl+C
              process.stdout.write('\nExiting...\n');
              process.stdin.setRawMode(false);
              process.stdin.pause();
              process.exit();
          } else if (char === '\r' || char === '\n') {
              // enter key
              process.stdout.write('\n');
              process.stdin.setRawMode(false);
              process.stdin.pause();
              process.stdin.removeListener('data', onData);
              resolve(buffer.join(''));
          } else if (char === '\x08') {
              // backspace
              if (buffer.length > 0) {
                  buffer.pop();
                  process.stdout.clearLine(0);
                  process.stdout.cursorTo(0);
                  process.stdout.write(prompt + buffer.join(''));
              }
          } else {
              buffer.push(char);
              process.stdout.write(char);
          }
      };

      process.stdin.on('data', onData);
  });
}

function generateHTMLTemplate(type: string, subject: string, message: string): string { // Function to generate HTML template based on user choice
  // You can add more templates here, just make sure to add the case in the switch statement in the generateHTMLTemplate function.
    switch (type) {
      case '1':
        return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${subject}</title>
      </head>
      <body style="margin:0; padding:0; background-color:#000000; font-family:Arial, sans-serif; color:#ffffff;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
          <tr>
            <td align="center" style="padding:40px 20px; background:linear-gradient(135deg, #2b0033, #1a002e); border-bottom:4px solid #ff00ff;">
              <h1 style="font-size:28px; color:#00ffff; text-shadow: 0 0 5px #00ffff, 0 0 10px #ff00ff;">${subject}</h1>
              <p style="font-size:16px; line-height:1.6; color:#cccccc;">
                ${message.replace(/\n/g, '<br>')}
              </p>
              <a href="https://siraj-rg.com" style="display:inline-block; margin-top:25px; padding:12px 30px; background-color:#ff00ff; color:#000000; text-decoration:none; font-weight:bold; border-radius:5px; box-shadow:0 0 10px #ff00ff;">
                🌐 Visit Our Website
              </a>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:15px; font-size:12px; background-color:#0d001a; color:#888888;">
              &copy; 2025 Siraj-RG. All rights reserved.
            </td>
          </tr>
        </table>
      </body>
      </html>
      `;

        case '2': // normal Email Template
            return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="margin:0; padding:0; background-color:#000000; font-family:Arial, sans-serif; color:#ffffff;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
    <tr>
      <td align="center" style="padding:30px 20px; background-color:#1a1a1a;">
        <h2 style="color:#ffffff; margin-bottom: 10px;">${subject}</h2>
        <p style="font-size:16px; line-height:1.5; color:#cccccc; margin:0;">
          ${message.replace(/\n/g, '<br>')}
        </p>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding:15px; font-size:12px; color:#555555;">
        &copy; 2025 Siraj-RG. All rights reserved.
      </td>
    </tr>
  </table>
</body>
</html>
            `;

        case '3': // reply Email Template
            return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="margin:0; padding:0; background-color:#000000; font-family:Arial, sans-serif; color:#ffffff;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
    <tr>
      <td align="center" style="padding:25px 20px; background-color:#1c1c1c;">
        <h2 style="color:#ff4444; margin-bottom: 5px;">RE: ${subject}</h2>
        <p style="font-size:16px; line-height:1.5; color:#cccccc; border-top: 1px solid #333; padding-top: 15px;">
          ${message.replace(/\n/g, '<br>')}
        </p>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding:10px; font-size:12px; color:#444444;">
        &copy; 2025 Siraj-RG. <em>Confidential</em>
      </td>
    </tr>
  </table>
</body>
</html>
            `;

        default:
            return generateHTMLTemplate('1', subject, message);
    }
}


async function main() {
    console.log("Welcome to the Email Sender!");
    console.log("Please select an email template:");
    console.log("1. Default (with button)");
    console.log("2. Normal (simple)");
    console.log("3. Reply (for responses)");

    const templateChoice = await getInput("Enter choice (1/2/3): ");

    if (!['1', '2', '3'].includes(templateChoice)) {
        console.log("Invalid choice. Defaulting to Template 1.");
    }

    console.log("\nPlease enter the email details.\nUse Ctrl+J or paste for new lines. Press Enter to submit.\n");

    const emailSubject = await getInput("Subject: "); // Email Subject
    const customMessage = await getInput("Message (multi-line): "); // Custom message with css & html
    const recipientEmail = await getInput("Recipient email: "); // recipient email address

    const transporter = nodemailer.createTransport({
        host: Host,
        port: 587, // 465 for SSL, 587 for TLS 
        secure: false, // true for 465, false for other ports
        auth: {
            user: Email, // Your email address
            pass: Password, // Your email password or app password
        },
    });

    const mailHTML = generateHTMLTemplate(templateChoice, emailSubject, customMessage); // Generate HTML template based on user choice, you can add more templates here.

    const mailOptions = { // Email options
        from: `${userName} ${Email}`, // sender address
        to: recipientEmail, // list of receivers
        subject: emailSubject, // Subject line
        html: mailHTML, // HTML body content
    };

    transporter.sendMail(mailOptions, (error: Error | null, info) => {
        if (error) {
            return console.log('❌ Error sending email:', error.message);
        }
        console.log('\n✅ Email sent successfully!', info.response);
    });
}

main().catch((err) => {
    console.error("Unexpected error:", err);
    process.exit(1);
});