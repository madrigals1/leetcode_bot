export class NotFoundError extends Error {}

export function handleAPIError(error: Error): null {
  if (error instanceof NotFoundError) {
    return null;
  }

  throw error;
}
