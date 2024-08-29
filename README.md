Here is the documentation for the `UnitOfWorks` class and the `ExecuteUnitOfWorks` function, detailing their purpose, methods, and usage.

---

### `UnitOfWorks` Class

**Purpose**:  
The `UnitOfWorks` class manages a MongoDB session and provides methods to handle transactions, such as starting, committing, and rolling back transactions. It also manages a set of interactors, which are provided during the initialization of the unit of work.

**Type Parameters**:
- `I`: A record type that represents the set of interactors or repositories associated with this unit of work.

**Constructor**:
- `constructor(session: ClientSession, interactors: I)`: Initializes a new instance of `UnitOfWorks` with a MongoDB session and a set of interactors.

**Properties**:
- `session: ClientSession`: The MongoDB session used for transactions.
- `Interactor: I`: The interactors or repositories associated with the unit of work.

**Methods**:
- `async start(): Promise<void>`: Starts a new transaction using the session.
  
- `async commit(): Promise<void>`: Commits the current transaction and ends the session.
  
- `async rollback(): Promise<void>`: Aborts the current transaction and ends the session.
  
- `async end(): Promise<void>`: Ends the session, regardless of whether the transaction was committed or rolled back.
  
- `getSession(): ClientSession`: Returns the current MongoDB session.

**Static Methods**:
- `static async create<I extends Record<string, any>>(interactors: I): Promise<UnitOfWorks<I>>`: Creates a new `UnitOfWorks` instance, starting a new MongoDB session and initializing it with the provided interactors.

---

### `ExecuteUnitOfWorks` Function

**Purpose**:  
The `ExecuteUnitOfWorks` function simplifies the execution of work within a unit of work context, ensuring proper transaction management. It takes a set of interactors and a callback function that performs the transactional work.

**Type Parameters**:
- `I`: A record type that represents the set of interactors or repositories.
- `T`: The type of the result returned from the work function.

**Parameters**:
- `interactors: I`: The set of interactors or repositories to be used within the unit of work.
- `work: (unitOfWork: UnitOfWorks<I>) => Promise<T>`: A callback function that performs the transactional work. It receives an instance of `UnitOfWorks` and returns a promise of type `T`.

**Returns**:
- `Promise<T>`: A promise that resolves to the result of the transactional work.

**Usage**:
```typescript
async function exampleUsage() {
    const result = await ExecuteUnitOfWorks(
        { /* interactors */ },
        async (unitOfWork) => {
            return await unitOfWork.Interactor.SomeMethod(unitOfWork.getSession(), someModel);
        }
    );
}
```

**Error Handling**:
The function catches errors during the execution of the `work` callback:
- If the error is an instance of `BadRequest`, `NotFound`, `AuthorizationError`, or `ValidationError`, it logs the error and returns an appropriate response.
- If the error message includes 'ValidationError', it returns a 400 response with a formatted validation error message.
- For other errors, it logs the error and returns a generic 400 response message indicating an issue with processing the request.

---

### Summary

- **`UnitOfWorks`** manages MongoDB sessions and transactions while handling interactors.
- **`ExecuteUnitOfWorks`** simplifies the execution of transactional work by managing transaction lifecycle and error handling.

This documentation provides a comprehensive overview of how to use the `UnitOfWorks` class and `ExecuteUnitOfWorks` function in your TypeScript Node.js application.
