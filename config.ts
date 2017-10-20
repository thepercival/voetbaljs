/**
 * Created by coen on 10-10-17.
 */

import { environment } from '../../src/environments/environment';

export class VoetbalConfig {
    static readonly apiurl = environment.apiurl;

    static getToken(): string
    {
        let auth = JSON.parse( localStorage.getItem('auth') );
        if ( auth != null && auth.token != null ) {
            return auth.token;
        }
        return null;
    }
}