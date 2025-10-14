import { inject } from '@angular/core';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { PetServices } from './core/services/pets.service';
import { ActivatedRoute } from '@angular/router';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'modifyReport/:id',
    renderMode: RenderMode.Server,
  },
];
