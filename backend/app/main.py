import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from .database.connection import Base, engine
from .models import user, job, resume
from .routes import auth, job as job_routes, resume as resume_routes, admin

app = FastAPI(
    title="HireWise API",
    description="AI-powered resume screening platform with role-based access",
    version="1.0.0"
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://resume-management-system-frontend-72gn.onrender.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth")
app.include_router(job_routes.router, prefix="/jobs")
app.include_router(admin.router)
app.include_router(resume_routes.router, prefix="/resumes", tags=["Resumes"])

Base.metadata.create_all(bind=engine)

@app.get("/")
def home():
    return {"msg": "🚀 HireWise backend is live!"}

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

    for path, methods in openapi_schema["paths"].items():
        for method in methods.values():
            if not path.startswith("/auth"):
                method["security"] = [{"BearerAuth": []}]

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

@app.get("/health")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    import uvicorn
    uvicorn.run("backend.app:app", host="0.0.0.0", port=port, reload=True)
