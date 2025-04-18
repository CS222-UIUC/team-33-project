#!/usr/bin/env python3
import serial, time, sys, os

PORT = "/dev/cu.usbmodem2101"  # your port
BAUD = 9600

# open once; we’ll reopen for each write
try:
    ser = serial.Serial(PORT, BAUD, timeout=1)
except serial.SerialException as e:
    sys.exit(f"Couldn’t open {PORT}: {e}")

time.sleep(2)  # let the Arduino reset

try:
    while True:
        line = ser.readline().decode('utf-8', 'ignore').strip()
        if not line:
            continue

        print(line)  # echo to console

        # reopen in 'w' mode → truncates file
        with open("readings.txt", "w") as outfile:
            outfile.write(line + "\n")
            outfile.flush()
            os.fsync(outfile.fileno())

except KeyboardInterrupt:
    print("\nStopped by user.")
finally:
    ser.close()
