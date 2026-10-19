// TMDB issues two kinds of credential: the short v3 "API Key", sent as an `api_key`
// query parameter, and the longer "API Read Access Token" (a JWT), which must be sent
// as a Bearer token. Accepting both means either one works in .env.
const READ_ACCESS_TOKEN = /^[\w-]+\.[\w-]+\.[\w-]+$/;

/**
 * Puts the credential on a TMDB request: a v3 key is added to `url`, and a read
 * access token is returned as the headers to send with it.
 */
export function applyTmdbCredential(url: URL, key: string): Record<string, string> {
  if (READ_ACCESS_TOKEN.test(key)) {
    return { Authorization: `Bearer ${key}` };
  }
  url.searchParams.set("api_key", key);
  return {};
}
