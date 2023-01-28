import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeaderService } from '../header.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonalCNOCService {

  constructor(
    private http: HttpClient,
    private queryService: HeaderService
  ) { }

  obtenerPersonalCNOC() {
    return this.http.get(
      `${environment.apiURL}/serviciosCR/obtenerServiciosCR`
    );
  }
}
