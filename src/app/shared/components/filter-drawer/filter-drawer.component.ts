import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PsDataService } from '../../../core/services/ps-data.service';

@Component({
  selector: 'app-filter-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card bg-dark bg-opacity-50 border-secondary border-opacity-25 rounded-4 shadow-sm p-3">
      <div class="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom border-secondary border-opacity-25">
        <h5 class="m-0 fs-6 fw-bold text-light d-flex align-items-center gap-2">
          <i class="bi bi-funnel-fill text-info"></i> Filters & Refinement
        </h5>
        <button class="btn btn-sm btn-link text-info text-decoration-none p-0 fw-semibold" (click)="psService.resetFilters()">
          Reset All
        </button>
      </div>

      <!-- Category Segmented Control -->
      <div class="mb-3">
        <label class="form-label text-secondary small fw-bold text-uppercase">Track / Category</label>
        <div class="btn-group w-100" role="group">
          <button 
            type="button" 
            class="btn btn-sm"
            [ngClass]="psService.filterState().category === 'All' ? 'btn-info text-dark fw-bold' : 'btn-outline-secondary text-light'"
            (click)="psService.setCategory('All')"
          >All ({{ stats.total }})</button>
          <button 
            type="button" 
            class="btn btn-sm"
            [ngClass]="psService.filterState().category === 'Software' ? 'btn-info text-dark fw-bold' : 'btn-outline-secondary text-light'"
            (click)="psService.setCategory('Software')"
          >💻 SW ({{ stats.softwareCount }})</button>
          <button 
            type="button" 
            class="btn btn-sm"
            [ngClass]="psService.filterState().category === 'Hardware' ? 'btn-info text-dark fw-bold' : 'btn-outline-secondary text-light'"
            (click)="psService.setCategory('Hardware')"
          >⚡ HW ({{ stats.hardwareCount }})</button>
        </div>
      </div>

      <!-- Department Dropdown -->
      <div class="mb-3">
        <label class="form-label text-secondary small fw-bold text-uppercase">Department</label>
        <select 
          class="form-select form-select-sm bg-dark text-light border-secondary border-opacity-50"
          [ngModel]="psService.filterState().department"
          (ngModelChange)="psService.setDepartment($event)"
        >
          <option value="All">All Departments</option>
          @for (dept of departments; track dept) {
            <option [value]="dept">{{ dept }}</option>
          }
        </select>
      </div>

      <!-- Theme Dropdown -->
      <div class="mb-3">
        <label class="form-label text-secondary small fw-bold text-uppercase">Theme ({{ themes.length }})</label>
        <select 
          class="form-select form-select-sm bg-dark text-light border-secondary border-opacity-50"
          [ngModel]="psService.filterState().theme"
          (ngModelChange)="psService.setTheme($event)"
        >
          <option value="All">All Themes</option>
          @for (theme of themes; track theme) {
            <option [value]="theme">{{ theme }}</option>
          }
        </select>
      </div>

      <!-- Ministry Dropdown -->
      <div class="mb-3">
        <label class="form-label text-secondary small fw-bold text-uppercase">Ministry / Organization</label>
        <select 
          class="form-select form-select-sm bg-dark text-light border-secondary border-opacity-50"
          [ngModel]="psService.filterState().ministry"
          (ngModelChange)="psService.setMinistry($event)"
        >
          <option value="All">All Ministries & Agencies ({{ ministries.length }})</option>
          @for (org of ministries; track org) {
            <option [value]="org">{{ org }}</option>
          }
        </select>
      </div>

      <!-- Skill Tag Chips -->
      <div class="mb-2">
        <label class="form-label text-secondary small fw-bold text-uppercase">Required Technologies</label>
        <div class="d-flex flex-wrap gap-1">
          @for (skill of popularSkills; track skill) {
            <button 
              type="button" 
              class="btn btn-sm py-1 px-2 rounded-pill font-monospace"
              [ngClass]="psService.filterState().selectedSkills.includes(skill) ? 'btn-info text-dark fw-bold' : 'btn-outline-secondary text-light'"
              (click)="psService.toggleSkill(skill)"
              style="font-size: 0.725rem;"
            >
              {{ skill }}
            </button>
          }
        </div>
      </div>
    </div>
  `
})
export class FilterDrawerComponent {
  psService = inject(PsDataService);

  stats = this.psService.getStatistics();
  themes = this.psService.getAllThemes();
  ministries = this.psService.getAllMinistries();
  departments = this.psService.getAllDepartments();

  popularSkills = [
    'Angular', 'Node.js', 'Python', 'PyTorch', 'Computer Vision', 'YOLO',
    'NLP', 'LLMs / RAG', 'ESP32 / Microcontrollers', 'IoT Sensors', 'LoRaWAN / MQTT',
    'Robotics / ROS2', 'GIS / GeoSpatial', 'Blockchain', 'Cybersecurity', 'PWA'
  ];
}
