# Manuscript AI Editor

A full-stack web application consisting of:
- **Frontend**: [Vue.js](https://vuejs.org/) application styled with [Vuetify](https://vuetifyjs.com/)
- **Backend**: [Flask](https://flask.palletsprojects.com/) API providing endpoints to the frontend
- Fully containerized using **Docker** and **Docker Compose**

--- 

## Table of Contents

1. [Project Title & Description](#project-title--description)
2. [Features](#features)
3. [Project Structure](#project-structure)
4. [Prerequisites](#prerequisites)
5. [Installation & Usage](#installation--usage)
6. [API Endpoints](#api-endpoints)
7. [Development](#development)
8. [Environment Variables](#environment-variables)

---

## Project Title & Description

The Manuscript AI Editor is a full-stack web application currently being developed in the scope of the Manuscript AI project.
The goal of the project is to build an AI-tool to facilitate the integration, accessibility, and usability of heterogeneous 
cultural heritage data on medieval manuscripts.

The Editor offers four distinct paths to Heritage Professionals/Practitioners to accommodate their varying needs based on 
the quality of their data and their level of digital literacy. Our goal is to test which path works best for different 
types of users, considering their data quality and digital literacy. Additionally, we aim to explore the extent to which 
we can automate the data conversion process based on these parameters. Each path from the Manuscript-AI editor enables 
the creation of Linked Open Data using the Manuscript-AI ontology.

The four paths are: 

**1. Create LOD:** Users can create a knowledge graph from scratch by directly inputting data records into specified fields.
This path allows users to see the correspondence between fields and Manuscript-AI ontological concepts, helping them understand the conceptual coverage of the Manuscript-AI ontology.
 
**2.Manuscript Annotation Desk:** Users can upload their data in various formats, select which concepts correspond to which
fields, and then send to the agent framework the selected and cleaned data for structuring under Manuscript-AI's ontological
expressiveness. The agent framework not only structure the data into LOD using Manuscript-AI ontology but also suggests further
links to external knowledge bases, such as Wikidata. Essentially, in Manuscript Annotation Desk path,  users participate in
cleaning up their data and selecting relevant concepts for Manuscript-AI fields.
 
**3. Select and Convert:** Users can upload their data in different formats, chunk their data (i.e., select specific 
sections related to each manuscript), and send these chunks to the agent framework. The framework first harvests relevant
information from the data chunks for given fields from the Manuscript-AI ontology, sends the data back to users for review
and evaluation of the automated classification and harvesting process, and then sends the data to another subset of the 
agent framework for: A) structuring into LOD, and B) suggesting additional links to external knowledge bases (e.g., Wikidata).
Here, users actively participate in the chunking process of their data.
 
**4.Drop and Classify:** Users can drop their data (up to 100KB at a time) in various formats. The data is sent to the backend,
automatically chunked, and the agent identifies concepts for the Manuscript-AI ontology. Users then evaluate the output 
and send the data back to the agent framework for automated structuring into LOD using the Manuscript-AI ontology, with
further links suggested from Wikidata. Users here only evaluate the outputs from the agent framework and additional functions.  

---

## Features

- **Vue.js Frontend**: Dynamic user interface with Vuetify components.
- **Flask Backend**: Provides essential API endpoints.
- **Dockerized**: Easy to run and deploy using Docker and Docker Compose.
- **Multi-environment support**: Ready for local development and production deployment.

---

## Project Structure

The project is structured as indicated in the graph below.

    .
    ├── backend/ 
    │    ├── blueprints/
    │    │      ├── __init__.py
    │    │      ├── drop_classify.py
    │    │      ├── property_structuring.py
    │    │      └── rdfData.py  
    │    ├── .gitignore
    │    ├── Dockerfile
    │    ├── app.py
    │    ├── sample.env
    │    └── requirements.txt 
    ├── frontend/ 
    │    ├── public/
    │    ├── src/
    │    │     ├── assets/
    │    │     ├── components/  /* the components performing functionalities are here used by the views in the pages/ */
    │    │     ├── layouts/
    │    │     ├── pages/   /* the main views are here */
    │    │     ├── plugins/   /* pluging, such as vuetify are registered here */
    │    │     ├── router/   /* the defined routes in the application */
    │    │     ├── services/   /* the calls to the endpoints are defined here */ 
    │    │     ├── stores/   /* the centralized store for the components */
    │    │     ├── styles/
    │    │     ├── tools/   /* some utitily functions */
    │    │     ├── App.vue
    │    │     └── main.js  
    │    ├── .gitignore
    │    ├── Dockerfile
    │    ├── eslint.config.js
    │    ├── index.html
    │    ├── nginx.conf
    │    ├── package-lock.json
    │    ├── package.json
    │    └── vite.config.mjs   
    ├── .gitignore
    ├── docker-compose.yml
    └── README.md

---
                  
## Prerequisites

Before you can run this project, make sure you have the following installed:

- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/)

---

## Installation & Usage

### 1️⃣ Clone the repository
```bash
git clone https://github.com/ManuscriptAI/Editor.git
cd editor
```

### 2️⃣ Run the application with Docker Compose
```bash
docker-compose build
docker-compose up -d
```

This command will:

- Build both frontend and backend Docker images
- Start the services based on the docker-compose.yml file

### 3️⃣ Access the application
- Frontend: http://localhost:8080
- Backend: http://localhost:5001

---

## API Endpoints

| Method | Endpoint | Description|
|:--------|:----------------|:-----------------------------|
| POST | /api/send_manuscripts | This endpoint handles user-uploaded files structures that data. It also introduces two agents: an Analyzer agent (similar to a data provider) and a Structurer agent (responsible for returning structured JSON).                                                                                                |  
| POST | /api/drop-classify    | This endpoint accepts JSON input and processes raw text (manuscript data) in various formats. It returns structured JSON. Internally, it orchestrates two agents (DataDropAgent and Structurer) and handles the process of splitting large data into smaller “chunks” so the agents can handle them effectively. |
| POST | /api/transform        | This endpoint expects JSON describing manuscripts and returns an RDF graph.                                                                                                                                                                                                                                      |              


## Development

### 1. Run frontend or backend containers separately

frontend
```bash
docker-compose up frontend
```

backend
```bash
docker-compose up backend
```

You can also access the logs from each container by using:
```bash
docker-compose logs frontend
docker-compose logs backend
```

### 2. Alternatively, run the app locally without Docker

#### 2.1 Frontend

#### Prerequisites
- **Node.js** (v18 or later recommended if using npm)

#### Installation

You can install dependencies and run the project using **npm**.

**Install dependencies**:

   ```bash
   npm ci
   ```
   
#### Running the application

**Start the application in development:**

```bash
npm run dev
```

This will start a development server on http://localhost:3000 (or a different port if specified).


---

#### 2.2 Backend

#### Create a Python 3.11 Environment

If you don't have [Miniconda](https://docs.conda.io/en/latest/miniconda.html) or [Anaconda](https://www.anaconda.com/products/distribution) installed, grab one of those first.

Then create your environment:
```bash
conda create -n myapp-env python=3.11
```
#### Activate the Environment
```bash
conda activate myapp-env
```

#### Install dependencies

Make sure you're in the backend folder (where your requirements.txt lives), then run:

 ```bash
pip install -r requirements.txt
```

#### Run the Flask application

Make sure you are in the backend folder, then run:

 ```bash
python app.py
```

---


## Environment Variables

The backend requires an OPENAI key. The `OPENAI_API_KEY` environment variable is used for this purpose.
Create an `.env` file in the backend folder and define the environment variable there. Alternatively, you can rename the
`sample.env` , which has been added for guidance.

---


