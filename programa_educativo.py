#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Programa Educativo para Estudiantes de Secundaria y Preparatoria
Educational Program for Secondary and High School Students

Este programa ofrece lecciones interactivas en múltiples materias.
This program offers interactive lessons in multiple subjects.
"""

import json
import os
from datetime import datetime


class ProgramaEducativo:
    """Clase principal del programa educativo"""
    
    def __init__(self):
        self.estudiante = None
        self.progreso_file = "progreso_estudiante.json"
        self.progreso = self.cargar_progreso()
    
    def cargar_progreso(self):
        """Carga el progreso del estudiante desde un archivo"""
        if os.path.exists(self.progreso_file):
            with open(self.progreso_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        return {}
    
    def guardar_progreso(self):
        """Guarda el progreso del estudiante"""
        with open(self.progreso_file, 'w', encoding='utf-8') as f:
            json.dump(self.progreso, f, indent=2, ensure_ascii=False)
    
    def registrar_estudiante(self):
        """Registra o inicia sesión de un estudiante"""
        print("\n=== REGISTRO DE ESTUDIANTE ===")
        nombre = input("Ingresa tu nombre: ").strip()
        if not nombre:
            nombre = "Estudiante"
        
        self.estudiante = nombre
        if nombre not in self.progreso:
            self.progreso[nombre] = {
                "fecha_registro": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "matematicas": {"puntos": 0, "lecciones_completadas": []},
                "ciencias": {"puntos": 0, "lecciones_completadas": []},
                "literatura": {"puntos": 0, "lecciones_completadas": []},
                "historia": {"puntos": 0, "lecciones_completadas": []}
            }
            print(f"\n¡Bienvenido {nombre}! Tu perfil ha sido creado.")
        else:
            print(f"\n¡Bienvenido de nuevo {nombre}!")
        
        self.guardar_progreso()
    
    def mostrar_menu_principal(self):
        """Muestra el menú principal"""
        print("\n" + "="*60)
        print("    PROGRAMA EDUCATIVO - SECUNDARIA Y PREPARATORIA")
        print("="*60)
        print(f"Estudiante: {self.estudiante}")
        print("\nSelecciona una materia:")
        print("1. Matemáticas")
        print("2. Ciencias (Física, Química, Biología)")
        print("3. Literatura y Comprensión Lectora")
        print("4. Historia")
        print("5. Ver mi progreso")
        print("6. Salir")
        print("="*60)
    
    def matematicas(self):
        """Módulo de matemáticas"""
        while True:
            print("\n=== MATEMÁTICAS ===")
            print("1. Álgebra - Ecuaciones Lineales")
            print("2. Geometría - Áreas y Volúmenes")
            print("3. Trigonometría - Funciones Básicas")
            print("4. Ejercicios Prácticos")
            print("5. Volver al menú principal")
            
            opcion = input("\nElige una opción: ").strip()
            
            if opcion == "1":
                self.leccion_algebra()
            elif opcion == "2":
                self.leccion_geometria()
            elif opcion == "3":
                self.leccion_trigonometria()
            elif opcion == "4":
                self.ejercicios_matematicas()
            elif opcion == "5":
                break
            else:
                print("Opción no válida. Intenta de nuevo.")
    
    def leccion_algebra(self):
        """Lección de álgebra"""
        print("\n--- LECCIÓN: ECUACIONES LINEALES ---")
        print("""
Una ecuación lineal tiene la forma: ax + b = c

Pasos para resolver:
1. Aislar el término con x
2. Despejar x dividiendo ambos lados

Ejemplo: 2x + 5 = 13
  Paso 1: 2x = 13 - 5
  Paso 2: 2x = 8
  Paso 3: x = 8/2
  Paso 4: x = 4

¡Ahora practica!
        """)
        
        print("\nResuelve: 3x + 7 = 22")
        respuesta = input("¿Cuál es el valor de x? ")
        
        if respuesta.strip() == "5":
            print("¡Correcto! 3x + 7 = 22 → 3x = 15 → x = 5")
            self.agregar_puntos("matematicas", 10)
            self.marcar_leccion_completada("matematicas", "algebra_ecuaciones")
        else:
            print(f"Incorrecto. La respuesta correcta es x = 5")
            print("Recuerda: 3x + 7 = 22 → 3x = 22 - 7 → 3x = 15 → x = 5")
    
    def leccion_geometria(self):
        """Lección de geometría"""
        print("\n--- LECCIÓN: ÁREAS Y VOLÚMENES ---")
        print("""
