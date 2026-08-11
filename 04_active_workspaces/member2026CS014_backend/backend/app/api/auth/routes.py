from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)

from app.models.user import User

from app.schemas.user import (
    UserCreate,
    LoginRequest,
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


# ============================================================
# REGISTER
# ============================================================

@router.post("/register")
def register(
    user_data: UserCreate,
    db: Session = Depends(get_db),
):

    # --------------------------------------------------------
    # Check email
    # --------------------------------------------------------

    existing_user = (
        db.query(User)
        .filter(
            User.email == user_data.email
        )
        .first()
    )

    if existing_user:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # --------------------------------------------------------
    # Create user
    # --------------------------------------------------------

    new_user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        phone=user_data.phone,
        password_hash=hash_password(
            user_data.password
        ),
        role="farmer",
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "user_id": new_user.user_id,
    }


# ============================================================
# LOGIN
# ============================================================

@router.post("/login")
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db),
):

    # --------------------------------------------------------
    # Find user
    # --------------------------------------------------------

    user = (
        db.query(User)
        .filter(
            User.email == login_data.email
        )
        .first()
    )

    if user is None:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # --------------------------------------------------------
    # Verify password
    # --------------------------------------------------------

    if not verify_password(
        login_data.password,
        user.password_hash,
    ):

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # --------------------------------------------------------
    # CREATE JWT
    #
    # IMPORTANT:
    # Pass user_id and role separately.
    # --------------------------------------------------------

    access_token = create_access_token(
        user_id=user.user_id,
        role=user.role,
    )

    # --------------------------------------------------------
    # Return token
    # --------------------------------------------------------

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }
