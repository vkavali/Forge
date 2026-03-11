FROM python:3.11-slim

# Install PlatformIO
RUN pip install --no-cache-dir platformio flask

# Pre-install common platforms and frameworks
RUN pio pkg install -g -p "espressif32" && \
    pio pkg install -g -p "atmelavr" && \
    pio pkg install -g -p "ststm32" && \
    pio pkg install -g -p "raspberrypi" || true

WORKDIR /app
COPY server.py .

EXPOSE 5100

CMD ["python", "server.py"]
