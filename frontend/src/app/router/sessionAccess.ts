/**
 * Проверка наличия сессии. На следующем этапе свяжем с sessionStore (Pinia + storage).
 */
import { pinia } from '../pinia'
import { useSessionStore } from '../../stores/sessionStore'

export function hasAccessToken(): boolean {
  const sessionStore = useSessionStore(pinia)
  return sessionStore.isAuthenticated
}
