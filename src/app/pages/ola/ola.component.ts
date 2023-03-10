import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ColumnStyle, Show, Column, Search, Item, Toolbar, ColumnGroups, Record } from 'src/app/interfaces/interfaces';
import { FaultService } from 'src/app/services/fault/fault.service';
import { HeaderService } from 'src/app/services/header.service';
import { OlasService } from 'src/app/services/olas/olas.service';

@Component({
	selector: 'app-ola',
	templateUrl: './ola.component.html',
	styleUrls: ['./ola.component.scss']
})
export class OlaComponent implements OnInit {
	filter: string;
	loading: boolean = false;
	countries: any[] = [];
	categories: any[] = [];
	years: any[] = [];
	order: string[] = [];
	search: {
		country: string[],
		year: string,
		service: string[],
		supplier: string[]
	} = {
			country: [],
			year: '',
			service: [],
			supplier: []
		};
	services = [{ title: "1.1" }, { title: "2.1" }, { title: "3.1" }, { title: "3.2" }, { title: "4.1" }, { title: "4.2" }];
	suppliers = [];
	styles: ColumnStyle[] = []
	name: string = 'olas';
	header: string = "REPORTE DE OLA'S";
	show: Show = { toolbar: true, footer: true, header: false };
	columns: Column[] = [];
	searches: Search[] = [];
	items: Item[] = [];
	toolbar: Toolbar = { items: this.items };
	sortData: any = [{ field: 'recid', direction: 'ASC' }];
	columnGroups: ColumnGroups[] = []
	dataSource: any[] = [];
	updatedAt: Date;
	@ViewChild('form', { static: false }) form: NgForm;

	constructor(
		private faultService: FaultService,
		private pageService: HeaderService,
		public dialog: MatDialog,
		private olasService: OlasService,
		public router: Router) { }

	ngOnInit() {
		this.getAllCountries();
		this.fetchYears();
		this.getSuppliers();
	}

	getAllCountries() {
		this.faultService.getCountry({}).subscribe((data: any) => {
			this.countries = data;
		}, (error: any) => {
			this.pageService.openSnackBar(`warning`, `Error al obtener los datos de Pa??ses, intenta de nuevo m??s tarde.`);
		});
	}

	searchData(form): void {
		this.loading = true;
		this.form.form.markAllAsTouched();
		if (!this.form.form.invalid && this.search.country.length > 0 && this.search.supplier.length > 0 && this.search.service.length > 0) {
			this.getAll();
		} else {
			this.pageService.openSnackBar(`warning`, `Error selecciona todos los campos.`);
			this.loading = false
		}
	}

	getAll() {
		this.dataSource = [];
		this.olasService.getAll(this.search).subscribe((data: any) => {
			this.styles = this.colors(data.weeks, "#a07e85");
			this.dataSource = this.orderKeys(data.data, data.info, data.weeks);
			this.order = data.order;
			if (Array.isArray(data.info)) {
				this.columnGroups = [];
				this.columnGroups.push({ span: 3, master: false, text: "Datos Generales" })
				this.columnGroups.push({ span: data.info.length - 3, master: false, text: "Datos Generales" })
				this.columnGroups.push({ span: data.weeks.length, master: false, text: "Semanas" });
			}
			this.updatedAt = new Date();
			this.loading = false;
			this.pageService.openSnackBar(`success`, `Datos obtenidos de ${this.header}`);
			this.format();
		})
	}

	fetchYears() {
		this.olasService.getYears().subscribe((data: any) => {
			this.years = data;
		})
	}

	getSuppliers() {
		this.suppliers = [];
		this.olasService.getSuppliers().subscribe((data: any) => {
			if (Array.isArray(data)) {
				this.suppliers = data;
			} else {
				this.pageService.openSnackBar(`warning`, `Error al obtener Proveedores, intanta de nuevo m??s tarde.`);
			}
		}, error => {
			this.pageService.openSnackBar(`error`, `Error al obtener Proveedores, intanta de nuevo m??s tarde.`);
		})
	}

