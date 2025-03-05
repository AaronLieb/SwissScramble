FROM python:3.13-alpine
WORKDIR /backend
COPY requirements.txt /backend/
RUN pip install -r requirements.txt
RUN apk add --no-cache sqlite
COPY . /backend
EXPOSE 8000
CMD ["fastapi", "run", "main.py"]
