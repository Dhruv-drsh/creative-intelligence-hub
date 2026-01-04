# Creato-Sphere FastAPI Backend

FastAPI backend for Creato-Sphere AI Creative Platform with MongoDB Atlas.

## Tech Stack

- **FastAPI** - Modern Python web framework
- **MongoDB Atlas** - Cloud database
- **Beanie ODM** - MongoDB object-document mapper
- **JWT** - Authentication
- **Lovable AI Gateway** - AI capabilities

## Quick Start

### Using Docker (Recommended)

```bash
# Start backend
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

### Manual Setup

1. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your MongoDB Atlas connection string
```

4. **Run the server:**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URL` | MongoDB Atlas connection string | Required |
| `MONGODB_DB_NAME` | Database name | `creative_hub` |
| `JWT_SECRET` | Secret key for JWT tokens | Required |
| `LOVABLE_API_KEY` | API key for Lovable AI Gateway | Required for AI features |
| `STORAGE_ROOT` | Local file storage path | `./storage` |
| `PUBLIC_URL_BASE` | Public URL for stored files | `http://localhost:8000/storage/v1/object/public/assets` |

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get tokens
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Profiles
- `GET /api/profiles/me` - Get profile
- `PUT /api/profiles/me` - Update profile

### Resources
- `GET/POST /api/projects` - List/create projects
- `GET/PUT/DELETE /api/projects/{id}` - Project operations
- `GET/POST /api/brand-kits` - List/create brand kits
- `GET/PUT/DELETE /api/brand-kits/{id}` - Brand kit operations
- `GET/POST /api/templates` - List/create templates
- `GET/PUT/DELETE /api/templates/{id}` - Template operations
- `GET/POST/DELETE /api/templates/favorites/{id}` - Template favorites

### AI Endpoints (13 total)
- `POST /api/ai/attention-heatmap` - Generate attention predictions
- `POST /api/ai/brand-dna` - Extract brand DNA from image
- `POST /api/ai/campaign-set` - Generate campaign variations
- `POST /api/ai/canvas-control` - Natural language canvas control
- `POST /api/ai/color-psychology` - Color recommendations
- `POST /api/ai/copywriting` - Generate ad copy
- `POST /api/ai/creative-multiverse` - Style variations
- `POST /api/ai/emotion-design` - Emotion-based design
- `POST /api/ai/generate-background` - AI background generation
- `POST /api/ai/performance-predictions` - Predict ad performance
- `POST /api/ai/trend-forecast` - Creative trend forecasts
- `POST /api/ai/typography-harmony` - Font pairing suggestions
- `POST /api/ai/visual-auditor` - Design feedback

### Storage
- `POST /api/storage/upload` - Upload file
- `DELETE /api/storage/{path}` - Delete file

## MongoDB Collections

- `users` - User accounts
- `profiles` - User profiles
- `projects` - Creative projects
- `brand_kits` - Brand kits
- `templates` - Templates
- `template_favorites` - Template favorites

## Frontend Configuration

To use the FastAPI backend instead of Lovable Cloud, update frontend `.env`:

```env
VITE_BACKEND_TYPE=local
VITE_API_URL=http://localhost:8000/api
```
