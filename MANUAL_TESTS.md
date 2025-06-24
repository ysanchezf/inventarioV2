# Manual Deletion Checks

These steps verify that users with related requests or audit logs can be removed without hitting foreign key constraints.

1. Ensure the application is running and a valid admin session is active.
2. Create a user and associate some `Solicitud` and `AuditLog` entries with that user.
3. Issue a `DELETE` request to `/api/admin/users/:id` using the admin session.
4. Confirm the API returns `204 No Content` and the user, requests and logs are removed.

If any `PrismaClientKnownRequestError` occurs, the API will now respond with `409 Conflict`.

