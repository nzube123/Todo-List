interface ApiSuccess<T> {
  success: true;
  data: T;
}

interface ApiFailure {
  success: false;
  error: { message: string };
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    });
  } catch {
    throw new Error('Could not connect to the server. Check that the API is running.');
  }

  const payload = await response.json() as ApiSuccess<T> | ApiFailure;
  if (!response.ok || !payload.success) {
    throw new Error(payload.success ? 'The request could not be completed.' : payload.error.message);
  }
  return payload.data;
}