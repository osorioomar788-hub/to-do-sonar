from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium_tests.pages.base_page import BasePage

class TaskListPage(BasePage):
    """Page Object de la pantalla principal de tareas."""
    
    # Corregida la indentación de los localizadores
    SCREEN = (
        By.CSS_SELECTOR,
        "[data-testid='task-list-screen'], [aria-label='task-list-screen']",
    )

    NEW_TASK_BUTTON = (
        By.CSS_SELECTOR,
        "[data-testid='new-task-button'], [aria-label='new-task-button']",
    )

    EMPTY_MESSAGE = (
        By.CSS_SELECTOR,
        "[data-testid='empty-task-message'], [aria-label='empty-task-message']",
    )

    TASK_CARDS = (
        By.CSS_SELECTOR,
        "[data-testid^='task-card-']",
    )

    TASK_TITLES = (
        By.CSS_SELECTOR,
        "[data-testid^='task-title-']",
    )

    # Corregida la indentación de los métodos
    def load(self, base_url):
        """Abre directamente la aplicación."""
        self.open(base_url)

    def is_loaded(self):
        """Comprueba que la pantalla principal esté visible."""
        return self.is_visible(self.SCREEN, timeout=20)

    def click_new_task(self):
        """Abre el formulario para crear una tarea."""
        self.click(self.NEW_TASK_BUTTON)

    def empty_message_is_visible(self):
        """Comprueba si aparece el mensaje de lista vacía."""
        return self.is_visible(self.EMPTY_MESSAGE, timeout=3)

    def task_count(self):
        """Devuelve la cantidad de tarjetas visibles."""
        return len(self.driver.find_elements(*self.TASK_CARDS))

    def task_titles(self):
        """Devuelve los títulos de las tareas visibles."""
        elements = self.driver.find_elements(*self.TASK_TITLES)
        return [element.text.strip() for element in elements]

    def has_task_title(self, title, timeout=10):
        """Espera hasta encontrar una tarea con el título indicado."""
        try:
            WebDriverWait(self.driver, timeout).until(
                lambda driver: title
                in [
                    element.text.strip()
                    for element in driver.find_elements(*self.TASK_TITLES)
                ]
            )
            return True
        except TimeoutException:
            return False