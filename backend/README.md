# Swiss Scramble

## Development

### Setup

Use Python 3.12.x

```
python -m venv venv
source venv/bin/activate
python -m pip install -r requirements.txt
```

```

```

### Running the dev server

```bash
fastapi run main.py
```

### API Documentation

The api documentation can be found at the `/docs` endpoint

### .env file

Required values

```
SECRET_KEY=
TEAM1_HASH=
TEAM2_HASH=
```

### Helpful docs

[FastAPI docs](https://fastapi.tiangolo.com/)
[SQLModel docs](https://sqlmodel.tiangolo.com/)
