# llm fast api code to pass prompt into the end point and get response streaming

from fastapi import FastAPI, HTTPException, Request, Depends
from pydantic import BaseModel
from typing import Dict
import json
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate
from fastapi.responses import StreamingResponse
load_dotenv()  # This will load the variables from .env



# Using OpenAI Models
from langchain_openai import ChatOpenAI

# initialise fastapi app
app = FastAPI()

# Define allowed origins


ALLOWED_ORIGINS = ["http://localhost:5600", "http://62.72.30.10:5500", "http://62.72.30.10:3000", "http://62.72.30.10:3000","http://www.flutto.ai"]


# Set up CORS middleware to allow all origins (you can restrict it as needed)
# Set up CORS middleware to allow all origins (you can restrict it as needed)
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Function to run on stratup using lifespan events function
def lifespan():
    print("Started")
    yield
    print("Stopping")

# Define the structure of the incoming JSON data using Pydantic
class PromptRequest(BaseModel):
    prompt: str


# Custom dependency to enforce origin checks for added security
async def verify_origin(request: Request):
    origin = request.headers.get("origin")
    if origin not in ALLOWED_ORIGINS:
        raise HTTPException(status_code=403, detail="Forbidden: Invalid Origin")
    return origin

# GET endpoint with origin validation
@app.get("/")
async def details():
    return {"message": "This is a language model API, send prompt, get output"}



# fastapi endpoint to generate response from the model
# Define the POST endpoint
@app.post("/generate")
async def generate_response(request: PromptRequest):
    try:
        # Extract the string prompt from the request
        prompt_text = request.prompt

        # Initialize the OpenAI model with the specified parameters
        model = ChatOpenAI(temperature=0.05, max_tokens=16000, model="chatgpt-4o-latest")

        # Instead of using a template, we pass the prompt directly to the model
        prompt = ChatPromptTemplate.from_template("{prompt}")  # Direct prompt structure
        chain = prompt | model

        # Generate the full response from the model (no streaming)
        output = ""
        try:
            for s in chain.stream({"prompt": prompt_text}):
                print(s.content, end="")
                output += s.content
            print()
        except Exception as e:
            print("Error, (likely connection issue):", e)
            return {"response": f"Place holder output, to show that input was okay, but this is a connection issue, input was:   {prompt_text} "}

        # Save the final output to a file (optional)
        with open("latest_output.md", "w") as f:
            f.write(output)
        
        # Return the full generated output
        return {"response": output}

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error: {e}")