import { Component, OnInit } from '@angular/core';
import { Column, Search, Show, Record } from 'src/app/interfaces/interfaces';
import { HeaderService } from 'src/app/services/header.service';
import { PersonalCNOCService } from 'src/app/services/servicios-cr/servicios-cr.service';

@Component({
  selector: 'app-personal-cnoc',
  templateUrl: './servicios-cr.component.html',
  styleUrls: ['./servicios-cr.component.scss'],
})
export class PersonalCnocComponent implements OnInit {
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
    private _personalCNOCService: PersonalCNOCService
  ) {
    this.loading = false;
    this.header = 'Servicios CR';
    this.name = 'ServiciosCR';
    this.show = { toolbar: true, footer: true, header: false };
  }

  ngOnInit(): void {
    this.obtenerPersonalCNOC();
  }

  obtenerPersonalCNOC() {
    this.dataSource = [];
    this._personalCNOCService.obtenerPersonalCNOC().subscribe(
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
      } else if (key === 'CONTACT_NAME') {
        col = {
          field: key,
          text: key,
          size: '154px',
          frozen: false,
          sortable: true,
          hidden: false,
        };
      } else if (key === 'USER_ID') {
        col = {
          field: key,
          text: key,
          size: '65px',
          frozen: false,
          sortable: true,
          hidden: false,
        };
      } else if (key === 'GROUP') {
        col = {
          field: key,
          text: 'GRUPO',
          size: '60px',
          frozen: false,
          sortable: true,
          hidden: false,
        };
      } else if (key === 'LAST_NAME') {
        col = {
          field: key,
          text: 'APELLIDOS',
          size: '150px',
          frozen: false,
          sortable: true,
          hidden: false,
        };
      } else if (key === 'FIRST_NAME') {
        col = {
          field: key,
          text: 'NOMBRES',
          size: '150px',
          frozen: false,
          sortable: true,
          hidden: false,
        };
      } else if (key === 'EMAIL') {
        col = {
          field: key,
          text: key,
          size: '200px',
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
