from datetime import timedelta, datetime
from typing import Optional, List
from jose import JWTError
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.user import User, UserRole
from app.auth.jwt_handler import decode_access_token  # single source

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme (leading slash matters for Swagger)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# --------------------
# Password utilities
# --------------------
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


# --------------------
# Current user fetch
# --------------------
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    # Defensive: strip "Bearer " if present
    if token.startswith("Bearer "):
        token = token.split(" ", 1)[1].strip()

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = decode_access_token(token)
        username = payload.get("sub")
        if not username:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise credentials_exception

    # Debug: check what role is fetched
    print("JWT payload:", payload)
    print("Fetched user role:", user.role)

    return user


# --------------------
# Role-based access
# --------------------
def require_role(roles: list[UserRole]):
    def role_checker(current_user: User = Depends(get_current_user)):
        # Normalize role to lowercase string
        user_role = str(current_user.role).lower()
        allowed_roles = [str(r).lower() for r in roles]

        # Debug info
        print("Current user role:", user_role)
        print("Allowed roles:", allowed_roles)

        if user_role not in allowed_roles:
            print("Forbidden access!")
            raise HTTPException(status_code=403, detail="Forbidden")
        return current_user

    return role_checker
