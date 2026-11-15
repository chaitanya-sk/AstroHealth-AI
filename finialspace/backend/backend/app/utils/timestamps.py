from datetime import datetime, timezone


def get_utc_now() -> datetime:
    """Return current UTC datetime."""
    return datetime.now(timezone.utc)


def parse_timestamp(ts: datetime | str | None) -> datetime:
    """Safely parse datetime or ISO format string to Python datetime."""
    if ts is None:
        return datetime.utcnow()
    if isinstance(ts, datetime):
        # Convert timezone-aware to naive UTC for consistent SQLite storage if needed
        if ts.tzinfo is not None:
            return ts.astimezone(timezone.utc).replace(tzinfo=None)
        return ts
    try:
        dt = datetime.fromisoformat(str(ts).replace("Z", "+00:00"))
        if dt.tzinfo is not None:
            return dt.astimezone(timezone.utc).replace(tzinfo=None)
        return dt
    except Exception:
        return datetime.utcnow()

