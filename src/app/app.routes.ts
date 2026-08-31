import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { PsDataService } from './core/services/ps-data.service';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'SIH 2026 Problem Statements & Skill Navigator | Smart India Hackathon'
  },
  {
    path: 'ps/:id',
    loadComponent: () => import('./pages/ps-detail/ps-detail.component').then(m => m.PsDetailComponent),
    title: (route) => {
      const id = route.paramMap.get('id');
      const psService = inject(PsDataService);
      const item = id ? psService.getProblemStatementById(id) : null;
      return item ? `${item.ps_number}: ${item.title} | SIH 2026 Solution Architecture` : 'Problem Statement Details | SIH 2026';
    }
  },
  {
    path: 'ranked',
    loadComponent: () => import('./pages/ranked/ranked.component').then(m => m.RankedComponent),
    title: 'Top 10 Ranked SIH 2026 Problem Statements | Web Portal Strategy'
  },
  {
    path: 'skills',
    loadComponent: () => import('./pages/skill-guide/skill-guide.component').then(m => m.SkillGuideComponent),
    title: 'Department Skill & Tech Stack Guide | SIH 2026'
  },
  {
    path: 'compare',
    loadComponent: () => import('./pages/compare/compare.component').then(m => m.CompareComponent),
    title: 'Problem Statement Comparison Matrix | SIH 2026'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