FÓRMULAS IMPORTANTES:

Área de figuras planas:
- Cuadrado: A = lado²
- Rectángulo: A = base × altura
- Triángulo: A = (base × altura) / 2
- Círculo: A = π × radio²

Volúmenes:
- Cubo: V = lado³
- Cilindro: V = π × radio² × altura
- Esfera: V = (4/3) × π × radio³
        """)
        
        print("\nPregunta: ¿Cuál es el área de un cuadrado con lado de 6 cm?")
        respuesta = input("Respuesta (solo el número): ")
        
        if respuesta.strip() == "36":
            print("¡Excelente! A = 6² = 36 cm²")
            self.agregar_puntos("matematicas", 10)
            self.marcar_leccion_completada("matematicas", "geometria_areas")
        else:
            print("Incorrecto. El área es 36 cm² (6 × 6 = 36)")
    
    def leccion_trigonometria(self):
        """Lección de trigonometría"""
        print("\n--- LECCIÓN: FUNCIONES TRIGONOMÉTRICAS ---")
        print("""
En un triángulo rectángulo:

sen(θ) = cateto opuesto / hipotenusa
cos(θ) = cateto adyacente / hipotenusa
tan(θ) = cateto opuesto / cateto adyacente

Valores importantes:
- sen(30°) = 0.5
- cos(0°) = 1
- tan(45°) = 1

Identidad fundamental:
sen²(θ) + cos²(θ) = 1
        """)
        
        print("\n¿Cuál es el valor de sen(30°)?")
        print("a) 0.5")
        print("b) 0.707")
        print("c) 1")
        respuesta = input("Tu respuesta (a, b, o c): ").strip().lower()
        
        if respuesta == "a":
            print("¡Correcto! sen(30°) = 0.5 o 1/2")
            self.agregar_puntos("matematicas", 10)
            self.marcar_leccion_completada("matematicas", "trigonometria_basica")
        else:
            print("Incorrecto. La respuesta correcta es a) 0.5")
    
    def ejercicios_matematicas(self):
        """Ejercicios prácticos de matemáticas"""
        print("\n=== EJERCICIOS PRÁCTICOS ===")
        puntos_ganados = 0
        
        # Ejercicio 1
        print("\n1. Si 5x - 3 = 17, ¿cuál es el valor de x?")
        if input("Respuesta: ").strip() == "4":
            print("¡Correcto!")
            puntos_ganados += 5
        else:
            print("Incorrecto. x = 4")
        
        # Ejercicio 2
        print("\n2. ¿Cuál es el área de un círculo con radio 5 cm? (usa π ≈ 3.14)")
        respuesta = input("Respuesta: ").strip()
        if respuesta in ["78.5", "78.54", "79"]:
            print("¡Correcto!")
            puntos_ganados += 5
        else:
            print("Incorrecto. A = π × 5² = 3.14 × 25 = 78.5 cm²")
        
        # Ejercicio 3
        print("\n3. Si un triángulo tiene base 8 cm y altura 6 cm, ¿cuál es su área?")
        if input("Respuesta: ").strip() == "24":
            print("¡Correcto!")
            puntos_ganados += 5
        else:
            print("Incorrecto. A = (8 × 6) / 2 = 24 cm²")
        
        self.agregar_puntos("matematicas", puntos_ganados)
        print(f"\n¡Ejercicios completados! Ganaste {puntos_ganados} puntos.")
    
    def ciencias(self):
        """Módulo de ciencias"""
        while True:
            print("\n=== CIENCIAS ===")
            print("1. Física - Leyes de Newton")
            print("2. Química - Tabla Periódica")
            print("3. Biología - Célula y Sistemas")
            print("4. Quiz de Ciencias")
            print("5. Volver al menú principal")
            
            opcion = input("\nElige una opción: ").strip()
            
            if opcion == "1":
                self.leccion_fisica()
            elif opcion == "2":
                self.leccion_quimica()
            elif opcion == "3":
                self.leccion_biologia()
            elif opcion == "4":
                self.quiz_ciencias()
            elif opcion == "5":
                break
            else:
                print("Opción no válida. Intenta de nuevo.")
    
    def leccion_fisica(self):
        """Lección de física"""
        print("\n--- LECCIÓN: LEYES DE NEWTON ---")
        print("""
