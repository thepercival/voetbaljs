/**
 * Created by coen on 3-3-17.
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PoulePlace } from '../pouleplace';
import { Poule } from '../poule';
import { TeamRepository, ITeam } from '../team/repository';
import { Observable, Observer } from 'rxjs/Rx';
import { VoetbalRepository } from '../repository';

@Injectable()
export class PoulePlaceRepository extends VoetbalRepository {

    private url: string;

    constructor(
        private http: HttpClient,
        private teamRepos: TeamRepository) {
        super();
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'pouleplaces';
    }

    editObject(poulePlace: PoulePlace, poule: Poule): Observable<PoulePlace> {

        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('pouleid', poule.getId().toString())
        };

        return this.http
            .put(this.url + '/' + poulePlace.getId(), this.objectToJsonHelper(poulePlace), options)
            .map((res: IPoulePlace) => {
                return this.jsonToObjectHelper(res, poulePlace.getPoule(), poulePlace);
            })
            .catch(this.handleError);
    }

    handleError(res: Response): Observable<any> {
        console.error(res);
        // throw an application level error
        return Observable.throw(res.statusText);
    }

    jsonArrayToObject(jsonArray: any, poule: Poule): PoulePlace[] {
        const objects: PoulePlace[] = [];
        for (const json of jsonArray) {
            const object = this.jsonToObjectHelper(json, poule);
            objects.push(object);
        }
        return objects;
    }

    jsonToObjectHelper(json: IPoulePlace, poule: Poule, poulePlace: PoulePlace = null): PoulePlace {
        if (poulePlace == null) {
            poulePlace = new PoulePlace(poule, json.number);
        }
        poulePlace.setId(json.id);
        poule.setName(json.name);
        if (json.team) {
            poulePlace.setTeam(this.teamRepos.jsonToObjectHelper(json.team, poule.getCompetitionseason().getAssociation()));
        }
        return poulePlace;
    }

    objectsToJsonArray(objects: PoulePlace[]): IPoulePlace[] {
        const jsonArray: IPoulePlace[] = [];
        for (const object of objects) {
            jsonArray.push(this.objectToJsonHelper(object));
        }
        return jsonArray;
    }

    objectToJsonHelper(object: PoulePlace): IPoulePlace {
        return {
            id: object.getId(),
            number: object.getNumber(),
            name: object.getName(),
            team: object.getTeam() ? this.teamRepos.objectToJsonHelper(object.getTeam()) : null
        };
    }
}

export interface IPoulePlace {
    id?: number;
    number: number;
    name: string;
    team?: ITeam;
}
