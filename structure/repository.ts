/**
 * Created by coen on 3-3-17.
 */

import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Observer } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Competitionseason } from '../competitionseason';
import { RoundRepository } from '../round/repository';
import { Round } from '../round';
import { VoetbalRepository } from '../repository';

@Injectable()
export class StructureRepository extends VoetbalRepository {

    private url: string;
    private structures: Round[] = [];

    constructor(
        private http: HttpClient,
        private roundRepos: RoundRepository) {
        super();
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'structures';
    }

    getObject(competitionseason: Competitionseason): Observable<Round> {
        const foundStructure = this.structures.find(function (structure) {
            return structure.getCompetitionseason() === competitionseason;
        });
        if (foundStructure != null) {
            console.log('getStructureFromCache', foundStructure);
            return Observable.create((observer: Observer<Round>) => {
                observer.next(foundStructure);
                observer.complete();
            });
        }

        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('competitionseasonid', competitionseason.getId())
        };

        return this.http.get<Array<Round>>(this.url, options)
            .map((res) => {
                const jsonRound = res.shift();
                console.log(jsonRound);
                const round = this.roundRepos.jsonToObjectHelper(jsonRound, competitionseason);
                this.structures.push(round);
                return round;
            })
            .catch(this.handleError);
    }

    createObject(round: Round, competitionseason: Competitionseason): Observable<Round> {
        return this.http
            .post(this.url, this.roundRepos.objectToJsonHelper(round), { headers: super.getHeaders() })
            .map((res) => {
                const structure = this.roundRepos.jsonToObjectHelper(res, competitionseason);
                this.structures.push(structure);
                return structure;
            })
            .catch(this.handleError);
    }

    removeObject(object: Round): Observable<void> {
        const url = this.url + '/' + object.getId();
        return this.http
            .delete(url, { headers: super.getHeaders() })
            .map((res: Response) => {

            })
            .catch(this.handleError);
    }

    // this could also be a private method of the component class
    handleError(res: Response): Observable<any> {
        console.error(res);
        // throw an application level error
        return Observable.throw(res.statusText);
    }
}
