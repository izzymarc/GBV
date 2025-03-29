# GBV Psychosocial Assessment Tool

A digital psychosocial assessment platform designed to provide sensitive, comprehensive documentation tools for professionals supporting gender-based violence survivors.

## Features

- Comprehensive multi-section assessment form
- Mental health scoring for anxiety, depression, and trauma
- Risk assessment with alerts for high-risk situations
- PDF generation for documentation
- Admin dashboard for data management
- Secure database storage

## Tech Stack

- **Frontend**: React with Vite, Tailwind CSS, Shadcn UI
- **Backend**: Node.js with Express
- **Database**: PostgreSQL with Drizzle ORM
- **API**: RESTful API endpoints
- **Deployment**: Netlify with serverless functions

## Getting Started

### Prerequisites

- Node.js 20+ installed
- PostgreSQL database (can use Neon DB or similar)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:
   ```
   DATABASE_URL=your_postgres_connection_string
   ```

4. Run the development server:

```bash
npm run dev
```

### Database Setup

The application uses Drizzle ORM for database management. To initialize the database:

```bash
npm run db:push
```

## Deployment

This project is configured for deployment to Netlify. See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## Assessment Sections

1. **General Information**: Basic demographic data
2. **Incident Details**: Information about GBV incidents
3. **Mental Health Assessment**:
   - Anxiety symptoms (GAD-7)
   - Depression symptoms (PHQ-9)
   - Trauma symptoms (PCL-5)
   - Trauma bonding assessment
4. **Social Support and Coping**
5. **Physical and Functional Well-being**
6. **Risk Assessment**
7. **Program Expectations and Goals**

## License

MIT