Las tres leyes de Newton:

1ª Ley (Inercia):
   Un objeto en reposo permanece en reposo, y un objeto en movimiento
   permanece en movimiento con velocidad constante, a menos que actúe
   una fuerza externa sobre él.

2ª Ley (F = ma):
   La fuerza es igual a la masa por la aceleración.
   F = m × a

3ª Ley (Acción y Reacción):
   Para cada acción hay una reacción igual y opuesta.

Ejemplo: Si empujas una pared con 10 N, la pared te empuja con 10 N.
        """)
        
        print("\nPregunta: Si un objeto tiene masa de 5 kg y aceleración de 2 m/s²,")
        print("¿qué fuerza se aplica sobre él? (F = m × a)")
        respuesta = input("Respuesta en Newtons: ").strip()
        
        if respuesta == "10":
            print("¡Correcto! F = 5 kg × 2 m/s² = 10 N")
            self.agregar_puntos("ciencias", 10)
            self.marcar_leccion_completada("ciencias", "fisica_newton")
        else:
            print("Incorrecto. F = 5 × 2 = 10 N")
    
    def leccion_quimica(self):
        """Lección de química"""
        print("\n--- LECCIÓN: TABLA PERIÓDICA ---")
        print("""
Grupos importantes de elementos:

- Grupo 1: Metales Alcalinos (Li, Na, K)
- Grupo 17: Halógenos (F, Cl, Br, I)
- Grupo 18: Gases Nobles (He, Ne, Ar)

Elementos comunes y sus símbolos:
H - Hidrógeno    C - Carbono      N - Nitrógeno
O - Oxígeno      Na - Sodio       Ca - Calcio
Fe - Hierro      Au - Oro         Ag - Plata

Estructura atómica:
- Protones (+): en el núcleo
- Neutrones (neutros): en el núcleo
- Electrones (-): orbitan el núcleo
        """)
        
        print("\nPregunta: ¿Cuál es el símbolo químico del Oxígeno?")
        respuesta = input("Respuesta: ").strip().upper()
        
        if respuesta == "O":
            print("¡Correcto! El oxígeno se representa con la letra O")
            self.agregar_puntos("ciencias", 10)
            self.marcar_leccion_completada("ciencias", "quimica_tabla")
        else:
            print("Incorrecto. El símbolo del Oxígeno es O")
    
    def leccion_biologia(self):
        """Lección de biología"""
        print("\n--- LECCIÓN: LA CÉLULA ---")
        print("""
Tipos de células:

1. CÉLULA PROCARIOTA (bacterias):
   - No tiene núcleo definido
   - Más simple y pequeña

2. CÉLULA EUCARIOTA (animales, plantas):
   - Tiene núcleo definido
   - Más compleja

Organelos importantes:
- Núcleo: contiene el ADN
- Mitocondria: produce energía (ATP)
- Ribosomas: sintetizan proteínas
- Membrana celular: protege la célula

