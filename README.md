# Real Estate Unit Rental CRM

A comprehensive, modern Real Estate Unit Rental CRM built with React, featuring role-based access control, bilingual support, and beautiful animations.

## 🚀 Features

### Core Functionality
- **Role-based Authentication**: Manager and Staff roles with different permissions
- **Dashboard**: Overview with stats, charts, and recent activity
- **Units Management**: Complete CRUD operations for property units
- **Tenants Management**: Manage tenant information and relationships
- **Payments Tracking**: Record and monitor payment history
- **Maintenance Requests**: Handle property maintenance workflows
- **Reports & Analytics**: Revenue and occupancy insights

### User Experience
- **Bilingual Support**: Full Arabic and English localization with RTL support
- **Dark/Light Theme**: Persistent theme switching with smooth transitions
- **Responsive Design**: Mobile-first approach, works on all devices
- **Smooth Animations**: Framer Motion powered micro-interactions
- **Modern UI**: Clean, professional design with Tailwind CSS

### Technical Features
- **Frontend Only**: No backend required, uses mock data
- **Modern Tech Stack**: React 18, Vite, TypeScript alternatives in JS
- **State Management**: Zustand for client-side state
- **Data Fetching**: React Query for caching and synchronization
- **Form Handling**: React Hook Form with validation
- **Routing**: React Router with protected routes

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **React Hook Form** - Form management
- **Zustand** - State management
- **Framer Motion** - Animations
- **React i18next** - Internationalization
- **Recharts** - Data visualization
- **Lucide React** - Icons

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd real-estate-crm
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Demo Credentials

**Manager Account:**
- Email: `manager@realestate.com`
- Password: `manager123`

**Staff Account:**
- Email: `staff@realestate.com`
- Password: `staff123`

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── auth/           # Authentication components
│   ├── layouts/        # Page layouts
│   ├── navigation/     # Navigation components
│   └── ui/             # UI component library
├── pages/              # Page components
│   ├── manager/        # Manager-only pages
│   ├── staff/          # Staff pages
│   └── auth/           # Authentication pages
├── stores/             # Zustand stores
├── i18n/               # Internationalization config
├── hooks/              # Custom React hooks
└── utils/              # Utility functions
```

## 🎨 Design System

The application includes a comprehensive design system with:

### Components
- **Button**: Multiple variants (primary, secondary, outline, ghost, danger)
- **Input**: Form inputs with validation support
- **Card**: Container component with hover effects
- **Avatar**: User profile images with fallbacks
- **StatCard**: Dashboard statistics with animations
- **ThemeToggle**: Dark/light mode switcher
- **LanguageSwitcher**: Bilingual language selector

### Color System
- **Primary**: Blue color ramp for main actions
- **Gray**: Neutral colors for text and backgrounds
- **Semantic**: Success, warning, error color variants
- **Dark Mode**: Full dark theme support

### Animation System
- **Page Transitions**: Smooth route changes
- **Hover Effects**: Interactive element responses
- **Loading States**: Skeleton screens and spinners
- **Micro-interactions**: Button presses and form interactions

## 🌍 Internationalization

Full bilingual support with:
- **English (LTR)**: Default language
- **Arabic (RTL)**: Right-to-left layout support
- **Language Detection**: Browser preference detection
- **Persistent Selection**: Language choice saved locally

### Adding Translations

1. Update translation files in `src/i18n/config.js`
2. Add new keys to both `en` and `ar` objects
3. Use the `useTranslation` hook: `const { t } = useTranslation()`
4. Reference keys in components: `{t('your.translation.key')}`

## 🔐 Authentication & Authorization

### Role-Based Access Control
- **Manager**: Full system access including staff management
- **Staff**: Limited access to assigned functions
- **Route Protection**: Automatic redirection for unauthorized access
- **UI Gating**: Role-based component visibility

### Mock Authentication
The system uses mock authentication with predefined users. In a production environment, replace with your authentication provider.

## 📱 Responsive Design

Mobile-first approach with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

All components adapt to different screen sizes with:
- Collapsible sidebar navigation
- Responsive grid layouts
- Touch-friendly interactions
- Optimized typography scales

## 🎯 Performance Optimizations

- **Code Splitting**: Lazy loading for routes
- **Image Optimization**: Optimized external images
- **Bundle Size**: Tree-shaking and minimal dependencies
- **Caching**: React Query for data persistence
- **Local Storage**: Theme and language preferences

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality

The project includes:
- **ESLint** configuration for code quality
- **Prettier** compatible formatting
- **Modern JavaScript** features
- **Consistent** naming conventions

## 🚀 Deployment

The application is frontend-only and can be deployed to any static hosting service:

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting provider:
   - Vercel
   - Netlify
   - GitHub Pages
   - AWS S3 + CloudFront

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support, please open an issue in the repository or contact the development team.

---

Built with ❤️ using modern web technologies