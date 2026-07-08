import pytest
from selenium_tests.pages.task_form_page import TaskFormPage
from selenium_tests.pages.task_list_page import TaskListPage

@pytest.mark.e2e
def test_open_new_task_form(driver, base_url):
    """Comprueba la navegación de la lista al formulario."""
    # Corregida la indentación de todo el cuerpo del test
    task_list = TaskListPage(driver, timeout=20)
    task_form = TaskFormPage(driver, timeout=10)
    
    task_list.load(base_url)

    assert task_list.is_loaded(), (
        "No se cargó la pantalla principal de tareas"
    )

    task_list.click_new_task()

    assert task_form.is_loaded(), (
        "No se abrió el formulario para crear una tarea"
    )