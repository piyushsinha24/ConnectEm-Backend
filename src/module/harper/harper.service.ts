import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DBConfig } from 'src/config/db.config';
import { CommonResponse } from 'src/response/common.res';
const harperive = require('harperive').Client;
// import { Client } from 'harperive'

@Injectable()
export class HarperService {
    constructor(
        private readonly dbConfig: ConfigService<DBConfig>,
    ) { }

    private _getClient(): any {
        let client = new harperive({
            harperHost: this.dbConfig.get<string>('DB_HOST'),
            username: this.dbConfig.get<string>('DB_USER'),
            password: this.dbConfig.get<string>('DB_PASS'),
            schema: this.dbConfig.get<string>('DB_NAME'),
        })

        return client
    }

    async getAll(
        table: string,
        allProps: boolean,
        props?: string,
    ): Promise<CommonResponse> {
        let client = this._getClient()
        let dbName = this.dbConfig.get<string>('DB_NAME')

        let query = allProps ?
            `SELECT * FROM ${dbName}.${table}` :
            `SELECT ${props} FROM ${dbName}.${table}`

        let res = await client.query(query)

        return {
            success: res.statusCode === 200,
            data: res.data
        }
    }

    async getOneByID(
        table: string,
        id: string,
        allProps: boolean,
        props?: string,
    ): Promise<CommonResponse> {
        try {
            let client = this._getClient()
            let dbName = this.dbConfig.get<string>('DB_NAME')

            let query = allProps ?
                `SELECT * FROM ${dbName}.${table} WHERE id="${id}"` :
                `SELECT ${props} FROM ${dbName}.${table} WHERE id="${id}"`

            let res = await client.query(query)

            return {
                success: res.statusCode === 200 && res.data.length > 0,
                data: res.data[0],
            }
        } catch (e) {
            console.log(e)
            return {
                success: false,
                data: null,
            }
        }
    }

    async getOneByProperty(
        table: string,
        propName: string,
        propValue: string,
        allProps: boolean,
        props?: string,
    ): Promise<CommonResponse> {
        try {
            let client = this._getClient()
            let dbName = this.dbConfig.get<string>('DB_NAME')

            let query = allProps ?
                `SELECT * FROM ${dbName}.${table} WHERE ${propName}="${propValue}"` :
                `SELECT ${props} FROM ${dbName}.${table} WHERE ${propName}="${propValue}"`

            let res = await client.query(query)

            return {
                success: res.statusCode === 200 && res.data.length > 0,
                data: res.data[0],
            }

        } catch (e) {
            console.log(e)
            return {
                success: false,
                data: null,
            }
        }
    }

    async insertOne(table: string, data: any): Promise<string> {
        let client = this._getClient()

        let res = await client.insert({
            table: table,
            records: [
                {
                    ...data,
                }
            ]
        })

        if (res.statusCode === 200)
            return res.data.inserted_hashes[0]
        else
            throw new HttpException(`Cannot insert`, HttpStatus.BAD_REQUEST)
    }

    async update(
        table: string,
        id: string,
        data: any,
    ): Promise<string> {
        let client = this._getClient()

        let res = await client.update({
            table: table,
            records: [
                {
                    id: id,
                    ...data,
                }
            ]
        })

        if (res.statusCode === 200)
            return res.data.update_hashes[0]
        else
            throw new HttpException('Cannot update', HttpStatus.BAD_REQUEST)
    }
}
