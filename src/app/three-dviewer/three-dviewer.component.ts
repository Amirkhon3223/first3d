import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

/**
 * Компонент для визуализации 3D моделей с помощью библиотеки Three.js.
 * @component
 * @implements {OnInit}
 * @implements {AfterViewInit}
 */
@Component({
  selector: 'app-three-dviewer',
  standalone: true,
  templateUrl: './three-dviewer.component.html',
  styleUrls: ['./three-dviewer.component.css']
})
export class ThreeDViewerComponent implements OnInit, AfterViewInit {

  /**
   * Ссылка на элемент canvas в шаблоне.
   * @type {ElementRef<HTMLCanvasElement>}
   */
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  /**
   * Путь к 3D модели для загрузки.
   * @type {string}
   */
  @Input() modelPath!: string;

  /**
   * Сцена для визуализации.
   * @type {THREE.Scene}
   * @private
   */
  private scene!: THREE.Scene;

  /**
   * Камера для наблюдения за сценой.
   * @type {THREE.PerspectiveCamera}
   * @private
   */
  private camera!: THREE.PerspectiveCamera;

  /**
   * Рендерер для отрисовки сцены.
   * @type {THREE.WebGLRenderer}
   * @private
   */
  private renderer!: THREE.WebGLRenderer;

  /**
   * Управление камерой через OrbitControls.
   * @type {OrbitControls}
   * @private
   */
  private controls!: OrbitControls;

  /**
   * Инициализация компонента. Создает сцену.
   * @returns {void}
   */
  ngOnInit(): void {
    this.scene = new THREE.Scene();
  }

  /**
   * Выполняется после инициализации представления компонента.
   * Инициализирует Three.js и запускает анимацию.
   * @returns {void}
   */
  ngAfterViewInit(): void {
    this.initThreeJs();
    this.animate();
  }

  /**
   * Инициализирует Three.js сцену, камеру, освещение, управление камерой и загружает 3D модель.
   * Настраивает параметры рендерера, камеры и источников света, а также активирует тени.
   * Загружает модель в формате GLTF и добавляет ее в сцену.
   *
   * @private
   * @returns {void}
   */
  private initThreeJs(): void {

    /**
     * HTML-элемент canvas, используемый для рендеринга сцены.
     * @type {HTMLCanvasElement}
     */
    const canvas = this.canvasRef.nativeElement;

    /**
     * Создает WebGL рендерер с антиалиасингом и привязывает его к элементу canvas.
     * @type {THREE.WebGLRenderer}
     */
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

    /**
     * Устанавливает размеры рендерера в соответствии с размерами canvas.
     * @param {number} width - Ширина рендерера.
     * @param {number} height - Высота рендерера.
     */
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    /**
     * Устанавливает пиксельное соотношение рендерера для правильного отображения на устройствах с высокой плотностью пикселей.
     * @param {number} value - Соотношение пикселей (например, window.devicePixelRatio).
     */
    this.renderer.setPixelRatio(window.devicePixelRatio);

    /**
     * Включает поддержку теней в рендерере для всех объектов сцены.
     * @type {boolean}
     */
    this.renderer.shadowMap.enabled = true;

    /**
     * Создает камеру с перспективной проекцией.
     * @type {THREE.PerspectiveCamera}
     * @param {number} fov - Угол обзора камеры (в градусах).
     * @param {number} aspect - Соотношение сторон экрана (ширина/высота).
     * @param {number} near - Ближняя плоскость отсечения.
     * @param {number} far - Дальняя плоскость отсечения.
     */
    this.camera = new THREE.PerspectiveCamera(30, canvas.clientWidth / canvas.clientHeight, 0.1, 2000);

    /**
     * Устанавливает начальное положение камеры.
     * @param {number} x - Позиция по оси X.
     * @param {number} y - Позиция по оси Y.
     * @param {number} z - Позиция по оси Z.
     */
    this.camera.position.set(0, 2, 6);

    /**
     * Создает и добавляет амбиентное (фоновое) освещение к сцене.
     * @type {THREE.AmbientLight}
     * @param {THREE.Color} color - Цвет света.
     * @param {number} intensity - Интенсивность света.
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    /**
     * Создает и добавляет первое направленное освещение.
     * Направленный свет создает параллельные лучи, как солнечный свет.
     * @type {THREE.DirectionalLight}
     * @param {THREE.Color} color - Цвет света.
     * @param {number} intensity - Интенсивность света.
     */
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);

    /**
     * Устанавливает позицию направленного света.
     * @param {number} x - Позиция по оси X.
     * @param {number} y - Позиция по оси Y.
     * @param {number} z - Позиция по оси Z.
     */
    directionalLight1.position.set(5, 10, 7.5);

    /**
     * Включает отбрасывание теней для этого света.
     * @type {boolean}
     */
    directionalLight1.castShadow = true;
    this.scene.add(directionalLight1);

    /**
     * Создает и добавляет второе направленное освещение с другой стороны.
     * @type {THREE.DirectionalLight}
     */
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(-5, -10, -7.5);
    directionalLight2.castShadow = true;
    this.scene.add(directionalLight2);

    /**
     * Создает и добавляет точечный источник света в сцену.
     * @type {THREE.PointLight}
     * @param {THREE.Color} color - Цвет света.
     * @param {number} intensity - Интенсивность света.
     */
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(0, 5, 5);
    pointLight.castShadow = true;
    this.scene.add(pointLight);

    /**
     * Создает объект управления камерой с орбитальным управлением (вращение вокруг объекта).
     * @type {OrbitControls}
     * @param {THREE.Camera} camera - Камера, которой управляем.
     * @param {HTMLElement} domElement - HTML элемент для отслеживания событий мыши.
     */
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    /**
     * Включает демпфирование (замедленное вращение камеры для плавного движения).
     * @type {boolean}
     */
    this.controls.enableDamping = true;

    /**
     * Устанавливает целевую точку, на которую будет направлена камера.
     * @param {number} x - Координата по оси X.
     * @param {number} y - Координата по оси Y.
     * @param {number} z - Координата по оси Z.
     */
    this.controls.target.set(0, 1, 0);

    /**
     * Обновляет параметры управления камерой.
     * @returns {void}
     */
    this.controls.update();

    /**
     * Загружает 3D модель с помощью GLTFLoader.
     * @type {GLTFLoader}
     */
    const loader = new GLTFLoader();

    /**
     * Загружает модель по указанному пути и добавляет ее в сцену.
     * @param {string} url - Путь к модели в формате GLTF.
     * @param {Function} onLoad - Функция, выполняемая после успешной загрузки модели.
     * @param {Function} onProgress - Функция для отслеживания прогресса загрузки.
     * @param {Function} onError - Функция, выполняемая при ошибке загрузки.
     */
    loader.load(this.modelPath, (gltf) => {

      /**
       * Проходит по всем узлам загруженной модели и настраивает параметры теней для каждого меша.
       * @param {THREE.Object3D} node - Узел объекта сцены.
       */
      gltf.scene.traverse((node) => {
        if ((node as THREE.Mesh).isMesh) {
          const mesh = node as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          (mesh.material as THREE.MeshStandardMaterial).flatShading = false;
        }
      });
      this.scene.add(gltf.scene);
    }, undefined, (error) => {
      console.error('Ошибка загрузки модели:', error);
    });
  }


  /**
   * Запускает цикл анимации. Обновляет управление камерой и рендерит сцену.
   * @private
   * @returns {void}
   */
  private animate(): void {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
