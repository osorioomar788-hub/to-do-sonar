from selenium.webdriver.common.by import By
from selenium_tests.pages.base_page import BasePage

class TaskFormPage(BasePage):
    """Page Object del formulario para crear y editar tareas."""
    
    # Corregida la indentación de los localizadores
    SCREEN = (
        By.CSS_SELECTOR,
        "[data-testid='task-form-screen'], [aria-label='task-form-screen']",
    )

    TITLE_INPUT = (
        By.CSS_SELECTOR,
        "[data-testid='task-title-input'], [aria-label='task-title-input']",
    )

    DESCRIPTION_INPUT = (
        By.CSS_SELECTOR,
        "[data-testid='task-description-input'], [aria-label='task-description-input']",
    )

    COMPLETED_SWITCH = (
        By.CSS_SELECTOR,
        "[data-testid='task-completed-switch'], [aria-label='task-completed-switch']",
    )

    SAVE_BUTTON = (
        By.CSS_SELECTOR,
        "[data-testid='save-task-button'], [aria-label='save-task-button']",
    )

    ERROR_MESSAGE = (
        By.CSS_SELECTOR,
        "[data-testid='form-error-message'], [aria-label='form-error-message']",
    )

    # Corregida la indentación de los métodos
    def is_loaded(self):
        """Comprueba que el formulario esté visible."""
        return self.is_visible(self.SCREEN, timeout=10)

    def enter_title(self, title):
        """Escribe el título de la tarea."""
        self.type_text(self.TITLE_INPUT, title)

    def enter_description(self, description):
        """Escribe la descripción de la tarea."""
        self.type_text(self.DESCRIPTION_INPUT, description)

    def fill_form(self, title, description=""):
        """Llena los campos principales del formulario."""
        self.enter_title(title)
        if description:
            self.enter_description(description)

    def click_save(self):
        """Presiona el botón para crear o actualizar."""
        self.click(self.SAVE_BUTTON)

    def get_error_message(self):
        """Obtiene el mensaje de validación visible."""
        return self.get_text(self.ERROR_MESSAGE)