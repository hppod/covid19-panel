import { CasoFull } from "./../models/caso_full.model"

/**
 * Função que recebe um dataset de dados e os totaliza, agrupando-os por datas.
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