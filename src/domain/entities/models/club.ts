export type Club = {
    clubId: string,
    clubName: string,
    cif: string,
    address: string,
    phone: number,
    email: string,
    remark: string,
    micronId: string,
    accountingId: string
    tenantId: string,
    numberOfMachines: number
}

export type ClubApi = { 
    accountingId:string
    address:string
    cif:string
    clubId:string
    email:string
    micronId:string
    name:string
    phone:string
    remark:string
    tenantEntityName:string
    tenantId: string,
    userManagers: string[]
}

export type ClubInfoDisplay = {
    clubId: string
    name: string,
    address: string,
    phone: string,
    tenantEntityName: string,
    machinesCount: number
}

export type ClubOption = {
    clubId: string,
    name: string
}

export type ClubOfTenant = {
    clubId: string,
    name: string,
    address: string,
    phone: string,
    tenantEntityName: string,
    userManagers: string[],
    machinesCount: number
}