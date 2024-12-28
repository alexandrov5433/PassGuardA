export type AccountSettings = {
    deleteAccAfterNumberFailedLogins: {
        state: boolean,
        numberOfPermittedAttempts: number
    },
    blockAccAfterNumberFailedLogins: {
        state: boolean,
        numberOfPermittedAttempts: number,
        timeForBlockedStateHours: number
    },
}