En plantas también:
- Cloroplastos: realizan fotosíntesis
- Pared celular: protección adicional
        """)
        
        print("\nPregunta: ¿Qué organelo se conoce como la 'central energética' de la célula?")
        print("a) Núcleo")
        print("b) Mitocondria")
        print("c) Ribosoma")
        respuesta = input("Tu respuesta (a, b, o c): ").strip().lower()
        
        if respuesta == "b":
            print("¡Correcto! La mitocondria produce energía para la célula")
            self.agregar_puntos("ciencias", 10)
            self.marcar_leccion_completada("ciencias", "biologia_celula")
        else:
            print("Incorrecto. La respuesta correcta es b) Mitocondria")
    
    def quiz_ciencias(self):
        """Quiz de ciencias"""
        print("\n=== QUIZ DE CIENCIAS ===")
        puntos_ganados = 0
        
        print("\n1. ¿Qué planeta es conocido como el 'planeta rojo'?")
        if input("Respuesta: ").strip().lower() == "marte":
            print("¡Correcto!")
            puntos_ganados += 5
        else:
            print("Incorrecto. Es Marte")
        
        print("\n2. ¿Cuántos elementos hay aproximadamente en la tabla periódica?")
        respuesta = input("Respuesta: ").strip()
        if respuesta in ["118", "118 elementos"]:
            print("¡Correcto!")
            puntos_ganados += 5
        else:
            print("Incorrecto. Hay 118 elementos")
        
        print("\n3. ¿Cuál es la velocidad de la luz aproximadamente?")
        print("a) 300,000 km/s")
        print("b) 150,000 km/s")
        print("c) 500,000 km/s")
        if input("Respuesta (a, b, o c): ").strip().lower() == "a":
            print("¡Correcto!")
            puntos_ganados += 5
        else:
            print("Incorrecto. Es aproximadamente 300,000 km/s")
        
        self.agregar_puntos("ciencias", puntos_ganados)
        print(f"\n¡Quiz completado! Ganaste {puntos_ganados} puntos.")
    
    def literatura(self):
        """Módulo de literatura"""
        while True:
            print("\n=== LITERATURA Y COMPRENSIÓN LECTORA ===")
            print("1. Géneros Literarios")
            print("2. Figuras Retóricas")
            print("3. Comprensión de Lectura")
            print("4. Análisis de Texto")
            print("5. Volver al menú principal")
            
            opcion = input("\nElige una opción: ").strip()
            
            if opcion == "1":
                self.leccion_generos()
            elif opcion == "2":
                self.leccion_figuras_retoricas()
            elif opcion == "3":
                self.leccion_comprension()
            elif opcion == "4":
                self.ejercicio_analisis()
            elif opcion == "5":
                break
            else:
                print("Opción no válida. Intenta de nuevo.")
    
    def leccion_generos(self):
        """Lección sobre géneros literarios"""
        print("\n--- LECCIÓN: GÉNEROS LITERARIOS ---")
        print("""
Los tres grandes géneros literarios:

1. LÍRICO (Poesía):
   - Expresa sentimientos y emociones
   - Usa verso y ritmo
   - Ejemplo: sonetos, odas, elegías

2. NARRATIVO (Prosa):
   - Cuenta una historia
   - Tiene personajes, trama y ambiente
   - Ejemplo: novelas, cuentos, fábulas

3. DRAMÁTICO (Teatro):
   - Escrito para ser representado
   - Diálogos entre personajes
   - Ejemplo: tragedias, comedias
        """)
        
        print("\nPregunta: ¿A qué género pertenece una novela?")
        print("a) Lírico")
        print("b) Narrativo")
        print("c) Dramático")
        respuesta = input("Tu respuesta (a, b, o c): ").strip().lower()
        
        if respuesta == "b":
            print("¡Correcto! La novela es un género narrativo")
            self.agregar_puntos("literatura", 10)
            self.marcar_leccion_completada("literatura", "generos_literarios")
        else:
            print("Incorrecto. La novela pertenece al género narrativo")
    
    def leccion_figuras_retoricas(self):
        """Lección sobre figuras retóricas"""
        print("\n--- LECCIÓN: FIGURAS RETÓRICAS ---")
        print("""
Figuras retóricas comunes:

METÁFORA: Comparación implícita
  Ejemplo: "Tus ojos son dos luceros"

SÍMIL: Comparación usando "como" o "cual"
  Ejemplo: "Blanco como la nieve"

HIPÉRBOLE: Exageración
  Ejemplo: "Te lo he dicho mil veces"

PERSONIFICACIÓN: Dar cualidades humanas a objetos
  Ejemplo: "El viento susurraba entre los árboles"

