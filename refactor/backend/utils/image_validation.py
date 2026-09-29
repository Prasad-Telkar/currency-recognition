"""Validates an uploaded image file before it reaches the model.

This runs BEFORE quality analysis and BEFORE inference — it only checks
things that don't require decoding pixels (type, size, presence), so it's
cheap and rejects garbage requests fast.
"""

ALLOWED_MIME_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/webp", "image/pjpeg"}
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024  # 8MB


class ImageValidationError(Exception):
    def __init__(self, code, message):
        super().__init__(message)
        self.code = code
        self.message = message


def validate_image_file(file_storage):
    """Validates a Flask `request.files['image']` FileStorage object and
    returns the raw image bytes. Raises ImageValidationError on failure."""
    if file_storage is None or file_storage.filename == "":
        raise ImageValidationError("NO_IMAGE", "No image file was provided.")

    filename = (file_storage.filename or "").lower()
    has_valid_ext = any(filename.endswith(ext) for ext in ALLOWED_EXTENSIONS)
    mimetype = (file_storage.mimetype or "").lower()

    if mimetype not in ALLOWED_MIME_TYPES and not has_valid_ext:
        raise ImageValidationError(
            "INVALID_IMAGE_TYPE",
            f"Unsupported file type: {file_storage.mimetype}. Use JPEG, PNG, or WEBP.",
        )

    file_storage.seek(0, 2)  # seek to end
    size = file_storage.tell()
    file_storage.seek(0)  # reset for reading

    if size == 0:
        raise ImageValidationError("EMPTY_FILE", "The uploaded file is empty.")

    if size > MAX_FILE_SIZE_BYTES:
        raise ImageValidationError(
            "FILE_TOO_LARGE",
            f"Image exceeds the {MAX_FILE_SIZE_BYTES // (1024*1024)}MB size limit.",
        )

    return file_storage.read()
