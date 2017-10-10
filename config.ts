/**
 * Created by coen on 10-10-17.
 */

import { environment } from '../../src/environments/environment';

export class VoetbalConfig {
    static readonly apiurl = environment.apiurl;

    static getToken(): string
    {
        let user = JSON.parse( localStorage.getItem('user') );
        if ( user != null && user.token != null ) {
            return user.token;
        }
        return null;
    }
}