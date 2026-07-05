"""Authentication routes."""
from fastapi import APIRouter, HTTPException
from app.models.user import User
from app.models.teacher import Teacher
from app.schemas.user import UserLogin, Token, UserResponse, ForgotPasswordRequest, VerifyOTPRequest, ResetPasswordRequest
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.email_service import create_otp_record, verify_otp, send_otp_email

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    """Login with email, password, and role."""
    user = await User.find_one(User.email == credentials.email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if user.role != credentials.role:
        raise HTTPException(status_code=401, detail="Invalid role for this account")

    if not verify_password(credentials.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if user.role == "teacher":
        teacher = await Teacher.find_one(Teacher.user_id == user.id)
        if not teacher:
            raise HTTPException(status_code=401, detail="Teacher profile not found")

    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email, "role": user.role}
    )

    user_response = UserResponse(
        id=str(user.id),
        name=user.name,
        email=user.email,
        role=user.role,
        created_at=user.created_at,
    )

    return Token(access_token=access_token, user=user_response)


@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest):
    """Send OTP to email for password reset."""
    user = await User.find_one(User.email == data.email)
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")

    otp = await create_otp_record(data.email, "password_reset")
    await send_otp_email(data.email, otp)

    return {"message": "OTP sent to your email", "email": data.email}


@router.post("/verify-otp")
async def verify_otp_endpoint(data: VerifyOTPRequest):
    """Verify OTP for password reset."""
    if await verify_otp(data.email, data.otp):
        return {"message": "OTP verified successfully", "verified": True}
    raise HTTPException(status_code=400, detail="Invalid or expired OTP")


@router.post("/reset-password")
async def reset_password(data: ResetPasswordRequest):
    """Reset password with OTP verification."""
    if not await verify_otp(data.email, data.otp):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    user = await User.find_one(User.email == data.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password = get_password_hash(data.new_password)
    await user.save()

    return {"message": "Password reset successfully"}
