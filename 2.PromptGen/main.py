from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")

# Initialize FastAPI app
app = FastAPI()

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    # allow_origins=["http://62.72.30.10:5500", "http://62.72.30.10:3000", "http://62.72.30.10:3000"],
    allow_origins = ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define Pydantic models
class ParameterItem(BaseModel):
    id: str
    value: str

# Updated Parameters model
class Parameters(BaseModel):
    Profile_Parameters: List[ParameterItem]
    Domain_Parameters: List[ParameterItem]
    Objective_Parameters: List[ParameterItem]

# Define the main PromptRequest class with the structured Parameters
class PromptRequest(BaseModel):
    model: str
    prompt: str
    parameters: Parameters
# Function to create a structured prompt for LangChain
def create_prompt(prompt: str, parameters: Parameters) -> str:
    profile_values = ", ".join([param.value for param in parameters.Profile_Parameters])
    domain_values = ", ".join([param.value for param in parameters.Domain_Parameters])
    objective_values = ", ".join([param.value for param in parameters.Objective_Parameters])

    # Structured prompt
    structured_prompt = (
        f"{prompt}\n\n"
        "Consider the following information about the learner:\n"
        f"- **Profile**: {profile_values}\n"
        f"- **Domain Knowledge**: {domain_values}\n"
        f"- **Learning Objectives**: {objective_values}\n\n"
        "Using this information, generate a tailored response or recommendation that addresses the learner's needs, "
        "providing insights or resources relevant to the subject they want to learn."
    )

    return structured_prompt

@app.post("/promptgen")
async def prompt_gen(request: PromptRequest):
    try:
        # Generate a structured prompt from the provided parameters
        structured_prompt = create_prompt(request.prompt, request.parameters)

        # Initialize the LangChain model
        model = ChatOpenAI(api_key="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", temperature=0.7, model="chatgpt-4o-latest",max_tokens=16000)

        # Create a prompt template
        prompt_template = ChatPromptTemplate.from_template("{prompt}")

        # Combine the prompt template and model into a chain
        chain = prompt_template | model

        # Stream response from the model
        output = ""
        try:
            for s in chain.stream({"prompt": structured_prompt}):
                print(s.content, end="")
                output += s.content
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error: {e}")

        # Return the response
        return {"response": output}

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error: {e}")
