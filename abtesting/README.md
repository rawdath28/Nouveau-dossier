# A/B Testing Platform

A modern A/B testing platform for email marketing campaigns built with React, Material-UI, and Supabase.

## Features

- User authentication with Supabase
- Dashboard with performance metrics
- Campaign management
- A/B test results visualization
- Settings configuration

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Get your project URL and anon key from the project settings
   - Update the `src/supabaseClient.js` file with your Supabase credentials:
     ```javascript
     const supabaseUrl = 'YOUR_SUPABASE_URL';
     const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
     ```

### Running the Application

```
npm run dev
```

The application will be available at http://localhost:5173

## Authentication

The application uses Supabase for authentication. Users can:

- Sign up with email and password
- Sign in with email and password
- Reset their password
- Sign out

## Project Structure

- `src/components/` - React components
- `src/contexts/` - React contexts (including authentication)
- `src/supabaseClient.js` - Supabase client configuration

## Technologies Used

- React
- Material-UI
- Supabase
- React Router
- Recharts (for data visualization)
