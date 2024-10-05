import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ThreeDViewerComponent} from '../three-dviewer/three-dviewer.component';
import {NgForOf} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';


/**
 * Интерфейс, описывающий структуру модели.
 *
 * @interface Model
 * @property {string} name - Название модели.
 * @property {string} file - Путь к файлу модели.
 */
interface Model {
  name: string;
  file: string;
}

@Component({
  selector: 'app-model-list',
  standalone: true,
  imports: [
    ThreeDViewerComponent,
    NgForOf,
    HttpClientModule,
  ],
  templateUrl: './model-list.component.html',
  styleUrl: './model-list.component.css'
})
export class ModelListComponent implements OnInit {
  /**
   * Массив моделей, который заполняется данными из JSON-файла.
   *
   * @type {Model[]}
   */
  models: Model[] = [];

  /**
   * Создает экземпляр компонента и внедряет зависимость HttpClient для выполнения HTTP-запросов.
   *
   * @param {HttpClient} http - Сервис для выполнения HTTP-запросов.
   */
  constructor(private http: HttpClient) {
  }

  /**
   * Хук жизненного цикла Angular, который вызывается после инициализации компонента.
   * Выполняет HTTP-запрос для получения списка моделей из JSON-файла.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.http.get<Model[]>('assets/models.json').subscribe(data => {
      this.models = data;
    });
  }
}
