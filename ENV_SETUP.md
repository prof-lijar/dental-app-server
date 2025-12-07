# Environment Variables Setup

## Database Configuration

Create a `.env.local` file in the root directory with the following:

```bash
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true
```

### How to get your Supabase connection string:

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **Database**
3. Under **Connection string**, select **Connection pooling**
4. Copy the connection string
5. Replace `[YOUR-PASSWORD]` with your database password
6. The connection string should include `?pgbouncer=true` for connection pooling

### Example:

```
DATABASE_URL=postgresql://postgres.abcdefghijklmnop:your-password-here@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Note:** The `.env.local` file is gitignored and will not be committed to version control.

## Email Configuration (Google SMTP)

Add the following email environment variables to your `.env.local` file:

```bash
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### How to get your Google App Password:

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification** (must be enabled)
3. At the bottom, click on **App passwords**
4. Select app: **Mail** and device: **Other (Custom name)**
5. Enter a name like "Dental App Server"
6. Click **Generate**
7. Copy the 16-character password (without spaces) and use it as `SMTP_PASSWORD`

### Example:

```bash
SMTP_USER=dental.clinic.app@gmail.com
SMTP_PASSWORD=abcdefghijklmnop
```

### Important Notes:

- **2-Step Verification** must be enabled on your Google account to generate App Passwords
- The App Password is different from your regular Google password
- Keep your App Password secure and never commit it to version control
- You can revoke App Passwords anytime from your Google Account settings

## Chatbot Configuration (Google Gemini AI)

Add the following environment variable to your `.env.local` file for the chatbot functionality:

```bash
GOOGLE_AI_API_KEY=your-google-ai-api-key
```

### How to get your Google AI API Key:

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click on **Get API key** in the left sidebar
4. Click **Create API key** in new project or select an existing project
5. Copy the generated API key
6. Add it to your `.env.local` file as `GOOGLE_AI_API_KEY`

### Example:

```bash
GOOGLE_AI_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567
```

### Important Notes:

- The API key is free to use with rate limits
- Keep your API key secure and never commit it to version control
- You can manage and revoke API keys from [Google AI Studio](https://aistudio.google.com/)
- The chatbot uses the Gemini 1.5 Flash model by default
