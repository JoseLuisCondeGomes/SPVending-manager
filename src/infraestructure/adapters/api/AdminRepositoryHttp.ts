import { Admin, AdminApi } from "../../../domain/entities/models/admin";
import { AdminRepository } from "../../../domain/ports/AdminRepository";
import { API_PREFIX, BASE_URL_SERVER, PATH_PREFIX } from "../../../utilities/defines/api/api-routes";
import { DEMO_ADMIN, DEMO_CREDENTIALS, DEMO_MODE } from "../../../utilities/defines/demo";

export class AdminRepositoryHttp implements AdminRepository {
    private BASEURL = BASE_URL_SERVER + API_PREFIX + PATH_PREFIX.loginPage;

    async logAdmin(user: Omit<Admin, "id" | "roles">): Promise<AdminApi | string> {
        if (DEMO_MODE) {
            const usernameMatches = user.username.trim() === DEMO_CREDENTIALS.username;
            const passwordMatches = user.password === DEMO_CREDENTIALS.password;
            if (!usernameMatches || !passwordMatches) {
                throw new Error("The password is incorrect");
            }
            return DEMO_ADMIN;
        }

        const response = await fetch(
            `${this.BASEURL}`,
            {
                method: "POST",
                body: JSON.stringify(user),
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            }
        );
        const data = await response.json();
        if (!response.ok) {
            if (data.password) throw new Error("The password must have at least 8 characters"); 
            throw new Error("Error the password is incorrect");
        }
        return data;
    }

    async logOut(): Promise<boolean> {
        if (DEMO_MODE) return true;

        const URL = BASE_URL_SERVER + API_PREFIX + PATH_PREFIX.logOutPage
        const response = await fetch(URL, {
            method: "POST",
            credentials: "include"
        });
        if (response.ok) return true;   
        return false
    }

    async refreshAccessToken(): Promise<AdminApi | null> {
        if (DEMO_MODE) return DEMO_ADMIN;

        const URL = BASE_URL_SERVER + API_PREFIX + PATH_PREFIX.refreshToken;
        const response = await fetch(
            URL, {
                method: "POST",
                credentials: "include"
            });
        return response.json();
    }
}