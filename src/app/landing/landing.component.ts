import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BarecodeScannerLivestreamComponent } from 'ngx-barcode-scanner';
import { MasterdataService } from '../services/masterdata.service';
import { AbsenService } from '../services/absen.service';
import { MessageService } from 'primeng/api';
import { Peserta } from '../model';
import { ExcelService } from '../services/excel.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  providers: [MessageService]
})
export class LandingComponent implements AfterViewInit {

  @ViewChild(BarecodeScannerLivestreamComponent)
  BarecodeScanner: BarecodeScannerLivestreamComponent;
  showSettings: boolean = true;
  nomor_peserta: string = "";
  nama_peserta: string = "";
  lahir_peserta: string = "";
  email_peserta: string = "";
  lock: boolean = true;

  dates;
  selectedDate: string = "";
  times;
  selectedTime: string = "";
  locations;
  selectedLocation: string = "";
  areas;
  selectedArea: string = "";
  message: string = "";
  match: number = 0;//neutral
  pesertas: Array<Peserta> = new Array<Peserta>();

  showReport: boolean = false;

  cols: any[];

  kpiHasCome: number = 0;
  kpiNotCome: number = 0;
  kpiByPass: number = 0;
  kpiShouldTotal: number=0;

  ngAfterViewInit() {
    this.BarecodeScanner.start();
  }

