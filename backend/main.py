from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="The Aggie Map API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"ok": True}


@app.get("/api/suggested")
def suggested():
    return [
        {
            "id": "evans-2f",
            "name": "Evans Library 2F",
            "distanceMeters": 420,
            "busyScore": 22,
            "status": "Quiet",
            "tags": ["Solo", "Outlets", "Sunlight"],
            "imageUrl": "/og-image.png",
        },
        {
            "id": "zach-atrium",
            "name": "ZACH Atrium",
            "distanceMeters": 760,
            "busyScore": 58,
            "status": "Moderate",
            "tags": ["Group", "Open seating"],
            "imageUrl": "/og-image.png",
        },
        {
            "id": "sbisa",
            "name": "Sbisa Dining",
            "distanceMeters": 300,
            "busyScore": 34,
            "status": "Quiet",
            "tags": ["Food", "Short line"],
            "imageUrl": "/og-image.png",
        },
    ]
