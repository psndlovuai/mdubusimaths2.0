export abstract class DomainError extends Error {
  abstract readonly code: string
}

export class BookingNotCancellableError extends DomainError {
  readonly code = 'BOOKING_NOT_CANCELLABLE'
}

export class SessionNotFoundError extends DomainError {
  readonly code = 'SESSION_NOT_FOUND'
}

export class UnauthenticatedError extends DomainError {
  readonly code = 'UNAUTHENTICATED'
}

export class UnauthorisedError extends DomainError {
  readonly code = 'UNAUTHORISED'
}