  clear() {
    this.nomor_peserta = "";
    this.nama_peserta = "";
    this.lahir_peserta = "";
    this.email_peserta = "";
    this.match = 0;
    this.message = "";
    this.BarecodeScanner.start();
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  search() {

    if (this.nomor_peserta.toString().length === 5) {
      this.absenService.getPeserta(this.nomor_peserta).subscribe(res => {
        if (res.length > 0) {
          this.BarecodeScanner.stop();
          this.email_peserta = res[0].peserta_email;
          this.nama_peserta = res[0].peserta_nama;
          this.lahir_peserta = res[0].peserta_birth;
          this.lahir_peserta = this.lahir_peserta.split('T')[0];

          if (this.selectedArea === res[0].peserta_area && this.selectedLocation === res[0].peserta_lokasi_test && this.selectedDate === res[0].peserta_tgl_test && this.selectedTime === res[0].peserta_waktu_test) {
            this.match = 1; //matched
            this.message = "Terdaftar";
          } else {
            this.match = 2; //unmatched
            this.message = "Tidak Terdaftar";
          }

          if(res[0].absen_masuk.substring(0, 4) !== '0000'){
            this.match = 3; //unmatched
            this.message = "Sudah Absen<br/>pada tanggal " +res[0].absen_masuk+"<br/>di " +res[0].peserta_lokasi_test +"!";
          }
        }
      });
    } else {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Nomor Tidak Valid', detail: 'Nomor minimal 5 digit angka!' });
    }
  }
  onValueChanges(value) {
    this.nomor_peserta = value.code;
    if (this.nomor_peserta.length === 5) {
      this.absenService.getPeserta(this.nomor_peserta).subscribe(res => {
        if (res.length > 0) {
          this.BarecodeScanner.stop();
          this.email_peserta = res[0].peserta_email;
          this.nama_peserta = res[0].peserta_nama;
          this.lahir_peserta = res[0].peserta_birth;
          this.lahir_peserta = this.lahir_peserta.split('T')[0];
          window.navigator.vibrate(300);

          if (this.selectedArea === res[0].peserta_area && this.selectedLocation === res[0].peserta_lokasi_test && this.selectedDate === res[0].peserta_tgl_test && this.selectedTime === res[0].peserta_waktu_test) {
            this.match = 1; //matched
            this.message = "Terdaftar";
          } else {
            this.match = 2; //unmatched
            this.message = "Tidak Terdaftar";
          }

          if(res[0].absen_masuk.substring(0, 4) !== '0000'){
            this.match = 3; //unmatched
            this.message = "Sudah Absen pada tanggal " +res[0].absen_masuk+" di " +res[0].peserta_lokasi_test +"!";
          }
        }
      });
    }
  }
  constructor(private masterService: MasterdataService, private absenService: AbsenService, private messageService: MessageService, private excelService:ExcelService) { }

  ngOnInit() {
    this.cols = [
      { field: 'peserta_code', header: 'Kd', width: '15%' },
      { field: 'peserta_nama', header: 'Nama', width: '50%' },
      { field: 'absen_masuk', header: 'Absen Masuk', width: '35%' }
    ];

    this.masterService.getDate().subscribe(
      res => {
        this.dates = res;
      }
    );

    this.masterService.getTime().subscribe(
      res => {
        this.times = res;
      }
    );

    this.masterService.getLokasi().subscribe(
      res => {
        this.locations = res;
      }
    );
  }

  submit() {
    let currentTime = new Date().toJSON().toString().split('T')[0] + " " + new Date().toTimeString().split(" ")[0];
    this.absenService.updatePeserta(currentTime, 0, "", this.nomor_peserta).subscribe(res => {
      this.clear();
      this.messageService.add({ key: 'tc', severity: 'success', summary: 'Absen Berhasil', detail: 'Data Tersimpan!' });
    }, err => {
      this.message = err;
    });
    this.BarecodeScanner.start();
  }

  submitUnmatch() {
    let currentTime = new Date().toJSON().toString().split('T')[0] + " " + new Date().toTimeString().split(" ")[0];
    this.absenService.updatePeserta(currentTime, 1, "Tanggal : " + this.selectedDate + "; Jam : " + this.selectedTime + "; Lokasi : " + this.selectedLocation + "; Area : " + this.selectedArea, this.nomor_peserta).subscribe(res => {
      this.clear();
      this.messageService.add({ key: 'tc', severity: 'success', summary: 'Absen Berhasil', detail: 'Data Tersimpan!' });
    }, err => {
      this.message = err;
    });
    this.BarecodeScanner.start();
  }

  onSelectedLocation() {
    this.masterService.getArea(this.selectedLocation).subscribe(res => {
      this.areas = res;
    });

  }

  fetchReport() {
    this.absenService.getReportPeserta(this.selectedLocation, this.selectedArea, this.selectedDate, this.selectedTime).subscribe(
      res => {
        res.forEach((element, i) => {
          element.absen_masuk = element.absen_masuk.toString().slice(0, 19).replace('T', ' ');
          res[i] = element;
        });
        this.pesertas = res;
      }
    )
  }

  showReportEvent() {
    this.showReport = true;
    this.getKpi();
  }

  getKpi() {
    this.absenService.getReportPeserta(this.selectedLocation, this.selectedArea, this.selectedDate, this.selectedTime).subscribe(
      res => {
        let datas: Peserta[] = res;
        this.kpiShouldTotal = datas.length;
        this.kpiHasCome = datas.filter(f => f.absen_masuk.substring(0, 4) !== '0000' && f.absen_bypass == '0').length;
        this.kpiNotCome = datas.filter(f => f.absen_masuk.substring(0, 4) === '0000').length;
      }
    )

    this.absenService.getReportPesertaByPass(this.selectedLocation, this.selectedArea, this.selectedDate, this.selectedTime).subscribe(
      res => {
        let datas: Peserta[] = res;
        this.kpiByPass = datas.length;
      }
    )
  }

  closeReport(val) {
    this.kpiShouldTotal = 0;
    this.kpiHasCome = 0;
    this.kpiByPass = 0;
    this.kpiNotCome = 0;
    this.pesertas = new Array<Peserta>();
  }

  fetchShouldCome(){
    this.absenService.getReportPeserta(this.selectedLocation, this.selectedArea, this.selectedDate, this.selectedTime).subscribe(
      res => {
        res.forEach((element, i) => {
          element.absen_masuk = element.absen_masuk.toString().slice(0, 19).replace('T', ' ');
          res[i] = element;
        });
        this.pesertas = res;
      }
    )
  }

  fetchHasCome(){
    this.absenService.getReportPeserta(this.selectedLocation, this.selectedArea, this.selectedDate, this.selectedTime).subscribe(
      res => {
        res.forEach((element, i) => {
          element.absen_masuk = element.absen_masuk.toString().slice(0, 19).replace('T', ' ');
          res[i] = element;
        });
        this.pesertas = res;
        this.pesertas = this.pesertas.filter(f => f.absen_masuk.substring(0, 4) !== '0000' && f.absen_bypass == '0');
      }
    )
  }

  fetchNotCome(){
    this.absenService.getReportPeserta(this.selectedLocation, this.selectedArea, this.selectedDate, this.selectedTime).subscribe(
      res => {
        res.forEach((element, i) => {
          element.absen_masuk = element.absen_masuk.toString().slice(0, 19).replace('T', ' ');
          res[i] = element;
        });
        this.pesertas = res;
        this.pesertas = this.pesertas.filter(f => f.absen_masuk.substring(0, 4) === '0000');
      }
    )
  }

  fetchByPass(){
    this.absenService.getReportPesertaByPass(this.selectedLocation, this.selectedArea, this.selectedDate, this.selectedTime).subscribe(
      res => {
        this.pesertas = res;
      }
    )
  }

  exportData(){
    this.messageService.add({ key: 'tc', severity: 'success', summary: 'Downloaded', detail: 'Data berhasil di export!' });
    this.excelService.exportAsExcelFile(this.pesertas,"export_raw");
  }
}
