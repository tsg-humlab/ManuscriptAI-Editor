# Manuscript Data Analyzer

This project is an Flask-based web application that analyzes and structures data from uploaded files about medieval manuscripts. 
It relies on AI agents to process, analyze, and structure data into JSON format.

---



## Features

- **File Type Support**: Supports multiple file types, including:
  - CSV
  - JSON
  - Excel (`.xls` and `.xlsx`)
  - XML
- **AI-Driven Analysis**: Uses AI agents to analyze manuscript data and generate structured output.
- **Parallel Processing**: Splits large datasets into chunks and processes them in parallel for efficiency.
- **User-Friendly Interface**: Allows users to upload files via a web interface and view results in structured JSON format.

---




The project directory is organized as follows:
```bash

├── app.py             # Main application code
├── templates/
│   ├── upload.html    # HTML template for file upload
│   ├── results.html   # HTML template for displaying results
├── static/            # (Optional) Static files like CSS/JS
├── .env               # Environment variables (e.g., API key)
├── requirements.txt   # Python dependencies
├── README.md          # Project documentation

```



## Requirements

### Python Packages
The following Python packages are required:

```plaintext
Flask==2.3.2
pandas==2.1.0
autogen  # Replace with installable version/source if this is a custom library
python-dotenv==1.0.0
openpyxl  # For Excel file processing
lxml      # For XML file processing
gunicorn  # Optional, for production deployment
```


### Installation
- Clone the repository:
`git clone <repository-url>`
`cd <repository-folder>`

- Create a virtual environment and activate it:
`python3 -m venv env`
`source env/bin/activate`  # On Windows: env\Scripts\activate

- Install the required packages:
`pip install -r requirements.txt`


- Setup `.env` File

- Create a `.env` file in the root directory of the project and add your OpenAI API key:
`OPENAI_API_KEY=<your_openai_api_key>`
Replace `your-openai-api-key-here` with your actual OpenAI API key. Ensure this file is not shared or committed to version control.


### USAGE
#### Run the Application
- To start the Flask application, use the following command:
`python app.py`

The application will run on http://127.0.0.1:5000/ by default.

#### Upload Files
Open your browser and navigate to http://127.0.0.1:5000/.
Upload a file of one of the supported types (.csv, .json, .xls, .xlsx, .xml).
Click "Submit" to process the file

#### View Results
After processing, the structured JSON output will be displayed.
Use the "Upload Another File" link to process additional files.

#### summary How It Works
- File Upload 

Users upload a file via the web interface.
Supported formats: CSV, JSON, Excel, XML.
- File Parsing : 

The file type is detected based on its extension.
The appropriate library (e.g., pandas.read_csv, pandas.read_json) is used to parse the file into a pandas DataFrame.
- Data Processing : 

Large files are split into chunks of 50 rows for efficient processing.
Each chunk is analyzed using an AI-powered Analyzer Agent.
The results are passed to a Structurer Agent to format the data into JSON.
- Results Display : 

The final structured JSON data is displayed on the results page.