ALITERACIÓN: Repetición de sonidos
  Ejemplo: "El ruido con que rueda la ronca tempestad"
        """)
        
        print("\n¿Qué figura retórica es 'Tus labios son pétalos de rosa'?")
        print("a) Hipérbole")
        print("b) Metáfora")
        print("c) Símil")
        respuesta = input("Tu respuesta (a, b, o c): ").strip().lower()
        
        if respuesta == "b":
            print("¡Correcto! Es una metáfora porque compara implícitamente")
            self.agregar_puntos("literatura", 10)
            self.marcar_leccion_completada("literatura", "figuras_retoricas")
        else:
            print("Incorrecto. Es una metáfora")
    
    def leccion_comprension(self):
        """Ejercicio de comprensión lectora"""
        print("\n--- EJERCICIO: COMPRENSIÓN LECTORA ---")
        print("""
Lee el siguiente texto:

"El Sol es una estrella que se encuentra en el centro de nuestro
sistema solar. Aunque parece pequeño desde la Tierra, es en realidad
enorme: su diámetro es 109 veces mayor que el de la Tierra. El Sol
produce energía mediante fusión nuclear, convirtiendo hidrógeno en
helio. Esta energía viaja por el espacio y llega a la Tierra en forma
de luz y calor, haciendo posible la vida en nuestro planeta."
        """)
        
        print("\nPregunta: ¿Qué proceso usa el Sol para producir energía?")
        respuesta = input("Respuesta: ").strip().lower()
        
        if "fusion" in respuesta or "fusión" in respuesta:
            print("¡Correcto! El Sol produce energía mediante fusión nuclear")
            self.agregar_puntos("literatura", 10)
            self.marcar_leccion_completada("literatura", "comprension_lectora")
        else:
            print("Incorrecto. El Sol usa fusión nuclear para producir energía")
    
    def ejercicio_analisis(self):
        """Ejercicio de análisis de texto"""
        print("\n--- EJERCICIO: ANÁLISIS DE TEXTO ---")
        print("""
Analiza el siguiente fragmento del poema "Rima XXI" de Gustavo Adolfo Bécquer:

"¿Qué es poesía?, dices mientras clavas
en mi pupila tu pupila azul.
¿Qué es poesía? ¿Y tú me lo preguntas?
Poesía... eres tú."
        """)
        
        print("\n¿Qué figura retórica predomina en este poema?")
        print("a) Metáfora")
        print("b) Hipérbole")
        print("c) Aliteración")
        respuesta = input("Tu respuesta (a, b, o c): ").strip().lower()
        
        if respuesta == "a":
            print("¡Correcto! El poeta usa la metáfora al comparar a la persona con la poesía")
            self.agregar_puntos("literatura", 10)
        else:
            print("Incorrecto. La figura predominante es la metáfora")
    
    def historia(self):
        """Módulo de historia"""
        while True:
            print("\n=== HISTORIA ===")
            print("1. Historia Universal - Edad Antigua")
            print("2. Historia Universal - Edad Media")
            print("3. Historia Universal - Edad Moderna")
            print("4. Historia de América")
            print("5. Quiz de Historia")
            print("6. Volver al menú principal")
            
            opcion = input("\nElige una opción: ").strip()
            
            if opcion == "1":
                self.leccion_edad_antigua()
            elif opcion == "2":
                self.leccion_edad_media()
            elif opcion == "3":
                self.leccion_edad_moderna()
            elif opcion == "4":
                self.leccion_america()
            elif opcion == "5":
                self.quiz_historia()
            elif opcion == "6":
                break
            else:
                print("Opción no válida. Intenta de nuevo.")
    
    def leccion_edad_antigua(self):
        """Lección sobre la edad antigua"""
        print("\n--- LECCIÓN: EDAD ANTIGUA ---")
        print("""
Grandes Civilizaciones Antiguas:

MESOPOTAMIA (3500 a.C.):
- Cuna de la civilización
- Invención de la escritura cuneiforme
- Código de Hammurabi (primer código de leyes)

EGIPTO ANTIGUO (3100 a.C.):
- Pirámides y faraones
- Escritura jeroglífica
- Avances en matemáticas y medicina

GRECIA CLÁSICA (800-146 a.C.):
- Democracia ateniense
- Filosofía: Sócrates, Platón, Aristóteles
- Arte, teatro y olimpiadas

