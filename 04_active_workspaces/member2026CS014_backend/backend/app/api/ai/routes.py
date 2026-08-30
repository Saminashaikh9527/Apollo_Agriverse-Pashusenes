from pathlib import Path
from uuid import uuid4

from fastapi import (
    APIRouter,
    File,
    HTTPException,
    UploadFile,
)

from app.ai.pipeline import (
    run_ai_pipeline,
)


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/ai",
)


# ============================================================
# CONFIGURATION
# ============================================================

UPLOAD_DIR = Path(
    "uploads/ai"
)

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


MAX_FILE_SIZE = (
    10 * 1024 * 1024
)


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
# AI IMAGE UPLOAD + ANALYSIS
# ============================================================

@router.post(
    "/upload",
    summary="Upload and Analyze Animal Image",
    description=(
        "Upload an animal image and run "
        "the AI analysis pipeline."
    ),
)
async def upload_ai_image(
    file: UploadFile = File(
        ...,
        description=(
            "Animal image for AI analysis"
        ),
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
    # ORIGINAL FILE NAME
    # ========================================================

    original_name = Path(
        file.filename
    ).name

    # ========================================================
    # EXTENSION
    # ========================================================

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
    # MIME TYPE
    # ========================================================

    if (
        file.content_type
        not in ALLOWED_CONTENT_TYPES
    ):

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
    # FILE SIZE
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
    # SAFE FILE NAME
    # ========================================================

    generated_name = (
        f"{uuid4().hex}{extension}"
    )

    save_path = (
        UPLOAD_DIR
        / generated_name
    )

    # ========================================================
    # SAVE IMAGE
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
    # RUN AI PIPELINE
    # ========================================================

    try:

        analysis = run_ai_pipeline(
            str(save_path)
        )

    except Exception as exc:

        return {

            "success": False,

            "message": (
                "Image uploaded, "
                "but AI analysis failed."
            ),

            "filename":
                original_name,

            "stored_filename":
                generated_name,

            "content_type":
                file.content_type,

            "file_size":
                file_size,

            "path":
                str(save_path),

            "ai_status":
                "analysis_failed",

            "error":
                str(exc),

        }

    # ========================================================
    # RESPONSE
    # ========================================================

    return {

        "success": True,

        "message": (
            "Animal image uploaded "
            "and analyzed successfully."
        ),

        "filename":
            original_name,

        "stored_filename":
            generated_name,

        "content_type":
            file.content_type,

        "file_size":
            file_size,

        "path":
            str(save_path),

        "ai_status":
            "analyzed",

        "analysis":
            analysis,

    }