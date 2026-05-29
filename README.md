# MindConnect - Mental Health & Wellness Platform

A complete university mental health appointment scheduling platform built with ReactJS, Tailwind CSS, and Firebase.

## Features

### For Students
- Book, reschedule, and cancel appointments
- Track daily mood with visual charts
- Access self-help resources and articles
- Crisis support with emergency hotlines
- Real-time notifications

### For Doctors/Counselors
- Set weekly availability schedule
- Approve/reject appointment requests
- Add session notes
- View patient history
- Dashboard analytics

### For Administrators
- Manage all users (students, doctors, admins)
- Monitor all appointments
- View platform analytics and reports
- Generate insights and trends

## Tech Stack

- **Frontend:** ReactJS (Vite), Tailwind CSS, Framer Motion, Lucide React
- **Backend:** Firebase Authentication, Firestore Database, Firebase Storage
- **State Management:** React Context API + Zustand
- **Forms:** React Hook Form
- **Charts:** Recharts

## Getting Started

### Prerequisites
- Node.js 18+
- Firebase account

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd MindConnect
```

2. Install dependencies
```bash
npm install
```

3. Set up Firebase
   - Create a new Firebase project
   - Enable Authentication (Email/Password and Google)
   - Create a Firestore database
   - Enable Firebase Storage
   - Copy your Firebase config to `.env` file

4. Create `.env` file from template
```bash
cp .env.example .env
```
   - Fill in your Firebase configuration values

5. Deploy Firestore Security Rules
```bash
firebase deploy --only firestore:rules
```

6. Deploy Storage Rules
```bash
firebase deploy --only storage
```

7. Start development server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Deploy to Firebase Hosting
```bash
firebase deploy --only hosting
```

## Firebase Database Structure

### Collections

- **users** - User profiles with roles
- **students** - Student-specific data (student number, course, mood logs)
- **doctors** - Doctor profiles (specialization, availability, bio)
- **appointments** - Appointment records
- **notifications** - User notifications
- **resources** - Self-help resources
- **mood_logs** - Mood tracking entries

## User Roles

1. **Student** - Can book appointments, track mood, access resources
2. **Doctor** - Can manage schedule, approve appointments, add notes
3. **Admin** - Full platform management and analytics access

## Security

- Role-based access control via Firestore Security Rules
- Firebase Authentication for secure login
- Input validation on all forms
- Protected routes in React Router

## Accessibility

- ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader compatible
- High contrast mode support
- Adjustable font sizing
- Reduced motion support

## License

MIT License - University Mental Health Initiative
