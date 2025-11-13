import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express, { NextFunction, Request, Response } from 'express';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import baseUrl from './app/utils/baseUrl';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = join(serverDistFolder, '../browser');
const indexHtml = join(serverDistFolder, 'index.server.html'); // Note the corrected filename

const app = express();
const angularApp = new AngularNodeAppEngine();

// Serve static files from /browser
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
);
const getCookie = (cookieHeader: string | undefined, cookieName: string) => {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === cookieName) {
      return value;
    }
  }
  return null;
};
// --- The conflicting app.get('*') block has been removed ---
const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // Obtener el token de las cookies o headers
  const token = getCookie(req.headers.cookie, 'LOGIN_PET_FINDER');

  // Lista de rutas públicas que no requieren autenticación
  const publicRoutes = ['/user'];
  const isPublicRoute = publicRoutes.some((route) => req.url.startsWith(route));

  if (!token) {
    // Para API calls, devolver error 401
    if (req.url.startsWith('/api/')) {
      return res.status(401).json({ error: 'No autorizado' });
    }
    if (req.url.startsWith('/login')) {
      next();
      return;
    }
    // Para rutas de la aplicación, redirigir a login
    return res.redirect('/login');
  }

  try {
    const api = `${baseUrl}/init/token`;

    const response = await fetch(api, {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    // console.log('Esto es la DATA: ', data);

    if (!data?.Pets) {
      return res.redirect('/login');
    }
    if (!isPublicRoute) {
      return res.redirect('/user/account');
    }

    next();
  } catch (error) {
    res.redirect('/login');
  }
};

// Aplicar middleware de autenticación
app.use(authMiddleware);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  console.log(`Processing request for: ${req.url}`); // Optional: for debugging
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    // Removed the 'error' callback parameter for simplicity
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
