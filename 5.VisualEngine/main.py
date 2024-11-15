from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import requests
import json

app = FastAPI()

class GraphPrompt(BaseModel):
    topic: str

@app.post("/graph")
async def generate_graph(prompt: GraphPrompt):
    try:
        # Define the template
        prompt_final  =  f"Enhance this {prompt.topic} mermaid graph with a clean, modern, and vibrant design. Maintain the original layout, labels, and connections, but add smooth gradients, rounded edges, and subtle shadows for depth. Use a professional color palette with blues, teals, and soft highlights to make the data visually engaging and easy to read. Ensure all lines and text remain clear and sharp, with no alterations to the actual data or structure. Remember to use correct syntex for mermaid, no spaces after commas, etc, make it colorful and vibrant, but keep the data clear and easy to read, use a professional color palette with blues, teals, and soft highlights to make the data visually engaging and easy to read. Ensure all lines and text remain clear and sharp, with no alterations to the actual data or structure.
        
        Give just the graph code, nothing else."

        
        # Prepare the payload
        payload = {"prompt": prompt_final}
        
        # Send the request to the LLM endpoint
        response = requests.post("http://localhost:5700/generate/", json=payload)
        response.raise_for_status()
        
        # Get the graph code from the response
        graph_code = response.json().get("response")
        
        return {"graph_code": graph_code}
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Request error: {str(e)}")
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"JSON decode error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)