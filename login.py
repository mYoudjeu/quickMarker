from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import uvicorn

app = FastAPI()

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017")
db = client["mydatabase"]
login_collection = db["login"]

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    # allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post('/api/login')
async def login(credentials: dict):
    username = credentials.get('username')
    password = credentials.get('password')

    user = login_collection.find_one({'name': username, 'password': password})
    if user is None:
        raise HTTPException(status_code=401, detail='Invalid username or password')
    
    return {'message': 'Login successful'}

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
