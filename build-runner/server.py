"""TheShipboard Build Runner — PlatformIO compilation service."""

import os
import json
import shutil
import subprocess
import tempfile
import re
from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "build-runner"})


@app.route("/compile", methods=["POST"])
def compile():
    data = request.get_json()
    board = data.get("board", "esp32dev")
    framework = data.get("framework", "arduino")
    libraries = data.get("libraries", [])
    files = data.get("files", [])

    if not files:
        return jsonify({"success": False, "log": "No files provided", "errors": ["No source files"], "warnings": []})

    workdir = tempfile.mkdtemp(prefix="shipboard_")
    try:
        # Create PlatformIO project structure
        os.makedirs(os.path.join(workdir, "src"), exist_ok=True)
        os.makedirs(os.path.join(workdir, "include"), exist_ok=True)
        os.makedirs(os.path.join(workdir, "lib"), exist_ok=True)

        # Write source files
        has_platformio_ini = False
        for f in files:
            filename = f.get("filename", "")
            content = f.get("content", "")
            filepath = os.path.join(workdir, filename)
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            with open(filepath, "w") as fh:
                fh.write(content)
            if filename == "platformio.ini":
                has_platformio_ini = True

        # Generate platformio.ini if not provided
        if not has_platformio_ini:
            lib_deps = "\n".join(f"    {lib}" for lib in libraries) if libraries else ""
            ini_content = f"""[env:{board}]
platform = auto
board = {board}
framework = {framework}
monitor_speed = 115200
lib_deps =
{lib_deps}
"""
            with open(os.path.join(workdir, "platformio.ini"), "w") as fh:
                fh.write(ini_content)

        # Run PlatformIO build
        result = subprocess.run(
            ["pio", "run"],
            cwd=workdir,
            capture_output=True,
            text=True,
            timeout=120
        )

        log_output = result.stdout + "\n" + result.stderr
        success = result.returncode == 0

        # Parse errors and warnings
        errors = []
        warnings = []
        for line in log_output.split("\n"):
            if ": error:" in line.lower() or "error[" in line.lower():
                errors.append(line.strip())
            elif ": warning:" in line.lower():
                warnings.append(line.strip())

        # Get binary size if success
        binary_size = None
        size_match = re.search(r"RAM:.*?(\d+).*?Flash:.*?(\d+)", log_output)
        if size_match:
            binary_size = int(size_match.group(2))

        return jsonify({
            "success": success,
            "log": log_output[-5000:],  # Last 5000 chars
            "errors": errors[:20],
            "warnings": warnings[:20],
            "binarySize": binary_size
        })

    except subprocess.TimeoutExpired:
        return jsonify({
            "success": False,
            "log": "Build timed out after 120 seconds",
            "errors": ["Build timeout"],
            "warnings": []
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "log": str(e),
            "errors": [str(e)],
            "warnings": []
        })
    finally:
        shutil.rmtree(workdir, ignore_errors=True)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5100))
    app.run(host="0.0.0.0", port=port, debug=False)
