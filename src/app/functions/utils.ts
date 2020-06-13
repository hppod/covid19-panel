import { CasoFull } from "./../models/caso_full.model"
import { PoPieChartSeries } from '@po-ui/ng-components'

/**
 * Função que recebe um dataset de dados e os acumula, agrupando-os por datas.
 * @param Dataset Recebe o dataset dos dados a serem trabalhados.
 * @param PropertyName Recebe o nome da propriedade que deve ser levada em consideração para realizar o totalizador dos dados.
 */
export function ExtractAccumulatedData(Dataset: CasoFull[], PropertyName: String) {

    let data = Dataset.reduce(function (values, index) {
        let found: boolean = false

        for (let item of values) {
            if (item['date'] == index['date']) {
                item[`${PropertyName}`] += index[`${PropertyName}`]
                found = true
                break;
            }
        }

        if (!found) {
            values.push(index)
        }

        return values
    }, [])

    return data
}

/**
 * Função que recebe um dataset de dados e os totaliza, agrupando-os por datas.
 * @param Dataset Recebe o dataset dos dados a serem trabalhados.
 * @param PropertyName Recebe o nome da propriedade que deve ser levada em consideração para realizar o totalizador dos dados.
 */
export function ExtractNewData(Dataset: CasoFull[], PropertyName: String) {

    switch (PropertyName) {
        case PropertyName = 'new_confirmed':
            return Dataset.reduce((obj, { date, new_confirmed }) => {
                if (!obj[date]) {
                    obj[date] = new Array()
                }
                obj[date].push(new_confirmed)
                return obj
            }, {})
        case PropertyName = 'new_deaths':
            return Dataset.reduce((obj, { date, new_deaths }) => {
                if (!obj[date]) {
                    obj[date] = new Array()
                }
                obj[date].push(new_deaths)
                return obj
            }, {})
    }

}

/**
 * Função que recebe um dataset de dados e totaliza os novos em relação a data do dia anterior
 * @param Dataset Recebe o dataset dos dados a serem trabalhados.
 * @param PropertyName Recebe o nome da propriedade que deve ser levada em consideração para realizar o totalizador dos dados.
 */
export function CalculateNewData(Dataset: CasoFull[], PropertyName: String) {

    switch (PropertyName) {
        case PropertyName = 'new_confirmed':
            let sumNewCases: number = 0
            return Dataset.reduce((obj, { date, new_confirmed }) => {
                if (!obj[date]) {
                    obj[date] = new Array()
                }
                sumNewCases = sumNewCases + new_confirmed
                obj[date].push(sumNewCases)
                return obj
            }, {})
        case PropertyName = 'new_deaths':
            let sumNewDeaths: number = 0
            return Dataset.reduce((obj, { date, new_deaths }) => {
                if (!obj[date]) {
                    obj[date] = new Array()
                }
                sumNewDeaths = sumNewDeaths + new_deaths
                obj[date].push(sumNewDeaths)
                return obj
            }, {})
    }

}

/**
 * Função que agrupa os dados de novos casos ou novas mortes de acordo com a quantidade de registros determinada pelo parâmetro MaxResults
 * @param Dataset Recebe o dataset dos dados a serem trabalhados.
 * @param PropertyName Recebe o nome da propriedade que deve ser levada em consideração para realizar o agrupamento dos dados.
 * @param MaxResults Recebe o valor de resultados máximos que devem ser retornados pela função
 */
export function ExtractNewDataPerState(Dataset: CasoFull[], PropertyName: String, MaxResults: number): Array<PoPieChartSeries> {
    switch (PropertyName) {
        case PropertyName = 'new_confirmed':
            let cases: PoPieChartSeries[] = new Array()
            Dataset.forEach(element => {
                cases.push({
                    category: element['state'],
                    value: element['new_confirmed']
                })
            })
            return cases.sort((a, b) => b.value - a.value).slice(0, MaxResults)
        case PropertyName = 'new_deaths':
            let deaths: PoPieChartSeries[] = new Array()
            Dataset.forEach(element => {
                deaths.push({
                    category: element['state'],
                    value: element['new_deaths']
                })
            })
            return deaths.sort((a, b) => b.value - a.value).slice(0, MaxResults)
    }
}