	format(): void {
		let data = this.order || [];
		this.searches = [];
		this.columns = [];
		data.map((key: string) => {
			let col: Column, search: Search;
			if (key === "recid") {
				col = { field: key, text: "linea", size: "50px", frozen: false, sortable: true, hidden: true };
			} else if (key === "CLAVE_OLA" || key === "ID_ACUERDO" || key === "DESCRIPCION_KPI" || key === "FORMULA") {
				col = { field: key, text: key, size: "218px", frozen: false, sortable: true };
			} else if (key === "A??O_ACUERDO") {
				col = { field: key, text: key, size: "105px", sortable: true };
			} else if (key === "PROVEEDOR_INTERNO" || key === "TIPO_AFECTACION" || key === "TIPO_SERVICIO") {
				col = { field: key, text: key, size: "150px", frozen: true, sortable: true };
			} else if (key === "METRICA_ESPERADA") {
				col = { field: key, text: key, size: "132px", sortable: true, render: 'percent:0' }
			} else if (parseInt(key)) {
				col = {
					field: `SEMANA ${key}`, text: key, size: "55px", sortable: true, render: (record) => {
						let value = record[`SEMANA ${key}`] === null ? '' : parseFloat(record[`SEMANA ${key}`].toFixed(2));
						let style = (value < record.METRICA_ESPERADA) ? ` style="background: #ff9d9d; color: #000;"` : ``;
						return (record[`SEMANA ${key}`] === null) ? `` : `<div${style}>${value}%</div>`;
					}
				}
			} else if (key === "CALIFICACION") {
				col = {
					field: key, text: key, size: "115px", sortable: true, render: (record) => {
						let value = 0, i = 0, average = 0;
						for (let prop in record) {
							if (parseInt(prop.replace('SEMANA ', '')) && record[prop] !== null) {
								value += record[prop];
								i++;
							}
						}
						average = value / i;
						let style = '';
						if (average >= 90) { record.CALIFICACION = "Confiable"; style = 'style="background-image: linear-gradient(270deg, #63bd7d, #63bd7d);"'; }
						else if (average >= 80 && average < 90) { record.CALIFICACION = "Necesita mejorar"; style = 'style="background-image: linear-gradient(270deg, #b1d57e, #feeb84);"'; }
						else if (average < 80 && average > 0) { record.CALIFICACION = "No confiable"; style = 'style="background-image: linear-gradient(270deg, #fb8f73, #fdbead);"'; }
						else { record.CALIFICACION = "Dado de baja"; style = 'style="background-image: linear-gradient(270deg, #fd3400, #fd3400);"'; }
						record.PORCENTAJE = average;
						return `<div ${style}>${record.CALIFICACION}</div>`;
					}
				}
			} else if (key === "PORCENTAJE") {
				col = { field: key, text: key, size: "75px", sortable: true, render: 'percent:2' };
			} else {
				col = { field: key, text: key, size: "70px", sortable: true };
			}
			this.columns.push(col);
			if (key === "recid") {
				search = { field: key, label: "linea", type: 'int', hidden: true };
			} else if (key === "CALIFICACION") {
				search = { field: key, label: key, type: 'list', options: { items: ['Confiable', 'Necesita mejorar', 'No confiable', 'Dado de baja'] } };
			} else if (parseInt(key)) {
				search = { field: `SEMANA ${key}`, label: key, type: 'float' };
			} else {
				search = { field: key, label: key, type: 'text' };
			}
			this.searches.push(search);
		})
	}

	colors(data: string[], color: string): ColumnStyle[] {
		let styles: ColumnStyle[] = [];
		data.map((style: string) => {
			let tmpStyle: ColumnStyle = { id: (parseInt(style) + 11), type: "header", style: { "background-color": color } }
			styles.push(tmpStyle);
		})
		styles.push({ id: 12, type: 'group', style: { "background-color": color } });
		return styles;
	}

	selectAll(filter: string, data: string, key: string) {
		this.search[filter] = this[data].map((x: any) => x[key]);
	}

	unselectAll(filter: string) {
		this.search[filter] = [];
	}

	orderKeys(data: Record[], info: string[], weeks: string[]): Record[] {
		let rowsArray = [];
		info = ["recid", ...info];
		if (Array.isArray(data)) {
			data.map(element => {
				let infoRow = {};
				let weeksRow = {};
				info.map(key => {
					infoRow[key] = element[key];
				})
				weeks.map(key => {
					weeksRow[`SEMANA ${key}`] = element[key];
				})
				rowsArray.push({
					...infoRow,
					...weeksRow
				});
			});
		}
		return rowsArray;
	}

}
