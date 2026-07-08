import pytest
from selenium.webdriver.common.by import By
from selenium_tests.pages.base_page import BasePage

TASK_LIST_SCREEN = (
    By.CSS_SELECTOR,
    "[data-testid='task-list-screen'], [aria-label='task-list-screen']",
)

NEW_TASK_BUTTON = (
    By.CSS_SELECTOR,
    "[data-testid='new-task-button'], [aria-label='new-task-button']",
)

@pytest.mark.e2e
def test_application_opens_task_list(driver, base_url):
    """Comprueba que abre la pantalla principal de tareas."""
    page = BasePage(driver, timeout=20)
    page.open(base_url)

    # Corregida la indentación de los asserts
    assert page.is_visible(
        TASK_LIST_SCREEN,
        timeout=20,
    ), "No apareció la pantalla de lista de tareas"

    assert page.is_visible(
        NEW_TASK_BUTTON,
        timeout=10,
    ), "No apareció el botón Nueva tarea"