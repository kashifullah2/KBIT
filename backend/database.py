import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# Use the environment variable or fallback for local dev (if env not set)
# Ideally, .env should be populated with: DB_URL="postgresql://kashif:1234@localhost:5432/user_db"
SQLALCHEMY_DATABASE_URL = os.getenv("DB_URL", "postgresql://kashif:1234@localhost:5432/user_db")

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
