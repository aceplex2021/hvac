### To make certain userID as admin sql
update auth.users
set raw_app_meta_data = jsonb_set(
  coalesce(raw_app_meta_data, '{}'),
  '{role}',
  '"admin"',
  true
)
where id = 'ca9050bd-e61d-4037-acc6-a67ed580bb54';

### To find out role in supabase
SELECT id, email, raw_app_meta_data
FROM auth.users;

### To delete user in supabase
DELETE FROM auth.users WHERE id = '944521fe-4f20-414d-8718-3634f1b1a722';

# HVAC Service Provider PWA - Project Plan

To start dev server: cd hvac-core; npm run dev
push and commit to git
- git add .
- git commit -m "Your commit message here"
- git push origin main

## System Flow

### Service Provider (SP) Registration Flow
1. SP signs up for the platform
   - Business information collection
   - Service offerings setup
   - Pricing configuration
   - Business hours setup
2. System creates SP portal
   - Dashboard setup
   - Service management interface
   - Customer management system
   - Booking management tools
3. System generates unique SP landing page
   - Custom URL creation
   - Service showcase
   - Booking interface
   - Contact information

### Customer Booking Flow
1. Customer discovers SP through landing page
   - Views service offerings
   - Checks availability
   - Reviews pricing
2. Customer books service
   - Service selection
   - Date/time selection
   - Customer information collection
   - Booking confirmation
3. System processes booking
   - Creates customer profile
   - Generates booking record
   - Updates SP calendar
   - Sends confirmation notifications
4. Data synchronization
   - Booking appears in SP portal
   - Customer receives portal access
   - Real-time status updates
   - Communication channel established

### Service Management Flow
1. SP receives booking notification
   - Views booking details
   - Assigns technician
   - Updates schedule
2. Service execution
   - Status tracking
   - Progress updates
   - Customer communication
   - Document sharing
3. Service completion
   - Work completion confirmation
   - Invoice generation
   - Customer feedback collection
   - Service history update

## Important Notes
- Do not go outside the plan
- Update tracker as we go
- Do not add or do things w/o owner's approval
- If unsure about anything, do not make assumptions, always ask before proceeding

## Project Structure
```
hvac/
└── hvac-core/              # Main project directory
    ├── src/                # Source code
    │   ├── app/           # Next.js app router
    │   ├── components/    # Reusable components
    │   ├── contexts/      # React contexts
    │   └── lib/          # Utility functions
    ├── migrations/        # Database migrations
    ├── .env              # Environment variables
    ├── PROJECT_PLAN.md   # This file
    ├── package.json      # Project configuration
    └── ...              # Other Next.js files
```

## Implementation Tracker

### Phase 1: Project Setup & Infrastructure ✅
- [x] Initialize Next.js project with TypeScript
- [x] Set up Tailwind CSS for styling
- [x] Configure ESLint and Prettier
- [x] Set up Supabase for database and authentication
- [x] Create basic project structure
- [x] Set up environment variables
- [x] Configure routing structure

### Phase 2: Core Business Features
- [x] Service Types Management
  - [x] Create service type model
  - [x] Implement CRUD operations
  - [x] Add service type form
  - [x] Create service type list view
  - [x] Add service type card component
  - [x] Implement service type manager
  - [x] Add service template form
  - [x] Implement pricing preview
  - [x] Add scheduling preview
- [x] Service Scheduling
  - [x] Create scheduling model
  - [x] Implement availability checking
  - [x] Add scheduling calendar
  - [x] Create appointment booking flow
  - [x] Scheduling rules
  - [x] Conflict resolution
- [x] Customer Management
  - [x] Create customer model
  - [x] Implement customer profiles
  - [x] Add customer search
  - [x] Create customer history view
  - [x] Add customer communication
- [ ] Service Requests
  - [x] Create service request model
  - [x] Implement request creation flow
  - [x] Create request details view
  - [x] Add request status tracking
  - [x] Add request updates
- [x] Service History
  - [x] Create service history model
  - [x] Implement history tracking
  - [x] Add history filters
  - [x] Create history export
  - [x] Add history analytics

### Phase 2: Customer Booking Portal (100% Complete)
1. Service Provider Landing Page
   - [x] URL Structure
     - [x] Subdomain routing
     - [x] Unique business URLs
     - [x] DNS management
   - [x] Page Components
     - [x] Hero section
     - [x] Services showcase
     - [x] Booking interface
     - [x] Business information
     - [x] Contact section
   - [x] Integration with Main Portal
     - [x] Data synchronization
     - [x] Real-time updates
     - [x] Security measures
   - [x] White Label Integration Options
     - [x] Embedded Booking Widget
       - [x] Widget component
       - [x] Configuration interface
       - [x] Theme customization
       - [x] Embed code generation
     - [x] API Integration
       - [x] REST API endpoints
       - [x] Authentication system
       - [x] Rate limiting
       - [x] Documentation
       - [x] SDK development
     - [x] Iframe Integration
       - [x] Full-page booking iframe
       - [x] Responsive design
       - [x] Theme customization
       - [x] Integration guide

2. Booking Management (100% Complete)
   - [x] Booking flow
     - [x] Multi-step booking process
     - [x] Session management
     - [x] Data validation
     - [x] Error handling
   - [x] Calendar integration
     - [x] Availability checking
     - [x] Time slot management
     - [x] Business hours integration
   - [x] Payment processing
     - [ ] Payment gateway integration (Stripe - To be imported)
     - [x] Invoice generation
       - [x] Invoice creation
       - [x] Invoice tracking
       - [x] Status management
     - [x] Refund handling
       - [x] Refund processing
       - [x] Refund tracking
       - [x] Status updates
   - [x] Email notifications
     - [x] Booking confirmation
     - [x] Reminder emails
     - [x] Customizable templates
   - [x] SMS notifications
     - [x] Booking confirmation
     - [x] Reminder texts
     - [x] Status updates

