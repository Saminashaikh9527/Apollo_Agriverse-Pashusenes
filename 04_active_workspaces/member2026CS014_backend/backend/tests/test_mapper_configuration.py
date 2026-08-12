import unittest

from sqlalchemy.orm import configure_mappers

import app.models  # noqa: F401 - importing registers every model with Base


class MapperConfigurationTests(unittest.TestCase):
    def test_all_sqlalchemy_mappers_configure(self):
        configure_mappers()


if __name__ == "__main__":
    unittest.main()
