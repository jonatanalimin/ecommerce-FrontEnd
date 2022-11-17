import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../service/storage.service';

@Component({
  selector: 'app-biodata',
  templateUrl: './biodata.component.html',
  styleUrls: ['./biodata.component.css']
})
export class BiodataComponent implements OnInit {

  constructor(
    private storageService : StorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  logout(): void {
    // this.http.post('', {}, {withCredentials: true})
    // .subscribe(() => this.authenticated = false);
    this.storageService.clean();
    window.location.reload();
    this.router.navigate(['']);
    
  }
}
