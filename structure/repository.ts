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
    private cache: Round[] = [];

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
        const foundStructure = this.findObject(competitionseason);
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
                this.updateCache(round, competitionseason);
                return round;
            })
            .catch(this.handleError);
    }

    createObject(round: Round, competitionseason: Competitionseason): Observable<Round> {

        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('competitionseasonid', competitionseason.getId())
        };

        console.log('posted', this.roundRepos.objectToJsonHelper(round));

        return this.http
            .post(this.url, this.roundRepos.objectToJsonHelper(round), options)
            .map((res) => {
                console.log(res);
                const roundOut = this.roundRepos.jsonToObjectHelper(res, competitionseason);
                this.updateCache(roundOut, competitionseason);
                return roundOut;
            })
            .catch(this.handleError);
    }

    editObject(round: Round, competitionseason: Competitionseason): Observable<Round> {

        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('competitionseasonid', competitionseason.getId())
        };

        console.log('puted', this.roundRepos.objectToJsonHelper(round));

        return this.http
            .put(this.url + '/' + round.getId(), this.roundRepos.objectToJsonHelper(round), options)
            .map((res) => {
                console.log(res);
                const roundOut = this.roundRepos.jsonToObjectHelper(res, competitionseason);
                this.updateCache(roundOut, competitionseason);
                return roundOut;
            })
            .catch(this.handleError);
    }

    removeObject(round: Round): Observable<void> {
        const url = this.url + '/' + round.getId();
        return this.http
            .delete(url, { headers: super.getHeaders() })
            .map((res: Response) => {
                this.removeFromCache(round, round.getCompetitionseason());
            })
            .catch(this.handleError);
    }

    private findObject(competitionseason: Competitionseason) {
        return this.cache.find(round => round.getCompetitionseason() === competitionseason);
    }

    private updateCache(round: Round, competitionseason: Competitionseason) {
        this.removeFromCache(round, competitionseason);
        this.cache.push(round);
    }

    private removeFromCache(structure: Round, competitionseason: Competitionseason) {
        const foundRound = this.findObject(competitionseason);
        if (foundRound != null) {
            const index = this.cache.indexOf(foundRound);
            if (index > -1) {
                this.cache.splice(index, 1);
            }
        }
    }

    // this could also be a private method of the component class
    handleError(res: Response): Observable<any> {
        console.error(res);
        // throw an application level error
        return Observable.throw(res.statusText);
    }
}
