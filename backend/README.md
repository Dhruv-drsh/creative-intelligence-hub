# Creative Hub Backend

FastAPI backend for Creative Hub application.

## Quick Start

### Using Docker (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

### Manual Setup

1. **Create PostgreSQL database:**
```bash
createdb creative_hub
psql -d creative_hub -f migrations/001_initial_schema.sql
```

2. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your settings
```

5. **Run the server:**
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
| `DATABASE_URL` | PostgreSQL connection string | `postgresql+asyncpg://postgres:postgres@localhost:5432/creative_hub` |
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

### Resources
- `GET/POST /api/projects` - List/create projects
- `GET/PUT/DELETE /api/projects/{id}` - Project operations
- `GET/POST /api/brand-kits` - List/create brand kits
- `GET/PUT/DELETE /api/brand-kits/{id}` - Brand kit operations
- `GET/POST /api/templates` - List/create templates
- `GET/PUT/DELETE /api/templates/{id}` - Template operations

### AI Endpoints
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
