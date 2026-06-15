# Kinyui Boys Senior School Website

A responsive school website and administration system built with Next.js, React,
Prisma, and MySQL. The application includes public school pages, student-facing
academic downloads, and an authenticated dashboard for managing school content.

## Project Overview

| Area | Purpose |
| --- | --- |
| Public website | School information, admissions, staff, alumni, news, events, gallery, and School Hub pages |
| Admin dashboard | Manage assignments, resources, alumni, applications, email campaigns, staff, and school content |
| Student content | Search, view, and download assignments and learning resources |
| Data layer | MySQL database accessed through Prisma |
| File management | Upload and manage documents and school images |

## Main Features

- Assignment and learning-resource creation, editing, deletion, search, and file management
- Alumni profile management with dynamic dashboard statistics
- Admission application review and filtering
- Email campaign management
- School Hub management for clubs, facilities, departments, and activities
- Staff, events, news, gallery, achievements, and school-document management
- Responsive layouts for phones, tablets, iPads, laptops, and desktop screens
- Authenticated admin API operations

## Recent UI And Data Improvements

### Assignments

- The admin table displays only records returned by `/api/assignment`.
- Hardcoded, sample, placeholder, and automatically generated display records were removed.
- The table now contains only creation-form information:
  - Assignment title and description
  - Subject and class
  - Teacher
  - Uploaded assignment files
- Access level, status, due status, priority, estimated time, and other legacy metadata are no longer displayed.
- The detail modal follows the same submitted-field rule.
- Search and filters remain available for title, description, subject, teacher, and class.

### Learning Resources

- The admin table displays only records returned by `/api/resources`.
- Mock entries and generated fallback values were removed.
- The table uses the same responsive design as Assignments.
- Visible columns are limited to:
  - Resource title and description
  - Subject and class
  - Teacher
  - Uploaded files
- Resource count, access level, status, type, and hidden default metadata are no longer presented as user-entered information.

### Dashboard Headers

The following dashboard sections now use one compact and consistent header design:

- Admission Applications
- Email Campaigns
- School Hub
- Assignments
- Resources

Decorative status strips, oversized hero effects, and redundant statistics grids were
removed while preserving each section's actions, filters, tabs, and CRUD workflows.

### SMS Removal And Alumni Statistics

- SMS pages, navigation entries, API routes, widgets, integrations, and runtime requests were removed.
- The dashboard now loads real alumni data from `/api/alumini`.
- Alumni summaries include total profiles, featured profiles, graduation-year coverage, and recent records.
- Historical `SmsCampaign` and `SmsLog` Prisma models remain in the schema only to
  preserve existing database tables and avoid destructive data loss. No application
  runtime code uses them.

## Technology

- Next.js 14
- React 18
- Tailwind CSS
- Material UI
- Prisma 4.15
- MySQL
- Cloudinary and other configured file-storage providers
- Nodemailer

## Local Setup

### Requirements

- Node.js 18 or newer
- npm
- A MySQL database

### Installation

```bash
git clone https://github.com/kinyuiboys2015/School_Website.git
cd School_Website
npm install
```

Create a local `.env` file and provide the required environment variables. At minimum,
Prisma requires a valid MySQL connection string:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
```

Add the authentication, email, and file-storage variables required by the modules you
intend to run. Never commit real credentials.

## Database Workflow

Generate the Prisma client:

```bash
npx prisma generate
```

Synchronize the schema without approving destructive changes:

```bash
npx prisma db push
```

Do not add `--accept-data-loss` unless a reviewed migration intentionally removes or
rewrites data. A normal `db push` stops and reports the risk when Prisma detects a
destructive change.

The database was verified on June 15, 2026 and reported:

```text
The database is already in sync with the Prisma schema.
```

## Development

Start the development server on port `3001`:

```bash
npm run dev
```

Build the production application:

```bash
npm run build
```

The build command generates the Prisma client before compiling Next.js.

## Important Paths

| Path | Responsibility |
| --- | --- |
| `app/MainDashboard/page.jsx` | Admin navigation and dashboard module loading |
| `app/components/AssignmentsManager/page.jsx` | Assignment administration |
| `app/components/resources/page.jsx` | Learning-resource administration |
| `app/components/dashbaord/page.jsx` | Main dashboard overview and alumni statistics |
| `app/components/alumini/page.jsx` | Alumni administration |
| `app/components/applications/page.jsx` | Admission applications |
| `app/components/email/page.jsx` | Email campaigns |
| `app/components/schoolhub/page.jsx` | School Hub administration |
| `app/api/assignment` | Assignment database API |
| `app/api/resources` | Resource database API |
| `app/api/alumini` | Alumni database API |
| `prisma/schema.prisma` | MySQL data model |

## Data Integrity Rules

- Assignment and resource lists must be rendered from API/database responses only.
- UI fallback text may explain a missing optional field, but must never create a fake record.
- Hidden schema defaults must not be displayed as though an administrator entered them.
- Removing a feature from the UI must not delete historical database tables without an explicit migration review.
- Uploaded file links must come from each stored assignment or resource record.

## Verification

The current implementation has been checked with:

```bash
npx prisma db push
npm run build
```

Results:

- Prisma connected successfully to MySQL.
- The database schema was already synchronized.
- Prisma Client generation succeeded.
- The Next.js production build compiled successfully.
- All application routes were generated.
- No SMS runtime references or SMS API routes remain.
