export type Tenant = {
	tenantId: string,
	tenantName: string,
	cif: string,
	address: string,
	phone: number,
	email: string,
	remark: string,
	micronId: string
	numberOfClubs: number
}

export type TenantApi = {
    tenantId: string,
    name: string,
    cif: string,
    address: string,
    phone:string,
    email: string,
    remark: string,
    micronId: string,
    managers: string[]
}

export type TenantInfoDisplay = {
	tenantId: string;
	name: string;
	cif: string;
	phone: string;
	email: string;
	clubsCount: number;
}

export type PotentialTenant = {
	tenantId: string,
	name: string
}