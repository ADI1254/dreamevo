"""
Short-lived presigned GET URLs for R2 (S3-compatible).
Set env vars on Render; if missing, presign is disabled and the app uses public URLs as before.
"""
from __future__ import annotations

import os
import re
import time
from typing import Any, Optional

# Simple in-memory rate limit: IP -> list of timestamps
_rate_buckets: dict[str, list[float]] = {}
_RATE_WINDOW_SEC = 60
_RATE_MAX = 40  # max presign requests per IP per window

WORLDS = frozenset({"journey", "sanctuary", "exploration", "clearing", "viking"})
MOODS = frozenset({"calm", "confident", "curious"})
STEM_PARTS = frozenset({"narration", "ambient", "sfx"})


def _rate_ok(client_ip: str) -> bool:
    now = time.time()
    cutoff = now - _RATE_WINDOW_SEC
    bucket = _rate_buckets.setdefault(client_ip, [])
    while bucket and bucket[0] < cutoff:
        bucket.pop(0)
    if len(bucket) >= _RATE_MAX:
        return False
    bucket.append(now)
    return True


def presign_configured() -> bool:
    return bool(
        os.getenv("R2_ACCESS_KEY_ID")
        and os.getenv("R2_SECRET_ACCESS_KEY")
        and os.getenv("R2_BUCKET_NAME")
        and os.getenv("R2_ACCOUNT_ID")
    )


def _s3_client():
    import boto3  # noqa: PLC0415

    account_id = os.environ["R2_ACCOUNT_ID"].strip()
    access_key = os.environ["R2_ACCESS_KEY_ID"].strip()
    secret_key = os.environ["R2_SECRET_ACCESS_KEY"].strip()
    endpoint = os.getenv("R2_ENDPOINT") or f"https://{account_id}.r2.cloudflarestorage.com"
    return boto3.client(
        "s3",
        endpoint_url=endpoint,
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        region_name="auto",
    )


def _object_key_for_item(item: dict[str, Any]) -> Optional[str]:
    """Map safe symbolic item to R2 object key (under your bucket layout)."""
    prefix = os.getenv("R2_KEY_PREFIX", "").strip().lstrip("/")
    if prefix and not prefix.endswith("/"):
        prefix += "/"

    kind = item.get("kind")
    if kind == "intro":
        key = os.getenv("R2_KEY_INTRO", "intro/intro_video.mp4").strip().lstrip("/")
        return prefix + key if prefix else key

    if kind == "ambient":
        key = os.getenv("R2_KEY_AMBIENT", "audio/ambient.mp3").strip().lstrip("/")
        return prefix + key if prefix else key

    if kind == "stem":
        world = item.get("world", "")
        mood = item.get("mood", "")
        part = item.get("part", "")
        if world not in WORLDS or mood not in MOODS or part not in STEM_PARTS:
            return None
        stem_prefix = os.getenv("R2_STEM_PREFIX", "cinematic/").strip().lstrip("/")
        if stem_prefix and not stem_prefix.endswith("/"):
            stem_prefix += "/"
        ext = os.getenv("R2_STEM_EXT", ".mp3").strip()
        if not ext.startswith("."):
            ext = "." + ext
        fname = f"{world}_{mood}_{part}{ext}"
        return prefix + stem_prefix + fname if prefix else stem_prefix + fname

    return None


def _sign_key(key: str, expires: int) -> str:
    bucket = os.environ["R2_BUCKET_NAME"].strip()
    client = _s3_client()
    return client.generate_presigned_url(
        "get_object",
        Params={"Bucket": bucket, "Key": key},
        ExpiresIn=expires,
    )


def build_presign_response(items: list[dict[str, Any]], client_ip: str) -> dict[str, Any]:
    if not presign_configured():
        return {"error": "presign_not_configured", "presign_enabled": False}

    if not _rate_ok(client_ip):
        return {"error": "rate_limited", "presign_enabled": True}

    expires = int(os.getenv("R2_PRESIGN_EXPIRES", "900"))
    if expires < 60:
        expires = 60
    if expires > 3600:
        expires = 3600

    urls: dict[str, Any] = {"intro": None, "ambient": None, "stems": {}}

    for raw in items:
        if not isinstance(raw, dict):
            continue
        key = _object_key_for_item(raw)
        if not key or not _safe_key(key):
            continue
        kind = raw.get("kind")
        try:
            signed = _sign_key(key, expires)
        except Exception as e:  # noqa: BLE001
            return {"error": "sign_failed", "detail": str(e), "presign_enabled": True}

        if kind == "intro":
            urls["intro"] = signed
        elif kind == "ambient":
            urls["ambient"] = signed
        elif kind == "stem":
            part = raw.get("part")
            if part in STEM_PARTS:
                urls["stems"][part] = signed

    return {
        "presign_enabled": True,
        "expires_in": expires,
        "urls": urls,
    }


_KEY_RE = re.compile(r"^[a-zA-Z0-9][a-zA-Z0-9._\/\-]{0,400}$")


def _safe_key(key: str) -> bool:
    if ".." in key or key.startswith("/"):
        return False
    return bool(_KEY_RE.match(key))
