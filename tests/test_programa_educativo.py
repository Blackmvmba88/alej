import io
import json
import os
import tempfile
import unittest
from contextlib import redirect_stdout
from unittest.mock import patch

from programa_educativo import ProgramaEducativo


def crear_programa(progreso=None):
    programa = ProgramaEducativo.__new__(ProgramaEducativo)
    programa.estudiante = "Ana"
    programa.progreso = progreso or {
        "Ana": {
            "fecha_registro": "2026-07-17 00:00:00",
            "matematicas": {"puntos": 0, "lecciones_completadas": []},
            "ciencias": {"puntos": 0, "lecciones_completadas": []},
            "literatura": {"puntos": 0, "lecciones_completadas": []},
            "historia": {"puntos": 0, "lecciones_completadas": []},
        }
    }
    programa.guardar_progreso = lambda: None
    return programa


class ProgramaEducativoTests(unittest.TestCase):
    def test_actividad_otorga_puntos_una_sola_vez(self):
        programa = crear_programa()

        self.assertTrue(
            programa.completar_actividad("matematicas", "algebra_ecuaciones", 10)
        )
        self.assertFalse(
            programa.completar_actividad("matematicas", "algebra_ecuaciones", 10)
        )

        matematicas = programa.progreso["Ana"]["matematicas"]
        self.assertEqual(matematicas["puntos"], 10)
        self.assertEqual(
            matematicas["lecciones_completadas"], ["algebra_ecuaciones"]
        )

    def test_cargar_progreso_informa_la_causa_del_error(self):
        with tempfile.TemporaryDirectory() as directorio:
            ruta = os.path.join(directorio, "progreso.json")
            with open(ruta, "w", encoding="utf-8") as archivo:
                archivo.write("{json inválido")

            programa = ProgramaEducativo.__new__(ProgramaEducativo)
            programa.progreso_file = ruta
            salida = io.StringIO()

            with redirect_stdout(salida):
                progreso = programa.cargar_progreso()

            self.assertEqual(progreso, {})
            self.assertIn("Error:", salida.getvalue())

    def test_nombre_existente_inicia_sesion_sin_duplicar_perfil(self):
        programa = crear_programa()
        programa.estudiante = None

        with patch("builtins.input", return_value="Ana"):
            programa.registrar_estudiante()

        self.assertEqual(programa.estudiante, "Ana")
        self.assertEqual(list(programa.progreso), ["Ana"])


if __name__ == "__main__":
    unittest.main()
