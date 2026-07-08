from uuid import uuid4
import pytest
from selenium_tests.pages.task_form_page import TaskFormPage
from selenium_tests.pages.task_list_page import TaskListPage


@pytest.mark.e2e
def test_create_valid_task(driver, base_url):
    """Crea una tarea válida desde la interfaz."""
    # Corregida la indentación de este bloque de test
    unique_title = f"Tarea Selenium {uuid4().hex[:8]}"
    task_list = TaskListPage(driver, timeout=20)
    task_form = TaskFormPage(driver, timeout=10)

    task_list.load(base_url)

    assert task_list.is_loaded(), (
        "No se cargó la pantalla principal"
    )

    task_list.click_new_task()

    assert task_form.is_loaded(), (
        "No se abrió el formulario"
    )

    task_form.fill_form(
        title=unique_title,
        description="Tarea creada mediante Selenium",
    )

    task_form.click_save()

    assert task_list.is_loaded(), (
        "La aplicación no regresó a la lista"
    )

    assert task_list.has_task_title(
        unique_title,
        timeout=10,
    ), "La tarea creada no apareció en la lista"


@pytest.mark.e2e
def test_create_task_with_100_character_title(driver, base_url):
    """Comprueba el límite válido de 100 caracteres."""
    # Corregida la indentación de este bloque de test
    boundary_title = "A" * 100
    task_list = TaskListPage(driver, timeout=20)
    task_form = TaskFormPage(driver, timeout=10)

    task_list.load(base_url)

    assert task_list.is_loaded(), (
        "No se cargó la pantalla principal"
    )

    task_list.click_new_task()

    assert task_form.is_loaded(), (
        "No se abrió el formulario"
    )

    task_form.fill_form(
        title=boundary_title,
        description="Prueba de valor límite válido",
    )

    task_form.click_save()

    assert task_list.is_loaded(), (
        "La aplicación no regresó a la lista"
    )

    assert task_list.has_task_title(
        boundary_title,
        timeout=10,
    ), "No se creó la tarea con un título de 100 caracteres"


@pytest.mark.e2e
@pytest.mark.parametrize(
    "title,expected_message",
    [
        (
            "",
            "El título es obligatorio",
        ),
        (
            " ",
            "El título es obligatorio",
        ),
        (
            "A" * 101,
            "El título no puede tener más de 100 caracteres",
        ),
    ],
    ids=[
        "titulo-vacio",
        "titulo-con-espacios",
        "titulo-mayor-a-100",
    ],
)
def test_invalid_titles_show_validation_error(
    driver,
    base_url,
    title,
    expected_message,
):
    """Valida distintos títulos incorrectos mediante datos."""
    # Corregida la indentación de este bloque de test parametrizado
    task_list = TaskListPage(driver, timeout=20)
    task_form = TaskFormPage(driver, timeout=10)
    task_list.load(base_url)

    assert task_list.is_loaded(), (
        "No se cargó la pantalla principal"
    )

    task_list.click_new_task()

    assert task_form.is_loaded(), (
        "No se abrió el formulario"
    )

    task_form.fill_form(
        title=title,
        description="Prueba de validación data-driven",
    )

    task_form.click_save()

    assert task_form.get_error_message() == expected_message