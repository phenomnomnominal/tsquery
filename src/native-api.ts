import { API } from 'typescript/sync';

// Reuse the client within compound operations such as map -> print -> ast.
// Close it at the outer boundary, so callers need no process cleanup API.
let activeAPI: API | undefined;

export function withAPI<T>(operation: (api: API) => T): T {
  if (activeAPI) return operation(activeAPI);
  const api = new API();
  activeAPI = api;
  try {
    return operation(api);
  } finally {
    activeAPI = undefined;
    api.close();
  }
}
