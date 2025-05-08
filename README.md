# Custom HTML Email Sender (CLI)

A command-line tool built with Node.js and TypeScript to send custom HTML-formatted emails using your own SMTP provider. This script allows you to choose from predefined HTML templates, input email details interactively, and send professional-looking emails directly from your terminal.

## Features

*   **Send HTML Emails:** Sends emails with custom HTML content for rich formatting.
*   **Custom SMTP Configuration:** Uses your own email provider's SMTP settings.
*   **Interactive CLI:** Guides you through selecting a template and providing email details (subject, message, recipient).
*   **Multiple Email Templates:** Includes several predefined HTML templates:
    *   Default (with a call-to-action button)
    *   Normal (simple, clean design)
    *   Reply (formatted for responses)
*   **Environment Variable Configuration:** Securely manage your email credentials and SMTP host using a `.env` file.
*   **Powered by Nodemailer:** Utilizes the popular Nodemailer library for robust email sending.
*   **Raw Input Handling:** Custom input function for a more controlled CLI experience.

## Prerequisites

*   **Node.js:** Version 16.x or higher recommended.
*   **npm** or **yarn:** For managing project dependencies.
*   **An SMTP Server Account:** You'll need access to an SMTP server. This could be:
    *   Your email provider (e.g., Gmail, Outlook, Infomaniak).
    *   A transactional email service (e.g., SendGrid, Mailgun, Amazon SES).
*   **TypeScript (for development/running directly):** `ts-node` is useful for running the `.ts` file directly.

## Setup and Installation

1.  **Clone the repository (or download the files):**
    ```bash
    # If you have it in a git repo
    # git clone <your-repo-url>
    # cd <your-repo-name>

    # Otherwise, just navigate to the directory where you have the script.
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
    This will install `nodemailer` and `dotenv`. If you don't have `typescript` and `ts-node` installed globally, you might want to install them as dev dependencies:
    ```bash
    npm install -D typescript ts-node @types/node @types/nodemailer
    # or
    yarn add -D typescript ts-node @types/node @types/nodemailer
    ```

3.  **Create a `.env` file:**
    In the root directory of the project, create a file named `.env` and add your SMTP configuration:

    ```env
    EMAIL="your_email@example.com"
    PASSWORD="your_email_password_or_app_password"
    HOST="smtp.your_email_provider.com"
    USERNAME="Your Name or Company Name"
    ```

    **Explanation of `.env` variables:**
    *   `EMAIL`: Your full email address that will be used for authentication and as the sender.
    *   `PASSWORD`:
        *   For most email providers, this is your regular email password.
        *   **For Gmail:** You **must** enable 2-Factor Authentication (2FA) for your Google account and then create an "App Password". Use this App Password here, not your regular Gmail password.
        *   For other services like SendGrid, this might be an API key.
    *   `HOST`: The SMTP server address of your email provider. Examples:
        *   Gmail: `smtp.gmail.com`
        *   Infomaniak: `mail.infomaniak.com`
        *   Outlook: `smtp.office365.com` or `smtp-mail.outlook.com`
        *   SendGrid: `smtp.sendgrid.net`
        *   Consult your email provider's documentation for the correct SMTP host.
    *   `USERNAME`: The name that will appear as the sender (e.g., "John Doe", "My Company").

    **⚠️ Security Note:** Never commit your `.env` file to a public Git repository. Add `.env` to your `.gitignore` file.

## Usage

1.  **Run the script:**
    If you have `ts-node` installed, you can run the script directly:
    ```bash
    npx ts-node your_script_name.ts
    ```
    (Replace `your_script_name.ts` with the actual name of your TypeScript file).

    Alternatively, you can compile it to JavaScript first:
    ```bash
    npx tsc your_script_name.ts
    node your_script_name.js
    ```

2.  **Follow the prompts:**
    *   The script will first ask you to select an email template.
    *   Then, it will prompt you for the `Subject`, `Message`, and `Recipient email`.
    *   **For multi-line messages:** You can paste content with newlines directly into the prompt. Newlines will be converted to `<br>` tags in the HTML email. Press `Enter` to submit each field.
    *   Press `Ctrl+C` at any time to exit the script.

3.  **Check the output:**
    The script will log whether the email was sent successfully or if an error occurred.

## Customization

### Adding More HTML Templates

1.  **Modify `generateHTMLTemplate` function:**
    *   Open the script file (`your_script_name.ts`).
    *   In the `generateHTMLTemplate` function, add a new `case` to the `switch` statement for your new template. Assign it a unique number (e.g., '4').
    *   Inside this new `case`, return the HTML string for your template. Remember to use inline CSS for best email client compatibility. You can use `${subject}` and `${message.replace(/\n/g, '<br>')}` placeholders.

    ```typescript
    // Inside generateHTMLTemplate function
    // ...
        case '4': // My New Custom Template
            return `
    <!DOCTYPE html>
    <html>
    <head><title>${subject}</title></head>
    <body style="background-color:#f0f0f0; color:#333;">
      <h1>${subject}</h1>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <p>Regards, My App</p>
    </body>
    </html>
            `;
    // ...
    ```

2.  **Update the prompt in `main` function:**
    *   In the `main` function, update the `console.log` messages that list the available templates to include your new option.

    ```typescript
    // Inside main function
    // ...
    console.log("Please select an email template:");
    console.log("1. Default (with button)");
    console.log("2. Normal (simple)");
    console.log("3. Reply (for responses)");
    console.log("4. My New Custom Template"); // Add your new template description

    const templateChoice = await getInput("Enter choice (1/2/3/4): "); // Update choices

    if (!['1', '2', '3', '4'].includes(templateChoice)) { // Update valid choices
        console.log("Invalid choice. Defaulting to Template 1.");
    }
    // ...
    ```

## Important Considerations

*   **SMTP Provider Limits:** Be aware of any sending limits imposed by your email provider (e.g., Gmail has daily limits). For sending large volumes of email, consider dedicated transactional email services like SendGrid or Amazon SES.
*   **Email Client Compatibility:** HTML and CSS rendering can vary significantly between email clients (Outlook, Gmail, Apple Mail, etc.). The provided templates use inline CSS, which is generally the most compatible approach. Test your emails on various clients.
*   **Security:**
    *   The `PASSWORD` in your `.env` file is sensitive. Ensure this file is not publicly accessible or committed to version control if the repository is public.
    *   Using App Passwords (like for Gmail) is more secure than using your main account password for third-party applications.
*   **Error Handling:** The script includes basic error logging. For a production application, you might want more robust error handling and reporting.

## Troubleshooting

*   **"Authentication failed" / "Invalid credentials":**
    *   Double-check your `EMAIL` and `PASSWORD` in the `.env` file.
    *   If using Gmail, ensure you're using an App Password and that 2FA is enabled.
    *   Verify the `HOST` and port settings (port `587` with `secure: false` for TLS, or port `465` with `secure: true` for SSL are common).
*   **Emails going to Spam:**
    *   Ensure your sending domain has proper SPF, DKIM, and DMARC records set up. This is usually configured in your DNS settings.
    *   Avoid spammy content in your subject line and message body.
    *   Using a reputable transactional email service can significantly improve deliverability.
*   **Connection Timeouts:**
    *   Check your internet connection.
    *   Ensure the `HOST` and `PORT` are correct and that your firewall isn't blocking outgoing connections on that port.

---