IMPERIO ROMANO (27 a.C. - 476 d.C.):
- Derecho romano
- Ingeniería y arquitectura
- Expansión por Europa, África y Asia
        """)
        
        print("\nPregunta: ¿Qué civilización creó la democracia?")
        respuesta = input("Respuesta: ").strip().lower()
        
        if "grecia" in respuesta or "griega" in respuesta:
            print("¡Correcto! Los griegos, específicamente Atenas, crearon la democracia")
            self.agregar_puntos("historia", 10)
            self.marcar_leccion_completada("historia", "edad_antigua")
        else:
            print("Incorrecto. Fue la Grecia Clásica, específicamente Atenas")
    
    def leccion_edad_media(self):
        """Lección sobre la edad media"""
        print("\n--- LECCIÓN: EDAD MEDIA ---")
        print("""
Edad Media (476 - 1453 d.C.):

CARACTERÍSTICAS:
- Sistema feudal
- Poder de la Iglesia Católica
- Castillos y caballeros

EVENTOS IMPORTANTES:
- Caída del Imperio Romano (476)
- Expansión del Islam (siglo VII)
- Las Cruzadas (1095-1291)
- La Peste Negra (1347-1353)
- Caída de Constantinopla (1453)

SOCIEDAD FEUDAL:
- Rey: máxima autoridad
- Nobles y señores feudales
- Clero (iglesia)
- Campesinos y siervos
        """)
        
        print("\nPregunta: ¿Cómo se llamaba el sistema social y económico de la Edad Media?")
        respuesta = input("Respuesta: ").strip().lower()
        
        if "feudal" in respuesta:
            print("¡Correcto! El sistema feudal era la estructura de la Edad Media")
            self.agregar_puntos("historia", 10)
            self.marcar_leccion_completada("historia", "edad_media")
        else:
            print("Incorrecto. Era el sistema feudal")
    
    def leccion_edad_moderna(self):
        """Lección sobre la edad moderna"""
        print("\n--- LECCIÓN: EDAD MODERNA ---")
        print("""
Edad Moderna (1453 - 1789):

RENACIMIENTO (siglos XV-XVI):
- Recuperación del arte clásico
- Leonardo da Vinci, Miguel Ángel
- Humanismo

DESCUBRIMIENTOS:
- 1492: Cristóbal Colón llega a América
- 1519-1522: Primera vuelta al mundo (Magallanes)
- Imprenta de Gutenberg

REVOLUCIONES CIENTÍFICAS:
- Nicolás Copérnico: heliocentrismo
- Galileo Galilei: telescopio
- Isaac Newton: leyes del movimiento

EVENTOS IMPORTANTES:
- Reforma Protestante (1517)
- Revolución Francesa (1789)
- Ilustración: razón y ciencia
        """)
        
        print("\n¿En qué año Cristóbal Colón llegó a América?")
        respuesta = input("Respuesta: ").strip()
        
        if "1492" in respuesta:
            print("¡Correcto! Colón llegó a América en 1492")
            self.agregar_puntos("historia", 10)
            self.marcar_leccion_completada("historia", "edad_moderna")
        else:
            print("Incorrecto. Fue en 1492")
    
    def leccion_america(self):
        """Lección sobre historia de América"""
        print("\n--- LECCIÓN: HISTORIA DE AMÉRICA ---")
        print("""
CIVILIZACIONES PRECOLOMBINAS:

MAYAS (2000 a.C. - 1500 d.C.):
- Península de Yucatán
- Matemáticas avanzadas (concepto del cero)
- Calendario maya

AZTECAS (1325 - 1521):
- Valle de México (Tenochtitlán)
- Imperio poderoso
- Conquistados por Hernán Cortés

INCAS (1438 - 1533):
- Andes sudamericanos (Perú)
- Machu Picchu
- Conquistados por Francisco Pizarro

