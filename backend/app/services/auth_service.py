from datetime import datetime, timedelta
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

from ..config import get_settings
from ..models.user import User
from ..models.profile import Profile

settings = get_settings()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    @staticmethod
    def hash_password(password: str) -> str:
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def create_access_token(user_id: str, expires_delta: Optional[timedelta] = None) -> str:
        to_encode = {"sub": str(user_id), "type": "access"}
        expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.access_token_expire_minutes))
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, settings.jwt_secret, algorithm=settings.jwt_algorithm)

    @staticmethod
    def create_refresh_token(user_id: str) -> str:
        to_encode = {"sub": str(user_id), "type": "refresh"}
        expire = datetime.utcnow() + timedelta(days=settings.refresh_token_expire_days)
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, settings.jwt_secret, algorithm=settings.jwt_algorithm)

    @staticmethod
    def decode_token(token: str) -> Optional[dict]:
        try:
            payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
            return payload
        except JWTError:
            return None

    @staticmethod
    async def get_user_by_email(email: str) -> Optional[User]:
        return await User.find_one(User.email == email)

    @staticmethod
    async def get_user_by_id(user_id: str) -> Optional[User]:
        return await User.find_one(User.id == user_id)

    @staticmethod
    async def create_user(email: str, password: str, full_name: Optional[str] = None) -> User:
        hashed_password = AuthService.hash_password(password)
        user = User(email=email, password_hash=hashed_password)
        await user.insert()
        
        # Create profile
        profile = Profile(id=user.id, email=email, full_name=full_name)
        await profile.insert()
        
        return user

    @staticmethod
    async def authenticate_user(email: str, password: str) -> Optional[User]:
        user = await AuthService.get_user_by_email(email)
        if not user or not AuthService.verify_password(password, user.password_hash):
            return None
        return user
