from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import json
from fastapi.middleware.cors import CORSMiddleware
from typing import List

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # replace with the frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define Pydantic model for the request body

# Updated Parameters model
class ParameterItem(BaseModel):
    id: str
    value: str

class Parameters(BaseModel):
    Profile_Parameters: List[ParameterItem]
    Domain_Parameters: List[ParameterItem]
    Objective_Parameters: List[ParameterItem]

class UserRequest(BaseModel):
    prompt: str
    parameters: Parameters

@app.post("/datacollector/")
async def send_user_prompt_and_parameters(request: UserRequest):
    # Prepare payload from the request body
    payload = {
        "model": "mistral",
        "prompt": request.prompt,
        "parameters": request.parameters.dict(),
    }
    
    try:
        # Send payload to the PromptGen service
        response = requests.post("http://promptgen:5600/promptgen", json=payload,)
        response.raise_for_status()  # Raises an error for 4xx and 5xx responses

        # Capture the response from PromptGen
        # Extract the response from the JSON object
        prompt = response.json().get("response")

        # Call the LLMEngine service with the generated prompt
        response = requests.post("http://llmengine:5700/generate", json={"prompt": prompt})
        
         # Generate graph with output
        graph_code = requests.post("http://visualengine:5900/api/nodes", json={"content": response.text})
        return {"response": [response.json(), graph_code.json()]}
        
    except requests.exceptions.HTTPError as e:
        print(f"HTTPError: {e.response.status_code} - {e.response.text}")
        raise HTTPException(status_code=e.response.status_code, detail=f"Failed to call PromptGen service: {e.response.text}")
    except requests.exceptions.RequestException as e:
        print(f"RequestException: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Request exception: {str(e)}")
    except json.JSONDecodeError as e:
        # Handle JSON decode errors
        raw_response = response.text if response else "No response"
        print(f"JSONDecodeError: {str(e)} - Raw response: {raw_response}")
        raise HTTPException(status_code=500, detail=f"JSON decode error: {str(e)} - Raw response: {raw_response}")

@app.get("/")
async def say_hi():
    return {"message": "Hi"}
