from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

from ..database.connection import get_db
from ..models.user import User
from ..schemas.user import UserCreate, TokenResponse
from ..auth.hashing import Hash
from ..auth.jwt_handler import create_access_token

router = APIRouter(tags=["Auth"])  # 👈 no prefix here

@router.post("/register", response_model=TokenResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already exists.")

    new_user = User(
        username=user.username,
        email=user.email,
        phone=user.phone,
        role=user.role,
        hashed_password=Hash.bcrypt(user.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": new_user.username, "role": new_user.role.value})
    return TokenResponse(access_token=token, token_type="bearer")

@router.post("/login", response_model=TokenResponse)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form.username).first()
    if not user or not Hash.verify(form.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.username, "role": user.role.value})
    return TokenResponse(access_token=token, token_type="bearer")
