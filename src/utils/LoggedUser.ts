import type {User} from "@/types";
import {store} from "@/lib/localStorage.ts";

const jwt = {
    user: 'MedipharmLoggedUser',
    token: 'jwtMedipharmAccessToken',
    refresh: 'jwtMedipharmRefreshToken'
}

export class LoginUser {
    private static instance : LoginUser | null = null

    private cachedUser: User | null = null
    private cashedToken: string | null = null
    private cashedRefreshToken: string | null = null

    static getInstance() {
        if (LoginUser.instance === null) {
            LoginUser.instance = new LoginUser()
        }
        return LoginUser.instance
    }

    public getUser(): User | null {
        if (this.cachedUser === null) {
            this.cachedUser = store.get<User>(jwt.user)
        }
        return this.cachedUser
    }

    public getToken(): string | null {
        if (this.cashedToken === null) {
            this.cashedToken = store.get<string>(jwt.token)
        }
        return this.cashedToken
    }

    getRefreshToken(): string | null {
        if (this.cashedRefreshToken === null) {
            this.cashedRefreshToken = store.get<string>(jwt.refresh)
        }
        return this.cashedRefreshToken
    }

    public setUser(user: User) {
        store.update<User>(jwt.user, () => user)
    }

    public setToken(token: string) {
        store.update<string>(jwt.token, () => token)
    }

    public setRefreshToken(token: string) {
        store.update<string>(jwt.refresh, () => token)
    }

    public removeUser() {
        store.remove(jwt.user)
    }

    public removeToken() {
        store.remove(jwt.token)
    }

    public removeRefreshToken() {
        store.remove(jwt.refresh)
    }
    public clearCache() {
        this.cachedUser = null
        this.cashedToken = null
        this.cashedRefreshToken = null
    }

}

export const loggedUser = LoginUser.getInstance()