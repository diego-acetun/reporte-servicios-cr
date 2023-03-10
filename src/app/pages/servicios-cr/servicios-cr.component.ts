import { Component, OnInit } from '@angular/core';
import { Column, Search, Show, Record } from 'src/app/interfaces/interfaces';
import { HeaderService } from 'src/app/services/header.service';
import { ServiciosCR } from 'src/app/services/servicios-cr/servicios-cr.service';

@Component({
  selector: 'app-servicios-cr',
  templateUrl: './servicios-cr.component.html',
  styleUrls: ['./servicios-cr.component.scss'],
})
export class ServiciosCRComponent implements OnInit {
  public loading: boolean;
  public dataSource: any;
  public header: string;
  public updatedAt: string;
  public order: any;
  public name: string;
  public show: Show;
  public columns: Column[] = [];
  public searches: Search[] = [];
  public datos: any;

  constructor(
    private _pageService: HeaderService,
    private _serviciosCRService: ServiciosCR
  ) {
    this.loading = false;
    this.header = 'Servicios CR';
    this.name = 'ServiciosCR';
    this.show = { toolbar: true, footer: true, header: false };
  }

  ngOnInit(): void {
    this.obtenerServiciosCR();
  }

  obtenerServiciosCR() {
    this.dataSource = [];
    this._serviciosCRService.obtenerServiciosCR().subscribe(
      ({ data, message }: any) => {
        this.order = data.order;
        this.updatedAt = Date();
        this.dataSource = this.orderKeys(data.data, data.info);
        this.format();
        this._pageService.openSnackBar(`success`, message);
        this.loading = false;
      },
      (error) => {
        this._pageService.openSnackBar(`error`, error);
        this.loading = false;
      }
    );
  }

  format(): void {
    let data = this.order || [];
    this.searches = [];
    this.columns = [];
    data.map((key: string) => {
      let col: Column, search: Search;
      if (key === 'recid') {
        col = {
          field: key,
          text: key,
          size: '41px',
          frozen: false,
          sortable: true,
          hidden: false,
        };
      } else if (key === 'DIRECCION_INSTALACION') {
        col = {
          field: key,
          text: key,
          size: '200px',
          frozen: false,
          sortable: true,
          hidden: false,
        };
      } else if (key === 'TG_ANCHOBANDA_DEST') {
        col = {
          field: key,
          text: key,
          size: '170px',
          frozen: false,
          sortable: true,
          hidden: false,
        };
      } else if (key === 'MEDIO_DE_FACTURACION') {
        col = {
          field: key,
          text: key,
          size: '170px',
          frozen: false,
          sortable: true,
          hidden: false,
        };
      } else {
        col = { field: key, text: key, size: '150px', sortable: true };
      }
      this.columns.push(col);
      if (key === 'recid') {
        search = { field: key, label: key, type: 'int', hidden: true };
      } else {
        search = { field: key, label: key, type: 'text' };
      }
      this.searches.push(search);
    });
  }

  orderKeys(data: Record[], info: string[]): Record[] {
    let rowsArray = [];
    info = ['recid', ...info];
    if (Array.isArray(data)) {
      data.map((element) => {
        let infoRow = {};
        info.map((key) => {
          infoRow[key] = element[key];
        });
        rowsArray.push({
          ...infoRow,
        });
      });
    }
    return rowsArray;
  }

  // searchData(form): void {
  // 	this.loading = true;
  // 	if (this.form.form.valid && this.search.NoFalla) {
  //     console.log(this.search.NoFalla)
  //     this.loading = false;
  // 	} else {
  // 		this._pageService.openSnackBar(`error`, `Ingresa todos los campos.`);
  //     this.loading = false;
  //   }
  // }
}
