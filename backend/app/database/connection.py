from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Fetch the PostgreSQL URI from the .env file
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# Create the PostgreSQL engine
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declare the base class
Base = declarative_base()

# Dependency: Provide a DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
