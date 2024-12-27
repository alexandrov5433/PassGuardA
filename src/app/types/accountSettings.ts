export type AccountSettings = {
    deleteAccAfterNumberFailedLogins: {
        state: boolean,
        numberOfPermitedAttempts: number
    },
}