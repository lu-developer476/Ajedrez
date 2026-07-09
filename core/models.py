"""Database-free application helpers.

Gameplay, rankings, rooms and lightweight accounts are intentionally stored in
memory from ``core.views`` so the app can boot without provisioning a database.

The historical migrations in this app still import callables from this module
when Django builds the migration graph. Keep those migration-facing helpers here
even though the runtime no longer uses database models.
"""

import random
import string


def default_room_code(length=8):
    """Return a short random room code for historical migrations."""
    alphabet = string.ascii_uppercase + string.digits
    return "".join(random.choices(alphabet, k=length))
