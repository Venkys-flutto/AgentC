import openai
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from typing import List
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

# Set up OpenAI API key (ensure you've set up the OPENAI_API_KEY environment variable)
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

class ContentRequest(BaseModel):
    content: str

class NodeResponse(BaseModel):
    centerNode: dict
    subNodes: List[dict]

# Function to call OpenAI API for extracting important labels
def get_labels_from_content(content: str):
    try:
         # Extract the string prompt from the request
        prompt_text = f"""
                Analyze the following content and extract:
                1. A central label that represents the core theme.
                2. At most 8 key topics or concepts related to this central label.
                Format the output as:
                Center: [Central Theme]
                Labels: [Label 1, Label 2, ..., Label 8]

                Content:
                {content}
                """

        # Initialize the OpenAI model with the specified parameters
        model = ChatOpenAI(temperature=0.05, max_tokens=16000, model="chatgpt-4o-latest")

        # Instead of using a template, we pass the prompt directly to the model
        prompt = ChatPromptTemplate.from_template("{prompt}")  # Direct prompt structure
        chain = prompt | model

        # Generate the full response from the model (no streaming)
        output = ""

        for s in chain.stream({"prompt": prompt_text}):
            print(s.content, end="")
            output += s.content
        print()
        lines = output.split("\n")
        
        
        # Extract center node (first label) and subnodes (remaining labels)
        center_node = lines[0].strip()
        sub_nodes = [line.strip() for line in lines[1:] if line.strip()]
        
        # Limit sub-nodes to a maximum of 8
        sub_nodes = sub_nodes[:8]

        return {"centerNode": {"label": center_node}, "subNodes": [{"label": node} for node in sub_nodes]}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error while processing the content: {str(e)}")


# Endpoint to fetch data from OpenAI and extract labels
@app.post("/api/nodes", response_model=NodeResponse)
async def get_nodes(request: ContentRequest):
    content = request.content
    return get_labels_from_content(content)