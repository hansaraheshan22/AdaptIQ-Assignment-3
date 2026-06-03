import sys
from pathlib import Path

# Add the backend directory to the Python path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from main import app  # noqa: E402, F401