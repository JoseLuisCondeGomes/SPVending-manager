import { TenantRepository } from "../../../domain/ports/TenantRepository";
import { PotentialTenant, Tenant, TenantApi } from "../../../domain/entities/models/tenant";
import { BASE_URL_SERVER, API_PREFIX, PATH_PREFIX } from "../../../utilities/defines/api/api-routes";
import { mapTenantCLubsFromApi } from "../../mappers/FromApi/TenantMapper";
import { mapTenantToApi } from "../../mappers/ToApi/TenantMapperToApi";
import { ClubOfTenant } from "../../../domain/entities/models/club";
import { TenantApiResponse } from "../../../domain/entities/api-models/apiResponse";
import { DEMO_MODE } from "../../../utilities/defines/demo";
import {
    addDemoTenant,
    deleteDemoTenant,
    findDemoTenant,
    getDemoPotentialTenants,
    getDemoTenantClubs,
    getDemoTenantList,
    modifyDemoTenant
} from "../../demo/demoStore";

export class TenantRepositoryHttp implements TenantRepository {
    private BASEURL = BASE_URL_SERVER + API_PREFIX + PATH_PREFIX.tenantPath;

    async findTenantByUuid(tenantUuid: string): Promise<TenantApi | null> {
        if (DEMO_MODE) return findDemoTenant(tenantUuid);

        const response = await fetch(`${this.BASEURL}/${tenantUuid}`, {credentials: "include"});    
        return await response.json();
    }

    async getAllTenants(page:number): Promise<TenantApiResponse> {
        if (DEMO_MODE) return getDemoTenantList();

        const response = await fetch(`${this.BASEURL}?page=${page}`,{credentials:"include"});
        if (response.ok) {
            const json = await response.json();
            return json;
        }
        if (response.status === 401) throw new Error(`${response.status}`);
        if (response.status === 404){return {content:[],page:{number:0,size:0,totalElements:0,totalPages:0}};}

        throw new Error(`Error fetching tenants: ${response.statusText}`);
    }

    async addTenant(tenant: Omit<Tenant, "tenantId" | "numberOfClubs">): Promise<void> {
        if (DEMO_MODE) return addDemoTenant(tenant);

        const body = mapTenantToApi(tenant);
        const response = await fetch(
            this.BASEURL,
            {
                method: "POST",
                body: JSON.stringify(body),
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            }
        );
        return response.json();
    }

    async modifyTenant(tenant: Omit<Tenant, "numberOfClubs">): Promise<void> {
        if (DEMO_MODE) return modifyDemoTenant(tenant);

        const body = mapTenantToApi(tenant);
        const response = await fetch(
            this.BASEURL+`/${tenant.tenantId}`,
            {
                method: "PUT",
                body: JSON.stringify(body),
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            }
        );
        return response.json();
    }

    async deleteTenant(uuid: string): Promise<void> {
        if (DEMO_MODE) return deleteDemoTenant(uuid);

        const response = await fetch(
            `${this.BASEURL}/${uuid}`,
            {
                method: "DELETE",
                credentials: "include"
            }
        );
        return response.json();
    }

    async getPotentialTenants(): Promise<PotentialTenant[]> {
        if (DEMO_MODE) return getDemoPotentialTenants();

        const response = await fetch(`${this.BASEURL}/${PATH_PREFIX.potentialTenants}`,{credentials: "include"});
        return response.json();
    }

    async getTenantClubs( tenantUuid : string ) : Promise<ClubOfTenant[]> {
        if (DEMO_MODE) return getDemoTenantClubs(tenantUuid);

        const response = await fetch(`${this.BASEURL}/${tenantUuid}/clubs`,{credentials: "include"});
        const json = await response.json();
        return mapTenantCLubsFromApi(json);
    }
}