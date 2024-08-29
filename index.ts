import mongoose, { ClientSession } from 'mongoose';

class UnitOfWorks<I extends Record<string, any>> {

    public session: ClientSession;
    public Interactor: I;

    public constructor(session: ClientSession, interactors: I) {
        this.session = session;
        this.Interactor = interactors;
    }

    async start(): Promise<void> {
        this.session.startTransaction();
    }

    async commit(): Promise<void> {
        await this.session.commitTransaction();
        this.session.endSession();
    }

    async rollback(): Promise<void> {
        await this.session.abortTransaction();
        this.session.endSession();
    }

    static async create<I extends Record<string, any>>(interactors: I): Promise<UnitOfWorks<I>> {
        const newSession = await mongoose.startSession();
        return new UnitOfWorks<I>(newSession, interactors);
    }

    async end(): Promise<void> {
        await this.session.endSession();
    }

    getSession(): ClientSession {
        return this.session;
    }
}

async function ExecuteUnitOfWorks<I extends Record<string, any>, T>(interactors: I, work: (unitOfWork: UnitOfWorks<I>) => Promise<T>): Promise<T> {

    const unitOfWork = await UnitOfWorks.create(interactors);
    let result: T;

    try {

        await unitOfWork.start();
        result = await work(unitOfWork);
        await unitOfWork.commit();

        return result;

    } catch (error: any) {

        await unitOfWork.rollback();
        throw new Error(error);
    }
}
