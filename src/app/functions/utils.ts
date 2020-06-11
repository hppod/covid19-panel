import { CasoFull } from "./../models/caso_full.model"

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