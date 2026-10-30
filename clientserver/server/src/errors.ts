export class ApiError extends Error {
  constructor(
    public status: number,
    public type: string,
    message: string,
    public data: Record<string, unknown> = {}
  ) { super(message); }
}