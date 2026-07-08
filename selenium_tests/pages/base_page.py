from selenium.common.exceptions import (
    ElementClickInterceptedException,
    TimeoutException,
)
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

class BasePage:
    """Contiene operaciones comunes para los Page Objects."""
    
    def __init__(self, driver, timeout=10):
        self.driver = driver
        self.wait = WebDriverWait(driver, timeout)

    def open(self, url):
        """Abre una dirección en el navegador."""
        self.driver.get(url)

    def find(self, locator):
        """Espera hasta que un elemento sea visible."""
        return self.wait.until(
            EC.visibility_of_element_located(locator)
        )

    def click(self, locator):
        """Desplaza el elemento al centro y realiza el clic."""
        # Corregida la indentación interna de todo este método
        element = self.wait.until(
            EC.presence_of_element_located(locator)
        )

        self.driver.execute_script(
            """
            arguments[0].scrollIntoView({
                block: 'center',
                inline: 'center'
            });
            """,
            element,
        )

        element = self.wait.until(
            EC.element_to_be_clickable(locator)
        )

        try:
            element.click()
        except ElementClickInterceptedException:
            self.driver.execute_script(
                "arguments[0].click();",
                element,
            )

    def type_text(self, locator, text):
        """Limpia un campo y escribe texto."""
        element = self.find(locator)
        element.clear()
        element.send_keys(text)

    def get_text(self, locator):
        """Obtiene el texto visible de un elemento."""
        return self.find(locator).text

    def is_visible(self, locator, timeout=5):
        """Comprueba si un elemento aparece en pantalla."""
        try:
            WebDriverWait(self.driver, timeout).until(
                EC.visibility_of_element_located(locator)
            )
            return True
        except TimeoutException:
            return False