3. Customer Portal (100% Complete)
   - [x] Customer registration
     - [x] Profile creation
     - [x] Data validation
     - [x] Duplicate checking
   - [x] Booking history
     - [x] Booking retrieval
     - [x] Status tracking
     - [x] Date filtering
     - [x] Invoice integration
   - [x] Service tracking
     - [x] Service status updates
     - [x] Progress tracking
     - [x] Completion notifications
   - [x] Communication hub
     - [x] Message center
     - [x] Notification preferences
     - [x] Document sharing

### Phase 3: Customer Portal Development
- [x] Customer Dashboard
  - [x] Booking History
  - [x] Service Tracking
  - [x] Payment History
  - [x] Profile Management
- [ ] Service Provider Dashboard
  - [ ] Calendar Management
  - [ ] Service Management
  - [ ] Customer Management
  - [ ] Analytics and Reporting

### Phase 4: Integration & Testing (25% Complete)
1. API Integration
   - [] Service endpoints - need to create api route for avail time slot for customers bookings
   - [] Authentication - need to complete customer auth
   - [] Data validation
   - [x] Error handling
   - [x] Database schema setup (all hvac_* tables created)
   - [x] Row Level Security (RLS) policies enabled for all tables

2. Testing
   - [ ] Unit testing
   - [ ] Integration testing
   - [ ] User acceptance testing
   - [ ] Performance testing

### Phase 4: Deployment & Launch (0% Complete)
1. Production Deployment
   - [ ] Server setup
   - [ ] Database migration
   - [ ] SSL configuration
   - [ ] CDN setup

2. Launch Preparation
   - [ ] Documentation
   - [ ] Training materials
   - [ ] Support system
   - [ ] Marketing materials

### Phase 5: AI Integration (0% Complete)
1. Service Intelligence
   - [ ] Diagnostic AI System
     - [ ] Symptom analysis engine
     - [ ] Issue prediction model
     - [ ] Maintenance recommendations
     - [ ] Cost estimation AI
   - [ ] Predictive Maintenance
     - [ ] IoT sensor integration
     - [ ] Failure prediction models
     - [ ] Component health monitoring
     - [ ] Maintenance scheduling optimization

2. Business Operations AI
   - [ ] Smart Scheduling System
     - [ ] Technician matching algorithm
     - [ ] Route optimization
     - [ ] Dynamic scheduling
     - [ ] Resource allocation AI
   - [ ] Inventory Management AI
     - [ ] Parts demand prediction
     - [ ] Automated reordering
     - [ ] Supplier optimization
     - [ ] Stock level optimization
   - [ ] Energy Analytics
     - [ ] Consumption analysis
     - [ ] Efficiency recommendations
     - [ ] Cost optimization
     - [ ] Sustainability metrics

3. Customer Intelligence
   - [ ] Customer Analytics
     - [ ] Behavior analysis
     - [ ] Churn prediction
     - [ ] Service prediction
     - [ ] Customer segmentation
   - [ ] Dynamic Pricing
     - [ ] Market-based pricing
     - [ ] Demand prediction
     - [ ] Competitive analysis
     - [ ] Promotion optimization

4. AI Infrastructure
   - [ ] Data Pipeline
     - [ ] Data collection system
     - [ ] Preprocessing pipeline
     - [ ] Feature engineering
     - [ ] Model training pipeline
   - [ ] Integration Framework
     - [ ] API endpoints
     - [ ] Real-time processing
     - [ ] Model deployment
     - [ ] Monitoring system

5. AI Model Management
   - [ ] Model Versioning
   - [ ] Performance Monitoring
   - [ ] Automated Retraining
   - [ ] A/B Testing Framework

## Current Focus
- Completing the Booking Management system
- Implementing the Customer Portal
- Setting up the integration testing framework

## Next Priority Areas
1. Booking Management System
   - Implement the booking flow
   - Integrate calendar functionality
   - Set up payment processing
   - Configure notification system

2. Customer Portal Development
   - Create customer registration system
   - Build booking history interface
   - Implement service tracking
   - Develop communication features

3. Integration & Testing Setup
   - Design API endpoints
   - Set up testing environment
   - Create test cases
   - Implement CI/CD pipeline

## Progress Tracking
- Service Provider Portal: 90% complete
- Customer Booking Portal: 100% complete
- Integration & Testing: 25% complete
- Deployment & Launch: 0% complete
- AI Integration: 0% complete

## Development Approach

1. **Modular Development**
   - Each feature module is developed independently
   - Modules can be enabled/disabled per business
   - Clear interfaces between modules
   - Easy to add new features

2. **Feature Flags**
```typescript
// Example feature flag implementation
interface BusinessFeatures {
  booking: boolean;
  workOrders: boolean;
  inventory: boolean;
  invoicing: boolean;
  dispatch: boolean;
}

// Feature check middleware
export function withFeature(feature: keyof BusinessFeatures) {
  return async (req: Request, handler: Function) => {
    const business = await getBusinessFromRequest(req);
    if (!business.features[feature]) {
      throw new Error('Feature not enabled');
    }
    return handler();
  };
}
```

3. **Progressive Enhancement**
   - Start with essential features
   - Add advanced features based on business needs
   - Allow businesses to upgrade as they grow 