INDEPENDENCIAS:
- Estados Unidos: 1776
- América Latina: siglo XIX (1810-1825)
- Líderes: Simón Bolívar, José de San Martín, Miguel Hidalgo
        """)
        
        print("\n¿Qué civilización construyó Machu Picchu?")
        respuesta = input("Respuesta: ").strip().lower()
        
        if "inca" in respuesta:
            print("¡Correcto! Los Incas construyeron Machu Picchu")
            self.agregar_puntos("historia", 10)
            self.marcar_leccion_completada("historia", "historia_america")
        else:
            print("Incorrecto. Fueron los Incas")
    
    def quiz_historia(self):
        """Quiz de historia"""
        print("\n=== QUIZ DE HISTORIA ===")
        puntos_ganados = 0
        
        print("\n1. ¿Quién pintó 'La Mona Lisa'?")
        if "leonardo" in input("Respuesta: ").strip().lower():
            print("¡Correcto! Leonardo da Vinci")
            puntos_ganados += 5
        else:
            print("Incorrecto. Fue Leonardo da Vinci")
        
        print("\n2. ¿En qué año comenzó la Primera Guerra Mundial?")
        if "1914" in input("Respuesta: ").strip():
            print("¡Correcto!")
            puntos_ganados += 5
        else:
            print("Incorrecto. Fue en 1914")
        
        print("\n3. ¿Quién fue el primer presidente de Estados Unidos?")
        respuesta = input("Respuesta: ").strip().lower()
        if "washington" in respuesta or "george washington" in respuesta:
            print("¡Correcto!")
            puntos_ganados += 5
        else:
            print("Incorrecto. Fue George Washington")
        
        self.agregar_puntos("historia", puntos_ganados)
        print(f"\n¡Quiz completado! Ganaste {puntos_ganados} puntos.")
    
    def ver_progreso(self):
        """Muestra el progreso del estudiante"""
        if not self.estudiante or self.estudiante not in self.progreso:
            print("\nNo hay datos de progreso disponibles.")
            return
        
        datos = self.progreso[self.estudiante]
        print("\n" + "="*60)
        print(f"PROGRESO DE {self.estudiante.upper()}")
        print("="*60)
        print(f"Fecha de registro: {datos['fecha_registro']}")
        print("\nPUNTOS POR MATERIA:")
        
        total_puntos = 0
        for materia in ["matematicas", "ciencias", "literatura", "historia"]:
            puntos = datos[materia]["puntos"]
            lecciones = len(datos[materia]["lecciones_completadas"])
            total_puntos += puntos
            print(f"  {materia.capitalize()}: {puntos} puntos - {lecciones} lecciones completadas")
        
        print(f"\nPUNTOS TOTALES: {total_puntos}")
        
        # Determinar nivel
        if total_puntos < 50:
            nivel = "Principiante"
        elif total_puntos < 150:
            nivel = "Intermedio"
        elif total_puntos < 300:
            nivel = "Avanzado"
        else:
            nivel = "Experto"
        
        print(f"NIVEL: {nivel}")
        print("="*60)
    
    def agregar_puntos(self, materia, puntos):
        """Agrega puntos a una materia"""
        if self.estudiante in self.progreso:
            self.progreso[self.estudiante][materia]["puntos"] += puntos
            self.guardar_progreso()
            print(f"\n✓ Has ganado {puntos} puntos en {materia}!")
    
    def marcar_leccion_completada(self, materia, leccion_id):
        """Marca una lección como completada"""
        if self.estudiante in self.progreso:
            lecciones = self.progreso[self.estudiante][materia]["lecciones_completadas"]
            if leccion_id not in lecciones:
                lecciones.append(leccion_id)
                self.guardar_progreso()
    
    def ejecutar(self):
        """Ejecuta el programa principal"""
        print("\n" + "="*60)
        print("  BIENVENIDO AL PROGRAMA EDUCATIVO")
        print("  Para estudiantes de Secundaria y Preparatoria")
        print("="*60)
        
        self.registrar_estudiante()
        
        while True:
            self.mostrar_menu_principal()
            opcion = input("\nElige una opción: ").strip()
            
            if opcion == "1":
                self.matematicas()
            elif opcion == "2":
                self.ciencias()
            elif opcion == "3":
                self.literatura()
            elif opcion == "4":
                self.historia()
            elif opcion == "5":
                self.ver_progreso()
            elif opcion == "6":
                print("\n¡Gracias por usar el programa educativo!")
                print("¡Sigue aprendiendo y alcanzarás tus metas!")
                self.guardar_progreso()
                break
            else:
                print("\nOpción no válida. Por favor elige un número del 1 al 6.")


if __name__ == "__main__":
    programa = ProgramaEducativo()
    programa.ejecutar()
