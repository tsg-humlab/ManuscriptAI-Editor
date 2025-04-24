# backend/Dockerfile
FROM python:3.11

# set working dir
WORKDIR /app

# Copy reqs and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application files
COPY . .

# expose port and run the application
EXPOSE 5001
CMD ["python","app.py"]