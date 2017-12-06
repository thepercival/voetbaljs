/**
 * Created by coen on 26-2-17.
 */

import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Team } from '../team';
import { VoetbalRepository } from '../repository';
import { Association } from 'voetbaljs/association';

@Injectable()
export class TeamRepository extends VoetbalRepository {

    private url: string;
    // private teams: Team[];

    constructor(private http: HttpClient) {
        super();
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'teams';
    }

    // getObject(id: number): Observable<Team> {
    //     const url = this.url + '/' + id;
    //     return this.http.get(url)
    //         // ...and calling .json() on the response to return data
    //         .map((res) => this.jsonToObjectHelper(res))
    //         .catch((error: any) => Observable.throw(error.message || 'Server error'));
    // }

    // getObjects(): Observable<Team[]> {
    //     if (this.objects != null) {
    //         return Observable.create(observer => {
    //             observer.next(this.objects);
    //             observer.complete();
    //         });
    //     }

    //     return this.http.get(this.url, { headers: super.getHeaders() })
    //         .map((res) => {
    //             const objects = this.jsonArrayToObject(res);
    //             this.objects = objects;
    //             return this.objects;
    //         })
    //         .catch(this.handleError);
    // }

    createObject(jsonTeam: ITeam, association: Association): Observable<Team> {

        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('associationid', '' + association.getId())
        };

        return this.http
            .post(this.url, jsonTeam, options)
            .map((res: ITeam) => {
                const teamRes = this.jsonToObjectHelper(res, association);
                return teamRes;
            })
            .catch(this.handleError);
    }

    editObject(team: Team, association: Association): Observable<Team> {

        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('associationid', '' + association.getId())
        };

        return this.http
            .put(this.url + '/' + team.getId(), this.objectToJsonHelper(team), options)
            .map((res: ITeam) => {
                return this.jsonToObjectHelper(res, association, team);
            })
            .catch(this.handleError);
    }

    jsonArrayToObject(jsonArray: Array<ITeam>, association: Association): Team[] {
        const teams: Team[] = [];
        for (const json of jsonArray) {
            const object = this.jsonToObjectHelper(json, association);
            teams.push(object);
        }
        return teams;
    }

    jsonToObjectHelper(json: ITeam, association: Association, team: Team = null): Team {
        if (team == null && json.id != null) {
            team = association.getTeamByName(json.name);
        }
        if (team == null) {
            team = new Team(association, json.name);
        }
        team.setId(json.id);
        team.setAbbreviation(json.abbreviation);
        return team;
    }

    objectToJsonHelper(object: Team): ITeam {
        const json: ITeam = {
            id: object.getId(),
            name: object.getName(),
            abbreviation: object.getAbbreviation(),
        };
        return json;
    }

    // this could also be a private method of the component class
    handleError(res: Response): Observable<any> {
        console.error(res);
        // throw an application level error
        return Observable.throw(res.statusText);
    }
}

export interface ITeam {
    id?: number;
    name: string;
    abbreviation?: string;
}
