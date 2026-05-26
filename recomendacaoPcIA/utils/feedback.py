import csv
import os
from datetime import datetime


FEEDBACK_FILE = "feedback_hardware.csv"


def save_feedback(cpu: str, gpu: str, objetivo: str, tipo: str) -> None:
    """Salva o feedback do usuário no CSV, criando o arquivo com cabeçalho se necessário."""
    file_exists = os.path.isfile(FEEDBACK_FILE)

    with open(FEEDBACK_FILE, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(["timestamp", "cpu", "gpu", "objetivo", "feedback"])
        writer.writerow([
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            cpu, gpu, objetivo, tipo
        ])
