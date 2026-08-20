from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, File, HTTPException, UploadFile


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/ai",
)


# ============================================================
# CONFIGURATION
# ============================================================

UPLOAD_DIR = Path("uploads/ai")

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


MAX_FILE_SIZE = 10 * 1024 * 1024
# 10 MB


ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
}


ALLOWED_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
}


# ============================================================
# AI IMAGE UPLOAD
# ============================================================

@router.post(
    "/upload",
    summary="Upload AI Image",
    description=(
        "Upload an animal image for future AI analysis.\n\n"
        "Current phase:\n"
        "- validates image type\n"
        "- validates file size\n"
        "- stores image locally\n"
        "- returns upload metadata\n\n"
        "Future phase:\n"
        "- YOLO detection\n"
        "- CNN classification\n"
        "- AI prediction storage"
    ),
)
async def upload_ai_image(
    file: UploadFile = File(
        ...,
        description="Animal image for AI analysis",
    ),
):

    # ========================================================
    # VALIDATE FILE NAME
    # ========================================================

    if not file.filename:

        raise HTTPException(
            status_code=400,
            detail="No file name provided.",
        )


    # ========================================================
    # VALIDATE EXTENSION
    # ========================================================

    original_name = Path(
        file.filename
    ).name

    extension = Path(
        original_name
    ).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:

        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid image extension. "
                "Allowed: JPG, JPEG, PNG, WEBP."
            ),
        )


    # ========================================================
    # VALIDATE MIME TYPE
    # ========================================================

    if file.content_type not in ALLOWED_CONTENT_TYPES:

        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid image type. "
                "Allowed: JPEG, PNG, WEBP."
            ),
        )


    # ========================================================
    # READ FILE
    # ========================================================

    contents = await file.read()


    # ========================================================
    # VALIDATE SIZE
    # ========================================================

    file_size = len(contents)

    if file_size == 0:

        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty.",
        )


    if file_size > MAX_FILE_SIZE:

        raise HTTPException(
            status_code=413,
            detail=(
                "File too large. "
                "Maximum allowed size is 10 MB."
            ),
        )


    # ========================================================
    # GENERATE SAFE FILE NAME
    # ========================================================

    generated_name = (
        f"{uuid4().hex}{extension}"
    )

    save_path = (
        UPLOAD_DIR / generated_name
    )


    # ========================================================
    # SAVE FILE
    # ========================================================

    try:

        with open(
            save_path,
            "wb",
        ) as output_file:

            output_file.write(
                contents
            )

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to save uploaded image."
            ),
        ) from exc


    # ========================================================
    # RESPONSE
    # ========================================================

    return {

        "success": True,

        "message": (
            "Animal image uploaded successfully."
        ),

        "filename": original_name,

        "stored_filename": generated_name,

        "content_type": file.content_type,

        "file_size": file_size,

        "path": str(save_path),

        "ai_status": "uploaded",

        "analysis": {

            "yolo_detection": "pending",

            "cnn_classification": "pending",

            "prediction_storage": "pending",

        },

    }