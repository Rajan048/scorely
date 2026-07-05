"""Email service for OTP and notifications."""
import random
import string
from datetime import datetime, timedelta

from ..config import get_settings
from ..models.user import OTPVerification

settings = get_settings()


def generate_otp(length: int = 6) -> str:
    """Generate random OTP."""
    return "".join(random.choices(string.digits, k=length))


async def send_otp_email(email: str, otp: str) -> bool:
    """Send OTP via email. In production, use actual SMTP."""
    if settings.SMTP_USER and settings.SMTP_PASSWORD:
        try:
            import aiosmtplib
            from email.mime.text import MIMEText
            from email.mime.multipart import MIMEMultipart

            msg = MIMEMultipart()
            msg["From"] = settings.EMAIL_FROM
            msg["To"] = email
            msg["Subject"] = "Password Reset OTP - AI Answer Sheet Evaluation"

            body = f"""
            Your OTP for password reset is: {otp}
            This OTP will expire in {settings.OTP_EXPIRE_MINUTES} minutes.
            Do not share this OTP with anyone.
            """
            msg.attach(MIMEText(body, "plain"))

            await aiosmtplib.send(
                msg,
                hostname=settings.SMTP_HOST,
                port=settings.SMTP_PORT,
                username=settings.SMTP_USER,
                password=settings.SMTP_PASSWORD,
                start_tls=True,
            )
            return True
        except Exception as e:
            print(f"Email send error: {e}")
            return False
    else:
        print(f"[DEV] OTP for {email}: {otp}")
        return True


async def create_otp_record(email: str, purpose: str = "password_reset") -> str:
    """Create OTP record and return OTP."""
    otp = generate_otp(settings.OTP_LENGTH)
    expires_at = datetime.utcnow() + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)

    otp_record = OTPVerification(
        email=email,
        otp=otp,
        purpose=purpose,
        expires_at=expires_at,
    )
    await otp_record.insert()
    return otp


async def verify_otp(email: str, otp: str) -> bool:
    """Verify OTP and mark as used."""
    record = await OTPVerification.find_one(
        OTPVerification.email == email,
        OTPVerification.otp == otp,
        OTPVerification.used == 0,
    )

    if not record:
        return False
    if record.expires_at < datetime.utcnow():
        return False

    record.used = 1
    await record.save()
    return True
