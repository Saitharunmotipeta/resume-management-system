from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi

from app.database import Base, engine
from app.models import user, job, resume
from app.routes import auth, job as job_routes, resume as resume_routes

app = FastAPI(
    title="HireWise API",
    description="AI-powered resume screening platform with role-based access",
    version="1.0.0"
)

# --- CORS setup ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Register Routes ---
app.include_router(auth.router, prefix="/auth")  # ✅ clean prefixing
app.include_router(job_routes.router, prefix="/jobs")
app.include_router(resume_routes.router, prefix="/resumes", tags=["Resumes"])

# --- DB Setup ---
Base.metadata.create_all(bind=engine)
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

    for path in openapi_schema["paths"].values():
        for method in path.values():
            method["security"] = [{"BearerAuth": []}]

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi
