# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi

from app.database.connection import Base, engine  # ensure this import is correct in your project
from app.models import user, job, resume  # keep model imports if they're needed for metadata
from app.routes import auth, job as job_routes, resume as resume_routes, admin

app = FastAPI(
    title="HireWise API",
    description="AI-powered resume screening platform with role-based access",
    version="1.0.0"
)

# --- CORS setup ---
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Register Routes ---
app.include_router(auth.router, prefix="/auth")
app.include_router(job_routes.router, prefix="/jobs")
app.include_router(admin.router, prefix="/admin")
app.include_router(resume_routes.router, prefix="/resumes", tags=["Resumes"])

# --- DB Setup ---
Base.metadata.create_all(bind=engine)
# Base.metadata.drop_all(bind=engine)
print("✅ All tables created.")

# --- Root route ---
@app.get("/")
def home():
    return {"msg": "🚀 HireWise backend is live!"}

# --- Custom OpenAPI with Bearer auth ---
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="HireWise API",
        version="1.0.0",
        description="AI-powered resume screening platform with role-based access",
        routes=app.routes,
    )

    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }

    # Apply security to all routes except auth
    for path, methods in openapi_schema["paths"].items():
        for method in methods.values():
            if not path.startswith("/auth"):
                method["security"] = [{"BearerAuth": []}]

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi
