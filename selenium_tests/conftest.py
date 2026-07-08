import os
import pytest
import requests
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

APP_BASE_URL = os.getenv(
    "APP_BASE_URL",
    "http://localhost:8081",
)
API_BASE_URL = os.getenv(
    "API_BASE_URL",
    "http://localhost:3000",
)

@pytest.fixture(scope="session")
def base_url():
    """Devuelve la dirección de Expo Web."""
    return APP_BASE_URL

@pytest.fixture(autouse=True)
def clean_test_tasks():
    """Elimina tareas creadas por Selenium antes de cada prueba."""
    try:
        response = requests.get(
            f"{API_BASE_URL}/todos",
            timeout=5,
        )
        response.raise_for_status()
        # Corregida la indentación interna del bloque try
        tasks = response.json()

        for task in tasks:
            title = str(task.get("title", ""))

            is_selenium_task = title.startswith("Tarea Selenium")

            is_boundary_task = (
                len(title) == 100
                and set(title) == {"A"}
            )

            if is_selenium_task or is_boundary_task:
                delete_response = requests.delete(
                    f"{API_BASE_URL}/todos/{task['id']}",
                    timeout=5,
                )
                delete_response.raise_for_status()

    except requests.RequestException as error:
        # Corregida la indentación interna del bloque except
        pytest.fail(
            "No fue posible conectar con la API local "
            f"en {API_BASE_URL}. Detalle: {error}"
        )

    yield  # El yield debe ir al mismo nivel que inicia el bloque try/except

@pytest.fixture
def driver():
    """Abre y cierra Chrome para cada prueba."""
    options = Options()
    options.add_argument("--window-size=1440,1000")
    options.add_argument("--disable-notifications")

    # Corregida la indentación interna de la condición HEADLESS
    if os.getenv("HEADLESS", "0") == "1":
        options.add_argument("--headless=new")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--no-sandbox")

    browser = webdriver.Chrome(options=options)

    browser.implicitly_wait(0)
    browser.set_page_load_timeout(30)

    try:
        yield browser
    finally:
        browser.quit()