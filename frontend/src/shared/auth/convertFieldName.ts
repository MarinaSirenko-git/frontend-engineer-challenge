export type ConvertFieldNameDirection = 'fromServer' | 'toServer'

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date)
}

function snakeToCamelKey(key: string): string {
  return key.replace(/_([a-z])/g, (_, ch: string) => ch.toUpperCase())
}

function camelToSnakeKey(key: string): string {
  return key.replace(/[A-Z]/g, (ch) => `_${ch.toLowerCase()}`)
}

function mapKey(key: string, direction: ConvertFieldNameDirection): string {
  return direction === 'fromServer' ? snakeToCamelKey(key) : camelToSnakeKey(key)
}

/**
 * Рекурсивно переименовывает ключи plain-object и массивов:
 * `fromServer` — snake_case → camelCase (ответы API),
 * `toServer` — camelCase → snake_case (тела запросов).
 */
export function convertFieldName<T>(input: T, direction: ConvertFieldNameDirection): T {
  if (input === null || typeof input !== 'object') {
    return input
  }
  if (input instanceof Date) {
    return input
  }
  if (Array.isArray(input)) {
    return input.map((item) => convertFieldName(item, direction)) as T
  }
  if (!isPlainObject(input)) {
    return input
  }
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(input)) {
    out[mapKey(key, direction)] = convertFieldName(value, direction)
  }
  return out as T
}
