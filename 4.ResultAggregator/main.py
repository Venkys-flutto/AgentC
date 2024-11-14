from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import zipfile
import os
from fastapi.responses import FileResponse
import logging

app = FastAPI()

class LLMResponsesRequest(BaseModel):
    llm_responses: List[List[str]]

@app.post("/result")
async def result_aggregate(request: LLMResponsesRequest):
    try:
        # Log the received request
        logging.info(f"Received LLM responses request: {request.llm_responses}")

        # Save the LLM responses to multiple markdown files
        file_paths = []
        for i, response in enumerate(request.llm_responses):

            keytopic = ''.join(c for c in response[0] if c.isalnum() or c in (' ', '_')).replace(' ', '_')
            file_path = f"{keytopic}.md"
            with open(file_path, "w") as f:
                f.write(response[1])
            file_paths.append(file_path)
            logging.info(f"Saved response to file: {file_path}")

        # Create a zip archive containing the markdown files
        zip_file_path = "llm_responses.zip"
        with zipfile.ZipFile(zip_file_path, 'w') as zipf:
            for file_path in file_paths:
                zipf.write(file_path)
                logging.info(f"Added file to zip: {file_path}")
                os.remove(file_path)  # Optionally remove the individual files after adding to zip
                logging.info(f"Removed file after zipping: {file_path}")

        # Return the zip archive as a response
        logging.info(f"Returning zip file: {zip_file_path}")
        return FileResponse(zip_file_path, media_type='application/zip', filename="llm_responses.zip")

    except Exception as e:
        logging.error(f"Error occurred: {e}")
        raise HTTPException(status_code=400, detail=f"Error: {e}")