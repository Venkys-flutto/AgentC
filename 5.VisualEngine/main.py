# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# from typing import List, Dict
# import openai

# # Initialize FastAPI
# app = FastAPI()

# # OpenAI API Key setup (replace with your API key)
# openai.api_key = "your_openai_api_key"

# # Request and response models
# class ContentRequest(BaseModel):
#     content: str

# class NodeData(BaseModel):
#     centerNode: Dict[str, str]
#     subNodes: List[Dict[str, str]]

# # Route to process content and extract labels
# @app.post("/api/nodes", response_model=NodeData)
# async def extract_nodes(content_request: ContentRequest):
#     try:
#         content = content_request.content

#         # Query GPT or similar AI model for extracting key labels
#         gpt_prompt = f"""
#         Analyze the following content and extract:
#         1. A central label that represents the core theme.
#         2. At most 8 key topics or concepts related to this central label.
#         Format the output as:
#         Center: [Central Theme]
#         Labels: [Label 1, Label 2, ..., Label 8]

#         Content:
#         {content}
#         """

#         # Call the OpenAI API
#         response = openai.Completion.create(
#             engine="text-davinci-003",
#             prompt=gpt_prompt,
#             max_tokens=200,
#             temperature=0.7
#         )

#         # Parse response from the AI model
#         response_text = response.choices[0].text.strip()

#         # Extract center node and labels
#         lines = response_text.split("\n")
#         center_label = next((line.split(":")[1].strip() for line in lines if "Center" in line), "Python Course")
#         labels = next((line.split(":")[1].strip().split(",") for line in lines if "Labels" in line), [])

#         # Structure the response in the required format
#         response_data = {
#             "centerNode": {"label": center_label},
#             "subNodes": [{"label": label.strip()} for label in labels[:8]],  # Limit to at most 8 labels
#         }

#         return response_data

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error processing content: {str(e)}")

# # Sample route to test the API
# @app.get("/")
# async def root():
#     return {"message": "Welcome to the Node Extraction API!"}

import openai
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from typing import List

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
        # OpenAI API call to analyze content and generate labels
        response = openai.Completion.create(
            model="text-davinci-003",  # You can adjust this based on the model you want to use
            prompt=f"""
                Analyze the following content and extract:
                1. A central label that represents the core theme.
                2. At most 8 key topics or concepts related to this central label.
                Format the output as:
                Center: [Central Theme]
                Labels: [Label 1, Label 2, ..., Label 8]

                Content:
                {content}
                """,
            max_tokens=200,
            n=1,
            stop=None,
            temperature=0.5
        )

        # Parse response
        generated_text = response.choices[0].text.strip()
        lines = generated_text.split("\n")
        
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

