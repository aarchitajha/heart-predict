# Heart Disease Prediction

A full-stack machine learning application for predicting heart disease risk using modern web technologies and AI.


- ML-Powered Predictions — Advanced machine learning models for heart disease risk assessment
- Full-Stack Architecture — Go backend with Next.js frontend
- Interactive Dashboard— Real-time prediction results and health metrics visualization
- Secure Authentication — User login and profile management
- Responsive Design — Mobile-friendly interface with Tailwind CSS
- User Records — Historical prediction data and health tracking
- Rate Limiting — Middleware protection for API endpoints
- Cloud Ready — Docker containerization with Render deployment support

## Tech Stack

### Backend
- Language: Go
- Runtime: Go 1.x
- Key Libraries: 
  - CORS middleware for cross-origin requests
  - Rate limiting middleware
  - RESTful API handlers

### Frontend
- Framework: Next.js (React)
- Language: TypeScript
- Styling: Tailwind CSS + PostCSS
- Build Tool: Next.js built-in bundler

### Machine Learning
- Language: Python
- Libraries: scikit-learn, pandas, numpy
- Models: Trained on heart disease datasets

### Deployment
- Backend: Render
- Frontend: Vercel
- Containerization: Docker

## Project Structure

```
heart-predict/
├── backend/
│   ├── handlers/
│   │   ├── health.go
│   │   ├── predict.go
│   │   ├── model_info.go
│   │   └── report.go
│   ├── middleware/
│   │   ├── cors.go
│   │   └── ratelimit.go
│   ├── ml/
│   │   ├── predict.py
│   │   ├── train_model.py
│   │   └── model_metadata.json
│   ├── utils/
│   ├── models/
│   ├── main.go
│   ├── Dockerfile
│   ├── go.mod
│   └── render.yaml
│
├── frontend/
│   ├── app/
│   │   ├── api/
│   │   ├── predict/
│   │   ├── dashboard/
│   │   ├── profile/
│   │   ├── records/
│   │   ├── login/
│   │   ├── admin/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── DashboardLayout.tsx
│   │   ├── RiskMeter.tsx
│   │   └── FloatingChatbot.tsx
│   ├── context/
│   ├── lib/
│   ├── types/
│   ├── next.config.js
│   ├── package.json
│   └── tailwind.config.ts
│
├── heart_disease_dataset.csv
├── synthetic_heart_disease_10k_dataset
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- Go 1.21+
- Python 3.8+
- Git

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/your-username/heart-predict.git
cd heart-predict
```

#### 2. Backend Setup

```bash
cd backend
go mod download
cp .env.example .env
go run main.go
```

Backend will be available at `http://localhost:8000`

#### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Frontend will be available at `http://localhost:3000`

#### 4. ML Model Setup (Optional)

```bash
cd backend/ml
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python train_model.py
```

## API Endpoints

### Health Check
- GET /health — Server health status

### Predictions
- POST /api/predict — Get heart disease risk prediction
- GET /api/model-info — Retrieve model metadata

### Reports
- GET /api/report/:id — Generate prediction report

### Admin
- POST /api/admin/users — Manage users
- POST /api/auth — User authentication

## Usage

1. Access the Application — Open http://localhost:3000 in your browser
2. Create an Account — Sign up or login with credentials
3. Input Health Data — Enter your health metrics
4. View Results — Get instant risk assessment
5. Track Progress — Access historical records

## Deployment

### Backend (Render)
```bash
git push origin main
```

### Frontend (Vercel)
```bash
vercel deploy
```

## Docker

Build and run the backend with Docker:

```bash
cd backend
docker build -t heart-predict .
docker run -p 8000:8000 heart-predict
```

## Features in Detail

### Machine Learning
- Trained models for heart disease prediction
- Support for multiple health metrics
- Model versioning and metadata tracking

### User Interface
- Clean, intuitive design with Tailwind CSS
- Risk visualization components
- Loading states and error handling
- Responsive mobile design

### Authentication & Security
- JWT-based authentication
- Rate limiting on API endpoints
- CORS protection
- Secure password handling

### Database
- User profiles and historical data
- Prediction records
- Admin user management

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or suggestions:
- Open an Issue on GitHub
- Check existing documentation
- Review the project wiki

## Disclaimer

This application is for educational and informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for medical concerns.
